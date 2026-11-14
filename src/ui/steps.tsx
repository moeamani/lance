import { motion } from 'motion/react'
import { useLocale } from '../i18n/locale'
import { cn } from './core'

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

/**
 * Roman-numeral step indicator — the neoclassical device with an LED that marks "you are here".
 * Shows done / current / upcoming (Goal-gradient: the lit rail grows toward the end).
 * Persian uses Persian digits, because Roman numerals are not part of Persian typography.
 */
export function Steps({ steps, current, onJump, className }: { steps: string[]; current: number; onJump?: (i: number) => void; className?: string }) {
  const { lang, num } = useLocale()
  return (
    <nav aria-label={lang === 'fa' ? 'مراحل' : 'Steps'} className={className}>
      <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        <span aria-hidden className="absolute inset-x-[calc(50%/var(--n))] top-[15px] h-px bg-line" style={{ ['--n' as string]: steps.length }} />
        <motion.span
          aria-hidden
          className="absolute start-[calc(50%/var(--n))] top-[15px] h-px bg-cobalt shadow-[0_0_8px_var(--cobalt)]"
          style={{ ['--n' as string]: steps.length }}
          initial={false}
          // Track runs centre-to-centre: (100% − 100%/n); fill is the done fraction of it.
          animate={{ width: `${(current / Math.max(1, steps.length - 1)) * (100 - 100 / steps.length)}%` }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
        {steps.map((s, i) => {
          const state = i < current ? 'done' : i === current ? 'current' : 'next'
          const Tag = onJump && i < current ? 'button' : 'span'
          return (
            <li key={s} className="relative flex flex-col items-center gap-2 text-center" aria-current={state === 'current' ? 'step' : undefined}>
              <Tag
                {...(Tag === 'button' ? { type: 'button' as const, onClick: () => onJump?.(i), 'aria-label': s } : {})}
                className={cn(
                  // One background per state: two bg utilities can't be ordered by class position.
                  'relative z-10 grid size-8 place-items-center rounded-full border text-[12px] numeral transition-colors',
                  state === 'done' && 'border-cobalt bg-ground text-cobalt-ink',
                  state === 'current' && 'border-cobalt bg-cobalt text-on-accent shadow-[0_0_16px_color-mix(in_oklab,var(--cobalt)_calc(70%*var(--glow)),transparent)]',
                  state === 'next' && 'border-line-strong bg-ground text-ink-subtle',
                )}
              >
                {lang === 'fa' ? num(i + 1) : ROMAN[i]}
              </Tag>
              <span className={cn('px-1 text-[13px] leading-tight', state === 'current' ? 'text-ink' : 'text-ink-subtle')}>{s}</span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
