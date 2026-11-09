import ContactActions from '@/components/ContactActions';
import Reveal from '@/components/Reveal';
import RoomCarousel from '@/components/RoomCarousel';
import SectionHeading from '@/components/SectionHeading';
import { ROOM_TYPES } from '@/data/pgInfo';
import { reveal } from '@/lib/reveal';
import styles from './Rooms.module.css';

export default function Rooms() {
  return (
    <section id="rooms" className={styles.section}>
      <div className="container">
        <SectionHeading
          eyebrow="Our Rooms"
          title="Rooms made for comfortable everyday living"
          description="Choose the sharing style that suits your budget and routine. Every room comes fully furnished with an attached bathroom."
        />

        <Reveal delay={200} direction="scale" group className={styles.carousel}>
          <RoomCarousel rooms={ROOM_TYPES} />
        </Reveal>

        {/* The box settles in first, then its heading, text and buttons follow one after another. */}
        <Reveal direction="scale" className={styles.cta}>
          <h3 className={styles.ctaTitle} {...reveal('up', 180)}>
            Ready to move in?
          </h3>
          <p className={styles.ctaText} {...reveal('up', 300)}>
            Call or message us to check current availability and plan a visit to see the rooms in person.
          </p>
          <div {...reveal('up', 420)}>
            <ContactActions tone="dark" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
