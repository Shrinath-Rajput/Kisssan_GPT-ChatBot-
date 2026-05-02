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
COPY proxy-server.js ./
COPY src ./src
COPY components ./components
COPY services ./services

# Build frontend
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment variables
ENV PORT=3000
# Backend configuration - can be set via Railway variables
# For local: BACKEND_HOST=localhost BACKEND_PORT=8080
# For production: VITE_API_URL=https://backend-service.up.railway.app
ENV VITE_API_URL=""
ENV BACKEND_HOST="localhost"
ENV BACKEND_PORT="8080"

# Run proxy server
CMD ["npm", "run", "proxy"]
