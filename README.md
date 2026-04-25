这是一个简洁的个人简历网站模板，特点：
- 前端：Tailwind CSS（CDN），单页展示，蓝色为主基调
- 后端：Node.js + Express，提供创建与获取简历的 API
- 存储：示例使用 MongoDB（可替换）
- 功能：
  - 根据出生日期计算中文星座与年龄
  - 为每位用户随机分配一张“有益身体健康的运动 3D 图”作为背景
  - 为每位简历生成唯一子域名（slug.yourdomain.com），支持 wildcard DNS + Nginx 或云平台部署
