import { motion, type HTMLMotionProps } from 'motion/react'
import { forwardRef } from 'react'
import { cn } from '../../lib/cn'
import { tap } from '../../lib/motion'
import { Icon, type IconSvgElement } from './Icon'

type Props = Omit<HTMLMotionProps<'button'>, 'children'> & {
  icon: IconSvgElement
  /** Required: icon-only buttons need an accessible name. */
  label: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'surface' | 'ghost' | 'primary' | 'soft' | 'danger-soft' | 'success-soft'
  directional?: boolean
  /** Small dot (e.g. unread notifications). */
  dot?: boolean
  active?: boolean
}

const sizes = { sm: 'size-9 rounded-[10px]', md: 'size-10 rounded-[12px]', lg: 'size-12 rounded-[14px]' }
const iconSizes = { sm: 18, md: 22, lg: 24 }
const variants = {
  surface: 'bg-surface text-fg border border-stroke hover:border-stroke-strong',
  ghost: 'text-fg-muted hover:bg-white-soft hover:text-fg',
  primary: 'bg-primary text-on-primary',
  soft: 'bg-primary-soft text-primary',
  'danger-soft': 'bg-danger-soft text-danger',
  'success-soft': 'bg-success-soft text-success',
}

export const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { icon, label, size = 'md', variant = 'surface', directional, dot, active, className, type = 'button', ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      aria-pressed={active}
      whileTap={tap}
      className={cn(
        'relative inline-grid shrink-0 place-items-center transition-colors disabled:opacity-40',
        sizes[size],
        variants[variant],
        active && 'text-primary border-primary/40',
        className,
      )}
      {...rest}
    >
      <Icon icon={icon} size={iconSizes[size]} directional={directional} />
      {dot && <span className="absolute end-2 top-2 size-2 rounded-full bg-primary ring-2 ring-surface" aria-hidden />}
    </motion.button>
  )
})
