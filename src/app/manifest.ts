import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WCYDTT PWA',
    short_name: 'WCYDTTPWA',
    description: 'A Progressive Web App built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: "#ffffff",
    icons: [
      {
        src: "icon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      }, {
        src: "icon-256x256.png",
        sizes: "256x256",
        type: "image/png"
      }, {
        src: "icon-384x384.png",
        sizes: "384x384",
        type: "image/png"
      }, {
        src: "icon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],

  }
}