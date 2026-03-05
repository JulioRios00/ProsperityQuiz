output "ssh_key_id" {
  value = data.digitalocean_ssh_key.main.id
}

output "firewall_id" {
  value = digitalocean_firewall.main.id
}

output "reserved_ip" {
  value = digitalocean_reserved_ip.main.ip_address
}

output "reserved_ip_urn" {
  value = digitalocean_reserved_ip.main.urn
}
