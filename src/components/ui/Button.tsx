import { motion, type HTMLMotionProps } from 'motion/react'
import { forwardRef, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { tap } from '../../lib/motion'
import { Icon, type IconSvgElement } from './Icon'
import { Spinner } from './Spinner'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'danger-soft' | 'success-soft' | 'inverse'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-bold transition-[background,color,border-color,box-shadow,opacity] duration-200 disabled:pointer-events-none'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-strong shadow-[0_8px_24px_-12px_var(--color-primary)]',
  secondary: 'bg-surface text-fg border border-stroke hover:border-stroke-strong hover:bg-surface-raised',
  outline: 'border border-primary text-primary hover:bg-primary-soft',
  ghost: 'text-fg-muted hover:text-fg hover:bg-white-soft',
  danger: 'border border-danger/60 text-danger hover:bg-danger-soft',
  'danger-soft': 'bg-danger-soft text-danger hover:bg-danger/20',
  'success-soft': 'bg-success-soft text-success hover:bg-success/20',
  inverse: 'bg-surface-sunken text-primary hover:bg-black',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-xs rounded-[10px]',
  md: 'h-11 px-5 text-sm rounded-[12px]',
  lg: 'h-14 px-6 text-base rounded-[14px]',
}

/*
 * Disabled state: the Figma «disabled» CTA is a dim pink (#7a4a70-ish) with
 * dark text — ~2.4:1 contrast and it looks like a loading state. Here a
 * disabled button keeps its shape but drops to a neutral surface with muted
 * text, so it's clearly "not yet" rather than "broken".
 */
const disabledCls = 'disabled:bg-surface-raised disabled:text-fg-subtle disabled:border-transparent disabled:shadow-none'

type CommonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  block?: boolean
  loading?: boolean
  iconStart?: IconSvgElement
  iconEnd?: IconSvgElement
  /** Mirror iconEnd/iconStart in RTL (arrows). */
  directionalIcon?: boolean
  children?: ReactNode
  className?: string
}

export type ButtonProps = CommonProps & Omit<HTMLMotionProps<'button'>, 'children'>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', block, loading, iconStart, iconEnd, directionalIcon, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  const iconSize = size === 'lg' ? 22 : size === 'sm' ? 16 : 20
  return (
    <motion.button
      ref={ref}
      type={type}
      whileTap={disabled || loading ? undefined : tap}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(base, variants[variant], sizes[size], disabledCls, block && 'w-full', className)}
      {...rest}
    >
      <span className={cn('inline-flex items-center gap-2', loading && 'invisible')}>
        {iconStart && <Icon icon={iconStart} size={iconSize} directional={directionalIcon} />}
        {children}
        {iconEnd && <Icon icon={iconEnd} size={iconSize} directional={directionalIcon} />}
      </span>
      {loading && (
        <span className="absolute inset-0 grid place-items-center">
          <Spinner size={iconSize} />
        </span>
      )}
    </motion.button>
  )
})

type ButtonLinkProps = CommonProps & LinkProps

/** Same visual API as Button, but navigates. Use for anything that changes the URL. */
export function ButtonLink({ variant = 'primary', size = 'md', block, iconStart, iconEnd, directionalIcon, className, children, ...rest }: ButtonLinkProps) {
  const iconSize = size === 'lg' ? 22 : size === 'sm' ? 16 : 20
  return (
    <Link className={cn(base, variants[variant], sizes[size], block && 'w-full', 'active:scale-[0.97]', className)} {...rest}>
      {iconStart && <Icon icon={iconStart} size={iconSize} directional={directionalIcon} />}
      {children}
      {iconEnd && <Icon icon={iconEnd} size={iconSize} directional={directionalIcon} />}
    </Link>
  )
}
