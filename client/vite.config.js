// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    // ✅ Fix: manualChunks should be a function, not an object
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react'
            if (id.includes('stripe')) return 'vendor-stripe'
            if (id.includes('three')) return 'vendor-three'
            return 'vendor'
          }
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true,
  },
});