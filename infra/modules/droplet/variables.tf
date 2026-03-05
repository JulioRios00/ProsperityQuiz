variable "project_name" { type = string }
variable "environment"  { type = string }
variable "region"       { type = string }
variable "size"         { type = string }
variable "ssh_key_id"   { type = string }
variable "reserved_ip"  { type = string }
variable "github_repo"  { type = string }
variable "domain_name"  { type = string }

variable "secret_key" {
  type      = string
  sensitive = true
}
variable "jwt_secret_key" {
  type      = string
  sensitive = true
}
variable "db_password" {
  type      = string
  sensitive = true
}
