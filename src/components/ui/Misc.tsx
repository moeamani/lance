import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Search01Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'
import { cn } from '../../lib/cn'
import { listContainer, listItem } from '../../lib/motion'
import { Icon, type IconSvgElement } from './Icon'
import logo from '../../assets/brand/lance-logo.svg'

/* ───────────── Logo ───────────── */
export function Logo({ height = 32, className }: { height?: number; className?: string }) {
  return <img src={logo} alt="لنس" height={height} width={(81 / 32) * height} className={className} style={{ height, width: 'auto' }} />
}

/* ───────────── Skeleton ───────────── */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'block animate-pulse rounded-[10px] bg-gradient-to-l from-surface via-surface-raised to-surface bg-[length:200%_100%]',
        className,
      )}
    />
  )
}

/* ───────────── Empty state ───────────── */
export function EmptyState({ icon, title, description, action, className }: { icon: IconSvgElement; title: ReactNode; description?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center px-6 py-12 text-center', className)}
    >
      <div className="relative mb-5 grid size-20 place-items-center rounded-[24px] border border-stroke bg-surface text-primary">
        <div className="absolute inset-0 rounded-[24px] bg-dots bg-dots-fade opacity-60" />
        <Icon icon={icon} size={36} className="relative" />
      </div>
      <h3 className="text-lg font-extrabold">{title}</h3>
      {description && <p className="mt-2 max-w-[280px] text-sm leading-6 text-fg-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  )
}

/* ───────────── Accordion ───────────── */
export function Accordion({ items, className }: { items: { id: string; title: ReactNode; content: ReactNode; leading?: ReactNode }[]; className?: string }) {
  const [open, setOpen] = useState<string | null>(null)
  const base = useId()
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {items.map((it) => {
        const isOpen = open === it.id
        return (
          <div key={it.id} className={cn('rounded-[14px] border bg-surface transition-colors', isOpen ? 'border-stroke-strong' : 'border-stroke')}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${base}-${it.id}`}
                onClick={() => setOpen(isOpen ? null : it.id)}
                className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-start text-sm font-bold"
              >
                {it.leading}
                <span className="flex-1">{it.title}</span>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-fg-muted">
                  <Icon icon={ArrowDown01Icon} size={20} />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${base}-${it.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 text-sm leading-7 text-fg-muted">{it.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

/* ───────────── Carousel ─────────────
 * Fixes the biggest bug in the «Dashboard — Expanded» frames: horizontal
 * card rows were clipped mid-card with overlapping text. This uses native
 * scroll-snap, fixed card widths with a visible "peek" of the next card,
 * and page dots driven by scroll position.
 */
export function Carousel({ children, itemWidth = '78%', label, dots = true, className }: { children: ReactNode[]; itemWidth?: string; label: string; dots?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const first = el.firstElementChild as HTMLElement | null
      if (!first) return
      const w = first.offsetWidth + 12
      setActive(Math.round(Math.abs(el.scrollLeft) / w))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])
  const goTo = (i: number) => {
    const el = ref.current
    const child = el?.children[i] as HTMLElement | undefined
    child?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }
  return (
    <div className={className}>
      <div
        ref={ref}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1"
      >
        {children.map((c, i) => (
          <div key={i} className="shrink-0 snap-start" style={{ width: itemWidth }} aria-roledescription="slide" aria-label={`${i + 1} از ${children.length}`}>
            {c}
          </div>
        ))}
      </div>
      {dots && children.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {children.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`اسلاید ${i + 1}`}
              aria-current={active === i}
              className="grid h-6 place-items-center px-0.5"
            >
              <motion.span
                className="block h-1.5 rounded-full"
                animate={{ width: active === i ? 18 : 6, backgroundColor: active === i ? '#ff7fe3' : '#3d3d3d' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ───────────── List row (settings, menus) ───────────── */
export function ListRow({
  to,
  onClick,
  icon,
  title,
  subtitle,
  end,
  danger,
}: {
  to?: string
  onClick?: () => void
  icon?: IconSvgElement
  title: ReactNode
  subtitle?: ReactNode
  end?: ReactNode
  danger?: boolean
}) {
  const inner = (
    <>
      {icon && (
        <span className={cn('grid size-10 shrink-0 place-items-center rounded-[12px]', danger ? 'bg-danger-soft text-danger' : 'bg-primary-soft text-primary')}>
          <Icon icon={icon} size={20} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={cn('block text-sm font-bold', danger && 'text-danger')}>{title}</span>
        {subtitle && <span className="mt-0.5 block truncate text-xs text-fg-subtle">{subtitle}</span>}
      </span>
      {end ?? <Icon icon={ArrowLeft01Icon} size={18} className="text-fg-subtle" />}
    </>
  )
  const cls = 'flex min-h-16 w-full items-center gap-3 px-4 py-3 text-start transition-colors hover:bg-white-soft'
  if (to)
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    )
  // Rows whose `end` slot holds its own control (e.g. a Switch) must not be a button too.
  if (!onClick) return <div className={cls}>{inner}</div>
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}

export function ListGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('divide-y divide-stroke overflow-hidden rounded-[16px] border border-stroke bg-surface', className)}>{children}</div>
}

/* ───────────── Search ───────────── */
export function SearchField({ value, onChange, placeholder = 'جستجو', className, autoFocus }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string; autoFocus?: boolean }) {
  return (
    <label className={cn('relative block', className)}>
      <span className="sr-only">{placeholder}</span>
      <Icon icon={Search01Icon} size={20} className="pointer-events-none absolute inset-y-0 start-4 my-auto text-fg-subtle" />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-[12px] border border-stroke bg-surface ps-12 pe-4 text-sm outline-none placeholder:text-fg-subtle focus:border-primary focus:shadow-[0_0_0_4px_var(--color-primary-soft)]"
      />
    </label>
  )
}

/* ───────────── Radio card (choose path, plan) ───────────── */
export function RadioCard({
  selected,
  onSelect,
  title,
  description,
  icon,
  end,
  name,
}: {
  selected: boolean
  onSelect: () => void
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  end?: ReactNode
  name: string
}) {
  return (
    <motion.label
      whileTap={{ scale: 0.985 }}
      className={cn(
        'relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-[18px] border p-4 transition-colors',
        selected ? 'border-primary bg-primary-soft' : 'border-stroke bg-surface hover:border-stroke-strong',
      )}
    >
      <input type="radio" name={name} checked={selected} onChange={onSelect} className="sr-only" />
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block text-base font-extrabold">{title}</span>
        {description && <span className="mt-1 block text-xs leading-5 text-fg-muted">{description}</span>}
      </span>
      {end}
      <span
        aria-hidden
        className={cn('grid size-6 shrink-0 place-items-center rounded-full border-2 transition-colors', selected ? 'border-primary bg-primary text-on-primary' : 'border-stroke-strong')}
      >
        <AnimatePresence>{selected && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Icon icon={Tick02Icon} size={14} strokeWidth={3} /></motion.span>}</AnimatePresence>
      </span>
    </motion.label>
  )
}

/* ───────────── Switch ───────────── */
export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors', checked ? 'bg-primary' : 'bg-stroke-strong')}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 600, damping: 35 }}
        className={cn('absolute top-1 size-5 rounded-full bg-white shadow', checked ? 'start-6' : 'start-1')}
      />
    </button>
  )
}

/* ───────────── Escrow timeline ─────────────
 * «پرداخت کارفرما → در ضمانت لنس → آزادسازی برای لنسر». Research on
 * marketplaces (Upwork / Freelancer.com milestone escrow) shows making the
 * money's location explicit is the #1 trust lever, so this is a first-class
 * component reused on project financials, payments and the landing page.
 */
export function StepTimeline({ steps, current, className }: { steps: { label: string; icon: IconSvgElement }[]; current: number; className?: string }) {
  return (
    <ol className={cn('flex items-start', className)}>
      {steps.map((s, i) => {
        const done = i < current
        const now = i === current
        return (
          <li key={s.label} className="relative flex flex-1 flex-col items-center gap-2 text-center">
            {i < steps.length - 1 && (
              <span className="absolute start-1/2 top-5 h-0.5 w-full bg-stroke" aria-hidden>
                <motion.span
                  className="absolute inset-y-0 start-0 bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: done ? '100%' : '0%' }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                />
              </span>
            )}
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.15 }}
              className={cn(
                'relative z-10 grid size-10 place-items-center rounded-full border-2 bg-surface',
                done ? 'border-primary bg-primary text-on-primary' : now ? 'border-primary text-primary shadow-glow' : 'border-stroke-strong text-fg-subtle',
              )}
            >
              <Icon icon={done ? CheckmarkCircle02Icon : s.icon} size={20} />
            </motion.span>
            <span className={cn('px-1 text-[11px] leading-4', now ? 'font-bold text-fg' : 'text-fg-muted')}>{s.label}</span>
          </li>
        )
      })}
    </ol>
  )
}

/* ───────────── Stagger list wrapper ───────────── */
export function StaggerList({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'ul' }) {
  const C = as === 'ul' ? motion.ul : motion.div
  return (
    <C variants={listContainer} initial="hidden" animate="show" className={className}>
      {children}
    </C>
  )
}

export function StaggerItem({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' }) {
  const C = as === 'li' ? motion.li : motion.div
  return (
    <C variants={listItem} className={className}>
      {children}
    </C>
  )
}

/* ───────────── Key/value row (receipts, payments) ───────────── */
export function KeyValue({ k, v, className }: { k: ReactNode; v: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between gap-4 py-3 text-sm', className)}>
      <dt className="text-fg-muted">{k}</dt>
      <dd className="font-bold tabular">{v}</dd>
    </div>
  )
}

/* ───────────── Stat tile ───────────── */
export function StatTile({ icon, value, label, className }: { icon?: IconSvgElement; value: ReactNode; label: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2 rounded-[14px] border border-stroke bg-surface p-3', className)}>
      {icon && (
        <span className="grid size-8 place-items-center rounded-full bg-primary-soft text-primary">
          <Icon icon={icon} size={16} />
        </span>
      )}
      <span className="text-lg font-extrabold tabular">{value}</span>
      <span className="text-xs text-fg-muted">{label}</span>
    </div>
  )
}
