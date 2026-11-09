import type { StaticImageData } from 'next/image';
// Nearby photos are imported (not referenced by path) so each gets a content-hashed URL: replacing a
// photo, even under the same file name, always shows the new one instead of a cached copy.
import bellandurOrrPhoto from '../../public/images/nearby/bellandur-orr-above.png';
import btmLayoutMetroPhoto from '../../public/images/nearby/btm-layout-metro.png';
import centralSilkBoardPhoto from '../../public/images/nearby/central-silk-board.png';
import christUniversityPhoto from '../../public/images/nearby/christ-university-aerial.png';
import electronicCityPhoto from '../../public/images/nearby/electronic-city.png';
import jayadevaPhoto from '../../public/images/nearby/jayadeva-interchange-above.png';
import koramangalaPhoto from '../../public/images/nearby/koramangala-forum-mall-above.png';

export const PG_NAME = 'Sri Sai Balaji Luxury PG for Gents';

export const PHONE_DISPLAY = '+91 88833 99299';
export const PHONE_TEL = 'tel:+918883399299';
export const WHATSAPP_NUMBER = '918883399299';

export const ADDRESS_LINES = [
  '44-27, 16th Main Rd, Gollahalli, EWS Colony',
  'BTM Layout 2nd Stage, BTM Layout',
  'Bengaluru, Karnataka 560068',
];

export const ADDRESS_FULL = ADDRESS_LINES.join(', ');

export function buildMapSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// Exact pin from the PG's Google Maps listing ("SRI SAI BALAJI LUXURY GENTS PG", 44-27, 16th Main Rd).
// Searching by name alone returns several similarly named PGs nearby, so maps and directions use these.
export const PG_COORDS = { lat: 12.9076056, lng: 77.6109127 };

// Nearest well-known landmark, a short walk from the PG (visible next to the pin on the map).
export const PG_LANDMARK = "Ground floor · Right side gate";

export const MAP_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${PG_COORDS.lat},${PG_COORDS.lng}`;

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* ---------- WhatsApp enquiry messages ---------- */

/** General enquiry: floating button, footer, and the Call / WhatsApp button pairs. */
export const GENERAL_WHATSAPP_MESSAGE =
  'Hi! I want to inquire about room availability at Sri Sai Balaji PG. Could you share the sharing options, rent, deposit details and a suitable time to visit?';

/** Room card enquiry, e.g. "...a 2-sharing room...". */
export function roomEnquiryMessage(sharing: number): string {
  return `Hi! I want to inquire about a ${sharing}-sharing room at Sri Sai Balaji PG. Could you share the availability, rent, deposit details and a suitable time to visit?`;
}

/**
 * "Plan your visit" form enquiry. `sharing` is the chosen room's sharing number, 'unsure' for
 * "Not sure yet", or null if no room was picked; `timing` is the chosen move-in option (may be empty).
 */
export function visitEnquiryMessage(sharing: number | 'unsure' | null, timing: string): string {
  const preference =
    sharing === 'unsure'
      ? 'I want to inquire about rooms at Sri Sai Balaji PG and would like help choosing a sharing option.'
      : sharing
        ? `I want to inquire about a ${sharing}-sharing room at Sri Sai Balaji PG.`
        : 'I want to inquire about rooms at Sri Sai Balaji PG.';
  const moveIn = timing ? ` My move-in plan: ${timing.toLowerCase()}.` : '';
  return `Hi! ${preference}${moveIn} Could you share the availability, rent, deposit details and a suitable time to visit?`;
}

export interface RoomType {
  id: string;
  /** Number of residents per room; used in the WhatsApp enquiry messages. */
  sharing: 1 | 2 | 3 | 4;
  title: string;
  occupancy: string;
  description: string;
  image: string;
  imageAlt: string;
  whatsappMessage: string;
}

export const ROOM_TYPES: RoomType[] = [
  {
    id: 'single',
    sharing: 1,
    title: 'Single Sharing',
    occupancy: '1 Guest',
    description:
      'Enjoy a comfortable and spacious single-sharing room with a well-maintained bed, personal storage space, excellent ventilation, and a peaceful environment.',
    image: '/images/1-share.png',
    imageAlt: 'Single sharing room with one cot, study table, wardrobe and window',
    whatsappMessage: roomEnquiryMessage(1),
  },
  {
    id: 'double',
    sharing: 2,
    title: 'Two Sharing',
    occupancy: '2 Guests',
    description:
      'A bright, airy room shared by two, with a comfortable bed and personal cupboard for each resident, a study table, and plenty of natural light.',
    image: '/images/2-share.png',
    imageAlt: 'Two sharing room with two cots, study table and wardrobes',
    whatsappMessage: roomEnquiryMessage(2),
  },
  {
    id: 'triple',
    sharing: 3,
    title: 'Three Sharing',
    occupancy: '3 Guests',
    description:
      'A spacious, well-ventilated room for three, with neatly furnished beds, individual storage, and a relaxed layout that leaves everyone room to breathe.',
    image: '/images/3-share.png',
    imageAlt: 'Three sharing room with three blue cots and wooden wardrobes',
    whatsappMessage: roomEnquiryMessage(3),
  },
  {
    id: 'quad',
    sharing: 4,
    title: 'Four Sharing',
    occupancy: '4 Guests',
    description:
      'A generous, cheerful room for four with comfortable beds, personal cupboards, and a bright interior, ideal for residents looking for great value.',
    image: '/images/4-share.png',
    imageAlt: 'Four sharing room with four cots, ceiling fan and attached bathroom door',
    whatsappMessage: roomEnquiryMessage(4),
  },
];

export interface Facility {
  title: string;
  description: string;
  icon:
    | 'bed'
    | 'shower'
    | 'utensils'
    | 'drumstick'
    | 'wifi'
    | 'hot-water'
    | 'water-drop'
    | 'sparkles'
    | 'washing-machine'
    | 'lift'
    | 'car'
    | 'cooking-pot'
    | 'zap'
    | 'fingerprint'
    | 'camera'
    | 'shield'
    | 'sun'
    | 'wind';
}

export const FACILITIES: Facility[] = [
  {
    title: 'Fully Furnished Rooms',
    description: 'Feel at home from day one with comfortable, fully equipped living spaces.',
    icon: 'bed',
  },
  {
    title: 'Attached Bathrooms',
    description: 'Enjoy everyday comfort and privacy with clean, modern attached bathrooms.',
    icon: 'shower',
  },
  {
    title: 'Home-Style Veg Meals',
    description: 'Freshly prepared, homely meals that make every day feel special.',
    icon: 'utensils',
  },
  {
    title: 'Non-Veg Thrice a Week',
    description: 'Enjoy delicious non-vegetarian meals three times a week.',
    icon: 'drumstick',
  },
  {
    title: 'High-Speed Wi-Fi',
    description: 'Stay connected, productive and entertained with reliable high-speed internet.',
    icon: 'wifi',
  },
  {
    title: '24/7 Hot Water',
    description: 'Enjoy a refreshing, comfortable bathing experience at any time of the day.',
    icon: 'hot-water',
  },
  {
    title: 'RO Drinking Water',
    description: 'Pure, safe RO drinking water throughout the building, so every sip is worry-free.',
    icon: 'water-drop',
  },
  {
    title: 'Daily Housekeeping',
    description: 'Come back to a fresh, tidy room every day while we take care of the cleaning.',
    icon: 'sparkles',
  },
  {
    title: 'Laundry Service',
    description: 'Spend your free time on what you love, not on piles of laundry.',
    icon: 'washing-machine',
  },
  {
    title: 'Lift Access',
    description: 'Skip the stairs and ride up to your floor in comfort, every time.',
    icon: 'lift',
  },
  {
    title: 'Parking',
    description: 'A dedicated spot for your two-wheeler, right where you need it.',
    icon: 'car',
  },
  {
    title: 'Self-Cooking Option',
    description: 'Craving your own recipes? Cook them your way whenever you like.',
    icon: 'cooking-pot',
  },
  {
    title: 'Power Backup',
    description: 'Work, study and stream without a break, even when the power goes out.',
    icon: 'zap',
  },
  {
    title: 'Biometric Entry',
    description: 'Secure fingerprint access that keeps the PG for residents only.',
    icon: 'fingerprint',
  },
  {
    title: 'CCTV Surveillance',
    description: 'Round-the-clock camera monitoring for extra peace of mind.',
    icon: 'camera',
  },
  {
    title: 'Security Guard',
    description: 'A trained guard on duty, so you can rest easy every night.',
    icon: 'shield',
  },
  {
    title: 'Relaxing Terrace',
    description: 'An open-air terrace to unwind and catch the evening breeze after a long day.',
    icon: 'sun',
  },
  {
    title: 'Well-Ventilated Rooms',
    description: 'Bright, airy rooms filled with natural light and fresh air.',
    icon: 'wind',
  },
];

export interface NearbyPlace {
  name: string;
  /** Short line under the name, e.g. "~1 km · Yellow Line Metro". */
  badge: string;
  /** Why the place matters to residents. */
  description: string;
  /** Approximate distance / travel time from the PG. */
  distance: string;
  /** Who it's most useful for. Not shown on the card at the moment ("Open in Maps" took its place). */
  idealFor: string;
  /** Google Maps search text used by the "Open in Maps" link. */
  mapQuery: string;
  /** Photo of the place (imported from /public/images/nearby). */
  image: StaticImageData;
  imageAlt: string;
}

export const NEARBY_PLACES: NearbyPlace[] = [
  {
    name: 'BTM Layout Metro (Yellow Line)',
    badge: '~1 km · Yellow Line Metro',
    description: 'A direct line to Electronic City, plus the Green Line change at RV Road.',
    distance: '~1 km, 5 min by auto',
    idealFor: 'Everyone',
    mapQuery: 'BTM Layout Metro Station, Bengaluru',
    image: btmLayoutMetroPhoto,
    imageAlt: 'The elevated BTM Layout metro station and viaduct above the road',
  },
  {
    name: 'Central Silk Board',
    badge: '8–10 mins · Metro interchange',
    description: 'The gateway to the Outer Ring Road, Hosur Road and Electronic City, with a Blue Line airport link planned.',
    distance: '~2 km, 8–10 min',
    idealFor: 'Professionals',
    mapQuery: 'Central Silk Board Metro Station, Bengaluru',
    image: centralSilkBoardPhoto,
    imageAlt: 'Central Silk Board metro station building with its signboard',
  },
  {
    name: 'Electronic City',
    badge: '20–25 mins by Metro',
    description: 'Home to Infosys, Wipro, HCL, TCS and many more tech campuses.',
    distance: '~12 km, 20–25 min by Metro',
    idealFor: 'IT staff, freshers',
    mapQuery: 'Electronic City, Bengaluru',
    image: electronicCityPhoto,
    imageAlt: 'A glass-fronted tech campus building in Electronic City',
  },
  {
    name: 'Bellandur and ORR Corridor',
    badge: '25–40 mins · Via Silk Board',
    description: 'Embassy Tech Village, RMZ Ecospace and Ecoworld, and Prestige Tech Park.',
    distance: '~9–10 km, 25–40 min',
    idealFor: 'Tech professionals',
    mapQuery: 'Bellandur, Outer Ring Road, Bengaluru',
    image: bellandurOrrPhoto,
    imageAlt: 'High view over the Outer Ring Road corridor with Bellandur Lake in the distance',
  },
  {
    name: 'HSR Layout and Koramangala',
    badge: '10–20 mins · Metro at HSR',
    description: 'Startups, co-working spaces, Forum Mall and plenty of cafés.',
    distance: '~3–5 km, 10–20 min',
    idealFor: 'Startup staff, young professionals',
    mapQuery: 'HSR Layout, Bengaluru',
    image: koramangalaPhoto,
    imageAlt: 'View from above of the road and lit-up entrance of Forum Mall, Koramangala, in the evening',
  },
  {
    name: 'Christ University and St. John’s',
    badge: '15–20 mins',
    description: 'Two well-known South Bengaluru campuses.',
    distance: '~4–5 km, 15–20 min',
    idealFor: 'Students, interns',
    mapQuery: 'Christ University, Hosur Road, Bengaluru',
    image: christUniversityPhoto,
    imageAlt: 'Aerial view of the Christ University academic block and gardens',
  },
  {
    name: 'Jayadeva Hospital',
    badge: '1 stop · Pink Line opening soon',
    description: 'One Yellow Line stop away, with the Pink Line to Bannerghatta Road (IIM Bangalore, JP Nagar 4th Phase).',
    distance: '~3 km, 1 stop',
    idealFor: 'MBA students, hospital staff',
    mapQuery: 'Jayadeva Hospital Metro Station, Bengaluru',
    image: jayadevaPhoto,
    imageAlt: 'View from the Jayadeva metro station over the road and metro viaduct pillars',
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: "Who is this PG meant for?",
    answer:
      "Sri Sai Balaji Luxury PG is exclusively for gents. It is ideal for working professionals and students looking for a secure, well-managed stay in BTM Layout.",
  },
  {
    question: "What room types are available?",
    answer:
      "We offer single, double, triple and four-sharing rooms. Every room is fully furnished with a cot, mattress, cupboard, study table and attached bathroom.",
  },
  {
    question: "Are meals included?",
    answer:
      "Yes. Non-vegetarian meals are served three times a week, along with daily home-style vegetarian meals in our dining hall. A self-cooking option is also available for those who prefer to cook their own meals.",
  },
  {
    question: "Is Wi-Fi and hot water available?",
    answer:
      "High-speed Wi-Fi is available throughout the PG, and hot water is available 24 hours a day, 7 days a week. RO drinking water is also provided.",
  },
  {
    question: "How secure is the PG?",
    answer:
      "Entry is controlled by biometric access, the premises are monitored by CCTV.",
  },
  {
    question: "Is there parking and a lift?",
    answer:
      "Yes, parking is available on the premises and the building has a lift for easy access to every floor.",
  },
  {
    question: "Is power backup available?",
    answer:
      "Yes, we provide power backup so your studies, work and daily routine are not interrupted.",
  },
  {
    question: "How can I check availability or book a room?",
    answer:
      "Call us on +91 88833 99299 or send us a WhatsApp message using the buttons on this page. We will share current availability, rent and the next steps.",
  },
];
