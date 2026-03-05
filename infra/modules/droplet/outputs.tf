output "droplet_id" {
  value = digitalocean_droplet.main.id
}

output "droplet_urn" {
  value = digitalocean_droplet.main.urn
}

output "droplet_ip" {
  value = digitalocean_droplet.main.ipv4_address
}
