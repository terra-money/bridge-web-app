import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      consts: path.resolve(__dirname, 'src/consts'),
      hooks: path.resolve(__dirname, 'src/hooks'),
      images: path.resolve(__dirname, 'src/images'),
      packages: path.resolve(__dirname, 'src/packages'),
      pages: path.resolve(__dirname, 'src/pages'),
      services: path.resolve(__dirname, 'src/services'),
      store: path.resolve(__dirname, 'src/store'),
      types: path.resolve(__dirname, 'src/types'),
      ics20: path.resolve(__dirname, 'src/ics20'),
      'chain-configs': path.resolve(__dirname, 'src/chain-configs'),
    },
  },
})
