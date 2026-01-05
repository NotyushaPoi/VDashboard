# VDashboard 项目结构说明

## 仓库层级清理完成 ✅

此项目已完成目录结构整理，采用**单应用单 package.json** 的现代最佳实践。

## 目录组织

```
VDashboard/                          # GitHub 仓库根目录
│
├── .git/                            # Git 版本控制
├── .github/                         # GitHub 配置（Actions、templates 等）
├── .vscode/                         # VSCode 工作区设置
├── .gitignore                       # 全局 Git 忽略规则 ⭐ 单一入口
│
├── vdashboard/                      # Next.js 应用根目录
│   ├── app/                         # Next.js App Router 页面
│   ├── public/                      # 静态文件
│   │   ├── data/
│   │   │   ├── streamers.json       # 生成（构建时产生）
│   │   │   ├── streamers/           # 生成（构建时产生）
│   │   │   └── videos.json          # 手动维护
│   │   └── images/
│   ├── scripts/                     # 构建脚本
│   │   └── build-data.ts            # YAML → JSON 转换脚本
│   │
│   ├── data/                        # YAML 源文件（不提交 git）
│   │   ├── metadata.yaml            # 全局配置
│   │   ├── streamers/               # 主播信息
│   │   ├── songs/                   # 歌曲库
│   │   ├── playlists/               # 歌单配置
│   │   └── lyrics/                  # 歌词文件（预留）
│   │
│   ├── package.json                 # ⭐ 唯一的 package.json
│   ├── pnpm-lock.yaml               # ⭐ 唯一的 lock 文件
│   ├── tsconfig.json                # TypeScript 配置
│   ├── next.config.js               # Next.js 配置
│   ├── tailwind.config.ts           # Tailwind CSS 配置
│   │
│   ├── node_modules/                # 依赖安装目录
│   ├── .next/                       # 构建输出（不提交）
│   │
│   └── 📚 文档（在 vdashboard/ 中）
│       ├── README.md
│       ├── DATA_STRUCTURE.md        # 数据格式详解
│       ├── DEVELOPMENT.md           # 开发指南
│       ├── DEPLOYMENT.md            # 部署指南
│       └── ...
│
├── 📚 文档（在仓库根目录）
│   ├── README.md                    # 项目总览
│   ├── PROJECT_STRUCTURE.md         # 这个文件
│   ├── DATA_MANAGEMENT.md           # 数据管理方案
│   └── ...
│
└── pnpm-workspace.yaml              # pnpm 工作区配置（仓库根）
```

## 关键点

### ✅ 单一 package.json
```
/Users/notyushapoi/VDashboard/vdashboard/package.json
```
所有依赖都在此文件中定义。主目录（`/Users/notyushapoi/`）**不含** package.json。

### ✅ 单一 lock 文件
```
/Users/notyushapoi/VDashboard/vdashboard/pnpm-lock.yaml
```
所有依赖锁定都在此文件中。确保一致的依赖版本。

### ✅ 顶层 .gitignore
```
/Users/notyushapoi/VDashboard/.gitignore
```
全局忽略规则，包括：
- `vdashboard/node_modules/`
- `vdashboard/.next/`
- `vdashboard/data/` - YAML 源（不提交）
- `vdashboard/public/data/**/*.json` - 生成的 JSON（除 videos.json）

### ✅ 无重复 .gitignore
- ❌ vdashboard 子目录中的 `.gitignore` 已删除
- ✅ 只保留顶层一个

## 构建流程

```bash
# 进入应用目录
cd VDashboard/vdashboard

# 安装依赖（仅在此目录）
pnpm install

# 构建（包括 YAML → JSON 转换）
pnpm build

# 开发模式
pnpm dev
```

## Git 工作流

```bash
# 从仓库根目录操作
cd VDashboard

# 查看状态（会忽略 node_modules, .next, data, 生成的 JSON）
git status

# 提交更改
git add .
git commit -m "feat: description"

# 推送
git push origin main
```

## 提交到 Git 的文件

✅ **应该提交：**
- `vdashboard/app/` - React 组件
- `vdashboard/public/` - 静态文件（除生成的 JSON）
- `vdashboard/scripts/` - 构建脚本
- `vdashboard/package.json` - 依赖定义
- `vdashboard/pnpm-lock.yaml` - 依赖锁定
- `vdashboard/tsconfig.json` 等配置文件
- 所有 `.md` 文档

❌ **不应该提交：**
- `vdashboard/node_modules/` - 通过 `pnpm install` 重新安装
- `vdashboard/.next/` - 构建时产生
- `vdashboard/data/` - YAML 源文件（存储在构建环境）
- `vdashboard/public/data/**/*.json` - 构建时产生（除 videos.json）

## CI/CD 流程

部署系统会：
1. ✅ 检出代码（只含源文件）
2. ✅ 进入 `vdashboard/` 目录
3. ✅ 运行 `pnpm install`
4. ✅ 运行 `pnpm build`（自动执行 prebuild）
5. ✅ 生成 JSON 数据文件
6. ✅ 构建产物包含生成的 JSON

## IDE 配置

### VSCode
- `.vscode/settings.json` 位于仓库根目录
- 编辑器使用根目录作为工作区

### TypeScript
- `vdashboard/tsconfig.json` 用于应用编译
- 类型检查范围仅限 vdashboard 目录

## 常见任务

### 添加新依赖
```bash
cd VDashboard/vdashboard
pnpm add package-name
```

### 移除依赖
```bash
cd VDashboard/vdashboard
pnpm remove package-name
```

### 运行测试
```bash
cd VDashboard/vdashboard
pnpm lint
```

### 本地开发
```bash
cd VDashboard/vdashboard
pnpm dev          # 需要先运行一次 prebuild
```

## 对比：整理前 vs 整理后

### 整理前 ❌
```
~/ (home)
├── node_modules/           # 不用的依赖
├── package.json            # 孤立的配置
└── pnpm-lock.yaml          # 无用的锁文件

VDashboard/
├── .gitignore              # 不完整
├── vdashboard/
│   ├── .gitignore          # 冗余
│   ├── node_modules/       # 真实依赖
│   ├── package.json        # 真实配置
│   └── pnpm-lock.yaml      # 真实锁文件
```

### 整理后 ✅
```
~/ (home)                   # 干净（无 node_modules, package.json）

VDashboard/
├── .gitignore              # 完整，唯一入口 ⭐
└── vdashboard/
    ├── node_modules/       # 唯一的依赖目录
    ├── package.json        # 唯一的配置 ⭐
    └── pnpm-lock.yaml      # 唯一的锁文件 ⭐
```

## 后续维护

- 所有开发都在 `vdashboard/` 目录进行
- 所有 `pnpm` 命令都在 `vdashboard/` 目录执行
- 提交时从仓库根目录（VDashboard）执行 git 命令
- 不要在主目录或其他目录创建 package.json

## 遇到问题

如果不小心在错误的位置创建了 package.json 或 node_modules：

```bash
# 清理主目录
rm -rf ~/node_modules ~/package.json ~/pnpm-lock.yaml

# 清理任何其他位置的重复文件
find ~ -maxdepth 1 -name "package.json" -o -name "pnpm-lock.yaml"

# 确保只在 vdashboard/ 中有
ls -la VDashboard/vdashboard/package.json
```

## 验证清理成功

运行此命令检查是否有重复的 package.json：

```bash
find ~ -name "package.json" 2>/dev/null
```

应该只返回：
```
/Users/notyushapoi/VDashboard/vdashboard/package.json
```

---

**清理完成时间：** 2026-01-05  
**最后更新：** Plan B YAML 系统实现完成后
