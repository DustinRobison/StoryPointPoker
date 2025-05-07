# Stage 1: Build SvelteKit app
FROM node:20-alpine AS builder
WORKDIR /app

# Define build arguments for public environment variables
ARG PUBLIC_POCKETBASE_URL
ARG PUBLIC_POCKETBASE_ADMIN
ENV PUBLIC_POCKETBASE_URL=$PUBLIC_POCKETBASE_URL
ENV PUBLIC_POCKETBASE_ADMIN=$PUBLIC_POCKETBASE_ADMIN

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 3: Final image
FROM node:20-alpine
WORKDIR /app

# Install dependencies for SvelteKit runtime
COPY package.json package-lock.json ./
RUN npm install --production

# Copy SvelteKit build
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules

# Expose ports (SvelteKit: 3000)
EXPOSE 3000

# Start SvelteKit
CMD ["node", "build"]