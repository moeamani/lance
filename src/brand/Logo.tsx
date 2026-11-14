import { useId } from 'react'
import { useLocale } from '../i18n/locale'

/**
 * The Lance mark: a lance standing in an arched niche.
 * The free lance (Scott, Ivanhoe, 1819) inside neoclassical architecture; the tip is the LED.
 * Construction: 48-unit grid, arch radius 15, stroke 3, tip = rhombus 7.2 × 14, pennant 9.5 × 6.4.
 */
export function Mark({ size = 32, lit = true, className }: { size?: number; lit?: boolean; className?: string }) {
  const id = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-g`} cx="24" cy="14" r="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--cobalt)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--cobalt)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* niche */}
      <path d="M9 45V21a15 15 0 0 1 30 0v24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* shaft */}
      <path d="M24 45V20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* pennant: the free lance's flag (the mark never mirrors) */}
      <path d="M25.5 22.5l9.5 3.2-9.5 3.2z" fill="currentColor" />
      {lit && <circle cx="24" cy="14" r="10" fill={`url(#${id}-g)`} />}
      {/* tip (the LED) */}
      <path d="M24 6.5l3.6 7-3.6 7-3.6-7z" fill={lit ? 'var(--cobalt)' : 'currentColor'} />
    </svg>
  )
}

/** Wordmark set per script: Inter for "Lance", Vazirmatn for «لنس». Logos never mirror in RTL. */
export function Logo({ size = 28, className }: { size?: number; className?: string }) {
  const { lang } = useLocale()
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ''}`} dir="ltr">
      <Mark size={size} />
      <span
        className="leading-none"
        style={{
          fontSize: size * 0.82,
          fontWeight: lang === 'fa' ? 800 : 650,
          letterSpacing: lang === 'fa' ? 0 : '-0.04em',
          fontFamily: lang === 'fa' ? 'var(--font-fa)' : 'var(--font-sans)',
          marginTop: lang === 'fa' ? size * 0.12 : 0,
        }}
      >
        {lang === 'fa' ? 'لنس' : 'Lance'}
      </span>
    </span>
  )
}
