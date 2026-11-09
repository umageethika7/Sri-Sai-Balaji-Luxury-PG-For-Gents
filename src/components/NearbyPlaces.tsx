'use client';

import { ArrowTopRightOnSquareIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { NEARBY_PLACES, buildMapSearchUrl } from '@/data/pgInfo';
import { reveal } from '@/lib/reveal';
import styles from './NearbyPlaces.module.css';

// How long each place stays open before auto-advancing; also drives the progress bar animation.
const STEP_MS = 3000;

export default function NearbyPlaces() {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  // Photos are mounted the first time a place opens (plus the next one, so it's ready) and then kept.
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set());
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setAutoplay(!query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const node = listRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const next = (active + 1) % NEARBY_PLACES.length;
    setLoaded((prev) => (prev.has(active) && prev.has(next) ? prev : new Set(prev).add(active).add(next)));
  }, [active, inView]);

  const running = autoplay && inView && !hovering && !focused;
  const advance = () => setActive((current) => (current + 1) % NEARBY_PLACES.length);

  return (
    <section id="nearby" className={styles.section}>
      <div className="container">
        <SectionHeading
          eyebrow="Nearby Places"
          title="Everything important is within easy reach"
          description="Metro lines, tech parks, colleges and hangouts are all close by, so your daily commute stays simple."
        />

        {/* The navy panel settles in, then its rows rise in one after another. */}
        <Reveal delay={200} direction="scale" className={styles.reveal}>
          <div
            ref={listRef}
            className={styles.list}
            onPointerEnter={(event) => event.pointerType === 'mouse' && setHovering(true)}
            onPointerLeave={() => setHovering(false)}
            // Only keyboard focus pauses; a mouse click focuses the row too, but autoplay should resume once the pointer leaves.
            onFocus={(event) => event.target.matches(':focus-visible') && setFocused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
            }}
          >
            {NEARBY_PLACES.map((place, index) => {
              const isActive = index === active;
              const panelId = `nearby-panel-${index}`;
              return (
                <div
                  key={place.name}
                  className={`${styles.item} ${isActive ? styles.active : ''}`}
                  {...reveal('up', 380 + index * 90)}
                >
                  {/* Full-row hit area; the visible row content sits above it but lets clicks through. */}
                  <button
                    type="button"
                    className={styles.hit}
                    onClick={() => setActive(index)}
                    aria-expanded={isActive}
                    aria-controls={panelId}
                    aria-label={`${place.name}, ${place.badge}`}
                  />

                  <span className={styles.number} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className={styles.heading} aria-hidden="true">
                    <h3 className={styles.name}>{place.name}</h3>
                    <p className={styles.category}>{place.badge}</p>
                  </div>

                  <div id={panelId} className={styles.panel} inert={!isActive}>
                    <div className={styles.panelClip}>
                      <div className={styles.panelInner}>
                        <div className={styles.media}>
                          {loaded.has(index) && (
                            <Image
                              src={place.image}
                              alt={place.imageAlt}
                              fill
                              placeholder="blur"
                              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                              className={styles.photo}
                            />
                          )}
                        </div>

                        <div className={styles.details}>
                          <p className={styles.description}>{place.description}</p>
                          <ul className={styles.meta}>
                            <li className={styles.metaItem}>
                              <ClockIcon className={styles.metaIcon} aria-hidden="true" />
                              <span>
                                <span className={styles.metaLabel}>From the PG: </span>
                                {place.distance}
                              </span>
                            </li>
                            <li className={styles.metaItem}>
                              <MapPinIcon className={styles.metaIcon} aria-hidden="true" />
                              <a
                                href={buildMapSearchUrl(place.mapQuery)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.mapLink}
                                aria-label={`Open ${place.name} in Google Maps`}
                              >
                                Open in Maps
                                <ArrowTopRightOnSquareIcon className={styles.mapLinkIcon} strokeWidth={2} aria-hidden="true" />
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isActive && autoplay && (
                    <span
                      key={active}
                      className={styles.progress}
                      style={{ animationDuration: `${STEP_MS}ms`, animationPlayState: running ? 'running' : 'paused' }}
                      onAnimationEnd={advance}
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
