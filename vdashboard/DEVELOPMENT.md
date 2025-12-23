# VDashboard 开发指南

## 快速开始

### 安装依赖
```bash
cd /Users/notyushapoi/VDashboard/vdashboard
pnpm install
```

### 启动开发服务器
```bash
pnpm dev
```

服务器将在 `http://localhost:3000` 启动，支持热重载。

## 项目架构

### 核心层次

```
Page (展示层)
  ↓
Component (组件层) 
  ↓
Utils + Types (逻辑层)
  ↓
Data (数据层)
```

### 数据流

1. **主页** (`page.tsx`)
   - 调用 `getAllStreamers()` 获取所有主播
   - 使用 `Carousel` 和网格组件展示

2. **子页面** (`streamer/[id]/page.tsx`)
   - 调用 `getStreamerById(id)` 获取特定主播
   - 使用 `TabPanel` 显示歌单和番剧

3. **数据加载** (`lib/utils.ts`)
   - 读取 `public/data/streamers.json`
   - 提供缓存机制（可选）

## 常见任务

### 添加新主播

1. 编辑 `public/data/streamers.json`
2. 添加新对象到 `streamers` 数组
3. 确保 `id` 唯一且递增

```json
{
  "id": 7,
  "name": "新主播名称",
  "bilibiliId": "xxx",
  "liveUrl": "https://www.bilibili.com/7",
  ...
}
```

4. 保存并刷新页面（开发模式下自动热重载）

### 更新歌单

编辑 `public/data/streamers.json` 中对应主播的 `playlists` 字段：

```json
{
  "name": "新歌单",
  "songs": [
    {
      "name": "歌曲名",
      "artist": "艺术家",
      "genre": "流派",
      "lyrics": "歌词...",
      "url": "https://music.url"
    }
  ]
}
```

### 修改样式

全局样式在 `app/globals.css` 中，使用 Tailwind CSS。

组件样式直接在组件文件中使用 Tailwind class，例如：

```tsx
<div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
  内容
</div>
```

Dark Mode 前缀为 `dark:`，会自动应用。

### 添加新组件

1. 在 `app/components/` 创建新文件，例如 `NewComponent.tsx`
2. 导出组件函数：

```tsx
export function NewComponent() {
  return <div>Content</div>;
}
```

3. 在需要的地方导入使用：

```tsx
import { NewComponent } from "@/app/components/NewComponent";
```

## 代码规范

### 文件命名
- 组件：PascalCase (e.g., `Carousel.tsx`)
- 工具/库：camelCase (e.g., `utils.ts`)
- 样式：lowercase (e.g., `globals.css`)

### 组件模式
```tsx
"use client";  // 如果使用客户端功能（交互、状态等）

import { useState } from "react";

interface ComponentProps {
  title: string;
  onClick?: () => void;
}

export function Component({ title, onClick }: ComponentProps) {
  const [state, setState] = useState(false);
  
  return <div>{title}</div>;
}
```

### TypeScript 类型
所有类型定义在 `app/lib/types.ts`，导入使用：

```tsx
import type { Streamer, Playlist } from "@/app/lib/types";
```

## 调试技巧

### 检查控制台
浏览器 DevTools → Console 标签查看错误信息

### 查看编译错误
IDE 中会显示 TypeScript 错误，或在终端查看 `pnpm dev` 输出

### 数据检查
在 `lib/utils.ts` 中添加日志：

```typescript
export async function getStreamersData(): Promise<StreamersData> {
  const data = await loadStreamersFromFile();
  console.log("Loaded streamers:", data); // 开发用
  return data;
}
```

### 样式调试
在 Firefox/Chrome DevTools 中：
- 选择元素
- 检查 Tailwind class 是否应用
- 查看 Dark Mode 是否正确激活

## 性能优化

### 缓存策略
- `export const revalidate = 60` - 页面缓存 60 秒（可调整）
- JSON 数据在首次加载后被缓存到内存

### 图片优化
使用 `next/image` 而不是 HTML `<img>`：

```tsx
import Image from "next/image";

<Image
  src="/images/example.jpg"
  alt="描述"
  width={800}
  height={600}
  priority  // 首屏图片使用
/>
```

## 测试清单

### 新功能上线前检查

- [ ] 本地运行 `pnpm dev` 无错误
- [ ] 浏览器 DevTools 控制台无报错
- [ ] 运行 `pnpm lint` 无 ESLint 错误
- [ ] Dark Mode 切换正常
- [ ] 移动端响应式显示正常
- [ ] 点击链接跳转正确
- [ ] 复制功能有效
- [ ] 歌词模态框能打开和关闭

### 生产构建

```bash
pnpm build
pnpm start
```

访问 `http://localhost:3000` 测试生产版本。

## 常见问题

### Q: 修改了 JSON 但没有更新？
A: 清除 `.next` 缓存目录：
```bash
rm -rf .next
pnpm dev
```

### Q: Dark Mode 不工作？
A: 确保 HTML 标签有 `suppressHydrationWarning`，并且 ThemeProvider 包装了内容。

### Q: 页面加载缓慢？
A: 检查是否有大图片未优化，或数据过多。可调整 `revalidate` 值或分页。

### Q: TypeScript 报错但代码能运行？
A: 运行 `pnpm install` 确保类型定义完整，或检查 `tsconfig.json` 设置。

## 版本信息

- Next.js: 16.1.1
- React: 19.2.3
- TypeScript: 5
- Tailwind CSS: 4
- next-themes: 0.4.6

## 有用的链接

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [React 文档](https://react.dev)
