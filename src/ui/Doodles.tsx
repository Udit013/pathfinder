/**
 * Small hand-drawn-feel illustrations.
 *
 * Rules that keep these on the right side of the line between "warm" and
 * "childish": open line work rather than filled cartoon shapes, rounded caps, no
 * faces, no mascots, and colour drawn from the theme so they belong to the page.
 * They should read as a margin doodle by someone with a nice pen.
 *
 * All of them inherit `currentColor` for the line and use theme tokens for the
 * accent fills, so they work in light and dark without a second version.
 */

interface DoodleProps {
  className?: string
}

const stroke = {
  fill: 'none',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** A winding path with checkpoints — the product's core metaphor. */
export function PathDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 80" className={className} role="img" aria-label="A winding path">
      <path
        d="M8 68C8 68 22 66 30 56S38 34 50 30s24 6 32 0 12-16 12-16"
        {...stroke}
        stroke="currentColor"
        strokeDasharray="4 5"
        opacity={0.5}
      />
      <circle cx="8" cy="68" r="4.5" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.5} />
      <circle cx="50" cy="30" r="4.5" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.5} />
      <circle cx="94" cy="14" r="5.5" fill="var(--spark-soft)" stroke="var(--spark)" strokeWidth={1.5} />
      <path d="M94 8.5v11M88.5 14h11" stroke="var(--spark-ink)" {...stroke} opacity={0.8} />
    </svg>
  )
}

/** A sprout — used for growth, progress, and beginnings. */
export function SproutDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="A small sprout">
      <path d="M32 56V28" stroke="var(--positive)" {...stroke} />
      <path
        d="M32 34c-8 0-14-5-14-13 8 0 14 5 14 13Z"
        fill="var(--positive-soft)"
        stroke="var(--positive)"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M32 30c7 0 12-4.5 12-11.5-7 0-12 4.5-12 11.5Z"
        fill="var(--positive-soft)"
        stroke="var(--positive)"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path d="M20 56h24" stroke="currentColor" {...stroke} opacity={0.35} />
    </svg>
  )
}

/** A little toolbox / hammer — building and making. */
export function BuildDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="A hammer and a block">
      <rect
        x="10"
        y="34"
        width="26"
        height="18"
        rx="4"
        fill="var(--spark-soft)"
        stroke="var(--spark-ink)"
        strokeWidth={1.5}
      />
      <path d="M10 41h26" stroke="var(--spark-ink)" {...stroke} opacity={0.5} />
      <path
        d="M40 14l12 12-5 5-12-12 5-5Z"
        fill="var(--accent-soft)"
        stroke="var(--accent)"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path d="M36 23 24 35" stroke="var(--accent)" {...stroke} />
      <path d="M46 48c3.5 0 6-2 6-5" stroke="currentColor" {...stroke} opacity={0.35} />
    </svg>
  )
}

/** A star with a small sparkle — wins and milestones. */
export function SparkDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="A star">
      <path
        d="M28 12c0 9-4 13-13 13 9 0 13 4 13 13 0-9 4-13 13-13-9 0-13-4-13-13Z"
        fill="var(--spark-soft)"
        stroke="var(--spark)"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M46 36c0 5-2 7-7 7 5 0 7 2 7 7 0-5 2-7 7-7-5 0-7-2-7-7Z"
        fill="var(--accent-soft)"
        stroke="var(--accent)"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** A tiny confetti burst, used behind celebration moments. */
export function ConfettiDoodle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M32 8v7M14 16l5 5M50 16l-5 5M8 34h7M49 34h7" stroke="var(--spark)" {...stroke} />
      <circle cx="20" cy="44" r="2" fill="var(--accent)" opacity={0.7} />
      <circle cx="44" cy="46" r="2.5" fill="var(--spark)" opacity={0.8} />
      <circle cx="32" cy="52" r="1.8" fill="var(--positive)" opacity={0.7} />
    </svg>
  )
}
