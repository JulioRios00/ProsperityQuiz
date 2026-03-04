#!/bin/bash

# Quiz Funnel - Development Setup Script

set -e

echo "🚀 Setting up Quiz Funnel development environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Copy .env.example to .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your configuration before continuing!"
    exit 0
fi

# Build and start Docker containers
echo "🐳 Building Docker containers..."
docker-compose build

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your configuration"
echo "2. Run: docker-compose up -d"
echo "3. Run: docker-compose exec backend flask db upgrade"
echo "4. Open http://localhost:5173 in your browser"
