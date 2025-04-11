# CONTRIBUTING.md

## 开发流程

1. 基于 `develop` 分支创建特性分支
2. 提交信息遵循 Conventional Commits
3. PR 需包含测试和文档更新

### ⚙️ 配置执行步骤

```bash
# 初始化 Husky
npx husky-init && npm install

# 安装基础工具链
npm install -D eslint prettier lint-staged @commitlint/{config-conventional,cli}
```
