'use client';

import { useEffect } from 'react';

// Single elements and groups (whose children reveal together) are both watched.
const WATCHED = '[data-reveal], [data-reveal-group]';

/**
 * One shared pair of observers for every `[data-reveal]` / `[data-reveal-group]` element.
 * - An element animates in each time it scrolls into view, scrolling down or up.
 * - Once it has left the screen completely it quietly resets, ready to animate again next time.
 * - Coming in from the top (scrolling up) it moves down into place instead of up.
 * Renders nothing; the hidden/revealed styles live in globals.css.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    // Not enabled (reduced motion): everything is already visible.
    if (!root.classList.contains('reveal-on')) return;
    (window as Window & { __revealReady?: boolean }).__revealReady = true;

    const show = (element: Element, rect: DOMRectReadOnly) => {
      // Entering through the top half of the screen means it is coming in from above (scrolling up).
      element.setAttribute('data-reveal-from', rect.top < window.innerHeight / 2 ? 'top' : 'bottom');
      element.setAttribute('data-revealed', '');
    };

    // Plays the reveal a little before the element is fully on screen, so it feels tied to the scroll.
    const enter = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !entry.target.hasAttribute('data-revealed')) {
            show(entry.target, entry.boundingClientRect);
          }
        }
      },
      { rootMargin: '-6% 0px -6% 0px', threshold: 0.1 },
    );

    // Resets only once the element is completely off screen, so nothing ever flickers out of view.
    const exit = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) entry.target.removeAttribute('data-revealed');
        }
      },
      { threshold: 0 },
    );

    const watch = (element: Element) => {
      enter.observe(element);
      exit.observe(element);
    };
    const watchAll = (scope: ParentNode) => scope.querySelectorAll(WATCHED).forEach(watch);

    // Elements rendered later (pop-ups, lazily mounted content) are picked up too.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(WATCHED)) watch(node);
          watchAll(node);
        });
      }
    });

    // The enter margin keeps the very last lines of the footer from ever qualifying. At the bottom of
    // the page, reveal whatever is still waiting on screen.
    const revealAtBottom = () => {
      if (window.innerHeight + window.scrollY < root.scrollHeight - 4) return;
      document.querySelectorAll(WATCHED).forEach((element) => {
        if (element.hasAttribute('data-revealed')) return;
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) show(element, rect);
      });
    };

    watchAll(document);
    mutations.observe(document.body, { childList: true, subtree: true });
    revealAtBottom();
    window.addEventListener('scroll', revealAtBottom, { passive: true });

    return () => {
      window.removeEventListener('scroll', revealAtBottom);
      enter.disconnect();
      exit.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
