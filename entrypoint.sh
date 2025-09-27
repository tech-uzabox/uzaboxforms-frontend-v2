#!/bin/sh
echo "Replacing environment variables in env-config.js"

for var in BACKEND_URL; do
  eval value=\$$var
  sed -i "s|REPLACE_${var}|$value|g" /usr/share/nginx/html/env-config.js
done

exec "$@"
