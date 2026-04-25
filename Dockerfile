# 多阶段构建 - 生产优化镜像
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package files
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 生产镜像
FROM node:20-alpine

WORKDIR /app

# 设置非 root 用户（安全最佳实践）
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 从 builder 镜像复制 node_modules
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# 复制应用代码
COPY --chown=nodejs:nodejs . .

# 创建数据目录
RUN mkdir -p data && chown -R nodejs:nodejs data

# 切换用户
USER nodejs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# 启动应用
CMD ["node", "server/server.js"]
