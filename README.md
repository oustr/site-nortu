# site-nortu

仓库名：`site-nortu`（前端站点，结构参照 `site-home`）

## 技术栈

- Vite 5 + `@vitejs/plugin-react`
- React 18 + TypeScript（源码根目录为 `web/`，入口 `web/index.tsx`）
- Tailwind CSS v4（`@tailwindcss/vite` 插件；无 `tailwind.config.js`）：`web/index.css` 只留 `@import "tailwindcss"` 与 base
- Sass（`sass`，Vite 内置编译）：页面样式写 `*.module.scss`，灰阶 token 在 `web/styles/_tokens.scss`
- 图标：`@remixicon/react`
- 单页面应用：无路由，`web/pages/HomePage/` 直接由 `web/index.tsx` 渲染

## 本地开发

```bash
pnpm install
pnpm dev      # dev 实例：http://localhost:220，热更新
pnpm build    # 类型检查 + 构建到 dist/
pnpm preview  # 预览构建产物：http://localhost:222
```

两个端口都开了 `strictPort`，端口被占会直接报错而不是自动 +1。

## 发布

与 `site-home` 一致：本仓库只放源码，**不配 GitHub Actions、不写 workflow**，发布由本地手动构建后把 `dist/` 内容搬到目标 Pages 仓库（具体目标仓库待定）。
