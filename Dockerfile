# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_AUTH_SERVICE_PREFIX=/api/auth-service
ARG VITE_COURSE_SERVICE_PREFIX=/api/course-service

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_AUTH_SERVICE_PREFIX=$VITE_AUTH_SERVICE_PREFIX
ENV VITE_COURSE_SERVICE_PREFIX=$VITE_COURSE_SERVICE_PREFIX

RUN npm run build

# Stage 2: Serve
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3001
CMD ["nginx", "-g", "daemon off;"]
