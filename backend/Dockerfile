# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies first
RUN npm ci --only=production

# Copy source files
COPY . .

# Install all dependencies including devDependencies
RUN npm install

# Build the TypeScript code
RUN npm run build

# Prune devDependencies
RUN npm prune --production

# Stage 2: Run the application
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 5000

# Run the application
CMD ["node", "dist/src/index.js"]
