import SectionHeading from '@/components/SectionHeading';
import ViewAllFacilities from '@/components/ViewAllFacilities';
import { FACILITY_ICONS } from '@/components/icons/FacilityIcons';
import { FACILITIES, type Facility } from '@/data/pgInfo';
import { revealChild, revealGroup } from '@/lib/reveal';
import styles from './Facilities.module.css';

const HALF = Math.ceil(FACILITIES.length / 2);
const ROWS: { facilities: Facility[]; direction: 'left' | 'right' }[] = [
  { facilities: FACILITIES.slice(0, HALF), direction: 'left' },
  { facilities: FACILITIES.slice(HALF), direction: 'right' },
];

function FacilityCard({ facility, delay }: { facility: Facility; delay: number }) {
  const Icon = FACILITY_ICONS[facility.icon];
  return (
    <article className={styles.card} {...revealChild('up', delay)}>
      <div className={styles.text}>
        <h3 className={styles.title}>{facility.title}</h3>
        <p className={styles.quote}>“{facility.description}”</p>
      </div>
      <span className={styles.iconWrap}>
        <Icon className={styles.icon} />
      </span>
    </article>
  );
}

// The card set is rendered twice; the track slides by exactly one set (-50%), so the copy lands
// where the original started and the loop never visibly resets.
// Cards rise in one after another (capped, so cards further along the loop don't wait long);
// the second row starts a beat after the first.
const CARD_STAGGER_MS = 110;
const ROW_OFFSET_MS = [150, 330];

function MarqueeRow({ facilities, direction, rowIndex }: (typeof ROWS)[number] & { rowIndex: number }) {
  return (
    // The row is the reveal group: all its cards (including those still off-screen in the loop) rise in together, staggered.
    <div className={styles.row} {...revealGroup}>
      <div className={`${styles.track} ${direction === 'left' ? styles.toLeft : styles.toRight}`}>
        {[0, 1].map((copy) => (
          <div key={copy} className={styles.set} aria-hidden={copy === 1 || undefined}>
            {facilities.map((facility, index) => (
              <FacilityCard
                key={facility.title}
                facility={facility}
                delay={ROW_OFFSET_MS[rowIndex] + Math.min(index, 5) * CARD_STAGGER_MS}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Facilities() {
  return (
    <section id="facilities" className={styles.section}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.intro}>
            <SectionHeading
              align="left"
              eyebrow="Facilities"
              title="Everything you need, under one roof"
              description="From home-style meals to round-the-clock security, every detail is designed so you can focus on work, studies and rest."
            />
            <ViewAllFacilities />
          </div>

          <div className={styles.marquee}>
            {ROWS.map((row, rowIndex) => (
              <MarqueeRow key={row.direction} {...row} rowIndex={rowIndex} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
