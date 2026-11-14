import { motion } from 'motion/react'
import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { useLocale } from '../i18n/locale'
import { cn } from './core'

/** Segmented tabs. Roving focus, arrow keys mirror in RTL, active indicator slides (no weight change). */
export function Tabs<T extends string>({ value, onChange, options, label, className }: { value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode; count?: number }[]; label: string; className?: string }) {
  const { dir, num } = useLocale()
  const lid = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const idx = options.findIndex((o) => o.value === value)
  const onKey = (e: KeyboardEvent) => {
    const fwd = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
    const back = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
    const d = e.key === fwd ? 1 : e.key === back ? -1 : 0
    if (!d) return
    e.preventDefault()
    const n = (idx + d + options.length) % options.length
    onChange(options[n].value)
    refs.current[n]?.focus()
  }
  return (
    <div role="tablist" aria-label={label} onKeyDown={onKey} className={cn('inline-flex rounded-md border border-line bg-surface p-1', className)}>
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
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(o.value)}
            className={cn('relative h-9 rounded-sm px-4 text-[15px] transition-colors duration-150', active ? 'text-ink' : 'text-ink-subtle hover:text-ink')}
          >
            {active && <motion.span layoutId={lid} transition={{ type: 'spring', stiffness: 500, damping: 40 }} className="absolute inset-0 rounded-sm border border-line-strong bg-raised" />}
            <span className="relative">
              {o.label}
              {o.count != null && <span className="ms-1.5 text-ink-subtle tabular">{num(o.count)}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}
