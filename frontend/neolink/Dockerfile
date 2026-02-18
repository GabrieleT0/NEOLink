# React Vite Production Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy app files
COPY . .

# Build arguments for API URLs
ARG VITE_API_URL
ARG VITE_DISCOURSE_URL
ARG VITE_ORH_URL
ARG VITE_SHIBBOLETH_ENABLED
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_DISCOURSE_URL=$VITE_DISCOURSE_URL
ENV VITE_ORH_URL=$VITE_ORH_URL
ENV VITE_SHIBBOLETH_ENABLED=$VITE_SHIBBOLETH_ENABLED

# Build the React app
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]