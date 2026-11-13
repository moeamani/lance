import { AnimatePresence, motion } from 'motion/react'
import { Suspense, useEffect, useRef } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { pageVariants } from '../../lib/motion'
import { BottomNav } from './BottomNav'
import { Skeleton } from '../ui/Misc'

/** Track navigation depth so transitions slide the right way (push vs pop). */
function useDirection(pathname: string) {
  const prev = useRef(pathname)
  const dir = useRef(1)
  if (prev.current !== pathname) {
    dir.current = pathname.split('/').length >= prev.current.split('/').length ? 1 : -1
    prev.current = pathname
  }
  return dir.current
}

function AnimatedOutlet() {
  const location = useLocation()
  const outlet = useOutlet()
  const dir = useDirection(location.pathname)
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])
  return (
    <AnimatePresence mode="wait" custom={dir} initial={false}>
      <motion.div
        key={location.pathname}
        custom={dir}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex min-h-dvh flex-col"
      >
        <Suspense fallback={<RouteFallback />}>{outlet}</Suspense>
      </motion.div>
    </AnimatePresence>
  )
}

function RouteFallback() {
  return (
    <div className="flex flex-col gap-3 px-5 pt-6" aria-busy="true" aria-label="در حال بارگذاری">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  )
}

/** Mobile-first column. On desktop it's centered with a subtle frame. */
export function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#080808] lg:bg-[radial-gradient(60%_50%_at_50%_0%,#ff7fe30f,transparent)]">
      <div className="relative mx-auto min-h-dvh max-w-[480px] bg-bg lg:border-x lg:border-stroke/50">{children}</div>
    </div>
  )
}

/**
 * As in the Figma flows, the tab bar only shows on the four tab roots; pushed
 * detail screens (project, chat, settings…) own the bottom edge for their CTA.
 */
const TAB_ROOTS = ['/app', '/app/discover', '/app/messages', '/app/profile']

export function AppShell() {
  const { pathname } = useLocation()
  const hideNav = !TAB_ROOTS.includes(pathname.replace(/\/$/, '') || '/app')
  return (
    <MobileFrame>
      <AnimatedOutlet />
      <AnimatePresence>
        {!hideNav && <BottomNav key="nav" />}
      </AnimatePresence>
    </MobileFrame>
  )
}

export function PlainShell() {
  return (
    <MobileFrame>
      <AnimatedOutlet />
    </MobileFrame>
  )
}
