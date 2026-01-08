# Build stage
FROM node:22-bookworm AS builder

WORKDIR /app

# Copy package files
COPY backend/package.json backend/package-lock.json* ./

# Install dependencies (including native modules)
RUN npm install

# Copy source files
COPY backend/ .

# Production stage
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install required system dependencies for better-sqlite3
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs gettojapan

# Create data directory
RUN mkdir -p /data && chown gettojapan:nodejs /data

# Copy built files from builder
COPY --from=builder --chown=gettojapan:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=gettojapan:nodejs /app/src ./src
COPY --from=builder --chown=gettojapan:nodejs /app/package.json ./

USER gettojapan

EXPOSE 3000

ENV PORT=3000
ENV DATABASE_PATH=/data/data.db

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "src/index.js"]
