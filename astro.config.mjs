// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Konfigurasi Astro untuk Kopi Kita Kita.
 *
 * Target deployment: Netlify
 * - Build command  : npm run build
 * - Output directory: dist
 *
 * Website ini sepenuhnya statis (SSG), jadi tidak perlu adapter apa pun.
 *
 * CATATAN: nilai `site` dipakai untuk canonical URL & sitemap. Kalau nama site
 * di Netlify diganti, sesuaikan juga `site_url`/`display_url` di
 * public/admin/config.yml dan `siteUrl` di src/content/settings/site.json.
 */
export default defineConfig({
  site: 'https://kopi-kita-kita.netlify.app',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  devToolbar: {
    enabled: false,
  },
});
