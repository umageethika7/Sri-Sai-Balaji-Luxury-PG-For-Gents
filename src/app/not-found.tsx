import { ArrowLeftIcon, BuildingOffice2Icon, PhoneIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';
import { PHONE_DISPLAY, PHONE_TEL } from '@/data/pgInfo';
import { SECTION_ROUTES } from '@/lib/sectionRoutes';
import styles from './not-found.module.css';

// Shown for any address that doesn't exist. Next.js also tells search engines not to index it.
export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The page you are looking for does not exist. Explore Sri Sai Balaji Luxury PG for Gents in BTM Layout.',
  // Never index a missing page, but do follow its links back into the site.
  robots: { index: false, follow: true },
};

const LABELS: Record<string, string> = {
  rooms: 'Rooms',
  facilities: 'Facilities',
  location: 'Location',
  nearby: 'Nearby Places',
  faq: 'FAQs',
};

export default function NotFound() {
  const links = SECTION_ROUTES.filter((route) => LABELS[route.id]);

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <a href="/" className={styles.brand}>
          <span className={styles.logo}>
            <BuildingOffice2Icon className={styles.logoIcon} aria-hidden="true" />
          </span>
          <span className={styles.brandText}>
            Sri Sai Balaji
            <span className={styles.tagline}>Luxury PG for Gents</span>
          </span>
        </a>

        <p className={styles.code} aria-hidden="true">
          404
        </p>
        <h1 className={styles.title}>This page doesn’t exist</h1>
        <p className={styles.text}>
          The link may be broken or the page may have moved. Head back home to explore our rooms, facilities and
          location in BTM Layout 2nd Stage.
        </p>

        <div className={styles.actions}>
          <a href="/" className={styles.primary}>
            <ArrowLeftIcon className={styles.buttonIcon} aria-hidden="true" />
            Back to home
          </a>
          <a href="/contact-us" className={styles.secondary}>
            Contact us
          </a>
        </div>

        <nav aria-label="Explore the site" className={styles.links}>
          {links.map((route) => (
            <a key={route.path} href={route.path} className={styles.link}>
              {LABELS[route.id]}
            </a>
          ))}
        </nav>

        <a href={PHONE_TEL} className={styles.phone}>
          <PhoneIcon className={styles.phoneIcon} aria-hidden="true" />
          {PHONE_DISPLAY}
        </a>
      </div>
    </main>
  );
}
