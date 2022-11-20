
# SQS processer lambda
data "archive_file" "read_streams_zip" {
  type        = "zip"
  source_file = "lambdas/readStreams.js"
  output_path = "lambdas/readStreams.zip"
}

resource "aws_lambda_function" "read_streams" {
  function_name    = "ReadStreams"
  filename         = data.archive_file.read_streams_zip.output_path
  source_code_hash = data.archive_file.read_streams_zip.output_base64sha256
  handler          = "readStreams.handler"
  runtime          = "nodejs16.x"
  role             = aws_iam_role.read_streams_role.arn

}

resource "aws_iam_role" "read_streams_lambda" {
  name               = "${var.app_name}-read-streams-role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_event_source_mapping" "read_streams_mapping" {
  event_source_arn  = aws_dynamodb_table.todos.stream_arn
  function_name     = aws_lambda_function.read_streams.arn
  starting_position = "LATEST"
}

resource "aws_iam_role" "read_streams_role" {
  name               = "read_streams_role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": "LambdaAssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "dynamodb_read_log_policy" {
  name   = "lambda-dynamodb-log-policy"
  role   = aws_iam_role.read_streams_role.id
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
        "Action": [ "logs:*" ],
        "Effect": "Allow",
        "Resource": [ "arn:aws:logs:*:*:*" ]
    },
    {
        "Action": [ "dynamodb:BatchGetItem",
                    "dynamodb:GetItem",
                    "dynamodb:GetRecords",
                    "dynamodb:Scan", 
                    "dynamodb:Query",
                    "dynamodb:GetShardIterator",
                    "dynamodb:DescribeStream",
                    "dynamodb:ListStreams" ],
        "Effect": "Allow",
        "Resource": [
          "${aws_dynamodb_table.todos.arn}",
          "${aws_dynamodb_table.todos.arn}/*"
        ]
    }
  ]
}
EOF
}