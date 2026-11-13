import { motion } from 'motion/react'
import { useState } from 'react'
import { StarIcon } from '@hugeicons/core-free-icons'
import { cn } from '../../lib/cn'
import { toFaDigits } from '../../lib/format'
import { Icon } from './Icon'

const LABELS = ['', 'مبتدی', 'قابل قبول', 'خوب', 'حرفه‌ای', 'مهارت بسیار بالا']

/** Interactive rating (radiogroup) with the Figma glow + a live text label. */
export function StarRating({ value, onChange, size = 36 }: { value: number; onChange: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value
  return (
    <div className="flex flex-col items-center gap-3">
      <div role="radiogroup" aria-label="امتیاز" className="flex gap-3" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => {
          const on = n <= shown
          return (
            <motion.button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={`${toFaDigits(n)} ستاره`}
              whileTap={{ scale: 0.85 }}
              animate={{ scale: on ? 1 : 0.92 }}
              onMouseEnter={() => setHover(n)}
              onClick={() => onChange(n === value ? 0 : n)}
              className={cn('grid place-items-center rounded-full transition-colors', on ? 'text-primary drop-shadow-[0_0_12px_#ff7fe399]' : 'text-stroke-strong')}
            >
              <Icon icon={StarIcon} size={size} className={on ? '[&_path]:fill-current' : ''} />
            </motion.button>
          )
        })}
      </div>
      <p className="h-5 text-sm font-bold text-success" aria-live="polite">
        {LABELS[shown]}
      </p>
    </div>
  )
}

/** Read-only rating: «★ ۴.۵ امتیاز لنسر» */
export function RatingBadge({ value, label, className }: { value: number; label?: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-sm font-bold', className)}>
      <Icon icon={StarIcon} size={18} className="text-warning [&_path]:fill-current" />
      <span className="tabular">{toFaDigits(value.toFixed(1))}</span>
      {label && <span className="ms-1 text-xs font-normal text-fg-subtle">{label}</span>}
    </span>
  )
}
