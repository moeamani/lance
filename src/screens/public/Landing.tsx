import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft01Icon,
  BubbleChatIcon,
  Calendar03Icon,
  CheckmarkBadge01Icon,
  Clock01Icon,
  Hold04Icon,
  Money03Icon,
  SecurityCheckIcon,
  UserCheck01Icon,
  Wallet01Icon,
  Briefcase01Icon,
  ArrowDataTransferHorizontalIcon,
  FolderLibraryIcon,
} from '@hugeicons/core-free-icons'
import {
  Accordion,
  Avatar,
  ButtonLink,
  Carousel,
  CountUp,
  Icon,
  Logo,
  RatingBadge,
  SegmentedControl,
  StepTimeline,
  Tag,
} from '../../components/ui'
import { categories } from '../../data/catalog'
import { faqs, lancers, reviews } from '../../data/mock'
import { formatNumber, toFaDigits } from '../../lib/format'
import { ArrowCta, Brand, PublicFooter, PublicTopBar, Reveal, SectionTitle } from './PublicChrome'

const steps = {
  employer: [
    { t: 'پروژه‌ات رو رایگان ثبت کن', d: 'توضیح، مهارت‌ها و بودجه — کمتر از ۳ دقیقه.', icon: Briefcase01Icon },
    { t: 'پیشنهادها رو مقایسه کن', d: 'پروفایل، امتیاز و نمونه‌کار هر لنسر کنار هم.', icon: UserCheck01Icon },
    { t: 'پول رو در ضمانت لنس بذار', d: 'تا تحویل نهایی، مبلغ نزد لنس امانت می‌مونه.', icon: SecurityCheckIcon },
    { t: 'تحویل بگیر و تأیید کن', d: 'با تأیید تو، پول برای لنسر آزاد می‌شه.', icon: CheckmarkBadge01Icon },
  ],
  freelancer: [
    { t: 'درخواست رو ثبت می‌کنی', d: 'روی پروژه‌های مرتبط با مهارتت پیشنهاد بده.', icon: Hold04Icon },
    { t: 'کارفرما قبول می‌کنه', d: 'گفتگو، توافق و ثبت مبلغ در ضمانت.', icon: CheckmarkBadge01Icon },
    { t: 'زمان رو مشخص می‌کنی', d: 'تسک‌ها و ددلاین‌ها رو داخل لنس مدیریت کن.', icon: Calendar03Icon },
    { t: 'کار رو تحویل می‌دی و پولت رو می‌گیری', d: 'تسویه سریع به شبای تأییدشده‌ات.', icon: Money03Icon },
  ],
}

const pillars = [
  { icon: UserCheck01Icon, t: 'انتخاب مطمئن', d: 'پروفایل، نمونه‌کار و امتیاز واقعی هر فریلنسر رو قبل از شروع کار می‌بینی.' },
  { icon: BubbleChatIcon, t: 'مصاحبه و توافق شفاف', d: 'قبل از شروع، با فریلنسر چت می‌کنی و روی جزئیات و زمان‌بندی پروژه توافق می‌کنید.' },
  { icon: SecurityCheckIcon, t: 'پرداخت امن', d: 'پول پروژه تا تأیید نهایی تحویل کار، نزد لنس امانت می‌مونه.' },
]

const ecosystem = [
  { t: 'لنس', d: 'آینده فریلنسری خودتون رو از اینجا شروع کنید!', soon: false, to: '/auth/signup' },
  { t: 'پورتفولیو اختصاصی', d: 'نمایش مرتب و حرفه‌ای نمونه‌کارهای شما.', soon: false, to: '/app/profile' },
  { t: 'مرلین', d: 'سامانه قیمت‌گذاری پروژه‌ها با هوش مصنوعی.', soon: true },
  { t: 'نتورک', d: 'با لنسرهای دیگه کانکت شو!', soon: true },
]

function Hero({ category }: { category?: (typeof categories)[number] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 80])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  return (
    <div ref={ref} className="relative overflow-hidden px-5 pt-14 pb-16 text-center">
      {/* Curtain stripes + glow from the Figma hero, as CSS instead of a bitmap */}
      <motion.div style={{ y }} aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-[repeating-linear-gradient(90deg,transparent_0_14px,#ff7fe30d_14px_16px)] [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
        <div className="absolute -top-24 left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute inset-0 bg-dots bg-dots-fade opacity-40" />
      </motion.div>
      <motion.div style={{ opacity }} className="relative">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          <Logo height={40} className="mx-auto" />
        </motion.div>
        {category && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 inline-flex">
            <Tag icon={category.icon}>{category.title}</Tag>
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-balance text-[28px] font-extrabold leading-[1.6]"
        >
          {category ? (
            <>
              پروژه‌ی <span className="text-primary">{category.short}</span>ت رو بسپار دست حرفه‌ای‌ها.
            </>
          ) : (
            <>
              با خیال راحت، پروژه‌ت رو بسپار دست <span className="text-primary">حرفه‌ای‌ها.</span>
            </>
          )}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mx-auto mt-3 max-w-[300px] text-sm leading-7 text-fg-muted">
          {category?.blurb ?? 'یه تیم از متخصص‌ها، فقط چند کلیک با تو فاصله دارن.'}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mx-auto mt-8 flex max-w-[280px] flex-col gap-3">
          <ButtonLink to="/projects/new" size="lg" iconEnd={ArrowLeft01Icon}>
            ثبت پروژه رایگان
          </ButtonLink>
          <ButtonLink to="/auth/signup" size="lg" variant="secondary">
            ورود به عنوان فری‌لنسر
          </ButtonLink>
        </motion.div>
      </motion.div>
    </div>
  )
}

function Stats() {
  const items = [
    { v: 40_000, suffix: ' هزار', label: 'تعداد پروژه', fmt: (n: number) => formatNumber(Math.round(n / 1000)) },
    { v: 92, suffix: '٪', label: 'رضایت کارفرما', fmt: formatNumber },
    { v: 24_000, suffix: ' هزار', label: 'لنسر حرفه‌ای', fmt: (n: number) => formatNumber(Math.round(n / 1000)) },
  ]
  return (
    <Reveal className="mx-5 grid grid-cols-3 divide-x divide-x-reverse divide-stroke rounded-[20px] border border-stroke bg-surface/60 py-5 backdrop-blur">
      {items.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-1">
          <span className="text-2xl font-extrabold text-primary">
            <CountUp value={s.v} format={s.fmt} />
            {s.suffix}
          </span>
          <span className="text-xs text-fg-muted">{s.label}</span>
        </div>
      ))}
    </Reveal>
  )
}

/** Live mini-UI instead of a static phone mockup bitmap. */
function PhonePreview() {
  return (
    <Reveal className="relative mx-5 mt-16 overflow-hidden rounded-[28px] border border-stroke bg-surface-sunken px-6 pt-8">
      <div className="absolute inset-0 bg-dots bg-dots-fade opacity-50" aria-hidden />
      <motion.div
        initial={{ y: 60, rotate: -4 }}
        whileInView={{ y: 0, rotate: -2 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="relative mx-auto w-[240px] rounded-t-[36px] border-[6px] border-b-0 border-[#2a2a2a] bg-bg p-3 pb-0 shadow-[0_30px_80px_-20px_#ff7fe355]"
      >
        <div className="mx-auto mb-3 h-5 w-20 rounded-full bg-black" />
        <p className="mb-2 text-sm font-extrabold">داشبورد</p>
        <div className="rounded-[14px] border border-stroke bg-surface p-3">
          <div className="flex items-center justify-between text-[10px] text-fg-muted">
            <span>کیف پول</span>
            <span className="rounded-full bg-primary-soft px-2 py-0.5 text-primary">فعال</span>
          </div>
          <p className="mt-2 text-lg font-extrabold tabular">۲۵٬۰۰۰٬۰۰۰ <span className="text-xs font-medium text-fg-muted">تومان</span></p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stroke">
            <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} whileInView={{ width: '70%' }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 1 }} />
          </div>
        </div>
        <div className="mt-2 rounded-[14px] bg-gradient-to-l from-primary to-[#ff4fd8] p-3 text-on-primary">
          <p className="text-xs font-extrabold">پروژه‌های مرتبط با مهارت‌هات</p>
          <p className="mt-1 text-[10px] opacity-80">۳ پیشنهاد جدید برای امروز</p>
        </div>
        <div className="mt-2 flex gap-2 pb-4">
          {[Wallet01Icon, ArrowDataTransferHorizontalIcon, Clock01Icon].map((ic, i) => (
            <span key={i} className="grid h-10 flex-1 place-items-center rounded-[12px] border border-stroke bg-surface text-primary">
              <Icon icon={ic} size={18} />
            </span>
          ))}
        </div>
      </motion.div>
    </Reveal>
  )
}

export default function Landing() {
  const { slug } = useParams()
  const category = categories.find((c) => c.slug === slug)
  const [who, setWho] = useState<'freelancer' | 'employer'>('freelancer')

  return (
    <div className="flex min-h-dvh flex-col">
      <PublicTopBar />
      <Hero category={category} />
      <Stats />

      {/* Services */}
      <Reveal className="mt-16 px-5">
        <SectionTitle sub="۱۰ دسته‌ی محبوب با متخصص‌های بررسی‌شده">
          خدمات برتر <Brand />
        </SectionTitle>
        <ul className="mt-6 grid grid-cols-2 gap-3">
          {categories.map((c, i) => (
            <motion.li key={c.slug} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
              <Link
                to={`/services/${c.slug}`}
                aria-current={c.slug === slug ? 'page' : undefined}
                className="group flex h-[72px] items-center gap-3 rounded-[16px] border border-stroke bg-surface px-3 transition-colors hover:border-primary/50 aria-[current=page]:border-primary aria-[current=page]:bg-primary-soft"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary transition-transform group-hover:scale-110">
                  <Icon icon={c.icon} size={22} />
                </span>
                <span className="text-sm leading-5 font-bold">{c.title}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </Reveal>

      <PhonePreview />

      <Reveal className="mt-10 px-5 text-center">
        <SectionTitle sub="با لنس می‌تونی فریلنسرها رو خیلی آسون پیدا کنی و انتخاب و مصاحبه کنی؛ به همین راحتی کار رو به کاردانش بسپار.">
          چرا کارتو با <Brand /> ادامه بدی؟
        </SectionTitle>
        <ButtonLink to="/app" size="lg" className="mt-6" iconEnd={ArrowLeft01Icon}>
          ورود به وب اپلیکیشن لنس
        </ButtonLink>
      </Reveal>

      {/* How it works */}
      <Reveal className="mt-16 px-5">
        <SectionTitle sub="از ثبت پروژه تا تسویه، در چهار قدم">
          <Brand /> چطور کار میکنه؟
        </SectionTitle>
        <SegmentedControl
          className="mt-6"
          label="نقش"
          value={who}
          onChange={setWho}
          options={[
            { value: 'freelancer', label: 'لنسر' },
            { value: 'employer', label: 'کارفرما' },
          ]}
        />
        <motion.ol key={who} initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07 } } }} className="relative mt-6 flex flex-col gap-3">
          <span aria-hidden className="absolute top-6 bottom-6 start-[19px] w-px bg-gradient-to-b from-primary/60 to-transparent" />
          {steps[who].map((s, i) => (
            <motion.li key={s.t} variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }} className="relative flex items-center gap-3">
              <span className="z-10 grid size-10 shrink-0 place-items-center rounded-[12px] border border-primary/40 bg-bg text-sm font-extrabold text-primary">{toFaDigits(i + 1)}</span>
              <div className="flex min-h-[72px] flex-1 items-center gap-3 rounded-[16px] border border-stroke bg-surface p-4">
                <div className="flex-1">
                  <p className="text-sm font-bold">{s.t}</p>
                  <p className="mt-1 text-xs leading-5 text-fg-muted">{s.d}</p>
                </div>
                <Icon icon={s.icon} size={28} className="text-primary/50" />
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </Reveal>

      {/* Pillars */}
      <Reveal className="mt-16 px-5">
        <SectionTitle sub="از انتخاب تا تسویه‌حساب، هر مرحله طوری طراحی شده که خیالت راحت باشه.">
          با <Brand />، خیالت از همه‌چیز راحته
        </SectionTitle>
        <div className="mt-6 flex flex-col gap-4">
          {pillars.map((p, i) => (
            <motion.article
              key={p.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="overflow-hidden rounded-[20px] border border-stroke bg-surface"
            >
              <div className="relative m-3 grid h-36 place-items-center overflow-hidden rounded-[14px] bg-surface-sunken">
                <div className="absolute inset-0 bg-dots opacity-60" aria-hidden />
                {i === 2 ? (
                  <StepTimeline
                    className="relative w-full px-3"
                    current={1}
                    steps={[
                      { label: 'پرداخت کارفرما', icon: Wallet01Icon },
                      { label: 'در ضمانت لنس', icon: SecurityCheckIcon },
                      { label: 'آزادسازی برای لنسر', icon: Money03Icon },
                    ]}
                  />
                ) : (
                  <motion.span whileInView={{ scale: [0.8, 1.05, 1] }} viewport={{ once: true }} className="relative text-primary drop-shadow-[0_0_24px_#ff7fe3aa]">
                    <Icon icon={p.icon} size={64} strokeWidth={1.2} />
                  </motion.span>
                )}
              </div>
              <div className="px-5 pt-2 pb-5">
                <h3 className="text-lg font-extrabold">{p.t}</h3>
                <p className="mt-2 text-sm leading-7 text-fg-muted">{p.d}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </Reveal>

      {/* Ecosystem */}
      <Reveal className="mt-16 px-5">
        <SectionTitle sub="محصولاتی که کنار هم مسیر حرفه‌ای‌ات رو می‌سازن">
          منظومه <Brand />
        </SectionTitle>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {ecosystem.map((e) => {
            const body = (
              <>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-primary">{e.t}</h3>
                  {e.soon && <Tag tone="neutral">به‌زودی</Tag>}
                </div>
                <p className="mt-2 text-xs leading-5 text-fg-muted">{e.d}</p>
                <Icon icon={FolderLibraryIcon} size={56} strokeWidth={1} className="absolute -bottom-2 -start-2 text-white/5" />
              </>
            )
            const cls = 'relative block min-h-36 overflow-hidden rounded-[18px] border p-4 transition-colors'
            return e.to ? (
              <Link key={e.t} to={e.to} className={`${cls} border-primary/40 bg-gradient-to-b from-primary/10 to-transparent hover:border-primary`}>
                {body}
              </Link>
            ) : (
              <div key={e.t} className={`${cls} border-stroke bg-surface opacity-80`}>
                {body}
              </div>
            )
          })}
        </div>
      </Reveal>

      {/* Lancers carousel */}
      <Reveal className="mt-16 px-5">
        <div className="mb-4 flex justify-center">
          <Tag>● استعدادهای جدید لنس</Tag>
        </div>
        <SectionTitle>
          با بهترین <Brand>فریلنسرهای لنس</Brand> از نزدیک آشنا شو
        </SectionTitle>
        <Carousel label="لنسرهای برتر" className="mt-6" itemWidth="72%">
          {lancers.map((l) => (
            <Link key={l.id} to={`/app/lancer/${l.id}`} className="group block overflow-hidden rounded-[22px] border border-stroke bg-surface">
              <div className="relative grid h-56 place-items-center bg-[radial-gradient(80%_60%_at_50%_30%,#ff7fe333,transparent)]">
                <div className="absolute inset-0 bg-dots opacity-40" aria-hidden />
                <motion.div whileHover={{ scale: 1.05 }} className="relative">
                  <Avatar name={l.name} src={l.avatar} size={112} verified={l.verified} ring />
                </motion.div>
              </div>
              <div className="p-4">
                <p className="text-lg font-extrabold text-primary">{l.name}</p>
                <p className="text-sm text-fg-muted">{l.title}</p>
                <div className="mt-3 flex items-center justify-between">
                  <RatingBadge value={l.rating} />
                  <span className="text-xs text-fg-subtle">{formatNumber(l.projects)} پروژه</span>
                </div>
              </div>
            </Link>
          ))}
        </Carousel>
        <div className="mt-6 flex justify-center">
          <ButtonLink to="/app/discover?tab=lancer">مشاهده فریلنسرها</ButtonLink>
        </div>
      </Reveal>

      {/* Testimonials */}
      <Reveal className="mt-16 px-5">
        <SectionTitle sub="داستان‌هایی از آدم‌هایی که پروژه‌شون رو با خیال راحت سپردن دست حرفه‌ای‌ها.">
          کارفرماها و فریلنسرها درباره <Brand /> چی می‌گن؟
        </SectionTitle>
        <div className="mt-6 flex flex-col gap-3">
          {reviews.map((r) => (
            <figure key={r.id} className="rounded-[18px] border border-stroke bg-surface p-5">
              <blockquote className="text-sm leading-7 text-fg-muted">«{r.text}»</blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t border-stroke pt-4">
                <Avatar name={r.name} size={40} />
                <div className="flex-1">
                  <p className="text-sm font-bold">{r.name}</p>
                  <p className="text-xs text-fg-subtle">{r.role}</p>
                </div>
                <RatingBadge value={r.rating} />
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>

      {/* FAQ */}
      <Reveal className="mt-16 px-5">
        <SectionTitle>سوالات متداول</SectionTitle>
        <Accordion className="mt-6" items={faqs.map((f) => ({ id: f.id, title: f.q, content: f.a }))} />
        <div className="mt-4 text-center">
          <ArrowCta to="/app/messages/c3">سؤال دیگه‌ای داری؟ با پشتیبانی چت کن</ArrowCta>
        </div>
      </Reveal>

      {/* CTA band */}
      <Reveal className="mx-5 mt-16 overflow-hidden rounded-[24px] bg-gradient-to-l from-primary to-[#ff4fd8] p-6 text-center text-on-primary">
        <p className="text-xl font-extrabold">
          هنوز <span className="underline decoration-2 underline-offset-8">لنسر</span> نیستی؟
        </p>
        <p className="mt-2 text-sm opacity-80">ثبت‌نام رایگانه و کمتر از یک دقیقه طول می‌کشه.</p>
        <ButtonLink to="/auth/signup" variant="inverse" className="mt-5">
          همین الان شروع کن
        </ButtonLink>
      </Reveal>

      <PublicFooter />
    </div>
  )
}
