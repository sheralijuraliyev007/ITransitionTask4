import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:5083",  // ← was "http//localhost:5038"
    }
  },
  plugins: [react()],
})
