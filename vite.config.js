import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  // Dev server (npm run dev)
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  // Preview server (npm run preview) — used by Render web service
  // Render injects PORT; fall back to 4173 for local preview.
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT) || 4173,
    strictPort: true,
  },
})
