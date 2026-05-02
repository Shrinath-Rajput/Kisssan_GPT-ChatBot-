FROM node:20-alpine

WORKDIR /app

# Copy backend package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy backend code
COPY server.js ./
COPY routes ./routes
COPY services ./services
COPY utils ./utils

# Expose port
EXPOSE 8080

# Set environment
ENV PORT=8080
ENV NODE_ENV=production

# Start backend
CMD ["npm", "start"]
