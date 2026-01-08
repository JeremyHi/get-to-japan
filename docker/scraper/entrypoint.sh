#!/bin/bash

set -e

echo "Starting Get to Japan Scraper Service..."

# Start Redis in the background
echo "Starting Redis server..."
redis-server /etc/redis/redis.conf &

# Wait for Redis to be ready
echo "Waiting for Redis to be ready..."
for i in {1..30}; do
  if redis-cli ping > /dev/null 2>&1; then
    echo "Redis is ready!"
    break
  fi
  echo "Waiting for Redis... ($i/30)"
  sleep 1
done

# Check if Redis started successfully
if ! redis-cli ping > /dev/null 2>&1; then
  echo "ERROR: Redis failed to start"
  exit 1
fi

# Start the Node.js scraper service
echo "Starting scraper service..."
exec node src/index.js
