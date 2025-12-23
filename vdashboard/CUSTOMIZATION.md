# VDashboard 资源和数据集成指南

## 🖼️ 替换占位图

### 当前占位图

所有占位图目前都使用 CSS 渐变色生成（紫粉色系），无实际文件。

### 替换步骤

#### 1. 准备图片文件

将你的图片放入 `public/images/streamers/` 目录。

**推荐规格：**
- Avatar（头像）: 200x200px，正方形，JPG/PNG/WebP
- Banner（宣传图）: 1200x300px，横向，JPG/PNG/WebP

#### 2. 更新 JSON 数据

编辑 `public/data/streamers.json`，修改主播的 `avatar` 和 `banner` 路径：

```json
{
  "id": 1,
  "name": "希罗Kirara",
  "avatar": "/images/streamers/kirara-avatar.jpg",
  "banner": "/images/streamers/kirara-banner.jpg",
  ...
}
```

#### 3. 验证

刷新页面，应该能看到真实图片。

### 示例结构

```
public/images/streamers/
├── kirara-avatar.jpg
├── kirara-banner.jpg
├── coco-avatar.jpg
├── coco-banner.jpg
├── mogu-avatar.jpg
├── mogu-banner.jpg
├── sakura-avatar.jpg
├── sakura-banner.jpg
├── qoo-avatar.jpg
├── qoo-banner.jpg
├── asaritsu-avatar.jpg
└── asaritsu-banner.jpg
```

## 🎭 自定义占位图样式

如需改变占位图的渐变色，编辑以下文件：

### 主页卡片占位图

文件: `app/page.tsx`

找到这部分代码：
```tsx
<div className="w-full h-40 bg-gradient-to-br from-purple-400 to-pink-400">
```

修改 `from-purple-400 to-pink-400` 为其他 Tailwind 颜色，例如：
- `from-blue-400 to-cyan-400`
- `from-green-400 to-emerald-400`
- `from-red-400 to-orange-400`

### 子页面 Banner 占位图

文件: `app/streamer/[id]/page.tsx`

找到：
```tsx
<div className="relative w-full h-80 md:h-96 bg-gradient-to-br from-purple-400 to-pink-400">
```

同样修改颜色。

### 头像占位图

文件: `app/page.tsx` 和 `app/streamer/[id]/page.tsx`

找到：
```tsx
<div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-300 to-pink-300">
```

修改颜色。

## 📊 集成 B 站实时粉丝数

目前粉丝数显示为"加载中..."，以下是集成真实数据的方案。

### 方案 1：Next.js API Routes（推荐 - 纯前端友好）

#### 1. 创建 API 路由

创建文件 `app/api/bilibili-stats/route.ts`：

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");

  if (!uid) {
    return Response.json({ error: "Missing uid parameter" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.bilibili.com/x/relation/stat?vmid=${uid}`
    );
    const data = await response.json();

    if (data.code === 0) {
      return Response.json({
        followers: data.data.follower,
      });
    } else {
      return Response.json(
        { error: "Failed to fetch from Bilibili" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

#### 2. 创建客户端 Hook

创建文件 `app/lib/hooks.ts`：

```typescript
"use client";

import { useState, useEffect } from "react";

export function useBilibiliStats(uid: string) {
  const [followers, setFollowers] = useState<string>("加载中...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`/api/bilibili-stats?uid=${uid}`);
        const data = await response.json();

        if (data.followers !== undefined) {
          // 格式化粉丝数
          const count = data.followers;
          if (count > 10000) {
            setFollowers(`${(count / 10000).toFixed(1)}万`);
          } else if (count > 1000) {
            setFollowers(`${(count / 1000).toFixed(1)}k`);
          } else {
            setFollowers(count.toString());
          }
        } else {
          setFollowers("获取失败");
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setFollowers("获取失败");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [uid]);

  return { followers, loading };
}
```

#### 3. 在组件中使用

在 `app/streamer/[id]/page.tsx` 中修改：

```tsx
"use client";  // 添加这一行

import { useBilibiliStats } from "@/app/lib/hooks";

export default function StreamerPage({ params }: StreamerPageProps) {
  const [streamer, setStreamer] = useState<Streamer | null>(null);
  const { followers } = useBilibiliStats(streamer?.bilibiliId || "");

  // ... 其他代码 ...

  return (
    // ... 
    <p className="text-gray-600 dark:text-gray-400">
      👥 粉丝: {followers}
    </p>
    // ...
  );
}
```

**注意**: 这需要将子页面改为客户端组件，可能影响 SEO。

### 方案 2：定时更新 JSON（推荐 - SEO 友好）

这是更好的方案，适合定时获取数据。

#### 1. 创建脚本

创建文件 `scripts/update-followers.js`：

```javascript
const fs = require("fs");
const path = require("path");

async function updateFollowers() {
  try {
    const dataPath = path.join(
      __dirname,
      "../public/data/streamers.json"
    );
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    for (const streamer of data.streamers) {
      try {
        const response = await fetch(
          `https://api.bilibili.com/x/relation/stat?vmid=${streamer.bilibiliId}`
        );
        const result = await response.json();

        if (result.code === 0) {
          const count = result.data.follower;
          if (count > 10000) {
            streamer.fans = `${(count / 10000).toFixed(1)}万`;
          } else if (count > 1000) {
            streamer.fans = `${(count / 1000).toFixed(1)}k`;
          } else {
            streamer.fans = count.toString();
          }
        }
      } catch (error) {
        console.error(`Failed to fetch followers for ${streamer.name}:`, error);
      }
    }

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log("Followers updated successfully");
  } catch (error) {
    console.error("Failed to update followers:", error);
  }
}

updateFollowers();
```

#### 2. 添加到 package.json scripts

编辑 `package.json`：

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "update-followers": "node scripts/update-followers.js"
  }
}
```

#### 3. 手动运行

```bash
pnpm update-followers
```

或使用 Cron 定时任务（在服务器上）：

```bash
# 每天凌晨2点更新粉丝数
0 2 * * * cd /path/to/vdashboard && pnpm update-followers
```

### 方案 3：GitHub Actions 自动更新（最专业）

创建文件 `.github/workflows/update-followers.yml`：

```yaml
name: Update Followers

on:
  schedule:
    # UTC时间 1AM = 北京时间 9AM
    - cron: "0 1 * * *"
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 10
      
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "pnpm"
      
      - name: Update followers
        run: pnpm update-followers
      
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add public/data/streamers.json
          git commit -m "chore: update followers" || exit 0
      
      - name: Push changes
        run: git push
```

这样每天会自动更新粉丝数并推送到 GitHub！

## 🔗 添加歌词来源

目前歌词是硬编码在 JSON 中的。要从第三方 API 获取歌词：

### 使用网易云 API

在 `lib/utils.ts` 中添加：

```typescript
export async function fetchLyricsFromNetEase(
  songName: string,
  artist: string
): Promise<string> {
  // 这是示例，实际需要调用网易云 API
  // 或其他歌词服务
  return "歌词内容";
}
```

然后在显示歌词时调用。

## 📝 完整的数据维护工作流

### 每周维护

1. **检查数据完整性**
   ```bash
   pnpm build  # 检查构建是否成功
   ```

2. **更新主播信息**
   - 编辑 `public/data/streamers.json`
   - 修改简介、歌单、番剧等

3. **提交更改**
   ```bash
   git add public/data/streamers.json
   git commit -m "update: 更新XXX主播的信息"
   git push
   ```

### 定期任务

- ✅ 每日：自动更新粉丝数（使用方案 2 或 3）
- ✅ 每周：检查外链是否有效
- ✅ 每月：检查图片是否完整显示

## 常见问题

### Q: 图片无法显示？
A: 检查路径是否正确，确保文件存在于 `public/images/streamers/`

### Q: API 返回错误？
A: B站 API 可能有速率限制，建议缓存结果

### Q: 如何添加新歌词？
A: 在 JSON 的歌曲对象中直接修改 `lyrics` 字段的内容

### Q: 占位图何时替换？
A: 当你收集到真实图片后随时可以替换
