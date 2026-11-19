import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  // 发布目标是 GitHub Pages 项目页 https://oustr.github.io/nortu/，
  // 构建产物里的静态资源路径必须带 /nortu/ 前缀；dev/preview 仍走根路径。
  base: command === "build" ? "/nortu/" : "/",
  server: {
    port: 220,
    // 端口被占时直接报错，而不是悄悄 +1 攒出一堆僵尸 dev
    strictPort: true,
    open: true,
  },
  preview: {
    port: 222,
    strictPort: true,
    open: true,
  },
}));
