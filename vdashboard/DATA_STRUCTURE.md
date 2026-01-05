# YAML 数据结构

VDashboard 使用 YAML 作为数据源，构建时自动转换为 JSON。

> ⚠️ **重要：** B站直播间地址不是简单的 `live.bilibili.com` + UID，需要填入正确的直播间地址（待上打ル)。

## 目录结构

```
data/
├── metadata.yaml           # 全局配置
├── streamers/              # 主播信息
│   ├── kirara.yaml
│   ├── yvainne.yaml
│   └── ...
├── songs/                  # 歌曲库
│   ├── all.yaml           # 所有演示歌曲
│   └── kirara.yaml        # 主播个性化歌曲
├── playlists/              # 歌单配置
│   ├── kirara.yaml
│   └── ...
└── lyrics/                 # 歌词文件 (预留)
```

## 文件格式

### 1. streamers/{slug}.yaml - 主播信息

```yaml
id: 1
name: "希罗Kirara"
slug: "kirara"
bio: "简短介绍"
avatar: "/images/streamers/kirara.jpg"
banner: "/images/streamers/banner.jpg"

bilibiliId: "8230334"
bilibiliSpaceUrl: "https://space.bilibili.com/8230334"
liveUrl: "https://live.bilibili.com/"  # ⚠️ 填入正确的直播间地址
cloudMusicUrl: "https://music.163.com"
redUrl: "https://www.xiaohongshu.com"

themeColors:
  primary: "#FCBD91"
  secondary: "#FFAAA8"

description: |
  详细介绍
  可以多行
```

**字段说明:**
- `id` - 主播 ID
- `name` - 主播名称
- `slug` - URL 路由 slug
- `bio` - 简介 (30字以内)
- `avatar` - 头像路径
- `banner` - 宣传图路径
- `bilibiliId` - B站 UID
- `bilibiliSpaceUrl` - B站个人空间
- `liveUrl` - **⚠️ 正确的直播间地址（超重要！）**
- `themeColors.primary` - 主题色
- `themeColors.secondary` - 副色

### 2. songs/all.yaml - 歌曲库

```yaml
songs:
  - id: "song_001"
    name: "歌曲名"
    artist: "艺术家"
    genre: "流派"
    tag: "标签"
    language: "中文"
    album: "专辑"
    lyrics: "[00:00]歌词内容"
    url: "https://music.url"
```

**字段说明：**
- `id` - 唯一标识符
- `name` - 歌曲名
- `artist` - 艺术家
- `genre` - 流派
- `tag` - 标签
- `language` - 语言
- `album` - 专辑
- `lyrics` - LRC 格式歌词
- `url` - 音乐链接

### 3. playlists/{slug}.yaml - 歌单

```yaml
playlists:
  - name: "点唱曲库"
    songs:
      - "song_001"
      - "song_002"

  - name: "治愈系精选"
    songs:
      - "song_003"
      - "song_004"
```

**说明：**
- 按歌曲 ID 引用
- 构建时自动查找并合并完整歌曲信息
- 一个主播通常 3 个歌单

## 构建流程

运行 `pnpm build` 时：

1. 加载 `data/` 中所有 YAML 文件
2. 验证数据结构 (JSON Schema)
3. 合并歌单中的歌曲引用
4. 生成 `public/data/streamers.json` 和 `public/data/streamers/{slug}.json`

生成的 JSON 文件不提交 git（通过 `.gitignore` 排除）。

## 修改数据

### 添加新歌曲

编辑 `data/songs/all.yaml`：

```yaml
- id: "new_song"
  name: "新歌名"
  artist: "歌手"
  genre: "流派"
  tag: "标签"
  language: "中文"
  album: "专辑"
  lyrics: "[00:00]歌词..."
  url: "https://..."
```

然后在歌单中引用。

### 修改主播信息

编辑 `data/streamers/{slug}.yaml`：

```yaml
name: "新名字"
bio: "新简介"
themeColors:
  primary: "#新色值"
  secondary: "#新色值"
```

### 配置歌单

编辑 `data/playlists/{slug}.yaml`：

```yaml
playlists:
  - name: "新歌单"
    songs:
      - "song_id1"
      - "song_id2"
```

所有修改后运行 `pnpm build` 应用更改。

## 数据验证

构建脚本使用 AJV 验证数据：

- 检查必填字段
- 验证字段类型
- 检查歌单中的歌曲 ID 是否存在

验证失败会显示错误信息，构建中止。

## 生成的 JSON

### public/data/streamers.json

主播索引，包含所有主播的基本信息：

```json
{
  "streamers": [
    {
      "id": 1,
      "name": "希罗Kirara",
      "slug": "kirara",
      "bio": "...",
      "avatar": "/images/streamers/kirara.jpg",
      "themeColors": {
        "primary": "#FCBD91",
        "secondary": "#FFAAA8"
      },
      "playlistCount": 3,
      "songCount": 18
    }
  ]
}
```

### public/data/streamers/{slug}.json

单个主播的完整数据，包含所有歌单和歌曲：

```json
{
  "id": 1,
  "name": "希罗Kirara",
  "slug": "kirara",
  "bio": "...",
  "avatar": "/images/streamers/kirara.jpg",
  "banner": "/images/streamers/banner.jpg",
  "bilibiliId": "8230334",
  "themeColors": {...},
  "description": "...",
  "playlists": [
    {
      "name": "点唱曲库",
      "songs": [
        {
          "id": "song_001",
          "name": "歌曲名",
          "artist": "艺术家",
          ...
        }
      ]
    }
  ]
}
```

## 常见问题

**Q: 如何添加新主播？**  
A: 
1. 在 `data/streamers/` 创建 `{slug}.yaml`
2. 在 `data/playlists/` 创建 `{slug}.yaml`
3. 在 `data/metadata.yaml` 注册
4. 运行 `pnpm build`

**Q: 歌词格式是什么？**  
A: LRC 格式，例如 `[00:00]第一句 [00:05]第二句`

**Q: 可以直接编辑生成的 JSON 吗？**  
A: 不建议，下次构建会覆盖。编辑 YAML 源文件。

**Q: 歌曲 ID 有要求吗?**  
A: 推荐格式 `{slug}_{number}`，如 `kirara_001`

**Q: 直播间地址 (liveUrl) 是什么？**  
A: **⚠️ 超重要！** B站直播间地址不是简单的 `https://live.bilibili.com/` + UID。需要填入一个实际的直播间地址。示例：
```yaml
liveUrl: "https://live.bilibili.com/21652200"  # 直播间师UID（不同于spacer UID）
```

## 更多信息

- [应用说明](./README.md) - 项目概览
- [开发指南](./DEVELOPMENT.md) - 代码修改
