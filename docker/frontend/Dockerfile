# Build stage
FROM node:22-bookworm AS builder

WORKDIR /app

# Copy package files
COPY frontend/package.json frontend/package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source files
COPY frontend/ .

# Build the application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 gettojapan

# Copy built files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=gettojapan:nodejs /app/.next/standalone ./
COPY --from=builder --chown=gettojapan:nodejs /app/.next/static ./.next/static

USER gettojapan

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Health check (use 127.0.0.1 to avoid IPv6 resolution issues)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3001/ || exit 1

CMD ["node", "server.js"]
