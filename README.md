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

> **Status**: konfigurasi CMS sudah lengkap dan sesuai schema, dan `backend` sudah di-set
> ke **Netlify**. Login diuji end-to-end **setelah** langkah §7 selesai (butuh site yang sudah
> ter-deploy + Identity aktif). Sebelum itu `/admin/` hanya menampilkan layar login yang tidak
> bisa dilanjutkan. Jangan mengklaim CMS sudah berfungsi sebelum diuji: login → edit →
> publish → commit masuk repo → Netlify rebuild → halaman publik ter-update.

---

## 7. Autentikasi CMS — Langkah Manual

Decap CMS tidak punya login bawaan. Tanpa sebuah **OAuth / Identity provider**, `/admin/`
hanya menampilkan layar login yang tidak bisa dilanjutkan. Jangan taruh token/password
apa pun di kode frontend.

### Jalur yang dipakai: Netlify Identity (Opsi utama)

`public/admin/config.yml` sudah diset `backend.name: netlify`, jadi tinggal:

1. **Push repo ke GitHub** (lihat §8).
2. Di [Netlify](https://app.netlify.com): *Add new site → Import an existing project →
   GitHub →* pilih `kopi-kita-kita`.
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version diambil dari `engines` di `package.json`.
   Biarkan deploy pertama selesai.
3. **Nyalakan Identity**: *Site configuration → Identity → Enable Identity*.
4. **Nyalakan Git Gateway**: *Identity → Services → Git Gateway → Enable*.
   Ini yang membuat Decap CMS bisa commit ke GitHub.
5. **Undang diri sendiri**: *Identity → Users → Invite users* → masukkan email Anda →
   buka tautan undangan → set password → *Login*.
6. Buka `https://<nama-site-anda>.netlify.app/admin/` → login dengan email + password tadi.

Selesai — tidak perlu GitHub OAuth App, tidak perlu server OAuth terpisah.

> **Samakan nama site**: pastikan nama site di Netlify = `kopi-kita-kita` supaya domain
> jadi `https://kopi-kita-kita.netlify.app`, sesuai `site_url` di `config.yml`.
> Kalau namanya beda, ubah `site_url`/`display_url` di `config.yml` **dan** `siteUrl` di
> `src/content/settings/site.json`, lalu commit ulang.

### Alternatif: Decap CMS OAuth Server (bila kelak pindah ke Cloudflare Pages / Vercel)

Host tersebut tidak punya Identity bawaan, jadi perlu OAuth proxy sendiri:

1. Deploy [Decap CMS OAuth Server](https://github.com/decap-cms/decap-cms-oauth-server-proxy).
2. Buat **GitHub OAuth App** (*Settings → Developer settings → OAuth Apps → New*):
   - Homepage URL: `https://<domain-anda>`
   - Authorization callback URL: `https://<oauth-server-anda>/callback`
3. Set `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET`, `GATEWAY_PROVIDER=github` di server OAuth
   (bukan di website ini).
4. Balikkan `backend` di `config.yml` menjadi:

   ```yaml
   backend:
     name: github
     repo: anazmi121-cloud/kopi-kita-kita
     branch: main
     base_url: https://<oauth-server-anda>
   ```

### Biaya

- Netlify Identity + Git Gateway: **gratis** untuk situs personal.
- GitHub OAuth App & server OAuth (alternatif): gratis di tier hobby.
- Tidak ada biaya tambahan untuk website ini sendiri.

### Memberi / Mencabut Akses Editor

Untuk tiap editor, lakukan **dua** hal ini (salah satu saja tidak cukup):

1. **Memberi**: *repo GitHub → Settings → Collaborators → Add people* **dan**
   undang emailnya lewat *Identity → Users → Invite users*.
2. **Mencabut**: hapus collaborator di GitHub **dan** hapus user di Netlify Identity.

### Kejujuran status

- Konfigurasi koleksi CMS: **selesai** (dicocokkan dengan schema Astro).
- `backend` CMS: **sudah di-set ke Netlify**, tapi **belum diuji end-to-end** — langkah 1–6
  di atas masih manual dan harus diverifikasi: login → edit → publish → commit masuk repo →
  Netlify rebuild → halaman publik ter-update.
- Tidak ada password/token di frontend. Customer (pengunjung biasa) **tidak bisa mengubah
  konten** — tidak ada endpoint tulis di website publik; tulis hanya lewat Git API yang
  diautentikasi di belakang Netlify Identity.

---

## 8. Push ke GitHub + Deploy ke Netlify

Repository `anazmi121-cloud/kopi-kita-kita` sudah ada dan remote `origin` sudah terpasang.

### 8a. Push perubahan ke GitHub (dari komputer)

```bash
cd "C:\Users\anazm\Downloads\WEB KOPI KITA KITA\kopi-kita-kita"

# kalau pernah crash dan git bilang "index.lock exists":
del .git\index.lock

git add -A
git commit -m "Lengkapkan konten, tipografi Cinzel, dan konfigurasi admin Netlify"
git push origin main
```

> Commit pertama repo masih memakai author `nama-anda` (placeholder). Untuk perbaiki:
> `git config user.name "Nama Asli"` dan `git config user.email "email@anda.com"`,
> lalu `git commit --amend --reset-author` pada commit terakhir **sebelum** push.

### 8b. Deploy ke Netlify

1. Buka [app.netlify.com](https://app.netlify.com) → *Add new site → Import an existing
   project → GitHub* → pilih `kopi-kita-kita`.
2. Isi:
   - **Site name**: `kopi-kita-kita` (agar domain jadi
     `https://kopi-kita-kita.netlify.app`, sesuai `config.yml`)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - Node version diambil dari `engines` di `package.json`
3. **Deploy site**, tunggu sampai hijau.
4. Lanjutkan ke §7 (nyalakan Identity + Git Gateway + undang user) supaya `/admin/` bisa
   dipakai.

**Setelah konten diubah via CMS**: CMS commit ke Git → Netlify auto-build → website publik
ter-update **setelah build selesai** (biasanya <1 menit). Perubahan di repositori
**tidak langsung terlihat** tanpa build/deploy.

### 8c. Troubleshooting

**Build gagal: "Node.js vX is not supported by Astro"**

Astro 7 butuh Node `>=22.23.4` (lihat `engines` di `package.json`). Kalau Netlify memakai
versi lebih lama:

1. Netlify → *Site configuration → Environment variables* → tambah:
   `NODE_VERSION` = `24`
2. *Deploys → Trigger deploy → Deploy site*.

Secara lokal, cek dengan `node -v`; kalau kurang, upgrade Node atau pakai `nvm install 22`.

**`/admin/` 404** — `public/admin/` belum ter-copy ke `dist/`. Jalankan `npm run build`
lokal dan cek `dist/admin/` ada isinya. (Sudah diverifikasi ada.)

**Login `/admin/` gagal / muter terus** — Identity atau Git Gateway belum dinyalakan,
atau email Anda belum diundang. Ulangi §7 langkah 3–5.

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
