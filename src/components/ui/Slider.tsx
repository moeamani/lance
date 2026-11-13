import { motion } from 'motion/react'
import { useId } from 'react'
import { cn } from '../../lib/cn'
import { formatToman } from '../../lib/format'

type Props = {
  min: number
  max: number
  step?: number
  value: number
  onChange: (v: number) => void
  label: string
  format?: (n: number) => string
  className?: string
}

/**
 * Range slider built on a native <input type=range> (keyboard, screen readers,
 * RTL fill direction for free) with a custom-drawn track.
 */
export function Slider({ min, max, step = 1, value, onChange, label, format = (n) => formatToman(n), className }: Props) {
  const id = useId()
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative h-8">
        <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 rounded-full bg-stroke" />
        <motion.div
          className="absolute top-1/2 right-0 h-3 -translate-y-1/2 rounded-full bg-primary"
          style={{ width: `${pct}%` }}
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={format(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="lance-range absolute inset-0 w-full cursor-pointer appearance-none bg-transparent"
        />
      </div>
      <div className="flex justify-between text-xs text-fg-subtle">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
      <style>{`
        .lance-range::-webkit-slider-thumb{appearance:none;width:24px;height:24px;border-radius:999px;background:var(--color-primary);border:4px solid var(--color-bg);box-shadow:0 0 0 1px var(--color-primary),0 0 20px #ff7fe366;transition:transform .15s}
        .lance-range:active::-webkit-slider-thumb{transform:scale(1.15)}
        .lance-range::-moz-range-thumb{width:20px;height:20px;border-radius:999px;background:var(--color-primary);border:4px solid var(--color-bg)}
        .lance-range:focus-visible{outline:none}
        .lance-range:focus-visible::-webkit-slider-thumb{box-shadow:0 0 0 4px var(--color-primary-muted)}
      `}</style>
    </div>
  )
}
