import { ArrowUpRightIcon } from '@heroicons/react/20/solid';
import { BuildingOffice2Icon, MapPinIcon } from '@heroicons/react/24/solid';
import type { ComponentType, ReactNode } from 'react';
import LocationMap from '@/components/LocationMap';
import Reveal from '@/components/Reveal';
import { ADDRESS_FULL, MAP_DIRECTIONS_URL, PG_LANDMARK } from '@/data/pgInfo';
import { reveal } from '@/lib/reveal';
import styles from './Location.module.css';

function RouteIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="6" cy="19" r="2.5" />
      <circle cx="18" cy="5" r="2.5" />
      <path d="M8.5 19H16a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h7.5" />
    </svg>
  );
}

function InfoCard({
  icon: Icon,
  title,
  delay,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  delay: number;
  children: ReactNode;
}) {
  return (
    <div className={styles.card} {...reveal('left', delay)}>
      <span className={styles.iconWrap}>
        <Icon className={styles.icon} aria-hidden="true" />
      </span>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

export default function Location() {
  return (
    <section id="location" className={styles.section}>
      <div className="container">
        <div className={styles.layout}>
          {/* Pill, heading and lead first, then the three cards one after another. */}
          <div className={styles.info}>
            <span className={styles.pill} {...reveal('up')}>
              <span className={styles.pillDot} aria-hidden="true" />
              Our location
            </span>

            <h2 className={styles.title} {...reveal('up', 110)}>
              Find us in <span className={styles.accent}>BTM.</span>
            </h2>

            <p className={styles.lead} {...reveal('up', 220)}>
              A Bengaluru address to make your own.
              <br />
              16th Main, BTM Layout 2nd Stage.
            </p>

            <div className={styles.cards}>
              <InfoCard icon={MapPinIcon} title="Address" delay={330}>
                <address className={styles.text}>{ADDRESS_FULL}</address>
              </InfoCard>

              <InfoCard icon={BuildingOffice2Icon} title="Finding the entrance" delay={460}>
                <p className={styles.text}>{PG_LANDMARK}</p>
                <p className={styles.open}>
                  <span className={styles.openDot} aria-hidden="true" />
                  Open 24/7
                </p>
              </InfoCard>

              <InfoCard icon={RouteIcon} title="Get directions" delay={590}>
                <p className={styles.text}>
                  Find the fastest route to us in Google Maps.
                </p>
                <a
                  href={MAP_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Get directions
                  <ArrowUpRightIcon
                    className={styles.linkIcon}
                    aria-hidden="true"
                  />
                </a>
              </InfoCard>
            </div>
          </div>

          {/* Scale + fade only while revealing; it ends with no transform, so the map's controls are unaffected. */}
          <Reveal delay={250} direction="scale" className={styles.mapCol}>
            <LocationMap />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
