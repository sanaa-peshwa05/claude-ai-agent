import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/books': 'http://localhost:8000',
      '/export-excel': 'http://localhost:8000'
    }
  }
})
