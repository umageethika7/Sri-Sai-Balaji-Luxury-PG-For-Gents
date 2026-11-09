'use client';

import { CalendarDaysIcon, CheckIcon, ChevronDownIcon, PhoneIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useEffect, useId, useRef, useState, type ComponentType, type KeyboardEvent } from 'react';
import Reveal from '@/components/Reveal';
import { reveal } from '@/lib/reveal';
import WhatsappIcon from '@/components/icons/WhatsappIcon';
import { PHONE_DISPLAY, PHONE_TEL, ROOM_TYPES, buildWhatsAppLink, visitEnquiryMessage } from '@/data/pgInfo';
import styles from './PlanVisit.module.css';

const NOT_SURE = 'Not sure yet, help me choose';
const ROOM_OPTIONS = [...ROOM_TYPES.map((room) => room.title), NOT_SURE];

const MOVE_IN_OPTIONS = ['Immediately', 'Within a week', 'Within 2 weeks', 'Within a month', 'Just exploring for now'];

// Turns the chosen dropdown options into the shared visit enquiry wording.
function buildMessage(room: string, moveIn: string): string {
  const sharing = room === NOT_SURE ? 'unsure' : (ROOM_TYPES.find((type) => type.title === room)?.sharing ?? null);
  return visitEnquiryMessage(sharing, moveIn);
}

interface DropdownProps {
  label: string;
  placeholder: string;
  icon: ComponentType<{ className?: string }>;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

// Custom listbox instead of a native <select>: the browser draws native option lists itself, so their
// highlight colour can't be set. This one highlights the hovered / keyboard-active option in #6488d6.
function Dropdown({ label, placeholder, icon: Icon, options, value, onChange }: DropdownProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const buttonId = `${id}-button`;
  const listId = `${id}-list`;
  const optionId = (index: number) => `${id}-option-${index}`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Close when clicking anywhere outside the dropdown.
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  // Keep the keyboard-active option visible if the list ever scrolls.
  useEffect(() => {
    if (open) document.getElementById(`${id}-option-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [id, open, active]);

  const openList = () => {
    setActive(Math.max(0, options.indexOf(value)));
    setOpen(true);
  };

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  };

  const choose = (index: number) => {
    onChange(options[index]);
    close();
  };

  const handleButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      openList();
    }
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const last = options.length - 1;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActive((current) => Math.min(last, current + 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActive((current) => Math.max(0, current - 1));
        break;
      case 'Home':
        event.preventDefault();
        setActive(0);
        break;
      case 'End':
        event.preventDefault();
        setActive(last);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        choose(active);
        break;
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'Tab':
        close(false);
        break;
    }
  };

  return (
    <>
      <span id={labelId} className={styles.label}>
        {label}
      </span>
      <div ref={rootRef} className={styles.field}>
        <Icon className={styles.fieldIcon} aria-hidden="true" />
        <button
          ref={buttonRef}
          id={buttonId}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={`${labelId} ${buttonId}`}
          onClick={() => (open ? close() : openList())}
          onKeyDown={handleButtonKeyDown}
          className={`${styles.select} ${value ? '' : styles.placeholder} ${open ? styles.selectOpen : ''}`}
        >
          <span className={styles.selectValue}>{value || placeholder}</span>
        </button>
        <ChevronDownIcon className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} aria-hidden="true" />

        {open && (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={labelId}
            aria-activedescendant={optionId(active)}
            onKeyDown={handleListKeyDown}
            className={styles.list}
            data-lenis-prevent
          >
            {options.map((option, index) => (
              <li
                key={option}
                id={optionId(index)}
                role="option"
                aria-selected={option === value}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(index)}
                className={`${styles.option} ${index === active ? styles.optionActive : ''} ${
                  option === value ? styles.optionSelected : ''
                }`}
              >
                <span>{option}</span>
                {option === value && <CheckIcon className={styles.optionCheck} aria-hidden="true" />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
export default function PlanVisit() {
  const [room, setRoom] = useState('');
  const [moveIn, setMoveIn] = useState('');

  return (
    <section id="visit" className={styles.section}>
      <span className={styles.dots} aria-hidden="true" />

      <div className={`container ${styles.layout}`}>
        {/* Label, heading, text and phone line rise in one after another. */}
        <div className={styles.intro}>
          <span className={styles.eyebrow} {...reveal('fade')}>
            Visit Sri Sai Balaji
            <span className={styles.eyebrowRule} aria-hidden="true" />
          </span>

          <h2 className={styles.title} {...reveal('up', 110)}>
            <span className={styles.titleLine}>
              See It,{' '}
              <span className={styles.nowrap}>
                Feel I
                {/* The sparkle is anchored to this "t", so it stays centred on the letter at every font size. */}
                <span className={styles.sparkleAnchor}>
                  t
                  {/* Three short rays shining out from the bottom-left corner (the top-right of the "t"). */}
                  <svg className={styles.sparkle} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M1.5 17.5 3 7.5M4.5 19.5l7.5-7.5M6 22.5l10-2"
                      stroke="currentColor"
                      strokeWidth="2.25"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                ,
              </span>
            </span>
            <span className={`${styles.titleLine} ${styles.accent}`}>
              Then Call It{' '}
              <span className={styles.underlined}>
                Home.
                <svg className={styles.swoosh} viewBox="0 0 220 24" fill="none" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M4 14C60 6 150 4 216 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <path d="M40 21C90 15 150 14 196 17" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
                </svg>
              </span>
            </span>
          </h2>

          <p className={styles.lead} {...reveal('up', 240)}>
            Walk through the rooms, taste the home-style meals and see how calm everyday life is in BTM Layout before you
            decide. Pick your room and move-in time, and we’ll have everything ready when you drop by.
          </p>

          <a href={PHONE_TEL} className={styles.call} {...reveal('up', 360)}>
            <span className={styles.callIcon}>
              <PhoneIcon className={styles.callIconSvg} aria-hidden="true" />
            </span>
            <span className={styles.callText}>
              <span className={styles.callLabel}>Give us a call</span>
              <span className={styles.callNumber}>{PHONE_DISPLAY}</span>
            </span>
          </a>
        </div>

        <Reveal delay={220} direction="up" className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>
              <CalendarDaysIcon className={styles.cardIconSvg} aria-hidden="true" />
            </span>
            <h3 className={styles.cardTitle}>Plan your visit</h3>
            <span className={styles.badge}>On WhatsApp</span>
          </div>

          <Dropdown
            label="Your room preference"
            placeholder="Choose your preferred room"
            icon={UsersIcon}
            options={ROOM_OPTIONS}
            value={room}
            onChange={setRoom}
          />

          <Dropdown
            label="When would you like to move in?"
            placeholder="When are you planning to move in?"
            icon={CalendarDaysIcon}
            options={MOVE_IN_OPTIONS}
            value={moveIn}
            onChange={setMoveIn}
          />

          <a
            href={buildWhatsAppLink(buildMessage(room, moveIn))}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.submit}
          >
            <WhatsappIcon className={styles.submitIcon} />
            Message us on WhatsApp
          </a>

          <p className={styles.note}>We’ll confirm availability, rent and a visit time with you.</p>
        </Reveal>
      </div>
    </section>
  );
}
