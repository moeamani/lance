import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { cn } from '../../lib/cn'

export type { IconSvgElement }

type Props = {
  icon: IconSvgElement
  size?: number
  strokeWidth?: number
  className?: string
  /** Mirror in RTL — only for icons that imply direction (arrows, chevrons, send). */
  directional?: boolean
  /** Give a label only when the icon carries meaning on its own. */
  label?: string
}

/**
 * The Figma file uses the Hugeicons set («arrow right - 01», «folder - 03» …),
 * so this wraps the official package instead of exporting hundreds of SVGs.
 */
export function Icon({ icon, size = 24, strokeWidth = 1.5, className, directional, label }: Props) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={strokeWidth}
      className={cn('shrink-0', directional && 'flip-rtl', className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
    />
  )
}
