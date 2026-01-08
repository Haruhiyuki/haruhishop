import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  //在此处添加 server 配置
  server: {
    port: 15532,      // 将端口修改为你想要的数字，例如 8080
    strictPort: false, // 如果端口被占用，是否直接退出（false 为自动尝试下一个可用端口）
    open: true,      // 启动时自动打开浏览器
    host: true       // 监听所有地址，方便局域网手机测试
  }
})