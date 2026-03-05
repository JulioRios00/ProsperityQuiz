# Remote state stored in DigitalOcean Spaces (S3-compatible).
# Uncomment after creating a Spaces bucket named "quiz-funnel-tfstate".
#
# terraform {
#   backend "s3" {
#     endpoint = "https://${var.region}.digitaloceanspaces.com"
#     bucket   = "quiz-funnel-tfstate"
#     key      = "production/terraform.tfstate"
#     region   = "us-east-1" # required by s3 backend, unused by DO Spaces
#
#     skip_credentials_validation = true
#     skip_metadata_api_check     = true
#     skip_region_validation      = true
#     force_path_style            = true
#
#     # Set via env vars:
#     #   AWS_ACCESS_KEY_ID     = DO Spaces access key
#     #   AWS_SECRET_ACCESS_KEY = DO Spaces secret key
#   }
# }
