# Aox 小程序

基于 uni-app + Vue3 + TypeScript + Pinia 构建的微信小程序

## 技术栈

- uni-app 3.x
- Vue 3 + `<script setup>`
- TypeScript
- Pinia (状态管理)
- Vite (构建工具)

## 项目结构

```
src/
├── api/                # API 接口
│   └── user.ts
├── store/              # Pinia 状态管理
│   └── user.ts
├── utils/              # 工具类
│   └── request.ts
├── pages/              # 页面
│   ├── login/          # 登录页
│   ├── index/          # 首页
│   └── mine/           # 我的
├── static/             # 静态资源
├── App.vue             # 应用入口
├── main.ts             # 入口文件
├── pages.json          # 页面配置
├── manifest.json       # 应用配置
└── uni.scss            # 全局样式
```

## 开发指南

### 安装依赖

```bash
npm install
```

### 运行微信小程序

```bash
npm run dev:mp-weixin
```

然后使用微信开发者工具打开 `dist/dev/mp-weixin` 目录

### 运行 H5

```bash
npm run dev:h5
```

### 打包微信小程序

```bash
npm run build:mp-weixin
```

## 功能列表

- [x] 微信登录
- [x] 用户信息管理
- [x] 首页展示
- [x] 个人中心
- [x] Token 自动管理
- [x] 统一请求封装
- [x] 全局状态管理

## 核心功能

### 1. 微信登录

使用 `wx.login` 和 `wx.getUserProfile` 获取用户信息，然后调用后端接口完成登录

### 2. Token 管理

- Token 自动存储到本地
- 请求自动携带 Token
- Token 过期自动跳转登录页

### 3. 状态管理

使用 Pinia 管理全局状态：
- 用户信息
- 登录状态
- Token

### 4. 请求封装

统一的 HTTP 请求封装，支持：
- 自动添加 Token
- 统一错误处理
- 自动显示错误提示

## 配置说明

### 修改后端 API 地址

编辑 `src/utils/request.ts`:

```typescript
const BASE_URL = 'http://your-api-url/api'
```

### 配置微信小程序 AppID

编辑 `src/manifest.json`:

```json
{
  "mp-weixin": {
    "appid": "你的小程序AppID"
  }
}
```

## 注意事项

1. **开发环境**: 需要在微信开发者工具中开启"不校验合法域名"
2. **生产环境**: 需要在微信公众平台配置服务器域名白名单
3. **用户授权**: 获取用户信息需要用户点击授权

## 常见问题

### Q1: 登录失败

A: 检查后端 API 地址是否正确，确保后端服务已启动

### Q2: 无法获取用户信息

A: 需要用户点击按钮主动授权，不能自动获取

### Q3: Token 过期

A: Token 过期会自动跳转到登录页，重新登录即可

## 开发规范

1. 使用 TypeScript 编写代码
2. 使用 `<script setup>` 语法
3. 使用 Composition API
4. 样式使用 SCSS
5. 单位使用 rpx

## 后续扩展

- [ ] 更多页面和功能
- [ ] 支付功能
- [ ] 消息推送
- [ ] 数据埋点
- [ ] 性能优化

---

**祝你开发愉快！** 🎉
