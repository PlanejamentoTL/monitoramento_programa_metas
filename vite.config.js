import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Na Vercel o app é servido na raiz; no GitHub Pages, em /monitoramento_programa_metas/
  // (a Vercel define VERCEL=1 durante o build)
  base: process.env.VERCEL ? '/' : '/monitoramento_programa_metas/',
  build: {
    outDir: 'dist'
  }
})
