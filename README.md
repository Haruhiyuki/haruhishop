# Spring Day Shop

## 运行

```bash
npm install
cp .env.example .env
# 编辑 .env，替换管理员账号、密码和签名密钥
npm run start
```

前端默认走 Vite 代理，请确保后端服务可用。

## 后台鉴权配置

后台管理接口使用 Bearer Token 鉴权。后端启动时会自动读取项目根目录 `.env`：

```bash
ADMIN_USERNAME=your-admin-user
ADMIN_PASSWORD=your-strong-password
ADMIN_AUTH_SECRET=your-long-random-secret
ADMIN_TOKEN_TTL_SECONDS=86400
```

说明：
- 可复制模板：`cp .env.example .env`
- 生产环境(`NODE_ENV=production`)下，未配置 `ADMIN_USERNAME` / `ADMIN_PASSWORD` / `ADMIN_AUTH_SECRET` 会拒绝启动。
- 开发环境未配置时会使用默认凭据，仅用于本地调试，不可用于生产。
