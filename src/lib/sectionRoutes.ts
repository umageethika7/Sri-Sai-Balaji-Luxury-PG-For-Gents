/**
 * One URL per section of the single-page site. The page is still one long scroll; these paths are
 * kept in the address bar as you scroll (via TanStack Router, see src/router/sectionRouter.tsx), and
 * opening one directly (e.g. /faq) scrolls straight to that section.
 */
export const SECTION_ROUTES = [
  { id: 'top', path: '/' },
  { id: 'rooms', path: '/rooms' },
  { id: 'facilities', path: '/facilities' },
  { id: 'location', path: '/location' },
  { id: 'nearby', path: '/nearby' },
  { id: 'faq', path: '/faq' },
  { id: 'visit', path: '/contact-us' },
] as const;

export type SectionRoute = (typeof SECTION_ROUTES)[number];
export type SectionPath = SectionRoute['path'];
export type SectionId = SectionRoute['id'];

export function sectionIdForPath(path: string): SectionId | null {
  const clean = path.length > 1 ? path.replace(/\/+$/, '') : path;
  return SECTION_ROUTES.find((route) => route.path === clean)?.id ?? null;
}

/** Path segments for Next.js `generateStaticParams` (the home page is the empty list). */
export const SECTION_SEGMENTS = SECTION_ROUTES.map((route) => route.path.split('/').filter(Boolean));
