import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Add01Icon,
  ArrowRight01Icon,
  Award01Icon,
  Exchange01Icon,
  Folder01Icon,
  Notification01Icon,
  RefreshIcon,
  Settings01Icon,
  Tick02Icon,
  Wallet01Icon,
} from '@hugeicons/core-free-icons'
import { useLocale, type Bi } from '../i18n/locale'
import { useTitle } from '../layout/Shell'
import { ButtonLink, cn, Container, Hl, Icon, IconButton, IconChip, Tag } from '../ui/core'
import { useToast } from '../ui/overlay'
import { Tabs } from '../ui/tabs'

/*
 * Workspace, from the Figma "07 · Workspace / Dashboard" frames: a summary column (new project,
 * current projects, Plus, transactions, a pink promo, wallet, this month's income) beside the work
 * itself. One page serves both roles; the toggle swaps the work column, not the layout.
 * Everything here is demo data.
 */

type Role = 'lancer' | 'client'
type Project = { id: string; name: Bi; who: Bi; due: string; done: number; total: number; escrow: 'funded' | 'review' | 'released'; proposals?: number }

const PROJECTS: Record<Role, Project[]> = {
  lancer: [
    { id: 'checkout-redesign', name: { en: 'Checkout redesign', fa: 'بازطراحی صفحه‌ی پرداخت' }, who: { en: 'Home-goods shop, Isfahan', fa: 'فروشگاه لوازم خانه، اصفهان' }, due: '2026-11-21', done: 5, total: 8, escrow: 'funded' },
    { id: 'clinic-site', name: { en: 'Dental clinic booking site', fa: 'سایت نوبت‌دهی کلینیک دندان' }, who: { en: 'Dr. Tavakoli’s clinic', fa: 'کلینیک دکتر توکلی' }, due: '2026-11-17', done: 7, total: 7, escrow: 'review' },
  ],
  client: [
    { id: 'cafe-site', name: { en: 'Café booking site', fa: 'سایت رزرو کافه' }, who: { en: '14 proposals so far', fa: '۱۴ پیشنهاد تا الان' }, due: '2026-12-02', done: 0, total: 6, escrow: 'funded', proposals: 14 },
    { id: 'menu-video', name: { en: 'Menu video, 30 seconds', fa: 'ویدیوی ۳۰ ثانیه‌ای منو' }, who: { en: 'Babak Jafari', fa: 'بابک جعفری' }, due: '2026-11-19', done: 3, total: 4, escrow: 'funded' },
  ],
}

const TASKS: { id: string; label: Bi }[] = [
  { id: 't1', label: { en: 'Send the shipping-step prototype', fa: 'فرستادن پروتوتایپ مرحله‌ی ارسال' } },
  { id: 't2', label: { en: 'Run two usability tests', fa: 'دو تست کاربردپذیری' } },
  { id: 't3', label: { en: 'Reply to the clinic’s review notes', fa: 'جواب به یادداشت‌های بازبینی کلینیک' } },
  { id: 't4', label: { en: 'Update the Showcase with the checkout case', fa: 'افزودن نمونه‌کار پرداخت به ویترین' } },
]

function SummaryColumn({ role }: { role: Role }) {
  const { t, to, money, num } = useLocale()
  const toast = useToast()
  const list = PROJECTS[role]
  return (
    <aside className="flex flex-col gap-5" aria-label={t({ en: 'Summary', fa: 'خلاصه' })}>
      <div className="rounded-lg bg-surface p-5 day:border day:border-line">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <h1 className="text-[24px] font-bold">{t({ en: 'Dashboard', fa: 'داشبورد' })}</h1>
          <div className="flex gap-2">
            <IconButton icon={Notification01Icon} label={t({ en: 'Notifications', fa: 'اعلان‌ها' })} className="bg-raised" onClick={() => toast(t({ en: 'No new notifications', fa: 'اعلان تازه‌ای نداری' }))} />
            <IconButton icon={Settings01Icon} label={t({ en: 'Settings', fa: 'تنظیمات' })} className="bg-raised" onClick={() => toast(t({ en: 'Settings are not part of this demo', fa: 'تنظیمات در این نسخه‌ی نمایشی نیست' }))} />
          </div>
        </div>
        <ButtonLink to={to(role === 'client' ? '/hire/new' : '/work')} block size="lg" icon={Add01Icon} className="mt-5">
          {role === 'client' ? t({ en: 'New project', fa: 'ثبت پروژه جدید' }) : t({ en: 'Find new work', fa: 'پیدا کردن کار جدید' })}
        </ButtonLink>
        <div className="mt-4 rounded-[14px] border border-line bg-[linear-gradient(135deg,var(--raised),var(--surface))] p-4">
          <IconChip icon={Folder01Icon} size={40} />
          <p className="mt-3 text-[22px] font-bold text-pink-ink tabular">{num(list.length)}</p>
          <p className="text-[14px] text-ink-muted">{t({ en: 'Current projects', fa: 'پروژه‌های جاری' })}</p>
          <a href="#projects" className="mt-4 flex h-11 items-center justify-center rounded-[10px] border border-pink text-[15px] font-semibold text-pink-ink hover:bg-pink-soft">
            {t({ en: 'View projects', fa: 'مشاهده پروژه‌ها' })}
          </a>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-[14px] border border-line bg-[linear-gradient(135deg,var(--raised),var(--surface))] p-3.5">
            <IconChip icon={Award01Icon} size={34} tone="sun" />
            <p className="mt-2 text-[17px] font-bold text-sun-ink">{t({ en: 'Inactive', fa: 'غیرفعال' })}</p>
            <p className="text-[13px] text-ink-muted">{t({ en: 'Lance Plus', fa: 'لنس پلاس' })}</p>
            <Link to={to('/plus')} className="mt-3 flex h-9 items-center justify-center rounded-[8px] border border-pink text-[13px] font-semibold text-pink-ink hover:bg-pink-soft">
              {t({ en: 'Get Plus', fa: 'خرید اشتراک' })}
            </Link>
          </div>
          <div className="rounded-[14px] border border-line bg-[linear-gradient(135deg,var(--raised),var(--surface))] p-3.5">
            <IconChip icon={Wallet01Icon} size={34} />
            <p className="mt-2 text-[17px] font-bold text-pink-ink tabular">{num(3)}</p>
            <p className="text-[13px] text-ink-muted">{t({ en: 'Transactions', fa: 'تراکنش‌ها' })}</p>
            <a href="#income" className="mt-3 flex h-9 items-center justify-center rounded-[8px] border border-pink text-[13px] font-semibold text-pink-ink hover:bg-pink-soft">
              {t({ en: 'Payment history', fa: 'تاریخچه پرداخت' })}
            </a>
          </div>
        </div>
        <div className="mt-5 rounded-[14px] bg-[linear-gradient(180deg,#FF8FE8,#FF66DE)] p-4 text-center text-[#0D0D0D]">
          <p className="text-[15px] font-semibold">{role === 'client' ? t({ en: 'Lancers who fit your project are here', fa: 'لنسر مناسب پروژه‌ت همین‌جاست' }) : t({ en: 'Jobs that fit your skills are here', fa: 'کار مناسب مهارت‌هات همین‌جاست' })}</p>
          <Link to={to(role === 'client' ? '/showcase' : '/work')} className="mt-3 flex h-10 items-center justify-center rounded-[10px] bg-[#0D0D0D] text-[14px] font-semibold text-[#FF7FE3]">
            {t({ en: 'Take a look', fa: 'مشاهده' })}
          </Link>
        </div>
      </div>

      {/* Wallet */}
      <div id="income" className="relative scroll-mt-28 overflow-hidden rounded-lg border border-pink/20 bg-[radial-gradient(90%_80%_at_50%_0%,color-mix(in_oklab,var(--pink)_16%,var(--surface)),var(--surface))] p-6 text-center">
        <p className="text-[28px] font-bold tabular">{money(25_000_000, 'IRT')}</p>
        <p className="text-[15px] text-ink-muted">{t({ en: 'Balance', fa: 'موجودی' })}</p>
        <div className="mt-6 flex items-end justify-between gap-2">
          <button type="button" onClick={() => toast(t({ en: 'Payouts are not live in this demo.', fa: 'برداشت در این نسخه‌ی نمایشی فعال نیست.' }))} className="flex flex-col items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink">
            <span className="grid size-11 place-items-center rounded-full bg-ground/70">
              <Icon icon={Wallet01Icon} size={20} />
            </span>
            {t({ en: 'Withdraw', fa: 'برداشت' })}
          </button>
          <div className="flex flex-col items-center gap-1">
            <Icon icon={RefreshIcon} size={22} className="text-pink-ink" />
            <span className="text-[13px] text-ink-muted">{t({ en: 'Held in escrow', fa: 'در امانت (غیرقابل برداشت)' })}</span>
            <span className="text-[15px] font-bold tabular">{money(50_000_000, 'IRT')}</span>
          </div>
          <a href="#income-bar" className="flex flex-col items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink">
            <span className="grid size-11 place-items-center rounded-full bg-ground/70">
              <Icon icon={Exchange01Icon} size={20} />
            </span>
            {t({ en: 'History', fa: 'تاریخچه' })}
          </a>
        </div>
      </div>

      {/* This month's income */}
      <div id="income-bar" className="rounded-lg border border-line/70 bg-surface p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[15px] font-semibold">{t({ en: 'Income this month', fa: 'درآمدهای کلی این ماه' })}</p>
          <p className="text-[18px] font-bold tabular">{money(24_000_000, 'IRT')}</p>
        </div>
        <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-raised" role="img" aria-label={t({ en: 'Projects 85%, courses 15%', fa: 'پروژه‌ها ۸۵٪، دوره‌ها ۱۵٪' })}>
          <span className="h-full bg-pink" style={{ width: '85%' }} />
          <span className="h-full bg-ink" style={{ width: '15%' }} />
        </div>
        <div className="mt-3 flex gap-5 text-[13px] text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-pink" /> {t({ en: 'Projects', fa: 'پروژه‌ها' })}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-ink" /> {t({ en: 'Courses', fa: 'دوره‌ها' })}
          </span>
        </div>
      </div>
    </aside>
  )
}

function ProjectCard({ p, role }: { p: Project; role: Role }) {
  const { t, to, date, num } = useLocale()
  const pct = p.total ? Math.round((p.done / p.total) * 100) : 0
  const escrow = {
    funded: { tone: 'pink' as const, label: { en: 'Money in escrow', fa: 'پول در امانت' } },
    review: { tone: 'sun' as const, label: { en: 'Waiting for approval', fa: 'منتظر تأیید' } },
    released: { tone: 'success' as const, label: { en: 'Paid', fa: 'پرداخت شد' } },
  }[p.escrow]
  return (
    <article className="rounded-[14px] bg-raised p-5 day:border day:border-line">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[17px] font-semibold">{t(p.name)}</h3>
          <p className="mt-0.5 text-[14px] text-ink-subtle">{t(p.who)}</p>
        </div>
        <Tag tone={escrow.tone}>{t(escrow.label)}</Tag>
      </div>
      {p.proposals ? (
        <p className="mt-4 text-[15px] text-ink-muted">{t({ en: 'Compare proposals side by side: price against Merlin’s range, level and delivery time.', fa: 'پیشنهادها رو کنار هم مقایسه کن: قیمت در برابر بازه‌ی مرلین، سطح و زمان تحویل.' })}</p>
      ) : (
        <div className="mt-4">
          <div className="flex justify-between text-[13px] text-ink-subtle">
            <span>{t({ en: `${p.done} of ${p.total} tasks`, fa: `${num(p.done)} از ${num(p.total)} کار` })}</span>
            <span className="tabular">{num(pct)}٪</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={t(p.name)}>
            <span className="block h-full rounded-full bg-pink" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-ink-subtle">
          {t({ en: 'Due', fa: 'تحویل' })} <span className="text-ink">{date(p.due)}</span>
        </p>
        <ButtonLink to={to(p.proposals ? '/hire' : role === 'lancer' ? `/work/${p.id}` : '/hire')} variant="pinkline" size="sm" iconEnd={ArrowRight01Icon} directional>
          {p.proposals ? t({ en: `Review ${p.proposals} proposals`, fa: `بررسی ${num(p.proposals)} پیشنهاد` }) : t({ en: 'Open project', fa: 'باز کردن پروژه' })}
        </ButtonLink>
      </div>
    </article>
  )
}

export default function Dashboard() {
  useTitle({ en: 'Dashboard', fa: 'داشبورد' })
  const { t, to, num } = useLocale()
  const [role, setRole] = useState<Role>('lancer')
  const [done, setDone] = useState<string[]>(['t2'])
  const profile = 75
  return (
    <Container className="pt-8">
      <p className="mb-5 rounded-[12px] border border-dashed border-pink/40 bg-pink-soft px-4 py-2.5 text-[14px] text-pink-ink">
        {t({ en: 'Demo workspace: the numbers and projects here are samples.', fa: 'فضای کار نمایشی: عددها و پروژه‌های این صفحه نمونه هستن.' })}
      </p>
      <div className="grid gap-5 lg:grid-cols-[380px_1fr] [&>*]:min-w-0">
        <SummaryColumn role={role} />
        <div className="flex flex-col gap-5">
          <section id="projects" aria-labelledby="proj-h" className="scroll-mt-28 rounded-lg bg-surface p-4 sm:p-5 day:border day:border-line">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="proj-h" className="text-[20px] font-bold">
                <Hl>{t({ en: 'Your', fa: 'پروژه‌های' })}</Hl> {t({ en: 'projects', fa: 'تو' })}
              </h2>
              <Tabs
                label={t({ en: 'Show as', fa: 'نمایش به‌عنوان' })}
                value={role}
                onChange={setRole}
                options={[
                  { value: 'lancer', label: t({ en: 'Lancer', fa: 'لنسر' }) },
                  { value: 'client', label: t({ en: 'Employer', fa: 'کارفرما' }) },
                ]}
              />
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={role} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }} className="mt-5 flex flex-col gap-3">
                {PROJECTS[role].map((p) => (
                  <ProjectCard key={p.id} p={p} role={role} />
                ))}
              </motion.div>
            </AnimatePresence>
          </section>

          {role === 'lancer' && (
            <section aria-labelledby="tasks-h" className="rounded-lg bg-surface p-4 sm:p-5 day:border day:border-line">
              <div className="flex items-baseline justify-between">
                <h2 id="tasks-h" className="text-[20px] font-bold">{t({ en: 'This week', fa: 'کارهای این هفته' })}</h2>
                <span className="text-[14px] text-ink-subtle tabular">{t({ en: `${done.length} of ${TASKS.length} done`, fa: `${num(done.length)} از ${num(TASKS.length)} انجام شد` })}</span>
              </div>
              <ul className="mt-4 flex flex-col gap-2">
                {TASKS.map((x) => {
                  const on = done.includes(x.id)
                  return (
                    <li key={x.id}>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={on}
                        onClick={() => setDone((d) => (on ? d.filter((y) => y !== x.id) : [...d, x.id]))}
                        className="flex min-h-13 w-full items-center gap-3 rounded-[12px] bg-raised px-4 text-start text-[15px] transition-colors hover:bg-line day:border day:border-line"
                      >
                        <span className={cn('grid size-6 shrink-0 place-items-center rounded-[7px] border-2 transition-colors', on ? 'border-pink bg-pink text-on-accent' : 'border-line-strong')}>{on && <Icon icon={Tick02Icon} size={14} stroke={2.4} />}</span>
                        <span className={cn(on && 'text-ink-subtle line-through')}>{t(x.label)}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          {/* Profile completion (the Figma strip under the dashboard). */}
          <Link to={to('/start')} className="flex items-center gap-4 rounded-lg bg-raised p-4 transition-colors hover:bg-line day:border day:border-line">
            <span className="relative grid size-16 shrink-0 place-items-center" role="img" aria-label={t({ en: `Profile ${profile}% complete`, fa: `پروفایل ${num(profile)}٪ کامل` })}>
              <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden>
                <circle cx="24" cy="24" r="20" fill="none" stroke="var(--line-strong)" strokeWidth="4" />
                <circle cx="24" cy="24" r="20" fill="none" stroke="var(--pink)" strokeWidth="4" strokeLinecap="round" strokeDasharray={2 * Math.PI * 20} strokeDashoffset={2 * Math.PI * 20 * (1 - profile / 100)} />
              </svg>
              <span className="text-[13px] font-bold tabular">{num(profile)}٪</span>
            </span>
            <span className="flex-1 text-[18px] font-bold">{t({ en: 'Finish your profile', fa: 'پروفایل خودت رو تکمیل کن!' })}</span>
            <Icon icon={ArrowRight01Icon} size={22} directional className="text-pink-ink" />
          </Link>
        </div>
      </div>
    </Container>
  )
}
