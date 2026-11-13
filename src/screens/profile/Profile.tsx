import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Add01Icon,
  ArrowLeft01Icon,
  Briefcase01Icon,
  Calendar03Icon,
  CheckmarkBadge01Icon,
  Clock01Icon,
  Edit02Icon,
  Folder03Icon,
  Location01Icon,
  Mail01Icon,
  MessageMultiple01Icon,
  Money03Icon,
  Settings02Icon,
  StarIcon,
  ThumbsUpIcon,
} from '@hugeicons/core-free-icons'
import { AppHeader } from '../../components/layout/AppHeader'
import { Screen } from '../../components/layout/Screen'
import { BookmarkButton } from '../../components/domain/Cards'
import {
  Avatar,
  AvatarStack,
  Button,
  ButtonLink,
  EmptyState,
  FileDrop,
  Icon,
  IconButton,
  RatingBadge,
  SegmentedControl,
  Sheet,
  StatusPill,
  Tag,
  TextField,
  useToast,
  type PickedFile,
} from '../../components/ui'
import { courses, experiences, lancers, me, reviews, type Lancer } from '../../data/mock'
import { cn } from '../../lib/cn'
import { formatNumber, formatToman, toFaDigits } from '../../lib/format'
import { useApp } from '../../store/AppStore'

type Tab = 'about' | 'portfolio' | 'experience' | 'reviews'

const portfolio = [
  { id: 'w1', title: 'اپ رزرو آشیانه', tag: 'موبایل', g: 'from-[#3a1d5c] via-[#7a2f8f] to-[#ff7fe3]' },
  { id: 'w2', title: 'داشبورد مالی', tag: 'وب', g: 'from-[#0d2b22] via-[#1f6a5c] to-[#7fffbf]' },
  { id: 'w3', title: 'هویت بصری سورنا', tag: 'برندینگ', g: 'from-[#2b200d] via-[#8f6a1f] to-[#ffe57f]' },
  { id: 'w4', title: 'لندینگ ری‌را', tag: 'وب', g: 'from-[#0d1b2b] via-[#1f4a8f] to-[#7fbdff]' },
]

const levelTone = { مبتدی: 'neutral', متوسط: 'info', پیشرفته: 'primary' } as const

function Cover() {
  return (
    <div aria-hidden className="relative h-36 overflow-hidden">
      <div className="absolute inset-0 bg-[conic-gradient(from_200deg_at_70%_40%,#0d0d0d,#3a1d3a,#ff7fe3,#7fbdff,#1f1f1f,#0d0d0d)] opacity-70 blur-2xl" />
      <motion.div
        className="absolute -inset-x-10 top-6 h-20 rotate-[-6deg] rounded-full bg-gradient-to-l from-transparent via-white/40 to-transparent blur-xl"
        animate={{ x: ['-10%', '10%', '-10%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg" />
    </div>
  )
}

function ProfileHeaderCard({ l, own }: { l: Lancer; own?: boolean }) {
  return (
    <div className="relative -mt-16 px-5">
      <div className="relative rounded-[20px] border border-stroke bg-surface/90 p-4 pt-14 backdrop-blur">
        <div className="absolute -top-11 start-4">
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
            <Avatar name={l.name} src={l.avatar} size={88} ring />
          </motion.div>
        </div>
        <div className="absolute top-4 end-4">{l.online ? <StatusPill tone="success" pulse>آنلاین</StatusPill> : <StatusPill tone="neutral">آفلاین</StatusPill>}</div>
        <h1 className="flex items-center gap-1.5 text-xl font-extrabold">
          {l.name}
          {l.verified && <Icon icon={CheckmarkBadge01Icon} size={20} className="text-primary" label="تأیید شده" />}
        </h1>
        <p className="text-sm text-fg-muted">{l.title}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-fg-subtle">
          <Icon icon={Location01Icon} size={14} /> {l.city}
        </p>
        {own && (
          <ButtonLink to="/app/profile/edit" variant="secondary" size="sm" iconStart={Edit02Icon} className="mt-4">
            ویرایش پروفایل
          </ButtonLink>
        )}
      </div>
    </div>
  )
}

function Stats({ l }: { l: Lancer }) {
  const items = [
    { icon: Calendar03Icon, v: `${toFaDigits(l.years)} سال`, k: 'سابقه' },
    { icon: StarIcon, v: toFaDigits(l.rating.toFixed(1)), k: 'امتیاز لنسر' },
    { icon: Folder03Icon, v: `${formatNumber(l.projects)}+`, k: 'پروژه' },
  ]
  return (
    <div className="mt-4 grid grid-cols-3 gap-3 px-5">
      {items.map((s, i) => (
        <motion.div key={s.k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="rounded-[16px] border border-stroke bg-surface p-3">
          <span className="grid size-8 place-items-center rounded-full bg-primary-soft text-primary">
            <Icon icon={s.icon} size={16} />
          </span>
          <p className="mt-2 text-lg font-extrabold">{s.v}</p>
          <p className="text-xs text-fg-subtle">{s.k}</p>
        </motion.div>
      ))}
    </div>
  )
}

function Courses({ own }: { own?: boolean }) {
  const c = courses[0]
  return (
    <section className="mt-6 px-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-extrabold">دوره‌ها</h2>
        <div className="flex items-center gap-1">
          {own && (
            <button type="button" className="inline-flex h-9 items-center gap-1 rounded-[10px] px-2 text-xs font-bold text-primary hover:bg-primary-soft">
              <Icon icon={Add01Icon} size={16} /> اضافه کردن
            </button>
          )}
          <Link to="#" className="inline-flex h-9 items-center gap-1 rounded-[10px] px-2 text-xs text-fg-muted hover:bg-white-soft">
            مشاهده همه <Icon icon={ArrowLeft01Icon} size={14} />
          </Link>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-[18px] border border-primary/20 bg-[linear-gradient(110deg,#3a1d3a,#1f1f1f_70%)] p-4">
        <div aria-hidden className="absolute inset-0 bg-dots opacity-30" />
        <p className="relative text-xs text-fg-muted">دوره منتخب</p>
        <div className="relative mt-1 flex items-center justify-between">
          <p className="font-extrabold">{c.title}</p>
          <Tag className="gap-0.5">
            <Icon icon={StarIcon} size={12} /> {toFaDigits(c.rating)}
          </Tag>
        </div>
        <div className="relative mt-3">
          <AvatarStack names={['سارا احمدی', 'آرمان رستمی', 'نیما مختاری', 'میلاد کریمی', 'الف', 'ب', 'ج', 'د', 'ه', 'و']} max={3} size={26} />
        </div>
      </div>
    </section>
  )
}

function About({ l }: { l: Lancer }) {
  const metrics = [
    { icon: Clock01Icon, v: l.responseTime, k: 'سرعت پاسخگویی', c: 'text-fg' },
    { icon: ThumbsUpIcon, v: `${formatNumber(l.onTimeRate)}٪`, k: 'درصد خوش‌قولی', c: 'text-success' },
    { icon: StarIcon, v: `${formatNumber(l.satisfaction)}٪`, k: 'میزان رضایت', c: 'text-primary' },
    { icon: Money03Icon, v: formatToman(l.hourly, { compact: true }), k: 'نرخ ساعتی', c: 'text-warning' },
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-[16px] border border-stroke bg-surface p-4">
        <p className="text-sm leading-7 text-fg-muted">{l.bio}</p>
        <p className="mt-3 flex items-center gap-1.5 text-sm font-bold">
          <Icon icon={Location01Icon} size={18} /> {l.city}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m) => (
          <div key={m.k} className="rounded-[16px] border border-stroke bg-[linear-gradient(160deg,#ffffff08,transparent)] p-4">
            <Icon icon={m.icon} size={18} className="text-fg-subtle" />
            <p className={cn('mt-2 text-lg font-extrabold', m.c)}>{m.v}</p>
            <p className="text-xs text-fg-subtle">{m.k}</p>
          </div>
        ))}
      </div>
      <div>
        <h3 className="mb-3 text-lg font-extrabold">مهارت‌ها</h3>
        <ul className="flex flex-col gap-2">
          {l.skills.map((s) => (
            <li key={s.name} className="flex h-14 items-center justify-between rounded-[14px] border border-stroke bg-surface px-4">
              <span className="font-bold">{s.name}</span>
              <Tag tone={levelTone[s.level]}>{s.level}</Tag>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Portfolio({ own }: { own?: boolean }) {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<PickedFile[]>([])
  const [title, setTitle] = useState('')
  const toast = useToast()
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {own && (
          <button type="button" onClick={() => setOpen(true)} className="grid aspect-[4/5] place-items-center rounded-[16px] border-2 border-dashed border-primary/40 text-primary hover:bg-primary-soft">
            <span className="flex flex-col items-center gap-2 text-sm font-bold">
              <Icon icon={Add01Icon} size={28} /> نمونه‌کار جدید
            </span>
          </button>
        )}
        {portfolio.map((w, i) => (
          <motion.button
            key={w.id}
            type="button"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className={cn('relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[16px] bg-gradient-to-br p-3 text-start', w.g)}
          >
            <span aria-hidden className="absolute inset-0 bg-dots opacity-30" />
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />
            <span className="relative text-sm font-extrabold">{w.title}</span>
            <span className="relative text-[11px] text-white/70">{w.tag}</span>
          </motion.button>
        ))}
      </div>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="افزودن نمونه‌کار"
        footer={
          <Button
            block
            size="lg"
            disabled={!title.trim() || !files.length}
            onClick={() => {
              setOpen(false)
              setTitle('')
              setFiles([])
              toast.show('نمونه‌کار اضافه شد.')
            }}
          >
            ذخیره
          </Button>
        }
      >
        <div className="flex flex-col gap-4 pt-1">
          <TextField label="عنوان" placeholder="مثلاً اپ رزرو آشیانه" value={title} onChange={(e) => setTitle(e.target.value)} />
          <FileDrop label="تصاویر نمونه‌کار" accept="image/*" maxFiles={10} files={files} onChange={setFiles} onError={(m) => toast.show(m, { tone: 'error' })} />
        </div>
      </Sheet>
    </>
  )
}

function Experience({ own }: { own?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      <ol className="relative flex flex-col gap-3">
        {experiences.map((e) => (
          <li key={e.id} className="flex items-center gap-3 rounded-[16px] border border-stroke bg-surface p-4">
            <span className="grid size-11 place-items-center rounded-[12px] bg-primary-soft text-primary">
              <Icon icon={Briefcase01Icon} size={22} />
            </span>
            <div className="flex-1">
              <p className="font-extrabold">{e.role}</p>
              <p className="text-xs text-fg-subtle">{e.company}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {e.active && <Tag>فعال</Tag>}
              <span className="text-xs text-fg-muted">{e.period}</span>
            </div>
          </li>
        ))}
      </ol>
      {own && (
        <Button variant="outline" iconStart={Add01Icon}>
          افزودن تجربه
        </Button>
      )}
    </div>
  )
}

function Reviews({ own }: { own?: boolean }) {
  if (own && reviews.length === 0) return <EmptyState icon={MessageMultiple01Icon} title="هنوز نظری ثبت نشده" description="بعد از اولین پروژه، نظر کارفرماها اینجا نمایش داده می‌شه." />
  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4 rounded-[16px] border border-stroke bg-surface p-4">
        <p className="text-4xl font-extrabold">{toFaDigits(avg.toFixed(1))}</p>
        <div className="flex-1">
          {[5, 4, 3].map((n) => {
            const c = reviews.filter((r) => r.rating === n).length
            return (
              <div key={n} className="flex items-center gap-2 text-xs text-fg-subtle">
                <span className="w-3">{toFaDigits(n)}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stroke">
                  <motion.div className="h-full bg-warning" initial={{ width: 0 }} animate={{ width: `${(c / reviews.length) * 100}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {reviews.map((r) => (
        <figure key={r.id} className="rounded-[16px] border border-stroke bg-surface p-4">
          <figcaption className="flex items-center gap-3">
            <Avatar name={r.name} size={36} />
            <div className="flex-1">
              <p className="text-sm font-bold">{r.name}</p>
              <p className="text-[11px] text-fg-subtle">{r.role}</p>
            </div>
            <RatingBadge value={r.rating} />
          </figcaption>
          <blockquote className="mt-3 text-sm leading-7 text-fg-muted">{r.text}</blockquote>
        </figure>
      ))}
    </div>
  )
}

function ProfileBody({ l, own }: { l: Lancer; own?: boolean }) {
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) ?? 'about'
  return (
    <>
      <Cover />
      <ProfileHeaderCard l={l} own={own} />
      <Stats l={l} />
      <Courses own={own} />
      <div className="mt-6 px-5">
        <SegmentedControl
          label="بخش‌های پروفایل"
          value={tab}
          onChange={(v) => setParams({ tab: v }, { replace: true })}
          options={[
            { value: 'about', label: 'درباره' },
            { value: 'portfolio', label: 'نمونه‌کار' },
            { value: 'experience', label: 'تجربه' },
            { value: 'reviews', label: 'نظرات' },
          ]}
        />
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="mt-4">
            {tab === 'about' && <About l={l} />}
            {tab === 'portfolio' && <Portfolio own={own} />}
            {tab === 'experience' && <Experience own={own} />}
            {tab === 'reviews' && <Reviews own={own} />}
          </motion.div>
        </AnimatePresence>
        {own && tab === 'about' && (
          <ButtonLink to="/app/profile/skills" variant="outline" block className="mt-3" iconStart={Add01Icon}>
            افزودن مهارت
          </ButtonLink>
        )}
      </div>
    </>
  )
}

export function MyProfile() {
  const navigate = useNavigate()
  const { user } = useApp()
  const self: Lancer = { ...lancers[0], name: user?.name ?? me.name, verified: !!user?.verified }
  return (
    <>
      <AppHeader leading={false} title="پروفایل" className="!absolute inset-x-0" transparent actions={<IconButton icon={Settings02Icon} label="تنظیمات" onClick={() => navigate('/app/settings')} />} />
      <main className="flex-1 pb-32">
        <ProfileBody l={self} own />
      </main>
    </>
  )
}

export function LancerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const l = lancers.find((x) => x.id === id) ?? lancers[0]
  return (
    <>
      <AppHeader title="" className="!absolute inset-x-0" transparent backTo="/app/discover?tab=lancer" actions={<BookmarkButton id={l.id} kind="lancer" className="border border-stroke bg-surface" />} />
      <Screen
        className="px-0 pt-0"
        title={l.name}
        footer={
          <div className="flex gap-2">
            <Button size="lg" className="flex-1" iconStart={Mail01Icon} onClick={() => navigate('/app/messages/c2')}>
              ارسال پیام
            </Button>
            <Button size="lg" variant="secondary" className="flex-1" onClick={() => navigate('/projects/new')}>
              دعوت به پروژه
            </Button>
          </div>
        }
      >
        <ProfileBody l={l} />
      </Screen>
    </>
  )
}
