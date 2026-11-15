import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useRef, type ReactNode } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  ArrowDown01Icon,
  ArrowUpRight01Icon,
  Bookmark01Icon,
  Briefcase01Icon,
  Cancel01Icon,
  CheckmarkBadge01Icon,
  Copy01Icon,
  Location01Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons'
import { agentById } from '../data/agents'
import { disciplines, jobs, sources, type Job, type Source } from '../data/market'
import { useLocale } from '../i18n/locale'
import { useTitle } from '../layout/Shell'
import { toggleSaved, useSaved } from '../lib/saved'
import { AgentRun } from '../ui/AgentRun'
import { Button, ButtonLink, cn, Container, Hl, Icon, inputCls, Tag } from '../ui/core'
import { useToast } from '../ui/overlay'
import { Tabs } from '../ui/tabs'

/*
 * Work, laid out like the Figma Discovery screen (06 · Discovery): a filter panel at the start
 * side and a list panel with a segmented control and cards. Filters apply as you choose them (no
 * dead "apply" step), the URL keeps them, and bookmarks fill the "Saved" tab.
 */

const LEVEL = { starter: { en: 'Starter', fa: 'تازه‌کار' }, mid: { en: 'Mid-level', fa: 'سطح متوسط' }, senior: { en: 'Senior', fa: 'باتجربه' } } as const
const PER = { project: { en: 'per project', fa: 'برای کل پروژه' }, month: { en: 'a month', fa: 'در ماه' }, hour: { en: 'an hour', fa: 'ساعتی' } } as const

function SaveButton({ id, className }: { id: string; className?: string }) {
  const { t } = useLocale()
  const saved = useSaved().includes(id)
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? t({ en: 'Remove bookmark', fa: 'حذف نشان' }) : t({ en: 'Bookmark', fa: 'نشان کردن' })}
      onClick={(e) => {
        e.preventDefault()
        toggleSaved(id)
      }}
      className={cn('grid size-10 shrink-0 place-items-center rounded-[10px] transition-colors', saved ? 'bg-pink-soft text-pink-ink' : 'bg-raised text-ink-muted hover:text-ink day:border day:border-line', className)}
    >
      <Icon icon={Bookmark01Icon} size={19} className={saved ? '[&_path]:fill-current' : ''} />
    </button>
  )
}

/** Source avatar: a round chip with the source's initial, pink for Lance. */
function SourceChip({ s }: { s: Source }) {
  const { t } = useLocale()
  const name = t(sources[s].name)
  return (
    <span aria-hidden className={cn('grid size-12 shrink-0 place-items-center rounded-full text-[17px] font-bold', s === 'lance' ? 'bg-pink-soft text-pink-ink' : 'bg-line text-ink-muted')}>
      {name.slice(0, 1)}
    </span>
  )
}

function JobCard({ j }: { j: Job }) {
  const { t, to, money, ago, num } = useLocale()
  return (
    <article className="rounded-[14px] bg-raised p-5 day:border day:border-line">
      <div className="flex items-start gap-4">
        <SourceChip s={j.source} />
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1.5 text-[17px] font-semibold">
            <Link to={to(`/work/${j.id}`)} className="hover:text-pink-ink">
              {t(j.title)}
            </Link>
            {j.source === 'lance' && <Icon icon={CheckmarkBadge01Icon} size={18} className="shrink-0 text-pink-ink" />}
          </h3>
          <p className="mt-0.5 text-[14px] text-ink-subtle">
            {t(sources[j.source].name)} · {t(j.org)} · {ago(j.posted)}
          </p>
        </div>
        <SaveButton id={j.id} />
      </div>
      <p className="mt-4 line-clamp-2 text-[15px] leading-relaxed text-ink-muted">{t(j.summary)}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {j.fit >= 80 && <Tag tone="pink">{t({ en: 'Recommended', fa: 'پیشنهاد شده' })}</Tag>}
        <Tag>{t({ en: `${j.fit}% fit`, fa: `${num(j.fit)}٪ تناسب` })}</Tag>
        <Tag>{t(LEVEL[j.level])}</Tag>
        {j.remote && <Tag icon={Location01Icon}>{t({ en: 'Remote', fa: 'دورکاری' })}</Tag>}
        {j.dupes?.length ? <Tag>{t({ en: `also on ${j.dupes.map((d) => sources[d].name.en).join(', ')}`, fa: `در ${j.dupes.map((d) => sources[d].name.fa).join('، ')} هم هست` })}</Tag> : null}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[16px] font-semibold tabular">
          {money(j.pay.amount, j.pay.currency, { compact: true })} <span className="text-[13px] font-normal text-ink-subtle">{t(PER[j.pay.per])}</span>
        </p>
        <ButtonLink to={to(`/work/${j.id}`)} className="min-w-[180px] max-sm:w-full">
          {t({ en: 'View job', fa: 'مشاهده آگهی' })}
        </ButtonLink>
      </div>
    </article>
  )
}

/** A Figma-style select: filled, icon at the start, chevron at the end. */
function Select({ id, icon, value, onChange, children, label }: { id: string; icon: typeof Search01Icon; value: string; onChange: (v: string) => void; children: ReactNode; label: string }) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Icon icon={icon} size={18} className="pointer-events-none absolute inset-y-0 start-3.5 my-auto text-ink-subtle" />
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={cn(inputCls, 'h-12 appearance-none ps-10 pe-10')}>
        {children}
      </select>
      <Icon icon={ArrowDown01Icon} size={18} className="pointer-events-none absolute inset-y-0 end-3.5 my-auto text-ink-subtle" />
    </div>
  )
}

export function Work() {
  useTitle({ en: 'Job Radar', fa: 'رادار کار' })
  const { t, num } = useLocale()
  const saved = useSaved()
  const listRef = useRef<HTMLElement>(null)
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const src = (params.get('source') as Source | null) ?? null
  const disc = params.get('d')
  const level = params.get('level')
  const tab = params.get('tab') === 'saved' ? 'saved' : 'all'
  const set = (k: string, v: string | null) => {
    const p = new URLSearchParams(params)
    if (v) p.set(k, v)
    else p.delete(k)
    setParams(p, { replace: true })
  }
  const list = useMemo(
    () =>
      jobs
        .filter((j) => tab === 'all' || saved.includes(j.id))
        .filter((j) => (!src || j.source === src) && (!disc || j.discipline === disc) && (!level || j.level === level))
        .filter((j) => !q || `${j.title.en} ${j.title.fa} ${j.skills.join(' ')}`.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => b.fit - a.fit),
    [q, src, disc, level, tab, saved],
  )
  const activeDisciplines = disciplines.filter((d) => jobs.some((j) => j.discipline === d.id))
  const chips: { key: string; label: string }[] = [
    src && { key: 'source', label: t(sources[src].name) },
    disc && { key: 'd', label: t(disciplines.find((d) => d.id === disc)?.label ?? { en: disc, fa: disc }) },
    level && { key: 'level', label: t(LEVEL[level as keyof typeof LEVEL]) },
    q && { key: 'q', label: `“${q}”` },
  ].filter(Boolean) as { key: string; label: string }[]

  return (
    <Container className="pt-8">
      <h1 className="heading mb-6 text-[clamp(1.8rem,3vw,2.4rem)]">
        <Hl>{t({ en: 'Job Radar', fa: 'رادار کار' })}</Hl>
        <span className="text-ink-muted">{t({ en: ': every site, one list', fa: ': همه‌ی سایت‌ها، یه فهرست' })}</span>
      </h1>
      <div className="grid gap-5 lg:grid-cols-[340px_1fr] [&>*]:min-w-0">
        {/* Filter panel */}
        <aside aria-label={t({ en: 'Filters', fa: 'فیلترها' })} className="rounded-lg bg-surface p-5 lg:sticky lg:top-28 lg:self-start day:border day:border-line">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 className="text-[22px] font-bold">{t({ en: 'Filters', fa: 'فیلتر' })}</h2>
            {chips.length > 0 && (
              <button type="button" onClick={() => setParams(tab === 'saved' ? { tab: 'saved' } : {}, { replace: true })} className="grid size-10 place-items-center rounded-[10px] bg-raised text-ink-muted hover:text-ink" aria-label={t({ en: 'Clear all filters', fa: 'پاک کردن همه‌ی فیلترها' })}>
                <Icon icon={Cancel01Icon} size={18} />
              </button>
            )}
          </div>
          {chips.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2 rounded-[12px] bg-raised p-2.5" aria-label={t({ en: 'Active filters', fa: 'فیلترهای فعال' })}>
              {chips.map((c) => (
                <li key={c.key}>
                  <button type="button" onClick={() => set(c.key, null)} className="inline-flex h-8 items-center gap-1.5 rounded-[8px] bg-pink-soft px-2.5 text-[13px] font-medium text-pink-ink" aria-label={t({ en: `Remove ${c.label}`, fa: `حذف ${c.label}` })}>
                    {c.label}
                    <Icon icon={Cancel01Icon} size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 flex flex-col gap-6">
            <div>
              <label htmlFor="q" className="mb-2.5 block text-[16px] font-semibold">
                {t({ en: 'Search', fa: 'جستجو' })}
              </label>
              <div className="relative">
                <Icon icon={Search01Icon} size={18} className="pointer-events-none absolute inset-y-0 start-3.5 my-auto text-ink-subtle" />
                <input id="q" type="search" value={q} onChange={(e) => set('q', e.target.value || null)} placeholder={t({ en: 'Skill or title', fa: 'مهارت یا عنوان' })} className={cn(inputCls, 'h-12 ps-10')} autoComplete="off" spellCheck={false} />
              </div>
            </div>
            <div>
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[16px] font-semibold">{t({ en: 'Source', fa: 'منبع آگهی' })}</span>
                {src && (
                  <button type="button" onClick={() => set('source', null)} className="text-[13px] text-pink-ink">
                    {t({ en: 'Reset', fa: 'تنظیم مجدد' })}
                  </button>
                )}
              </div>
              <Select id="src" icon={Briefcase01Icon} label={t({ en: 'Source', fa: 'منبع آگهی' })} value={src ?? ''} onChange={(v) => set('source', v || null)}>
                <option value="">{t({ en: `All sources (${jobs.length})`, fa: `همه‌ی منابع (${num(jobs.length)})` })}</option>
                {(Object.keys(sources) as Source[]).map((s) => (
                  <option key={s} value={s}>
                    {t(sources[s].name)} ({num(jobs.filter((j) => j.source === s).length)})
                  </option>
                ))}
              </Select>
            </div>
            <fieldset>
              <legend className="mb-2.5 text-[16px] font-semibold">{t({ en: 'Field', fa: 'حوزه‌ی کاری' })}</legend>
              <div className="flex flex-wrap gap-2">
                {activeDisciplines.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    aria-pressed={disc === d.id}
                    onClick={() => set('d', disc === d.id ? null : d.id)}
                    className={cn('h-10 rounded-[10px] border px-3.5 text-[14px] transition-colors', disc === d.id ? 'border-pink bg-pink-soft text-pink-ink' : 'border-transparent bg-raised text-ink-muted hover:text-ink day:border-line')}
                  >
                    {t(d.label)}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2.5 text-[16px] font-semibold">{t({ en: 'Level', fa: 'سطح‌بندی' })}</legend>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(LEVEL) as (keyof typeof LEVEL)[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    aria-pressed={level === l}
                    onClick={() => set('level', level === l ? null : l)}
                    className={cn('h-10 rounded-[10px] border text-[14px] transition-colors', level === l ? 'border-mint bg-mint-soft text-mint-ink' : 'border-transparent bg-raised text-ink-muted hover:text-ink day:border-line')}
                  >
                    {t(LEVEL[l])}
                  </button>
                ))}
              </div>
            </fieldset>
            <Button block size="lg" onClick={() => listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
              {t({ en: `Show ${list.length} jobs`, fa: `نمایش ${num(list.length)} آگهی` })}
            </Button>
          </div>
        </aside>

        {/* List panel */}
        <section ref={listRef} aria-label={t({ en: 'Jobs', fa: 'آگهی‌ها' })} className="scroll-mt-28 rounded-lg bg-surface p-3 sm:p-4 day:border day:border-line">
          <Tabs
            label={t({ en: 'Which jobs', fa: 'کدوم آگهی‌ها' })}
            value={tab}
            onChange={(v) => set('tab', v === 'saved' ? 'saved' : null)}
            className="flex w-full"
            options={[
              { value: 'all', label: t({ en: 'Best fit first', fa: 'مرتبط‌ترین‌ها' }) },
              { value: 'saved', label: t({ en: 'Saved', fa: 'نشان‌شده‌ها' }), count: saved.length },
            ]}
          />
          <p className="mt-4 px-1 text-[14px] text-ink-subtle" aria-live="polite">
            {t({ en: `${list.length} jobs`, fa: `${num(list.length)} آگهی` })}
          </p>
          <motion.ul layout className="mt-3 flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {list.map((j) => (
                <motion.li key={j.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  <JobCard j={j} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
          {list.length === 0 && (
            <div className="rounded-[14px] bg-raised p-10 text-center">
              <p className="text-[20px] font-semibold">{tab === 'saved' ? t({ en: 'No saved jobs yet', fa: 'هنوز آگهی‌ای نشان نکردی' }) : t({ en: 'Nothing matches yet', fa: 'فعلاً چیزی پیدا نشد' })}</p>
              <p className="mt-2 text-ink-muted">
                {tab === 'saved'
                  ? t({ en: 'Use the bookmark on any job to keep it here.', fa: 'با دکمه‌ی نشان روی هر آگهی، اینجا نگهش دار.' })
                  : t({ en: 'Clear a filter, or let the Scout tell you when a match appears.', fa: 'یکی از فیلترها رو بردار، یا بذار پیشاهنگ هر وقت مورد مناسب پیدا شد خبرت کنه.' })}
              </p>
            </div>
          )}
        </section>
      </div>
    </Container>
  )
}

/** An info row from the Figma project page sidebar: label muted, value bold. */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-4 rounded-[12px] bg-raised px-4 py-3 day:border day:border-line">
      <dt className="text-[14px] text-ink-subtle">{label}</dt>
      <dd className="text-end text-[15px] font-semibold">{children}</dd>
    </div>
  )
}

export function JobDetail() {
  const { id } = useParams()
  const { t, to, money, ago } = useLocale()
  const toast = useToast()
  const j = jobs.find((x) => x.id === id) ?? jobs[0]
  useTitle(j.title)
  const herald = agentById('herald')!
  const ext = j.source !== 'lance'
  const field = disciplines.find((d) => d.id === j.discipline)
  return (
    <Container className="pt-8">
      <nav aria-label="Breadcrumb" className="mb-5 text-[14px] text-ink-subtle">
        <Link to={to('/work')} className="hover:text-ink">
          {t({ en: 'Job Radar', fa: 'رادار کار' })}
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span aria-current="page" className="text-ink-muted">
          {t(j.title)}
        </span>
      </nav>
      <div className="grid gap-5 lg:grid-cols-[1fr_380px] [&>*]:min-w-0">
        <article className="rounded-lg bg-surface p-6 sm:p-8 day:border day:border-line">
          <div className="flex items-start gap-3">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
              <h1 className="text-[clamp(1.4rem,2.4vw,1.8rem)] leading-tight font-bold">{t(j.title)}</h1>
              <Tag>{ago(j.posted)}</Tag>
            </div>
            <SaveButton id={j.id} />
          </div>
          <h2 className="mt-8 text-[18px] font-bold">{t({ en: 'About the project', fa: 'شرح پروژه' })}</h2>
          <p className="mt-3 text-[16px] leading-loose text-ink-muted">{t(j.summary)}</p>
          <h2 className="mt-8 text-[18px] font-bold">{t({ en: 'Skills needed', fa: 'مهارت‌های مورد نیاز' })}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {j.skills.map((s) => (
              <Tag key={s} tone="pink">
                {s}
              </Tag>
            ))}
          </div>
          {ext && (
            <p className="mt-8 rounded-[12px] bg-raised p-4 text-[14px] text-ink-muted day:border day:border-line">
              {t({ en: 'This job lives on another site. Lance shows it here so you can compare; you apply there.', fa: 'این آگهی مال یه سایت دیگه‌ست. لنس اینجا نشونش می‌ده که بتونی مقایسه کنی؛ درخواست رو همون‌جا می‌فرستی.' })}
            </p>
          )}
        </article>

        <aside className="flex flex-col gap-5">
          <div className="rounded-lg bg-surface p-5 day:border day:border-line">
            <dl className="flex flex-col gap-3">
              <Row label={t({ en: 'Client', fa: 'کارفرما' })}>{t(j.org)}</Row>
              <Row label={t({ en: 'Field', fa: 'نوع پروژه' })}>{field ? t(field.label) : '—'}</Row>
              <Row label={t({ en: 'Budget', fa: 'بودجه پیشنهادی' })}>
                <span className="tabular">{money(j.pay.amount, j.pay.currency)}</span> <span className="text-[13px] font-normal text-ink-subtle">{t(PER[j.pay.per])}</span>
              </Row>
              <Row label={t({ en: 'Level', fa: 'سطح' })}>{t(LEVEL[j.level])}</Row>
              <Row label={t({ en: 'Source', fa: 'منبع' })}>{t(sources[j.source].name)}</Row>
            </dl>
            <div className="mt-5 flex gap-2">
              {ext ? (
                <a href={sources[j.source].url} target="_blank" rel="noreferrer noopener" className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-[12px] bg-pink px-5 text-[15px] font-semibold text-on-accent">
                  {t({ en: `Apply on ${sources[j.source].name.en}`, fa: `درخواست در ${sources[j.source].name.fa}` })}
                  <Icon icon={ArrowUpRight01Icon} size={18} directional />
                </a>
              ) : (
                <ButtonLink to={`${to('/sign-in')}?next=${encodeURIComponent(to(`/work/${j.id}`))}`} size="lg" className="flex-1">
                  {t({ en: 'Send a proposal', fa: 'ارسال پیشنهاد' })}
                </ButtonLink>
              )}
              <SaveButton id={j.id} className="size-12" />
            </div>
            <ButtonLink to={to('/plus/cv')} variant="pinkline" block className="mt-3">
              {t({ en: 'Tailor my CV to this', fa: 'رزومه‌م رو برای این آماده کن' })}
            </ButtonLink>
          </div>
          <AgentRun
            agent={herald}
            result={
              <div>
                <p className="text-[14px] text-ink-subtle">{t({ en: 'Draft, first lines', fa: 'پیش‌نویس، چند خط اول' })}</p>
                <p className="mt-2 text-[15px] leading-relaxed">
                  {t({
                    en: 'Your checkout loses people on mobile at the shipping step. I’d start with a three-day audit: ten fixes, ranked by how many orders each one saves…',
                    fa: 'صفحه‌ی پرداختتون روی موبایل توی مرحله‌ی ارسال مشتری از دست می‌ده. پیشنهادم اینه با یه بررسی سه‌روزه شروع کنیم: ده اصلاح، مرتب‌شده بر اساس این‌که هر کدوم چندتا سفارش رو نجات می‌ده…',
                  })}
                </p>
              </div>
            }
            cta={
              <Button size="sm" icon={Copy01Icon} onClick={() => toast(t({ en: 'Draft copied. Edit it before you send.', fa: 'پیش‌نویس کپی شد. قبل از فرستادن ویرایشش کن.' }))}>
                {t({ en: 'Copy draft', fa: 'کپی پیش‌نویس' })}
              </Button>
            }
          />
        </aside>
      </div>
    </Container>
  )
}
