import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // Écoute sur toutes les interfaces réseau
    port: 5173, // Port par défaut de Vite
    // Optionnel : pour forcer l'utilisation d'un port spécifique
    // strictPort: true,
  },
})

