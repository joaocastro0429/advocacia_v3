#!/bin/sh
set -e

# BACKEND_UPSTREAM must be provided as an env var (e.g. https://my-backend.onrender.com)
: "${BACKEND_UPSTREAM:=http://backend:10000}"

# Substitute variables in the nginx template and write the final config
envsubst '$BACKEND_UPSTREAM' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx in foreground
nginx -g 'daemon off;'
