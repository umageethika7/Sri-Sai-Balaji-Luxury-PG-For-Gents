import { ArrowUpIcon, ArrowUpRightIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import WhatsappIcon from '@/components/icons/WhatsappIcon';
import SectionLink from '@/components/SectionLink';
import { reveal } from '@/lib/reveal';
import type { SectionPath } from '@/lib/sectionRoutes';
import {
  ADDRESS_LINES,
  GENERAL_WHATSAPP_MESSAGE,
  PG_COORDS,
  PG_NAME,
  PHONE_TEL,
  buildMapSearchUrl,
  buildWhatsAppLink,
} from '@/data/pgInfo';
import styles from './Footer.module.css';

const EXPLORE_LINKS: { to: SectionPath; label: string }[] = [
  { to: '/rooms', label: 'Rooms' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/location', label: 'Location' },
  { to: '/nearby', label: 'Nearby Places' },
  { to: '/faq', label: 'FAQs' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* Brand + "Book a Visit" (jumps to the Plan your visit form). */}
        <div className={styles.top}>
          <div className={styles.brandBlock} {...reveal('up')}>
            <SectionLink to="/" className={styles.brand}>
              <span className={styles.brandName}>Sri Sai Balaji</span>
              <span className={styles.tagline}>Luxury PG for Gents</span>
            </SectionLink>
            <p className={styles.blurb}>
              A comfortable, secure and homely PG for working professionals and students in BTM Layout 2nd Stage,
              Bengaluru.
            </p>
          </div>
          <SectionLink to="/contact-us" className={styles.book} {...reveal('up', 140)}>
            Book a Visit
          </SectionLink>
        </div>

        <div className={styles.columns}>
          <div className={styles.column} {...reveal('up', 100)}>
            <h3 className={styles.heading}>Explore</h3>
            <ul className={styles.links}>
              {EXPLORE_LINKS.map((link, index) => (
                <li key={link.to} {...reveal('left', 220 + index * 70)}>
                  <SectionLink to={link.to} className={styles.link}>
                    {link.label}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column} {...reveal('up', 220)}>
            <h3 className={styles.heading}>Location</h3>
            <div className={styles.address}>
              <MapPinIcon className={styles.addressIcon} aria-hidden="true" />
              <div>
                <address className={styles.addressText}>
                  {ADDRESS_LINES.map((line) => (
                    <span key={line} className={styles.line}>
                      {line}
                    </span>
                  ))}
                </address>
                <a
                  href={buildMapSearchUrl(`${PG_COORDS.lat},${PG_COORDS.lng}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapLink}
                >
                  View on Maps
                  <ArrowUpRightIcon className={styles.mapLinkIcon} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          <div className={styles.column} {...reveal('up', 340)}>
            <h3 className={styles.heading}>Contact Us</h3>
            {/* Same links as the floating buttons and the rest of the site. */}
            <div className={styles.socials}>
              <a
                href={buildWhatsAppLink(GENERAL_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Chat with ${PG_NAME} on WhatsApp`}
                className={styles.social}
              >
                <WhatsappIcon className={styles.socialIcon} />
              </a>
              <a href={PHONE_TEL} aria-label={`Call ${PG_NAME}`} className={styles.social}>
                <PhoneIcon className={styles.socialIcon} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom} {...reveal('fade', 200)}>
          <p>
            © {new Date().getFullYear()} {PG_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
