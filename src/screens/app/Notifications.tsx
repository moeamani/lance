import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Folder03Icon, Mail01Icon, Notification03Icon, Wallet01Icon } from '@hugeicons/core-free-icons'
import { AppHeader } from '../../components/layout/AppHeader'
import { Screen } from '../../components/layout/Screen'
import { EmptyState, Icon, SegmentedControl, Tag } from '../../components/ui'
import type { Notification } from '../../data/mock'
import { cn } from '../../lib/cn'
import { formatRelative } from '../../lib/format'
import { useApp } from '../../store/AppStore'

type Filter = 'all' | Notification['kind']
const icons = { project: Folder03Icon, payment: Wallet01Icon, message: Mail01Icon }

/**
 * «Notification Center» (All / Projects / Payments / Messages — 4 frames in
 * Figma). Unread state uses a dot + bolder title instead of the edge bar,
 * «مهم» is only shown when it actually is, and items group by day.
 */
export function Notifications() {
  const { notifications, markNotificationsRead } = useApp()
  const [filter, setFilter] = useState<Filter>('all')
  const [snapshot] = useState(() => new Set(notifications.filter((n) => !n.read).map((n) => n.id)))

  // Mark as read when leaving, so the unread styling is visible on this visit.
  useEffect(() => () => markNotificationsRead(), [markNotificationsRead])

  const count = (k: Filter) => notifications.filter((n) => (k === 'all' || n.kind === k) && snapshot.has(n.id)).length
  const list = notifications.filter((n) => filter === 'all' || n.kind === filter)
  const today = list.filter((n) => Date.now() - +new Date(n.at) < 86400000)
  const earlier = list.filter((n) => Date.now() - +new Date(n.at) >= 86400000)

  const renderItem = (n: Notification, i: number) => {
    const unread = snapshot.has(n.id)
    return (
      <motion.li key={n.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }} exit={{ opacity: 0 }}>
        <Link
          to={n.to ?? '#'}
          className={cn('flex gap-3 rounded-[16px] border p-4 transition-colors', unread ? 'border-primary/25 bg-[linear-gradient(270deg,#ff7fe30f,transparent_60%)]' : 'border-stroke bg-surface hover:border-stroke-strong')}
        >
          <span className={cn('relative grid size-12 shrink-0 place-items-center rounded-full', unread ? 'bg-primary-soft text-primary' : 'bg-white-soft text-fg-muted')}>
            <Icon icon={icons[n.kind]} size={22} />
            {unread && <span className="absolute -top-0.5 -end-0.5 size-3 rounded-full border-2 border-bg bg-primary" aria-label="خوانده نشده" />}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className={cn('truncate text-sm', unread ? 'font-extrabold' : 'font-bold text-fg-muted')}>{n.title}</p>
              {n.important && <Tag tone="danger">مهم</Tag>}
              <span className="ms-auto shrink-0 text-[11px] text-fg-subtle">{formatRelative(n.at)}</span>
            </div>
            <p className="mt-1 text-xs leading-5 text-fg-muted">{n.body}</p>
          </div>
        </Link>
      </motion.li>
    )
  }

  return (
    <>
      <AppHeader title="اعلان‌ها" />
      <Screen title="اعلان‌ها">
        <SegmentedControl
          variant="pills"
          label="دسته اعلان‌ها"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'همه', count: count('all') },
            { value: 'project', label: 'پروژه‌ها', count: count('project') },
            { value: 'payment', label: 'پرداخت‌ها', count: count('payment') },
            { value: 'message', label: 'پیام‌ها', count: count('message') },
          ]}
        />
        <div className="mt-5 flex flex-col gap-6">
          {list.length === 0 && <EmptyState icon={Notification03Icon} title="اعلانی نداری" description="وقتی پیام، پرداخت یا خبری از پروژه‌هات برسه، اینجا می‌بینی." />}
          {today.length > 0 && (
            <section>
              <h2 className="mb-3 text-xs font-bold text-fg-subtle">امروز</h2>
              <ul className="flex flex-col gap-3">
                <AnimatePresence>{today.map(renderItem)}</AnimatePresence>
              </ul>
            </section>
          )}
          {earlier.length > 0 && (
            <section>
              <h2 className="mb-3 text-xs font-bold text-fg-subtle">قبل‌تر</h2>
              <ul className="flex flex-col gap-3">
                <AnimatePresence>{earlier.map(renderItem)}</AnimatePresence>
              </ul>
            </section>
          )}
        </div>
      </Screen>
    </>
  )
}
