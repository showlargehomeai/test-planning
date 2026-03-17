#!/bin/bash
set -e

echo "=== TestPlanning 快速部署 ==="
echo ""

# 檢查 Node.js
if ! command -v node &> /dev/null; then
  echo "❌ 需要 Node.js (建議 v20+)，請先安裝：https://nodejs.org"
  exit 1
fi

NODE_V=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
echo "✓ Node.js $(node -v)"

# 安裝依賴
echo "→ 安裝依賴..."
npm install --silent

# 檢查 .env.local
if [ ! -f .env.local ]; then
  echo ""
  echo "⚠️  找不到 .env.local，從範本建立..."
  cp .env.example .env.local
  echo "→ 請編輯 .env.local 填入資料庫密碼"
  echo "   vim .env.local"
  echo ""
fi

echo ""
echo "✅ 部署完成！啟動方式："
echo ""
echo "   npm run dev"
echo ""
echo "   開啟瀏覽器：http://localhost:3000"
echo "   戰情室：    http://localhost:3000/dashboard"
echo ""
