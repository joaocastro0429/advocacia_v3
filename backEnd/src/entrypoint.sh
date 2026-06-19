#!/bin/sh

echo "Applying database migrations..."

npx prisma migrate deploy

echo "Migrations applied successfully."

echo "Starting the application..."

exec "$@"
