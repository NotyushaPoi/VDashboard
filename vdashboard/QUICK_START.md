# VDashboard 快速参考

## 🚀 一键启动

```bash
cd /VDashboard/vdashboard
pnpm dev
```

访问 http://localhost:3000

## 📂 核心文件位置

| 用途 | 文件路径 |
|------|---------|
| 主页 | `app/page.tsx` |
| 子页面模板 | `app/streamer/[id]/page.tsx` |
| 主播索引（轻量级）| `public/data/streamers.json` |
| 主播详情（单个文件）| `public/data/streamers/X-名字.json` |
| 独立视频数据 | `public/data/videos.json` |
| 类型定义 | `app/lib/types.ts` |
| 工具函数 | `app/lib/utils.ts` |
| 组件库 | `app/components/` |

## 🔄 数据更新流程

VDashboard 采用**两层数据架构**：轻量级索引 + 懒加载详情文件，支持高效扩展。

### 📊 数据层级说明

- **层级 1 - 索引** (`public/data/streamers.json`，~2KB)
  - 用途：主页快速加载，显示主播卡片统计信息
  - 包含：ID、名称、头像、简介、粉丝数、歌单数、歌曲数
  - 加载时机：页面首次加载

- **层级 2 - 详情** (`public/data/streamers/X-名字.json`，~200 行)
  - 用途：子页面完整显示主播信息、歌单、番剧
  - 包含：完整资料、所有歌单+歌词、追番列表
  - 加载时机：用户进入主播页面时（懒加载）

### 快速更新（仅修改歌单/番剧）
```bash
# 编辑对应主播的详情文件：
# public/data/streamers/1-希罗Kirara.json  （仅修改层级2，不需更新索引）

# 保存即可，开发服务器自动刷新
```

### 添加新主播
```bash
# 1. 更新索引文件（层级1）
#    编辑：public/data/streamers.json
#    添加新主播的基本信息

# 2. 创建详情文件（层级2）
#    新建：public/data/streamers/7-新主播名.json
#    复制已有主播的详情文件并修改内容

# 详见 CUSTOMIZATION.md "Scenario 2: 添加新主播"
```

### 完整更新（修改代码 + 数据）
```bash
# 1. 编辑代码或数据
# 2. 提交到 Git
git add .
git commit -m "update: 描述变更"
git push

# 3. 在服务器拉取并重建
# 在你的服务器上：
git pull origin main
pnpm install
pnpm build
pm2 restart vdashboard
```

## 📝 编辑主播信息模板

VDashboard 采用两层文件结构：

### 第 1 层：索引文件（`public/data/streamers.json`）
用于主页展示，包含基本信息和统计数据：

```json
{
  "streamers": [
    {
      "id": 1,
      "name": "希罗Kirara",
      "bio": "简短介绍",
      "avatar": "/images/streamers/kirara.jpg",
      "fans": "5.2万",
      "playlistCount": 3,
      "songCount": 18,
      "file": "1-希罗Kirara.json"
    }
  ],
  "videos": []
}
```

### 第 2 层：详情文件（`public/data/streamers/X-名字.json`）
当用户进入子页面时加载，包含完整信息：

```json
{
  "id": 1,
  "name": "希罗Kirara",
  "bilibiliId": "12345678",
  "liveUrl": "https://www.bilibili.com/12345678",
  "bilibiliSpaceUrl": "https://space.bilibili.com/12345678",
  "avatar": "/images/streamers/kirara.jpg",
  "banner": "/images/streamers/banner.jpg",
  "bio": "简短介绍",
  "description": "详细介绍，支持多行",
  "cloudMusicUrl": "https://music.163.com/user/xxx",
  "redUrl": "https://www.xiaohongshu.com/user/xxx",
  "playlists": [
    {
      "name": "点唱曲库",
      "songs": [
        {
          "name": "歌曲名",
          "artist": "艺术家名",
          "genre": "流派",
          "tag": "标签",
          "language": "中文",
          "album": "专辑名",
          "lyrics": "歌词\n换行写",
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

**重要提示**：
- 修改歌单/番剧：只需编辑**第 2 层**详情文件，自动同步到主页
- 添加新主播：需要同时更新**第 1 层**索引和**第 2 层**详情
- 详见 [CUSTOMIZATION.md](CUSTOMIZATION.md) 了解完整的两层维护流程

## 🎨 常见样式修改

### 改变主页卡片颜色
文件：`app/page.tsx`，搜索 `from-purple-400 to-pink-400`，改为：
- `from-blue-400 to-cyan-400` (蓝绿)
- `from-green-400 to-emerald-400` (绿色)
- `from-red-400 to-orange-400` (红橙)

### 改变子页面 Banner 颜色
文件：`app/streamer/[id]/page.tsx`，同上

## 🖼️ 添加真实图片

1. 将图片放入 `public/images/streamers/`
2. 在 JSON 中更新路径：
   ```json
   "avatar": "/images/streamers/kirara-avatar.jpg",
   "banner": "/images/streamers/kirara-banner.jpg"
   ```
3. 刷新页面

## 🔧 常用命令

```bash
# 启动开发服务器
pnpm dev

# 检查 TypeScript 错误
pnpm build

# 运行 ESLint
pnpm lint

# 删除缓存（如果修改后未更新）
rm -rf .next
pnpm dev

# 重新安装依赖
pnpm install
```

## 🌙 Dark Mode 测试

点击导航栏右上角的太阳/月亮图标切换 Light/Dark 模式。

## 📱 响应式测试

按 F12 打开浏览器开发者工具，选择不同设备尺寸预览：
- iPhone (< 640px)
- iPad (640-1024px)
- Desktop (> 1024px)

## 🔗 重要链接

- [项目文档](./README_VDASHBOARD.md)
- [开发指南](./DEVELOPMENT.md)
- [数据和集成](./CUSTOMIZATION.md)
- [Next.js 官方文档](https://nextjs.org/docs)
- [Tailwind 文档](https://tailwindcss.com)

## 🐛 常见问题排查

| 问题 | 解决方案 |
|------|---------|
| 修改 JSON 后没有更新 | `rm -rf .next && pnpm dev` |
| Dark Mode 不工作 | 检查是否在根 layout 中使用了 ThemeProvider |
| 图片显示不了 | 检查路径是否正确，文件是否在 `public/` 目录 |
| 构建失败 | 检查 TypeScript 错误：`pnpm build` |
| 页面加载慢 | 检查图片大小，确保 < 1MB |

## 💡 小贴士

1. **始终使用 `@/` 路径别名** 导入本地模块
2. **Dark Mode 使用 `dark:` 前缀** 所有新样式
3. **JSON 修改后保存即自动刷新**（无需重启）
4. **添加新主播时确保 `id` 唯一**
5. **外链打开方式用 `target="_blank"`**

## 📞 需要帮助？

- 检查 [DEVELOPMENT.md](./DEVELOPMENT.md) 的调试技巧
- 查看 [CUSTOMIZATION.md](./CUSTOMIZATION.md) 的集成方案
- 在源代码中搜索类似功能的示例
