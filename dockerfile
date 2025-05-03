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

# Stage 2: Download PocketBase
FROM alpine:latest AS pocketbase
ARG PB_VERSION=0.27.2
RUN apk add --no-cache unzip ca-certificates
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# Stage 3: Final image
FROM node:20-alpine
WORKDIR /app

# Install dependencies for SvelteKit runtime
COPY package.json package-lock.json ./
RUN npm install --production

# Copy SvelteKit build
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules

# Copy PocketBase binary
COPY --from=pocketbase /pb/pocketbase /pb/pocketbase

# Create directory for PocketBase data (will be mounted as a volume)
RUN mkdir -p /pb/pb_data

# Expose ports (SvelteKit: 3000, PocketBase: 8090)
EXPOSE 3000 8090

# Start both SvelteKit and PocketBase
CMD ["/bin/sh", "-c", "/pb/pocketbase serve --http=0.0.0.0:8090 --dir=/pb/pb_data & node build"]