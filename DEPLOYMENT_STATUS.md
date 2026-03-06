# Deployment Status

## Current State: IN PROGRESS — blocked on GitHub push protection

---

## What's Done

### Phase 1 — Infrastructure
- Terraform for DigitalOcean: droplet, reserved IP, firewall, SSH key
- Droplet live at: `http://129.212.134.248`
- SSH: `ssh root@129.212.134.248`
- Droplet size: `s-1vcpu-1gb` ($6/mo)
- All Terraform files in `infra/`

### Phase 2 — Production Docker Compose
- `docker-compose.prod.yml`: Redis + backend (gunicorn) + frontend + nginx
- Removed local PostgreSQL container — switched to Neon external DB
- `DATABASE_URL` now read from `.env` on server
- `nginx/nginx.conf`: reverse proxy `/api/` → backend:5000, `/` → frontend:80
- `frontend/nginx.conf`: SPA config (try_files + static asset caching)
- `frontend/Dockerfile`: fixed to copy nginx.conf to `conf.d/default.conf` (not main nginx.conf)

### Phase 3 — Database
- Neon (free tier, PostgreSQL 16) configured
- Connection string set as `DATABASE_URL` in `/opt/quiz-funnel/.env` on the server

### Phase 4 — Backend
- Full Clean Architecture implemented (domain, application, infrastructure, presentation)
- 16-step quiz, diagnosis generation, JWT auth, all endpoints live

### Phase 5 — Frontend
- Full quiz flow: 16 steps, Zustand store, all step components
- FotoRenata.jpg as Vite asset (reliable loading)
- Prelanding with astral SVG decorations

---

## Blocked: GitHub Push Protection

The `.history/` folder (VS Code Local History extension) has copies of `terraform.tfvars`
containing old DO tokens. GitHub is blocking every push.

**The old tokens were already revoked in DigitalOcean dashboard.**

### Fix (run on local machine):
```bash
git filter-repo --path .history/ --invert-paths --force
git push --set-upstream origin main --force
```

If `.history/` still exists locally:
```bash
rm -rf .history/
```

After push succeeds, on the server:
```bash
cd /opt/quiz-funnel
git pull
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
```

---

## Pending After Push

1. Verify all containers start: `docker compose -f docker-compose.prod.yml ps`
2. Run DB migrations: `docker exec quiz-funnel-backend flask db upgrade`
3. Test the app at `http://129.212.134.248`
4. Check backend logs: `docker logs quiz-funnel-backend`

---

## Server .env Template

File lives at `/opt/quiz-funnel/.env` on the droplet. Must contain:

```
FLASK_ENV=production
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=require
SECRET_KEY=...
JWT_SECRET_KEY=...
CORS_ORIGINS=http://129.212.134.248
```

---

## Known Issues Fixed This Session
- `hashicorp/digitalocean` provider error → added `required_providers` to each module
- SSH key `no key found` error → changed from `data` source to `resource`
- Empty firewall rule error → moved firewall to `root main.tf` with `droplet_ids`
- `github_repo` had full URL instead of `owner/repo` format
- Frontend nginx crash → was copying server block to main nginx.conf instead of conf.d
- `.history/` files committed with real DO tokens → use filter-repo to clean
