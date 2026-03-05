output "droplet_ip" {
  description = "Reserved IP address of the server"
  value       = module.networking.reserved_ip
}

output "droplet_id" {
  description = "Droplet ID"
  value       = module.droplet.droplet_id
}

output "ssh_command" {
  description = "SSH command to access the server"
  value       = "ssh root@${module.networking.reserved_ip}"
}

output "api_url" {
  description = "Backend API base URL"
  value       = var.domain_name != "" ? "https://${var.domain_name}/api/v1" : "http://${module.networking.reserved_ip}/api/v1"
}

output "app_url" {
  description = "Application URL"
  value       = var.domain_name != "" ? "https://${var.domain_name}" : "http://${module.networking.reserved_ip}"
}
