/**
 * Site-wide SEO settings.
 *
 * Set these in `.env.local` (development) and in your hosting provider's environment settings (production):
 *   NEXT_PUBLIC_SITE_URL  the live address, e.g. https://www.example.com  (used for canonical links,
 *                         sitemap.xml, robots.txt and social-share previews)
 *   NEXT_PUBLIC_GTM_ID    your Google Tag Manager container ID, e.g. GTM-XXXXXXX  (GTM loads only when set)
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001').replace(/\/+$/, '');

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() || '';

export const SITE_NAME = 'Sri Sai Balaji Luxury PG for Gents';

export const DEFAULT_TITLE = 'Sri Sai Balaji Luxury PG for Gents | Gents PG in BTM Layout 2nd Stage, Bengaluru';

/** Social-share preview card (1200×630, public/og-image.jpg). Kept under ~100 KB so WhatsApp shows it. */
export const OG_IMAGE = {
  url: '/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'Sri Sai Balaji Luxury PG for Gents, BTM Layout 2nd Stage, Bengaluru',
};

export const DEFAULT_DESCRIPTION =
  'Premium fully furnished PG for gents in BTM Layout 2nd Stage, Bengaluru. Single to four sharing rooms with attached bathrooms, veg and non-veg meals, high-speed Wi-Fi, 24/7 hot water, biometric entry and CCTV security.';
