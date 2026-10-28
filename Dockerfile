# frontend/Dockerfile
# LUXE Fashion Store - Frontend (React + Vite), build & phục vụ bằng Nginx

# ---- Stage 1: Build ----
FROM node:22-alpine AS builder
WORKDIR /app

# Nhận ARG từ docker-compose (build-time ENV).
# Vite (giống CRA) chỉ đọc biến VITE_* lúc `npm run build` rồi "nướng" (bake) giá trị
# vào bundle JS. Truyền qua `environment:` trong docker-compose lúc runtime KHÔNG có tác dụng.
# Cần thêm biến nào (vd VITE_FIREBASE_API_KEY) thì thêm cặp ARG/ENV tương ứng ở đây
# và thêm vào build.args trong docker-compose.yml.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .
RUN npm run build

# ---- Stage 2: Serve ----
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# PORT và BACKEND_URL là biến runtime của Nginx, được envsubst render vào config
# mỗi khi container start (khác với VITE_* là build-time).
ENV PORT=80
# Địa chỉ backend mà nginx proxy /api/ tới (tên service trong docker-compose)
ENV BACKEND_URL=http://backend:5000
EXPOSE 80

CMD ["/bin/sh", "-c", "envsubst '$PORT $BACKEND_URL' </etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
