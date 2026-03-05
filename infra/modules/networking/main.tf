locals {
  name = "${var.project_name}-${var.environment}"
}

# ── SSH Key ───────────────────────────────────────────────────────────────────
# The public key is read from the root variables and passed in via the droplet module.
# We reference it by name here so multiple droplets can reuse it.
data "digitalocean_ssh_key" "main" {
  name = local.name
}

# ── Reserved IP ───────────────────────────────────────────────────────────────
resource "digitalocean_reserved_ip" "main" {
  region = "nyc3"
}

# ── Firewall ──────────────────────────────────────────────────────────────────
resource "digitalocean_firewall" "main" {
  name = "${local.name}-fw"

  # HTTP
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # HTTPS
  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # SSH — restrict to your IP in production (replace 0.0.0.0/0)
  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  # Allow all outbound
  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "icmp"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}
