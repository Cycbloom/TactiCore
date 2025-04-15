#!/bin/sh

# 等待数据库准备就绪
echo "等待数据库准备就绪..."
sleep 5

# 检查迁移文件是否存在
if [ -d "/app/prisma/migrations" ]; then
  echo "找到迁移文件，开始应用迁移..."
  # 运行 Prisma 迁移
  npx prisma migrate deploy
else
  echo "未找到迁移文件，创建新的迁移..."
  # 创建新的迁移
  npx prisma migrate dev --name init
fi

# 生成 Prisma 客户端
echo "生成 Prisma 客户端..."
npx prisma generate

echo "数据库初始化完成"
