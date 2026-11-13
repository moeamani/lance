import { motion, type HTMLMotionProps } from 'motion/react'
import { forwardRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'

type CardProps = HTMLMotionProps<'div'> & {
  tone?: 'default' | 'sunken' | 'glow' | 'accent'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  interactive?: boolean
}

const tones = {
  default: 'bg-surface border border-stroke',
  sunken: 'bg-surface-sunken border border-stroke/60',
  glow: 'bg-surface border border-stroke bg-[radial-gradient(120%_80%_at_100%_0%,#ff7fe31f,transparent_60%)]',
  accent: 'bg-gradient-to-l from-primary to-[#ff4fd8] text-on-primary border border-primary',
}
const pads = { none: '', sm: 'p-3', md: 'p-4', lg: 'p-5' }

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { tone = 'default', padding = 'md', interactive, className, ...rest },
  ref,
) {
  return (
    <motion.div
      ref={ref}
      whileTap={interactive ? { scale: 0.985 } : undefined}
      className={cn('relative rounded-[16px]', tones[tone], pads[padding], interactive && 'transition-colors hover:border-stroke-strong', className)}
      {...rest}
    />
  )
})

/** Card title row: title/subtitle on the start side, an optional badge/action on the end. */
export function CardHeader({ title, subtitle, end, className }: { title: ReactNode; subtitle?: ReactNode; end?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-start justify-between gap-3', className)}>
      <div className="min-w-0">
        <h3 className="text-lg font-bold leading-7 text-fg">{title}</h3>
        {subtitle && <p className="mt-0.5 text-[13px] text-fg-muted">{subtitle}</p>}
      </div>
      {end && <div className="shrink-0">{end}</div>}
    </div>
  )
}

/** Section heading used between cards: «پروژه‌های جاری» … «مشاهده همه». */
export function SectionHeader({ title, count, to, actionLabel = 'مشاهده همه', className }: { title: ReactNode; count?: ReactNode; to?: string; actionLabel?: string; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <h2 className="flex items-baseline gap-2 text-lg font-extrabold">
        {title}
        {count != null && <span className="text-xs font-medium text-fg-subtle">{count}</span>}
      </h2>
      {to && (
        <Link to={to} className="-me-2 inline-flex h-10 items-center gap-1 rounded-[10px] px-2 text-xs font-bold text-primary hover:bg-primary-soft">
          {actionLabel}
          <Icon icon={ArrowLeft01Icon} size={16} directional={false} />
        </Link>
      )}
    </div>
  )
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-stroke', className)} />
}
