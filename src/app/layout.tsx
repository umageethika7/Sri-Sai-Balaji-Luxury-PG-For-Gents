import type { Metadata, Viewport } from 'next';
import { Noto_Color_Emoji, Roboto } from 'next/font/google';
import Script from 'next/script';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, GTM_ID, OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

// Variable font: covers every weight the site uses (400-700) from a single file.
const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

// Emoji fallback only; browsers download it just for pages that actually contain emoji.
const notoEmoji = Noto_Color_Emoji({
  subsets: ['emoji'],
  weight: '400',
  variable: '--font-emoji',
  display: 'swap',
});

// Runs before the first paint: turns on scroll reveals (content waits hidden until it scrolls into view)
// unless the visitor prefers reduced motion. If the page's JavaScript never starts, everything is shown
// after a few seconds instead of staying hidden.
const REVEAL_BOOT_SCRIPT = `(function () {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var root = document.documentElement;
    root.classList.add('reveal-on');
    setTimeout(function () { if (!window.__revealReady) root.classList.remove('reveal-on'); }, 8000);
  } catch (e) {}
})();`;

// Google Tag Manager loads only with a valid container ID (GTM-XXXXXXX); see src/lib/site.ts.
const gtmId = /^GTM-[A-Z0-9]+$/.test(GTM_ID) ? GTM_ID : '';

export const metadata: Metadata = {
  // Makes canonical, Open Graph and sitemap URLs absolute (https://your-domain/...).
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    // Section pages (Rooms, FAQ, ...) set their own title; this adds the brand after it.
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  // index, follow: search engines may list the site and follow its links.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  // Social-share previews (WhatsApp, Facebook, LinkedIn, X), with the card image public/og-image.jpg.
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: '/',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d1838',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the inline script below adds the `reveal-on` class before React loads.
    <html lang="en" className={`${roboto.variable} ${notoEmoji.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: REVEAL_BOOT_SCRIPT }} />
      </head>
      <body>
        {gtmId && (
          <>
            {/* Google Tag Manager (noscript fallback) */}
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
                title="Google Tag Manager"
              />
            </noscript>
            {/* Google Tag Manager: loads right after the page becomes interactive, so it never delays it. */}
            <Script id="gtm" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
