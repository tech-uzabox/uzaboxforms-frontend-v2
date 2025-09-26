#!/bin/sh
# Replace placeholders in env-config.js with container env vars
echo "Replacing environment variables in env-config.js"
for var in BACKEND_URL; do
  sed -i "s|REPLACE_ME|${!var}|g" /usr/share/nginx/html/env-config.js
done

exec "$@"
