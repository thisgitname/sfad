import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcssImport from 'postcss-import'
import autoprefixer from 'autoprefixer'
import postcssPxToRem from 'postcss-pxtorem'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        postcssImport(),
        autoprefixer(),
        postcssPxToRem({
          rootValue: 37.5, // 根据设计稿宽度计算，使用amfe-flexible的标准
          propList: ['*'], // 需要转换的属性，*表示所有属性
          selectorBlackList: [], // 忽略的选择器
          replace: true,
          mediaQuery: false,
          minPixelValue: 0,
          exclude: /node_modules/i // 忽略包文件转换rem
        })
      ]
    }
  }
})
