import { reveal } from '@/lib/reveal';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'light',
}: SectionHeadingProps) {
  return (
    // Eyebrow, title and description rise in one after another.
    <div className={`${styles.heading} ${styles[align]} ${tone === 'dark' ? styles.dark : ''}`}>
      <span className={styles.eyebrow} {...reveal('fade')}>
        <span className={styles.rule} />
        {eyebrow}
        <span className={styles.rule} />
      </span>
      <h2 className={styles.title} {...reveal('up', 110)}>
        {title}
      </h2>
      {description && (
        <p className={styles.description} {...reveal('up', 230)}>
          {description}
        </p>
      )}
    </div>
  );
}
