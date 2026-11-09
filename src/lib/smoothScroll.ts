import Lenis from 'lenis';

/**
 * Site-wide smooth scrolling (Lenis). Mouse-wheel / trackpad scrolling is eased; the scrollbar,
 * keyboard and phone touch scrolling stay native. Visitors who prefer reduced motion get plain scrolling.
 *
 * Anything that needs the page to hold still (pop-ups, the phone menu) takes a named lock;
 * scrolling resumes when every lock is released.
 */
let lenis: Lenis | null = null;
const locks = new Set<string>();

function applyLocks() {
  if (!lenis) return;
  if (locks.size) lenis.stop();
  else lenis.start();
}

export function createSmoothScroll(): Lenis {
  if (lenis) return lenis;
  lenis = new Lenis({
    autoRaf: true,
    // ~1.1s glide with a soft landing: smooth but not floaty.
    lerp: 0.09,
    wheelMultiplier: 1,
    smoothWheel: true,
    syncTouch: false,
    // Let the map scroll / pan normally while it is in browser full-screen mode.
    prevent: (node) => node === document.fullscreenElement,
  });
  applyLocks();
  return lenis;
}

export function destroySmoothScroll() {
  lenis?.destroy();
  lenis = null;
}

export const getSmoothScroll = () => lenis;

/** Pause (true) or resume (false) page scrolling for `reason`. */
export function setScrollLock(reason: string, locked: boolean) {
  if (locked) locks.add(reason);
  else locks.delete(reason);
  applyLocks();
}
