import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Cancel01Icon, Sorting05Icon, Tick02Icon, UserSearch01Icon, Wallet01Icon } from '@hugeicons/core-free-icons'
import { AppHeader } from '../../components/layout/AppHeader'
import { Screen } from '../../components/layout/Screen'
import { Avatar, Button, ButtonLink, Dialog, EmptyState, Icon, RatingBadge, Tag, useToast } from '../../components/ui'
import { requests as seed } from '../../data/mock'
import { formatDays, formatNumber, formatToman } from '../../lib/format'

type Req = (typeof seed)[number]

/**
 * «38/39 · Freelancers Requests». Figma uses icon-only 👍/👎 buttons, which
 * read as "like/dislike" rather than accept/reject and have no accessible
 * name. Here they're labelled, reject has undo, and accept explains escrow
 * before taking money.
 */
export function FreelancerRequests() {
  const navigate = useNavigate()
  const toast = useToast()
  const [list, setList] = useState<Req[]>(seed)
  const [sortBy, setSortBy] = useState<'rating' | 'price'>('rating')
  const [accepting, setAccepting] = useState<Req | null>(null)

  const sorted = [...list].sort((a, b) => (sortBy === 'rating' ? b.rating - a.rating : a.proposal - b.proposal))

  const reject = (r: Req) => {
    setList((l) => l.filter((x) => x.id !== r.id))
    toast.show(`درخواست ${r.name} رد شد.`, { tone: 'info', action: { label: 'بازگردانی', onClick: () => setList((l) => [...l, r]) } })
  }

  return (
    <>
      <AppHeader title="درخواست‌ها" subtitle="ادیت ویدیو ریل" backTo="/app/projects" />
      <Screen title="درخواست‌ها">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-bold">{formatNumber(list.length)} پیشنهاد</p>
          <button
            type="button"
            onClick={() => setSortBy(sortBy === 'rating' ? 'price' : 'rating')}
            className="inline-flex h-10 items-center gap-1.5 rounded-[10px] px-2 text-xs text-fg-muted hover:bg-white-soft hover:text-fg"
          >
            <Icon icon={Sorting05Icon} size={18} />
            ترتیب: {sortBy === 'rating' ? 'بیشترین امتیاز' : 'کمترین قیمت'}
          </button>
        </div>
        <motion.ul layout className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {sorted.map((r) => (
              <motion.li key={r.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 80, transition: { duration: 0.2 } }}>
                <article className="rounded-[18px] border border-stroke bg-surface p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={r.name} src={r.avatar} size={52} online={r.online} verified={r.verified} />
                    <div className="min-w-0 flex-1">
                      <Link to={`/app/lancer/${r.id}`} className="block truncate text-base font-extrabold hover:text-primary">
                        {r.name}
                      </Link>
                      <p className="text-xs text-fg-muted">{r.title}</p>
                    </div>
                    <RatingBadge value={r.rating} label="امتیاز" />
                  </div>
                  <p className="mt-3 line-clamp-2 text-[13px] leading-6 text-fg-muted">{r.bio}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-[10px] bg-surface-sunken p-2.5">
                      <p className="text-fg-subtle">قیمت پیشنهادی</p>
                      <p className="mt-1 font-bold text-primary tabular">{formatToman(r.proposal)}</p>
                    </div>
                    <div className="rounded-[10px] bg-surface-sunken p-2.5">
                      <p className="text-fg-subtle">زمان تحویل</p>
                      <p className="mt-1 font-bold">{formatDays(r.days)}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {r.skills.map((s) => (
                      <Tag key={s.name} tone="neutral">
                        {s.name}
                      </Tag>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-[1fr_1fr] gap-2">
                    <Button variant="danger-soft" iconStart={Cancel01Icon} onClick={() => reject(r)}>
                      رد
                    </Button>
                    <Button variant="success-soft" iconStart={Tick02Icon} onClick={() => setAccepting(r)}>
                      پذیرش
                    </Button>
                  </div>
                  <ButtonLink to={`/app/lancer/${r.id}?tab=portfolio`} variant="secondary" block className="mt-2">
                    مشاهده نمونه کارها
                  </ButtonLink>
                </article>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        {list.length === 0 && <EmptyState icon={UserSearch01Icon} title="درخواستی باقی نمانده" description="به‌محض رسیدن پیشنهاد جدید بهت خبر می‌دیم." />}
      </Screen>

      <Dialog
        open={!!accepting}
        onClose={() => setAccepting(null)}
        icon={
          <span className="grid size-14 place-items-center rounded-full bg-primary-soft text-primary">
            <Icon icon={Wallet01Icon} size={28} />
          </span>
        }
        title={`همکاری با ${accepting?.name ?? ''}`}
        description={accepting ? `برای شروع، ${formatToman(accepting.proposal)} پرداخت می‌کنید که تا تأیید تحویل نهایی در ضمانت لنس می‌ماند و بعد برای لنسر آزاد می‌شود.` : ''}
        actions={
          <>
            <Button variant="secondary" className="flex-1" onClick={() => setAccepting(null)}>
              انصراف
            </Button>
            <Button className="flex-1" onClick={() => navigate('/app/payment/success?for=escrow')}>
              پرداخت و شروع
            </Button>
          </>
        }
      />
    </>
  )
}
