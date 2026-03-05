# ── DigitalOcean ────────────────────────────────────────────────────────────
variable "do_token" {
  description = "DigitalOcean personal access token"
  type        = string
  sensitive   = true
}

variable "region" {
  description = "DigitalOcean region (nyc3 is closest to Brazil)"
  type        = string
  default     = "nyc3"
}

# ── Project ─────────────────────────────────────────────────────────────────
variable "project_name" {
  description = "Name used to tag and name all resources"
  type        = string
  default     = "quiz-funnel"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"

  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Must be development, staging, or production."
  }
}

# ── Server ───────────────────────────────────────────────────────────────────
variable "droplet_size" {
  description = "Droplet size slug — s-1vcpu-1gb = $6/mo (minimum)"
  type        = string
  default     = "s-1vcpu-1gb"
}

variable "ssh_public_key" {
  description = "SSH public key content (e.g. contents of ~/.ssh/id_ed25519.pub)"
  type        = string
}

# ── App ──────────────────────────────────────────────────────────────────────
variable "github_repo" {
  description = "GitHub repository in owner/repo format"
  type        = string
  default     = "your-user/Pedro"
}

variable "domain_name" {
  description = "Domain name (leave empty to use the reserved IP only)"
  type        = string
  default     = ""
}

# ── Secrets ──────────────────────────────────────────────────────────────────
variable "secret_key" {
  description = "Flask SECRET_KEY"
  type        = string
  sensitive   = true
}

variable "jwt_secret_key" {
  description = "Flask JWT_SECRET_KEY"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "PostgreSQL password"
  type        = string
  sensitive   = true
}
