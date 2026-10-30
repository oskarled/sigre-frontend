import { defineConfig, type Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Compatibilidad con el código exportado de Figma Make:
// - "paquete@1.2.3"   -> "paquete"
// - "figma:asset/x.png" -> src/assets/x.png
function figmaMakeCompat(): Plugin {
  return {
    name: 'figma-make-compat',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      if (source.startsWith('figma:asset/')) {
        return path.resolve(__dirname, 'src/assets', source.slice('figma:asset/'.length))
      }
      const m = source.match(/^((?:@[^/]+\/)?[^/@]+)@\d+\.\d+\.\d+(\/.*)?$/)
      if (m) {
        return this.resolve(m[1] + (m[2] ?? ''), importer, { ...options, skipSelf: true })
      }
      return null
    },
  }
}

export default defineConfig({
  plugins: [figmaMakeCompat(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@': path.resolve(__dirname, './src/app'),
    },
  },
})
