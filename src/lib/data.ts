import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

/**
 * Lapisan akses data terpusat.
 *
 * Semua halaman — termasuk preview di Home — membaca dari sini.
 * Jadi tidak ada data duplikat: yang tampil di Home dijamin sama dengan
 * yang tampil di halaman lengkapnya.
 */

export type MenuItem = CollectionEntry<'menu'>;
export type EventItem = CollectionEntry<'events'>;
export type GalleryItem = CollectionEntry<'gallery'>;

export type SiteSettings = NonNullable<Awaited<ReturnType<typeof loadSettings>>>;

export async function loadSettings() {
  const entry = await getEntry('settings', 'site');
  return entry?.data ?? null;
}

/** Produk yang tersedia, diurutkan sesuai urutan manual (order, lalu nama). */
export async function getMenu(options: { featuredOnly?: boolean } = {}) {
  const items = await getCollection('menu');
  return items
    .filter((item) => item.data.available)
    .filter((item) => (options.featuredOnly ? item.data.featured : true))
    .sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}

/**
 * Acara yang dipublikasikan saja.
 * Draft tidak pernah sampai ke website publik.
 */
export async function getPublishedEvents() {
  const items = await getCollection('events');
  return items
    .filter((item) => item.data.published)
    .sort((a, b) => a.data.date.localeCompare(b.data.date) || a.data.order - b.data.order);
}

export function todayStr() {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${mm}-${dd}`;
}

/** Acara yang tanggalnya belum lewat — ini yang ditonjolkan di Home. */
export function splitEvents(events: EventItem[]) {
  const today = todayStr();
  const upcoming = events.filter((e) => e.data.date >= today);
  const past = events.filter((e) => e.data.date < today).reverse();
  return { upcoming, past };
}

/** Foto galeri, diurutkan sesuai urutan manual. */
export async function getGallery() {
  const items = await getCollection('gallery');
  return items.sort((a, b) => a.data.order - b.data.order);
}

/** Slug URL yang aman dari sebuah id konten. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
