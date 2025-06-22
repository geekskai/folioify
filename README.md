# Folioify

AI 工具聚合平台，自动从 Toolify API 同步数据到 Supabase 数据库。

## 🚀 快速开始

### 开发环境

```bash
npm install
npm run dev
```

### 自动化数据同步

```bash
# 设置自动化同步系统
npm run sync:setup

# 检查配置
npm run sync:check-config

# 测试API
npm run sync:api-test
```

## 📊 功能特性

- ✅ **自动化数据同步**: 每周六凌晨 2 点自动同步
- ✅ **API 端点**: `/api/sync-data` 和 `/api/sync-status`
- ✅ **GitHub Actions**: 定时任务自动执行
- ✅ **分批处理**: 避免 Vercel 函数超时
- ✅ **错误重试**: 自动重试失败的请求

## 📁 项目结构

```
src/app/api/
├── sync-data/          # 数据同步API
└── sync-status/        # 状态查询API

.github/workflows/
└── sync-data.yml       # 定时任务

scripts/
├── setup-automation.ts    # 设置向导
├── check-config.ts       # 配置检查
└── test-sync-api.ts      # API测试
```

## 🔧 部署指南

详细部署步骤请查看：[SETUP_GUIDE.md](SETUP_GUIDE.md)

## 📖 文档

- [自动化同步指南](SETUP_GUIDE.md) - 完整的设置和使用文档

## 🛠️ 可用脚本

| 命令                        | 说明           |
| --------------------------- | -------------- |
| `npm run dev`               | 启动开发服务器 |
| `npm run sync:setup`        | 设置自动化同步 |
| `npm run sync:check-config` | 检查配置       |
| `npm run sync:api-test`     | 测试 API 端点  |

## 📊 监控

- **同步状态**: `/api/sync-status`
- **GitHub Actions**: 仓库 → Actions 页面
- **Vercel 日志**: Dashboard → Functions
