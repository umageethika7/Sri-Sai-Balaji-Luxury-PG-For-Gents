import type { CSSProperties } from 'react';

/**
 * Scroll-reveal styles (defined in globals.css):
 * - up / down / left / right: fade in while sliding into place
 * - scale: fade in while growing slightly (cards, panels)
 * - clip: an image unveiled from a slightly inset frame
 * - fade: opacity only
 */
export type RevealVariant = 'up' | 'down' | 'left' | 'right' | 'scale' | 'clip' | 'fade';

/**
 * Props that make an element animate in whenever it scrolls into view, down or up (see ScrollReveal).
 * Spread onto any element; `delay` (ms) staggers siblings, `style` is merged in.
 *
 *   <h2 {...reveal('up', 120)}>...</h2>
 */
export function reveal(variant: RevealVariant = 'up', delay = 0, style?: CSSProperties) {
  return {
    'data-reveal': variant,
    style: { ...style, '--reveal-delay': `${delay}ms` } as CSSProperties,
  };
}

/**
 * Marks a container whose `revealChild` descendants all play together when the container scrolls into
 * view. For content the observer can't see on its own: cards still off-screen in a sliding marquee,
 * or the text of carousel cards that are folded away.
 */
export const revealGroup = { 'data-reveal-group': '' };

/** A descendant of a `revealGroup` container; it reveals (after `delay` ms) when the group does. */
export function revealChild(variant: RevealVariant = 'up', delay = 0, style?: CSSProperties) {
  return {
    'data-reveal-child': variant,
    style: { ...style, '--reveal-delay': `${delay}ms` } as CSSProperties,
  };
}
