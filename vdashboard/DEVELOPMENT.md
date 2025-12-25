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

### 数据层次架构（Plan 4：混合索引）

VDashboard 采用**两层混合数据架构**以支持大规模扩展：

```
Layer 1 - 索引层 (Lightweight Index)
├─ 文件: public/data/streamers.json (~2KB)
├─ 用途: 主页快速加载
├─ 包含: ID、名称、头像、粉丝数、歌单数、歌曲数
└─ 加载: 服务端渲染主页时

Layer 2 - 详情层 (Detail Files)
├─ 目录: public/data/streamers/
├─ 文件: 1-名字.json, 2-名字.json ... (每个100-200行)
├─ 用途: 子页面完整展示，懒加载
├─ 包含: 完整主播资料、所有歌单、歌词、番剧列表
└─ 加载: 用户进入 /streamer/[id] 时
```

### 核心层次（代码执行流）

```
Page 层 (展示)
  ├─ app/page.tsx (主页，使用索引层)
  └─ app/streamer/[id]/page.tsx (子页面，使用详情层)
    ↓
Component 层 (组件)
  ├─ Carousel (轮播主播)
  ├─ TabPanel (歌单/番剧选项卡)
  └─ LyricsModal (歌词弹窗)
    ↓
Utils + Types 层 (逻辑)
  ├─ getStreamersIndex() - 获取索引数据
  ├─ getStreamerById(id) - 获取主播详情（带缓存）
  └─ types.ts - 类型定义
    ↓
Data 层 (存储)
  ├─ public/data/streamers.json (索引)
  ├─ public/data/streamers/*.json (详情)
  └─ public/data/videos.json (独立视频)
```

### 数据流

1. **主页加载**
   - 调用 `getStreamersIndex()` → 读取 streamers.json (~2KB)
   - 提取索引数据（id, name, avatar, playlistCount, songCount）
   - 使用 Carousel 和网格组件展示主播卡片

2. **进入主播子页面**
   - 调用 `getStreamerById(id)` → 从 streamers/[id].json 懒加载完整数据
   - 结果缓存在内存 Map，避免重复读取
   - 展示完整主播资料、歌单、番剧列表

3. **缓存机制**
   - 索引数据：首次加载后内存缓存
   - 详情数据：`Map<number, Streamer>` 中的 LRU 式缓存
   - 好处：重复访问无需文件 I/O

## 常见任务

### 添加新主播

两层文件都需要更新：

#### 1️⃣ 第 1 层 - 索引文件 (`public/data/streamers.json`)

添加新主播的元数据条目：

```json
{
  "id": 7,
  "name": "新主播名称",
  "bio": "简短介绍，30 字以内",
  "avatar": "/images/streamers/avatar.jpg",
  "fans": "1.2万",
  "playlistCount": 3,
  "songCount": 18,
  "file": "7-新主播名称.json"
}
```

#### 2️⃣ 第 2 层 - 详情文件 (`public/data/streamers/7-新主播名称.json`)

创建新文件，包含完整信息：

```json
{
  "id": 7,
  "name": "新主播名称",
  "bilibiliId": "123456",
  "liveUrl": "https://www.bilibili.com/123456",
  "bilibiliSpaceUrl": "https://space.bilibili.com/123456",
  "avatar": "/images/streamers/avatar.jpg",
  "banner": "/images/streamers/banner.jpg",
  "bio": "简短介绍",
  "description": "详细介绍，支持多行内容\n可以包含基本信息和特色亮点",
  "cloudMusicUrl": "https://music.163.com/user/xxx",
  "redUrl": "https://www.xiaohongshu.com/user/xxx",
  "playlists": [
    {
      "name": "点唱曲库",
      "songs": [
        {
          "name": "歌曲名",
          "artist": "艺术家",
          "genre": "流派",
          "tag": "标签",
          "language": "语言",
          "album": "专辑",
          "lyrics": "完整歌词...",
          "url": "https://music.url"
        }
      ]
    }
  ],
  "animes": [
    {
      "name": "番剧名",
      "episodes": 12,
      "status": "在看",
      "url": "https://anime.url"
    }
  ]
}
```

**提示**：为了保持 `playlistCount` 和 `songCount` 的准确性，建议：
- 手动更新这两个字段，或
- 运行 `scripts/sync-index.py` 自动计算（参见 CUSTOMIZATION.md）

### 更新歌单和番剧

**只修改第 2 层详情文件**（不需更新索引）：

编辑 `public/data/streamers/X-名字.json` 中的 `playlists` 和 `animes` 字段：

```json
{
  "playlists": [
    {
      "name": "点唱曲库",
      "songs": [
        {
          "name": "新歌曲名",
          "artist": "歌手",
          "genre": "流派",
          "tag": "标签",
          "language": "中文",
          "album": "专辑",
          "lyrics": "歌词内容...",
          "url": "https://music.url"
        }
      ]
    }
  ],
  "animes": [
    {
      "name": "番剧名",
      "episodes": 12,
      "status": "在看",
      "url": "https://anime.url"
    }
  ]
}
```

**注意**：
- 第一个歌单自动作为"点唱曲库"，复制时添加"点歌 "前缀
- 歌词支持多行（使用 `\n` 换行）
- 状态值：`"在看" | "已完成" | "计划看"`

### 同步索引统计（可选）

如果手动修改了歌曲数量，可运行自动同步脚本更新索引的统计字段：

```bash
python3 scripts/sync-index.py
```

这会自动更新所有主播的 `playlistCount` 和 `songCount`。

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
