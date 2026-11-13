import { motion } from 'motion/react'
import { NavLink } from 'react-router-dom'
import { Home03Icon, Mail01Icon, Search01Icon, UserIcon } from '@hugeicons/core-free-icons'
import { cn } from '../../lib/cn'
import { spring } from '../../lib/motion'
import { useApp } from '../../store/AppStore'
import { CountBadge } from '../ui/Chip'
import { Icon } from '../ui/Icon'

const items = [
  { to: '/app', end: true, label: 'خانه', icon: Home03Icon },
  { to: '/app/discover', label: 'جستجو', icon: Search01Icon },
  { to: '/app/messages', label: 'پیام‌ها', icon: Mail01Icon },
  { to: '/app/profile', label: 'پروفایل', icon: UserIcon },
] as const

/**
 * Floating tab bar. Figma shows icon-only tabs; labels are added because
 * icon-only navigation tests measurably worse for discoverability (and
 * screen readers need names anyway). Active pill animates between tabs.
 */
export function BottomNav() {
  const { unreadMessages } = useApp()
  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      aria-label="ناوبری اصلی"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] px-5 pb-safe">
      <div className="pointer-events-auto flex h-16 items-stretch gap-1 rounded-[20px] border border-stroke bg-surface/90 p-1.5 shadow-[0_-8px_32px_-8px_#000] backdrop-blur-xl">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={'end' in it ? it.end : undefined}
            className={({ isActive }) =>
              cn('relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-[14px] text-[11px] font-bold transition-colors', isActive ? 'text-primary' : 'text-fg-subtle hover:text-fg-muted')
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <motion.span layoutId="bottom-nav-pill" transition={spring} className="absolute inset-0 rounded-[14px] bg-primary-soft" />}
                <span className="relative">
                  <Icon icon={it.icon} size={24} strokeWidth={isActive ? 2 : 1.5} />
                  {it.to === '/app/messages' && unreadMessages > 0 && <CountBadge count={unreadMessages} className="absolute -top-2 -end-3 scale-90" />}
                </span>
                <span className="relative">{it.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  )
}
