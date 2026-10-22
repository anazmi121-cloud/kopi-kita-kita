# Kopi Kita Kita — Website Katalog + Dashboard Admin

Website katalog coffee shop **Kopi Kita Kita** (tagline: *Bebaskan Semuanya*, Batam, Indonesia)
dibangun dengan **Astro** dan dikelola lewat **Decap CMS**. Konten disimpan sebagai **file JSON di
repository Git** — tidak ada database tradisional.

- **Public website**: Beranda, Tentang Kami, Menu, Acara, Galeri, Kontak
- **Dashboard admin**: `/admin/` (Decap CMS) — kelola menu, acara, galeri, dan pengaturan situs
- **Hosting**: Cloudflare Pages (build statis ke folder `dist/`)

---

## 1. Instalasi & Menjalankan Secara Lokal

Prasyarat: **Node.js 22+** dan **Git**.

```bash
cd kopi-kita-kita
npm install
npm run dev          # server lokal: http://localhost:4321
```

Perintah lain:

```bash
npm run build        # build produksi -> dist/
npm run preview      # preview hasil build
```

> `npm run build` harus selalu **berhasil** sebelum commit. Jika build error,
> perbaiki dulu — jangan deploy hasil yang rusak.

---

## 2. Struktur Proyek

```
kopi-kita-kita/
├── public/
│   ├── admin/
│   │   ├── index.html        # Dashboard Decap CMS (diakses /admin/)
│   │   └── config.yml        # Konfigurasi koleksi CMS — SATU-SATUNYA sumber aturan form
│   └── images/
│       ├── logo/logo.svg     # ★ LOGO — ganti file ini untuk ganti logo
│       ├── backgrounds/      # ★ FOTO LATAR — hero/about/contact
│       ├── menu/ events/ gallery/   # Foto placeholder (ganti dengan foto asli)
│       └── uploads/          # Folder tujuan upload gambar dari CMS
├── src/
│   ├── content.config.ts     # Schema validasi koleksi (menu/events/gallery/settings)
│   ├── content/              # ★ KONTEN — semua yang tampil di website
│   │   ├── menu/*.json       #   satu file per produk
│   │   ├── events/*.json     #   satu file per acara (published/draft)
│   │   ├── gallery/*.json    #   satu file per foto
│   │   └── settings/site.json#   pengaturan global (logo, background, kontak, lokasi)
│   ├── components/           # Navbar, Footer, cards, dll.
│   ├── layouts/PublicLayout.astro
│   ├── lib/data.ts           # ★ Satu-satunya sumber pembacaan data (dipakai Home & halaman)
│   ├── pages/                # Rute halaman (file-based routing)
│   └── styles/global.css     # Design system
└── astro.config.mjs
```

**Aturan emas**: semua data dibaca lewat `src/lib/data.ts` → koleksi content → file JSON.
Tidak ada data duplikat di kode. Ubah file JSON (atau lewat CMS), maka semua halaman ikut
berubah setelah build.

---

## 3. ★ CARA MENGGANTI LOGO

1. Siapkan file logo (SVG / PNG / WebP, disarankan transparan, lebar ±400–600px).
2. Salin ke `public/images/logo/` — contoh: `logo-baru.png`.
3. Ubah nilai `logo` di `src/content/settings/site.json`:

   ```json
   "logo": "/images/logo/logo-baru.png"
   ```

**Atau lewat dashboard** (setelah CMS terkonfigurasi): *Pengaturan Situs → Umum → Logo*
(field `logo`) → pilih file lewat Media Library → Publish → commit ke Git.

Jika `logo` dikosongkan (`""`), website memakai wordmark bawaan (SVG inline bawaan,
font Cinzel, otomatis mengikuti warna navbar/footer).

---

## 4. ★ CARA MENGGANTI FOTO LATAR (BACKGROUND)

Tiga slot latar yang bisa diganti:

| Slot | Dipakai di | File saat ini |
|---|---|---|
| `backgrounds.hero` | Hero beranda + band menu unggulan | `public/images/backgrounds/hero.svg` |
| `backgrounds.about` | Section "Tentang Kami" di beranda + halaman Tentang | `public/images/backgrounds/about.svg` |
| `backgrounds.contact` | Hero halaman Kontak | `public/images/backgrounds/contact.svg` |

**Cara 1 — Edit file (tanpa CMS):**

1. Taruh foto Anda di `public/images/backgrounds/` — contoh `hero-foto.jpg`.
2. Buka `src/content/settings/site.json`, ubah:

   ```json
   "backgrounds": {
     "hero": "/images/backgrounds/hero-foto.jpg",
     "about": "/images/backgrounds/about-foto.jpg",
     "contact": "/images/backgrounds/contact-foto.jpg"
   }
   ```

**Cara 2 — Lewat dashboard** (setelah CMS siap): *Pengaturan Situs → Foto Latar (Background)*
→ pilih file tiap slot → Publish.

Catatan:
- Rekomendasi ukuran: hero minimal **1600px lebar**, rasio sekitar 16:9 atau lebih lebar.
- Format: `.jpg` / `.png` / `.webp` / `.avif`. Boleh SVG untuk ilustrasi.
- Jika file tidak ada, section otomatis menampilkan placeholder — layout tidak pernah rusak.
- Perubahan konten **baru tampil di website live setelah build/deployment selesai**
  (otomatis berjalan di Cloudflare Pages setelah push ke Git).

---

## 5. Menambah / Mengubah Konten (Tanpa CMS — Opsional)

Semua konten adalah file JSON dengan schema di `src/content.config.ts`
(validasi wajib jalan saat build — data tidak valid membuat build gagal).

- **Produk**: tambah file baru di `src/content/menu/` — salin pola `espresso.json`.
- **Acara**: tambah file di `src/content/events/`. Set `"published": false` untuk draft —
  draft **tidak pernah** tampil di website publik.
- **Foto galeri**: tambah file di `src/content/gallery/` (butuh `src`, `alt`, urutan `order`).

Hapus file = konten hilang dari website (setelah build ulang).

---

## 6. Dashboard Admin (Decap CMS)

Admin ada di **`/admin/`** dan dikonfigurasi lewat `public/admin/config.yml`.

Koleksi yang tersedia:

| Koleksi | Folder file |
|---|---|
| Menu (produk) | `src/content/menu/` |
| Acara (termasuk toggle Draft/Published) | `src/content/events/` |
| Galeri | `src/content/gallery/` |
| Pengaturan Situs (nama, tagline, logo, **background**, kontak, lokasi) | `src/content/settings/site.json` |

> **Status saat ini**: konfigurasi CMS sudah lengkap dan sesuai schema, **tetapi autentikasi
> GitHub belum diuji** — itu memerlukan setup GitHub OAuth (langkah manual, lihat §7).
> Sebelum itu, CMS belum bisa dipakai menyimpan konten. Jangan mengklaim CMS sudah berfungsi
> sebelum diuji end-to-end.

---

## 7. Autentikasi CMS — Yang Masih Perlu Dilakukan Manual

Decap CMS dengan backend GitHub **tidak punya login bawaan**. Anda harus menyediakan
sebuah **OAuth authorization endpoint**. Tanpa ini, `/admin/` hanya menampilkan layar login
yang tidak bisa dilanjutkan. Jangan taruh token/password apa pun di kode frontend.

### Opsi (pilih satu)

**Opsi A — Decap CMS OAuth Server (2026, cara paling umum, murah/gratis)**

1. Deploy [Decap CMS OAuth Server](https://github.com/decap-cms/decap-cms-oauth-server-proxy)
   (contoh ke Vercel/Netlify, gratis) **atau** pakai penyedia layanan OAuth Decap.
2. Buat **GitHub OAuth App** di GitHub → *Settings → Developer settings → OAuth Apps → New*:
   - Homepage URL: `https://<domain-anda>`
   - Authorization callback URL: `https://<oauth-server-anda>/callback`
3. Dapatkan `Client ID` dan `Client Secret`.
4. Set environment variable di server OAuth (bukan di website ini):
   `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, `GATEWAY_PROVIDER=github`.
5. Di `public/admin/config.yml`, tambahkan:

   ```yaml
   backend:
     name: github
     repo: <username>/kopi-kita-kita
     branch: main
     base_url: https://<oauth-server-anda>
   ```

**Opsi B — Netlify Identity (gratis, paling cepat kalau mau pakai Netlify)**

`backend: { name: netlify, identity_provider: netlify }` + aktifkan Identity di dashboard
Netlify. **Catatan**: butuh akun Netlify; untuk hosting di Cloudflare Pages Anda tetap bisa
memakai Netlify Identity sebagai layanan auth terpisah, tapi lebih banyak pindah-pindah
dashboard. Opsi A lebih cocok untuk hosting Cloudflare Pages.

### Biaya

- GitHub OAuth App: **gratis**.
- Server OAuth (Opsi A): gratis di tier hobby (Vercel/Netlify), bisa ditingkat kalau perlu.
- Netlify Identity: gratis untuk situs personal.
- Tidak ada biaya tambahan untuk website ini sendiri (Cloudflare Pages gratis).

### Memberi / Mencabut Akses Editor

Akses ditentukan oleh **siapa yang punya akses commit ke repository GitHub** (plus cara Anda
membagikan login OAuth, misal Netlify Identity user list):

1. **Memberi**: undang collaborator di GitHub (*repo → Settings → Collaborators*) **dan**
   tambahkan emailnya sebagai user di layanan auth (Netlify Identity / OAuth server Anda).
2. **Mencabut**: hapus collaborator di GitHub + hapus user di layanan auth.

### Kejujuran status

- Konfigurasi koleksi CMS: **selesai** (dicocokkan dengan schema Astro).
- Autentikasi & alur commit CMS → Git → deploy: **BELUM diuji**, harus dikonfigurasi manual
  (OAuth server di atas) lalu diuji: login → edit → publish → commit masuk repo →
  Cloudflare Pages rebuild → halaman publik ter-update.
- Tidak ada password/token di frontend. Customer (pengunjung biasa) **tidak bisa mengubah
  konten** — tidak ada endpoint tulis di website publik; tulis hanya lewat Git/GitHub API
  yang diautentikasi di belakang OAuth.

---

## 8. Deploy ke Cloudflare Pages

1. **Buat repository GitHub** (misal dari folder ini):

   ```bash
   git init -b main
   git add .
   git commit -m "Initial commit: Kopi Kita Kita"
   git remote add origin https://github.com/<username>/kopi-kita-kita.git
   git push -u origin main
   ```

2. Buka Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Pilih repository. Isi:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Deploy. Setelah sukses, Anda dapat URL gratis:
   `https://kopi-kita-kita.pages.dev`.
5. Update **`site_url` / `display_url`** di `public/admin/config.yml` dan `site` di
   `astro.config.mjs` dengan URL asli Anda.
6. **Domain sendiri (nanti)**: Cloudflare Pages → Custom domains → ikuti instruksinya.
7. **Setelah update `config.yml` atau `astro.config.mjs`**: push ke Git → Cloudflare Pages
   build ulang otomatis → `/admin/` memakai konfigurasi baru.

**Setelah konten diubah via CMS**: CMS commit ke Git → Cloudflare Pages auto-build →
website publik ter-update **setelah build selesai** (biasanya <1 menit). Perubahan di
repositori **tidak langsung terlihat** tanpa build/deploy.

---

## 9. Uji Coba yang Sudah Dijalankan

| Item | Status |
|---|---|
| Build produksi (`npm run build`) | ✅ 18 halaman sukses |
| Semua halaman publik terbuka (200) | ✅ Beranda, Tentang, Menu (daftar+detail), Acara (daftar+detail), Galeri, Kontak |
| Navbar + active state + mobile menu | ✅ |
| Search & filter kategori Menu (client-side) | ✅ diuji via browser |
| Detail produk & detail acara | ✅ |
| Draft acara tidak tampil di publik | ✅ (dibuktikan: acara draft tidak ada di /acara/ dan tidak di-route) |
| Footer konsisten di semua halaman | ✅ satu komponen `Footer.astro` |
| Login Decap / commit via CMS | ⏳ belum — butuh setup OAuth (§7) |
| Upload gambar via CMS | ⏳ belum — mengikuti status login |
| Responsive mobile | ✅ ditinjau di viewport kecil; lanjut uji perangkat nyata disarankan |

---

## 10. Batasan yang Perlu Diketahui

1. **Foto placeholder** — semua foto saat ini SVG placeholder. Ganti dengan foto asli
   (lihat §3, §4) sebelum live sungguhan.
2. **Data bisnis placeholder** — harga (`Rp XX.XXX`), alamat, nomor WhatsApp, email, akun
   sosial, dan koordinat belum diisi data asli karena belum diberikan. Semua ada di
   `src/content/settings/site.json` dan `src/content/*.json`. **Jangan menganggap
   placeholder sebagai fakta bisnis.**
3. **Peta** — selama `coordinates` null, peta hanya ilustrasi. Isi `lat`/`lng` di settings
   → halaman Kontak otomatis menampilkan embed Google Maps.
4. **CMS butuh OAuth** — belum berfungsi sebelum langkah §7 dijalankan dan diuji.
5. **Bukan toko online** — tidak ada cart/checkout/pembayaran, sesuai kebutuhan katalog.
6. **Git + deployment** — konten tersimpan di Git; perubahan baru tampil setelah build
   sukses di Cloudflare Pages.
