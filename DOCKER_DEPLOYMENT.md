# Docker 部署指南

## 📦 本地 Docker 部署

### 前置要求
- Docker 引擎 (20.10+)
- Docker Compose (2.0+)

### 快速启动（推荐）

```bash
# 1. 进入项目目录
cd /workspaces/jl

# 2. 启动 Docker 容器
docker-compose up -d

# 3. 查看容器状态
docker-compose ps

# 4. 查看日志
docker-compose logs -f resume-app

# 5. 打开浏览器访问
# http://localhost:3000/home.html
```

### 停止和清理

```bash
# 停止容器
docker-compose down

# 停止并删除数据卷
docker-compose down -v

# 查看容器日志
docker-compose logs resume-app
```

---

## 🔧 自定义配置

### 修改环境变量

编辑 `.env` 文件：

```bash
PORT=3000                                      # 服务端口
JWT_SECRET=your-production-secret-key          # JWT 密钥（生产环境必须修改！）
NODE_ENV=production                            # 运行环境
DATABASE_PATH=./data/resumes.db                # 数据库路径
```

### 修改 Docker Compose 端口

在 `docker-compose.yml` 中修改：

```yaml
ports:
  - "8080:3000"  # 将本地 8080 映射到容器 3000
```

然后访问：`http://localhost:8080/home.html`

---

## 🚀 部署到远程服务器

### 方式 1：使用 Docker Hub（推荐）

```bash
# 1. 构建镜像
docker build -t your-username/resume-builder:latest .

# 2. 登录 Docker Hub
docker login

# 3. 推送镜像
docker push your-username/resume-builder:latest

# 4. 在服务器上拉取并运行
docker run -d \
  -p 3000:3000 \
  -e JWT_SECRET="your-production-secret" \
  -e NODE_ENV="production" \
  -v resume-data:/app/data \
  --name resume-app \
  --restart unless-stopped \
  your-username/resume-builder:latest
```

### 方式 2：直接上传代码到服务器

```bash
# 1. 在服务器上克隆或上传代码
git clone <your-repo-url> /opt/resume-builder
cd /opt/resume-builder

# 2. 修改 .env 文件中的 JWT_SECRET
nano .env

# 3. 启动 Docker Compose
docker-compose up -d

# 4. 验证服务
docker-compose ps
docker-compose logs resume-app
```

---

## ☁️ 部署到云平台

### Railway (最简单)

```bash
# 1. 在 Railway.app 创建账户和新项目
# 2. 连接 GitHub 仓库
# 3. 添加以下环境变量：
#    - JWT_SECRET: your-production-key
#    - NODE_ENV: production
#    - DATABASE_PATH: /app/data/resumes.db
# 4. 自动部署（每次 git push 时触发）
```

### Heroku

```bash
# 1. 安装 Heroku CLI
curl https://cli.heroku.com/install.sh | sh

# 2. 登录
heroku login

# 3. 创建 Heroku 应用
heroku create your-app-name

# 4. 推送代码
git push heroku main

# 5. 设置环境变量
heroku config:set JWT_SECRET="your-production-secret"
heroku config:set NODE_ENV="production"

# 6. 查看日志
heroku logs --tail
```

### AWS ECS/Fargate

```bash
# 1. 构建并推送镜像到 ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <aws-account>.dkr.ecr.us-east-1.amazonaws.com

docker tag resume-builder:latest <aws-account>.dkr.ecr.us-east-1.amazonaws.com/resume-builder:latest
docker push <aws-account>.dkr.ecr.us-east-1.amazonaws.com/resume-builder:latest

# 2. 创建 ECS 任务定义和服务（使用 AWS 控制台）
# 3. 配置 ALB（Application Load Balancer）用于域名映射
```

---

## 🌐 配置域名和反向代理

### Nginx 反向代理（支持子域名）

```bash
# 在服务器上安装 Nginx
sudo apt-get install nginx

# 创建配置文件 /etc/nginx/sites-available/resume-builder
sudo nano /etc/nginx/sites-available/resume-builder
```

```nginx
# 通配符子域名配置
server {
    listen 80;
    server_name ~^(?<subdomain>.+)\.example\.com$ example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # SSL 配置（使用 Let's Encrypt）
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/resume-builder /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 获取 SSL 证书（自动续期）
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d '*.example.com'
```

---

## 📊 监控和维护

### 查看容器日志

```bash
# 实时日志
docker-compose logs -f

# 查看最后 100 行
docker-compose logs -n 100

# 特定服务的日志
docker-compose logs resume-app
```

### 性能监控

```bash
# Docker 统计信息
docker stats resume-builder

# 进入容器并检查
docker exec -it resume-builder sh

# 查看数据库大小
ls -lh data/resumes.db
```

### 备份数据

```bash
# 备份数据卷
docker run --rm -v resume-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/resume-data-backup.tar.gz -C /data .

# 恢复数据卷
docker run --rm -v resume-data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/resume-data-backup.tar.gz -C /data
```

### 更新应用

```bash
# 拉取最新代码
git pull

# 重建镜像
docker-compose build --no-cache

# 重启容器
docker-compose up -d

# 检查健康状态
docker-compose ps
```

---

## 🔐 生产环境检查清单

- [ ] 修改 `.env` 中的 `JWT_SECRET`（最少 32 字符）
- [ ] 设置 `NODE_ENV=production`
- [ ] 配置 SSL/TLS 证书（HTTPS）
- [ ] 设置 Nginx 反向代理
- [ ] 配置备份策略
- [ ] 设置监控告警
- [ ] 配置日志收集
- [ ] 限制 Docker 资源使用
- [ ] 配置自动重启策略
- [ ] 定期运行 `docker-compose ps` 检查健康状态

---

## 🐛 故障排查

### 容器无法启动

```bash
# 查看错误日志
docker-compose logs resume-app

# 检查端口是否被占用
lsof -i :3000

# 重建镜像
docker-compose build --no-cache --pull
```

### 数据库连接错误

```bash
# 检查数据卷
docker volume ls | grep resume-data

# 进入容器检查
docker exec run-app bash
cd /app/data
ls -la

# 删除损坏的数据库并重建
docker-compose exec resume-app rm /app/data/resumes.db
docker-compose restart
```

### 内存或 CPU 不足

在 `docker-compose.yml` 中添加资源限制：

```yaml
services:
  resume-app:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

---

## 📞 获取帮助

- 查看项目文档：[README.md](./README.md)
- 查看快速启动：[QUICKSTART.md](./QUICKSTART.md)
- Docker 官方文档：https://docs.docker.com/
- Docker Compose 文档：https://docs.docker.com/compose/
