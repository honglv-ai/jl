# Railway 部署指南

## 🚀 Railway 部署（最推荐）

Railway 是一个现代的云部署平台，支持：
- ✅ 自动从 GitHub 部署
- ✅ 自动构建和重启
- ✅ 免费配额（$5/月）
- ✅ 一键回滚
- ✅ 免费 SSL 证书
- ✅ 环境变量管理
- ✅ 数据库选项

---

## 📋 前置要求

1. GitHub 账户
2. Railway 账户（https://railway.app）
3. 项目已上传到 GitHub

---

## 🎯 快速部署步骤

### 步骤 1：准备 GitHub 仓库

```bash
# 提交所有更改
cd /workspaces/jl
git add .
git commit -m "Add Docker and Railway configuration"
git push origin main
```

### 步骤 2：在 Railway 上连接项目

访问 https://railway.app，然后：

1. **登录或注册** Railway 账户
2. **点击** "New Project" 
3. **选择** "Deploy from GitHub"
4. **授权** Railway 访问您的 GitHub 账户
5. **选择** `honglv-ai/jl` 仓库（或您的仓库名称）
6. **选择** `main` 分支
7. 点击 **"Deploy"**

---

## 🔧 配置环境变量

部署后，需要设置环境变量：

1. **进入项目面板**，点击 "Variables" 选项卡
2. **添加以下环境变量**：

```
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-minimum-32-characters
NODE_ENV=production
DATABASE_PATH=/app/data/resumes.db
```

⚠️ **重要**：将 `JWT_SECRET` 改成至少 32 个字符的强密钥

### 生成安全的 JWT_SECRET

```bash
# 在本地终端运行（Linux/Mac）
openssl rand -base64 32

# 或在 Node.js 中
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 或使用在线工具
# https://generate-random.org/
```

复制输出的密钥，粘贴到 Railway 的 `JWT_SECRET` 变量中。

---

## 📊 验证部署

### 1. 查看构建日志

在 Railway 仪表板中：
- 左侧选择 "Builds"
- 查看最新构建的进度和日志

### 2. 查看运行日志

选择 "Logs" 标签，实时查看应用日志：

```
✓ Database connected
✓ Database initialized successfully

╔════════════════════════════════════════╗
║   Resume Builder Server Started        ║
║   http://your-app.railway.app         ║
╚════════════════════════════════════════╝
```

### 3. 获取公共 URL

在 Railway 仪表板中：
- 点击 "Settings"
- 在 "Networking" 部分，您会看到 railway-generated URL
- 格式为：`https://your-app-xxxxx.railway.app`

---

## 🌐 自定义域名（可选）

### 配置 Railway 自定义域名

1. 在 Railway 仪表板中，选择 **"Settings"** → **"Networking"**
2. 点击 **"Add Custom Domain"**
3. 输入您的域名（如 `resume.example.com`）
4. 按照指示配置 DNS CNAME 记录

**DNS 配置示例**（以阿里云为例）：

```
记录类型: CNAME
主机记录: resume
记录值: your-app.railway.app
```

### 配置通配符子域名（支持用户子域名）

如果想支持 `username.resume.example.com` 格式：

1. 在 DNS 提供商中添加记录：

```
记录类型: CNAME
主机记录: *.resume
记录值: your-app.railway.app
```

2. 在 Railway 项目 "Settings" 中添加通配符域名：
   - `resume.example.com`
   - `*.resume.example.com`

然后在服务器代码中，Railway 会自动映射所有请求到您的应用。

---

## 🔄 自动部署（CI/CD）

Railway 会自动监视您的 GitHub 仓库：

- **每次 git push 到 main 分支时**，自动触发新的构建和部署
- 构建失败时会发送通知
- 部署前会运行健康检查

### 手动触发部署

如果需要手动重新部署：

1. 在 Railway 仪表板的 **"Deployments"** 标签
2. 点击最新部署旁的 **"Redeploy"** 按钮

### 回滚到上一个版本

1. 在 **"Deployments"** 标签中选择想回滚到的版本
2. 点击 **"Redeploy"** 按钮
3. Railway 会立即切换到该版本

---

## 💾 数据库持久化

### 问题：Railway 容器重启后数据会丢失吗？

**不会！** Railway 使用持久卷（volumes）：

- 您的 SQLite 数据库存储在 `/app/data/resumes.db`
- 该目录挂载到 Railway 的持久存储
- 即使容器重启，数据也会保留

### 定期备份数据库

```bash
# 通过 Railway CLI 备份
railway file download /app/data/resumes.db resumes.db.backup

# 恢复数据库
railway file upload resumes.db.backup /app/data/resumes.db
```

---

## 🧪 测试部署

### 1. 检查 API 健康状态

```bash
curl https://your-app.railway.app/health
# 应该返回: {"status":"ok"}
```

### 2. 查看 API 文档

```bash
curl https://your-app.railway.app
```

### 3. 测试注册功能

```bash
curl -X POST https://your-app.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "测试用户",
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

### 4. 访问前端应用

- 主页：`https://your-app.railway.app/home.html`
- 仪表板：`https://your-app.railway.app/dashboard.html`
- 示例简历：`https://your-app.railway.app/lei-jun-resume.html`

---

## 📈 监控和管理

### 查看性能指标

在 Railway 仪表板：
- **CPU 使用率** - 通常很低（0-5%）
- **内存使用率** - 应在 50-100MB
- **网络流量** - 实时监控

### 日志查询

Railway 提供强大的日志搜索功能：

```
# 搜索所有错误
[error|Error|ERROR]

# 搜索特定时间段的日志
@timestamp > 2024-01-01

# 搜索特定用户下的请求
POST /api/resume/generate
```

### 设置告警

1. 进入 **"Settings"** → **"Monitoring"**
2. 启用告警通知
3. 设置告警规则（CPU、内存、错误率）

---

## 🆘 故障排查

### 应用部署失败

**查看错误日志**：
1. 进入 Railway 仪表板
2. 选择 **"Builds"** 标签
3. 查看失败构建的完整日志

**常见问题及解决方案**：

```
❌ "npm ERR! code ERESOLVE"
→ 解决: 确保 package-lock.json 已上传到 GitHub

❌ "Cannot find module 'express'"
→ 解决: 运行 npm install，上传 package-lock.json

❌ "Port 3000 already in use"
→ 解决: Railway 会分配动态端口，代码应使用 process.env.PORT

❌ "ENOENT: no such file or directory"
→ 解决: 检查文件路径是否正确，使用相对路径
```

### 应用运行但无法访问

**检查清单**：
- [ ] 是否看到 "Railway-generated URL"？
- [ ] 是否给定的 URL 能 ping 通？
- [ ] 是否设置了所有必需的环境变量？
- [ ] 是否建立了健康检查路由？

**调试命令**：
```bash
# 查看最新日志
railway logs

# SSH 进入容器
railway shell

# 查看有效的环境变量
railway variables list
```

### 数据库连接错误

**常见症状**：
```
"Error: SQLITE_CANTOPEN"
"ENOENT: no such file or directory, open '/app/data/resumes.db'"
```

**解决方案**：

```javascript
// 您的应用已自动处理此问题
// initDatabase() 会创建数据目录
// 但如需手动以重置：

// 1. 进入容器
railway shell

// 2. 重新创建数据目录
mkdir -p /app/data
chmod 755 /app/data

// 3. 重启应用
exit
railway redeploy
```

---

## 💰 成本估算

Railway 的定价模型：

- **$5/月免费配额** - 大多数小型项目足够
- **超额按使用量计费**
  - 计算：$0.000463/核秒（通常 1 核）
  - 存储：$1/GB/月
  - 带宽：$0.10/GB

**示例成本**（月均使用）：
- 小型项目（< 100 用户）：$0-5/月
- 中型项目（100-500 用户）：$5-15/月
- 大型项目（> 500 用户）：$15-50+/月

---

## 🔐 生产环境检查清单

在生产环境前，确保已完成：

- [ ] 修改 `JWT_SECRET` 为强密钥（最少 32 字符）
- [ ] 设置 `NODE_ENV=production`
- [ ] 配置自定义域名（而不是 railway.app）
- [ ] 启用 HTTPS（Railway 自动提供）
- [ ] 配置邮件通知（错误告警）
- [ ] 设置定期备份策略
- [ ] 测试注册、登录、简历生成流程
- [ ] 验证数据持久化（重启后数据不丢失）
- [ ] 配置日志收集和监控

---

## 📞 需要帮助？

### Railway 官方资源
- 文档：https://docs.railway.app/
- Discord 社区：https://discord.gg/railway
- 状态页：https://status.railway.app/

### 本项目文档
- 项目 README：[README.md](./README.md)
- 快速开始：[QUICKSTART.md](./QUICKSTART.md)
- Docker 部署：[DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)

---

## 🎉 部署完成后的下一步

1. **邀请用户**
   - 分享您的 Railway URL（如 `https://resume.example.com`）
   - 用户可直接注册和创建简历

2. **自定义品牌**
   - 修改 HTML 文件中的颜色、字体、文案
   - 添加公司 Logo 和品牌信息

3. **收集反馈**
   - 添加用户反馈表单
   - 跟踪生成的简历数量
   - 改进用户体验

4. **扩展功能**
   - 添加简历模板
   - 支持 PDF 导出
   - 集成邮件通知
   - 社交分享功能

