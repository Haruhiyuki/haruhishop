# Haruhi Shop

[凉宫春日应援团 春日商城](https://haruyuki.cn/shop/)

以凉宫春日应援团周边贩售为主的在线商城系统。支持商品展示、购物车、下单支付、订单查询、优惠券、邮件通知、预售管理等功能。

## 功能特性

- **商品展示** — 首页商品陈列，支持多图展示与商品详情
- **购物车** — 添加商品、调整数量，首页浮窗快速查看
- **下单与支付** — 填写收货地址、使用优惠券、微信/支付宝扫码支付
- **订单查询** — 凭订单号查询订单状态与物流信息
- **预售支持** — 目标制与固定日期两种预售模式，现货预售混合订单自动拆分发货
- **优惠券** — 金额减免与百分比折扣，管理后台批量生成
- **邮件通知** — 订单状态变更自动发送邮件通知（支持 SMTP 和 Resend）
- **管理后台** — 商品管理、订单管理（批量导出、快递导入）、优惠券管理、消息管理、数据统计
- **数据统计** — 销售趋势、商品销售排行、转化率分析
- **移动端适配** — 响应式设计，兼顾桌面端与手机端体验

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Vue 3 + Vue Router + Pinia + Vite |
| 后端 | Node.js + Express |
| 数据库 | SQLite (via sqlite3) |
| 文件上传 | Multer |
| 邮件 | Nodemailer / Resend |
| 图表 | Chart.js |

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 8

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/Haruhiyuki/haruhishop.git
cd haruhishop

# 安装依赖
npm install

# 复制环境变量文件并编辑
cp .env.example .env

# 一键启动前端 + 后端
npm start
```

启动后：

- 前端：http://localhost:15532/shop/
- 后端 API：http://localhost:13221/shop-api/products

## 环境变量

在项目根目录创建 `.env` 文件进行配置：

```bash
# 管理员认证（生产环境必须设置，否则拒绝启动）
ADMIN_USERNAME=your-admin-user
ADMIN_PASSWORD=your-strong-password
ADMIN_AUTH_SECRET=replace-with-a-long-random-secret
ADMIN_TOKEN_TTL_SECONDS=86400

# 业务配置
FREE_SHIPPING_THRESHOLD=150          # 包邮门槛（元），默认 150

# 路径配置
API_PREFIX=/shop-api                 # 后端 API 前缀
VITE_BASE_PATH=/shop/               # 前端挂载路径（末尾必须带 /）
VITE_API_BASE=/shop-api              # 前端 API 基础路径（须与 API_PREFIX 一致）
VITE_DEV_API_TARGET=http://localhost:13221

# 邮件通知（可选，默认关闭）
EMAIL_NOTIFICATIONS_ENABLED=false
MAIL_PROVIDER=auto                   # smtp / resend / auto（推荐 auto）
MAIL_FROM_NAME=春日商城
MAIL_FROM_ADDRESS=
MAIL_REPLY_TO=
PUBLIC_SITE_URL=                     # 用于邮件中生成订单查询链接

# SMTP（MAIL_PROVIDER=smtp 时生效）
SMTP_HOST=
SMTP_PORT=465
SMTP_SECURE=true
SMTP_AUTH_MODE=auto                  # auto / password / oauth2
SMTP_USER=
SMTP_PASS=

# Resend（MAIL_PROVIDER=resend 时生效）
RESEND_API_KEY=
```

**说明：**

- 生产环境（`NODE_ENV=production`）下，未配置 `ADMIN_USERNAME` / `ADMIN_PASSWORD` / `ADMIN_AUTH_SECRET` 会拒绝启动
- `MAIL_PROVIDER` 设为 `auto` 时优先使用 Resend，不可用则回退 SMTP
- `SMTP_AUTH_MODE` 支持 `password`（账号密码）和 `oauth2`（OAuth2 令牌），`auto` 会优先尝试 OAuth2

## 项目结构

```
haruhishop/
├── src/                          # 前端源码
│   ├── views/
│   │   ├── shop/                 # 前台页面
│   │   │   ├── HomeView.vue      #   首页
│   │   │   ├── ProductDetailView.vue  #   商品详情
│   │   │   ├── CartView.vue      #   购物车
│   │   │   ├── CheckoutView.vue  #   结账
│   │   │   ├── PaymentView.vue   #   支付
│   │   │   ├── SuccessView.vue   #   支付成功
│   │   │   ├── OrderQueryView.vue #  订单查询
│   │   │   └── ContactView.vue   #   联系我们
│   │   └── admin/                # 后台页面
│   │       ├── AdminLoginView.vue #  管理员登录
│   │       ├── DashboardView.vue #   仪表板
│   │       ├── ProductsView.vue  #   商品管理
│   │       ├── OrdersView.vue    #   订单管理
│   │       ├── CouponsView.vue   #   优惠券管理
│   │       ├── MessagesView.vue  #   消息管理
│   │       ├── StatsView.vue     #   数据统计
│   │       └── SettingsView.vue  #   系统设置
│   ├── layouts/                  # 布局组件
│   ├── components/               # 可复用组件
│   ├── stores/                   # Pinia 状态管理
│   ├── router/                   # 路由配置
│   ├── utils/                    # 工具函数
│   └── assets/                   # 静态资源
├── server/                       # 后端源码
│   ├── server.cjs                #   Express 入口，全部 API 路由
│   ├── db.cjs                    #   SQLite 数据库初始化
│   ├── email.cjs                 #   邮件发送模块
│   └── uploads/                  #   用户上传文件存储目录
├── vite.config.js                # Vite 配置
└── package.json
```

## API 概览

所有接口以 `/shop-api` 为前缀：

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /shop-api/products | 获取商品列表 |
| POST | /shop-api/orders | 创建订单 |
| GET | /shop-api/orders/:id | 查询订单详情 |
| POST | /shop-api/orders/:id/payment | 订单支付 |
| POST | /shop-api/coupons/preview | 预览优惠券折扣 |
| POST | /shop-api/contact/messages | 提交留言 |
| GET | /shop-api/site-config | 获取站点公开配置 |

管理接口需要在请求头中携带 `Authorization: Bearer <token>` 进行鉴权，token 通过 `POST /shop-api/admin/login` 获取。

## 生产部署

```bash
npm run build
```

构建产物在 `dist/`，通过反向代理挂到对应路径。

### Nginx 配置示例

```nginx
# 前端静态资源
location ^~ /shop/ {
    alias /var/www/haruhishop/dist/;
    try_files $uri $uri/ /shop/index.html;
}

# 后端 API
location ^~ /shop-api/ {
    proxy_pass http://127.0.0.1:13221/shop-api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## License

MIT
