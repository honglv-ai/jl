#!/usr/bin/env bash
set -euo pipefail

# 根目录切换
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 默认项目名称，可通过环境变量覆盖
PROJECT_NAME="${PROJECT_NAME:-jl-resume-builder}"

# 提交当前更改到 Git
if git diff --quiet --ignore-submodules -- .; then
  echo "No local changes to commit."
else
  git add .
  git commit -m "Add Railway deployment configuration"
fi

echo "Pushing current branch to origin/main..."
git push origin main

# Railway CLI 安装检查
if ! command -v railway >/dev/null 2>&1; then
  echo "Railway CLI 未检测到，正在安装 @railway/cli..."
  if command -v npm >/dev/null 2>&1; then
    npm install -g @railway/cli
  else
    echo "请先安装 npm，然后重试。"
    exit 1
  fi
fi

# 登录 Railway
echo "请在浏览器中完成 Railway 登录..."
railway login || {
  echo "尝试使用 npx @railway/cli login..."
  npx @railway/cli login
}

# 初始化或关联 Railway 项目
if ! railway status >/dev/null 2>&1; then
  echo "初始化 Railway 项目：$PROJECT_NAME"
  railway init --name "$PROJECT_NAME"
else
  echo "Railway 项目已关联。"
fi

# 生成 JWT_SECRET（如果环境变量未设置）
if [ -z "${JWT_SECRET:-}" ]; then
  echo "生成强随机 JWT_SECRET..."
  JWT_SECRET="$(node -e 'console.log(require("crypto").randomBytes(32).toString("base64"))')"
fi

echo "设置环境变量..."
railway variables set PORT=3000
railway variables set NODE_ENV=production
railway variables set DATABASE_PATH=/app/data/resumes.db
railway variables set JWT_SECRET="$JWT_SECRET"

# 部署应用
echo "开始部署 Railway 应用..."
railway up --detach

# 输出项目状态与 URL
echo "部署完成，请查看以下 Railway 服务状态："
railway status

echo "如果需要打开应用，请使用 railway open 或在浏览器中访问项目 URL。"
