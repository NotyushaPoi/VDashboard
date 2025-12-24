# 变更日志 (CHANGELOG)

## [2024-12-24] - VDashboard v1.1.0

### 🎉 新增功能

#### 1. **主题切换修复** 
- ✨ 修复深色/浅色主题切换功能
- ✨ 主题选择现在正确保存到本地存储
- ✨ 优化 ThemeProvider 配置，改进过渡效果

#### 2. **自定义轮播链接**
- ✨ 轮播图现在支持自定义链接 (`carouselUrl`)
- ✨ 支持外部 URL（自动在新标签页打开）
- ✨ 支持内部路由链接
- ✨ 社交链接字段: `cloudMusicUrl`, `redUrl`

#### 3. **番剧功能移除**
- ✨ 隐藏主页卡片中的"📺 番剧数"统计
- ✨ 详情页完全移除番剧标签页
- ✨ 清空所有主播的番剧数据

#### 4. **粉丝数隐藏**
- ✨ 主页卡片中隐藏粉丝数显示
- ✨ 详情页中隐藏粉丝数（保留 UID）

#### 5. **歌单搜索功能**
- ✨ 新增搜索框，支持按歌名实时搜索
- ✨ 添加 4 个下拉筛选框：
  - 标签 (Tag)：摇滚、民谣、电音等
  - 语言 (Language)：中文、日语、韩语、英语
  - 歌手 (Artist)：按歌手分组
  - 专辑 (Album)：按专辑分组
- ✨ 筛选条件可自由组合
- ✨ 显示搜索结果计数
- ✨ 无结果时显示友好提示

#### 6. **歌曲数据扩展**
- ✨ 新增字段：`tag`, `language`, `album`
- ✨ 所有歌曲数据已填充这些新字段
- ✨ 支持更灵活的分类和组织

#### 7. **Banner 布局重构**
- ✨ Banner 改为左右分区设计
- ✨ 左侧：B站主页按钮（hover显示）
- ✨ 右侧：直播间按钮（hover显示）
- ✨ 中央：主播名字和图标（始终显示）

#### 8. **社交媒体按钮**
- ✨ 新增三个社交媒体快捷按钮
- ✨ 📺 B站主页（蓝色）
- ✨ 🎵 网易云音乐（红色）
- ✨ ❤️ 小红书（粉色）
- ✨ 按钮位置：详情页【进入直播间】【返回首页】下方

### 📝 类型系统更新

```typescript
// Song 接口新增字段
interface Song {
  tag?: string;       // 标签/分类
  language?: string;  // 语言
  album?: string;     // 专辑
}

// Streamer 接口新增字段
interface Streamer {
  carouselUrl?: string;     // 轮播图链接
  cloudMusicUrl?: string;   // 网易云主页
  redUrl?: string;          // 小红书主页
}
```

### 🗂️ 文件更改

#### 修改的文件
- `app/globals.css` - 深色模式样式
- `app/page.tsx` - 移除番剧和粉丝显示
- `app/components/ThemeProvider.tsx` - 修复主题配置
- `app/components/Carousel.tsx` - 支持自定义链接
- `app/components/LyricsModal.tsx` - 兼容多个接口
- `app/streamer/[id]/page.tsx` - 重构 Banner，添加社交按钮
- `app/streamer/components/TabPanel.tsx` - 完全重构（搜索+筛选）
- `app/lib/types.ts` - 更新类型定义
- `public/data/streamers.json` - 更新所有主播数据

#### 新增的文件
- `UPDATE_SUMMARY_2024.md` - 详细变更总结
- `QUICK_REFERENCE.md` - 快速使用指南

### 📊 数据变更

#### 所有主播数据更新
1. 希罗Kirara (UID: 8230334)
2. Yvaine可可 (UID: 9638159)
3. 恰恰恰蘑菇 (UID: 399491783)
4. 姬月樱 (UID: 5744398)
5. 悄悄Qoo (UID: 1436878388)
6. 浅律Asaritsu (UID: 6483585)

#### 变更内容
- ✅ 番剧数组清空
- ✅ liveUrl 改为直播间链接
- ✅ 新增 carouselUrl, cloudMusicUrl, redUrl
- ✅ 所有歌曲添加 tag, language, album
- ✅ 移除粉丝数显示

### 🧪 测试情况

- ✅ TypeScript 编译通过
- ✅ 生产构建成功 (`pnpm build`)
- ✅ 开发服务器启动正常
- ✅ 所有 6 个主播详情页正常生成

### 🚀 部署

```bash
# 生产构建
pnpm build

# 本地运行
pnpm start

# 开发模式
pnpm dev
```

### 📋 向后兼容性

- ✅ 完全向后兼容
- ✅ 新字段都是可选的 (`?`)
- ✅ 现有代码无需修改

### 🔮 未来计划

- [ ] Bilibili API 集成（实时粉丝数）
- [ ] 网易云 API 集成（真实歌词）
- [ ] 收藏功能
- [ ] 分享功能
- [ ] 高级筛选（日期范围等）
- [ ] 用户评论系统
- [ ] 统计分析面板

