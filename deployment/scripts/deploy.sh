#!/bin/bash

# Build and push Docker images
echo "Building Docker images..."
docker-compose build

# Start services
echo "Starting services..."
docker-compose up -d

# Initialize database
echo "Initializing database..."
docker-compose exec backend bash -c "/app/deployment/scripts/init-db.sh"

echo "Deployment completed successfully"
