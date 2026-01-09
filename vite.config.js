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
  server: {
    port: 15532,      // [建议] 前端运行在 5173，避开后端的 3000
    strictPort: false,
    open: true,
    host: true,
    // [新增] 代理配置
    proxy: {
      '/api': {
        target: 'http://localhost:4542', // 后端服务地址
        changeOrigin: true,              // 允许跨域（修改 Host 头）
        secure: false                    // 如果是 https 且有自签名证书，设为 false
        // rewrite: (path) => path.replace(/^\/api/, '') // 如果后端路由没有 /api 前缀，可以开启这行重写
      }
    }
  }
})