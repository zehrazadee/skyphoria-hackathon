import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    hmr: {
      clientPort: 3000
    },
    allowedHosts: [
      'skyphoria.preview.emergentagent.com',
      '.emergentagent.com',
      'localhost'
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})