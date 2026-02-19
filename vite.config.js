import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

const normalizeBasePath = (value) => {
  const raw = String(value || '/').trim()
  if (!raw || raw === '/') return '/'

  let normalized = raw.startsWith('/') ? raw : `/${raw}`
  normalized = normalized.replace(/\/{2,}/g, '/')
  if (!normalized.endsWith('/')) normalized += '/'
  return normalized
}

const normalizeApiPrefix = (value) => {
  const raw = String(value || '/shop-api').trim()
  if (!raw) return '/shop-api'
  const normalized = raw.startsWith('/') ? raw : `/${raw}`
  return normalized.replace(/\/+$/, '') || '/shop-api'
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = normalizeBasePath(env.VITE_BASE_PATH || '/shop/')
  const apiPrefix = normalizeApiPrefix(env.VITE_API_BASE || '/shop-api')
  const apiTarget = env.VITE_DEV_API_TARGET || 'http://localhost:13221'

  return {
    base,
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 15532,
      strictPort: false,
      open: base,
      host: true,
      proxy: {
        [apiPrefix]: {
          target: apiTarget,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
