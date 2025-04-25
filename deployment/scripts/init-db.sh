#!/bin/bash

# Wait for Postgres to be ready
echo "Waiting for PostgreSQL to start..."
until PGPASSWORD=postgres psql -h db -U postgres -c '\q'; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - executing migrations"

# Run Alembic migrations
cd /app
alembic upgrade head

echo "Database initialization completed"
