# B站直播间地址收集清单

⚠️ **重要提醒：** B站直播间地址需要特殊记录，不能简单地用 UID + `live.bilibili.com`

## 收集清单

| 主播 | 账号 UID | 直播间地址 |
|------|---------|--------|
| 希羗Kirara | 8230334 | https://live.bilibili.com/400605 |
| Yvaine可可 | 9638159 | https://live.bilibili.com/916864 |
| Choco | 399491783 | https://live.bilibili.com/23332686 |
| 姬月樱 | 5744398 | https://live.bilibili.com/1820330437 |
| 悄悄Qoo | 1436878388 | https://live.bilibili.com/23831283 |
| 浅律 | 6483585 | https://live.bilibili.com/22553887 |

## 获取直播间地址的方法

### 1️⃣ 访问主播空间
- 进入主播个人空间：`https://space.bilibili.com/{UID}`
- 点击左侧"直播间"选项卡

### 2️⃣ 查看直播间 URL
直播间 URL 通常形如：
```
https://live.bilibili.com/{直播间ID}
```

例如：
```
https://live.bilibili.com/21652200
```

其中 `21652200` 就是直播间 ID（不同于账号 UID）

### 3️⃣ 填入 YAML
编辑 `data/streamers/{slug}.yaml`：

```yaml
liveUrl: "https://live.bilibili.com/21652200"
```

## 关键区别

| 项目 | UID（账号） | 直播间ID |
|-----|----------|--------|
| 位置 | 账户 ID | 直播间特有 |
| 示例 | 8230334 | 21652200 |
| URL | `space.bilibili.com/8230334` | `live.bilibili.com/21652200` |
| 作用 | 个人空间、视频 | 直播 |

## 完成检查

- [x] 希羗Kirara - 预认账号 + 直播间
- [x] Yvaine可可 - 预认账号 + 直播间
- [x] Choco - 预认账号 + 直播间
- [x] 姬月樱 - 预认账号 + 直播间
- [x] 悄悄Qoo - 预认账号 + 直播间
- [x] 浅律 - 预认账号 + 直播间

✅ **所有信息已更新！**

已自动处理，数据已保存到 JSON 文件。
