
resource "aws_s3_bucket" "www_bucket" {
  bucket = "www.${var.bucket_name}"
  cors_rule {
    allowed_headers = ["Authorization", "Content-Length"]
    allowed_methods = ["GET", "POST"]
    allowed_origins = ["https://www.${var.domain_name}"]
    max_age_seconds = 3000
  }

  tags = var.common_tags
}

resource "aws_s3_bucket_website_configuration" "www_bucket_website_configuration" {
  bucket = aws_s3_bucket.www_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }

}

resource "aws_s3_bucket_ownership_controls" "www_bucket_ownership_controls" {
  bucket = aws_s3_bucket.www_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "www_bucket_public_access_block" {
  bucket = aws_s3_bucket.www_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "www_bucket_acl" {
  depends_on = [
    aws_s3_bucket_ownership_controls.www_bucket_ownership_controls,
    aws_s3_bucket_public_access_block.www_bucket_public_access_block,
  ]

  bucket = aws_s3_bucket.www_bucket.id
  acl    = "public-read"
}

resource "aws_s3_bucket_policy" "www_bucket_bucket" {
    bucket = aws_s3_bucket.www_bucket.id
    policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Principal = "*"
        Action = [
          "s3:*",
        ]
        Effect = "Allow"
        Resource = [
          "${aws_s3_bucket.www_bucket.arn}",
          "${aws_s3_bucket.www_bucket.arn}/*"
        ]
      },
      {
        Sid = "PublicReadGetObject"
        Principal = "*"
        Action = [
          "s3:GetObject",
        ]
        Effect   = "Allow"
        Resource = [
          "${aws_s3_bucket.www_bucket.arn}",
          "${aws_s3_bucket.www_bucket.arn}/*"
        ]
      },
    ]
  })
  
  depends_on = [aws_s3_bucket_public_access_block.www_bucket_public_access_block]
}

# S3 bucket for redirecting non-www to www.
resource "aws_s3_bucket" "root_bucket" {
  bucket = var.bucket_name
  
  tags = var.common_tags
}

resource "aws_s3_bucket_website_configuration" "root_bucket_website_configuration" {
  bucket = aws_s3_bucket.root_bucket.id

  redirect_all_requests_to {
    host_name = "www.${var.domain_name}"
    protocol  = "https"
  }

}


resource "aws_s3_bucket_ownership_controls" "root_bucket_ownership_controls" {
  bucket = aws_s3_bucket.root_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "root_bucket_public_access_block" {
  bucket = aws_s3_bucket.root_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "root_bucket_acl" {
  depends_on = [
    aws_s3_bucket_ownership_controls.root_bucket_ownership_controls,
    aws_s3_bucket_public_access_block.root_bucket_public_access_block,
  ]

  bucket = aws_s3_bucket.root_bucket.id
  acl    = "public-read"
}

resource "aws_s3_bucket_policy" "root_bucket_bucket" {
    bucket = aws_s3_bucket.root_bucket.id
    policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Principal = "*"
        Action = [
          "s3:*",
        ]
        Effect = "Allow"
        Resource = [
          "${aws_s3_bucket.root_bucket.arn}",
          "${aws_s3_bucket.root_bucket.arn}/*"
        ]
      },
      {
        Sid = "PublicReadGetObject"
        Principal = "*"
        Action = [
          "s3:GetObject",
        ]
        Effect   = "Allow"
        Resource = [
          "${aws_s3_bucket.root_bucket.arn}",
          "${aws_s3_bucket.root_bucket.arn}/*"
        ]
      },
    ]
  })
  
  depends_on = [aws_s3_bucket_public_access_block.root_bucket_public_access_block]
}



# resource "aws_s3_bucket_policy" "this" {
#   bucket = aws_s3_bucket.www_bucket.id
#   policy = <<POLICY
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Sid": "PublicReadGetObject",
#       "Effect": "Allow",
#       "Principal": "*",
#       "Action": "s3:GetObject",
#       "Resource": [
#         "${aws_s3_bucket.www_bucket.arn}/*"
#       ]
#     }
#   ]
# }

# POLICY
# }