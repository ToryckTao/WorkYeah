# WorkYeah 功能文档 (Vue 2 版本)

## 项目概述

WorkYeah 是一款基于 uni-app 框架开发的跨平台团队协作应用，采用 Vue 2 技术栈，支持 Android、iOS 及多种小程序平台。应用集成了项目管理、任务协作、AI 辅助、社区交流等核心功能，旨在提升团队协作效率。

---

## 技术架构

| 模块 | 技术方案 |
|------|----------|
| 前端框架 | Vue 2 + uni-app |
| 状态管理 | Options API |
| 后端服务 | Supabase |
| 认证系统 | Supabase Auth |
| 数据库 | Supabase PostgreSQL |
| 实时通信 | Supabase Realtime |

### 支持平台

- Android / iOS 原生应用
- 微信小程序
- 支付宝小程序
- 百度小程序
- 字节跳动小程序

---

## 功能模块

### 1. 用户系统

| 页面 | 路径 | 功能描述 |
|------|------|----------|
| 启动页 | /pages/splash/splash | 应用启动引导页 |
| 登录 | /pages/login/login | 邮箱密码登录，登录状态持久化 |
| 注册 | /pages/register/register | 新用户注册 |

**核心能力**
- 基于 Supabase Auth 的身份认证
- Token 自动刷新机制
- 本地存储会话状态

---

### 2. 首页工作台

| Tab | 功能描述 |
|-----|----------|
| 协作 | 展示用户参与的项目列表，支持快速进入项目工作台 |
| 任务 | 展示用户待办任务列表，按截止日期排序 |
| 社区 | 社区入口，包含模板浏览、项目展示、招募中心 |
| 我的 | 跳转至个人中心页面 |

**交互特性**
- 自定义底部 TabBar，中央悬浮 AI 助手入口
- 未读消息角标提醒
- 下拉刷新支持

---

### 3. 项目管理

| 页面 | 路径 | 功能描述 |
|------|------|----------|
| 项目详情 | /pages/project-detail/project-detail | 项目基础信息、成员列表 |
| 项目工作台 | /pages/project-workspace/project-workspace | 任务看板、消息协作、文件资产 |
| 任务树 | /pages/task-tree/task-tree | 任务层级结构可视化 |
| 任务详情 | /pages/task-detail/task-detail | 单任务详情编辑 |
| 产出分析 | /pages/progress-analysis/progress-analysis | 团队产出饱和度数据分析 |
| 资产管理 | /pages/assets/assets | 项目资产文件管理 |

**数据结构**
- projects: 项目基本信息
- project_members: 项目成员关系（角色、工作量）
- tasks: 任务及子任务
- messages: 项目消息记录

---

### 4. 日程管理

| 页面 | 路径 | 功能描述 |
|------|------|----------|
| 日历 | /pages/calendar/calendar | 日历视图，管理日程与截止日期 |
| 日程 | /pages/schedule/schedule | 日程列表管理 |

---

### 5. 社区功能

| 页面 | 路径 | 功能描述 |
|------|------|----------|
| 工作流集市 | /pages/marketplace/marketplace | 浏览、下载工作流模板 |
| 项目展示 | /pages/projects-showcase/projects-showcase | 社区项目展示列表 |
| 项目详情 | /pages/project-showcase-detail/project-showcase-detail | 展示项目详情页 |
| 招募中心 | /pages/recruitment/recruitment | 发布/浏览合作招募信息 |

**数据来源**
- community_items: 社区内容（模板、项目、招募）
- 支持按类型筛选与分页加载

---

### 6. AI 智能助手

| 功能 | 描述 |
|------|------|
| 小耶 Copilot | 基于项目上下文的智能对话助手 |
| 智能体架构 | 中枢智能体与成员子智能体的可视化架构图 |
| 个性化引导 | 根据用户工作风格生成定制化任务执行方案 |
| 快捷操作 | 预设快捷指令（查看评分标准、生成任务清单等） |

**智能体节点属性**
- persona: 工作人格类型（专家型/新手型/视觉型）
- tone: 沟通风格
- expertise: 专业领域
- workPattern: 工作模式

---

### 7. 个人中心

| 页面 | 路径 | 功能描述 |
|------|------|----------|
| 个人主页 | /pages/profile/profile | 用户信息展示、功能入口 |
| 我的仓库 | /pages/profile/repositories | 用户创建/参与的仓库列表 |
| 我的收藏 | /pages/profile/favorites | 收藏的项目/模板 |
| AI 设置 | /pages/profile/ai-settings | AI 能力配置 |
| 订阅计划 | /pages/profile/subscription | 订阅套餐管理 |
| 系统设置 | /pages/profile/settings | 应用设置 |

---

## API 服务层

### 认证模块 (auth)

```
signUp(email, password, userData)  // 用户注册
signIn(email, password)            // 用户登录
signOut()                          // 退出登录
getUser()                          // 获取当前用户
```

### 数据模块 (db)

```
getProjects(userId)                // 获取用户项目列表
getProjectById(projectId)          // 获取项目详情
getTasks(projectId)                // 获取项目任务
getMessages(projectId, limit)      // 获取项目消息
getFavorites(userId)               // 获取用户收藏
getCommunityItems(type, limit)     // 获取社区内容
getSubscriptionPlans()             // 获取订阅计划
getAiAgents()                      // 获取 AI 智能体配置
```

### 实时通信模块 (realtime)

```
subscribeToMessages(projectId, callback)  // 订阅项目消息
unsubscribe(channel)                      // 取消订阅
```

---

## 目录结构

```
WorkYeah/
├── pages/                    # 页面文件
│   ├── splash/              # 启动页
│   ├── login/               # 登录
│   ├── register/            # 注册
│   ├── index/               # 首页
│   ├── project-detail/      # 项目详情
│   ├── project-workspace/   # 项目工作台
│   ├── task-tree/           # 任务树
│   ├── task-detail/         # 任务详情
│   ├── calendar/            # 日历
│   ├── schedule/            # 日程
│   ├── marketplace/         # 工作流集市
│   ├── projects-showcase/   # 项目展示
│   ├── recruitment/         # 招募中心
│   ├── ai-chat/             # AI 对话
│   ├── progress-analysis/   # 产出分析
│   ├── assets/              # 资产管理
│   └── profile/             # 个人中心
├── components/              # 公共组件
├── utils/                   # 工具函数
│   ├── api.js              # API 封装
│   ├── supabase.js         # Supabase 客户端
│   └── dataService.js      # 数据服务层
├── config/                  # 配置文件
├── static/                  # 静态资源
├── pages.json              # 页面路由配置
├── manifest.json           # 应用配置
└── main.js                 # 应用入口
```

---

## 版本信息

- 应用版本: 1.0.0
- Vue 版本: 2.x
- uni-app 编译器版本: 3
- 微信小程序 AppID: wx98321e06078404b0

