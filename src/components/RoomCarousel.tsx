'use client';

import { ArrowsPointingOutIcon, ChevronLeftIcon, ChevronRightIcon, PhoneIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type TouchEvent,
} from 'react';
import ImageLightbox from '@/components/ImageLightbox';
import WhatsappIcon from '@/components/icons/WhatsappIcon';
import { PHONE_TEL, buildWhatsAppLink, type RoomType } from '@/data/pgInfo';
import { reveal, revealChild } from '@/lib/reveal';
import styles from './RoomCarousel.module.css';

const TRANSITION_MS = 700;
const SWIPE_THRESHOLD_PX = 50;

// Fan layout by distance from the active card. `x` is a multiple of the responsive --spread
// width set in RoomCarousel.module.css; slot 2 fades in only on wide screens via --far-opacity;
// slot 3 is the hidden staging spot.
// Side cards lean in toward the centre: left cards turn clockwise, right cards counterclockwise.
// Far cards drop less than near ones so their tilted inner corner stays hidden behind the near card.
const SLOTS = [
  { x: 0, y: 0, rotate: 0, scale: 1, z: 30, opacity: '1' },
  { x: 1, y: 4, rotate: 4, scale: 0.8, z: 20, opacity: '1' },
  { x: 1.75, y: 3, rotate: 7, scale: 0.64, z: 10, opacity: 'var(--far-opacity)' },
  { x: 2.3, y: 2, rotate: 9, scale: 0.5, z: 0, opacity: '0' },
];

function slotStyle(offset: number): CSSProperties {
  const slot = SLOTS[Math.min(Math.abs(offset), SLOTS.length - 1)];
  const side = Math.sign(offset);
  return {
    transform: `translateX(calc(var(--spread) * ${slot.x * side})) translateY(${slot.y}%) rotate(${-slot.rotate * side}deg) scale(${slot.scale})`,
    opacity: slot.opacity,
    zIndex: slot.z,
    transitionDuration: `${TRANSITION_MS}ms`,
  };
}

interface RoomCarouselProps {
  rooms: RoomType[];
}

export default function RoomCarousel({ rooms }: RoomCarouselProps) {
  // With few rooms the ring is doubled so the fan always has two cards on each side.
  const ring = rooms.length < 5 ? [...rooms, ...rooms] : rooms;
  const size = ring.length;

  const [active, setActive] = useState(0);
  const [preview, setPreview] = useState<RoomType | null>(null);
  const lockedRef = useRef(false);
  const touchStartX = useRef<number | null>(null);

  const go = useCallback(
    (step: number) => {
      if (lockedRef.current) return;
      lockedRef.current = true;
      setActive((current) => (current + step + size) % size);
      window.setTimeout(() => {
        lockedRef.current = false;
      }, TRANSITION_MS);
    },
    [size],
  );

  const closePreview = useCallback(() => setPreview(null), []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > SWIPE_THRESHOLD_PX) go(delta < 0 ? 1 : -1);
  };

  // ---------- Mouse drag (desktop): same rule as the touch swipe ----------
  // Drag right → cards move right (previous room); drag left → cards move left (next room).
  // While dragging, the fan follows the cursor a little, then settles when released.
  const stageRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);
  const didDrag = useRef(false);

  const setDragOffset = (px: number, animate: boolean) => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.transition = animate ? `transform 400ms cubic-bezier(0.22, 1, 0.36, 1)` : 'none';
    stage.style.transform = px ? `translateX(${px}px)` : '';
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    dragStartX.current = event.clientX;
    didDrag.current = false;
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    const delta = event.clientX - dragStartX.current;
    if (!didDrag.current && Math.abs(delta) > 6) {
      didDrag.current = true;
      // Keep receiving moves even if the cursor leaves the cards mid-drag.
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.dragging = '';
    }
    // Follow the cursor at 35% of its movement, capped, so it feels attached but never flies off.
    if (didDrag.current) setDragOffset(Math.max(-120, Math.min(120, delta * 0.35)), false);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    const delta = event.clientX - dragStartX.current;
    dragStartX.current = null;
    delete event.currentTarget.dataset.dragging;
    setDragOffset(0, true);
    if (didDrag.current && Math.abs(delta) > SWIPE_THRESHOLD_PX) go(delta < 0 ? 1 : -1);
  };

  // A drag should never also count as a click on a side card or the full-size photo button.
  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (didDrag.current) {
      event.preventDefault();
      event.stopPropagation();
      didDrag.current = false;
    }
  };

  const activeRoom = ring[active];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Room types"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={styles.carousel}
    >
      <div
        ref={stageRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={handleClickCapture}
        onDragStart={(event) => event.preventDefault()}
        className={styles.stage}
      >
        {ring.map((room, index) => {
          let offset = (index - active + size) % size;
          if (offset > size / 2) offset -= size;
          const isActive = offset === 0;

          return (
            <div key={`${room.id}-${index}`} style={slotStyle(offset)} className={styles.slot}>
              <article
                inert={!isActive}
                aria-hidden={!isActive}
                className={`${styles.card} ${isActive ? styles.active : ''}`}
              >
                <div className={styles.photo}>
                  <Image
                    src={room.image}
                    alt={room.imageAlt}
                    fill
                    sizes="(min-width: 1280px) 580px, (min-width: 1024px) 540px, (min-width: 640px) 440px, 80vw"
                    className={styles.image}
                  />
                  <button
                    type="button"
                    onClick={() => setPreview(room)}
                    aria-label={`View ${room.title} photo full size`}
                    className={styles.expand}
                  >
                    <ArrowsPointingOutIcon className={styles.expandIcon} strokeWidth={2} aria-hidden="true" />
                  </button>
                </div>

                <div className={styles.details}>
                  <div className={styles.detailsClip}>
                    <div className={styles.body}>
                      {/* When the carousel first comes into view (it is the reveal group, see Rooms.tsx), the card's
                          title, description and contact icons rise in one after another. */}
                      <div className={styles.text}>
                        <h3 className={styles.title} {...revealChild('up', 450)}>
                          {room.title}
                        </h3>
                        <p className={styles.description} {...revealChild('up', 560)}>
                          {room.description}
                        </p>
                      </div>
                      <div className={styles.contact} {...revealChild('fade', 680)}>
                        <a
                          href={buildWhatsAppLink(room.whatsappMessage)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Enquire about ${room.title} on WhatsApp`}
                          className={`${styles.contactLink} ${styles.whatsapp}`}
                        >
                          <WhatsappIcon className={styles.whatsappIcon} />
                        </a>
                        <a
                          href={PHONE_TEL}
                          aria-label={`Call about ${room.title}`}
                          className={`${styles.contactLink} ${styles.phone}`}
                        >
                          <PhoneIcon className={styles.phoneIcon} strokeWidth={2} aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {!isActive && Math.abs(offset) <= 2 && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => go(offset)}
                  aria-label={`Show ${room.title}`}
                  className={`${styles.pick} ${Math.abs(offset) === 2 ? styles.pickFar : ''}`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.controls} {...reveal('up', 300)}>
        <button type="button" onClick={() => go(-1)} aria-label="Previous room" className={styles.arrow}>
          <ChevronLeftIcon className={styles.arrowIcon} strokeWidth={2} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next room" className={styles.arrow}>
          <ChevronRightIcon className={styles.arrowIcon} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      <p className={styles.srOnly} aria-live="polite">
        Showing {activeRoom.title}, {(active % rooms.length) + 1} of {rooms.length}
      </p>

      {preview && <ImageLightbox src={preview.image} alt={preview.imageAlt} onClose={closePreview} />}
    </div>
  );
}
