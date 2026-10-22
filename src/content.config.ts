import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Koleksi Menu — produk katalog.
 * Sumber file: src/content/menu/*.json (satu file per produk)
 */
const menu = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/menu' }),
  schema: z.object({
    name: z.string().min(1, 'Nama produk wajib diisi'),
    category: z.enum(['coffee', 'non-coffee', 'food']),
    price: z.string().min(1, 'Harga wajib diisi'),
    description: z.string().min(1, 'Deskripsi wajib diisi'),
    details: z.string().optional().default(''),
    image: z.string().min(1, 'Foto produk wajib diisi'),
    featured: z.boolean().default(false),
    available: z.boolean().default(true),
    order: z.number().default(0),
  }),
});

/**
 * Koleksi Acara — agenda kegiatan.
 * Sumber file: src/content/events/*.json
 */
const events = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/events' }),
  schema: z.object({
    title: z.string().min(1, 'Judul acara wajib diisi'),
    description: z.string().min(1, 'Deskripsi wajib diisi'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
    time: z.string().optional(),
    image: z.string().min(1, 'Foto acara wajib diisi'),
    location: z.string().optional(),
    externalLink: z.string().url().optional().or(z.literal('')),
    published: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

/**
 * Koleksi Galeri — satu file per foto, agar mudah ditambah/dihapus lewat CMS.
 * Sumber file: src/content/gallery/*.json
 */
const gallery = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/gallery' }),
  schema: z.object({
    src: z.string().min(1, 'File foto wajib dipilih'),
    alt: z.string().min(1, 'Alt text wajib diisi'),
    caption: z.string().optional(),
    order: z.number().default(0),
  }),
});

/**
 * Koleksi Settings — konfigurasi global situs.
 * Sumber file: src/content/settings/site.json
 */
const settings = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/settings' }),
  schema: z.object({
    siteName: z.string().min(1),
    tagline: z.string().min(1),
    // Kosong = pakai logo bawaan (SVG teks) yang otomatis menyesuaikan warna.
    logo: z.string().optional().default(''),
    location: z.object({
      address: z.string().min(1),
      city: z.string().min(1),
      mapLink: z.string().optional().default(''),
      coordinates: z
        .object({
          lat: z.number(),
          lng: z.number(),
        })
        .nullable()
        .optional()
        .default(null),
    }),
    contact: z.object({
      whatsapp: z.string().min(1),
      email: z.string().email(),
    }),
    social: z.object({
      instagram: z.string().optional().default(''),
      facebook: z.string().optional().default(''),
      tiktok: z.string().optional().default(''),
    }),
    hours: z.string().min(1),
    backgrounds: z.object({
      hero: z.string().min(1),
      about: z.string().optional().default(''),
      contact: z.string().optional().default(''),
    }),
    hero: z.object({
      headline: z.string().min(1),
      subheadline: z.string().optional().default(''),
    }),
    about: z.object({
      title: z.string().min(1),
      summary: z.string().min(1),
      body: z.string().optional().default(''),
    }),
  }),
});

export const collections = { menu, events, gallery, settings };
