#!/bin/sh

# 等待数据库准备就绪
echo "Waiting for database to be ready..."
sleep 5

# 运行数据库迁移
echo "Running database migrations..."
npx prisma migrate deploy

# 检查是否需要初始化数据
if [ "$INIT_DATA" = "true" ]; then
  echo "Initializing database with seed data..."
  npx ts-node prisma/seed.ts
fi

# 启动应用
echo "Starting application..."
exec "$@"
