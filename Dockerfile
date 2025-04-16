# Stage 1: Build the React application
FROM node:23-slim AS builder

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_KEY

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_KEY=$VITE_SUPABASE_KEY

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy all source files
COPY . .

# Build the React app
RUN pnpm build

# Stage 2: Serve the built app with Nginx
FROM nginx:1.27-alpine-slim

# Set the project name
ENV PROJECT_NAME=hotel_iot_afdd_frontend

# Copy nginx configuration
COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built app from builder stage
COPY --from=builder /app/dist /etc/nginx/html/
COPY --from=builder /app/dist /usr/share/nginx/html/

# Set permissions and health check
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid && \
    chown -R nginx:nginx /var/cache/nginx

# Switch to non-root user
USER nginx

# Expose port 80 (HTTP)
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]