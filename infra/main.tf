locals {
  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# ── DigitalOcean Project (groups all resources in the DO dashboard) ──────────
resource "digitalocean_project" "main" {
  name        = "${var.project_name}-${var.environment}"
  description = "Quiz Funnel C1 — ${var.environment}"
  purpose     = "Web Application"
  environment = title(var.environment)
}

# ── Networking: SSH key, Firewall, Reserved IP ───────────────────────────────
module "networking" {
  source       = "./modules/networking"
  project_name = var.project_name
  environment  = var.environment
}

# ── Droplet: server + bootstrap ──────────────────────────────────────────────
module "droplet" {
  source         = "./modules/droplet"
  project_name   = var.project_name
  environment    = var.environment
  region         = var.region
  size           = var.droplet_size
  ssh_key_id     = module.networking.ssh_key_id
  firewall_id    = module.networking.firewall_id
  reserved_ip    = module.networking.reserved_ip
  github_repo    = var.github_repo
  domain_name    = var.domain_name
  secret_key     = var.secret_key
  jwt_secret_key = var.jwt_secret_key
  db_password    = var.db_password
}

# ── Assign all resources to the DO Project ───────────────────────────────────
resource "digitalocean_project_resources" "main" {
  project = digitalocean_project.main.id
  resources = [
    module.droplet.droplet_urn,
    module.networking.reserved_ip_urn,
  ]
}

# ── DNS (optional — only created when domain_name is set) ────────────────────
resource "digitalocean_domain" "main" {
  count = var.domain_name != "" ? 1 : 0
  name  = var.domain_name
}

resource "digitalocean_record" "root" {
  count  = var.domain_name != "" ? 1 : 0
  domain = digitalocean_domain.main[0].id
  type   = "A"
  name   = "@"
  value  = module.networking.reserved_ip
  ttl    = 300
}

resource "digitalocean_record" "www" {
  count  = var.domain_name != "" ? 1 : 0
  domain = digitalocean_domain.main[0].id
  type   = "A"
  name   = "www"
  value  = module.networking.reserved_ip
  ttl    = 300
}
