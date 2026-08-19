import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const frontendDir = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // O build fica no classpath do Spring Boot. Depois de empacotar o
    // backend, React e a API passam a ser servidos em localhost:8084.
    outDir: resolve(frontendDir, '../src/main/resources/static'),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      // Encaminha as chamadas /api/* para o backend Spring Boot (porta 8084),
      // assim o navegador nunca bate direto em localhost:8084 e nao ha
      // problema de CORS.
      '/api': {
        target: 'http://localhost:8084',
        changeOrigin: true,
      },
    },
  },
})
