FROM node:20-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Development stage
FROM base AS development
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# Build stage — accepts VITE_API_URL so the bundle points to the right API
FROM base AS builder
ARG VITE_API_URL=/api/v1
ARG DASHBOARD_LOGIN_CODE=
ARG DASHBOARD_LOGIN_USER=
ARG DASHBOARD_LOGIN_PASS=
RUN VITE_API_URL="$VITE_API_URL" \
	VITE_ANALYTICS_DASHBOARD_KEY="$DASHBOARD_LOGIN_CODE" \
	VITE_ANALYTICS_DASHBOARD_USER="$DASHBOARD_LOGIN_USER" \
	VITE_ANALYTICS_DASHBOARD_PASSWORD="$DASHBOARD_LOGIN_PASS" \
	npm run build

# Production stage
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
