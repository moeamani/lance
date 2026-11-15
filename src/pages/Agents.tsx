import { Link, useParams } from 'react-router-dom'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { Knight } from '../brand/Knights'
import { agents, agentById, type Agent } from '../data/agents'
import { useLocale } from '../i18n/locale'
import { useTitle } from '../layout/Shell'
import { AgentRun } from '../ui/AgentRun'
import { ButtonLink, Container, Icon, PageHeader, Tag } from '../ui/core'
import { MerlinEstimator } from './Merlin'

export function Agents() {
  useTitle({ en: 'Agents', fa: 'دستیارها' })
  const { t, to } = useLocale()
  return (
    <Container>
      <PageHeader
        title={t({ en: 'The Round Table', fa: 'میزگرد شوالیه‌ها' })}
        lead={t({
          en: 'Seven agents, each with one job. They show their plan, work in the open, and stop for your approval before anything is sent, paid or published.',
          fa: 'هفت دستیار، هر کدوم با یه کار مشخص. برنامه‌شون رو نشون می‌دن، جلوی چشمت کار می‌کنن و قبل از فرستادن، پرداخت یا انتشار هر چیزی، منتظر تأیید تو می‌مونن.',
        })}
      />
      {/* Merlin leads (2 × 2); the six knights fill the 3 × 2 beside him. */}
      <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
        {agents.map((a, i) => (
          <li key={a.id} className={i === 0 ? 'sm:col-span-2 lg:row-span-2' : ''}>
            <Link to={to(`/agents/${a.id}`)} className="group grid h-full grid-cols-[120px_1fr] gap-5 lg:block">
              <Knight who={a.id} label={t(a.name)} className={i === 0 ? 'aspect-[4/5] w-full transition-transform duration-200 group-hover:-translate-y-1 lg:mb-6' : 'aspect-[4/5] w-full transition-transform duration-200 group-hover:-translate-y-1 lg:mb-5'} />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="heading text-[22px] group-hover:text-pink-ink">{t(a.name)}</h2>
                  {a.plan === 'plus' && <Tag tone="sun">{t({ en: 'Plus', fa: 'پلاس' })}</Tag>}
                </div>
                <p className="mt-1 font-medium text-ink-muted">{t(a.role)}</p>
                <p className="mt-3 text-[15px] text-ink-muted">{t(a.line)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  )
}

function SampleResult({ a }: { a: Agent }) {
  const { t } = useLocale()
  const last = a.run[a.run.length - 1]
  return (
    <p className="text-[15px]">
      <span className="text-ink-subtle">{t({ en: 'Result', fa: 'نتیجه' })}: </span>
      {t(last.result)}
    </p>
  )
}

export function AgentDetail() {
  const { slug } = useParams()
  const { t, to } = useLocale()
  const a = agentById(slug ?? '') ?? agents[0]
  useTitle(a.name)
  const isMerlin = a.id === 'merlin'
  const others = agents.filter((x) => x.id !== a.id).slice(0, 3)
  return (
    <Container>
      <PageHeader crumbs={[{ label: t({ en: 'Agents', fa: 'دستیارها' }), to: to('/agents') }, { label: t(a.name) }]} title={t(a.name)} lead={t(a.line)} />
      <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
        <aside className="flex flex-col gap-6">
          <Knight who={a.id} label={t(a.name)} className="aspect-[4/5] w-full max-w-[320px]" />
          <dl className="flex flex-col gap-4 text-[15px]">
            <div>
              <dt className="text-ink-subtle">{t({ en: 'You give it', fa: 'چی بهش می‌دی' })}</dt>
              <dd className="mt-1">{t(a.input)}</dd>
            </div>
            <div>
              <dt className="text-ink-subtle">{t({ en: 'You get back', fa: 'چی تحویل می‌گیری' })}</dt>
              <dd className="mt-1">{t(a.output)}</dd>
            </div>
            <div>
              <dt className="text-ink-subtle">{t({ en: 'Where it stops', fa: 'کجا متوقف می‌شه' })}</dt>
              <dd className="mt-1">{t(a.limit)}</dd>
            </div>
            <div>
              <dt className="text-ink-subtle">{t({ en: 'Plan', fa: 'اشتراک' })}</dt>
              <dd className="mt-1">{a.plan === 'plus' ? <Tag tone="sun">{t({ en: 'Included in Plus', fa: 'در لنس پلاس' })}</Tag> : <Tag tone="success">{t({ en: 'Free', fa: 'رایگان' })}</Tag>}</dd>
            </div>
          </dl>
        </aside>
        <div className="flex flex-col gap-8">
          {isMerlin ? (
            <>
              <h2 className="heading text-[24px]">{t({ en: 'Price check', fa: 'بررسی قیمت' })}</h2>
              <MerlinEstimator />
            </>
          ) : (
            <>
              <h2 className="heading text-[24px]">{t({ en: 'Watch an example run', fa: 'یه اجرای نمونه رو ببین' })}</h2>
              <AgentRun agent={a} result={<SampleResult a={a} />} cta={a.home !== `/agents/${a.id}` ? <ButtonLink to={to(a.home)} size="sm">{t({ en: 'Use it for real', fa: 'استفاده‌ی واقعی' })}</ButtonLink> : undefined} />
            </>
          )}
          <section aria-labelledby="others-h" className="pt-6">
            <h2 id="others-h" className="mb-4 text-[15px] text-ink-subtle">
              {t({ en: 'Works well with', fa: 'کنار این‌ها خوب کار می‌کنه' })}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-3">
              {others.map((o) => (
                <li key={o.id}>
                  <Link to={to(`/agents/${o.id}`)} className="lift flex items-center gap-3 rounded-md border border-line bg-surface p-3">
                    <Knight who={o.id} label={t(o.name)} className="h-14 w-11 shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{t(o.name)}</span>
                      <span className="block truncate text-[13px] text-ink-subtle">{t(o.role)}</span>
                    </span>
                    <Icon icon={ArrowRight01Icon} size={16} directional className="text-ink-subtle" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </Container>
  )
}
