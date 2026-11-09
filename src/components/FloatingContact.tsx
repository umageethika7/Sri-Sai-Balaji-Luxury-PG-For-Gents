'use client';

import { PhoneIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import WhatsappIcon from '@/components/icons/WhatsappIcon';
import { GENERAL_WHATSAPP_MESSAGE, PHONE_TEL, buildWhatsAppLink } from '@/data/pgInfo';
import styles from './FloatingContact.module.css';

export default function FloatingContact() {
  // Hidden once the footer scrolls into view: it has its own WhatsApp and phone buttons.
  const [overFooter, setOverFooter] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer || typeof IntersectionObserver === 'undefined') return;
    // Only hide once the footer fills the lower third of the screen, so the buttons stay with the Contact Us form.
    const observer = new IntersectionObserver(([entry]) => setOverFooter(entry.isIntersecting), {
      rootMargin: '0px 0px -35% 0px',
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`${styles.floating} ${overFooter ? styles.hidden : ''}`} aria-hidden={overFooter || undefined}>
      <a
        href={PHONE_TEL}
        aria-label="Call Sri Sai Balaji Luxury PG"
        className={styles.call}
        tabIndex={overFooter ? -1 : undefined}
      >
        <PhoneIcon className={styles.callIcon} aria-hidden="true" />
      </a>
      <a
        href={buildWhatsAppLink(GENERAL_WHATSAPP_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Sri Sai Balaji Luxury PG on WhatsApp"
        className={styles.whatsapp}
        tabIndex={overFooter ? -1 : undefined}
      >
        <span className={styles.ping} aria-hidden="true" />
        <WhatsappIcon className={styles.whatsappIcon} />
      </a>
    </div>
  );
}
