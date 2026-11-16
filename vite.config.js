import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// base: the app is served from https://gimenab.github.io/treasure-of-time-app/
export default defineConfig({
  base: '/treasure-of-time-app/',
  plugins: [react(), tailwindcss()],
})
