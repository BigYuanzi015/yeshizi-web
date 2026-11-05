import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    // 多人/多进程并行写文件时，Windows 原生 watcher 会因临时文件报 EBUSY，
    // 因此改用轮询并忽略编辑器临时目录。
    watch: {
      usePolling: true,
      interval: 300,
      ignored: ['**/node_modules/**', '**/.git/**', '**/*.tmpdir/**', '**/shots/**', '**/dist/**'],
    },
  },
  build: {
    target: 'es2020',
  },
})
