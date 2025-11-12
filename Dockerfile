# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package*.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code (including TypeScript files)
COPY . .

# Build TypeScript to JavaScript (generate dist/ folder)
RUN npm run build

# Create logs directory
RUN mkdir -p logs

# Remove node_modules to reduce image size (optional - for production)
# RUN npm prune --production

# Expose port 3000
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (res) => {if (res.statusCode !== 200) throw new Error(res.statusCode)})"

# Start the application (runs compiled JavaScript from dist/)
CMD ["npm", "start"]