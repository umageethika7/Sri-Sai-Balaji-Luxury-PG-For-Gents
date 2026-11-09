'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { BuildingOffice2Icon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import SectionLink from '@/components/SectionLink';
import { PHONE_TEL, PHONE_DISPLAY } from '@/data/pgInfo';
import type { SectionPath } from '@/lib/sectionRoutes';
import { setScrollLock } from '@/lib/smoothScroll';
import { getSectionPath, subscribeSectionPath } from '@/router/sectionRouter';
import styles from './Navbar.module.css';

// The phone menu panel's width as a share of the screen (matches .mobileMenu in Navbar.module.css).
const MENU_PANEL_WIDTH = 0.75;
// Space kept between the stretched PG name and the ✕ button while the menu is open.
const BRAND_GAP_PX = 12;

const NAV_LINKS: { to: SectionPath; label: string }[] = [
  { to: '/rooms', label: 'Rooms' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/location', label: 'Location' },
  { to: '/nearby', label: 'Nearby' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact-us', label: 'Contact Us' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // The link for the URL in the address bar (kept in sync with the section on screen by TanStack Router).
  const activePath = useSyncExternalStore(subscribeSectionPath, getSectionPath, () => null);

  useEffect(() => {
    const onScroll = () => {
      // Stay transparent while the hero video is behind the navbar; go solid once the white sections reach it.
      const hero = document.getElementById('top');
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 24;
      setScrolled(window.scrollY > heroBottom - 80);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu with Escape, or when the screen grows to the desktop layout.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false);
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onResize = () => desktop.matches && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onResize);
    };
  }, [menuOpen]);

  // While the mobile menu is open, the page behind it holds still (the menu itself can still scroll).
  useEffect(() => {
    setScrollLock('mobile-menu', menuOpen);
    return () => setScrollLock('mobile-menu', false);
  }, [menuOpen]);

  // Closing from a link releases the scroll lock right away (before the link's glide starts); otherwise the
  // lock would be lifted a moment later, which restarts smooth scrolling and cancels that glide.
  const closeMenu = () => {
    setScrollLock('mobile-menu', false);
    setMenuOpen(false);
  };

  // While the phone / tablet menu is open, the tagline ("LUXURY PG FOR GENTS") stretches with letter spacing
  // to fill the 75%-wide drawer, ending just before its ✕ button; when it closes it eases back to its normal
  // spacing. "Sri Sai Balaji" always keeps its normal spacing. CSS can't fit letter spacing to a width, so the
  // tagline is measured and spaced here (re-fitted on resize and once the font has loaded). On desktop
  // nothing changes.
  const headerRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLSpanElement>(null);
  const fitBrandRef = useRef<(animate: boolean) => void>(() => {});

  useEffect(() => {
    const phoneLayout = window.matchMedia('(max-width: 1023.98px)');
    const lines = [taglineRef.current].filter((line): line is HTMLSpanElement => !!line);
    const isOpen = () => headerRef.current?.dataset.menuOpen === 'true';

    // Applies letter spacing to each line, eased by the CSS transition or set instantly.
    const apply = (spacings: (number | null)[], animate: boolean) => {
      lines.forEach((line, index) => {
        const spacing = spacings[index];
        if (!animate) line.style.transition = 'none';
        line.style.letterSpacing = spacing === null ? '' : `${spacing}px`;
        // Cancel the spacing CSS adds after the last letter, so the line ends exactly at its target.
        line.style.marginRight = spacing === null ? '' : `${-spacing}px`;
      });
      if (!animate) {
        void headerRef.current?.offsetWidth;
        for (const line of lines) line.style.transition = '';
      }
    };

    // `settled`: the navbar has finished narrowing, so the ✕ button's real position can be used. Before
    // that (the moment the menu opens) its final position is predicted from the screen width.
    const fit = (animate: boolean, settled = false) => {
      const header = headerRef.current;
      if (!header || !phoneLayout.matches || !isOpen()) {
        apply(lines.map(() => null), animate); // normal spacing
        return;
      }
      const closeButton = header.querySelector('button[aria-controls="mobile-menu"]');
      let nameEnd: number;
      if (settled && closeButton) {
        nameEnd = closeButton.getBoundingClientRect().left - BRAND_GAP_PX;
      } else {
        // The drawer is 75% of the screen wide; the ✕ sits inside its right padding.
        const nav = header.querySelector('nav');
        const navPaddingRight = nav ? parseFloat(getComputedStyle(nav).paddingRight) || 0 : 0;
        const closeButtonWidth = closeButton?.getBoundingClientRect().width ?? 40;
        nameEnd = document.documentElement.clientWidth * MENU_PANEL_WIDTH - navPaddingRight - closeButtonWidth - BRAND_GAP_PX;
      }
      apply(
        lines.map((line) => {
          const text = line.textContent?.trim() ?? '';
          if (text.length < 2) return null;
          const rect = line.getBoundingClientRect();
          const current = parseFloat(getComputedStyle(line).letterSpacing) || 0;
          // Width of the letters alone: the box includes the current spacing after every letter.
          const glyphs = rect.width - text.length * current;
          return Math.max(0, (nameEnd - rect.left - glyphs) / (text.length - 1));
        }),
        animate,
      );
    };
    fitBrandRef.current = fit;

    // Once the navbar has finished narrowing, make the final small correction against the real ✕ position.
    const header = headerRef.current;
    const onHeaderTransitionEnd = (event: TransitionEvent) => {
      if (event.target === header && event.propertyName === 'right' && isOpen()) fit(true, true);
    };
    header?.addEventListener('transitionend', onHeaderTransitionEnd);

    const refit = () => fit(false, true);
    fit(false);
    document.fonts?.ready.then(refit);
    window.addEventListener('resize', refit);
    phoneLayout.addEventListener('change', refit);
    return () => {
      header?.removeEventListener('transitionend', onHeaderTransitionEnd);
      window.removeEventListener('resize', refit);
      phoneLayout.removeEventListener('change', refit);
    };
  }, []);

  // Stretch when the menu opens, relax when it closes.
  useEffect(() => {
    fitBrandRef.current(true);
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <>
    {/* Blurs and dims the page behind the open mobile menu; tapping it closes the menu. It sits outside the
        header because the header's own backdrop blur would otherwise trap this fixed layer inside it. */}
    <div
      className={`${styles.backdrop} ${menuOpen ? styles.backdropOpen : ''}`}
      onClick={closeMenu}
      aria-hidden="true"
    />
    <header
      ref={headerRef}
      data-menu-open={menuOpen ? 'true' : 'false'}
      className={`${styles.header} ${solid ? styles.solid : ''}`}
    >
      <nav className={`container ${styles.nav}`}>
        <SectionLink to="/" onClick={closeMenu} className={styles.brand}>
          <span className={styles.logo}>
            <BuildingOffice2Icon className={styles.logoIcon} aria-hidden="true" />
          </span>
          <span className={styles.brandName}>
            <span className={styles.brandTitle}>
              Sri Sai Balaji
            </span>
            <span ref={taglineRef} className={styles.tagline}>
              Luxury PG for Gents
            </span>
          </span>
        </SectionLink>

        <ul className={styles.links}>
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <SectionLink
                to={link.to}
                className={`${styles.link} ${activePath === link.to ? styles.active : ''}`}
                aria-current={activePath === link.to ? 'location' : undefined}
              >
                {link.label}
                <span className={styles.underline} />
              </SectionLink>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <SectionLink to="/contact-us" className={styles.book}>
            Book a Visit
          </SectionLink>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className={styles.menuButton}
        >
          {menuOpen ? (
            <XMarkIcon className={styles.menuIcon} aria-hidden="true" />
          ) : (
            <Bars3Icon className={styles.menuIcon} aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Phone / tablet menu (below 1024px), opened by the ☰ button. */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}
        inert={!menuOpen}
        data-lenis-prevent
      >
        <div className={`container ${styles.mobileMenuInner}`}>
          {NAV_LINKS.map((link) => (
            <SectionLink
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className={`${styles.mobileLink} ${activePath === link.to ? styles.mobileLinkActive : ''}`}
              aria-current={activePath === link.to ? 'location' : undefined}
            >
              {link.label}
            </SectionLink>
          ))}
          <a href={PHONE_TEL} onClick={closeMenu} className={styles.mobileCall}>
            Call {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </header>
    </>
  );
}
