import { AnimatePresence, motion } from 'motion/react'
import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowUpRight01Icon, Copy01Icon, FilterHorizontalIcon, Location01Icon, Search01Icon } from '@hugeicons/core-free-icons'
import { agentById } from '../data/agents'
import { disciplines, jobs, sources, type Job, type Source } from '../data/market'
import { useLocale } from '../i18n/locale'
import { useTitle } from '../layout/Shell'
import { AgentRun } from '../ui/AgentRun'
import { ButtonLink, Container, Icon, inputCls, PageHeader, Panel, Tag, cn } from '../ui/core'
import { useToast } from '../ui/overlay'

const LEVEL = { starter: { en: 'Starter', fa: 'تازه‌کار' }, mid: { en: 'Mid', fa: 'متوسط' }, senior: { en: 'Senior', fa: 'باتجربه' } } as const
const PER = { project: { en: 'per project', fa: 'برای کل پروژه' }, month: { en: 'a month', fa: 'در ماه' }, hour: { en: 'an hour', fa: 'ساعتی' } } as const

function FitRing({ fit }: { fit: number }) {
  const { num, t } = useLocale()
  const r = 20
  const c = 2 * Math.PI * r
  return (
    <span className="relative grid size-12 shrink-0 place-items-center" role="img" aria-label={t({ en: `${fit}% fit`, fa: `${num(fit)}٪ تناسب` })}>
      <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="var(--line)" strokeWidth="3" />
        <circle cx="24" cy="24" r={r} fill="none" stroke={fit >= 75 ? 'var(--cobalt)' : 'var(--ink-subtle)'} strokeWidth="3" strokeDasharray={c} strokeDashoffset={c * (1 - fit / 100)} strokeLinecap="round" />
      </svg>
      <span className="text-[13px] tabular">{num(fit)}</span>
    </span>
  )
}

function JobRow({ j }: { j: Job }) {
  const { t, to, money, ago } = useLocale()
  return (
    <Link to={to(`/work/${j.id}`)} className="group flex gap-4 rounded-lg border border-line bg-surface p-5 transition-colors hover:border-line-strong">
      <FitRing fit={j.fit} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <h3 className="font-medium text-[17px] group-hover:text-cobalt-ink">{t(j.title)}</h3>
          <span className="text-[15px] tabular text-ink">
            {money(j.pay.amount, j.pay.currency, { compact: true })} <span className="text-[13px] text-ink-subtle">{t(PER[j.pay.per])}</span>
          </span>
        </div>
        <p className="mt-1 text-[14px] text-ink-subtle">
          <span>{t(j.org)}</span>
          <span className="mx-2 text-line-strong" aria-hidden>
            /
          </span>
          <span>{ago(j.posted)}</span>
        </p>
        <p className="mt-3 line-clamp-2 text-[15px] text-ink-muted">{t(j.summary)}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Tag tone={j.source === 'lance' ? 'cobalt' : 'neutral'}>{t(sources[j.source].name)}</Tag>
          {j.dupes?.length ? <Tag>{t({ en: `also on ${j.dupes.map((d) => sources[d].name.en).join(', ')}`, fa: `در ${j.dupes.map((d) => sources[d].name.fa).join('، ')} هم هست` })}</Tag> : null}
          <Tag>{t(LEVEL[j.level])}</Tag>
          {j.remote && <Tag icon={Location01Icon}>{t({ en: 'Remote', fa: 'دورکاری' })}</Tag>}
        </div>
      </div>
    </Link>
  )
}

export function Work() {
  useTitle({ en: 'Job Radar', fa: 'رادار کار' })
  const { t, num } = useLocale()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const src = (params.get('source') as Source | null) ?? null
  const disc = params.get('d')
  const set = (k: string, v: string | null) => {
    const p = new URLSearchParams(params)
    if (v) p.set(k, v)
    else p.delete(k)
    setParams(p, { replace: true })
  }
  const list = useMemo(
    () =>
      jobs
        .filter((j) => (!src || j.source === src) && (!disc || j.discipline === disc))
        .filter((j) => !q || `${j.title.en} ${j.title.fa} ${j.skills.join(' ')}`.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => b.fit - a.fit),
    [q, src, disc],
  )
  const activeDisciplines = disciplines.filter((d) => jobs.some((j) => j.discipline === d.id))

  return (
    <Container>
      <PageHeader
        title={t({ en: 'Job Radar', fa: 'رادار کار' })}
        lead={t({
          en: 'Jobs from Lance and six other sites, with duplicates merged and the best fits first. External jobs open on their own site.',
          fa: 'آگهی‌های لنس و شش سایت دیگه، بدون تکراری‌ها و با مرتبط‌ترین‌ها در بالا. آگهی‌های بیرونی روی سایت خودشون باز می‌شن.',
        })}
      />
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside aria-label={t({ en: 'Filters', fa: 'فیلترها' })} className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
          <div>
            <label htmlFor="q" className="mb-2 block text-[15px] font-medium">
              {t({ en: 'Search', fa: 'جستجو' })}
            </label>
            <div className="relative">
              <Icon icon={Search01Icon} size={18} className="pointer-events-none absolute inset-y-0 start-3.5 my-auto text-ink-subtle" />
              <input id="q" type="search" value={q} onChange={(e) => set('q', e.target.value || null)} placeholder={t({ en: 'Skill or title', fa: 'مهارت یا عنوان' })} className={cn(inputCls, 'h-11 ps-10')} autoComplete="off" spellCheck={false} />
            </div>
          </div>
          <fieldset>
            <legend className="mb-3 flex items-center gap-2 text-[15px] font-medium">
              <Icon icon={FilterHorizontalIcon} size={16} /> {t({ en: 'Source', fa: 'منبع' })}
            </legend>
            <ul className="flex flex-col">
              {[null, ...(Object.keys(sources) as Source[])].map((s) => (
                <li key={s ?? 'all'}>
                  <button
                    type="button"
                    aria-pressed={src === s}
                    onClick={() => set('source', s)}
                    className={cn('flex h-10 w-full items-center justify-between rounded-sm px-3 text-[15px] transition-colors', src === s ? 'bg-raised text-ink' : 'text-ink-muted hover:text-ink')}
                  >
                    {s ? t(sources[s].name) : t({ en: 'All sources', fa: 'همه‌ی منابع' })}
                    <span className="text-[13px] text-ink-subtle tabular">{num(s ? jobs.filter((j) => j.source === s).length : jobs.length)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </fieldset>
          <fieldset>
            <legend className="mb-3 text-[15px] font-medium">{t({ en: 'Discipline', fa: 'حوزه' })}</legend>
            <div className="flex flex-wrap gap-2">
              {activeDisciplines.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={disc === d.id}
                  onClick={() => set('d', disc === d.id ? null : d.id)}
                  className={cn('h-9 rounded-full border px-3.5 text-[14px] transition-colors', disc === d.id ? 'border-cobalt bg-cobalt-soft text-ink' : 'border-line text-ink-muted hover:text-ink')}
                >
                  {t(d.label)}
                </button>
              ))}
            </div>
          </fieldset>
        </aside>
        <section aria-live="polite">
          <p className="mb-4 text-[15px] text-ink-muted">{t({ en: `${list.length} jobs, best fit first`, fa: `${num(list.length)} آگهی، مرتبط‌ترین‌ها اول` })}</p>
          <motion.ul layout className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {list.map((j) => (
                <motion.li key={j.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  <JobRow j={j} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
          {list.length === 0 && (
            <Panel className="p-10 text-center">
              <p className="heading text-[20px]">{t({ en: 'Nothing matches yet', fa: 'فعلاً چیزی پیدا نشد' })}</p>
              <p className="mt-2 text-ink-muted">{t({ en: 'Clear a filter, or let the Scout tell you when a match appears.', fa: 'یکی از فیلترها رو بردار، یا بذار پیشاهنگ هر وقت مورد مناسب پیدا شد خبرت کنه.' })}</p>
              <button type="button" onClick={() => setParams({}, { replace: true })} className="mt-5 text-[15px] text-cobalt-ink underline underline-offset-4">
                {t({ en: 'Clear filters', fa: 'پاک کردن فیلترها' })}
              </button>
            </Panel>
          )}
        </section>
      </div>
    </Container>
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
  return (
    <Container>
      <PageHeader
        crumbs={[{ label: t({ en: 'Job Radar', fa: 'رادار کار' }), to: to('/work') }, { label: t(j.title) }]}
        title={t(j.title)}
        lead={
          <>
            {t(j.org)}
            <span className="mx-2 text-line-strong">/</span>
            {ago(j.posted)}
          </>
        }
      />
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <Panel className="p-6 sm:p-8">
            <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <div>
                <dt className="text-[14px] text-ink-subtle">{t({ en: 'Pay', fa: 'دستمزد' })}</dt>
                <dd className="mt-1 font-medium tabular">{money(j.pay.amount, j.pay.currency)}</dd>
              </div>
              <div>
                <dt className="text-[14px] text-ink-subtle">{t({ en: 'Basis', fa: 'نوع پرداخت' })}</dt>
                <dd className="mt-1">{t(PER[j.pay.per])}</dd>
              </div>
              <div>
                <dt className="text-[14px] text-ink-subtle">{t({ en: 'Level', fa: 'سطح' })}</dt>
                <dd className="mt-1">{t(LEVEL[j.level])}</dd>
              </div>
              <div>
                <dt className="text-[14px] text-ink-subtle">{t({ en: 'Source', fa: 'منبع' })}</dt>
                <dd className="mt-1">{t(sources[j.source].name)}</dd>
              </div>
            </dl>
            <p className="mt-8 text-[17px] leading-relaxed">{t(j.summary)}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {j.skills.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
              {ext ? (
                <a href={sources[j.source].url} target="_blank" rel="noreferrer noopener" className="inline-flex h-11 items-center gap-2 rounded-md bg-cobalt px-5 text-[15px] font-medium text-on-accent">
                  {t({ en: `Apply on ${sources[j.source].name.en}`, fa: `درخواست در ${sources[j.source].name.fa}` })}
                  <Icon icon={ArrowUpRight01Icon} size={18} directional />
                </a>
              ) : (
                <ButtonLink to={to('/sign-in')}>{t({ en: 'Apply on Lance', fa: 'درخواست در لنس' })}</ButtonLink>
              )}
              <ButtonLink to={to('/plus/cv')} variant="outline">
                {t({ en: 'Tailor my CV to this', fa: 'رزومه‌م رو برای این آماده کن' })}
              </ButtonLink>
            </div>
            {ext && <p className="mt-4 text-[14px] text-ink-subtle">{t({ en: 'This job lives on another site. Lance shows it here so you can compare; you apply there.', fa: 'این آگهی مال یه سایت دیگه‌ست. لنس اینجا نشونش می‌ده که بتونی مقایسه کنی؛ درخواست رو همون‌جا می‌فرستی.' })}</p>}
          </Panel>
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
            <button
              type="button"
              onClick={() => toast(t({ en: 'Draft copied. Edit it before you send.', fa: 'پیش‌نویس کپی شد. قبل از فرستادن ویرایشش کن.' }))}
              className="inline-flex h-9 items-center gap-2 rounded-sm bg-cobalt px-3.5 text-[14px] font-medium text-on-accent"
            >
              <Icon icon={Copy01Icon} size={16} /> {t({ en: 'Copy draft', fa: 'کپی پیش‌نویس' })}
            </button>
          }
        />
      </div>
    </Container>
  )
}
