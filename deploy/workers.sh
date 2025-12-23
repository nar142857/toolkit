#!/bin/bash

# Cloudflare Workers 部署脚本

echo "🚀 开始部署 Cloudflare Workers..."

# 检查是否安装了 wrangler
if ! command -v wrangler &> /dev/null; then
    echo "❌ 未找到 wrangler CLI，请先安装："
    echo "npm install -g wrangler"
    exit 1
fi

# 登录 Cloudflare（如果需要）
echo "🔐 检查登录状态..."
wrangler whoami

# 创建 D1 数据库（如果不存在）
echo "📊 创建/获取 D1 数据库..."
wrangler d1 create toolkit-db || echo "数据库可能已存在"

# 创建 KV 命名空间（如果不存在）
echo "🗂️ 创建/获取 KV 命名空间..."
wrangler kv:namespace create "CACHE" || echo "KV 命名空间可能已存在"

# 部署 Worker
echo "🌐 部署 Worker..."
wrangler deploy

# 初始化数据库表
echo "🔧 初始化数据库表..."
wrangler d1 execute toolkit-db --file=./src/api/schema.sql

# 设置环境变量
echo "⚙️ 设置环境变量..."
wrangler secret put ENVIRONMENT --preview

echo "✅ 部署完成！"
echo "📱 Worker URL: https://toolkit-api.your-subdomain.workers.dev"
echo "🔍 测试健康检查: curl https://toolkit-api.your-subdomain.workers.dev/api/health"