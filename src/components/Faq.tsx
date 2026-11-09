'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Reveal from '@/components/Reveal';
import { FAQS } from '@/data/pgInfo';
import { reveal } from '@/lib/reveal';
import styles from './Faq.module.css';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className={styles.section}>
      <div className={`container ${styles.layout}`}>
        {/* First in the markup so it leads on phones; placed in the right column from tablet up. */}
        {/* Heading lines rise in one after another, then the photo is unveiled and drifts gently on scroll. */}
        <div className={styles.intro}>
          <h2 className={styles.title}>
            <span className={styles.titleBig} {...reveal('up')}>
              Everything
            </span>
            <span className={styles.titleSmall} {...reveal('up', 110)}>
              you need to know
            </span>
            <span className={styles.titleSmall} {...reveal('up', 200)}>
              before calling it
            </span>
            <span className={`${styles.titleBig} ${styles.titleAccent}`} {...reveal('up', 300)}>
              Home
            </span>
          </h2>

          <div className={styles.photo} {...reveal('clip', 380)}>
            {/* Shown at its own 925 x 869 proportions: no crop, no shaped frame. */}
            <Image
              src="/images/building-outside.png"
              alt="Sri Sai Balaji Luxury PG for Gents building in BTM Layout"
              width={925}
              height={869}
              sizes="(min-width: 1024px) 26rem, (min-width: 640px) 40vw, 90vw"
              className={styles.photoImage}
              data-parallax
            />
          </div>
        </div>

        <div className={styles.questions}>
          <span className={styles.eyebrow} {...reveal('fade')}>
            <span className={styles.rule} aria-hidden="true" />
            FAQ
          </span>
          <div className={styles.list}>
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              const panelId = `faq-panel-${index}`;
              const buttonId = `faq-button-${index}`;
              return (
                <Reveal key={faq.question} delay={120 + index * 80}>
                  <div className={`${styles.item} ${isOpen ? styles.open : ''}`}>
                    <h3>
                      <button
                        id={buttonId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        className={styles.question}
                      >
                        <span className={styles.questionText}>{faq.question}</span>
                        <span className={styles.chevronWrap} aria-hidden="true">
                          <ChevronDownIcon className={styles.chevron} />
                        </span>
                      </button>
                    </h3>
                    <div id={panelId} role="region" aria-labelledby={buttonId} className={styles.panel}>
                      <div className={styles.panelInner}>
                        <p className={styles.answer}>{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
