# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./
# install dependencies
RUn npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application for production
# Ensure you have "output: 'standalone'" in your next.config.js for optimal Docker builds
RUN npm run build

# Stage 2: Create the production-ready image
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Set Node.js environment to production
ENV NODE_ENV production

# Copy only the necessary files from the builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose the port Next.js runs on (default is 3000)
EXPOSE 3000

# Command to start the Next.js application
CMD ["node", "server.js"]