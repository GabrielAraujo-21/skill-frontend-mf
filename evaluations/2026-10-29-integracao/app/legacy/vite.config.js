import { defineConfig } from 'vite'

export default defineConfig({ test: { environment: 'node', include: ['legacy/**/*.test.js'] } })
