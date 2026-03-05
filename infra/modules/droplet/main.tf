locals {
  name = "${var.project_name}-${var.environment}"
}

resource "digitalocean_droplet" "main" {
  name   = local.name
  region = var.region
  size   = var.size
  image  = "ubuntu-22-04-x64"

  ssh_keys  = [var.ssh_key_id]
  user_data = templatefile("${path.module}/user_data.sh", {
    github_repo    = var.github_repo
    domain_name    = var.domain_name
    secret_key     = var.secret_key
    jwt_secret_key = var.jwt_secret_key
    db_password    = var.db_password
  })

  tags = [var.project_name, var.environment, "managed-by-terraform"]
}

# Assign the reserved IP to the droplet
resource "digitalocean_reserved_ip_assignment" "main" {
  ip_address = var.reserved_ip
  droplet_id = digitalocean_droplet.main.id
}

# Attach the firewall
resource "digitalocean_firewall" "assignment" {
  name       = "${local.name}-attach"
  droplet_ids = [digitalocean_droplet.main.id]
}
