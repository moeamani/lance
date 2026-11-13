import { motion } from 'motion/react'
import { useEffect, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

/**
 * Page body with consistent 20px gutters (Figma: 20px content inset on a
 * 393 frame). `footer` docks a CTA above the safe area — onboarding/create
 * screens in Figma float the CTA at a fixed y; here it's sticky so it never
 * covers content on short phones.
 */
export function Screen({ children, className, footer, title, withNav }: { children: ReactNode; className?: string; footer?: ReactNode; title?: string; withNav?: boolean }) {
  useEffect(() => {
    if (title) document.title = `${title} | لنس`
  }, [title])
  return (
    <>
      <main className={cn('flex-1 px-5 pt-2', withNav ? 'pb-32' : footer ? 'pb-6' : 'pb-10', className)}>{children}</main>
      {footer && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="sticky bottom-0 z-20 bg-gradient-to-t from-bg via-bg/95 to-transparent px-5 pt-6 pb-safe"
        >
          {footer}
        </motion.div>
      )}
    </>
  )
}
