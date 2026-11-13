import { motion } from 'motion/react'
import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { spring } from '../../lib/motion'
import { CountBadge } from './Chip'

export type SegmentOption<T extends string> = { value: T; label: ReactNode; count?: number }

type Props<T extends string> = {
  options: SegmentOption<T>[]
  value: T
  onChange: (v: T) => void
  /** "segmented": equal-width track (Figma tabs). "pills": scrollable chips (notifications). */
  variant?: 'segmented' | 'pills'
  label: string
  className?: string
  /** Id prefix for aria-controls on the tab panels. */
  idBase?: string
}

/**
 * Accessible tabs (role=tablist, roving tabindex, arrow keys) with a shared
 * spring indicator. Replaces ~12 separate «Tabs/…» component variants in Figma.
 */
export function SegmentedControl<T extends string>({ options, value, onChange, variant = 'segmented', label, className, idBase }: Props<T>) {
  const layoutId = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const idx = options.findIndex((o) => o.value === value)

  const onKey = (e: KeyboardEvent) => {
    // RTL: ArrowLeft moves to the *next* tab.
    const delta = e.key === 'ArrowLeft' ? 1 : e.key === 'ArrowRight' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = (idx + delta + options.length) % options.length
    onChange(options[next].value)
    refs.current[next]?.focus()
  }

  const segmented = variant === 'segmented'
  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKey}
      className={cn(
        segmented ? 'flex rounded-[14px] border border-stroke bg-surface p-1' : 'no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5',
        className,
      )}
    >
      {options.map((o, i) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el
            }}
            role="tab"
            type="button"
            id={idBase ? `${idBase}-tab-${o.value}` : undefined}
            aria-controls={idBase ? `${idBase}-panel-${o.value}` : undefined}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(o.value)}
            className={cn(
              'relative inline-flex items-center justify-center gap-1.5 text-sm font-bold transition-colors',
              segmented ? 'h-11 flex-1 rounded-[10px]' : 'h-10 shrink-0 rounded-full border px-4',
              active ? 'text-primary' : 'text-fg-muted hover:text-fg',
              !segmented && (active ? 'border-transparent' : 'border-stroke bg-surface'),
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                transition={spring}
                className={cn('absolute inset-0 bg-primary-soft', segmented ? 'rounded-[10px]' : 'rounded-full')}
              />
            )}
            <span className="relative">{o.label}</span>
            {o.count != null && <CountBadge count={o.count} className="relative" />}
          </button>
        )
      })}
    </div>
  )
}
