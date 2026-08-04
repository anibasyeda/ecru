import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Expose the dev server on the local network so you can open it on your
    // phone (same WiFi) via the printed Network URL — no --host flag needed.
    host: true,
    proxy: {
      // Forward API calls to the Express server during development so the
      // frontend can call '/api/...' with no CORS or hardcoded host.
      '/api': 'http://localhost:5000',
    },
  },
})
