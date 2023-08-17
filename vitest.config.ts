import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    root: './',
    alias: {
      '@core': path.resolve(__dirname, './src/@core'),
      '@': path.resolve(__dirname, './src')
    },
    environment: 'node',
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './src/@core'),
      '@': path.resolve(__dirname, './src')
    },
  },
  base: './',
  plugins: [
    // This is required to build the test files with SWC
    swc.vite()
  ]
})
