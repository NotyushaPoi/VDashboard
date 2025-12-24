# VDashboard 功能使用指南

## 🎯 新功能快速参考

### 1️⃣ **主题切换**
- 位置：导航栏右上角
- 点击太阳🌞/月亮🌙图标即可切换
- 自动保存偏好设置到本地

### 2️⃣ **轮播图自定义链接**
在 JSON 中修改 `carouselUrl` 字段：

```json
{
  "carouselUrl": "https://space.bilibili.com/8230334"  // 改为你想要的链接
}
```

### 3️⃣ **歌单搜索和筛选**
**位置**: 主播详情页 > 歌单区域

**搜索框**: 输入歌曲名称实时搜索
```
输入 "3月9日" → 快速找到该歌曲
```

**4个筛选框** (全部可组合使用):
- 📌 **标签**: 摇滚、民谣、电音、K-pop 等
- 🌍 **语言**: 中文、日语、韩语、英语
- 🎤 **歌手**: 搜索特定歌手的所有歌曲
- 💿 **专辑**: 按专辑分组

**示例**: 找出所有日语摇滚歌曲
```
1. 语言筛选框 → 选择"日语"
2. 标签筛选框 → 选择"摇滚"
3. 结果 → 显示匹配的歌曲数量
```

### 4️⃣ **Banner 左右按钮**
**主播详情页顶部 Banner**

| 左半部分 | 右半部分 |
|---------|---------|
| 鼠标悬停 → 显示"B站主页" | 鼠标悬停 → 显示"进入直播" |
| 点击 → 打开B站空间 | 点击 → 打开直播间 |

### 5️⃣ **社交媒体按钮**
**位置**: 【进入直播间】【返回首页】按钮下方

```
📺 B站主页    🎵 网易云    ❤️ 小红书
```

## ⚙️ JSON 数据修改

### 添加新歌曲
```json
{
  "name": "歌曲名",
  "artist": "歌手名",
  "genre": "流行",
  "tag": "标签",        // 新字段
  "language": "中文",    // 新字段
  "album": "专辑名",     // 新字段
  "lyrics": "歌词内容",
  "url": "https://music.example.com/song"
}
```

### 更新主播社交链接
```json
{
  "cloudMusicUrl": "https://music.163.com/#/user/home?id=xxxxx",
  "redUrl": "https://www.xiaohongshu.com/user/profile/xxxxx"
}
```

### 修改轮播链接
```json
{
  "carouselUrl": "https://space.bilibili.com/{uid}"  // B站空间
  // 或
  "carouselUrl": "https://www.bilibili.com/video/BV1xx411c7mD"  // 视频
  // 或
  "carouselUrl": "/streamer/1"  // 内部路由
}
```

## 🚀 快速命令

```bash
# 开发模式
cd vdashboard
pnpm dev          # 或 npm run dev

# 生产构建
pnpm build
pnpm start

# 验证代码
pnpm lint
```

## 📍 关键文件位置

| 功能 | 文件 |
|------|------|
| 数据 | `public/data/streamers.json` |
| 样式 | `app/globals.css` |
| 搜索筛选 | `app/streamer/components/TabPanel.tsx` |
| 详情页布局 | `app/streamer/[id]/page.tsx` |
| 轮播 | `app/components/Carousel.tsx` |
| 主题 | `app/components/ThemeToggle.tsx` |

## ❓ 常见问题

**Q: 为什么搜索不到某首歌曲？**
A: 检查 JSON 中该歌曲是否存在，大小写敏感

**Q: 如何添加新的筛选条件？**
A: 修改 `TabPanel.tsx` 中的 `useMemo` 钩子和 `filteredSongs` 逻辑

**Q: 轮播图如何指向外部链接？**
A: 在 `carouselUrl` 中使用完整 URL（以 `http://` 或 `https://` 开头）

**Q: 能否隐藏某个筛选框？**
A: 在 `TabPanel.tsx` 中注释相应的 `<div>` 块即可

## 💡 开发提示

1. **实时预览**: 修改 JSON 或 TSX，浏览器自动刷新
2. **类型检查**: 所有组件都启用了 TypeScript 严格模式
3. **深色模式**: 所有组件都支持 `dark:` 前缀的样式
4. **移动适配**: 使用 Tailwind 响应式断点 (`sm:`, `md:`, `lg:`)

