import type { ReactNode } from 'react';
import { reveal, revealGroup, type RevealVariant } from '@/lib/reveal';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealVariant;
  /** Also reveal every `revealChild` inside, together with this wrapper. */
  group?: boolean;
}

/** Wrapper that animates its content in whenever it scrolls into view (see ScrollReveal / lib/reveal). */
export default function Reveal({ children, className = '', delay = 0, direction = 'up', group = false }: RevealProps) {
  return (
    <div className={className} {...reveal(direction, delay)} {...(group ? revealGroup : {})}>
      {children}
    </div>
  );
}
