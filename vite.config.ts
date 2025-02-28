import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // Enable React with SWC
import { VitePWA } from 'vite-plugin-pwa' // Import PWA plugin

export default defineConfig({
  base: '/my-pwa-app/', // Change according to your GitHub repository name
  plugins: [
    react(), // Use SWC for React fast refresh and compilation
    VitePWA({
      registerType: 'autoUpdate', // Automatically update service worker
      manifest: {
        name: 'My PWA App',
        short_name: 'PWAApp',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
