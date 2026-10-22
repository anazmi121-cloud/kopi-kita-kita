// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Konfigurasi Astro untuk Kopi Kita Kita.
 *
 * Target deployment: Cloudflare Pages
 * - Build command : npm run build
 * - Output directory: dist
 *
 * Cloudflare Pages sudah menangani routing SPA/SSR lewat adapter-nya,
 * tapi website ini sepenuhnya statis (SSG), jadi adapter tidak wajib.
 */
export default defineConfig({
  site: 'https://kopi-kita-kita.pages.dev',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  devToolbar: {
    enabled: false,
  },
});
