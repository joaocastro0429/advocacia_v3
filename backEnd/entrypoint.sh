#!/bin/sh
set -e

echo "DATABASE_URL configurada?"
echo ${DATABASE_URL:+SIM}

echo "Aplicando schema..."
npx prisma db push

echo "Iniciando aplicação..."
exec "$@"
