# LUXE Fashion Store — Frontend

React + Vite + Tailwind, build ra file tĩnh và phục vụ bằng Nginx (Nginx proxy `/api/` sang backend).
Backend, database và `docker-compose.yml` ở repo [luxe_backend](https://github.com/QuocAnh-205/luxe_backend).

## Chạy local (dev)

```bash
npm install
npm run dev
```

## Chạy bằng Docker

Xem README của [luxe_backend](https://github.com/QuocAnh-205/luxe_backend): clone 2 repo cạnh nhau rồi chạy `docker compose up -d --build` trong `luxe_backend`.

## CI/CD

`.github/workflows/frontend-ci-cd.yml`:

- **CI** (mọi PR và push `main`): cài dependencies, `npm run build`, build thử Docker image.
- **CD** (push `main`, sau khi CI xanh): SSH vào EC2, `git pull` trong `~/luxe2/luxe_frontend`, rồi build lại và khởi động lại container frontend từ `~/luxe2/luxe_backend`.
  Chỉ chạy khi repo đã khai báo biến `AWS_ROLE_ARN`, `AWS_SG_ID` và secret `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`.
