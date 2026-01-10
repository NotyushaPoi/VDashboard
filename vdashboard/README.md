# Harumonie - 春和音专辑应用

主播展示平台应用，展示主播信息、歌单和作品。

## 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev        # http://localhost:3000

# 生产构建
pnpm build
pnpm start
```

## 目录结构

```
app/
├── components/        # React 组件
├── lib/               # 工具和类型
├── [slug]/            # 主播详情页动态路由
├── home/              # 首页
├── layout.tsx         # 根布局 (Dark Mode 支持)
├── globals.css        # 全局样式
└── not-found.tsx      # 404 页面

public/data/
├── streamers.json     # 主播索引 (构建时生成)
├── streamers/         # 各主播详细数据 (构建时生成)
└── videos.json        # 视频列表 (手动维护)

data/
├── metadata.yaml      # 全局配置
├── streamers/         # 主播信息 YAML
├── songs/             # 歌曲库 YAML
├── playlists/         # 歌单配置 YAML
└── lyrics/            # 歌词文件 (预留)

scripts/
└── build-data.ts      # YAML → JSON 构建脚本
```

## 页面

- `/home` - 首页 (主播列表 + 视频轮播)
- `/{slug}` - 主播详情页 (如 `/kirara`, `/yvainne`)
- `/404` - 页面未找到

## 核心特性

- ✨ **响应式设计** - 手机、平板、桌面完美适配
- 🌙 **Dark Mode** - 完整深色模式支持，localStorage 持久化
- 🎨 **品牌色** - 每个主播独立品牌色，动态应用到页面
- ⚡ **SSG** - 静态生成 + ISR 增量更新
- 📊 **YAML 数据** - 构建时转换为 JSON，便于维护

## 数据系统

使用 YAML 作为数据源，构建时自动转换为 JSON：

- `data/streamers/` - 主播信息 (id, name, bio, themeColors...)
- `data/songs/` - 歌曲库 (id, name, artist, lyrics...)
- `data/playlists/` - 歌单配置 (按 slug 引用歌曲 ID)

详见 [数据结构文档](./DATA_STRUCTURE.md)

## 修改数据

### 编辑主播信息

编辑 `data/streamers/{slug}.yaml`：

```yaml
id: 1
name: "希罗Kirara"
slug: "kirara"
bio: "简介..."
avatar: "/images/streamers/kirara.jpg"
banner: "/images/streamers/banner.jpg"
themeColors:
  primary: "#FCBD91"
  secondary: "#FFAAA8"
```

### 添加歌曲

在 `data/songs/all.yaml` 中添加：

```yaml
- id: "song_001"
  name: "歌曲名"
  artist: "艺术家"
  genre: "流派"
  tag: "标签"
  language: "中文"
  album: "专辑"
  lyrics: "[00:00]歌词"
  url: "https://..."
```

### 配置歌单

在 `data/playlists/{slug}.yaml` 中引用歌曲 ID：

```yaml
playlists:
  - name: "歌单名"
    songs:
      - "song_001"
      - "song_002"
```

修改后运行 `pnpm build` 自动转换为 JSON。

## 样式和主题

- **Tailwind CSS v4** - 原生深色模式支持
- **自定义 Context** - 主题管理（不依赖外部库）
- **品牌色应用** - 每个主播页面应用其 primary 和 secondary 颜色

## 部署

### Vercel (推荐)

1. 推送代码到 GitHub
2. 在 Vercel 连接仓库
3. 自动构建和部署

### 自托管

运行 `pnpm build` 生成静态文件，部署 `.next` 输出。

详见 [开发指南](./DEVELOPMENT.md)

## 技术栈

- **Next.js 16** - App Router
- **React 19** - 前端框架
- **TypeScript 5** - 类型安全
- **Tailwind CSS 4** - 样式系统
- **js-yaml** - YAML 解析
- **AJV** - 数据验证

## 常见问题

**Q: 如何添加新主播？**  
A: 在 `data/streamers/` 中创建 `{slug}.yaml`，在 `data/playlists/` 中创建 `{slug}.yaml`，在 `data/metadata.yaml` 中注册。然后运行 `pnpm build`。

**Q: 歌词在哪修改？**  
A: 在 `data/songs/` 的 YAML 文件中编辑 `lyrics` 字段（支持 LRC 格式）。

**Q: 如何替换图片？**  
A: 将图片放入 `public/images/streamers/`，在 YAML 中更新路径。

**Q: 生成的 JSON 文件在哪？**  
A: `public/data/streamers.json` 和 `public/data/streamers/{slug}.json`（构建时产生，不提交 git）。
