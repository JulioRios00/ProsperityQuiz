# 🚀 Quick Start Guide - Quiz Funnel C1

Get the Quiz Funnel running locally in under 5 minutes!

## Prerequisites

Make sure you have installed:
- **Docker Desktop** (https://www.docker.com/products/docker-desktop/)
- **Git** (should already be installed)

That's it! Docker will handle everything else.

## Option 1: Automatic Setup (Recommended)

### Step 1: Run the Setup Script

```bash
./scripts/run-local.sh
```

This script will:
- ✅ Start all Docker containers (PostgreSQL, Redis, Backend, Frontend)
- ✅ Run database migrations automatically
- ✅ Display all access URLs

### Step 2: Access the Application

Once the script completes, open your browser:

**Frontend (Quiz Interface):**
```
http://localhost:5173
```

**Backend API:**
```
http://localhost:5000
```

**Health Checks:**
```
http://localhost:5000/health
http://localhost:5000/api/v1/health
```

---

## Option 2: Manual Setup

If you prefer to run commands manually:

### Step 1: Start Docker Containers

```bash
docker-compose up -d
```

### Step 2: Wait for Database (5 seconds)

```bash
sleep 5
```

### Step 3: Run Database Migrations

```bash
# If first time running:
docker-compose exec backend flask db init
docker-compose exec backend flask db migrate -m "Initial migration"
docker-compose exec backend flask db upgrade

# If migrations already exist:
docker-compose exec backend flask db upgrade
```

### Step 4: Verify Everything is Running

```bash
docker-compose ps
```

You should see:
- ✅ quiz-funnel-db (PostgreSQL)
- ✅ quiz-funnel-redis (Redis)
- ✅ quiz-funnel-backend (Flask API)
- ✅ quiz-funnel-frontend (React App)

---

## 🎯 What You'll See

### Frontend (http://localhost:5173)

You'll see the prelanding page with:
- ✨ Gold and cream color scheme
- 📝 Main headline: "Descubra o Bloqueio Invisível que Trava sua Prosperidade"
- 🔘 "Descobrir meu bloqueio" button

### Backend API (http://localhost:5000/health)

JSON response:
```json
{
  "status": "healthy",
  "service": "quiz-funnel-backend",
  "version": "1.0.0"
}
```

---

## 🛠️ Useful Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Stop Everything

```bash
docker-compose down
```

### Access Container Shells

```bash
# Backend (Python/Flask)
docker-compose exec backend bash

# Frontend (Node/React)
docker-compose exec frontend sh

# Database (PostgreSQL)
docker-compose exec db psql -U quiz_user -d quiz_funnel
```

### Database Operations

```bash
# Create new migration
docker-compose exec backend flask db migrate -m "description"

# Apply migrations
docker-compose exec backend flask db upgrade

# Rollback migration
docker-compose exec backend flask db downgrade

# View migration history
docker-compose exec backend flask db history
```

---

## 📁 Project Structure

```
quiz-funnel/
├── backend/              # Python Flask API
│   ├── src/
│   │   ├── domain/       # Business logic
│   │   ├── application/  # Use cases
│   │   ├── infrastructure/ # Database, external services
│   │   └── presentation/ # API routes, schemas
│   └── migrations/       # Database migrations
├── frontend/             # React + TypeScript
│   └── src/
│       ├── pages/        # Page components
│       ├── components/   # Reusable components
│       ├── store/        # State management
│       └── services/     # API clients
├── scripts/              # Utility scripts
└── docker-compose.yml    # Docker orchestration
```

---

## 🗄️ Database Access

### Connect to PostgreSQL

**Credentials:**
- Host: `localhost`
- Port: `5432`
- Database: `quiz_funnel`
- User: `quiz_user`
- Password: Check `.env` file (`DB_PASSWORD`)

**Using command line:**
```bash
docker-compose exec db psql -U quiz_user -d quiz_funnel
```

**Using a GUI tool (DBeaver, pgAdmin, etc.):**
- Connection URL: `postgresql://quiz_user:password@localhost:5432/quiz_funnel`

---

## 🔧 Troubleshooting

### Port Already in Use

If you get "port already allocated" errors:

```bash
# Check what's using the port
lsof -i :5173  # Frontend
lsof -i :5000  # Backend
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Kill the process or change ports in docker-compose.yml
```

### Database Connection Failed

```bash
# Restart database
docker-compose restart db

# Check database logs
docker-compose logs db

# Verify database is healthy
docker-compose ps db
```

### Frontend Not Loading

```bash
# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend

# Check frontend logs
docker-compose logs -f frontend
```

### Backend API Errors

```bash
# Check backend logs
docker-compose logs -f backend

# Restart backend
docker-compose restart backend

# Access backend shell to debug
docker-compose exec backend bash
python -c "from src.app import create_app; app = create_app(); print('App works!')"
```

---

## 🔄 Resetting Everything

If you want to start fresh:

```bash
# Stop and remove all containers, volumes, networks
docker-compose down -v

# Remove all data (WARNING: Deletes database!)
docker-compose down -v --remove-orphans

# Rebuild everything
docker-compose build --no-cache

# Start fresh
./scripts/run-local.sh
```

---

## 📊 Database Schema

The following tables are automatically created:

- `users` - User accounts
- `quiz_sessions` - Quiz progress and responses
- `diagnoses` - Generated diagnoses
- `email_captures` - Email leads
- `subscriptions` - User subscriptions
- `payment_events` - Payment transactions
- `analytics_events` - Tracking events

View the schema:
```bash
docker-compose exec db psql -U quiz_user -d quiz_funnel -c "\d+"
```

---

## 🚦 Next Steps

Now that you have the infrastructure running:

1. **Explore the API:**
   - Visit: http://localhost:5000/api/v1/health
   - Test endpoints with Postman or curl

2. **Explore the Frontend:**
   - Visit: http://localhost:5173
   - Check browser console for any errors

3. **Make Changes:**
   - Edit files in `backend/src/` or `frontend/src/`
   - Changes auto-reload (hot reload enabled)

4. **Add Features:**
   - Follow `QUIZ_IMPLEMENTATION_PLAN_v2.md` for Phase 2

---

## 📞 Need Help?

- Check logs: `docker-compose logs -f`
- Verify services: `docker-compose ps`
- Restart: `docker-compose restart`
- Full reset: `docker-compose down -v && ./scripts/run-local.sh`

**Happy coding! 🎉**
