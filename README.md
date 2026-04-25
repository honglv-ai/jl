# 📄 智能简历构建系统 | Resume Builder Platform

一个功能完整的个人简历构建平台，支持动态3D背景、星座显示、自动生成二级域名和后台管理系统。

## ✨ 核心特性

### 🎯 前端功能
- **雷军简历展示页** (`lei-jun-resume.html`)
  - 灰白基调，简洁优雅设计
  - 3D运动健身背景动画（瑜伽、跑步、健身等）
  - 完整的个人信息、职业经历、教育背景展示
  - 星座信息动态显示（♐ 射手座）
  - 响应式设计，支持打印

- **用户仪表板** (`dashboard.html`)
  - 用户注册/登录
  - 简历编辑器（灵活的字段配置）
  - 实时星座识别
  - 简历预览功能
  - 分享链接生成

### 🔐 后端功能
- **用户认证系统**
  - 安全的注册/登录
  - JWT令牌管理
  - 密码加密存储（bcryptjs）

- **简历管理API**
  - 创建/编辑简历
  - 多份简历支持
  - 星座自动识别

- **公共分享**
  - 简历预览页面: `/preview/:resumeId`
  - 子域名支持: `/subdomain/:subdomain`
  - SEO友好的URL结构

- **数据库**
  - SQLite 本地存储
  - 用户表、简历表、模板表
  - 自动关系管理

## 📁 项目结构

```
jl/
├── lei-jun-resume.html      # 雷军简历展示页（主入口）
├── dashboard.html            # 用户仪表板
├── package.json              # 项目依赖配置
├── .env.example              # 环境变量示例
│
├── server/
│   ├── index.js              # 主服务器文件（Express）
│   ├── db.js                 # 数据库初始化与连接
│   ├── zodiac.js             # 星座计算库
│   └── resume-generator.js   # HTML简历生成器
│
└── data/
    └── resumes.db            # SQLite数据库（自动生成）
```

## 🚀 快速开始

### 1. 安装依赖

```bash
cd /workspaces/jl
npm install
```

### 2. 配置环境

复制 `.env.example` 到 `.env`：
```bash
cp .env.example .env
```

编辑 `.env` 文件（可选，默认值已配置）：
```
PORT=3000
JWT_SECRET=your-super-secret-key
NODE_ENV=development
```

### 3. 启动服务器

开发模式（带热重载）：
```bash
npm run dev
```

或生产模式：
```bash
npm start
```

服务器将在 `http://localhost:3000` 启动

## 🌐 访问URL

| 功能 | URL | 描述 |
|-----|-----|------|
| 雷军简历 | `http://localhost:3000/lei-jun-resume.html` | 完整的模板简历 |
| 用户仪表板 | `http://localhost:3000/dashboard.html` | 用户登录与编辑 |
| API 文档 | `http://localhost:3000/` | API端点列表 |
| 简历预览 | `http://localhost:3000/preview/{resumeId}` | 生成的简历预览 |
| 子域名访问 | `http://localhost:3000/subdomain/{subdomain}` | 用户的简历主页 |

## 📚 API 文档

### 认证类 API

#### 注册用户
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "张三",
  "email": "zhangsan@example.com",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "user": {
    "id": "xxx-xxx",
    "email": "zhangsan@example.com",
    "name": "张三",
    "subdomain": "zhangsan-abc12345"
  },
  "token": "eyJhbGc..."
}
```

#### 用户登录
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "zhangsan@example.com",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "user": {...},
  "token": "eyJhbGc..."
}
```

### 简历类 API

#### 生成/更新简历
```
POST /api/resume/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "张三",
  "birthDate": "1990-12-08",
  "email": "zhangsan@example.com",
  "phone": "+86-138-xxxx-xxxx",
  "bio": "资深全栈工程师...",
  "experience": [
    {
      "company": "某科技有限公司",
      "position": "技术总监",
      "startDate": "2018-01",
      "endDate": "至今",
      "achievements": ["领导技术团队", "优化系统性能"]
    }
  ],
  "education": [
    {
      "school": "清华大学",
      "degree": "计算机科学与技术 学士",
      "startDate": "2008",
      "endDate": "2012"
    }
  ],
  "skills": ["Node.js", "React", "Python", "Docker"]
}

Response:
{
  "success": true,
  "resume": {...},
  "previewUrl": "/preview/resume-id",
  "publicUrl": "https://zhangsan-abc12345.resumeBuilder.com"
}
```

#### 获取用户简历列表
```
GET /api/resumes
Authorization: Bearer {token}

Response:
{
  "success": true,
  "resumes": [
    {
      "id": "resume-1",
      "name": "张三",
      "zodiac": "射手座",
      "created_at": "2024-04-25T10:30:00Z"
    }
  ]
}
```

### 星座 API

#### 获取所有星座
```
GET /api/zodiac/all

Response:
{
  "success": true,
  "zodiacSigns": [
    {
      "name": "射手座",
      "symbol": "♐",
      "element": "火象",
      "traits": ["乐观", "诚实", "冒险"]
    }
  ]
}
```

#### 根据日期获取星座
```
GET /api/zodiac/1990-12-08

Response:
{
  "success": true,
  "zodiac": {
    "name": "射手座",
    "symbol": "♐",
    "element": "火象",
    "traits": ["乐观", "诚实", "冒险"]
  }
}
```

## 🎨 3D背景动画

系统支持多种3D运动主题背景：

- **瑜伽身心** - 温和舒缓的几何体旋转
- **跑步活力** - 动态快速的运动效果
- **健身能量** - 强有力的强度曲线
- **游泳流动** - 流动的波浪运动
- **骑行风采** - 循环旋转运动

每个用户注册时会随机分配一种背景主题，作为该用户的专属风格。

## 👤 用户数据结构

### Users 表
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,  -- 自动生成的二级域名
  avatar_url TEXT,
  bio TEXT,
  contact_email TEXT,
  phone TEXT,
  location TEXT,
  created_at DATETIME,
  updated_at DATETIME
);
```

### Resumes 表
```sql
CREATE TABLE resumes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  birth_date TEXT,
  email TEXT,
  phone TEXT,
  bio TEXT,
  zodiac TEXT,  -- 自动计算的星座
  experience TEXT,  -- JSON 格式
  education TEXT,   -- JSON 格式
  skills TEXT,      -- JSON 格式
  theme TEXT DEFAULT 'slate',
  background_animation TEXT DEFAULT 'yoga',
  is_primary BOOLEAN DEFAULT 0,
  created_at DATETIME,
  updated_at DATETIME
);
```

### Templates 表
```sql
CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  background_type TEXT NOT NULL,
  animation_type TEXT NOT NULL,
  color_scheme TEXT NOT NULL,
  description TEXT,
  created_at DATETIME
);
```

## 🌍 二级域名支持

### 配置说明

在实际部署中，要实现二级域名支持：

1. **DNS 配置**
   ```
   *.resumeBuilder.com  A 记录 -> 服务器IP
   ```

2. **Nginx 反向代理配置**
   ```nginx
   server {
     server_name ~^(?<subdomain>.+)\.resumeBuilder\.com$;
     
     location / {
       proxy_pass http://localhost:3000/subdomain/$subdomain;
     }
   }
   ```

3. **本地开发**
   在 `/etc/hosts` 添加：
   ```
   127.0.0.1 zhangsan-abc12345.localhost
   ```

## 🔒 安全性

- ✓ 密码使用 bcryptjs 加密
- ✓ JWT 令牌验证所有受保护的API
- ✓ CORS 配置
- ✓ SQL注入防护（使用参数化查询）
- ✓ 环境变量管理敏感信息

## 📝 使用示例

### 创建用户简历的完整流程

```javascript
// 1. 注册用户
fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: '王五',
    email: 'wangwu@example.com',
    password: 'password123'
  })
})
.then(r => r.json())
.then(data => {
  const token = data.token;
  
  // 2. 生成简历
  return fetch('http://localhost:3000/api/resume/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: '王五',
      birthDate: '1992-06-15',
      email: 'wangwu@example.com',
      phone: '138-xxxx-xxxx',
      bio: '高级产品经理...',
      skills: ['产品设计', '用户研究', '数据分析']
    })
  });
})
.then(r => r.json())
.then(data => {
  // 3. 获取预览URL
  const previewUrl = `http://localhost:3000${data.previewUrl}`;
  const publicUrl = data.publicUrl;
  
  console.log('预览链接:', previewUrl);
  console.log('公开分享链接:', publicUrl);
});
```

## 🛠️ 技术栈

### 前端
- HTML5 / CSS3 / JavaScript
- Tailwind CSS - 样式框架
- Three.js - 3D图形库
- Responsive Design - 响应式设计

### 后端
- Node.js - 运行环境
- Express.js - Web框架
- SQLite3 - 数据库
- JWT - 身份验证
- bcryptjs - 密码加密

## 📦 依赖管理

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "uuid": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "sqlite3": "^5.1.6"
  }
}
```

## 🚨 常见问题

### Q: 如何修改默认端口？
A: 在 `.env` 文件中修改 `PORT` 变量，或运行时指定：
```bash
PORT=8080 npm start
```

### Q: 数据库文件在哪里？
A: 位于 `./data/resumes.db`，首次运行时自动创建。

### Q: 如何重置数据库？
A: 删除 `./data/resumes.db` 文件，重新启动服务器即可重建。

### Q: 支持多个简历吗？
A: 是的！每个用户可以创建多个简历，通过 `/api/resumes` 列出所有简历。

### Q: 简历是否支持导出为PDF？
A: 当前支持浏览器打印功能（Ctrl+P 或 Cmd+P），可另存为PDF。

## 🎓 学习资源

- [Express.js 官方文档](https://expressjs.com)
- [SQLite 中文文档](https://www.sqlite.org)
- [Three.js 官方示例](https://threejs.org/examples)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

## 📄 许可证

MIT License - 自由使用和修改

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

---

**开发者**: AI Assistant  
**最后更新**: 2024-04-25  
**版本**: 1.0.0
