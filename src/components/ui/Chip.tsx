import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { cn } from '../../lib/cn'
import { Icon, type IconSvgElement } from './Icon'

export type Tone = 'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info'

const toneCls: Record<Tone, string> = {
  primary: 'bg-primary-soft text-primary',
  neutral: 'bg-white-soft text-fg-muted',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
}

/** Small static label — skills, levels, categories («طراح رابط کاربری»). */
export function Tag({ children, tone = 'primary', icon, className }: { children: ReactNode; tone?: Tone; icon?: IconSvgElement; className?: string }) {
  return (
    <span className={cn('inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-xs font-semibold whitespace-nowrap', toneCls[tone], className)}>
      {icon && <Icon icon={icon} size={14} />}
      {children}
    </span>
  )
}

/** Dot + label status: «آنلاین», «فعال», «تراکنش موفق». */
export function StatusPill({ children, tone = 'primary', pulse, className }: { children: ReactNode; tone?: Tone; pulse?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold whitespace-nowrap', toneCls[tone], className)}>
      <span className="relative flex size-2">
        {pulse && <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-60" />}
        <span className="relative size-2 rounded-full bg-current" />
      </span>
      {children}
    </span>
  )
}

/** Interactive chip — filters (toggle) or removable selections. 44px hit area via padding. */
export function Chip({
  children,
  selected,
  onClick,
  onRemove,
  icon,
  className,
}: {
  children: ReactNode
  selected?: boolean
  onClick?: () => void
  onRemove?: () => void
  icon?: IconSvgElement
  className?: string
}) {
  const body = (
    <>
      {icon && <Icon icon={icon} size={16} />}
      <span>{children}</span>
    </>
  )
  if (onRemove) {
    return (
      <motion.span
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={cn('inline-flex h-9 items-center gap-1 rounded-[10px] border border-primary/30 bg-primary-soft ps-3 pe-1 text-xs font-semibold text-primary', className)}
      >
        {body}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`حذف ${typeof children === 'string' ? children : ''}`}
          className="grid size-7 place-items-center rounded-[8px] hover:bg-primary/20"
        >
          <Icon icon={Cancel01Icon} size={14} />
        </button>
      </motion.span>
    )
  }
  return (
    <motion.button
      type="button"
      layout
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'inline-flex h-9 items-center gap-1.5 rounded-[10px] border px-3 text-xs font-semibold whitespace-nowrap transition-colors',
        selected ? 'border-primary bg-primary-soft text-primary' : 'border-stroke bg-surface text-fg-muted hover:text-fg',
        className,
      )}
    >
      {body}
    </motion.button>
  )
}

export function CountBadge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null
  return (
    <span className={cn('inline-grid min-w-5 h-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-extrabold text-on-primary tabular', className)}>
      {new Intl.NumberFormat('fa-IR').format(count > 99 ? 99 : count)}
      {count > 99 ? '+' : ''}
    </span>
  )
}
