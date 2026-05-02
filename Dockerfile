FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY index.html ./
COPY types.ts ./
COPY proxy-server.js ./
COPY src ./src
COPY components ./components
COPY services ./services

# Set build-time environment variables (can be overridden during docker build)
# These are embedded in the built frontend
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

# Build frontend with environment variables
RUN npm run build

# Expose port
EXPOSE 3000

# Set runtime environment variables for proxy server
ENV PORT=3000
# Backend configuration - can be set via Railway variables
# For local: BACKEND_HOST=localhost BACKEND_PORT=8080
# For production: VITE_API_URL=https://backend-service.up.railway.app
ENV BACKEND_HOST="localhost"
ENV BACKEND_PORT="8080"

# Run proxy server
CMD ["npm", "run", "proxy"]
