#!/bin/sh
set -e

APP_DIR=/var/www/html

echo "──────────────────────────────────────────"
echo " Laravel Monitoring API — Starting up"
echo "──────────────────────────────────────────"

# Ensure storage directories exist with correct permissions
mkdir -p \
    "$APP_DIR/storage/logs" \
    "$APP_DIR/storage/framework/cache/data" \
    "$APP_DIR/storage/framework/sessions" \
    "$APP_DIR/storage/framework/views" \
    "$APP_DIR/bootstrap/cache"

chown -R www-data:www-data "$APP_DIR/storage" "$APP_DIR/bootstrap/cache"
chmod -R 775 "$APP_DIR/storage" "$APP_DIR/bootstrap/cache"

# Run database migrations
echo "[1/4] Running migrations..."
php "$APP_DIR/artisan" migrate --force --no-interaction

# Cache configuration for production
echo "[2/4] Caching config & routes..."
php "$APP_DIR/artisan" config:cache
php "$APP_DIR/artisan" route:cache
php "$APP_DIR/artisan" event:cache

# Link storage (if not already linked)
echo "[3/4] Setting up storage link..."
php "$APP_DIR/artisan" storage:link --force 2>/dev/null || true

echo "[4/4] Starting services (nginx, php-fpm, queue, scheduler, reverb)..."
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
