import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Add01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Delete02Icon,
  Folder03Icon,
  Invoice01Icon,
  Loading03Icon,
  Money03Icon,
  SecurityCheckIcon,
  UserSearch01Icon,
  Wallet01Icon,
} from '@hugeicons/core-free-icons'
import { AppHeader } from '../../components/layout/AppHeader'
import { Screen } from '../../components/layout/Screen'
import {
  Avatar,
  Button,
  ButtonLink,
  Card,
  Dialog,
  EmptyState,
  Icon,
  ProgressRing,
  SegmentedControl,
  StaggerItem,
  StaggerList,
  StepTimeline,
  Tag,
  useToast,
} from '../../components/ui'
import type { ActiveProject, TaskItem } from '../../data/mock'
import { cn } from '../../lib/cn'
import { formatDate, formatDayMonth, formatNumber, formatPercent, formatRelative, formatToman, toFaDigits } from '../../lib/format'
import { useApp } from '../../store/AppStore'

/* ───────────────────────── My projects ───────────────────────── */

function ProjectRow({ p }: { p: ActiveProject }) {
  return (
    <Card className="flex flex-col gap-4 bg-[radial-gradient(100%_100%_at_100%_0%,#ff7fe312,transparent_60%)]">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-extrabold leading-8">{p.title}</h3>
          <p className="text-xs text-fg-subtle">{p.category}</p>
        </div>
        <ProgressRing value={p.progress} size={56} />
      </div>
      <div className="flex items-center justify-between gap-3">
        {p.status === 'searching' ? (
          <span className="flex items-center gap-2 text-sm text-warning">
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
              <Icon icon={Loading03Icon} size={20} />
            </motion.span>
            به دنبال لنسر
          </span>
        ) : (
          <span className="flex items-center gap-2 text-sm font-bold">
            <Avatar name={p.counterpart} size={30} />
            {p.counterpart}
          </span>
        )}
        {p.status === 'searching' ? (
          <ButtonLink to={`/app/projects/${p.id}/requests`} size="sm">
            مشاهده درخواست‌ها
          </ButtonLink>
        ) : (
          <ButtonLink to={`/app/projects/${p.id}`} size="sm">
            مشاهده جزئیات
          </ButtonLink>
        )}
      </div>
    </Card>
  )
}

export function MyProjects() {
  const { projects } = useApp()
  const [tab, setTab] = useState<'current' | 'history'>('current')
  const list = projects.filter((p) => (tab === 'current' ? p.status !== 'done' : p.status === 'done'))
  return (
    <>
      <AppHeader title="پروژه‌های من" actions={<ButtonLink to="/projects/new" size="sm" iconStart={Add01Icon}>جدید</ButtonLink>} />
      <Screen title="پروژه‌های من">
        <SegmentedControl
          label="وضعیت پروژه‌ها"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'current', label: 'پروژه‌های جاری' },
            { value: 'history', label: 'تاریخچه پروژه‌ها' },
          ]}
        />
        <StaggerList key={tab} className="mt-4 flex flex-col gap-3">
          {list.map((p) => (
            <StaggerItem key={p.id}>
              <ProjectRow p={p} />
            </StaggerItem>
          ))}
        </StaggerList>
        {list.length === 0 && (
          <EmptyState
            icon={Folder03Icon}
            title={tab === 'current' ? 'پروژه جاری نداری' : 'هنوز پروژه‌ای تمام نشده'}
            description="پروژه‌هایی که شروع کنی اینجا با پیشرفت و ددلاین‌شون نمایش داده می‌شن."
            action={<ButtonLink to="/app/discover">پیدا کردن پروژه</ButtonLink>}
          />
        )}
      </Screen>
    </>
  )
}

/* ───────────────────────── Workspace ───────────────────────── */

function TaskList({ p }: { p: ActiveProject }) {
  const { updateProject } = useApp()
  const toast = useToast()
  const [draft, setDraft] = useState('')
  const [adding, setAdding] = useState(false)

  const setTasks = (fn: (t: TaskItem[]) => TaskItem[]) =>
    updateProject(p.id, (x) => {
      const tasks = fn(x.tasks)
      const progress = tasks.length ? Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100) : 0
      return { ...x, tasks, progress }
    })

  const add = () => {
    const title = draft.trim()
    if (!title) return
    setTasks((t) => [...t, { id: `t${Date.now()}`, title, done: false }])
    setDraft('')
  }

  if (!p.tasks.length && !adding) {
    return (
      <EmptyState
        icon={CheckmarkCircle02Icon}
        title="هنوز تسکی تعریف نشده"
        description="کار رو به تسک‌های کوچیک بشکن یا از قالب‌های آماده استفاده کن."
        action={
          <div className="flex gap-2">
            <Button iconStart={Add01Icon} onClick={() => setAdding(true)}>
              تسک جدید
            </Button>
            <ButtonLink to="/app/templates" variant="secondary">
              قالب‌ها
            </ButtonLink>
          </div>
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {p.tasks.map((t) => (
            <motion.li key={t.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}>
              <div className={cn('group flex min-h-14 items-center gap-3 rounded-[14px] border px-4 py-3 transition-colors', t.done ? 'border-stroke/60 bg-surface/60' : 'border-stroke bg-surface')}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={t.done}
                  aria-label={t.title}
                  onClick={() => setTasks((all) => all.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
                  className={cn('grid size-6 shrink-0 place-items-center rounded-full border-2 transition-colors', t.done ? 'border-success bg-success text-on-primary' : 'border-stroke-strong hover:border-primary')}
                >
                  <AnimatePresence>
                    {t.done && (
                      <motion.svg initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} exit={{ opacity: 0 }} viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={3}>
                        <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25 }} />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </button>
                <div className="min-w-0 flex-1">
                  <p className={cn('text-sm transition-colors', t.done ? 'text-fg-subtle line-through' : 'font-bold')}>{t.title}</p>
                  {t.due && !t.done && <p className="mt-0.5 text-[11px] text-warning">سررسید {formatRelative(t.due)}</p>}
                </div>
                <button
                  type="button"
                  aria-label={`حذف ${t.title}`}
                  onClick={() => {
                    const removed = t
                    setTasks((all) => all.filter((x) => x.id !== t.id))
                    toast.show('تسک حذف شد.', { tone: 'info', action: { label: 'بازگردانی', onClick: () => setTasks((all) => [...all, removed]) } })
                  }}
                  className="grid size-9 place-items-center rounded-[10px] text-fg-subtle opacity-60 transition hover:bg-danger-soft hover:text-danger group-hover:opacity-100"
                >
                  <Icon icon={Delete02Icon} size={18} />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          add()
        }}
        className="flex items-center gap-2 rounded-[14px] border border-dashed border-stroke-strong bg-surface-sunken ps-4 pe-2 focus-within:border-primary"
      >
        <label htmlFor="new-task" className="sr-only">
          نوشتن تسک جدید
        </label>
        <input id="new-task" value={draft} onChange={(e) => setDraft(e.target.value)} autoFocus={adding} placeholder="نوشتن تسک جدید…" className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-fg-subtle" />
        <button type="submit" disabled={!draft.trim()} aria-label="افزودن تسک" className="grid size-10 place-items-center rounded-[10px] bg-primary text-on-primary transition-opacity disabled:opacity-30">
          <Icon icon={Add01Icon} size={20} />
        </button>
      </form>
    </div>
  )
}

const weekday = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { weekday: 'short' })
const dayNum = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric' })

function CalendarTab({ p }: { p: ActiveProject }) {
  const days = useMemo(() => Array.from({ length: 21 }, (_, i) => new Date(Date.now() + i * 86400000)), [])
  const [sel, setSel] = useState(0)
  const key = (d: Date) => d.toDateString()
  const dueMap = new Map<string, TaskItem[]>()
  p.tasks.forEach((t) => t.due && dueMap.set(key(new Date(t.due)), [...(dueMap.get(key(new Date(t.due))) ?? []), t]))
  const deadlineKey = key(new Date(p.deadline))
  const selected = days[sel]
  const items = dueMap.get(key(selected)) ?? []

  return (
    <div>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2" role="listbox" aria-label="روزها">
        {days.map((d, i) => {
          const has = dueMap.has(key(d))
          const isDeadline = key(d) === deadlineKey
          return (
            <button
              key={i}
              type="button"
              role="option"
              aria-selected={sel === i}
              onClick={() => setSel(i)}
              className={cn('relative flex h-20 w-14 shrink-0 flex-col items-center justify-center gap-1 rounded-[14px] border text-xs transition-colors', sel === i ? 'border-primary bg-primary-soft text-primary' : 'border-stroke bg-surface text-fg-muted')}
            >
              <span>{weekday.format(d)}</span>
              <span className="text-lg font-extrabold text-fg">{dayNum.format(d)}</span>
              {(has || isDeadline) && <span className={cn('size-1.5 rounded-full', isDeadline ? 'bg-danger' : 'bg-primary')} />}
            </button>
          )
        })}
      </div>
      <h3 className="mt-5 mb-3 text-sm font-bold">{formatDayMonth(selected)}</h3>
      {key(selected) === deadlineKey && (
        <div className="mb-3 flex items-center gap-2 rounded-[12px] border border-danger/30 bg-danger-soft p-3 text-sm text-danger">
          <Icon icon={Calendar03Icon} size={18} /> ددلاین تحویل نهایی پروژه
        </div>
      )}
      {items.length ? (
        <ul className="flex flex-col gap-2">
          {items.map((t) => (
            <li key={t.id} className="flex items-center gap-3 rounded-[12px] border border-stroke bg-surface p-3 text-sm">
              <span className={cn('size-2 rounded-full', t.done ? 'bg-success' : 'bg-primary')} />
              <span className={t.done ? 'text-fg-subtle line-through' : 'font-bold'}>{t.title}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-[12px] border border-dashed border-stroke p-6 text-center text-sm text-fg-subtle">برای این روز تسکی ثبت نشده.</p>
      )}
    </div>
  )
}

function FinancialTab({ p }: { p: ActiveProject }) {
  const status = ['در انتظار پرداخت کارفرما', 'پرداخت کامل انجام شده و تا پایان پروژه در ضمانت لنس می‌ماند', 'مبلغ برای لنسر آزاد شد'][p.escrowStep]
  return (
    <div className="flex flex-col gap-3">
      <Card className="flex items-start gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-success-soft text-success">
          <Icon icon={SecurityCheckIcon} size={20} />
        </span>
        <div>
          <p className="font-bold">وضعیت پرداخت پروژه</p>
          <p className="mt-1 text-xs leading-5 text-fg-muted">{status}</p>
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <span className="text-sm text-fg-muted">مبلغ کل پروژه</span>
          <span className="text-xl font-extrabold text-primary tabular">{formatToman(p.amount)}</span>
        </div>
        <StepTimeline
          className="mt-6"
          current={p.escrowStep}
          steps={[
            { label: 'پرداخت کارفرما', icon: Wallet01Icon },
            { label: 'در ضمانت لنس', icon: SecurityCheckIcon },
            { label: 'آزادسازی برای لنسر', icon: Money03Icon },
          ]}
        />
      </Card>
      <Card padding="none" className="overflow-hidden">
        <table className="w-full text-center text-xs">
          <caption className="sr-only">تراکنش‌های پروژه</caption>
          <thead className="text-fg-muted">
            <tr className="border-b border-stroke">
              <th className="p-3 font-bold">تاریخ پرداخت</th>
              <th className="p-3 font-bold">مبلغ</th>
              <th className="p-3 font-bold">وضعیت</th>
              <th className="p-3 font-bold">فاکتور</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 tabular">{formatDate(new Date(Date.now() - 5 * 86400000))}</td>
              <td className="p-3 tabular">{formatToman(p.amount, { compact: true })}</td>
              <td className="p-3">
                <Tag tone={p.escrowStep === 2 ? 'success' : 'primary'}>{p.escrowStep === 2 ? 'آزاد شده' : 'در ضمانت'}</Tag>
              </td>
              <td className="p-3">
                <button type="button" aria-label="دانلود فاکتور" className="mx-auto grid size-9 place-items-center rounded-[10px] text-fg-muted hover:bg-white-soft hover:text-fg">
                  <Icon icon={Invoice01Icon} size={18} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  )
}

export function Workspace() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { projects, updateProject, role } = useApp()
  const p = projects.find((x) => x.id === id)
  const [tab, setTab] = useState<'tasks' | 'calendar' | 'finance'>('tasks')
  const [confirm, setConfirm] = useState(false)

  if (!p) {
    return (
      <>
        <AppHeader title="جزئیات پروژه" backTo="/app/projects" />
        <EmptyState icon={Folder03Icon} title="پروژه پیدا نشد" action={<ButtonLink to="/app/projects">پروژه‌های من</ButtonLink>} />
      </>
    )
  }

  const done = p.tasks.filter((t) => t.done).length
  const isEmployer = role === 'employer'

  return (
    <>
      <AppHeader title="جزئیات پروژه" backTo="/app/projects" />
      <Screen
        title={p.title}
      >
        <Card className="overflow-hidden bg-[radial-gradient(100%_100%_at_100%_0%,#ff7fe31c,transparent_60%)]">
          <div className="absolute inset-y-6 start-0 w-1 rounded-e-full bg-primary" aria-hidden />
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-extrabold leading-8">{p.title}</h1>
              <p className="text-xs text-fg-subtle">{p.category}</p>
            </div>
            <ProgressRing value={p.progress} size={60} />
          </div>
          {p.counterpart && (
            <div className="mt-4 flex items-center justify-between border-t border-stroke pt-4">
              <span className="flex items-center gap-2 text-sm font-bold">
                <Avatar name={p.counterpart} size={30} />
                {p.counterpart}
              </span>
              <ButtonLink to="/app/messages/c1" size="sm" variant="secondary">
                پیام
              </ButtonLink>
            </div>
          )}
        </Card>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <Card className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-[12px] bg-primary-soft text-primary">
              <Icon icon={Calendar03Icon} size={22} />
            </span>
            <div>
              <p className="text-lg font-extrabold">{formatDayMonth(p.deadline)}</p>
              <p className="text-xs text-fg-subtle">تاریخ تحویل</p>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <ProgressRing value={p.progress} size={44} stroke={4} />
            <div>
              <p className="text-lg font-extrabold">{formatPercent(p.progress)}</p>
              <p className="text-xs text-fg-subtle">
                {toFaDigits(done)} از {formatNumber(p.tasks.length)} تسک
              </p>
            </div>
          </Card>
        </div>

        <SegmentedControl
          className="mt-5"
          label="بخش‌های پروژه"
          idBase="ws"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'tasks', label: 'تسک‌ها' },
            { value: 'calendar', label: 'تقویم' },
            { value: 'finance', label: 'مالی' },
          ]}
        />
        <div role="tabpanel" id={`ws-panel-${tab}`} aria-labelledby={`ws-tab-${tab}`} className="mt-4">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
              {tab === 'tasks' && <TaskList p={p} />}
              {tab === 'calendar' && <CalendarTab p={p} />}
              {tab === 'finance' && <FinancialTab p={p} />}
            </motion.div>
          </AnimatePresence>
        </div>
        {p.status !== 'done' && (
          <Button variant="danger" block size="lg" onClick={() => setConfirm(true)} className="mt-8">
            {isEmployer ? 'تأیید تحویل و پایان پروژه' : 'درخواست پایان پروژه'}
          </Button>
        )}
      </Screen>

      <Dialog
        open={confirm}
        onClose={() => setConfirm(false)}
        tone="danger"
        icon={<span className="grid size-14 place-items-center rounded-full bg-danger-soft text-danger"><Icon icon={isEmployer ? Money03Icon : UserSearch01Icon} size={28} /></span>}
        title={isEmployer ? 'پایان پروژه و آزادسازی مبلغ؟' : 'درخواست پایان پروژه؟'}
        description={
          isEmployer
            ? `با تأیید، ${formatToman(p.amount)} از ضمانت لنس برای ${p.counterpart} آزاد می‌شود. این کار قابل بازگشت نیست.`
            : 'کارفرما ۷۲ ساعت برای تأیید تحویل فرصت دارد. بعد از تأیید، مبلغ به کیف پول شما واریز می‌شود.'
        }
        actions={
          <>
            <Button variant="secondary" className="flex-1" onClick={() => setConfirm(false)}>
              انصراف
            </Button>
            <Button
              className="flex-1 !bg-danger !text-white"
              onClick={() => {
                setConfirm(false)
                if (isEmployer) {
                  updateProject(p.id, (x) => ({ ...x, status: 'done', escrowStep: 2, progress: 100 }))
                  navigate('/app/payment/success?for=release')
                } else {
                  toast.show('درخواست پایان پروژه برای کارفرما ارسال شد.')
                }
              }}
            >
              {isEmployer ? 'آزادسازی مبلغ' : 'ارسال درخواست'}
            </Button>
          </>
        }
      />
    </>
  )
}

