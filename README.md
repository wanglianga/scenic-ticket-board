# 景区票务团队预约看板

## 原始需求

> 做一个景区票务和闸口工作人员使用的团队票预约看板，Svelte + Vite 可以把日期容量、团队名单、入园时段和闸口状态做得清爽。页面围绕旅行社团队、游客证件、导游信息、预约时段、已核验人数、未到人数、闸口通行和退改记录展开。票务人员要看到每个时段剩余容量、团队是否超员、证件是否缺失、导游是否已确认；闸口人员要在窄屏设备上快速核验团队、标记未到游客和处理临时换人。页面重点是让团队容量、入园节奏和异常名单一眼可见，而不是只展示订单表格。

## 项目简介

景区票务团队票预约看板系统，面向景区票务工作人员和闸口核验人员，提供团队预约信息实时展示、容量监控、核验管理等核心功能。系统强调数据可视化和操作效率，使团队容量、入园节奏和异常名单一眼可见。

### 核心功能

- **票务人员视角**：日期容量概览、时段剩余容量、团队列表、异常预警（超员/证件缺失/导游未确认）
- **闸口人员视角**：待核验队列、快速核验操作、未到游客标记、闸口状态监控
- **团队详情**：旅行社信息、游客证件列表、导游信息、预约时段、核验记录
- **响应式设计**：适配桌面端和窄屏移动设备

## 技术栈

- **前端框架**：Svelte 4 + TypeScript
- **构建工具**：Vite 5
- **样式方案**：Tailwind CSS 3
- **状态管理**：Svelte Stores（内置）
- **图标库**：lucide-svelte

## 启动方式

### 前置要求

- Node.js >= 18.0.0
- npm 或 pnpm

### 启动步骤

#### 1. 安装依赖

```bash
npm install
```

#### 2. 启动开发服务

```bash
npm run dev
```

访问地址：http://localhost:3000

#### 3. 构建生产版本

```bash
npm run build
```

#### 4. 预览生产构建

```bash
npm run preview
```

### Docker 一键启动（推荐）

#### 前置要求

- Docker >= 20.10
- Docker Compose >= 2.0

#### 启动命令

```bash
docker compose up --build
```

后台运行：

```bash
docker compose up --build -d
```

访问地址：http://localhost:3000

#### 停止和清理

```bash
docker compose down
```

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── CapacityCard.svelte      # 日期容量卡片
│   ├── TeamCard.svelte          # 团队卡片
│   ├── VisitorList.svelte       # 游客列表
│   ├── GateStatusCard.svelte    # 闸口状态卡片
│   ├── VerifyPanel.svelte       # 核验操作面板
│   ├── AlertBadge.svelte        # 异常标记
│   └── Header.svelte            # 页头导航
├── pages/               # 页面组件
│   ├── TicketBoard.svelte       # 票务人员看板
│   └── GateBoard.svelte         # 闸口人员看板
├── stores/              # 状态管理
│   ├── teamStore.ts             # 团队数据 store
│   └── gateStore.ts             # 闸口数据 store
├── data/                # 模拟数据
│   ├── mockTeams.ts             # 团队 mock 数据
│   └── mockGates.ts             # 闸口 mock 数据
├── types/               # 类型定义
│   └── index.ts
├── utils/               # 工具函数
│   └── format.ts
├── App.svelte
├── main.ts
└── app.css
```

## 功能说明

### 票务人员看板

- **日期容量概览**：展示当日各时段剩余容量、使用率、超员预警
- **团队列表**：按时段分组展示团队，显示超员/证件缺失/导游未确认状态
- **异常筛选**：快速筛选异常团队，支持搜索旅行社、订单号、导游

### 闸口人员看板

- **待核验队列**：按时段排序的待核验团队，支持快速搜索
- **快速核验**：一键全部核验、单个游客核验、标记未到
- **闸口状态**：实时显示各闸口在线状态、今日通行量、排队人数
- **导游确认**：快速确认导游签到
