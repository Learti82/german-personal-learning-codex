import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { sites } from '@openai/sites-vite-plugin'

const isVercel=Boolean((globalThis as {process?:{env?:Record<string,string|undefined>}}).process?.env?.VERCEL)

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon-180x180.png'],
    manifest: {
      name: 'DeutschCoach — Gjermanisht për punë', short_name: 'DeutschCoach',
      description: 'Trajnues lokal i gjermanishtes A1–B2 me fokus në të folur dhe call center.',
      theme_color: '#153d35', background_color: '#f5f1e8', display: 'standalone', orientation: 'portrait-primary',
      start_url: '/', lang: 'sq', categories: ['education'],
      icons: [
        { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: '/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    },
    workbox: { navigateFallback: '/index.html', globPatterns: ['**/*.{js,css,html,svg,png,woff2}'], globIgnores: ['server/**'], runtimeCaching: [] }
  }), ...(!isVercel ? [sites()] : [])],
  server: { port: 5173 }
})
