import { PhoneIcon } from '@heroicons/react/24/outline';
import WhatsappIcon from '@/components/icons/WhatsappIcon';
import { PHONE_TEL, buildWhatsAppLink, GENERAL_WHATSAPP_MESSAGE } from '@/data/pgInfo';
import styles from './ContactActions.module.css';

interface ContactActionsProps {
  message?: string;
  tone?: 'light' | 'dark';
  className?: string;
}

export default function ContactActions({
  message = GENERAL_WHATSAPP_MESSAGE,
  tone = 'light',
  className = '',
}: ContactActionsProps) {
  return (
    <div className={`${styles.actions} ${tone === 'dark' ? styles.dark : ''} ${className}`}>
      <a href={PHONE_TEL} className={`${styles.button} ${styles.call}`}>
        <PhoneIcon className={styles.icon} aria-hidden="true" />
        Call Now
      </a>
      <a
        href={buildWhatsAppLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.button} ${styles.whatsapp}`}
      >
        <WhatsappIcon className={styles.icon} />
        WhatsApp Us
      </a>
    </div>
  );
}
