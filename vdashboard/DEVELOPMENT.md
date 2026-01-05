# 开发指南

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev                    # http://localhost:3000

# 构建生产版本
pnpm build

# 运行生产服务器
pnpm start
```

## 代码结构

```
app/
├── components/            # React 组件
├── lib/
│   ├── types.ts          # TypeScript 类型定义
│   └── utils.ts          # 工具函数
├── [slug]/               # 主播详情页动态路由
├── home/                 # 首页
├── layout.tsx            # 根布局
├── globals.css           # 全局样式
└── not-found.tsx         # 404 页面

scripts/
└── build-data.ts         # YAML → JSON 构建脚本

data/                      # YAML 源文件（不提交 git）
├── metadata.yaml
├── streamers/
├── songs/
├── playlists/
└── lyrics/

public/data/              # 生成的 JSON（构建时产生）
├── streamers.json
└── streamers/*.json
```

## 常见任务

### 修改主播信息

编辑 `data/streamers/{slug}.yaml`：

```yaml
id: 1
name: "希罗Kirara"
slug: "kirara"
bio: "主播简介"
avatar: "/images/streamers/kirara.jpg"
banner: "/images/streamers/banner.jpg"
themeColors:
  primary: "#FCBD91"
  secondary: "#FFAAA8"
description: "详细介绍..."
```

然后运行 `pnpm build` 生成新的 JSON 文件。

### 添加歌曲

在 `data/songs/all.yaml` 中添加：

```yaml
- id: "new_song_001"
  name: "歌曲名"
  artist: "艺术家"
  genre: "流派"
  tag: "标签"
  language: "中文"
  album: "专辑"
  lyrics: "[00:00]歌词内容"
  url: "https://music.example.com"
```

### 配置歌单

在 `data/playlists/{slug}.yaml` 中按 ID 引用歌曲：

```yaml
playlists:
  - name: "点唱曲库"
    songs:
      - "new_song_001"
      - "another_song"
```

### 修改样式

- 全局样式：`app/globals.css`
- 组件样式：使用 Tailwind CSS class
- Dark Mode：使用 `dark:` 前缀

示例：
```tsx
<div className="bg-white dark:bg-gray-900">
  内容
</div>
```

### 添加新页面

在 `app/` 中创建新目录和 `page.tsx`：

```
app/
├── [slug]/
│   └── page.tsx          # 主播详情页
├── home/
│   └── page.tsx          # 首页
└── new-page/
    └── page.tsx          # 新页面
```

## 数据构建流程

运行 `pnpm build` 时：

1. 执行 `prebuild` 脚本 (`scripts/build-data.ts`)
2. 加载 `data/` 中的所有 YAML 文件
3. 验证数据结构 (使用 AJV JSON Schema)
4. 合并歌单中的歌曲引用
5. 生成 `public/data/streamers.json` 和 `public/data/streamers/{slug}.json`
6. Next.js 进行静态生成

生成的 JSON 文件已通过 `.gitignore` 排除，不会提交到 git。

## TypeScript 类型

主要类型定义在 `app/lib/types.ts`：

- `Streamer` - 主播信息
- `Song` - 歌曲信息
- `Playlist` - 歌单

在组件中导入使用：

```tsx
import type { Streamer } from '@/lib/types'

interface Props {
  streamer: Streamer
}
```

## 部署

### Vercel (推荐)

1. 推送代码到 GitHub
2. 在 [vercel.com](https://vercel.com) 连接仓库
3. 自动构建和部署

### 自托主

```bash
# 本地构建
pnpm build

# 生产启动
pnpm start
```

输出位于 `.next/` 目录。

## 常见问题

**Q: 修改 YAML 后页面没有更新？**  
A: 需要运行 `pnpm build` 重新生成 JSON 文件。

**Q: 如何测试特定主播页面？**  
A: 访问 `http://localhost:3000/{slug}`，如 `http://localhost:3000/kirara`

**Q: 如何查看构建日志？**  
A: 运行 `pnpm build` 时查看输出。数据验证错误会显示在 console。

**Q: 可以直接编辑生成的 JSON 吗？**  
A: 不建议，下次构建会覆盖。所有修改应在 YAML 源文件中进行。

## 调试

### 查看生成的 JSON

构建后查看：
- `public/data/streamers.json` - 主播索引
- `public/data/streamers/kirara.json` - 希罗的完整数据

### TypeScript 检查

```bash
# 运行 TypeScript 编译器
pnpm tsc --noEmit

# 或在 build 时会自动检查
pnpm build
```

### ESLint 检查

```bash
pnpm lint
```

## 更多信息

- [应用说明](./README.md) - 项目概览
- [数据结构](./DATA_STRUCTURE.md) - YAML 格式详解
- [项目结构](../PROJECT_STRUCTURE.md) - 整体目录组织
