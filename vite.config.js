import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages hostet Projekt-Seiten unter /<repo-name>/ statt an der Domain-Wurzel,
  // deshalb müssen alle Asset-Pfade diesen Präfix kennen.
  base: '/G45Explodedview/',
})
