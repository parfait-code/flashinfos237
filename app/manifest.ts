// app/manifest.ts
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FlashInfos237',
    short_name: 'FlashInfos237',
    description: 'Actualités camerounaises et internationales',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1e3a8a', // Adaptez à votre charte graphique
    icons: [
      {
        src: '/icon.svg',
        sizes: '192x192',
        type: 'image/svg'
      },
      {
        src: '/logo.svg',
        sizes: '512x512',
        type: 'image/svg'
      }
    ]
  }
}