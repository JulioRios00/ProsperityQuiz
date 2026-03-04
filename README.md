# Quiz Funnel C1 - "Do Bloqueio ao Calendário"

Interactive quiz funnel SaaS for astrology/prosperity subscription service.

## Tech Stack

- **Backend:** Python 3.11 + Flask + SQLAlchemy
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Architecture:** Clean Architecture
- **Containerization:** Docker + Docker Compose

## Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local frontend development)
- Python 3.11+ (for local backend development)

## Quick Start

### 1. Clone and Setup

```bash
# Copy environment variables
cp .env.example .env

# Edit .env with your actual values (at minimum, change the passwords)
nano .env
```

### 2. Run with Docker Compose

```bash
# Start all services
docker-compose up -d

# Check services status
docker-compose ps

# View logs
docker-compose logs -f
```

### 3. Initialize Database

```bash
# Run migrations
docker-compose exec backend flask db upgrade

# (Optional) Seed database with sample data
docker-compose exec backend python scripts/seed_data.py
```

### 4. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Docs:** http://localhost:5000/api/docs

## Development

### Backend Development

```bash
# Enter backend container
docker-compose exec backend bash

# Run tests
pytest

# Create new migration
flask db migrate -m "description"

# Apply migration
flask db upgrade
```

### Frontend Development

```bash
# Enter frontend container
docker-compose exec frontend sh

# Run tests
npm test

# Build for production
npm run build
```

### Running Locally (without Docker)

See `scripts/run-local.sh` for local development setup.

## Project Structure

```
├── backend/          # Flask backend (Clean Architecture)
├── frontend/         # React frontend
├── nginx/            # Nginx configuration
├── scripts/          # Utility scripts
└── docker-compose.yml
```

## Available Scripts

- `./scripts/setup-dev.sh` - Initial development setup
- `./scripts/run-local.sh` - Run locally without Docker
- `./scripts/run-tests.sh` - Run all tests
- `./scripts/backup-db.sh` - Backup database

## Environment Variables

See `.env.example` for all available environment variables.

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License

Proprietary - All rights reserved
