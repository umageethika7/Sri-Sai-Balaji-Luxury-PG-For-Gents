import {
  BoltIcon,
  FingerPrintIcon,
  FireIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SunIcon,
  VideoCameraIcon,
  WifiIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, ReactNode } from 'react';
import type { Facility } from '@/data/pgInfo';

// Outline icons for facilities Heroicons doesn't cover, drawn to match its 24px / 1.5 stroke style.

interface IconProps {
  className?: string;
}

function Outline({ className = '', children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function BedIcon({ className }: IconProps) {
  return (
    <Outline className={className}>
      <path d="M3 6v13" />
      <path d="M3 15h18" />
      <path d="M21 19v-6a3 3 0 0 0-3-3h-7v5" />
      <circle cx="7" cy="12" r="1.75" />
    </Outline>
  );
}

export function ShowerIcon({ className }: IconProps) {
  return (
    <Outline className={className}>
      <path d="M5 21V7a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v1" />
      <path d="M9 8h8l-1.5 3h-5z" />
      <path d="M10.5 14v1M13 14v1.5M15.5 14v1M11.5 18v1M14.5 18v1" />
    </Outline>
  );
}

export function UtensilsIcon({ className }: IconProps) {
  return (
    <Outline className={className}>
      <path d="M6 3v5a2.5 2.5 0 0 0 5 0V3" />
      <path d="M8.5 3v18" />
      <path d="M18 21V3c-2 0-3.5 2.5-3.5 6v4H18" />
    </Outline>
  );
}

export function DrumstickIcon({ className }: IconProps) {
  return (
    <Outline className={className}>
      <ellipse cx="15" cy="9" rx="6" ry="4.25" transform="rotate(-45 15 9)" />
      <path d="M10.8 13.2 7.4 16.6" />
      <circle cx="5.9" cy="16.1" r="1.5" />
      <circle cx="7.9" cy="18.1" r="1.5" />
    </Outline>
  );
}

export function WaterDropIcon({ className }: IconProps) {
  return (
    <Outline className={className}>
      <path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z" />
      <path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5" />
    </Outline>
  );
}

export function WashingMachineIcon({ className }: IconProps) {
  return (
    <Outline className={className}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M4 7.5h16" />
      <path d="M7.5 5.25h.01M10 5.25h.01" />
      <circle cx="12" cy="14" r="4.25" />
      <path d="M9.5 14.5c1-.8 2-.8 3 0s2 .8 3 0" />
    </Outline>
  );
}

export function LiftIcon({ className }: IconProps) {
  return (
    <Outline className={className}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 10l3-3 3 3" />
      <path d="M9 14l3 3 3-3" />
    </Outline>
  );
}

export function CarIcon({ className }: IconProps) {
  return (
    <Outline className={className}>
      <path d="M5 16.5v-4l1.9-4.3A2 2 0 0 1 8.7 7h6.6a2 2 0 0 1 1.8 1.2l1.9 4.3v4" />
      <path d="M3.5 12.5h17" />
      <path d="M5 16.5h1.5M17.5 16.5H19M10 16.5h4" />
      <circle cx="8" cy="16.5" r="1.75" />
      <circle cx="16" cy="16.5" r="1.75" />
    </Outline>
  );
}

export function CookingPotIcon({ className }: IconProps) {
  return (
    <Outline className={className}>
      <path d="M5 11h14v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" />
      <path d="M3 11h18" />
      <path d="M9.5 7.5c0-1 1-1.25 1-2.25M13.5 7.5c0-1 1-1.25 1-2.25" />
    </Outline>
  );
}

export function WindIcon({ className }: IconProps) {
  return (
    <Outline className={className}>
      <path d="M3 8h10a2.5 2.5 0 1 0-2.5-2.5" />
      <path d="M3 12h15a2.5 2.5 0 1 1-2.5 2.5" />
      <path d="M3 16h7" />
    </Outline>
  );
}

// Icon for each facility, shared by the marquee cards and the "All Facilities" popup.
export const FACILITY_ICONS: Record<Facility['icon'], ComponentType<{ className?: string }>> = {
  bed: BedIcon,
  shower: ShowerIcon,
  utensils: UtensilsIcon,
  drumstick: DrumstickIcon,
  wifi: WifiIcon,
  'hot-water': FireIcon,
  'water-drop': WaterDropIcon,
  sparkles: SparklesIcon,
  'washing-machine': WashingMachineIcon,
  lift: LiftIcon,
  car: CarIcon,
  'cooking-pot': CookingPotIcon,
  zap: BoltIcon,
  fingerprint: FingerPrintIcon,
  camera: VideoCameraIcon,
  shield: ShieldCheckIcon,
  sun: SunIcon,
  wind: WindIcon,
};
