'use client';

import { useEffect } from 'react';
import { createSmoothScroll, destroySmoothScroll } from '@/lib/smoothScroll';

/** Starts the site-wide smooth scrolling (see src/lib/smoothScroll.ts). Renders nothing. */
export default function SmoothScroll() {
  useEffect(() => {
    createSmoothScroll();
    return destroySmoothScroll;
  }, []);

  return null;
}
