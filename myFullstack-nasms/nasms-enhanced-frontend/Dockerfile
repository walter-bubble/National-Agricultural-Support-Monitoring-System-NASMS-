# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-alpine
WORKDIR /app

# Nitro node-server preset outputs a self-contained .output directory
COPY --from=build /app/.output ./.output

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["node", ".output/server/index.mjs"]