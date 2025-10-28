import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'ESVideoPlayer',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['@extscreen/es3-vue', 'vue', '@extscreen/es3-player', '@extscreen/es3-core'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
