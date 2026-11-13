import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Bookmark02Icon, BookmarkCheck02Icon, Clock01Icon, Location01Icon } from '@hugeicons/core-free-icons'
import type { Lancer, Project } from '../../data/mock'
import { cn } from '../../lib/cn'
import { formatDays, formatNumber, formatRelative, formatToman } from '../../lib/format'
import { useApp } from '../../store/AppStore'
import { Avatar } from '../ui/Avatar'
import { ButtonLink } from '../ui/Button'
import { Tag } from '../ui/Chip'
import { Icon } from '../ui/Icon'
import { RatingBadge } from '../ui/StarRating'
import { useToast } from '../ui/Toast'

/** Bookmark toggle with optimistic toast + undo (Figma had separate saved/removed toast frames). */
export function BookmarkButton({ id, kind, className }: { id: string; kind: 'project' | 'lancer'; className?: string }) {
  const { isBookmarked, toggleBookmark } = useApp()
  const toast = useToast()
  const on = isBookmarked(id)
  const noun = kind === 'project' ? 'پروژه' : 'پروفایل لنسر'
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      aria-pressed={on}
      aria-label={on ? `حذف ${noun} از ذخیره‌ها` : `ذخیره ${noun}`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        const added = toggleBookmark(id)
        toast.show(added ? `${noun} با موفقیت ذخیره شد!` : `${noun} از ذخیره‌ها حذف شد!`, {
          tone: added ? 'success' : 'info',
          action: { label: 'بازگردانی', onClick: () => toggleBookmark(id) },
        })
      }}
      className={cn('grid size-11 shrink-0 place-items-center rounded-[12px] transition-colors', on ? 'bg-primary-soft text-primary' : 'text-fg-muted hover:bg-white-soft hover:text-fg', className)}
    >
      <motion.span key={String(on)} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
        <Icon icon={on ? BookmarkCheck02Icon : Bookmark02Icon} size={22} />
      </motion.span>
    </motion.button>
  )
}

export function ProjectCard({ p }: { p: Project }) {
  const { sentProposals } = useApp()
  const sent = sentProposals.includes(p.id)
  return (
    <article className="relative rounded-[16px] border border-stroke bg-surface p-4 transition-colors hover:border-stroke-strong">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-extrabold leading-7">
              <Link to={`/app/discover/${p.id}`} className="after:absolute after:inset-0 after:rounded-[16px]">
                {p.title}
              </Link>
            </h3>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-fg-subtle">
            <span className="inline-flex items-center gap-1">
              <Icon icon={Clock01Icon} size={14} />
              {formatRelative(p.postedAt)}
            </span>
            <span>·</span>
            <span>{formatNumber(p.proposals)} پیشنهاد</span>
            {p.urgent && <Tag tone="danger">فوری</Tag>}
            {sent && <Tag tone="success">پیشنهاد داده‌اید</Tag>}
          </div>
        </div>
        <BookmarkButton id={p.id} kind="project" className="relative z-10 -me-2 -mt-2" />
      </div>
      <p className="mt-3 line-clamp-2 text-[13px] leading-6 text-fg-muted">{p.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.skills.slice(0, 3).map((s) => (
          <Tag key={s} tone="neutral">
            {s}
          </Tag>
        ))}
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-stroke pt-3 text-xs">
        <div>
          <dt className="text-fg-subtle">بودجه پیشنهادی</dt>
          <dd className="mt-1 font-bold text-primary tabular">{formatToman(p.budget, { compact: true })}</dd>
        </div>
        <div>
          <dt className="text-fg-subtle">زمان پیشنهادی</dt>
          <dd className="mt-1 font-bold">{formatDays(p.days)}</dd>
        </div>
        <div>
          <dt className="text-fg-subtle">امتیاز کارفرما</dt>
          <dd className="mt-1">
            <RatingBadge value={p.employerRating} className="text-xs" />
          </dd>
        </div>
      </dl>
    </article>
  )
}

export function LancerCard({ l, compact }: { l: Lancer; compact?: boolean }) {
  return (
    <article className="relative rounded-[16px] border border-stroke bg-surface p-4 transition-colors hover:border-stroke-strong">
      <div className="flex items-center gap-3">
        <Avatar name={l.name} src={l.avatar} size={52} online={l.online} />
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1.5 text-base font-extrabold">
            <Link to={`/app/lancer/${l.id}`} className="truncate after:absolute after:inset-0 after:rounded-[16px]">
              {l.name}
            </Link>
            {l.verified && <span className="text-primary" title="تأیید شده">✓</span>}
          </h3>
          <p className="text-xs text-fg-muted">{l.title}</p>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-fg-subtle">
            <Icon icon={Location01Icon} size={12} />
            {l.city}
          </p>
        </div>
        <BookmarkButton id={l.id} kind="lancer" className="relative z-10" />
      </div>
      {!compact && <p className="mt-3 line-clamp-2 text-[13px] leading-6 text-fg-muted">{l.bio}</p>}
      <div className="mt-4 flex items-center justify-between border-t border-stroke pt-3">
        <div className="flex items-center gap-4 text-xs">
          <RatingBadge value={l.rating} label={`(${formatNumber(l.reviews)})`} />
          <span className="text-fg-subtle">{formatNumber(l.projects)} پروژه</span>
        </div>
        <ButtonLink to={`/app/lancer/${l.id}`} size="sm" className="relative z-10">
          مشاهده پروفایل
        </ButtonLink>
      </div>
    </article>
  )
}
