FROM node:16.14.0-buster

# Set OpenSSL configuration
ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /app

# Copy package files
COPY server/package*.json ./server/
COPY product/package*.json ./product/

# Install dependencies
RUN cd server && npm install && \
    cd ../product && npm install

# Copy source files
COPY . .

# Build frontend
RUN cd product && npm run build

# Expose port
EXPOSE 18888

CMD ["node", "server/server.js"]