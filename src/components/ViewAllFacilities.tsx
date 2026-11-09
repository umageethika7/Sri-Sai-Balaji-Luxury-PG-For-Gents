'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FACILITY_ICONS } from '@/components/icons/FacilityIcons';
import { FACILITIES } from '@/data/pgInfo';
import { reveal } from '@/lib/reveal';
import { setScrollLock } from '@/lib/smoothScroll';
import styles from './ViewAllFacilities.module.css';

// Matches the closing animation length in ViewAllFacilities.module.css.
const CLOSE_MS = 220;
const LABEL = 'View All Facilities';

function FacilitiesModal({ closing, onClose }: { closing: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    setScrollLock('facilities-modal', true);
    closeRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
      setScrollLock('facilities-modal', false);
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [onClose]);

  // Portal to <body> so `position: fixed` isn't trapped by transformed ancestors (Reveal).
  return createPortal(
    // data-lenis-prevent: the list scrolls natively while the page behind is paused.
    <div className={`${styles.overlay} ${closing ? styles.closing : ''}`} onClick={onClose} data-lenis-prevent>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="all-facilities-title"
        className={styles.dialog}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <div>
            <h2 id="all-facilities-title" className={styles.heading}>
              All Facilities
            </h2>
            <p className={styles.subheading}>{FACILITIES.length} facilities included with every room</p>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className={styles.close}>
            <XMarkIcon className={styles.closeIcon} aria-hidden="true" />
          </button>
        </div>

        <ul className={styles.grid}>
          {FACILITIES.map((facility) => {
            const Icon = FACILITY_ICONS[facility.icon];
            return (
              <li key={facility.title} className={styles.card}>
                <span className={styles.cardIcon}>
                  <Icon className={styles.cardIconSvg} />
                </span>
                <div className={styles.cardText}>
                  <h3 className={styles.cardTitle}>{facility.title}</h3>
                  <p className={styles.cardDescription}>{facility.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>,
    document.body,
  );
}

export default function ViewAllFacilities() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  const close = useCallback(() => {
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, CLOSE_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <>
      <div className={styles.slot} {...reveal('up', 340)}>
        {/* "View All Facilities": the letters hop in a wave and a shine sweeps across every 5.2s (CSS keyframes). */}
        <button
          type="button"
          className={styles.trigger}
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label={LABEL}
        >
          {/* Each letter is its own span so the text can ripple in a wave, one letter after another. */}
          <span className={styles.triggerLabel} aria-hidden="true">
            {[...LABEL].map((letter, index) => (
              <span key={index} className={styles.letter} style={{ animationDelay: `${index * 35}ms` }}>
                {letter}
              </span>
            ))}
          </span>
        </button>
      </div>

      {open && <FacilitiesModal closing={closing} onClose={close} />}
    </>
  );
}
