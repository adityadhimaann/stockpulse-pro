# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the API
RUN npm run api:build

# Expose port
EXPOSE 3001

# Start the API server
CMD ["npm", "start"]
