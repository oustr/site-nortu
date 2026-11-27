# site-nortu

仓库名：`site-nortu`（前端站点，结构参照 `site-home`）

## 技术栈

- Vite 5 + `@vitejs/plugin-react`
- React 18 + TypeScript（源码根目录为 `web/`，入口 `web/index.tsx`）
- Tailwind CSS v4（`@tailwindcss/vite` 插件；无 `tailwind.config.js`）：`web/index.css` 只留 `@import "tailwindcss"` 与 base
- Sass（`sass`，Vite 内置编译）：页面样式写 `*.module.scss`，灰阶 token 在 `web/styles/_tokens.scss`
- 字体：全站默认 Nozu Sans for Nortu，自托管在 `web/assets/fonts/nozu-sans-nortu.woff2`，`@font-face` 与 `--font-sans` 写在 `web/index.css`
- 可下载资源：词汇表 `web/assets/downloads/nortu-vocabulary.jsonl`、字体 `web/assets/fonts/nozu-sans-nortu.woff2`；首页「基建」里用 `?url` 导入地址，以 `<a download>` 直接存盘（存盘文件名写在 `download` 属性里，与仓库内文件名无关）
- 图标：`@remixicon/react`
- 路由：`react-router-dom` v7，`BrowserRouter`（真实路径，无 `#`），入口 `web/App.tsx`

## 路由

| 路径 | 组件 | 说明 |
| --- | --- | --- |
| `/` | `web/pages/HomePage/` | 首页，静态 import（入口页不做懒加载） |
| `/test` | `web/pages/TestPage/` | 测试页，`React.lazy` 按需加载，仅用于验证路由 |
| `*` | `App.tsx` 内 `NotFound` | 兜底提示 + 回首页 |

- `basename` 取 `import.meta.env.BASE_URL`（构建 `/nortu`、dev/preview `/`），新增路由不用关心部署路径
- 除首页外的新页面一律 `lazy(() => import("./pages/XxxPage/XxxPage.tsx"))`，保证进站只下载当前页的 chunk
- 路由间共享状态：Provider 包在 `<Routes>` 外层（见 `App.tsx` 注释），切页不会重挂
- **GitHub Pages 没有 SPA fallback**：深链接/刷新靠 `public/404.html` 把 `/nortu/xxx` 改写为 `/nortu/?/xxx` 跳回 `index.html`，再由 `index.html` 里的内联脚本 `replaceState` 还原成 `/nortu/xxx`。`public/404.html` 必须随 `dist/` 一起发布到目标仓库根目录，且脚本里的 `pathSegmentsToKeep` 固定为 `1`（对应 `/nortu/` 这一级子路径）

## 本地开发

```bash
pnpm install
pnpm dev      # dev 实例：http://localhost:220，热更新
pnpm build    # 类型检查 + 构建到 dist/
pnpm preview  # 预览构建产物：http://localhost:222/nortu/
```

两个端口都开了 `strictPort`，端口被占会直接报错而不是自动 +1。

## 发布

与 `site-home` 一致：本仓库只放源码，**不配 GitHub Actions、不写 workflow**，发布由本地手动构建后把 `dist/` 内容搬到目标 Pages 仓库。

- 目标仓库：`nortu`（GitHub Pages 项目页，线上地址 `https://oustr.github.io/nortu/`）
- 因为挂在 `/nortu/` 子路径下，`vite.config.ts` 里 `build` 时 `base` 固定为 `/nortu/`，dev/preview 仍是根路径
- 发布步骤：

```bash
pnpm build
# 把 dist/ 里的内容（含 index.html、assets/）连同 .nojekyll 覆盖到 ../nortu
```
