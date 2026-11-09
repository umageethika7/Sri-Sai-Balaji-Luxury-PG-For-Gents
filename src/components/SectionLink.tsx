'use client';

import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import type { SectionPath } from '@/lib/sectionRoutes';
import { goToSection } from '@/router/sectionRouter';

interface SectionLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: SectionPath;
}

/**
 * A link to a section's URL (/rooms, /faq, ...). A normal click smooth-scrolls there and updates the
 * URL through TanStack Router; Ctrl/Cmd/middle-click still opens the real URL in a new tab.
 */
export default function SectionLink({ to, onClick, ...props }: SectionLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    goToSection(to);
  };

  return <a href={to} onClick={handleClick} {...props} />;
}
