import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Rooms from '@/components/Rooms';
import Facilities from '@/components/Facilities';
import Location from '@/components/Location';
import NearbyPlaces from '@/components/NearbyPlaces';
import Faq from '@/components/Faq';
import PlanVisit from '@/components/PlanVisit';
import Footer from '@/components/Footer';
import FloatingContact from '@/components/FloatingContact';
import ScrollReveal from '@/components/ScrollReveal';
import SmoothScroll from '@/components/SmoothScroll';
import { SECTION_SEGMENTS } from '@/lib/sectionRoutes';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, OG_IMAGE, SITE_NAME } from '@/lib/site';
import SectionRouterProvider from '@/router/sectionRouter';

// The same one-page site is served at /, /rooms, /facilities, /location, /nearby, /faq and /contact-us;
// TanStack Router (SectionRouterProvider) scrolls to the matching section and keeps the URL in sync.
// Any other path is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return SECTION_SEGMENTS.map((section) => ({ section }));
}

// Each section URL gets its own title and description (browser tab, shared-link previews), but they all
// show the same page, so every one names "/" as the canonical URL: search engines then treat them as a
// single page instead of seven duplicates, and only "/" is listed in sitemap.xml.
const SECTION_META: Record<string, { title: string; description: string }> = {
  rooms: {
    title: 'Rooms: Single, Two, Three & Four Sharing',
    description:
      'Fully furnished single, two, three and four sharing rooms for gents in BTM Layout 2nd Stage, Bengaluru, each with an attached bathroom, cot, cupboard and study table.',
  },
  facilities: {
    title: 'Facilities: Meals, Wi-Fi, Hot Water & Security',
    description:
      'Home-style veg meals with non-veg thrice a week, high-speed Wi-Fi, 24/7 hot water, RO water, housekeeping, laundry, lift, parking, power backup, biometric entry and CCTV.',
  },
  location: {
    title: 'Location: 16th Main, BTM Layout 2nd Stage',
    description:
      'Find Sri Sai Balaji Luxury PG for Gents at 44-27, 16th Main Rd, Gollahalli, EWS Colony, BTM Layout 2nd Stage, Bengaluru 560068. Get directions on Google Maps.',
  },
  nearby: {
    title: 'Nearby: BTM Metro, Silk Board, Electronic City & More',
    description:
      'Close to BTM Layout Metro, Central Silk Board, Electronic City, the Bellandur ORR tech corridor, HSR Layout, Koramangala, Christ University and Jayadeva.',
  },
  faq: {
    title: 'FAQs: Rooms, Meals, Wi-Fi, Security & Booking',
    description:
      'Answers to common questions about Sri Sai Balaji Luxury PG for Gents: who it is for, room types, meals, Wi-Fi, hot water, security, parking, power backup and booking.',
  },
  'contact-us': {
    title: 'Contact Us: Plan Your Visit',
    description:
      'Call +91 88833 99299 or message us on WhatsApp to check availability, rent and deposit, and plan a visit to Sri Sai Balaji Luxury PG for Gents in BTM Layout.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ section?: string[] }> }): Promise<Metadata> {
  const { section } = await params;
  const meta = section?.[0] ? SECTION_META[section[0]] : undefined;
  const path = section?.length ? `/${section.join('/')}` : '/';

  const title = meta ? `${meta.title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const description = meta?.description ?? DEFAULT_DESCRIPTION;

  // Next.js replaces (doesn't merge) nested openGraph / twitter objects, so they are given in full here.
  return {
    ...(meta && { title: meta.title, description: meta.description }),
    alternates: { canonical: '/' },
    openGraph: { type: 'website', locale: 'en_IN', siteName: SITE_NAME, title, description, url: path, images: [OG_IMAGE] },
    twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE.url] },
  };
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Rooms />
        <Facilities />
        <Location />
        <NearbyPlaces />
        <Faq />
        <PlanVisit />
      </main>
      <Footer />
      <FloatingContact />
      <SmoothScroll />
      <ScrollReveal />
      <SectionRouterProvider />
    </>
  );
}
