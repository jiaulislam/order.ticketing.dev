FROM node:24-alpine AS base
WORKDIR /app

# Install dependencies only for production
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Set env
ENV KAFKAJS_NO_PARTITIONER_WARNING=1

# Use non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 4002

# Healthcheck (optional, adjust endpoint as needed)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4002/api/orders/health || exit 1

CMD ["npm", "start"]