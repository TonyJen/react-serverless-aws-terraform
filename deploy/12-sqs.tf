resource "aws_sqs_queue" "app_queue" {
  name                      = "${var.app_name}-queue"
  delay_seconds             = 0
  max_message_size          = 262144
  message_retention_seconds = 86400
  receive_wait_time_seconds = 0
  sqs_managed_sse_enabled = true

  tags = {
    Environment = var.environment
  }
}