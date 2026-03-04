#!/bin/bash

# Quiz Funnel - Run Locally Script (Docker Compose)

set -e

echo "🚀 Starting Quiz Funnel..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Run: ./scripts/setup-dev.sh first"
    exit 1
fi

# Start all services
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Run database migrations
echo "📊 Running database migrations..."
docker-compose exec -T backend flask db upgrade || {
    echo "⚠️  Migration failed. This might be the first run."
    echo "Creating initial migration..."
    docker-compose exec -T backend flask db init || echo "Migration folder already exists"
    docker-compose exec -T backend flask db migrate -m "Initial migration"
    docker-compose exec -T backend flask db upgrade
}

echo ""
echo "✅ Quiz Funnel is running!"
echo ""
echo "🌐 Access points:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:5000"
echo "   Backend Health: http://localhost:5000/health"
echo "   API v1 Health: http://localhost:5000/api/v1/health"
echo ""
echo "📊 Database:"
echo "   PostgreSQL: localhost:5432"
echo "   Database: quiz_funnel"
echo "   User: quiz_user"
echo ""
echo "📦 Redis:"
echo "   Redis: localhost:6379"
echo ""
echo "🛠️  Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop: docker-compose down"
echo "   Restart: docker-compose restart"
echo "   Shell (backend): docker-compose exec backend bash"
echo "   Shell (frontend): docker-compose exec frontend sh"
