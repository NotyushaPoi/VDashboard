# VDashboard - 主播展示平台

一个现代化的主播展示平台，支持 Dark Mode，展示主播信息、歌单和追番列表。

## 🚀 功能特性

- ✅ **响应式设计** - 完美支持移动、平板和桌面设备
- ✅ **Dark Mode** - 自动根据系统偏好设置，支持手动切换
- ✅ **轮播展示** - 主页轮播展示所有主播，点击可跳转到详情页
- ✅ **标签页组件** - 歌单和追番分类展示
- ✅ **歌词显示** - 弹出模态框展示歌词，支持复制
- ✅ **一键复制** - 复制歌曲名和番剧名到剪贴板
- ✅ **动态路由** - 每个主播独立页面，`/streamer/[id]` 格式
- ✅ **SEO 优化** - 自动生成 Meta 标签

## 📁 项目结构

```
app/
├── page.tsx                      # 主页
├── layout.tsx                    # 根布局 + Dark Mode Provider
├── globals.css                   # 全局样式
├── components/
│   ├── Navbar.tsx               # 导航栏 + Dark Mode 切换
│   ├── Carousel.tsx             # 轮播组件
│   ├── CopyButton.tsx           # 复制按钮
│   ├── LyricsModal.tsx          # 歌词模态框
│   ├── ThemeProvider.tsx        # 主题提供器
│   └── ThemeToggle.tsx          # 主题切换按钮
├── lib/
│   ├── types.ts                 # TypeScript 类型定义
│   └── utils.ts                 # 工具函数（数据加载）
└── streamer/
    ├── [id]/
    │   ├── page.tsx             # 子页面模板
    │   └── not-found.tsx        # 404 页面
    └── components/
        └── TabPanel.tsx         # 标签页组件

public/
├── data/
│   └── streamers.json           # 主播数据（JSON格式）
└── images/
    └── streamers/               # 主播相关图片
```

## 📊 数据结构

主播数据存储在 `public/data/streamers.json`，结构如下：

```json
{
  "streamers": [
    {
      "id": 1,
      "name": "主播名称",
      "bilibiliId": "B站UID",
      "liveUrl": "直播间链接",
      "avatar": "/images/streamers/avatar.jpg",
      "banner": "/images/streamers/banner.jpg",
      "bio": "简短介绍",
      "description": "详细介绍",
      "fans": "粉丝数或'加载中...'",
      "playlists": [
        {
          "name": "歌单名称",
          "songs": [
            {
              "name": "歌曲名",
              "artist": "艺术家",
              "genre": "流派",
              "lyrics": "歌词内容",
              "url": "歌曲链接"
            }
          ]
        }
      ],
      "animes": [
        {
          "name": "番剧名称",
          "episodes": 12,
          "status": "在看",
          "url": "番剧链接"
        }
      ]
    }
  ]
}
```

## 🔧 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器 (localhost:3000)
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 运行 ESLint
pnpm lint
```

## 🎨 Dark Mode 使用

主题切换由 `next-themes` 提供支持，自动保存用户偏好到 localStorage。

点击导航栏右上角的主题切换按钮即可在 Light/Dark 模式间切换。

## 📝 更新主播数据

### 方法 1：直接编辑 JSON 文件

编辑 `public/data/streamers.json`，修改或添加主播信息。

### 方法 2：通过 Git + CI/CD（推荐）

1. 将项目托管到 GitHub
2. 在本地修改 `streamers.json`
3. 提交并推送到 GitHub
4. 在服务器拉取最新代码并重新 build：

```bash
cd /path/to/vdashboard
git pull origin main
pnpm install
pnpm build
pm2 restart vdashboard  # 如果使用 PM2
```

## 🖼️ 图片资源

### 占位图

目前所有占位图采用渐变色生成（紫粉色系）。

### 替换真实图片

将图片放入 `public/images/streamers/` 目录，然后在 JSON 中更新路径：

```json
{
  "avatar": "/images/streamers/streamer-name.jpg",
  "banner": "/images/streamers/streamer-banner.jpg"
}
```

支持的格式：JPG, PNG, WebP

## 📱 响应式设计

- **手机 (< 640px)** - 单列布局
- **平板 (640px - 1024px)** - 两列布局
- **桌面 (> 1024px)** - 三列布局

## 🌐 关于 B 站粉丝数

目前粉丝数显示为"加载中..."的占位符。如需实时获取，可通过以下方式实现：

### 使用 Next.js API Routes (推荐)

创建 `app/api/bilibili-stats/[uid]/route.ts`：

```typescript
export async function GET(request: Request, props: { params: Promise<{ uid: string }> }) {
  const { uid } = await props.params;
  const response = await fetch(`https://api.bilibili.com/x/relation/stat?vmid=${uid}`);
  const data = await response.json();
  return Response.json(data);
}
```

然后在 `utils.ts` 中调用此 API 获取粉丝数。

## 🔒 环境变量

暂无需要的环保变量。如后续需要 API 密钥，在 `.env.local` 中配置。

## 🚀 部署

### Vercel（推荐）

```bash
npm install -g vercel
vercel
```

### 自托管

```bash
pnpm build
pnpm start
```

或使用 PM2：

```bash
pm2 start "npm start" --name vdashboard
```

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请通过 GitHub Issues 反馈。
