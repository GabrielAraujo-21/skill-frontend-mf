import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': { target: 'http://127.0.0.1:18765', changeOrigin: false },
      '/sanctum': { target: 'http://127.0.0.1:18765', changeOrigin: false },
    },
  },
  test: { environment: 'node', include: ['tests/**/*.test.js'] },
})
