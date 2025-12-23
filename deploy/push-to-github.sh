#!/bin/bash

# 推送到 GitHub 准备 Cloudflare Pages 部署

echo "🚀 准备部署到 Cloudflare Pages..."

# 检查是否有 Git 仓库
if [ ! -d .git ]; then
    echo "📁 初始化 Git 仓库..."
    git init
    git branch -M main
fi

# 添加文件到 Git
echo "📝 添加文件到 Git..."
git add .

# 提交更改
echo "💬 提交更改..."
git commit -m "feat: 完成工具网站开发

- ✅ 前端架构：Vue 3 + TDesign + Tailwind CSS
- ✅ 左侧导航栏分类筛选
- ✅ 文本去重工具完整实现
- ✅ Cloudflare Workers 后端 API
- ✅ 工具使用统计系统
- ✅ 响应式设计支持

🎯 准备部署到 Cloudflare Pages"

# 检查远程仓库
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 请添加远程仓库："
    echo "git remote add origin https://github.com/yourusername/your-repo.git"
    echo "然后重新运行此脚本"
    exit 1
fi

# 推送到 GitHub
echo "📤 推送到 GitHub..."
git push origin main

echo "✅ 已推送到 GitHub！"
echo ""
echo "🌐 接下来的步骤："
echo "1. 访问 https://pages.cloudflare.com/"
echo "2. 连接你的 GitHub 仓库"
echo "3. 配置构建设置："
echo "   - 框架预设：Vue"
echo "   - 构建命令：npm run build"
echo "   - 输出目录：dist"
echo "4. 部署后配置环境变量 VITE_API_URL"