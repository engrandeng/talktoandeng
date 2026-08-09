import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this project from the repository subpath.
  base: './',
  build: {
    // This repository's GitHub Pages site is published from /docs.
    outDir: 'docs',
    emptyOutDir: true,
  },
  plugins: [react()],
})
