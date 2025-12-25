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

编辑对应的主播文件 `public/data/streamers/X-名字.json`，修改 `avatar` 和 `banner` 路径：

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

## 📊 点唱歌单功能

VDashboard 实现了智能的点唱歌单机制：

- **第一个歌单自动为点唱歌单**：每个主播的 `playlists[0]` 自动作为点唱歌单
- **智能复制前缀**：当用户点击第一个歌单中的"复制点歌口令"按钮时，复制的文本自动添加"点歌 "前缀
- **普通歌单保持不变**：其他歌单的复制功能仅复制歌曲名

这在 `app/streamer/components/TabPanel.tsx` 中实现：

```tsx
<CopyButton 
  text={song.name} 
  label={selectedTab === 0 ? "复制点歌口令" : "复制"}
  isJukeboxCommand={selectedTab === 0}
/>
```

## 📁 数据文件结构（方案 4：混合索引）

VDashboard 采用**两层数据结构**来实现最优的性能和可维护性：

```
public/data/
├── videos.json                    # 视频数据（独立文件，3 个视频）
├── streamers.json                 # 索引文件（轻量级，6 个主播的基本信息）
└── streamers/
    ├── 1-希罗Kirara.json         # 主播 1 的完整数据（3 个歌单，18 首歌）
    ├── 2-Yvaine可可.json         # 主播 2 的完整数据（3 个歌单，18 首歌）
    ├── 3-恰恰恰蘑菇.json         # 主播 3 的完整数据
    ├── 4-姬月樱.json             # 主播 4 的完整数据
    ├── 5-悄悄Qoo.json            # 主播 5 的完整数据
    └── 6-浅律Asaritsu.json       # 主播 6 的完整数据
```

### 为什么采用两层结构？

| 方面 | 好处 |
|------|------|
| **性能** | 主页只加载轻量级索引（~2KB），详情页才加载完整数据 |
| **可维护性** | 每个文件 100-200 行，编辑简洁 |
| **多人协作** | 不同主播的数据在不同文件，几乎无冲突 |
| **扩展性** | 轻松支持数百个主播，无需重构 |
| **灵活性** | 可独立更新某主播的数据，不影响其他主播 |

---

## 🔄 维护两层数据的完整步骤

### 场景 1：更新已有主播的歌单（最常见）

假设你要为主播 1（希罗 Kirara）添加一首新歌。

**步骤：**

1. **编辑主播详细数据文件**
   ```bash
   编辑：public/data/streamers/1-希罗Kirara.json
   ```

2. **在歌单中添加歌曲**
   ```json
   {
     "id": 1,
     "name": "希罗Kirara",
     "bio": "温柔治愈的女性Vtuber",
     "avatar": "/images/streamers/placeholder.jpg",
     ...
     "playlists": [
       {
         "name": "点唱曲库",
         "songs": [
           // 现有歌曲...
           {
             "name": "新歌曲名",
             "artist": "艺术家",
             "genre": "流派",
             "tag": "标签",
             "language": "中文",
             "album": "专辑",
             "lyrics": "歌词内容",
             "url": "https://music.url"
           }
         ]
       }
     ]
   }
   ```

3. **保存并测试**
   ```bash
   # 开发环境中自动热重载（无需重启）
   pnpm dev
   # 浏览器中访问该主播的详情页验证
   ```

4. **❌ 无需更新索引文件 `streamers.json`** ⚠️
   - 索引文件中 `playlistCount` 和 `songCount` 是**可选的**
   - 仅用于前端展示，不影响功能
   - 如果需要精确计数，见下面的"更新索引"步骤

5. **提交 Git**
   ```bash
   git add public/data/streamers/1-希罗Kirara.json
   git commit -m "feat: 为希罗Kirara添加新歌曲"
   git push
   ```

---

### 场景 2：添加新主播（较复杂）

假设你要添加主播 7。

**步骤：**

1. **创建新主播文件**
   ```bash
   创建：public/data/streamers/7-新主播名.json
   ```

2. **填写完整数据**
   ```json
   {
     "id": 7,
     "name": "新主播名",
     "bio": "简短自我介绍",
     "avatar": "/images/streamers/new-avatar.jpg",
     "banner": "/images/streamers/new-banner.jpg",
     "bilibiliId": "新的B站UID",
     "liveUrl": "https://live.bilibili.com/新UID",
     "bilibiliSpaceUrl": "https://space.bilibili.com/新UID",
     "description": "详细介绍",
     "cloudMusicUrl": "https://music.163.com/user/xxx",
     "redUrl": "https://www.xiaohongshu.com/user/xxx",
     "playlists": [
       {
         "name": "点唱曲库",
         "songs": []  // 可以先为空，后续添加
       }
     ]
   }
   ```

3. **更新索引文件（必须！）**
   编辑 `public/data/streamers.json`，添加新条目：
   
   ```json
   {
     "streamers": [
       // 已有的 6 个主播...
       {
         "id": 7,
         "name": "新主播名",
         "bio": "简短自我介绍",
         "avatar": "/images/streamers/new-avatar.jpg",
         "file": "streamers/7-新主播名.json",
         "playlistCount": 1,
         "songCount": 0
       }
     ]
   }
   ```

4. **测试**
   ```bash
   pnpm dev
   # 检查主页能否看到新主播
   # 检查详情页能否正常加载
   ```

5. **提交**
   ```bash
   git add public/data/streamers/7-新主播名.json
   git add public/data/streamers.json
   git commit -m "feat: 添加新主播7"
   git push
   ```

---

### 场景 3：删除或修改主播基本信息

假设要删除主播 3 或修改其名称。

**步骤：**

1. **修改两个文件：**

   a) 删除主播数据文件：
   ```bash
   rm public/data/streamers/3-恰恰恰蘑菇.json
   ```

   b) 从索引文件中移除：
   编辑 `public/data/streamers.json`，删除对应条目

2. **测试**
   ```bash
   pnpm build  # 验证构建成功
   ```

3. **提交**
   ```bash
   git add public/data/streamers.json
   git commit -m "chore: 删除主播3"
   git push
   ```

---

### 场景 4：同步索引的统计数据（可选优化）

如果想保持 `playlistCount` 和 `songCount` 的精确性，可以使用脚本自动同步：

```bash
# 创建脚本（可选）
python3 scripts/sync-index.py
```

脚本内容：
```python
import json
from pathlib import Path

# 读取索引
with open('public/data/streamers.json', 'r', encoding='utf-8') as f:
    index = json.load(f)

# 更新每个主播的统计
for entry in index['streamers']:
    filepath = Path(entry['file'])
    if filepath.exists():
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        entry['playlistCount'] = len(data.get('playlists', []))
        entry['songCount'] = sum(
            len(p.get('songs', [])) 
            for p in data.get('playlists', [])
        )

# 保存更新
with open('public/data/streamers.json', 'w', encoding='utf-8') as f:
    json.dump(index, f, ensure_ascii=False, indent=2)

print("✅ Index synced successfully")
```

---

## 📋 数据维护检查清单

每次修改前检查：

- [ ] **主播详情文件** (`public/data/streamers/X-名字.json`)
  - [ ] 所有必需字段都已填写（id, name, bio, avatar 等）
  - [ ] playlists 数组不为空（至少 1 个歌单）
  - [ ] JSON 格式正确（无语法错误）

- [ ] **索引文件** (`public/data/streamers.json`)
  - [ ] 所有主播都在索引中
  - [ ] file 路径与实际文件对应
  - [ ] JSON 格式正确

- [ ] **Git 提交**
  - [ ] 同时提交主播详情文件和索引文件（如需）
  - [ ] 提交信息清晰明确
  - [ ] 本地测试通过（`pnpm build` 成功）

- [ ] **视频数据** （如需修改）
  - [ ] 编辑 `public/data/videos.json`
  - [ ] 单独提交，可与主播数据分开

---

## 💾 数据格式参考

### 索引文件格式 (`public/data/streamers.json`)
```json
{
  "streamers": [
    {
      "id": 1,
      "name": "主播名称",
      "bio": "简短介绍",
      "avatar": "/images/streamers/avatar.jpg",
      "file": "streamers/1-主播名.json",
      "playlistCount": 3,
      "songCount": 18
    }
  ]
}
```

### 主播详情文件格式 (`public/data/streamers/X-名字.json`)
```json
{
  "id": 1,
  "name": "主播名称",
  "bilibiliId": "8230334",
  "liveUrl": "https://live.bilibili.com/8230334",
  "bilibiliSpaceUrl": "https://space.bilibili.com/8230334",
  "cloudMusicUrl": "https://music.163.com",
  "redUrl": "https://www.xiaohongshu.com",
  "avatar": "/images/streamers/avatar.jpg",
  "banner": "/images/streamers/banner.jpg",
  "bio": "温柔治愈的女性Vtuber",
  "description": "详细介绍...",
  "playlists": [
    {
      "name": "点唱曲库",
      "songs": [
        {
          "name": "歌曲名",
          "artist": "艺术家",
          "genre": "流派",
          "tag": "标签",
          "language": "中文",
          "album": "专辑",
          "lyrics": "歌词内容",
          "url": "https://music.url"
        }
      ]
    }
  ]
}
```

### 视频文件格式 (`public/data/videos.json`)
```json
[
  {
    "id": 1,
    "title": "视频标题",
    "cover": "/images/video/cover.jpg",
    "videoUrl": "https://www.bilibili.com/video/BVxxx",
    "description": "视频描述"
  }
]
```

---

## 🚀 开发流程

### 本地开发

```bash
# 启动开发服务器
pnpm dev

# 修改数据后自动热重载，无需重启
```

### 生产构建

```bash
# 验证构建成功
pnpm build

# 启动生产服务器
pnpm start
```

---

## 常见问题

### Q: 添加歌曲后主页没有更新？
A: 主页只显示 `playlistCount` 和 `songCount`，这些值在索引文件中。详情页会实时加载完整数据。

### Q: 可以同时编辑多个主播的文件吗？
A: 可以，因为每个主播数据在独立文件中，不会冲突。但 Git 提交时建议分别提交。

### Q: 如何备份数据？
A: Git 就是最好的备份。定期 push 到远程仓库。

### Q: 图片无法显示？
A: 检查路径是否正确，确保文件存在于 `public/images/streamers/`

### Q: JSON 格式出错如何排查？
A: 使用 `pnpm build` 时会报告具体的错误位置，或在终端使用 `python3 -m json.tool` 验证

