import { animate, motion, useInView, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useRef } from 'react'
import { cn } from '../../lib/cn'
import { formatNumber, formatPercent } from '../../lib/format'

export function ProgressBar({ value, className, tone = 'primary', label }: { value: number; className?: string; tone?: 'primary' | 'success' | 'warning'; label?: string }) {
  const color = { primary: 'bg-primary', success: 'bg-success', warning: 'bg-warning' }[tone]
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      aria-label={label}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-stroke', className)}
    >
      <motion.div
        className={cn('h-full rounded-full', color)}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}

/** Circular progress (project %, profile completion). Animates on first view. */
export function ProgressRing({ value, size = 56, stroke = 5, className, label }: { value: number; size?: number; stroke?: number; className?: string; label?: string }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true })
  return (
    <span className={cn('relative inline-grid shrink-0 place-items-center', className)} style={{ width: size, height: size }}>
      <svg ref={ref} width={size} height={size} className="-rotate-90" role="img" aria-label={label ?? `${formatPercent(value)} پیشرفت`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-stroke)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: inView ? c * (1 - value / 100) : c }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: 'drop-shadow(0 0 6px #ff7fe366)' }}
        />
      </svg>
      <span className="absolute text-[11px] font-extrabold tabular" style={{ fontSize: Math.max(11, size * 0.22) }}>
        {formatPercent(value)}
      </span>
    </span>
  )
}

/** Animated number — balances, stats. Respects reduced motion via MotionConfig. */
export function CountUp({ value, format = formatNumber, className }: { value: number; format?: (n: number) => string; className?: string }) {
  const mv = useMotionValue(0)
  const text = useTransform(mv, (v) => format(Math.round(v)))
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const controls = animate(mv, value, { duration: 1.2, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [inView, value, mv])
  return (
    <motion.span ref={ref} className={cn('tabular', className)}>
      {text}
    </motion.span>
  )
}
