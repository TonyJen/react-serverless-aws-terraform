// TODO setup terraform version 
terraform {
  required_providers {
    aws = {
      version = "~> 3.72.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

provider "aws" {
  alias  = "acm_provider"
  region = "us-east-1"
}

terraform {
  backend "s3" {
    bucket = "react-app-tf-state"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}
data "aws_caller_identity" "current" {}