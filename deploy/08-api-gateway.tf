resource "aws_api_gateway_rest_api" "app" {
  name        = "${var.app_name}-api"
  description = "React Serverless App API"
  body        = data.template_file.api_definition.rendered

}

data "template_file" "api_definition" {
  template = file("api/openapi.yaml")
  vars = {
    lambda_uri_get_issues            = aws_lambda_function.get_issues.invoke_arn
    lambda_uri_create_issue          = aws_lambda_function.create_issue.invoke_arn
    lambda_uri_get_issue_by_id       = aws_lambda_function.get_issue_by_id.invoke_arn
    lambda_uri_update_issue_by_id    = aws_lambda_function.update_issue_by_id.invoke_arn
    lambda_uri_delete_issue_by_id    = aws_lambda_function.delete_issue_by_id.invoke_arn
    lambda_uri_create_comment       = aws_lambda_function.create_comment.invoke_arn
    lambda_uri_get_comments         = aws_lambda_function.get_comments.invoke_arn
    lambda_uri_delete_comment_by_id = aws_lambda_function.delete_comment_by_id.invoke_arn
    lambda_uri_create_like          = aws_lambda_function.create_like.invoke_arn
    lambda_uri_get_likes            = aws_lambda_function.get_likes.invoke_arn
    lambda_uri_delete_like_by_id    = aws_lambda_function.delete_like_by_id.invoke_arn
    apig_invocation_uri             = "arn:aws:apigateway:${var.default_region}:sqs:path/${data.aws_caller_identity.current.account_id}/${aws_sqs_queue.app_queue.name}"
    apig_sqs_send_msg_role          = aws_iam_role.apig_sqs_send_msg.arn
  }
}

resource "aws_api_gateway_deployment" "app" {
  depends_on = [
    aws_api_gateway_rest_api.app
  ]
  rest_api_id = aws_api_gateway_rest_api.app.id
  stage_name  = var.environment
}