# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.21.1
FROM node:${NODE_VERSION}-slim AS build

WORKDIR /app

COPY package-lock.json package.json ./
RUN npm ci

# Copy application code
COPY . .

RUN npm run build

FROM nginx:1.29-alpine AS runtime

LABEL fly_launch_runtime="nginx"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/the-archive-web/browser /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
