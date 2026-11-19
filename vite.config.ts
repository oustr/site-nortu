import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
});
