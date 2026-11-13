import type { Transition, Variants } from 'motion/react'

/** Shared motion language — every animation in the app pulls from here. */
export const spring: Transition = { type: 'spring', stiffness: 420, damping: 34, mass: 0.8 }
export const springSoft: Transition = { type: 'spring', stiffness: 260, damping: 30 }
export const easeOut: Transition = { duration: 0.32, ease: [0.16, 1, 0.3, 1] }

/** Page transition: RTL-aware — new screens slide in from the left (reading direction). */
export const pageVariants: Variants = {
  initial: (dir: number) => ({ opacity: 0, x: dir >= 0 ? -24 : 24 }),
  animate: { opacity: 1, x: 0, transition: easeOut },
  exit: (dir: number) => ({ opacity: 0, x: dir >= 0 ? 24 : -24, transition: { duration: 0.18 } }),
}

export const listContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
}

export const listItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: easeOut },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: easeOut },
}

export const tap = { scale: 0.97 }
