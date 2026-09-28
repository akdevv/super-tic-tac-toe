import { readFileSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// `vite preview` serves vercel.json's site-wide headers (CSP etc.) so e2e tests run under them.
const vercel = JSON.parse(readFileSync('vercel.json', 'utf8')) as {
  headers: { source: string; headers: { key: string; value: string }[] }[]
}
const siteHeaders = Object.fromEntries(
  vercel.headers
    .find((h) => h.source === '/(.*)')!
    .headers.map((h) => [h.key, h.value]),
)

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,webmanifest}'],
        globIgnores: ['og-image.png'],
        navigateFallback: '/index.html',
      },
    }),
  ],
  preview: { headers: siteHeaders },
})
