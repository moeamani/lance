import { motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight01Icon, Briefcase01Icon, Search01Icon, Task01Icon, UserAdd01Icon } from '@hugeicons/core-free-icons'
import { Knight } from '../brand/Knights'
import { Doors, type DoorTone } from '../brand/Doors'
import { Beams, LedWall } from '../brand/Stage'
import { agents } from '../data/agents'
import { jobs, pieces, sources } from '../data/market'
import { useLocale, type Bi } from '../i18n/locale'
import { useTitle } from '../layout/Shell'
import { estimate, KINDS, type ProjectKind, type Size } from '../lib/merlin'
import { Bar, GuideCard, OathCard, Vignette } from '../ui/cards'
import { ButtonLink, Choice, Container, Icon, Panel, Pip, SectionHead, Tag } from '../ui/core'
import { Cover } from '../ui/covers'

const DOORS: { to: string; name: Bi; line: Bi; tone: DoorTone }[] = [
  { to: '/work', tone: 'sky', name: { en: 'Work', fa: 'کاریابی' }, line: { en: 'Jobs from every site, in one list', fa: 'آگهی‌های همه‌ی سایت‌ها، در یه فهرست' } },
  { to: '/hire', tone: 'pink', name: { en: 'Hire', fa: 'استخدام' }, line: { en: 'A person, a package, or a PMO', fa: 'یه نفر، یه بسته‌ی آماده یا مدیریت کامل پروژه' } },
  { to: '/agents', tone: 'mint', name: { en: 'Agents', fa: 'دستیارها' }, line: { en: 'Seven knights for routine work', fa: 'هفت شوالیه برای کارهای تکراری' } },
  { to: '/learn', tone: 'sun', name: { en: 'Learn', fa: 'یادگیری' }, line: { en: 'Start from zero, or teach', fa: 'از صفر شروع کن، یا درس بده' } },
  { to: '/showcase', tone: 'ember', name: { en: 'Showcase', fa: 'ویترین' }, line: { en: 'Show your work, see the best', fa: 'کارت رو نشون بده، بهترین‌ها رو ببین' } },
]

/**
 * The stage: the Lancer on an LED wall, two beams, and the brand line from the posters.
 * Always dark, like the brand's event stage, in both themes.
 */
function Hero() {
  const { t, to } = useLocale()
  return (
    <section className="night relative isolate overflow-hidden border-b border-line bg-ground text-ink">
      <LedWall figure="lancer" className="top-[38%] lg:top-0" fit={0.9} align={0.86} />
      <Beams className="opacity-60" />
      <span aria-hidden className="absolute inset-0 -z-0 bg-[linear-gradient(to_bottom,var(--ground)_30%,transparent_62%)] lg:bg-[linear-gradient(to_right,var(--ground)_34%,transparent_64%)] rtl:lg:bg-[linear-gradient(to_left,var(--ground)_34%,transparent_64%)]" />
      <Container className="relative flex min-h-[640px] flex-col justify-start pt-16 pb-[300px] sm:pt-24 lg:min-h-[680px] lg:justify-center lg:py-24">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="max-w-[640px]">
          <p className="numeral flex items-center gap-3 text-[13px] text-pink">
            <Pip pulse />
            {t({ en: 'A place for everyone', fa: 'جایی برای همه' })}
          </p>
          <h1 className="display mt-5 text-[clamp(2.8rem,7vw,5.6rem)]">{t({ en: 'For lancers, by freelancers.', fa: 'برای لنسرها، از فری‌لنسرها.' })}</h1>
          <p className="mt-6 max-w-[50ch] text-[19px] text-ink-muted">
            {t({
              en: 'Jobs from every site in one list, fair prices from Merlin, free paths for starters, and seven knights that take the routine work off your desk.',
              fa: 'آگهی همه‌ی سایت‌ها توی یه فهرست، قیمت منصفانه از مرلین، مسیرهای رایگان برای تازه‌کارها و هفت شوالیه که کارهای تکراری رو از دوشت برمی‌دارن.',
            })}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink to={to('/work')} size="lg" iconEnd={ArrowRight01Icon} directional>
              {t({ en: 'Find work', fa: 'دنبال کار بگرد' })}
            </ButtonLink>
            <ButtonLink to={to('/hire/new')} size="lg" variant="outline">
              {t({ en: 'Post a project', fa: 'پروژه ثبت کن' })}
            </ButtonLink>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

function DoorsSection() {
  const { t } = useLocale()
  return (
    <section aria-labelledby="doors-h" className="pt-16 pb-8">
      <Container>
        <h2 id="doors-h" className="sr-only">
          {t({ en: 'Where do you want to go?', fa: 'می‌خوای کجا بری؟' })}
        </h2>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
          <Doors doors={DOORS} />
        </motion.div>
      </Container>
    </section>
  )
}

function Radar() {
  const { t, to, money, ago, num } = useLocale()
  const list = [...jobs].sort((a, b) => b.fit - a.fit).slice(0, 4)
  return (
    <section aria-labelledby="radar-h" className="py-24">
      <Container>
        <SectionHead
          id="radar-h"
          title={t({ en: 'Every job board, read for you', fa: 'همه‌ی سایت‌های کاریابی، یه‌جا' })}
          lead={t({
            en: 'The Scout checks seven sites, merges the same job posted twice, and ranks what is left by how well it fits your skills.',
            fa: 'پیشاهنگ هفت سایت رو می‌گرده، آگهی‌هایی که دو جا ثبت شدن رو یکی می‌کنه و بقیه رو بر اساس تناسب با مهارت‌هات مرتب می‌کنه.',
          })}
          action={
            <ButtonLink to={to('/work')} variant="outline" iconEnd={ArrowRight01Icon} directional>
              {t({ en: 'Open Job Radar', fa: 'باز کردن رادار کار' })}
            </ButtonLink>
          }
        />
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr] [&>*]:min-w-0">
          <Panel rail="pink" className="p-2">
            <ul className="divide-y divide-line">
              {list.map((j) => (
                <li key={j.id}>
                  <Link to={to(`/work/${j.id}`)} className="flex items-center gap-4 rounded-md px-4 py-4 transition-colors hover:bg-raised">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line text-[14px] tabular" aria-label={t({ en: `${j.fit}% fit`, fa: `${num(j.fit)}٪ تناسب` })}>
                      {num(j.fit)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{t(j.title)}</span>
                      <span className="mt-0.5 block truncate text-[14px] text-ink-subtle">
                        {t(sources[j.source].name)} · {ago(j.posted)}
                      </span>
                    </span>
                    <span className="hidden shrink-0 text-[15px] text-ink-muted tabular sm:block">{money(j.pay.amount, j.pay.currency, { compact: true })}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
          <div className="grid gap-4">
            <Panel className="p-6">
              <p className="text-[14px] text-ink-subtle">{t({ en: 'Sources the Scout reads', fa: 'سایت‌هایی که پیشاهنگ می‌گرده' })}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.values(sources).map((s) => (
                  <Tag key={s.name.en}>{t(s.name)}</Tag>
                ))}
              </div>
              <p className="mt-5 text-[14px] text-ink-muted">
                {t({ en: 'External jobs open on the original site. Lance never re-posts them.', fa: 'آگهی‌های بیرونی روی سایت اصلی‌شون باز می‌شن؛ لنس هیچ‌وقت دوباره منتشرشون نمی‌کنه.' })}
              </p>
            </Panel>
            <Link to={to('/agents/scout')} className="lift flex items-center gap-4 rounded-lg border border-line bg-surface p-4">
              <Knight who="scout" label={t(agents[1].name)} className="h-20 w-16 shrink-0" />
              <span className="flex-1">
                <span className="block font-medium">{t(agents[1].name)}</span>
                <span className="block text-[14px] text-ink-muted">{t(agents[1].role)}</span>
              </span>
              <Icon icon={ArrowRight01Icon} directional className="text-ink-subtle" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

function MerlinMoment() {
  const { t, to, lang, num, range } = useLocale()
  const [kind, setKind] = useState<ProjectKind>('website')
  const [size, setSize] = useState<Size>('m')
  const e = estimate({ kind, size, level: 'mid', urgency: 'normal', currency: lang === 'fa' ? 'IRT' : 'USD' })
  const cur = lang === 'fa' ? 'IRT' : 'USD'
  return (
    <section aria-labelledby="merlin-h" className="border-y border-line bg-sunken py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Knight who="merlin" label={t({ en: 'Merlin', fa: 'مرلین' })} className="mb-8 h-44 w-36" />
          <h2 id="merlin-h" className="heading text-[clamp(1.75rem,3vw,2.5rem)]">
            {t({ en: 'What should this project cost?', fa: 'این پروژه چقدر باید هزینه داشته باشه؟' })}
          </h2>
          <p className="mt-4 max-w-[48ch] text-ink-muted">
            {t({
              en: 'Merlin is the pricing engine behind every project on Lance. Pick a type and a size and watch the range move. The full check asks four questions and explains every number.',
              fa: 'مرلین موتور قیمت‌گذاری همه‌ی پروژه‌های لنسه. نوع و اندازه‌ی کار رو انتخاب کن و ببین بازه چطور تغییر می‌کنه. بررسی کامل چهار تا سؤال می‌پرسه و دلیل هر عدد رو می‌گه.',
            })}
          </p>
        </div>
        <Panel rail="pink" className="p-6 sm:p-8">
          <fieldset>
            <legend className="mb-3 text-[15px] font-medium">{t({ en: 'Type of project', fa: 'نوع پروژه' })}</legend>
            <Choice label={t({ en: 'Type of project', fa: 'نوع پروژه' })} value={kind} onChange={(v) => setKind(v as ProjectKind)} options={KINDS.map((k) => ({ value: k.id, label: t(k.label) }))} />
          </fieldset>
          <fieldset className="mt-6">
            <legend className="mb-3 text-[15px] font-medium">{t({ en: 'Size', fa: 'اندازه' })}</legend>
            <Choice
              label={t({ en: 'Size', fa: 'اندازه' })}
              value={size}
              onChange={(v) => setSize(v as Size)}
              options={[
                { value: 's', label: t({ en: 'Small', fa: 'کوچیک' }) },
                { value: 'm', label: t({ en: 'Medium', fa: 'متوسط' }) },
                { value: 'l', label: t({ en: 'Large', fa: 'بزرگ' }) },
              ]}
            />
          </fieldset>
          <div className="mt-8 border-t border-line pt-6" aria-live="polite">
            <p className="text-[14px] text-ink-subtle">{t({ en: 'Fair range, mid-level freelancer', fa: 'بازه‌ی منصفانه، با یه فریلنسر سطح متوسط' })}</p>
            <p className="mt-1 text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tabular">
              {range(e.low, e.high, cur)}
            </p>
            <p className="mt-1 text-[14px] text-ink-muted">{t({ en: `About ${e.days} days of work`, fa: `حدود ${num(e.days)} روز کار` })}</p>
          </div>
          <ButtonLink to={to('/agents/merlin')} variant="outline" className="mt-6" iconEnd={ArrowRight01Icon} directional>
            {t({ en: 'Do the full price check', fa: 'بررسی کامل قیمت' })}
          </ButtonLink>
        </Panel>
      </Container>
    </section>
  )
}

function RoundTable() {
  const { t, to } = useLocale()
  return (
    <section aria-labelledby="rt-h" className="py-24">
      <Container>
        <SectionHead
          id="rt-h"
          title={t({ en: 'The Round Table', fa: 'میزگرد شوالیه‌ها' })}
          lead={t({
            en: 'Each agent does one job well, shows you every step, and stops before anything leaves your account.',
            fa: 'هر دستیار یه کار رو خوب انجام می‌ده، همه‌ی مراحل رو نشونت می‌ده و قبل از این‌که چیزی از حسابت بیرون بره، صبر می‌کنه.',
          })}
          action={
            <ButtonLink to={to('/agents')} variant="outline" iconEnd={ArrowRight01Icon} directional>
              {t({ en: 'Meet all seven', fa: 'آشنایی با هر هفت‌تا' })}
            </ButtonLink>
          }
        />
        <ul className="no-scrollbar -mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:grid-cols-7">
          {agents.map((a) => (
            <li key={a.id} className="w-[44%] shrink-0 snap-start sm:w-auto">
              <Link to={to(`/agents/${a.id}`)} className="group block">
                <Knight who={a.id} label={t(a.name)} className="aspect-[4/5] w-full transition-transform duration-200 group-hover:-translate-y-1" />
                <p className="mt-3 font-medium">{t(a.name)}</p>
                <p className="text-[14px] leading-snug text-ink-muted">{t(a.role)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

function Starters() {
  const { t, to } = useLocale()
  return (
    <section aria-labelledby="start-h" className="py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <h2 id="start-h" className="heading text-[clamp(1.75rem,3vw,2.5rem)]">
              {t({ en: 'New to freelancing? Start with a path.', fa: 'تازه می‌خوای فریلنسر بشی؟ با یه مسیر شروع کن.' })}
            </h2>
            <p className="mt-4 max-w-[48ch] text-ink-muted">
              {t({
                en: 'Free paths take you from your first lesson to your first paid job: learn, make one real piece, show it, price it with Merlin, and send a proposal the Herald helped you write.',
                fa: 'مسیرهای رایگان از درس اول تا اولین کار پولی همراهتن: یاد بگیر، یه نمونه‌کار واقعی بساز، توی ویترین بذارش، با مرلین قیمتش رو دربیار و پیشنهادی بفرست که جارچی کمکت کرده بنویسی.',
              })}
            </p>
            <ButtonLink to={to('/learn')} className="mt-8" iconEnd={ArrowRight01Icon} directional>
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
        </div>
      </Container>
    </section>
  )
}

function Hall() {
  const { t, to } = useLocale()
  const picks = pieces.filter((p) => p.curated).concat(pieces.filter((p) => !p.curated)).slice(0, 4)
  return (
    <section aria-labelledby="hall-h" className="py-24">
      <Container>
        <SectionHead
          id="hall-h"
          title={t({ en: 'From the Hall', fa: 'منتخب تالار' })}
          lead={t({ en: 'Work the Lance team picked from the Showcase this month, with the story of how it was made.', fa: 'کارهایی که تیم لنس این ماه از ویترین انتخاب کرده، همراه با داستان ساختشون.' })}
          action={
            <ButtonLink to={to('/showcase')} variant="outline" iconEnd={ArrowRight01Icon} directional>
              {t({ en: 'Open the Showcase', fa: 'رفتن به ویترین' })}
            </ButtonLink>
          }
        />
        <ul className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
          {picks.slice(0, 3).map((p, i) => (
            <li key={p.slug} className={i === 0 ? 'md:row-span-2' : ''}>
              <Link to={to(`/showcase/${p.slug}`)} className="group block overflow-hidden rounded-lg border border-line bg-surface">
                <div className="overflow-hidden">
                  <Cover piece={p} fill className={`w-full transition-transform duration-300 group-hover:scale-[1.02] ${i === 0 ? 'aspect-[4/3] md:h-[452px] md:aspect-auto' : 'aspect-[16/9]'}`} />
                </div>
                <div className="flex items-start justify-between gap-3 p-4">
                  <div>
                    <p className="font-medium">{t(p.title)}</p>
                    <p className="text-[14px] text-ink-subtle">{t(p.maker)}</p>
                  </div>
                  {p.curated && <Tag tone="sun">{t({ en: 'Hall pick', fa: 'منتخب' })}</Tag>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

function HowItWorks() {
  const { t, to } = useLocale()
  return (
    <section aria-labelledby="how-h" className="py-24">
      <Container>
        <SectionHead id="how-h" title={t({ en: 'Three things to try first', fa: 'سه کاری که اول امتحان کنی' })} lead={t({ en: 'Each takes less than five minutes.', fa: 'هر کدوم کمتر از پنج دقیقه وقت می‌گیره.' })} />
        <div className="grid gap-4 lg:grid-cols-3">
          <GuideCard
            to={to('/work')}
            icon={Search01Icon}
            title={t({ en: 'See jobs that fit you', fa: 'کارهای مناسب خودت رو ببین' })}
            line={t({ en: 'Tell the Scout three skills. Get one ranked list.', fa: 'سه تا مهارتت رو به پیشاهنگ بگو، یه فهرست مرتب بگیر.' })}
            vignette={
              <Vignette>
                <div className="flex gap-2">
                  <Tag tone="pink">Figma</Tag>
                  <Tag tone="pink">UI</Tag>
                  <Tag>React</Tag>
                </div>
                <Bar w="90%" />
                <Bar w="70%" />
                <Bar w="80%" tone="pink" />
              </Vignette>
            }
          />
          <GuideCard
            to={to('/hire/new')}
            icon={Briefcase01Icon}
            tone="sun"
            title={t({ en: 'Post a project with a fair price', fa: 'پروژه‌ت رو با قیمت منصفانه ثبت کن' })}
            line={t({ en: 'Four short steps. Merlin fills in step three.', fa: 'چهار مرحله‌ی کوتاه؛ مرحله‌ی سوم رو مرلین پر می‌کنه.' })}
            vignette={
              <Vignette>
                <div className="flex items-center gap-2 text-[13px] text-ink-muted">
                  <Pip tone="sun" /> {t({ en: 'Step III of IV', fa: 'مرحله‌ی ۳ از ۴' })}
                </div>
                <Bar w="60%" tone="sun" />
                <Bar w="85%" />
              </Vignette>
            }
          />
          <GuideCard
            to={to('/plus/scrum')}
            icon={Task01Icon}
            title={t({ en: 'Turn a brief into sprints', fa: 'بریف رو به اسپرینت تبدیل کن' })}
            line={t({ en: 'Paste a brief. The Steward writes the backlog.', fa: 'بریف رو بچسبون؛ پیشکار فهرست کارها رو می‌نویسه.' })}
            vignette={
              <Vignette>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((c) => (
                    <div key={c} className="flex flex-col gap-1.5 rounded-sm bg-surface p-2">
                      <Bar w="70%" tone={c === 1 ? 'pink' : undefined} />
                      <Bar w="50%" />
                    </div>
                  ))}
                </div>
              </Vignette>
            }
          />
        </div>
      </Container>
    </section>
  )
}

function PlusBand() {
  const { t, to } = useLocale()
  return (
    <section className="py-12">
      <Container>
        <Panel rail="sun" className="grid items-center gap-8 p-6 sm:p-12 lg:grid-cols-[1.2fr_1fr] [&>*]:min-w-0">
          <div>
            <h2 className="heading text-[clamp(1.6rem,2.6vw,2.25rem)]">{t({ en: 'Lance Plus: your CV and your sprints, done for you', fa: 'لنس پلاس: رزومه و اسپرینت‌هات، آماده' })}</h2>
            <p className="mt-4 max-w-[52ch] text-ink-muted">
              {t({
                en: 'The Smith rewrites your CV for each job description. The Steward turns any project into a sprint plan. Plus also lowers the fee on every payment you receive.',
                fa: 'آهنگر رزومه‌ت رو برای هر آگهی بازنویسی می‌کنه. پیشکار هر پروژه‌ای رو به برنامه‌ی اسپرینت تبدیل می‌کنه. با پلاس، کارمزد هر پرداختی که می‌گیری هم کمتر می‌شه.',
              })}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to={to('/plus')} variant="sun">
                {t({ en: 'See Plus', fa: 'دیدن لنس پلاس' })}
              </ButtonLink>
              <ButtonLink to={to('/plus/cv')} variant="ghost" icon={UserAdd01Icon}>
                {t({ en: 'Try the CV tailor', fa: 'امتحان رزومه‌ساز' })}
              </ButtonLink>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <Knight who="smith" label={t({ en: 'The Smith', fa: 'آهنگر' })} className="h-40 w-32 sm:h-56 sm:w-44" />
            <Knight who="steward" label={t({ en: 'The Steward', fa: 'پیشکار' })} className="mt-10 h-40 w-32 sm:h-56 sm:w-44" />
          </div>
        </Panel>
      </Container>
    </section>
  )
}

export default function Home() {
  useTitle({ en: 'Work, hire, learn', fa: 'کار، استخدام، یادگیری' })
  const { t, to } = useLocale()
  return (
    <>
      <Hero />
      <DoorsSection />
      <Radar />
      <MerlinMoment />
      <RoundTable />
      <Starters />
      <HowItWorks />
      <Hall />
      <PlusBand />
      <Container className="pt-24 text-center">
        <h2 className="heading text-[clamp(1.6rem,2.6vw,2.25rem)]">{t({ en: 'Pick your door.', fa: 'از کدوم در وارد می‌شی؟' })}</h2>
        <ButtonLink to={to('/start')} size="lg" className="mt-6">
          {t({ en: 'Start', fa: 'از اینجا شروع کن' })}
        </ButtonLink>
      </Container>
    </>
  )
}
