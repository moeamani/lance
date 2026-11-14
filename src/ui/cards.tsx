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
  tone = 'cobalt',
  vignette,
  step,
  to,
  className,
}: {
  title: ReactNode
  line: ReactNode
  icon: IconSvgElement
  tone?: 'cobalt' | 'gilt'
  vignette?: ReactNode
  step?: string
  to?: string
  className?: string
}) {
  const c = tone === 'gilt' ? 'var(--gilt)' : 'var(--cobalt)'
  const body = (
    <>
      {/* fluting + lit edge (end side, so it mirrors in RTL) */}
      <span aria-hidden className="flutes pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,transparent,#000_60%)]" />
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
  cobalt: { field: 'linear-gradient(180deg,#1b2650,#121a38)', ink: '#e9edff' },
  gilt: { field: 'linear-gradient(180deg,#3a2e14,#241c0c)', ink: '#fbf1dc' },
  marble: { field: 'linear-gradient(180deg,#e9eaee,#d6d9e0)', ink: '#14161b' },
} as const

/**
 * Oath card — the starter's affirmation. A framed tile with a knight and one line in large type.
 * The frame is marble (a statue plinth), the field carries the light.
 */
export function OathCard({ who, oath, tone = 'cobalt', label }: { who: KnightId; oath: ReactNode; tone?: keyof typeof OATH_TONES; label: string }) {
  const t = OATH_TONES[tone]
  return (
    <figure className="rounded-[22px] bg-[#eceef2] p-2 shadow-[0_1px_0_#fff_inset]">
      <div className="flex h-full flex-col rounded-[16px] px-5 pt-6 pb-7" style={{ background: t.field, color: t.ink }}>
        <Knight who={who} label={label} className="mx-auto aspect-[4/5] w-[62%]" />
        <figcaption className="heading mt-6 text-center text-[clamp(1.4rem,2.2vw,1.75rem)]">{oath}</figcaption>
      </div>
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
export const Bar = ({ w = '100%', tone }: { w?: string; tone?: 'cobalt' | 'gilt' }) => (
  <span
    aria-hidden
    className="block h-2.5 rounded-full"
    style={{ width: w, background: tone ? (tone === 'cobalt' ? 'var(--cobalt)' : 'var(--gilt)') : 'var(--line)', opacity: tone ? 0.9 : 1 }}
  />
)
