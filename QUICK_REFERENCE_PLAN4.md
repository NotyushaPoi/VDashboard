# VDashboard Plan 4 快速参考卡

## 🎯 一分钟概览

VDashboard 已从 **单一 42KB JSON** 升级到 **两层混合数据架构**：

- **Layer 1 索引** (`streamers.json` 2KB) → 主页快速加载
- **Layer 2 详情** (`streamers/[id].json` 各 6KB) → 子页面懒加载

**效果**：主页加载时间 ↓95%，无需修改一行业务逻辑代码

---

## 📁 新数据文件结构

```
public/data/
├── streamers.json                 ✨ 新：轻量级索引（主页用）
├── videos.json                    ✨ 新：独立视频列表
└── streamers/                     ✨ 新：详情文件目录
    ├── 1-希罗Kirara.json          ✨ 新：主播详细数据
    ├── 2-Yvaine可可.json
    ├── 3-恰恰恰蘑菇.json
    ├── 4-姬月樱.json
    ├── 5-悄悄Qoo.json
    └── 6-浅律Asaritsu.json
```

---

## 🚀 日常使用场景

### 场景 1：更新歌曲（最常见）✅

```bash
# ✏️ 仅编辑这一个文件
vim public/data/streamers/1-希罗Kirara.json

# 修改 playlists[].songs 数组即可
# 保存后自动热重载（1-2 秒）
```

**为什么简单？** 不需要修改索引，只改详情文件。

### 场景 2：添加新主播

```bash
# 1️⃣ 更新索引文件
vim public/data/streamers.json
# 添加新主播的元数据（id, name, playlistCount, songCount 等）

# 2️⃣ 创建详情文件
cp public/data/streamers/1-希罗Kirara.json \
   public/data/streamers/7-新主播.json
# 编辑新文件，改数据内容

# 3️⃣ 验证
pnpm dev
```

**为什么较复杂？** 两个文件都要改。

### 场景 3：自动同步统计

```bash
# 如果歌曲数量变了，更新索引的 playlistCount 和 songCount
python3 scripts/sync-index.py
```

---

## 📊 两层数据说明

### Layer 1：索引文件 (`streamers.json`)

**用途**：主页展示，包含元数据和统计

```json
{
  "streamers": [
    {
      "id": 1,
      "name": "希罗Kirara",
      "bio": "简短介绍（卡片显示）",
      "avatar": "/images/streamers/kirara.jpg",
      "fans": "5.2万",
      "playlistCount": 3,           // ← 统计值
      "songCount": 18,              // ← 统计值
      "file": "1-希罗Kirara.json"   // ← 指向详情文件
    }
  ]
}
```

**加载时机**：服务端渲染主页时（每次主页加载都读）

### Layer 2：详情文件 (`streamers/X-名字.json`)

**用途**：子页面显示完整信息（歌单、番剧、歌词等）

```json
{
  "id": 1,
  "name": "希罗Kirara",
  "bilibiliId": "12345678",
  "liveUrl": "https://www.bilibili.com/12345678",
  "avatar": "/images/streamers/kirara.jpg",
  "banner": "/images/streamers/banner.jpg",
  "bio": "简短介绍",
  "description": "详细介绍...",
  "playlists": [
    {
      "name": "点唱曲库",
      "songs": [
        {
          "name": "歌曲名",
          "artist": "艺术家",
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

**加载时机**：用户进入 `/streamer/[id]` 时（按需懒加载）

---

## 💡 核心优势

| 对比项 | 迁移前 | 迁移后 |
|--------|--------|--------|
| 主页加载 | 42KB | **2KB** ✅ |
| 扩展性 | 单文件增长 | 线性增长 ✅ |
| 维护成本 | 一个大文件 | 简化维护 ✅ |
| 编辑冲突 | 容易冲突 | 分离减少冲突 ✅ |
| 缓存效率 | 基础缓存 | Map 层缓存 ✅ |

---

## 📚 文档导航

| 需求 | 参考文档 |
|------|---------|
| **快速参考** | `QUICK_START.md` |
| **开发架构** | `DEVELOPMENT.md` |
| **数据维护（重点）** | `CUSTOMIZATION.md` ⭐ |
| **项目概述** | `README_VDASHBOARD.md` |
| **部署指南** | `DEPLOYMENT.md` |
| **完整实施总结** | 根目录 `IMPLEMENTATION_SUMMARY_2024.md` |

---

## ✅ 验证清单

- [x] 构建成功：`pnpm build` ✓
- [x] 所有页面生成：10/10 ✓
- [x] 代码检查：`pnpm lint` ✓
- [x] 主页加载只需 2KB ✓
- [x] 子页面按需加载详情 ✓
- [x] Dark Mode 工作正常 ✓
- [x] 所有链接正常 ✓

---

## 🎓 理解两层架构

### 用户访问流程

```
用户打开首页
  ├─ 加载索引 (streamers.json 2KB)
  ├─ 显示 6 个主播卡片 + 轮播
  └─ (详情文件还未加载)

用户点击主播卡片
  ├─ 进入 /streamer/1
  ├─ 加载详情文件 (1-希罗Kirara.json 6KB)
  ├─ 显示完整资料、歌单、番剧
  └─ 缓存详情文件（重复访问无需再读）

用户点击另一主播卡片
  ├─ 进入 /streamer/2
  ├─ 加载新的详情文件 (2-Yvaine可可.json 6KB)
  ├─ 显示该主播的完整信息
  └─ 缓存结果
```

### 关键概念：懒加载

- **不强制加载**：进入主播页面才下载详情文件
- **减少浪费**：用户不点击不加载（节省带宽）
- **快速首屏**：主页 2KB 快速展示

---

## 🛠️ 常见任务命令

```bash
# 开发
pnpm dev                    # 启动开发服务器（自动热重载）

# 构建与验证
pnpm build                  # 预渲染所有页面
pnpm lint                   # 代码检查

# 数据维护
python3 scripts/sync-index.py   # 自动同步统计字段（可选）

# 部署
git add .
git commit -m "feat: update data"
git push origin main        # Vercel 自动部署
```

---

## 🎯 设计决策

**为什么不用数据库？**
- 简单维护（Git 版本控制）
- 无需后端（静态生成）
- 容易备份和恢复

**为什么不合并成一个文件？**
- 主页无需加载全部数据
- 支持更多主播（无文件大小限制）
- 减少编辑冲突风险

**为什么用 Map 缓存？**
- 重复访问同一主播无文件 I/O
- 内存占用小（最多 6 主播的详情）
- 提升用户体验（秒速响应）

---

## 📞 需要帮助？

1. **日常数据更新** → 查看 `CUSTOMIZATION.md`
2. **开发问题** → 查看 `DEVELOPMENT.md`
3. **部署问题** → 查看 `DEPLOYMENT.md`
4. **快速参考** → 查看 `QUICK_START.md`

---

**最后更新**：2024 年 Plan 4 实施完成  
**状态**：✅ 生产就绪  
**主页加载优化**：**95% ↓**（42KB → 2KB）

