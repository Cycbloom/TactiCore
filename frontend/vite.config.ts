import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // 允许外部访问
    host: true,
    watch: {
      usePolling: true, // 解决容器内文件监听问题
    },
  },
});
