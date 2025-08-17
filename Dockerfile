FROM node:24-alpine AS base

WORKDIR /app

# Update npm to latest version
RUN npm install -g npm@latest

# Install dependencies only for production
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Set env
ENV KAFKAJS_NO_PARTITIONER_WARNING=1



# Use non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# Fix permissions for node_modules
RUN chown -R appuser:appgroup /app/node_modules

USER appuser

EXPOSE 4002

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm start"]
