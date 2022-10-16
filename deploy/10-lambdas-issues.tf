
# Update lambda

data "archive_file" "update_issue_by_id_zip" {
  type        = "zip"
  source_file = "lambdas/updateIssueById.js"
  output_path = "lambdas/updateIssueById.zip"
}

# Resources

resource "aws_lambda_function" "update_issueby_id" {
  function_name = "UpdateIssueById"
  filename      = "lambdas/updateIssueById.zip"
  handler       = "updateIssueById.handler"
  runtime       = "nodejs16.x"
  role          = aws_iam_role.lambda_exec.arn
}
