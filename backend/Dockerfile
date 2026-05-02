FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci

# Copy backend code
COPY backend/server.js ./
COPY backend/routes ./routes
COPY backend/services ./services
COPY backend/utils ./utils

# Expose port
EXPOSE 8080

# Set environment
ENV PORT=8080
ENV NODE_ENV=production

# Start backend
CMD ["npm", "start"]
