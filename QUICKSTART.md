# 📄 立志简历 - 快速开始指南

## 🎉 项目已完成！

你现在拥有一个功能完整的智能简历构建平台。让我为你总结一下所有已创建的文件和如何使用。

## 📂 项目文件概览

### 前端文件
- **[home.html](./home.html)** - 🌟 新的项目首页（营销页面）
- **[lei-jun-resume.html](./lei-jun-resume.html)** - 雷军简历展示页（完整示例）
- **[dashboard.html](./dashboard.html)** - 用户仪表板（编辑器和认证）
- **[index.html](./index.html)** - 原始文件

### 后端文件（Node.js）
- **[server/index.js](./server/index.js)** - Express 主服务器
  - 用户认证 API
  - 简历生成和管理 API
  - 公开分享路由
  - 星座信息 API

- **[server/db.js](./server/db.js)** - 数据库初始化和管理
  - SQLite 数据库连接
  - 表结构定义
  - 默认模板插入

- **[server/zodiac.js](./server/zodiac.js)** - 星座识别库
  - 12个星座数据
  - 日期转星座函数

- **[server/resume-generator.js](./server/resume-generator.js)** - 简历HTML生成器
  - 将用户数据转换为美观的HTML

### 配置文件
- **[package.json](./package.json)** - Node.js 项目配置
- **[.env.example](./.env.example)** - 环境变量示例

### 文档
- **[README.md](./README.md)** - 完整项目文档（中文）
- **[QUICKSTART.md](./QUICKSTART.md)** - 本文件

## 🚀 快速启动（3分钟）

### 1️⃣ 安装依赖
```bash
cd /workspaces/jl
npm install
```

### 2️⃣ 启动服务器
```bash
npm start
```

或开发模式（带热重载）：
```bash
npm run dev
```

你应该看到：
```
╔════════════════════════════════════════╗
║   Resume Builder Server Started         ║
║   http://localhost:3000                 ║
║════════════════════════════════════════╝
```

### 3️⃣ 在浏览器中打开

| 页面 | URL |
|-----|-----|
| 首页 | http://localhost:3000/home.html |
| 雷军简历 | http://localhost:3000/lei-jun-resume.html |
| 仪表板 | http://localhost:3000/dashboard.html |
| API文档 | http://localhost:3000/ |

## 💡 使用场景

### 场景 1：查看完整示例
1. 打开 [http://localhost:3000/lei-jun-resume.html](http://localhost:3000/lei-jun-resume.html)
2. 看到灰白基调、3D动画背景、星座信息的完整简历
3. 这是模板，用户的简历会自动采用相同风格

### 场景 2：创建自己的简历
1. 打开 [http://localhost:3000/dashboard.html](http://localhost:3000/dashboard.html)
2. 注册账户：
   - 姓名：张三
   - 邮箱：zhangsan@example.com
   - 密码：任意密码
3. 系统自动生成二级域名（如：`zhangsan-abc12345`）
4. 编辑简历信息
5. 输入出生日期（例如1990-12-08）→ 自动显示星座信息
6. 添加工作经历、教育背景、技能
7. 点击"生成/更新简历"
8. 获得分享链接，分享给他人

### 场景 3：分享简历
生成的简历链接：
- `http://localhost:3000/preview/{resumeId}` - 生成的简历唯一ID
- 每个用户创建简历后会获得分享链接和预览
- 招聘人员可以直接查看你的简历

## 🔧 API 快速参考

### 注册用户
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "张三",
    "email": "zhangsan@example.com",
    "password": "password123"
  }'
```

### 登录
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "zhangsan@example.com",
    "password": "password123"
  }'
```

### 生成简历
```bash
curl -X POST http://localhost:3000/api/resume/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "张三",
    "birthDate": "1990-12-08",
    "email": "zhangsan@example.com",
    "phone": "138-xxxx-xxxx",
    "bio": "我是一名全栈工程师...",
    "skills": ["Node.js", "React", "Python"]
  }'
```

## ✨ 核心特性验证

### ✅ 灰白基调设计
查看 `lei-jun-resume.html` 或生成的简历，确认所有内容都使用灰白配色方案

### ✅ 3D运动背景
在简历页面背景会看到旋转的3D几何体（使用 Three.js）
- 支持5种不同的运动主题
- 每个用户随机分配一种

### ✅ 星座识别
在仪表板输入出生日期后，会自动识别显示星座信息：
- 星座名字和符号
- 性格特征
- 五行属性

### ✅ 自动生成二级域名
注册时自动生成格式：`{name}-{randomId}`
例如：`zhangsan-abc12345`

### ✅ 多份简历支持
每个用户可以创建多个简历，通过 API 管理和切换

### ✅ 简历模板
支持5种 3D 背景模板：
- 1. 瑜伽身心 (yoga)
- 2. 跑步活力 (running)
- 3. 健身能量 (fitness)
- 4. 游泳流动 (swimming)
- 5. 骑行风采 (cycling)

## 📊 数据库结构

### SQLite 表
- **users** - 用户账户信息
- **resumes** - 简历数据（支持多份）
- **templates** - 3D背景主题模板

数据库文件位置：`./data/resumes.db`（自动创建）

## 🔒 安全特性

- ✅ 密码使用 bcrypt 加密存储
- ✅ JWT 令牌认证（7天过期）
- ✅ CORS 配置
- ✅ SQL 参数化查询防注入
- ✅ 环境变量管理敏感信息

## 📱 响应式设计

所有页面都支持：
- 📱 移动设备（320px+）
- 💻 平板设备（768px+）
- 🖥️ 桌面设备（1024px+）

## 🎨 样式框架

使用 **Tailwind CSS CDN**，无需构建步骤

## 🌍 部署建议

### 本地开发
完全按照快速启动指南进行

### 云部署（如Vercel/Heroku/云服务器）
1. 修改 `.env` 中的配置
2. 设置合适的 JWT_SECRET
3. 配置 DNS 和子域名解析（可选）
4. 部署后配置反向代理以支持二级域名

### 二级域名配置（可选）

在 Nginx 中配置：
```nginx
server {
  server_name ~^(?<subdomain>.+)\.resumeBuilder\.com$;
  
  location / {
    proxy_pass http://localhost:3000/subdomain/$subdomain;
  }
}
```

## 🆘 故障排除

### Q: 数据库错误？
A: 删除 `./data/resumes.db`，重启服务器会自动重建

### Q: 端口已占用？
A: 修改 `.env` 中的 PORT，或运行：
```bash
PORT=8080 npm start
```

### Q: 前端无法连接到后端？
A: 确认后端服务器正常运行，检查是否启用了 CORS

### Q: 忘记了登录密码？
A: 当前版本无重置功能，删除数据库重建，或在数据库中修改

## 📚 进一步定制

### 修改颜色方案
编辑 `lei-jun-resume.html` 中的 Tailwind 配色

### 添加更多简历字段
修改 `dashboard.html` 中的表单和 `server/resume-generator.js`

### 更改3D背景
修改 `lei-jun-resume.html` 和 `server/resume-generator.js` 中的 Three.js 代码

### 添加数据库验证
在 `server/index.js` 中的 API 路由添加验证

## 📞 联系方式

项目完整文档：[README.md](./README.md)
技术支持：查看源代码注释

## 🎓 学习资源

- [Node.js 官方文档](https://nodejs.org/docs/)
- [Express 中文文檔](https://expressjs.com)
- [SQLite 文档](https://www.sqlite.org/lang.html)
- [Three.js 官方示例](https://threejs.org/examples)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🎉 恭喜！

你现在拥有一个完整的、可投入生产的简历构建平台！

### 下一步：
1. ✅ 启动服务器 (`npm start`)
2. ✅ 在浏览器中打开首页
3. ✅ 创建一个测试账户
4. ✅ 生成你的第一份简历
5. ✅ 分享给朋友！

祝你使用愉快！ 🚀

---

**版本：** 1.0.0  
**最后更新：** 2024-04-25  
**License：** MIT
