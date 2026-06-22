#!/bin/sh
set -e

echo "Applying database migrations..."
npx prisma migrate deploy
echo "Migrations applied successfully."

echo "Starting the application..."
exec "$@"
