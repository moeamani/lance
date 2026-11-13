import { motion, useScroll, useTransform } from 'motion/react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight01Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { cn } from '../../lib/cn'
import { IconButton } from '../ui/IconButton'

type Props = {
  title?: ReactNode
  subtitle?: ReactNode
  /** "back" = chevron (history), "close" = ✕ (modal flows like onboarding), false = none */
  leading?: 'back' | 'close' | false
  onLeading?: () => void
  /** Fallback route when there's no history (deep link). */
  backTo?: string
  actions?: ReactNode
  className?: string
  transparent?: boolean
}

/**
 * Sticky header. In RTL the back chevron sits on the right (start) and points
 * right; title follows; actions on the left (end). A hairline + blur fade in
 * once content scrolls under it (Figma has a permanent divider instead).
 */
export function AppHeader({ title, subtitle, leading = 'back', onLeading, backTo = '/app', actions, className, transparent }: Props) {
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  const border = useTransform(scrollY, [0, 24], ['rgba(48,48,48,0)', 'rgba(48,48,48,1)'])
  const bg = useTransform(scrollY, [0, 24], ['rgba(13,13,13,0)', 'rgba(13,13,13,0.82)'])

  const goBack = () => {
    if (onLeading) return onLeading()
    if (window.history.state?.idx > 0) navigate(-1)
    else navigate(backTo)
  }

  return (
    <motion.header
      style={transparent ? undefined : { borderColor: border, backgroundColor: bg }}
      className={cn('sticky top-0 z-30 border-b border-transparent backdrop-blur-md', className)}
    >
      <div className="flex h-[72px] items-center gap-3 px-5">
        {/* Back sits at the start (right in RTL); close ✕ sits at the end, as in the Figma modal flows. */}
        {leading === 'back' && <IconButton icon={ArrowRight01Icon} label="بازگشت" onClick={goBack} />}
        <div className="min-w-0 flex-1">
          {title && <h1 className="truncate text-2xl font-extrabold leading-8">{title}</h1>}
          {subtitle && <p className="truncate text-xs text-fg-muted">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        {leading === 'close' && <IconButton icon={Cancel01Icon} label="بستن" onClick={goBack} />}
      </div>
    </motion.header>
  )
}
