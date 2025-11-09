import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   base: '/monitoramento_programa_metas/', 
  build: {
    outDir: 'dist'
  }
})
