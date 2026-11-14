import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Knight, type KnightId } from '../brand/Knights'
import { cn, Icon, type IconSvgElement } from './core'

/**
 * Guide card — tutorials and onboarding. One idea per card: a title, an icon chip, one line,
 * and a small vignette of the real interface. The edge of the card is lit (LED), the rest is quiet.
 */
export function GuideCard({
  title,
  line,
  icon,
  tone = 'pink',
  vignette,
  step,
  to,
  className,
}: {
  title: ReactNode
  line: ReactNode
  icon: IconSvgElement
  tone?: 'pink' | 'sun'
  vignette?: ReactNode
  step?: string
  to?: string
  className?: string
}) {
  const c = tone === 'sun' ? 'var(--sun)' : 'var(--pink)'
  const body = (
    <>
      {/* LED wall + lit edge (end side, so it mirrors in RTL) */}
      <span aria-hidden className="led pointer-events-none absolute inset-0 opacity-70" />
      <span
        aria-hidden
        className="pointer-events-none absolute -end-24 top-1/3 h-[70%] w-56 rounded-full blur-3xl"
        style={{ background: `radial-gradient(closest-side, color-mix(in oklab, ${c} calc(70% * var(--glow)), transparent), transparent)` }}
      />
      <span aria-hidden className="pointer-events-none absolute inset-y-10 end-0 w-px" style={{ background: `linear-gradient(to bottom, transparent, ${c}, transparent)` }} />
      <div className="relative flex items-start gap-3">
        <h3 className="heading flex-1 text-[24px]">{title}</h3>
        <span
          className="grid size-11 shrink-0 place-items-center rounded-full border"
          style={{ borderColor: `color-mix(in oklab, ${c} 40%, transparent)`, background: `radial-gradient(circle at 30% 30%, color-mix(in oklab, ${c} 30%, transparent), transparent 70%)`, color: c }}
        >
          <Icon icon={icon} size={20} />
        </span>
      </div>
      {step && <p className="relative mt-1 numeral text-[13px] text-ink-subtle">{step}</p>}
      <p className="relative mt-3 max-w-[34ch] text-[17px] text-ink-muted">{line}</p>
      {vignette && (
        <div className="relative mt-8 -mb-8 overflow-hidden rounded-t-[16px] border border-b-0 border-line bg-raised p-4 shadow-[0_-12px_40px_-20px_#000]">{vignette}</div>
      )}
    </>
  )
  const cls = cn('group relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface p-7', to && 'lift', className)
  return to ? (
    <Link to={to} className={cls}>
      {body}
    </Link>
  ) : (
    <article className={cls}>{body}</article>
  )
}

const OATH_TONES = {
  pink: { field: 'var(--pink)', ink: '#0d0d0d', figure: '#0d0d0d' },
  sun: { field: 'var(--sun)', ink: '#0d0d0d', figure: '#0d0d0d' },
  dark: { field: 'linear-gradient(180deg,#1f1f1f,#0a0a0a)', ink: '#ffffff', figure: '' },
} as const

/**
 * Oath card: the starter's affirmation, set like the brand's "i'm a lancer" posters. A solid brand
 * colour with black type and figure, or black with the figure in its own colour.
 */
export function OathCard({ who, oath, tone = 'pink', label }: { who: KnightId; oath: ReactNode; tone?: keyof typeof OATH_TONES; label: string }) {
  const t = OATH_TONES[tone]
  return (
    <figure className="flex h-full flex-col overflow-hidden rounded-[20px] border border-white/10 px-6 pt-7 pb-8" style={{ background: t.field, color: t.ink }}>
      <Knight who={who} label={label} tile={false} color={t.figure || undefined} className="mx-auto aspect-[4/5] w-[58%]" />
      <figcaption className="display mt-6 text-[clamp(1.6rem,2.4vw,2rem)]">{oath}</figcaption>
    </figure>
  )
}

/** A vignette window with tool-strip chrome, as in the reference card. */
export function Vignette({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex gap-1.5" aria-hidden>
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="size-2 rounded-full bg-line-strong" />
      </div>
      {children}
    </div>
  )
}

/** Skeleton bar used inside vignettes (decorative). */
export const Bar = ({ w = '100%', tone }: { w?: string; tone?: 'pink' | 'sun' }) => (
  <span
    aria-hidden
    className="block h-2.5 rounded-full"
    style={{ width: w, background: tone ? (tone === 'pink' ? 'var(--pink)' : 'var(--sun)') : 'var(--line)', opacity: tone ? 0.9 : 1 }}
  />
)
