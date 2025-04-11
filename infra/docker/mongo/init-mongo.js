// ==================== 安全增强 ====================
// 1. 切换到目标数据库（显式创建数据库）
db = db.getSiblingDB("tacticore");

// 2. 创建专用用户
db.createUser({
  user: "tacticore",
  pwd: "pwd-tacticore", // 生产环境应从环境变量获取
  roles: [
    { role: "readWrite", db: "tacticore" }, // 应用数据库权限
    { role: "clusterMonitor", db: "admin" }, // 监控权限（可选）
  ],
});

// 3. 创建初始集合（可选）
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email"],
      properties: {
        username: { bsonType: "string" },
        email: { bsonType: "string" },
      },
    },
  },
});

// 4. 创建索引（可选）
db.users.createIndex({ email: 1 }, { unique: true });

// 5. 插入初始数据（可选）
db.users.insertOne({
  username: "admin",
  email: "admin@tacticore.com",
  createdAt: new Date(),
});

// 6. 验证结果（调试用）
print("========== 初始化完成 ==========");
printjson(db.getUsers());
