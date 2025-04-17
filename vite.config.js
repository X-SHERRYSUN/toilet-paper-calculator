import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 通常不需要特別設定 css.postcss，Vite 會自動尋找設定檔
})