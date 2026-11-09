import type { CSSProperties } from 'react';
import { PG_NAME } from '@/data/pgInfo';
import styles from './Hero.module.css';

// Each heading word rises in slightly after the previous one.
const WORD_STAGGER_MS = 90;
const TITLE_WORDS = PG_NAME.split(' ');

export default function Hero() {
  return (
    <section id="top" className={styles.hero}>
      {/* Background video: gently settles (a slight zoom-out) as the page opens. */}
      <div className={styles.media} aria-hidden="true">
        <video
          className={styles.video}
          src="/images/hero-banner-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
        />
      </div>
      <div aria-hidden="true" className={styles.shade} />

      <div className={`container ${styles.content}`}>
        <span className={`${styles.reveal} ${styles.badge}`}>
          <span className={styles.dot}>
            <span className={styles.dotPing} />
            <span className={styles.dotCore} />
          </span>
          Gents Only | BTM Layout 2nd Stage, Bengaluru
        </span>

        <h1 className={styles.title}>
          {TITLE_WORDS.map((word, index) => (
            <span key={`${word}-${index}`}>
              <span className={styles.word}>
                <span
                  className={styles.wordInner}
                  style={{ '--word-delay': `${index * WORD_STAGGER_MS}ms` } as CSSProperties}
                >
                  {word}
                </span>
              </span>
              {index < TITLE_WORDS.length - 1 && ' '}
            </span>
          ))}
        </h1>

        <p className={`${styles.reveal} ${styles.lead}`}>
          A premium paying guest home for working professionals and students. Well-ventilated, fully furnished rooms
          with attached bathrooms, home-style meals, and a secure, calm environment you can call home.
        </p>
      </div>
    </section>
  );
}
