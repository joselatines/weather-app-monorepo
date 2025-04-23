# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx (commented for now)
# FROM nginx:stable-alpine
# COPY --from=builder /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# Stage 2: Serve using Vite preview (development)
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including vite
RUN npm install

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose Vite preview port
EXPOSE 4173

# Run Vite preview server
CMD ["npm", "run", "preview", "--", "--host"]
