# Scraper service with Redis and Playwright
FROM node:22-bookworm

WORKDIR /app

# Install Redis and required dependencies
RUN apt-get update && apt-get install -y \
    redis-server \
    curl \
    # Playwright dependencies
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs gettojapan

# Copy package files
COPY scraper/package.json scraper/package-lock.json* ./

# Install dependencies
RUN npm install

# Install Playwright browsers
RUN npx playwright install chromium

# Copy source files
COPY scraper/src ./src

# Create data directory for Redis
RUN mkdir -p /data && chown gettojapan:nodejs /data

# Copy Redis configuration
COPY docker/scraper/redis.conf /etc/redis/redis.conf

# Copy entrypoint script
COPY docker/scraper/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 6379

ENV REDIS_PORT=6379
ENV SCRAPE_INTERVAL_HOURS=4

# Health check for Redis
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD redis-cli ping || exit 1

ENTRYPOINT ["/entrypoint.sh"]
