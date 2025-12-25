# VDashboard 部署指南

## 🚀 部署选项

### 选项 1: Vercel 部署（推荐 - 最简单）

**优点:**
- 完全免费（有免费额度）
- 自动 HTTPS
- 自动 CI/CD（GitHub push 自动部署）
- 全球 CDN 加速
- 支持自定义域名

**步骤:**

1. **将项目推送到 GitHub**
```bash
cd /VDashboard
git init
git add .
git commit -m "initial: VDashboard project"
git remote add origin https://github.com/你的用户名/vdashboard.git
git branch -M main
git push -u origin main
```

2. **连接 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录
   - 点击 "New Project"
   - 选择 vdashboard 仓库
   - 点击 "Import"

3. **配置设置**
   - Framework: Next.js
   - Root Directory: `./vdashboard`
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

4. **部署**
   - 点击 "Deploy"
   - 等待部署完成（通常 2-3 分钟）
   - 获得自动生成的 URL：`https://your-project.vercel.app`

5. **绑定自定义域名**（可选）
   - 在 Vercel 项目设置中添加自定义域名
   - 按照指示修改 DNS 记录

**之后的更新:**
每次推送到 GitHub，Vercel 会自动重新构建并部署！

```bash
# 本地修改完成后
git add .
git commit -m "update: 更新XXX"
git push
# → Vercel 自动部署
```

---

### 选项 2: 自托管到 VPS/服务器

**适用场景:**
- 需要完全控制
- 有自己的服务器
- 需要特殊配置

**推荐服务器:**
- DigitalOcean (便宜，易用)
- Linode
- 阿里云 ECS
- 腾讯云 CVM
- 自己的主机

**步骤:**

#### 2.1 服务器准备

在服务器上安装必要软件：

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 pnpm
npm install -g pnpm

# 安装 PM2（进程管理器）
npm install -g pm2

# 安装 Git
sudo apt install -y git
```

#### 2.2 克隆和配置项目

```bash
# 选择部署目录
cd /home/your_user

# 克隆项目
git clone https://github.com/你的用户名/vdashboard.git
cd vdashboard

# 安装依赖
cd vdashboard
pnpm install

# 构建项目
pnpm build
```

#### 2.3 使用 PM2 启动

```bash
# 启动应用
pm2 start "pnpm start" --name vdashboard

# 设置开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs vdashboard

# 停止应用
pm2 stop vdashboard

# 重启应用
pm2 restart vdashboard
```

#### 2.4 配置 Nginx 反向代理

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/vdashboard
```

输入以下内容：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/vdashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 2.5 配置 SSL 证书（HTTPS）

使用 Certbot 获取免费 SSL 证书：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

#### 2.6 自动更新脚本

创建 `/home/your_user/update-vdashboard.sh`：

```bash
#!/bin/bash

cd /home/your_user/vdashboard

# 拉取最新代码
git pull origin main

# 重新安装依赖（如果需要）
cd vdashboard
pnpm install

# 重新构建
pnpm build

# 重启应用
pm2 restart vdashboard
```

设置定时任务（每天凌晨 2 点更新）：

```bash
crontab -e

# 添加以下行：
0 2 * * * /home/your_user/update-vdashboard.sh
```

---

### 选项 3: Docker 容器化部署

**优点:**
- 环境隔离
- 易于迁移
- 支持容器编排

**步骤:**

#### 3.1 创建 Dockerfile

在项目根目录创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制文件
COPY vdashboard ./vdashboard
WORKDIR /app/vdashboard

# 安装依赖
RUN pnpm install

# 构建
RUN pnpm build

# 暴露端口
EXPOSE 3000

# 启动
CMD ["pnpm", "start"]
```

#### 3.2 构建和运行

```bash
# 构建镜像
docker build -t vdashboard:latest .

# 运行容器
docker run -d -p 3000:3000 --name vdashboard vdashboard:latest

# 查看日志
docker logs -f vdashboard

# 停止容器
docker stop vdashboard

# 删除容器
docker rm vdashboard
```

#### 3.3 Docker Compose（推荐）

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  vdashboard:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: always
```

启动：

```bash
docker-compose up -d
```

---

### 选项 4: GitHub Pages (静态导出)

**仅适用于纯静态内容**

```bash
# 修改 next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
};
```

```bash
# 构建
pnpm build

# 输出在 out/ 文件夹
# 上传到 GitHub Pages
```

**注意:** 这种方式会丧失一些 Next.js 动态功能（如 API Routes）。

---

## 📋 部署前检查清单

在部署前，务必检查：

- [ ] 所有代码已提交到 Git
- [ ] 本地 `pnpm build` 成功（无错误）
- [ ] `.env.local` 文件不上传（加入 `.gitignore`）
- [ ] 主播数据完整（6 个主播）
- [ ] 所有链接有效（直播间、歌曲、番剧）
- [ ] 测试 Dark Mode 正常
- [ ] 测试移动端响应式
- [ ] 测试所有功能（轮播、复制、歌词等）

---

## 🔄 部署后维护

### 查看日志（Vercel）
```
在 Vercel Dashboard 中点击 "View Function Logs"
```

### 查看日志（自托管）
```bash
pm2 logs vdashboard

# 或
tail -f /path/to/logs
```

### 更新代码

#### Vercel 自动更新
```bash
git push origin main
# → 自动部署（2-3 分钟）
```

#### 自托管手动更新
```bash
cd /path/to/vdashboard
git pull origin main
cd vdashboard
pnpm install
pnpm build
pm2 restart vdashboard
```

### 监控应用健康

```bash
# PM2 监控
pm2 status

# 查看内存占用
pm2 monit
```

### 备份数据

定期备份 `public/data/streamers.json`：

```bash
# 创建备份
cp public/data/streamers.json public/data/streamers.backup.json

# 推送到 Git
git add public/data/streamers.backup.json
git commit -m "backup: daily backup"
git push
```

---

## 🆘 故障排查

### 页面加载缓慢

1. 检查服务器资源
```bash
# 查看 CPU 占用
top

# 查看内存占用
free -h

# 查看磁盘空间
df -h
```

2. 检查日志
```bash
pm2 logs vdashboard | grep error
```

3. 重启应用
```bash
pm2 restart vdashboard
```

### 无法访问

1. 检查防火墙
```bash
# 检查 3000 端口是否开放
sudo ufw status
sudo ufw allow 3000
```

2. 检查 Nginx
```bash
sudo nginx -t
sudo systemctl status nginx
```

3. 检查应用状态
```bash
pm2 status
```

### 内存泄漏

```bash
# 定期重启（每天凌晨 3 点）
crontab -e

# 添加：
0 3 * * * pm2 restart vdashboard
```

---

## 📊 性能优化建议

### 1. 启用 Gzip 压缩（Nginx）

```nginx
gzip on;
gzip_types text/plain text/css text/xml text/javascript 
           application/x-javascript application/xml+rss 
           application/json;
gzip_min_length 1000;
```

### 2. 启用缓存

```nginx
# 缓存静态资源 1 年
location ~* ^.+\.(jpg|jpeg|gif|png|ico|css|js)$ {
    expires 365d;
    add_header Cache-Control "public, immutable";
}
```

### 3. 开启 HTTP/2

```nginx
listen 443 ssl http2;
```

### 4. 使用 CDN

推荐：
- Cloudflare（免费）
- AWS CloudFront
- 阿里云 CDN

---

## 📧 域名配置

### 购买域名

推荐平台：
- Namecheap
- GoDaddy
- 阿里云
- 腾讯云

### 配置 DNS

#### Vercel + 自定义域名

1. 在 Vercel 添加域名
2. 获取 Vercel NS 记录
3. 在域名提供商更新 NS 记录

#### 自托管 + 自定义域名

1. 获取服务器的 IP 地址
2. 在域名提供商添加 A 记录
```
A    @         your-server-ip
A    www       your-server-ip
```
3. 等待 DNS 生效（通常 24 小时）

---

## 💰 成本估算

| 方案 | 月费用 | 优点 |
|------|--------|------|
| Vercel | $0-20 | 最简单，免费额度充足 |
| DigitalOcean VPS | $5-12 | 便宜，易用 |
| Linode | $5-15 | 稳定，文档全 |
| 阿里云 ECS | $10-50 | 国内速度快 |
| 腾讯云 CVM | $10-50 | 国内速度快 |

**推荐:** 小规模应用（< 100k PV/月）使用 Vercel，完全免费！

---

## 🎯 建议工作流

```
本地开发
  ↓
git push origin main
  ↓
(Vercel 自动测试) → 失败则回滚
  ↓
(自动构建) → 成功则部署
  ↓
自动生成 URL
  ↓
访问验证
```

---

## 相关文档

- [Vercel 官方文档](https://vercel.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [PM2 文档](https://pm2.keymetrics.io/docs)
- [Nginx 配置指南](https://nginx.org/en/docs/)

---

**部署完成！🎉 你的 VDashboard 现在可以全世界访问！**
