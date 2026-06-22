#!/bin/sh
set -e

echo "===== PRISMA START ====="

npx prisma migrate deploy

echo "===== PRISMA OK ====="

exec "$@"
