# WorkYeah 后端部署指南

## 快速开始

### 第一步：创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 "Start your project" 注册/登录
3. 点击 "New Project" 创建新项目
4. 填写项目信息：
   - Name: `workyeah`
   - Database Password: 设置强密码并保存
   - Region: 选择最近的区域（推荐 Singapore）
5. 等待项目创建完成（约2分钟）

### 第二步：获取 API 密钥

1. 进入项目后，点击左侧 **Settings** → **API**
2. 复制以下信息：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 第三步：配置环境

编辑 `config/env.js`：

```javascript
export default {
  SUPABASE_URL: 'https://xxxxx.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1Ni...',
  USE_BACKEND: true,
}
```

### 第四步：创建数据库表

1. 在 Supabase 控制台，点击左侧 **SQL Editor**
2. 点击 "New Query"
3. 复制 `schema.sql` 的全部内容并粘贴
4. 点击 "Run" 执行

### 第五步：导入种子数据

1. 在 SQL Editor 中新建查询
2. 复制 `seed.sql` 的全部内容并粘贴
3. 点击 "Run" 执行

### 第六步：安装依赖

在项目根目录执行：

```bash
npm install
```

### 第七步：启用后端

编辑 `config/env.js`，将 `USE_BACKEND` 改为 `true`

## 文件结构

```
WorkYeah/
├── config/
│   └── env.js              # 环境配置
├── database/
│   ├── schema.sql          # 数据库表结构
│   ├── seed.sql            # 种子数据 SQL
│   ├── seed-data.json      # 种子数据 JSON
│   └── SETUP.md            # 本文档
├── mixins/
│   └── dataMixin.js        # 数据加载 Mixin
├── utils/
│   ├── supabase.js         # Supabase 客户端
│   ├── api.js              # API 封装
│   └── dataService.js      # 数据服务层
└── package.json
```

## 数据库表结构

| 表名 | 用途 |
|------|------|
| `users` | 用户表 |
| `projects` | 项目表 |
| `project_members` | 项目成员表 |
| `tasks` | 一级任务表 |
| `subtasks` | 子任务表 |
| `messages` | 消息表 |
| `attachments` | 附件表 |
| `favorites` | 收藏表 |
| `subscription_plans` | 订阅计划表 |
| `user_subscriptions` | 用户订阅表 |
| `community_items` | 社区内容表 |
| `ai_agents` | AI Agent 表 |

## 切换数据源

- `USE_BACKEND = false`：使用本地静态数据（前端展示不变）
- `USE_BACKEND = true`：使用 Supabase 后端数据

## 安全说明

- ✅ 已启用行级安全策略（RLS）
- ✅ 用户只能访问参与的项目
- ✅ 公开项目所有人可查看
- ✅ 敏感操作需要认证

