# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files from frontend directory
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source code
COPY frontend/ .

# Accept build arguments for environment variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

