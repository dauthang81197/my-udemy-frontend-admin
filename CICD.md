# CI/CD Setup — my-udemy-frontend-admin

Stack: **GitHub Actions** → **Docker Hub** → **Docker Swarm** trên VPS

---

## Cấu trúc files

```
.
├── Dockerfile                        # Multi-stage: Node 20 build → Nginx 1.27 serve
├── nginx.conf                        # SPA routing, gzip, cache, security headers
├── .dockerignore                     # Loại node_modules, dist, .env khỏi build context
├── docker-stack.yml                  # Docker Swarm stack definition
└── .github/
    └── workflows/
        └── deploy.yml                # GitHub Actions pipeline
```

---

## Flow hoạt động

```
Push to develop
      │
      ▼
[GitHub Actions]
  1. Build React app (npm run build) với VITE_* env vars từ GitHub Secrets
  2. Build Docker image (multi-stage)
  3. Push lên Docker Hub:
       - my-username/my-udemy-frontend-admin:latest
       - my-username/my-udemy-frontend-admin:sha-xxxxxxx
      │
      ▼
[VPS qua SSH]
  4. Copy docker-stack.yml lên /opt/my-udemy/
  5. docker login Docker Hub
  6. docker stack deploy my-udemy (rolling update, auto rollback nếu lỗi)
  7. docker image prune (dọn image cũ)
```

---

## Setup lần đầu

### 1. Chuẩn bị VPS

```bash
# Cài Docker
curl -fsSL https://get.docker.com | sh
usermod -aG docker $USER

# Khởi tạo Docker Swarm (single node)
docker swarm init

# Tạo thư mục deploy
mkdir -p /opt/my-udemy
```

### 2. Tạo SSH key để GitHub Actions kết nối VPS

```bash
# Trên máy local, tạo key riêng cho CI
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_key -N ""

# Copy public key lên VPS
ssh-copy-id -i ~/.ssh/github_actions_key.pub user@your-vps-ip

# Nội dung private key → paste vào GitHub Secret VPS_SSH_KEY
cat ~/.ssh/github_actions_key
```

### 3. GitHub Secrets & Variables

Vào repo GitHub → **Settings → Secrets and variables → Actions**

#### Secrets (nhạy cảm)

| Secret | Giá trị |
|--------|---------|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub access token (tạo tại hub.docker.com → Account Settings → Security) |
| `VITE_API_BASE_URL` | URL backend, vd: `https://api.mysite.com` |
| `VPS_HOST` | IP hoặc domain VPS, vd: `123.456.789.0` |
| `VPS_USER` | SSH user, vd: `ubuntu` hoặc `root` |
| `VPS_SSH_KEY` | Nội dung private key SSH (toàn bộ file, kể cả `-----BEGIN...`) |

#### Variables (không nhạy cảm)

| Variable | Giá trị mặc định |
|----------|-----------------|
| `VITE_AUTH_SERVICE_PREFIX` | `/api/auth-service` |
| `VITE_COURSE_SERVICE_PREFIX` | `/api/course-service` |

---

## Trigger pipeline

Pipeline tự động chạy khi **push lên branch `develop`**.

Để trigger thủ công: GitHub → Actions → **Build & Deploy** → **Run workflow**

---

## Docker image

- Registry: Docker Hub
- Image name: `<DOCKER_USERNAME>/my-udemy-frontend-admin`
- Tags:
  - `latest` — luôn là bản mới nhất
  - `sha-xxxxxxx` — commit hash 7 ký tự, dùng để rollback

### Rollback thủ công

```bash
# SSH vào VPS
ssh user@your-vps-ip

# Xem danh sách image cũ
docker images your-dockerhub-username/my-udemy-frontend-admin

# Rollback về version cụ thể
docker service update \
  --image your-dockerhub-username/my-udemy-frontend-admin:sha-xxxxxxx \
  my-udemy_frontend-admin
```

---

## Kiểm tra trên VPS

```bash
# Xem trạng thái stack
docker stack ps my-udemy

# Xem services
docker service ls

# Xem logs
docker service logs my-udemy_frontend-admin --follow

# Xem chi tiết service
docker service inspect my-udemy_frontend-admin --pretty
```

---

## Cổng & Networking

| Service | Cổng | Ghi chú |
|---------|------|---------|
| frontend-admin | 80 | HTTP |

> **Muốn HTTPS (SSL)?** Thêm Traefik hoặc Nginx Proxy Manager vào `docker-stack.yml` để tự động cấp cert Let's Encrypt.

---

## Biến môi trường Vite

Vite nhúng env vars vào bundle **lúc build** (không phải runtime). Muốn thay đổi `VITE_API_BASE_URL` cần chạy lại pipeline.

Env vars được truyền qua `--build-arg` trong Dockerfile:

```dockerfile
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
```
