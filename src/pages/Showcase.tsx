import { motion } from 'motion/react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Add01Icon, ArrowRight01Icon, Award01Icon } from '@hugeicons/core-free-icons'
import { disciplines, pieces } from '../data/market'
import { useLocale } from '../i18n/locale'
import { useTitle } from '../layout/Shell'
import { ButtonLink, cn, Container, Icon, PageHeader, Panel, Tag } from '../ui/core'
import { Cover } from '../ui/covers'

export function Showcase() {
  useTitle({ en: 'Showcase', fa: 'ویترین' })
  const { t, to } = useLocale()
  const [d, setD] = useState<string | null>(null)
  const hall = pieces.filter((p) => p.curated)
  const all = pieces.filter((p) => !d || p.discipline === d)
  const used = disciplines.filter((x) => pieces.some((p) => p.discipline === x.id))
  return (
    <Container>
      <PageHeader
        title={t({ en: 'Showcase', fa: 'ویترین' })}
        lead={t({
          en: 'Real work with the story behind it. Each month the Lance team picks a few pieces for the Hall and features them on the home page.',
          fa: 'کارهای واقعی، همراه با داستان پشتشون. تیم لنس هر ماه چندتاشون رو برای تالار انتخاب می‌کنه و توی صفحه‌ی اصلی نشون می‌ده.',
        })}
        actions={
          <ButtonLink to={to('/sign-in')} icon={Add01Icon}>
            {t({ en: 'Add your work', fa: 'کارت رو اضافه کن' })}
          </ButtonLink>
        }
      />

      <section aria-labelledby="hall-h">
        <h2 id="hall-h" className="mb-5 flex items-center gap-2 text-[15px] text-gilt-ink">
          <Icon icon={Award01Icon} size={18} /> {t({ en: 'The Hall, this month', fa: 'تالار، این ماه' })}
        </h2>
        <ul className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
          {hall.map((p, i) => (
            <li key={p.slug} className={i === 0 ? 'md:row-span-2' : ''}>
              <Link to={to(`/showcase/${p.slug}`)} className="rail rail-gilt group block overflow-hidden rounded-lg border border-line bg-surface">
                <div className="overflow-hidden">
                  <Cover piece={p} className="w-full transition-transform duration-300 group-hover:scale-[1.02]" />
                </div>
                <div className="p-5">
                  <p className="heading text-[20px]">{t(p.title)}</p>
                  <p className="mt-1 text-[14px] text-ink-subtle">{t(p.maker)}</p>
                  {i === 0 && <p className="mt-3 text-[15px] text-ink-muted">{t(p.line)}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="all-h" className="pt-20">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 id="all-h" className="heading text-[24px]">
            {t({ en: 'Everyone’s work', fa: 'کارهای همه' })}
          </h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t({ en: 'Filter by field', fa: 'فیلتر بر اساس حوزه' })}>
            {[null, ...used.map((u) => u.id)].map((id) => (
              <button
                key={id ?? 'all'}
                type="button"
                aria-pressed={d === id}
                onClick={() => setD(id)}
                className={cn('h-9 rounded-full border px-3.5 text-[14px] transition-colors', d === id ? 'border-cobalt bg-cobalt-soft text-ink' : 'border-line text-ink-muted hover:text-ink')}
              >
                {id ? t(disciplines.find((x) => x.id === id)!.label) : t({ en: 'All', fa: 'همه' })}
              </button>
            ))}
          </div>
        </div>
        <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((p) => (
            <motion.li layout key={p.slug}>
              <Link to={to(`/showcase/${p.slug}`)} className="group block overflow-hidden rounded-lg border border-line bg-surface">
                <div className="overflow-hidden">
                  <Cover piece={p} className="w-full transition-transform duration-300 group-hover:scale-[1.02]" />
                </div>
                <div className="flex items-start justify-between gap-3 p-4">
                  <div>
                    <p className="font-medium">{t(p.title)}</p>
                    <p className="text-[14px] text-ink-subtle">{t(p.maker)}</p>
                  </div>
                  {p.curated && <Tag tone="gilt">{t({ en: 'Hall', fa: 'تالار' })}</Tag>}
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </section>
    </Container>
  )
}

export function PieceDetail() {
  const { slug } = useParams()
  const { t, to } = useLocale()
  const p = pieces.find((x) => x.slug === slug) ?? pieces[0]
  useTitle(p.title)
  const more = pieces.filter((x) => x.slug !== p.slug).slice(0, 3)
  return (
    <Container>
      <PageHeader crumbs={[{ label: t({ en: 'Showcase', fa: 'ویترین' }), to: to('/showcase') }, { label: t(p.title) }]} title={t(p.title)} lead={t(p.maker)} />
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className={cn('overflow-hidden rounded-xl border border-line', p.curated && 'rail rail-gilt')}>
          <Cover piece={p} className="w-full" />
        </div>
        <Panel className="flex flex-col gap-5 self-start p-6">
          {p.curated && (
            <Tag tone="gilt" icon={Award01Icon}>
              {t({ en: 'Picked for the Hall', fa: 'منتخب تالار' })}
            </Tag>
          )}
          <p className="text-[17px] leading-relaxed">{t(p.line)}</p>
          <dl className="grid grid-cols-2 gap-3 text-[15px]">
            <dt className="text-ink-subtle">{t({ en: 'Field', fa: 'حوزه' })}</dt>
            <dd>{t(disciplines.find((d) => d.id === p.discipline)!.label)}</dd>
            <dt className="text-ink-subtle">{t({ en: 'Made by', fa: 'سازنده' })}</dt>
            <dd>{t(p.maker)}</dd>
          </dl>
          <ButtonLink to={to('/hire/new')} iconEnd={ArrowRight01Icon} directional>
            {t({ en: 'Hire for something similar', fa: 'برای کاری شبیه این استخدام کن' })}
          </ButtonLink>
        </Panel>
      </div>
      <h2 className="heading mt-20 mb-6 text-[22px]">{t({ en: 'More work', fa: 'کارهای بیشتر' })}</h2>
      <ul className="grid gap-4 sm:grid-cols-3">
        {more.map((m) => (
          <li key={m.slug}>
            <Link to={to(`/showcase/${m.slug}`)} className="lift block overflow-hidden rounded-lg border border-line bg-surface">
              <Cover piece={m} className="w-full" />
              <p className="p-4 font-medium">{t(m.title)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  )
}
