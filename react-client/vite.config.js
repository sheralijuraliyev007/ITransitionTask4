import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://82.208.22.154",  // ← was "http//localhost:5038"
    }
  },
  plugins: [react()],
})
