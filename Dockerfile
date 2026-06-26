FROM php:8.3-fpm

# ──────────────────────────────────────────────
# System dependencies
# ──────────────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
        nginx \
        supervisor \
        git \
        curl \
        zip \
        unzip \
        libpng-dev \
        libonig-dev \
        libxml2-dev \
        libzip-dev \
        libcurl4-openssl-dev \
        pkg-config \
        libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# ──────────────────────────────────────────────
# PHP extensions
# ──────────────────────────────────────────────
RUN docker-php-ext-install \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        opcache \
        sockets \
        curl

# OPcache tuning for production
RUN echo "opcache.enable=1\n\
opcache.memory_consumption=256\n\
opcache.interned_strings_buffer=16\n\
opcache.max_accelerated_files=20000\n\
opcache.revalidate_freq=0\n\
opcache.validate_timestamps=0\n\
opcache.fast_shutdown=1" > /usr/local/etc/php/conf.d/opcache.ini

# PHP settings
RUN echo "upload_max_filesize=50M\n\
post_max_size=50M\n\
memory_limit=256M\n\
max_execution_time=60\n\
expose_php=Off" > /usr/local/etc/php/conf.d/custom.ini

# ──────────────────────────────────────────────
# Composer
# ──────────────────────────────────────────────
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ──────────────────────────────────────────────
# Application
# ──────────────────────────────────────────────
WORKDIR /var/www/html

# Install dependencies first (layer cache)
COPY composer.json composer.lock ./
RUN composer install \
        --no-dev \
        --no-interaction \
        --no-scripts \
        --prefer-dist \
        --optimize-autoloader

# Copy application code
COPY . .

# Post-install
RUN composer dump-autoload --optimize \
    && php artisan package:discover --ansi

# Storage permissions
RUN mkdir -p storage/logs storage/framework/{cache,sessions,views} bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# ──────────────────────────────────────────────
# Nginx
# ──────────────────────────────────────────────
COPY docker/nginx.conf /etc/nginx/sites-available/default
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default \
    && rm -f /etc/nginx/sites-enabled/default.bak

# ──────────────────────────────────────────────
# Supervisor
# ──────────────────────────────────────────────
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# ──────────────────────────────────────────────
# Entrypoint
# ──────────────────────────────────────────────
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -sf http://localhost/up || exit 1

ENTRYPOINT ["/entrypoint.sh"]
