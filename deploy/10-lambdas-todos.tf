
# get lambdas
data "archive_file" "get_issues_zip" {
  type        = "zip"
  source_file = "lambdas/getIssues.js"
  output_path = "lambdas/getIssues.zip"
}

data "archive_file" "get_comments_zip" {
  type        = "zip"
  source_file = "lambdas/getComments.js"
  output_path = "lambdas/getComments.zip"
}

data "archive_file" "get_likes_zip" {
  type        = "zip"
  source_file = "lambdas/getLikes.js"
  output_path = "lambdas/getLikes.zip"
}

# Create lambdas
data "archive_file" "create_issue_zip" {
  type        = "zip"
  source_file = "lambdas/createIssue.js"
  output_path = "lambdas/createIssue.zip"
}

data "archive_file" "create_comment_zip" {
  type        = "zip"
  source_file = "lambdas/createComment.js"
  output_path = "lambdas/createComment.zip"
}

data "archive_file" "create_like_zip" {
  type        = "zip"
  source_file = "lambdas/createLike.js"
  output_path = "lambdas/createLike.zip"
}

# Delete lambdas
data "archive_file" "delete_comment_by_id_zip" {
  type        = "zip"
  source_file = "lambdas/deleteCommentById.js"
  output_path = "lambdas/deleteCommentById.zip"
}

data "archive_file" "delete_like_by_id_zip" {
  type        = "zip"
  source_file = "lambdas/deleteLikeById.js"
  output_path = "lambdas/deleteLikeById.zip"
}

data "archive_file" "delete_issue_by_id_zip" {
  type        = "zip"
  source_file = "lambdas/deleteIssueById.js"
  output_path = "lambdas/deleteIssueById.zip"
}

# Update lambda

data "archive_file" "update_issue_by_id_zip" {
  type        = "zip"
  source_file = "lambdas/updateIssueById.js"
  output_path = "lambdas/updateIssueById.zip"
}

# Resources

resource "aws_lambda_function" "get_issues" {
  function_name    = "GetIssues"
  filename         = data.archive_file.get_issues_zip.output_path
  source_code_hash = data.archive_file.get_issues_zip.output_base64sha256
  handler          = "getIssues.handler"
  runtime          = "nodejs14.x"
  role             = aws_iam_role.lambda_exec.arn
}

# get issue by ID lambda
data "archive_file" "get_issue_by_id_zip" {
  type        = "zip"
  source_file = "lambdas/getIssueById.js"
  output_path = "lambdas/getIssueById.zip"
}

resource "aws_lambda_function" "get_issue_by_id" {
  function_name    = "GetIssueById"
  filename         = data.archive_file.get_issue_by_id_zip.output_path
  source_code_hash = data.archive_file.get_issue_by_id_zip.output_base64sha256
  handler          = "getIssueById.handler"
  runtime          = "nodejs14.x"
  role             = aws_iam_role.lambda_exec.arn
}

resource "aws_lambda_function" "update_issue_by_id" {
  function_name = "UpdateIssueById"
  filename      = "lambdas/updateIssueById.zip"
  handler       = "updateIssueById.handler"
  runtime       = "nodejs14.x"
  role          = aws_iam_role.lambda_exec.arn
}

resource "aws_lambda_function" "delete_issue_by_id" {
  function_name = "DeleteIssueById"
  filename      = "lambdas/deleteIssueById.zip"
  handler       = "deleteIssueById.handler"
  runtime       = "nodejs14.x"
  role          = aws_iam_role.lambda_exec.arn
}

resource "aws_lambda_function" "create_issue" {
  function_name = "CreateIssue"
  filename      = "lambdas/createIssue.zip"
  handler       = "createIssue.handler"
  runtime       = "nodejs14.x"
  role          = aws_iam_role.lambda_exec.arn
}

resource "aws_lambda_function" "create_comment" {
  function_name = "CreateComment"
  filename      = "lambdas/createComment.zip"
  handler       = "createComment.handler"
  runtime       = "nodejs14.x"
  role          = aws_iam_role.lambda_exec.arn
}

resource "aws_lambda_function" "get_comments" {
  function_name = "GetComments"
  filename      = "lambdas/getComments.zip"
  handler       = "getComments.handler"
  runtime       = "nodejs14.x"
  role          = aws_iam_role.lambda_exec.arn
}

resource "aws_lambda_function" "delete_comment_by_id" {
  function_name = "DeleteCommentById"
  filename      = "lambdas/deleteCommentById.zip"
  handler       = "deleteCommentById.handler"
  runtime       = "nodejs14.x"
  role          = aws_iam_role.lambda_exec.arn
}

resource "aws_lambda_function" "create_like" {
  function_name = "CreateLike"
  filename      = "lambdas/createLike.zip"
  handler       = "createLike.handler"
  runtime       = "nodejs14.x"
  role          = aws_iam_role.lambda_exec.arn
}

resource "aws_lambda_function" "get_likes" {
  function_name = "GetLikes"
  filename      = "lambdas/getLikes.zip"
  handler       = "getLikes.handler"
  runtime       = "nodejs14.x"
  role          = aws_iam_role.lambda_exec.arn
}

resource "aws_lambda_function" "delete_like_by_id" {
  function_name = "DeleteLikeById"
  filename      = "lambdas/deleteLikeById.zip"
  handler       = "deleteLikeById.handler"
  runtime       = "nodejs14.x"
  role          = aws_iam_role.lambda_exec.arn
}

# IAM role which dictates what other AWS services the Lambda function
# may access.
resource "aws_iam_role" "lambda_exec" {
  name = "serverless_example_lambda"

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

resource "aws_iam_role_policy_attachment" "basicExecution" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_exec.id
}

resource "aws_iam_role_policy" "sqspolicy" {
  name = "sqs_policy"
  role       = aws_iam_role.lambda_exec.id
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "sqs:*"
            ],
            "Resource": [
                "arn:aws:sqs:us-east-1:*:*"
            ],
            "Effect": "Allow"
        }
    ]
}
EOF
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "lambda_policy"
  role = aws_iam_role.lambda_exec.id
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ListAndDescribe",
            "Effect": "Allow",
            "Action": [
                "dynamodb:List*",
                "dynamodb:DescribeReservedCapacity*",
                "dynamodb:DescribeLimits",
                "dynamodb:DescribeTimeToLive"
            ],
            "Resource": "*"
        },
        {
            "Sid": "SpecificTable",
            "Effect": "Allow",
            "Action": [
                "dynamodb:BatchGet*",
                "dynamodb:DescribeStream",
                "dynamodb:DescribeTable",
                "dynamodb:Get*",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:BatchWrite*",
                "dynamodb:CreateTable",
                "dynamodb:Delete*",
                "dynamodb:Update*",
                "dynamodb:PutItem"
            ],
            "Resource": [
              "${aws_dynamodb_table.issues.arn}*",
              "${aws_dynamodb_table.comments.arn}*",
              "${aws_dynamodb_table.likes.arn}*"
            ]
        }
    ]
}
EOF
}