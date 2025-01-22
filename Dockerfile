FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY server/package*.json ./server/
COPY product/package*.json ./product/

RUN cd server && npm install && \
    cd ../product && npm install

COPY . .

RUN cd product && npm run build

FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/server ./server
COPY --from=builder /app/product/dist ./product/dist

EXPOSE 18888

CMD ["node", "server/server.js"]