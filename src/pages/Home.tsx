import { AnimatePresence, motion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  Camera01Icon,
  ChartLineData01Icon,
  Coins01Icon,
  ComputerIcon,
  EyeIcon,
  FilmRoll01Icon,
  Globe02Icon,
  JusticeScale01Icon,
  MessageMultiple01Icon,
  MoneyReceive01Icon,
  PaintBoardIcon,
  QuillWrite01Icon,
  Shield01Icon,
  SmartPhone01Icon,
  Tick02Icon,
  UserCheck01Icon,
  Video01Icon,
} from '@hugeicons/core-free-icons'
import { Knight } from '../brand/Knights'
import { Logo } from '../brand/Logo'
import { LedCurtain } from '../brand/Stage'
import { agents } from '../data/agents'
import { jobs, pieces, sources } from '../data/market'
import { useLocale, type Bi } from '../i18n/locale'
import { useTitle } from '../layout/Shell'
import { estimate, type ProjectKind, type Size } from '../lib/merlin'
import { OathCard } from '../ui/cards'
import { ButtonLink, Choice, cn, Container, Hl, Icon, IconChip, SectionHead, type IconSvgElement } from '../ui/core'
import { Cover } from '../ui/covers'
import { Tabs } from '../ui/tabs'

/*
 * Home, in the order of the Figma landing (01 · Public / Landing, version 03):
 * hero with the LED curtain → services → numbers → product preview → how it works → why Lance →
 * the Lance ecosystem → talent → money safety → fees → FAQ → join banner.
 * Every section points at a real feature of the site, and every number on it is true.
 */

/* ───────────── Hero + services ───────────── */
const SERVICES: { label: Bi; icon: IconSvgElement; kind: ProjectKind }[] = [
  { label: { en: 'Visual identity', fa: 'هویت بصری' }, icon: EyeIcon, kind: 'brand' },
  { label: { en: 'SEO', fa: 'سئو' }, icon: ChartLineData01Icon, kind: 'content' },
  { label: { en: 'UI design', fa: 'طراحی رابط کاربری' }, icon: ComputerIcon, kind: 'website' },
  { label: { en: 'Web development', fa: 'توسعه وب‌سایت' }, icon: Globe02Icon, kind: 'website' },
  { label: { en: 'App development', fa: 'توسعه اپلیکیشن' }, icon: SmartPhone01Icon, kind: 'app' },
  { label: { en: 'Animation', fa: 'انیمیشن' }, icon: PaintBoardIcon, kind: 'video' },
  { label: { en: 'Photography', fa: 'عکاسی' }, icon: Camera01Icon, kind: 'video' },
  { label: { en: 'Script writing', fa: 'سناریونویسی' }, icon: QuillWrite01Icon, kind: 'content' },
  { label: { en: 'Filming', fa: 'فیلم‌برداری' }, icon: Video01Icon, kind: 'video' },
  { label: { en: 'Video editing', fa: 'تدوین' }, icon: FilmRoll01Icon, kind: 'video' },
]

function Hero() {
  const { t, to } = useLocale()
  return (
    <section className="relative isolate overflow-hidden">
      <LedCurtain className="h-[760px] [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]" />
      <Container className="relative pt-20 pb-10 text-center sm:pt-28">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="mx-auto max-w-[760px]">
          <h1 className="display text-[clamp(2.5rem,6vw,4.4rem)]">
            {t({ en: 'Hand your project to the ', fa: 'با خیال راحت، پروژه‌ت رو بسپار دست ' })}
            <Hl>{t({ en: 'professionals', fa: 'حرفه‌ای‌ها' })}</Hl>
            {t({ en: ', and relax.', fa: '.' })}
          </h1>
          <p className="mx-auto mt-6 max-w-[46ch] text-[clamp(1.05rem,1.8vw,1.3rem)] text-ink-muted">
            {t({ en: 'A team of specialists is a few clicks away. Or, if you are the specialist, every job site is in one list.', fa: 'یه تیم از متخصص‌ها، فقط چند کلیک با تو فاصله دارن. اگه خودت متخصصی، کار همه‌ی سایت‌ها توی یه فهرسته.' })}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink to={to('/hire/new')} size="lg" iconEnd={ArrowRight01Icon} directional className="min-w-[200px]">
              {t({ en: 'Post a project free', fa: 'ثبت پروژه رایگان' })}
            </ButtonLink>
            <ButtonLink to={to('/work')} size="lg" variant="outline" className="min-w-[200px]">
              {t({ en: 'Find work as a lancer', fa: 'ورود به عنوان فری‌لنسر' })}
            </ButtonLink>
          </div>
        </motion.div>
      </Container>

      <Container className="relative pt-16 pb-8 sm:pt-20">
        <SectionHead
          center
          title={
            <>
              {t({ en: 'Top services on ', fa: 'خدمات برتر ' })}
              <Hl>{t({ en: 'Lance', fa: 'لنس' })}</Hl>
            </>
          }
          lead={t({ en: 'From product development to content, all under one roof.', fa: 'از توسعه محصول تا تولید محتوا، همه چیز زیر یک سقف.' })}
        />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {SERVICES.map((s) => (
            <li key={s.label.en}>
              <Link
                to={`${to('/hire/new')}?kind=${s.kind}`}
                className="group flex h-[78px] items-center gap-3 rounded-[14px] bg-raised px-4 transition-colors hover:bg-line day:border day:border-line"
              >
                <IconChip icon={s.icon} size={42} />
                <span className="text-[15px] leading-snug font-medium">{t(s.label)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

/* ───────────── Numbers (true ones) ───────────── */
function Numbers() {
  const { t, num } = useLocale()
  const items: { n: string; label: Bi }[] = [
    { n: num(7), label: { en: 'job sites in one list', fa: 'سایت کاریابی در یه فهرست' } },
    { n: num(7), label: { en: 'agents at the Round Table', fa: 'دستیار در میزگرد' } },
    { n: num(0), label: { en: 'fee to post a project', fa: 'هزینه برای ثبت پروژه' } },
  ]
  return (
    <section aria-label={t({ en: 'Lance in numbers', fa: 'لنس به زبان عدد' })} className="py-20">
      <Container>
        <ul className="grid gap-10 text-center sm:grid-cols-3">
          {items.map((i) => (
            <li key={i.label.en}>
              <p className="display text-[clamp(3rem,6vw,4.25rem)] text-pink-ink tabular">{i.n}</p>
              <p className="mt-2 text-[18px] text-ink-muted">{t(i.label)}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

/* ───────────── Product preview: Job Radar in a device ───────────── */
function RadarPreview() {
  const { t, to, num, money } = useLocale()
  const list = [...jobs].sort((a, b) => b.fit - a.fit).slice(0, 4)
  return (
    <section aria-labelledby="radar-h" className="py-20">
      <Container className="grid items-center gap-12 lg:grid-cols-2 [&>*]:min-w-0">
        <div className="relative overflow-hidden rounded-xl border border-line/70 bg-surface p-6 sm:p-10">
          <span aria-hidden className="led absolute inset-0 opacity-80" />
          <div className="relative mx-auto max-w-[360px] rounded-[32px] border border-line-strong bg-ground p-3 shadow-[0_40px_80px_-30px_#000]">
            <div className="mx-auto mb-3 h-5 w-24 rounded-full bg-surface" aria-hidden />
            <p className="px-2 pb-2 text-[13px] text-ink-subtle">{t({ en: 'Job Radar · ranked by fit', fa: 'رادار کار · مرتب بر اساس تناسب' })}</p>
            <ul className="flex flex-col gap-2">
              {list.map((j) => (
                <li key={j.id} className="flex items-center gap-3 rounded-[16px] bg-raised p-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-pink-soft text-[13px] font-semibold text-pink-ink tabular">{num(j.fit)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium">{t(j.title)}</span>
                    <span className="block truncate text-[12px] text-ink-subtle">
                      {t(sources[j.source].name)} · {money(j.pay.amount, j.pay.currency, { compact: true })}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h2 id="radar-h" className="heading text-[clamp(1.6rem,2.8vw,2.25rem)]">
            {t({ en: 'Every job board, ', fa: 'همه‌ی سایت‌های کاریابی، ' })}
            <Hl>{t({ en: 'one list', fa: 'یه فهرست' })}</Hl>
          </h2>
          <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-ink-muted">
            {t({
              en: 'The Scout reads Lance, Ponisha, Karlancer, Jobinja, LinkedIn, Upwork and Remote OK, merges the same job posted twice, and ranks what is left by how well it fits your skills.',
              fa: 'پیشاهنگ لنس، پونیشا، کارلنسر، جابینجا، لینکدین، آپ‌ورک و ریموت‌اوکی رو می‌گرده، آگهی‌هایی که دو جا ثبت شدن رو یکی می‌کنه و بقیه رو بر اساس تناسب با مهارت‌هات مرتب می‌کنه.',
            })}
          </p>
          <ButtonLink to={to('/work')} size="lg" className="mt-8" iconEnd={ArrowRight01Icon} directional>
            {t({ en: 'Open Job Radar', fa: 'باز کردن رادار کار' })}
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}

/* ───────────── How it works: role toggle, four steps, dashed path ───────────── */
const HOW: Record<'lancer' | 'client', { label: Bi; icon: IconSvgElement }[]> = {
  lancer: [
    { label: { en: 'Send a proposal', fa: 'درخواست رو ثبت می‌کنی' }, icon: QuillWrite01Icon },
    { label: { en: 'The client accepts', fa: 'کارفرما قبول می‌کنه' }, icon: UserCheck01Icon },
    { label: { en: 'You agree the timeline', fa: 'زمان رو مشخص می‌کنی' }, icon: MessageMultiple01Icon },
    { label: { en: 'Deliver and get paid', fa: 'کار رو تحویل می‌دی و پولت رو می‌گیری' }, icon: Coins01Icon },
  ],
  client: [
    { label: { en: 'Post your project, free', fa: 'پروژه‌ت رو رایگان ثبت می‌کنی' }, icon: QuillWrite01Icon },
    { label: { en: 'Merlin suggests a fair price', fa: 'مرلین قیمت منصفانه پیشنهاد می‌ده' }, icon: ChartLineData01Icon },
    { label: { en: 'Pick a lancer, fund escrow', fa: 'لنسر رو انتخاب می‌کنی و پول رو امانت می‌ذاری' }, icon: UserCheck01Icon },
    { label: { en: 'Approve, and the money is released', fa: 'تأیید می‌کنی و پول آزاد می‌شه' }, icon: Tick02Icon },
  ],
}

function HowItWorks() {
  const { t, num } = useLocale()
  const [role, setRole] = useState<'lancer' | 'client'>('lancer')
  return (
    <section aria-labelledby="how-h" className="relative py-24">
      <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(40%_50%_at_0%_70%,color-mix(in_oklab,var(--pink)_10%,transparent),transparent),radial-gradient(40%_50%_at_100%_100%,color-mix(in_oklab,var(--pink)_8%,transparent),transparent)]" />
      <Container>
        <SectionHead
          center
          id="how-h"
          title={
            <>
              <Hl>{t({ en: 'Lance', fa: 'لنس' })}</Hl>
              {t({ en: ': how it works', fa: ' چطور کار می‌کنه؟' })}
            </>
          }
          lead={t({ en: 'Four simple steps to where you want to be.', fa: 'در چهار گام ساده به هدف خود برسید.' })}
        />
        <div className="mx-auto max-w-[520px]">
          <Tabs
            label={t({ en: 'Show steps for', fa: 'نمایش مراحل برای' })}
            value={role}
            onChange={setRole}
            className="flex w-full"
            options={[
              { value: 'lancer', label: t({ en: 'Lancer', fa: 'لنسر' }) },
              { value: 'client', label: t({ en: 'Employer', fa: 'کارفرما' }) },
            ]}
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.ol key={role} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mt-10 flex flex-col">
              {HOW[role].map((s, i) => (
                <li key={s.label.en} className="flex flex-col">
                  {/* Odd steps sit at the start edge with the number first; even steps at the end edge. */}
                  <div className={cn('flex items-center gap-3', i % 2 ? 'ms-auto flex-row-reverse' : 'me-auto flex-row')}>
                    <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-surface text-[15px] font-semibold text-pink-ink day:border day:border-line">{num(i + 1)}</span>
                    <span className="relative flex h-16 w-[min(300px,70vw)] items-center overflow-hidden rounded-[14px] border border-line/70 bg-raised px-5">
                      <Icon icon={s.icon} size={52} stroke={1.2} className="absolute end-3 text-ink/10" />
                      <span className="relative text-[15px] font-medium">{t(s.label)}</span>
                    </span>
                  </div>
                  {i < 3 && (
                    // The path runs from the start edge to the end edge, or back; drawn left-to-right, mirrored as needed.
                    <svg viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden className={cn('my-1 h-10 w-full text-pink/50', i % 2 ? 'rtl:-scale-x-100' : '-scale-x-100 rtl:scale-x-100')}>
                      <path d="M150 2 C 150 30, 60 10, 50 36" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />
                    </svg>
                  )}
                </li>
              ))}
            </motion.ol>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  )
}

/* ───────────── Why Lance ───────────── */
function WhyLance() {
  const { t } = useLocale()
  const cards: { title: Bi; line: Bi; icon: IconSvgElement }[] = [
    { title: { en: 'Choose with confidence', fa: 'انتخاب مطمئن' }, line: { en: 'See each lancer’s real samples, rating and history before work starts.', fa: 'پروفایل، نمونه‌کار و امتیاز واقعی هر فریلنسر رو قبل از شروع کار می‌بینی.' }, icon: UserCheck01Icon },
    { title: { en: 'Talk it through, in the open', fa: 'مصاحبه و توافق شفاف' }, line: { en: 'Chat before you start and agree the details and timeline in writing.', fa: 'قبل از شروع، با فریلنسر چت می‌کنی و روی جزئیات و زمان‌بندی پروژه توافق می‌کنید.' }, icon: MessageMultiple01Icon },
    { title: { en: 'Pay safely', fa: 'پرداخت امن' }, line: { en: 'The money waits with Lance until you approve the final delivery.', fa: 'پول پروژه تا تأیید نهایی تحویل کار، نزد لنس امانت می‌مونه.' }, icon: Shield01Icon },
  ]
  return (
    <section aria-labelledby="why-h" className="py-24">
      <Container>
        <SectionHead
          center
          id="why-h"
          title={
            <>
              {t({ en: 'Why keep working with ', fa: 'چرا کارتو با ' })}
              <Hl>{t({ en: 'Lance', fa: 'لنس' })}</Hl>
              {t({ en: '?', fa: ' ادامه بدی؟' })}
            </>
          }
          lead={t({ en: 'From choosing to getting paid, every step is built so you can relax.', fa: 'از انتخاب تا تسویه حساب، هر مرحله طوری طراحی شده که خیالت راحت باشه.' })}
        />
        <ul className="grid gap-4 md:grid-cols-3">
          {cards.map((c) => (
            <li key={c.title.en} className="rounded-lg border border-line/70 bg-surface p-2.5">
              <div className="relative grid h-[120px] place-items-center overflow-hidden rounded-[12px] bg-raised">
                <span aria-hidden className="led absolute inset-0 [mask-image:linear-gradient(to_right,#000,transparent_70%)] rtl:[mask-image:linear-gradient(to_left,#000,transparent_70%)]" style={{ ['--led-ink' as string]: 'var(--pink)' }} />
                <Icon icon={c.icon} size={52} stroke={1.4} className="relative text-pink-ink" />
              </div>
              <div className="px-2.5 pt-5 pb-3">
                <h3 className="text-[17px] font-semibold">{t(c.title)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{t(c.line)}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

/* ───────────── The Lance ecosystem (bento) ───────────── */
function Tile({ to, title, line, badge, children, className }: { to: string; title: string; line: string; badge?: string; children?: ReactNode; className?: string }) {
  return (
    <Link to={to} className={cn('group relative flex flex-col overflow-hidden rounded-lg border border-line/70 bg-surface p-6 transition-colors hover:border-line-strong', className)}>
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_100%_100%,color-mix(in_oklab,var(--pink)_9%,transparent),transparent)]" />
      {badge && <span className="absolute start-4 top-4 rounded-full bg-pink-soft px-2.5 py-0.5 text-[12px] font-medium text-pink-ink">{badge}</span>}
      <p className="relative text-center text-[20px] font-bold text-pink-ink">{title}</p>
      <p className="relative mt-1 text-center text-[14px] text-ink-muted">{line}</p>
      <div className="relative mt-5 flex flex-1 items-end justify-center">{children}</div>
    </Link>
  )
}

function Ecosystem() {
  const { t, to, lang, num, range } = useLocale()
  const [kind, setKind] = useState<ProjectKind>('website')
  const [size, setSize] = useState<Size>('m')
  const cur = lang === 'fa' ? 'IRT' : 'USD'
  const e = estimate({ kind, size, level: 'mid', urgency: 'normal', currency: cur })
  return (
    <section aria-labelledby="eco-h" className="py-24">
      <Container>
        <SectionHead
          center
          id="eco-h"
          title={
            <>
              {t({ en: 'The ', fa: 'منظومه ' })}
              <Hl>{t({ en: 'Lance', fa: 'لنس' })}</Hl>
              {t({ en: ' ecosystem', fa: '' })}
            </>
          }
          lead={t({ en: 'Lance is not only a job market; it is a set of tools that makes freelancing simpler.', fa: 'لنس فقط یک بازار کار نیست؛ مجموعه‌ای از ابزارهاست که فریلنسری رو ساده‌تر می‌کنه.' })}
        />
        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-[300px_300px]">
          <Tile to={to('/showcase')} title={t({ en: 'Showcase', fa: 'پورتفوی اختصاصی' })} line={t({ en: 'Your work, shown properly. The best goes to the Hall.', fa: 'نمایش مرتب و حرفه‌ای نمونه‌کارهای شما.' })}>
            <div className="flex items-end justify-center">
              {pieces.slice(0, 3).map((p, i) => (
                <Cover key={p.slug} piece={p} fill className={cn('h-20 w-24 rounded-[10px] border border-line-strong', i === 1 ? 'relative z-10 -mx-3 h-24 w-28 -translate-y-2' : 'opacity-80')} />
              ))}
            </div>
          </Tile>

          {/* Merlin: tall, with a working mini estimate. */}
          <div className="relative flex flex-col overflow-hidden rounded-lg border border-line/70 bg-surface p-6 md:row-span-2">
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_100%,color-mix(in_oklab,var(--pink)_14%,transparent),transparent)]" />
            <span className="absolute start-4 top-4 rounded-full bg-pink-soft px-2.5 py-0.5 text-[12px] font-medium text-pink-ink">{t({ en: 'AI', fa: 'هوش مصنوعی' })}</span>
            <p className="relative text-center text-[20px] font-bold text-pink-ink">{t({ en: 'Merlin', fa: 'مرلین' })}</p>
            <p className="relative mt-1 text-center text-[14px] text-ink-muted">{t({ en: 'AI pricing for projects, with its reasons.', fa: 'سامانه قیمت‌گذاری پروژه‌ها با هوش مصنوعی' })}</p>
            <div className="relative mt-6 flex flex-col gap-4">
              <Choice label={t({ en: 'Project type', fa: 'نوع پروژه' })} value={kind} onChange={(v) => setKind(v as ProjectKind)} options={[{ value: 'website', label: t({ en: 'Website', fa: 'وب‌سایت' }) }, { value: 'app', label: t({ en: 'App', fa: 'اپ' }) }, { value: 'brand', label: t({ en: 'Brand', fa: 'برند' }) }]} />
              <Choice label={t({ en: 'Size', fa: 'اندازه' })} value={size} onChange={(v) => setSize(v as Size)} options={[{ value: 's', label: t({ en: 'Small', fa: 'کوچیک' }) }, { value: 'm', label: t({ en: 'Medium', fa: 'متوسط' }) }, { value: 'l', label: t({ en: 'Large', fa: 'بزرگ' }) }]} />
            </div>
            <div className="relative mt-6 text-center" aria-live="polite">
              <p className="text-[14px] text-ink-subtle">{t({ en: 'Fair range', fa: 'برآورد هزینه پروژه' })}</p>
              <p className="mt-1 text-[clamp(1.4rem,2.4vw,1.8rem)] font-bold text-pink-ink tabular">{range(e.low, e.high, cur)}</p>
              <p className="text-[13px] text-ink-subtle">{t({ en: `about ${e.days} days`, fa: `حدود ${num(e.days)} روز` })}</p>
            </div>
            <div className="relative mt-auto flex items-end justify-between gap-4 pt-6">
              <ButtonLink to={to('/merlin')} variant="pinkline" iconEnd={ArrowRight01Icon} directional>
                {t({ en: 'Full price check', fa: 'تخمین کامل' })}
              </ButtonLink>
              <Knight who="merlin" label="" tile={false} className="h-28 w-auto" />
            </div>
          </div>

          <Tile to={to('/learn')} title={t({ en: 'Learn', fa: 'یادگیری' })} line={t({ en: 'Free paths from your first lesson to your first client.', fa: 'مسیرهای رایگان از اولین درس تا اولین کارفرما.' })}>
            <div className="flex gap-3">
              {(['scribe', 'scout', 'sentinel'] as const).map((k) => (
                <Knight key={k} who={k} label="" className="h-24 w-auto" />
              ))}
            </div>
          </Tile>
          <Tile to={to('/agents')} title={t({ en: 'The Round Table', fa: 'میزگرد دستیارها' })} line={t({ en: 'Seven agents for routine work. Nothing is sent without you.', fa: 'هفت دستیار برای کارهای تکراری؛ بدون تأیید تو چیزی فرستاده نمی‌شه.' })} badge={t({ en: 'New!', fa: 'جدید!' })}>
            <div className="flex gap-2">
              {agents.slice(1, 5).map((a) => (
                <Knight key={a.id} who={a.id} label="" className="h-20 w-auto" />
              ))}
            </div>
          </Tile>
          <Tile to={to('/plus')} title={t({ en: 'Lance Plus', fa: 'لنس پلاس' })} line={t({ en: 'A CV for each job, sprints from any brief, lower fees.', fa: 'رزومه برای هر آگهی، برنامه‌ی اسپرینت از هر بریف، کارمزد کمتر.' })}>
            <span className="flex items-center gap-2 leading-none">
              <Logo size={40} color="var(--pink)" />
              <span className="text-[48px] font-black text-pink-ink">+</span>
            </span>
          </Tile>
        </div>
      </Container>
    </section>
  )
}

/* ───────────── Talent: stacked Hall cards ───────────── */
function Talent() {
  const { t, to } = useLocale()
  const picks = pieces.filter((p) => p.curated).concat(pieces.filter((p) => !p.curated)).slice(0, 4)
  const [i, setI] = useState(0)
  const at = (k: number) => picks[(i + k + picks.length) % picks.length]
  return (
    <section aria-labelledby="talent-h" className="py-24">
      <Container className="grid items-center gap-14 lg:grid-cols-2 [&>*]:min-w-0">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-pink-soft px-3.5 py-1.5 text-[13px] font-medium text-pink-ink">
            <span className="size-1.5 rounded-full bg-pink" aria-hidden />
            {t({ en: 'New talent on Lance', fa: 'استعدادهای جدید لنس' })}
          </span>
          <h2 id="talent-h" className="heading mt-6 text-[clamp(1.6rem,2.8vw,2.25rem)]">
            {t({ en: 'Meet the best ', fa: 'با بهترین ' })}
            <Hl>{t({ en: 'lancers on Lance', fa: 'فریلنسرهای لنس' })}</Hl>
            {t({ en: ' up close', fa: ' از نزدیک آشنا شو' })}
          </h2>
          <ul className="mt-6 flex flex-col gap-3 text-[15px] text-ink-muted">
            {[
              { en: 'Every profile has real samples, a rating and its project history.', fa: 'هر پروفایل شامل نمونه‌کار واقعی، امتیاز و تاریخچه پروژه‌هاست.' },
              { en: 'Talk and interview directly before work starts.', fa: 'قبل از شروع کار، مستقیم با فری‌لنسر گفتگو و مصاحبه می‌کنی.' },
              { en: 'The Hall holds work the Lance team picked, with how it was made.', fa: 'تالار، کارهاییه که تیم لنس انتخاب کرده؛ همراه با داستان ساختشون.' },
            ].map((b) => (
              <li key={b.en} className="flex gap-3">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-ink-muted" aria-hidden />
                {t(b)}
              </li>
            ))}
          </ul>
          <ButtonLink to={to('/showcase')} size="lg" className="mt-8">
            {t({ en: 'See the Showcase', fa: 'مشاهده ویترین' })}
          </ButtonLink>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative h-[360px] w-full max-w-[460px]">
            {[-1, 1, 0].map((k) => {
              const p = at(k)
              return (
                <motion.div
                  key={`${p.slug}-${k}`}
                  initial={false}
                  animate={{ rotate: k * 6, x: `${k * 22}%`, scale: k === 0 ? 1 : 0.9, opacity: k === 0 ? 1 : 0.55 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={cn('absolute inset-x-[18%] inset-y-0 overflow-hidden rounded-[22px] border border-line-strong bg-raised', k === 0 ? 'z-10' : 'z-0')}
                >
                  <Link to={to(`/showcase/${p.slug}`)} tabIndex={k === 0 ? 0 : -1} aria-hidden={k !== 0} className="relative block h-full">
                    <Cover piece={p} fill className="h-full w-full" />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5 pt-16 text-white">
                      <span className="block text-[17px] font-bold text-[#FF7FE3]">{t(p.maker)}</span>
                      <span className="block text-[14px]">{t(p.title)}</span>
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </div>
          <div className="mt-5 flex gap-1.5 rounded-full bg-surface p-2" role="group" aria-label={t({ en: 'Choose a piece', fa: 'انتخاب نمونه‌کار' })}>
            {picks.map((p, k) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => setI(k)}
                aria-label={t(p.title)}
                aria-pressed={k === i}
                className={cn('h-2 rounded-full transition-all duration-200', k === i ? 'w-6 bg-pink' : 'w-2 bg-line-strong hover:bg-ink-subtle')}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ───────────── Starters (oath cards) ───────────── */
function Starters() {
  const { t, to } = useLocale()
  return (
    <section aria-labelledby="start-h" className="py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1.3fr] [&>*]:min-w-0">
        <div>
          <h2 id="start-h" className="heading text-[clamp(1.6rem,2.8vw,2.25rem)]">
            {t({ en: 'New to freelancing? ', fa: 'تازه شروع کردی؟ ' })}
            <Hl>{t({ en: 'Start with a path.', fa: 'با یه مسیر شروع کن.' })}</Hl>
          </h2>
          <p className="mt-5 max-w-[46ch] text-[17px] text-ink-muted">
            {t({
              en: 'Free paths take you from your first lesson to your first paid job: learn, make one real piece, show it, price it with Merlin, and send a proposal the Herald helped you write.',
              fa: 'مسیرهای رایگان، از اولین درس تا اولین کار پولی همراهتن: یاد بگیر، یه کار واقعی بساز، نشونش بده، با مرلین قیمتش رو بسنج و پیشنهادی بفرست که جارچی کمکت کرده بنویسی.',
            })}
          </p>
          <ButtonLink to={to('/learn')} size="lg" className="mt-8" iconEnd={ArrowRight01Icon} directional>
            {t({ en: 'See the paths', fa: 'دیدن مسیرها' })}
          </ButtonLink>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <OathCard who="steward" tone="sun" label={t({ en: 'The Steward', fa: 'پیشکار' })} oath={t({ en: 'I ship small and often', fa: 'کم‌کم، ولی همیشه تحویل می‌دم' })} />
          <OathCard who="herald" tone="pink" label={t({ en: 'The Herald', fa: 'جارچی' })} oath={t({ en: 'I ask before I assume', fa: 'قبل از حدس زدن، می‌پرسم' })} />
          <div className="hidden sm:block">
            <OathCard who="smith" tone="dark" label={t({ en: 'The Smith', fa: 'آهنگر' })} oath={t({ en: 'I price my time fairly', fa: 'برای وقتم قیمت منصفانه می‌ذارم' })} />
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ───────────── Money safety + fees (Figma "Features" and "Lancer & Employer" sections) ───────────── */
function MoneySafe() {
  const { t, num } = useLocale()
  const cards: { title: Bi; line: Bi; icon: IconSvgElement }[] = [
    { title: { en: 'Release on approval', fa: 'آزادسازی با تأیید' }, line: { en: 'The client funds escrow first; the money reaches the lancer when the delivery is approved.', fa: 'کارفرما اول پول رو امانت می‌ذاره و با تأیید تحویل، پول به دست لنسر می‌رسه.' }, icon: Coins01Icon },
    { title: { en: 'Dispute review', fa: 'داوری اختلاف' }, line: { en: 'If you disagree about quality or timing, the Lance team reviews the agreement and decides.', fa: 'اگه سر کیفیت یا زمان تحویل اختلافی پیش بیاد، تیم لنس بررسی و تصمیم‌گیری می‌کنه.' }, icon: JusticeScale01Icon },
    { title: { en: 'Refund', fa: 'بازگشت وجه' }, line: { en: 'If the work is not delivered as agreed, the client gets the money back in full.', fa: 'اگه کار طبق توافق تحویل داده نشه، پول کارفرما به‌طور کامل برمی‌گرده.' }, icon: MoneyReceive01Icon },
  ]
  return (
    <section aria-labelledby="safe-h" className="py-24">
      <Container>
        <SectionHead
          center
          id="safe-h"
          title={t({ en: 'Your money stays safe until the work is done', fa: 'پول شما، تا پایان کار امن می‌مونه' })}
          lead={t({ en: 'Every payment runs through escrow: neither side can be left without their money or their work.', fa: 'هر پرداخت روی لنس از طریق یک سیستم امن مدیریت می‌شه؛ نه کارفرما بی‌کار می‌مونه، نه لنسر بی‌پول.' })}
        />
        <ol className="grid gap-4 md:grid-cols-3">
          {cards.map((c, i) => (
            <li key={c.title.en} className="relative rounded-lg border border-line/70 bg-surface p-6 text-center">
              <span className="absolute start-4 top-4 grid size-7 place-items-center rounded-[8px] bg-raised text-[13px] font-semibold text-ink-muted">{num(i + 1)}</span>
              <div className="mx-auto grid size-28 place-items-center">
                <Icon icon={c.icon} size={64} stroke={1.2} className="text-pink-ink" />
              </div>
              <span aria-hidden className="mx-auto -mt-2 block h-2.5 w-16 rounded-full bg-pink-soft" />
              <h3 className="mt-6 text-[18px] font-semibold">{t(c.title)}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{t(c.line)}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}

function Fees() {
  const { t } = useLocale()
  const cards: { who: Bi; title: Bi; line: Bi }[] = [
    { who: { en: 'For lancers', fa: 'برای فری‌لنسرها' }, title: { en: 'A fee only on a successful project', fa: 'کارمزد فقط روی پروژه‌ی موفق' }, line: { en: 'Until you land a project, nothing is taken. You see the fee before you accept any offer.', fa: 'تا وقتی پروژه‌ای نگیری، هیچ کارمزدی ازت کم نمی‌شه. درصد کارمزد رو قبل از پذیرفتن هر پیشنهاد می‌بینی.' } },
    { who: { en: 'For employers', fa: 'برای کارفرماها' }, title: { en: 'Posting a project, always free', fa: 'ثبت پروژه، همیشه رایگان' }, line: { en: 'No charge to post a project or interview lancers. You pay only when you fund escrow.', fa: 'هیچ هزینه‌ای برای ثبت پروژه یا مصاحبه با فریلنسرها گرفته نمی‌شه. فقط وقتی پول رو امانت می‌ذاری پرداخت می‌کنی.' } },
  ]
  return (
    <section aria-labelledby="fees-h" className="py-24">
      <Container>
        <SectionHead
          center
          id="fees-h"
          title={t({ en: 'Transparent, no hidden fees', fa: 'شفاف، بدون هزینه پنهان' })}
          lead={t({ en: 'You know Lance’s fee in advance. No surprises halfway through.', fa: 'کارمزد لنس رو از قبل می‌دونی؛ هیچ سورپرایزی وسط راه نیست.' })}
        />
        <ul className="mx-auto grid max-w-[1024px] gap-4 md:grid-cols-2">
          {cards.map((c) => (
            <li key={c.who.en} className="rounded-lg border border-line/70 bg-surface p-6">
              <p className="text-[14px] text-ink-subtle">{t(c.who)}</p>
              <h3 className="mt-2 text-[22px] font-bold text-pink-ink">{t(c.title)}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">{t(c.line)}</p>
              <p className="mt-4 border-t border-line pt-4 text-[13px] text-ink-subtle">{t({ en: 'Final percentages and terms are set by Lance’s finance team.', fa: 'اعداد و شرایط نهایی رو تیم مالی لنس مشخص می‌کنه.' })}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

/* ───────────── FAQ ───────────── */
function Faq() {
  const { t } = useLocale()
  const qs: { q: Bi; a: Bi }[] = [
    { q: { en: 'How does Lance work?', fa: 'لنس چطوری کار می‌کنه؟' }, a: { en: 'Employers post a project for free and Merlin suggests a fair budget. Lancers propose, the employer chooses and funds escrow, and the money is released when the work is approved.', fa: 'کارفرما پروژه رو رایگان ثبت می‌کنه و مرلین یه بودجه‌ی منصفانه پیشنهاد می‌ده. لنسرها پیشنهاد می‌فرستن، کارفرما انتخاب می‌کنه و پول رو امانت می‌ذاره، و با تأیید کار، پول آزاد می‌شه.' } },
    { q: { en: 'How do I post a project?', fa: 'چطوری می‌تونم پروژه ثبت کنم؟' }, a: { en: 'Four short steps: what you need, the details, the price (Merlin fills it in), and a review. Your draft is saved as you go.', fa: 'چهار مرحله‌ی کوتاه: چی لازم داری، جزئیات، قیمت (مرلین پیشنهاد می‌ده) و مرور. پیش‌نویست هم‌زمان ذخیره می‌شه.' } },
    { q: { en: 'Where do the jobs on the Radar come from?', fa: 'آگهی‌های رادار کار از کجا میان؟' }, a: { en: 'From Lance and six other sites. External jobs open on their original site; Lance never re-posts them.', fa: 'از لنس و شش سایت دیگه. آگهی‌های بیرونی روی سایت اصلی‌شون باز می‌شن؛ لنس هیچ‌وقت دوباره منتشرشون نمی‌کنه.' } },
    { q: { en: 'Do the agents act on their own?', fa: 'دستیارها خودشون کاری انجام می‌دن؟' }, a: { en: 'No. Every agent shows its plan and each step, and stops for your approval before anything is sent, paid or published.', fa: 'نه. هر دستیار برنامه و همه‌ی مراحلش رو نشون می‌ده و قبل از فرستادن، پرداخت یا انتشار هر چیزی منتظر تأیید تو می‌مونه.' } },
  ]
  return (
    <section aria-labelledby="faq-h" className="py-24">
      <Container>
        <SectionHead center id="faq-h" title={t({ en: 'Frequently asked', fa: 'سوالات متداول' })} lead={t({ en: 'Short answers to what people ask before their first project.', fa: 'جواب کوتاه به سؤال‌هایی که آدم‌ها قبل از اولین پروژه می‌پرسن.' })} />
        <div className="mx-auto flex max-w-[640px] flex-col gap-3">
          {qs.map((x) => (
            <details key={x.q.en} className="group rounded-[12px] bg-raised day:border day:border-line">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
                {t(x.q)}
                <Icon icon={ArrowDown01Icon} size={18} className="text-ink-muted transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 text-[15px] leading-relaxed text-ink-muted">{t(x.a)}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ───────────── Join banner ───────────── */
function JoinBanner() {
  const { t, to } = useLocale()
  return (
    <section className="pt-12">
      <Container>
        <div className="relative overflow-hidden rounded-[20px] bg-pink px-6 py-16 text-center text-[#0D0D0D] shadow-[0_30px_80px_-40px_var(--pink)]">
          <span aria-hidden className="absolute inset-0 opacity-25 [background-image:repeating-linear-gradient(135deg,#fff_0_1px,transparent_1px_14px)]" />
          <h2 className="relative heading text-[clamp(1.6rem,3vw,2.4rem)]">
            {t({ en: 'Not a ', fa: 'هنوز عضو ' })}
            <span className="font-black">{t({ en: 'Lance', fa: 'لنس' })}</span>
            {t({ en: ' member yet?', fa: ' نیستی؟' })}
          </h2>
          <ButtonLink to={to('/start')} variant="onpink" size="lg" className="relative mt-8">
            {t({ en: 'Start now', fa: 'همین الان شروع کن' })}
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}

export default function Home() {
  useTitle({ en: 'Freelancing, done well', fa: 'فریلنسری، درست و حسابی' })
  return (
    <>
      <Hero />
      <Numbers />
      <RadarPreview />
      <HowItWorks />
      <WhyLance />
      <Ecosystem />
      <Talent />
      <Starters />
      <MoneySafe />
      <Fees />
      <Faq />
      <JoinBanner />
    </>
  )
}
