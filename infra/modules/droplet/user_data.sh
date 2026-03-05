#!/bin/bash
set -euo pipefail
exec > /var/log/user-data.log 2>&1

echo "=== Quiz Funnel — Server Bootstrap ==="
echo "Started at: $(date)"

# ── System update ─────────────────────────────────────────────────────────────
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y
apt-get install -y git curl ufw fail2ban

# ── Docker ────────────────────────────────────────────────────────────────────
curl -fsSL https://get.docker.com | sh
apt-get install -y docker-compose-plugin

systemctl enable docker
systemctl start docker

# ── Basic firewall (ufw) ─────────────────────────────────────────────────────
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# ── App directory ─────────────────────────────────────────────────────────────
mkdir -p /opt/quiz-funnel
cd /opt/quiz-funnel

# ── Clone repository ──────────────────────────────────────────────────────────
git clone https://github.com/${github_repo}.git . || git pull

# ── Write production .env ─────────────────────────────────────────────────────
# NOTE: Terraform writes secrets via templatefile; they never appear in logs.
cat > /opt/quiz-funnel/.env << 'ENVEOF'
FLASK_ENV=production
DB_PASSWORD=${db_password}
SECRET_KEY=${secret_key}
JWT_SECRET_KEY=${jwt_secret_key}
CORS_ORIGINS=https://${domain_name},http://${domain_name}
ENVEOF

chmod 600 /opt/quiz-funnel/.env

# ── Start services ────────────────────────────────────────────────────────────
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

echo "=== Bootstrap complete at $(date) ==="
