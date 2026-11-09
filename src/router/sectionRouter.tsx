'use client';

/**
 * TanStack Router keeps the address bar in sync with the section on screen:
 *   hero → /, rooms → /rooms, facilities → /facilities, location → /location,
 *   nearby → /nearby, FAQ → /faq, contact form → /contact-us
 *
 * - Scrolling replaces the URL (no extra history entries).
 * - Clicking a section link (goToSection) pushes a history entry and smooth-scrolls there.
 * - Back / Forward scroll to the section in that history entry.
 * - Opening a section URL directly scrolls to it on load.
 *
 * Next.js still serves the page itself: src/app/[[...section]]/page.tsx renders the same page for every path.
 */
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  useLocation,
  useRouter,
} from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { SECTION_ROUTES, sectionIdForPath, type SectionPath } from '@/lib/sectionRoutes';
import { getSmoothScroll } from '@/lib/smoothScroll';

/* ---------- Route tree: a root plus one route per section ---------- */

const rootRoute = createRootRoute({ component: SectionSync });

const sectionRoutes = SECTION_ROUTES.map((section) =>
  createRoute({ getParentRoute: () => rootRoute, path: section.path }),
);

const routeTree = rootRoute.addChildren(sectionRoutes);

type HistoryWrite = typeof window.history.pushState;

function buildRouter() {
  // Next.js's own history functions (already patched by Next at this point).
  const nextPush = window.history.pushState;
  const nextReplace = window.history.replaceState;

  const appRouter = createRouter({
    routeTree,
    // The page scroll is handled below; stop the router from resetting it to the top on every URL change.
    scrollRestoration: () => false,
  });

  // TanStack's history now wraps pushState/replaceState to notice URL changes made by other code.
  // Next.js also writes its own bookkeeping state (marked `__NA`) to the current entry during React's
  // insertion phase; that never changes the URL, so hand it straight to Next instead of letting TanStack
  // react to it (which would schedule a React update in that phase).
  const tanstackPush = window.history.pushState;
  const tanstackReplace = window.history.replaceState;
  const route = (next: HistoryWrite, tanstack: HistoryWrite): HistoryWrite =>
    function (data, unused, url) {
      const isNextBookkeeping = (data as { __NA?: boolean } | null)?.__NA === true;
      return (isNextBookkeeping ? next : tanstack).call(window.history, data, unused, url);
    };
  window.history.pushState = route(nextPush, tanstackPush);
  window.history.replaceState = route(nextReplace, tanstackReplace);

  return appRouter;
}

export type SectionRouter = ReturnType<typeof buildRouter>;

declare module '@tanstack/react-router' {
  interface Register {
    router: SectionRouter;
  }
}

let router: SectionRouter | null = null;

/* ---------- Current path store (lets the Navbar highlight the active link) ---------- */

let currentPath: string | null = null;
const listeners = new Set<() => void>();

function setCurrentPath(path: string) {
  if (path === currentPath) return;
  currentPath = path;
  listeners.forEach((listener) => listener());
}

export function subscribeSectionPath(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getSectionPath = () => currentPath;

/* ---------- Scrolling ---------- */

// While a click / Back-Forward smooth scroll is running, the scroll spy must not rewrite the URL
// with the sections it passes on the way.
let spyLockedUntil = 0;

// Section-to-section glide: quick to start, long soft landing.
const NAV_SCROLL_SECONDS = 1.3;
const easeOutQuart = (t: number) => 1 - (1 - t) ** 4;

function scrollToPath(path: string, behavior: ScrollBehavior) {
  const id = sectionIdForPath(path);
  const element = id && document.getElementById(id);
  if (!element) return;
  const smooth = behavior === 'smooth';
  const lenis = getSmoothScroll();

  if (lenis) {
    // Locked until the glide lands (with a safety timeout in case it is interrupted).
    spyLockedUntil = performance.now() + (smooth ? NAV_SCROLL_SECONDS * 1000 + 800 : 100);
    // Lenis also honours scroll-padding-top (globals.css), keeping the section clear of the fixed navbar.
    lenis.scrollTo(id === 'top' ? 0 : element, {
      immediate: !smooth,
      duration: NAV_SCROLL_SECONDS,
      easing: easeOutQuart,
      // `force`: also works while scrolling is paused (e.g. while the phone menu is open).
      force: true,
      onComplete: () => {
        spyLockedUntil = 0;
      },
    });
    return;
  }

  spyLockedUntil = performance.now() + (smooth ? 1500 : 100);
  if (id === 'top') window.scrollTo({ top: 0, behavior });
  // scroll-padding-top in globals.css keeps the section clear of the fixed navbar.
  else element.scrollIntoView({ behavior, block: 'start' });
}

/** Used by section links: smooth-scroll to the section and add a history entry for it. */
export function goToSection(path: SectionPath) {
  scrollToPath(path, 'smooth');
  if (router && router.state.location.pathname !== path) {
    router.navigate({ to: path, resetScroll: false });
  }
}

/** The section crossing a line ~38% down the screen (the same band the old scrollspy used). */
function sectionOnScreen(): SectionPath {
  const line = window.innerHeight * 0.38;
  let current: SectionPath = '/';
  for (const section of SECTION_ROUTES) {
    const element = document.getElementById(section.id);
    if (element && element.getBoundingClientRect().top <= line) current = section.path;
  }
  return current;
}

/* ---------- Root route component: wires scrolling and the URL together (renders nothing) ---------- */

function SectionSync() {
  const appRouter = useRouter();
  const pathname = useLocation({ select: (location) => location.pathname });

  useEffect(() => setCurrentPath(pathname), [pathname]);

  useEffect(() => {
    // A refresh always starts again from the hero at "/". A section link opened directly (e.g. a shared
    // /faq link) still jumps straight to that section.
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const isRefresh = navigation?.type === 'reload';
    if (isRefresh && appRouter.state.location.pathname !== '/') {
      appRouter.navigate({ to: '/', replace: true, resetScroll: false });
    }
    scrollToPath(isRefresh ? '/' : appRouter.state.location.pathname, 'instant');

    // Back / Forward: scroll to the section of the entry we landed on.
    const unsubscribe = appRouter.history.subscribe(({ location, action }) => {
      if (action.type === 'BACK' || action.type === 'FORWARD' || action.type === 'GO') {
        scrollToPath(location.pathname, 'smooth');
      }
    });

    // Scroll spy: keep the URL on the section being read, without adding history entries.
    let frame = 0;
    const sync = () => {
      frame = 0;
      if (performance.now() < spyLockedUntil) return;
      const path = sectionOnScreen();
      if (path !== appRouter.state.location.pathname) {
        appRouter.navigate({ to: path, replace: true, resetScroll: false });
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };
    // When a native smooth scroll finishes, release the lock and settle on where we stopped.
    // (With Lenis the glide's onComplete releases it; Lenis fires scrollend between its own frames.)
    const onScrollEnd = () => {
      if (getSmoothScroll()) return;
      spyLockedUntil = 0;
      onScroll();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scrollend', onScrollEnd);
    return () => {
      unsubscribe();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scrollend', onScrollEnd);
    };
  }, [appRouter]);

  return null;
}

/**
 * Mounts the router after the first render. Starting it a tick later lets Next.js install its own
 * history handling first, so the two routers share history entries instead of overwriting each other.
 */
export default function SectionRouterProvider() {
  const [ready, setReady] = useState<SectionRouter | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router ??= buildRouter();
      setReady(router);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return ready ? <RouterProvider router={ready} /> : null;
}
