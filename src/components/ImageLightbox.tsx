'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { setScrollLock } from '@/lib/smoothScroll';
import styles from './ImageLightbox.module.css';

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    setScrollLock('image-lightbox', true);
    closeRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
      setScrollLock('image-lightbox', false);
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [onClose]);

  // Portal to <body> so `position: fixed` isn't trapped by transformed ancestors (Reveal, carousel cards).
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className={styles.overlay}
    >
      <button ref={closeRef} type="button" onClick={onClose} aria-label="Close image preview" className={styles.close}>
        <XMarkIcon className={styles.closeIcon} aria-hidden="true" />
      </button>
      <Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes="92vw"
        onClick={(event) => event.stopPropagation()}
        className={styles.image}
      />
    </div>,
    document.body,
  );
}
