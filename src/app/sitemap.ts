import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Served at /sitemap.xml. The section URLs (/rooms, /faq, ...) show this same page and name "/" as their
// canonical URL, so only "/" is listed: search engines index one strong page instead of seven duplicates.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      images: [
        `${SITE_URL}/og-image.jpg`,
        `${SITE_URL}/images/building-outside.png`,
        `${SITE_URL}/images/1-share.png`,
        `${SITE_URL}/images/2-share.png`,
        `${SITE_URL}/images/3-share.png`,
        `${SITE_URL}/images/4-share.png`,
      ],
    },
  ];
}
