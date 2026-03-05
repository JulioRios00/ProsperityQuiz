terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
    }
  }
}

locals {
  name = "${var.project_name}-${var.environment}"
}

# ── SSH Key ───────────────────────────────────────────────────────────────────
resource "digitalocean_ssh_key" "main" {
  name       = local.name
  public_key = var.ssh_public_key
}

# ── Reserved IP ───────────────────────────────────────────────────────────────
resource "digitalocean_reserved_ip" "main" {
  region = "nyc3"
}

