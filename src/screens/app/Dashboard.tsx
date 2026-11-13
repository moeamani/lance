import { motion } from 'motion/react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Add01Icon,
  ArrowDataTransferHorizontalIcon,
  ArrowLeft01Icon,
  Bookmark02Icon,
  Calendar03Icon,
  CheckListIcon,
  Crown02Icon,
  DashboardSquare02Icon,
  Folder03Icon,
  IdIcon,
  InformationCircleIcon,
  MoneyReceive02Icon,
  Notification03Icon,
  Settings02Icon,
  Upload01Icon,
  Wallet01Icon,
} from '@hugeicons/core-free-icons'
import { AppHeader } from '../../components/layout/AppHeader'
import { Screen } from '../../components/layout/Screen'
import {
  Avatar,
  ButtonLink,
  Card,
  CardHeader,
  Carousel,
  CountUp,
  EmptyState,
  Icon,
  IconButton,
  ProgressBar,
  ProgressRing,
  RatingBadge,
  SectionHeader,
  SegmentedControl,
  StaggerItem,
  StaggerList,
  StatusPill,
  Tag,
} from '../../components/ui'
import { me, projects, templates, type ActiveProject } from '../../data/mock'
import { formatDays, formatDayMonth, formatNumber, formatRelative, formatToman } from '../../lib/format'
import { useApp } from '../../store/AppStore'
import { categories } from '../../data/catalog'

function Header() {
  const { unreadNotifications } = useApp()
  const navigate = useNavigate()
  return (
    <AppHeader
      leading={false}
      title="داشبورد"
      actions={
        <>
          <IconButton icon={Notification03Icon} label={`اعلان‌ها${unreadNotifications ? ` (${unreadNotifications} خوانده‌نشده)` : ''}`} dot={unreadNotifications > 0} onClick={() => navigate('/app/notifications')} />
          <IconButton icon={Settings02Icon} label="تنظیمات" onClick={() => navigate('/app/settings')} />
        </>
      }
    />
  )
}

function RoleSwitch() {
  const { role, setRole } = useApp()
  return (
    <SegmentedControl
      label="نمای داشبورد"
      className="mb-4"
      value={role}
      onChange={setRole}
      options={[
        { value: 'freelancer', label: 'لنسر' },
        { value: 'employer', label: 'کارفرما' },
      ]}
    />
  )
}

function ProfileCard() {
  const { user } = useApp()
  return (
    <Card>
      <div className="flex items-start gap-3">
        <Avatar name={me.name} src="brand" size={56} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-lg font-bold">{user?.name ?? me.name}</p>
              <p className="text-[13px] text-fg-muted">{me.title}</p>
            </div>
            <StatusPill pulse>آنلاین</StatusPill>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {me.skills.slice(0, 2).map((s) => (
              <Tag key={s.name}>{s.name}</Tag>
            ))}
          </div>
        </div>
      </div>
      <ProgressBar value={me.completion} className="mt-4" label="تکمیل پروفایل" />
      <p className="mt-3 text-[13px] leading-6 text-fg-muted">
        پروفایل شما {formatNumber(me.completion)}٪ تکمیل شده است. با تکمیل اطلاعات بیشتر، شانس دیده شدن در پروژه‌ها افزایش می‌یابد.
      </p>
      <div className="mt-4 flex gap-2">
        <ButtonLink to="/app/profile/edit" variant="secondary" className="flex-1">
          تکمیل پروفایل
        </ButtonLink>
        {!user?.verified && (
          <ButtonLink to="/verify" variant="outline" iconStart={IdIcon} className="flex-1">
            احراز هویت
          </ButtonLink>
        )}
      </div>
    </Card>
  )
}

function WalletCard() {
  return (
    <Card tone="glow" className="overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-dots bg-dots-fade opacity-40" />
      <div className="relative">
        <CardHeader title="کیف پول" subtitle="موجودی و تراکنش‌های اخیر" end={<StatusPill>فعال</StatusPill>} />
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-fg-muted">موجودی</p>
            <p className="mt-1 text-[28px] font-extrabold leading-9">
              <CountUp value={25_000_000} /> <span className="text-sm font-medium text-fg-muted">تومان</span>
            </p>
          </div>
          <button type="button" className="grid size-9 place-items-center rounded-full text-fg-subtle hover:bg-white-soft" aria-label="درباره موجودی" title="موجودی شامل مبالغ آزادشده است؛ مبالغ در ضمانت جدا نمایش داده می‌شوند.">
            <Icon icon={InformationCircleIcon} size={20} />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[12px] bg-surface-sunken p-3">
            <p className="text-xs text-fg-muted">درآمد این ماه</p>
            <p className="mt-1 font-bold tabular">{formatToman(24_000_000)}</p>
          </div>
          <div className="rounded-[12px] bg-surface-sunken p-3">
            <p className="text-xs text-fg-muted">قابل برداشت</p>
            <p className="mt-1 font-bold tabular text-success">{formatToman(18_000_000)}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <ButtonLink to="/app/wallet?withdraw=1" variant="primary" iconStart={MoneyReceive02Icon}>
            برداشت
          </ButtonLink>
          <ButtonLink to="/app/wallet" variant="secondary" iconStart={ArrowDataTransferHorizontalIcon}>
            تاریخچه
          </ButtonLink>
        </div>
      </div>
    </Card>
  )
}

function IncomeCard() {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">درآمدهای کلی</h3>
        <span className="text-xs text-fg-subtle">این ماه</span>
      </div>
      <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-stroke" role="img" aria-label="۹۰٪ پروژه‌ها، ۱۰٪ دوره‌ها">
        <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: '90%' }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} />
        <motion.div className="h-full bg-info" initial={{ width: 0 }} animate={{ width: '10%' }} transition={{ duration: 1, delay: 0.3 }} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          { c: 'bg-primary', l: 'پروژه‌ها', p: 90, v: 21_600_000 },
          { c: 'bg-info', l: 'دوره‌ها', p: 10, v: 2_400_000 },
        ].map((s) => (
          <div key={s.l} className="rounded-[12px] bg-surface-sunken p-3">
            <p className="flex items-center gap-1.5 text-xs text-fg-muted">
              <span className={`size-2 rounded-full ${s.c}`} />
              {s.l} · {formatNumber(s.p)}٪
            </p>
            <p className="mt-1 text-sm font-bold tabular">{formatToman(s.v)}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function ProjectMiniCard({ p }: { p: ActiveProject }) {
  return (
    <Link to={`/app/projects/${p.id}`} className="block h-full">
      <Card interactive className="flex h-full flex-col gap-3 bg-[radial-gradient(100%_100%_at_100%_0%,#ff7fe314,transparent_60%)]">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="line-clamp-2 text-base font-extrabold leading-7">{p.title}</p>
            <p className="mt-0.5 text-xs text-fg-subtle">{p.category}</p>
          </div>
          <ProgressRing value={p.progress} size={52} />
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-stroke pt-3 text-xs">
          {p.status === 'searching' ? (
            <span className="text-warning">در جستجوی لنسر…</span>
          ) : (
            <span className="flex items-center gap-1.5 truncate">
              <Avatar name={p.counterpart} size={22} />
              {p.counterpart}
            </span>
          )}
          <span className="flex shrink-0 items-center gap-1 text-fg-muted">
            <Icon icon={Calendar03Icon} size={14} />
            {formatDayMonth(p.deadline)}
          </span>
        </div>
      </Card>
    </Link>
  )
}

function RelatedProjects() {
  return (
    <Card>
      <CardHeader title="پروژه‌های مرتبط با مهارت‌هات" subtitle="پیشنهادهای جدید برای امروز" end={<StatusPill>{formatNumber(3)} پیشنهاد</StatusPill>} />
      {/* Fixed: Figma placed two 353px cards in a 321px row → clipped, overlapping text. */}
      <Carousel label="پروژه‌های پیشنهادی" className="mt-4" itemWidth="86%">
        {projects.slice(0, 3).map((p) => (
          <Link key={p.id} to={`/app/discover/${p.id}`} className="block h-full rounded-[14px] border border-stroke bg-surface-sunken p-4 transition-colors hover:border-stroke-strong">
            <div className="flex items-start justify-between gap-2">
              <p className="line-clamp-2 text-sm font-extrabold leading-6">{p.title}</p>
              {p.urgent && <Tag tone="danger">فوری</Tag>}
            </div>
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-fg-muted">{p.description}</p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="font-bold text-primary tabular">{formatToman(p.budget, { compact: true })}</span>
              <span className="text-fg-subtle">{formatDays(p.days)} · {formatRelative(p.postedAt)}</span>
            </div>
          </Link>
        ))}
      </Carousel>
      <ButtonLink to="/app/discover" block className="mt-4" iconEnd={ArrowLeft01Icon}>
        مشاهده پروژه‌ها
      </ButtonLink>
    </Card>
  )
}

function TemplatesCard() {
  return (
    <Card>
      <CardHeader title="قالب‌های آماده" subtitle="برای شروع سریع‌تر تسک‌ها" end={<span className="grid size-10 place-items-center rounded-full bg-primary-soft text-primary"><Icon icon={DashboardSquare02Icon} size={20} /></span>} />
      <div className="mt-4 grid grid-cols-2 gap-3">
        {templates.slice(0, 2).map((t) => {
          const cat = categories.find((c) => c.slug === t.icon)
          return (
            <Link key={t.id} to="/app/templates" className="flex items-center gap-3 rounded-[12px] bg-surface-sunken p-3 hover:bg-surface-raised">
              <span className="grid size-10 place-items-center rounded-full bg-primary-soft text-primary">{cat && <Icon icon={cat.icon} size={20} />}</span>
              <span className="text-sm font-bold leading-5">{t.title}</span>
            </Link>
          )
        })}
      </div>
      <ButtonLink to="/app/templates" variant="secondary" block className="mt-3">
        مشاهده همه
      </ButtonLink>
    </Card>
  )
}

function UpcomingTasks() {
  const { projects: all } = useApp()
  const tasks = all
    .filter((p) => p.status === 'active')
    .flatMap((p) => p.tasks.filter((t) => !t.done && t.due).map((t) => ({ ...t, project: p })))
    .sort((a, b) => +new Date(a.due!) - +new Date(b.due!))
  if (!tasks.length) return null
  return (
    <section>
      <SectionHeader title="تسک‌های پیش رو" count={`${formatNumber(tasks.length)} تسک`} to="/app/projects" />
      <StaggerList as="ul" className="mt-3 flex flex-col gap-2">
        {tasks.slice(0, 3).map((t) => (
          <StaggerItem as="li" key={`${t.project.id}-${t.id}`}>
            <Link to={`/app/projects/${t.project.id}`} className="flex items-center gap-3 rounded-[14px] border border-stroke bg-surface p-3 hover:border-stroke-strong">
              <span className="grid size-10 place-items-center rounded-[12px] bg-primary-soft text-primary">
                <Icon icon={CheckListIcon} size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold">{t.title}</span>
                <span className="block truncate text-xs text-fg-subtle">{t.project.title}</span>
              </span>
              <span className="text-xs text-warning">{formatRelative(t.due!)}</span>
            </Link>
          </StaggerItem>
        ))}
      </StaggerList>
    </section>
  )
}

function PlusBanner() {
  const { user } = useApp()
  if (user?.plus) return null
  return (
    <Link to="/app/plus" className="group relative block overflow-hidden rounded-[18px] border border-primary/30 bg-[linear-gradient(120deg,#2a0f25,#0d0d0d_60%)] p-4">
      <div aria-hidden className="absolute -top-10 -left-10 size-40 rounded-full bg-primary/20 blur-3xl transition-transform group-hover:scale-125" />
      <div className="relative flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-[14px] bg-primary text-on-primary">
          <Icon icon={Crown02Icon} size={24} />
        </span>
        <div className="flex-1">
          <p className="font-extrabold">لنس پلاس</p>
          <p className="text-xs text-fg-muted">پیشنهاد نامحدود، نشان ویژه و کارمزد کمتر</p>
        </div>
        <Icon icon={ArrowLeft01Icon} size={20} className="text-primary transition-transform group-hover:-translate-x-1" />
      </div>
    </Link>
  )
}

function FreelancerDashboard() {
  const { projects: all } = useApp()
  const current = all.filter((p) => p.status !== 'done')
  return (
    <StaggerList className="flex flex-col gap-4">
      <StaggerItem>
        <ProfileCard />
      </StaggerItem>
      <StaggerItem>
        <WalletCard />
      </StaggerItem>
      <StaggerItem>
        <IncomeCard />
      </StaggerItem>
      <StaggerItem>
        <RelatedProjects />
      </StaggerItem>
      <StaggerItem>
        <section>
          <SectionHeader title="پروژه‌های جاری" count={`${formatNumber(current.length)} پروژه`} to="/app/projects" />
          <Carousel label="پروژه‌های جاری" className="mt-3" itemWidth="66%">
            {current.map((p) => (
              <ProjectMiniCard key={p.id} p={p} />
            ))}
          </Carousel>
        </section>
      </StaggerItem>
      <StaggerItem>
        <UpcomingTasks />
      </StaggerItem>
      <StaggerItem>
        <TemplatesCard />
      </StaggerItem>
      <StaggerItem>
        <PlusBanner />
      </StaggerItem>
      <StaggerItem className="grid grid-cols-2 gap-2">
        <ButtonLink to="/app/profile?tab=portfolio" variant="secondary" size="lg" iconStart={Upload01Icon}>
          بارگذاری نمونه‌کار
        </ButtonLink>
        <ButtonLink to="/app/discover" size="lg" iconStart={Bookmark02Icon}>
          پیدا کردن پروژه
        </ButtonLink>
      </StaggerItem>
    </StaggerList>
  )
}

function EmployerDashboard() {
  const { projects: all } = useApp()
  const active = all.filter((p) => p.status !== 'done')
  if (all.length === 0) {
    return (
      <EmptyState
        icon={Folder03Icon}
        title="هنوز پروژه‌ای ثبت نکردی"
        description="پروژه‌ات رو رایگان ثبت کن؛ معمولاً اولین پیشنهادها در کمتر از ۲ ساعت می‌رسن."
        action={
          <ButtonLink to="/projects/new" size="lg" iconStart={Add01Icon}>
            ثبت پروژه جدید
          </ButtonLink>
        }
      />
    )
  }
  return (
    <StaggerList className="flex flex-col gap-4">
      <StaggerItem>
        <ButtonLink to="/projects/new" size="lg" block iconStart={Add01Icon}>
          ثبت پروژه جدید
        </ButtonLink>
      </StaggerItem>
      <StaggerItem className="grid grid-cols-2 gap-3">
        <Link to="/app/projects" className="rounded-[16px] border border-stroke bg-surface p-4 hover:border-stroke-strong">
          <span className="grid size-11 place-items-center rounded-full bg-primary-soft text-primary">
            <Icon icon={Folder03Icon} size={22} />
          </span>
          <p className="mt-3 text-2xl font-extrabold text-primary">
            <CountUp value={active.length} />
          </p>
          <p className="text-xs text-fg-muted">پروژه جاری</p>
        </Link>
        <Link to="/app/wallet" className="rounded-[16px] border border-stroke bg-surface p-4 hover:border-stroke-strong">
          <span className="grid size-11 place-items-center rounded-full bg-primary-soft text-primary">
            <Icon icon={Wallet01Icon} size={22} />
          </span>
          <p className="mt-3 text-lg font-extrabold">{formatToman(55_000_000, { compact: true })}</p>
          <p className="text-xs text-fg-muted">در ضمانت لنس</p>
        </Link>
      </StaggerItem>
      <StaggerItem>
        <Card tone="accent" className="overflow-hidden">
          <div aria-hidden className="absolute inset-0 bg-dots opacity-20" />
          <div className="relative">
            <p className="text-lg font-extrabold">لنسر مناسب پروژه‌ات همین‌جاست</p>
            <p className="mt-1 text-sm opacity-80">{formatNumber(4)} لنسر برای «ادیت ویدیو ریل» پیشنهاد دادن.</p>
            <ButtonLink to="/app/projects/a2/requests" variant="inverse" className="mt-4">
              مشاهده درخواست‌ها
            </ButtonLink>
          </div>
        </Card>
      </StaggerItem>
      <StaggerItem>
        <section>
          <SectionHeader title="پروژه‌های جاری" count={`${formatNumber(active.length)} پروژه`} to="/app/projects" />
          <Carousel label="پروژه‌های جاری" className="mt-3" itemWidth="66%">
            {active.map((p) => (
              <ProjectMiniCard key={p.id} p={p} />
            ))}
          </Carousel>
        </section>
      </StaggerItem>
      <StaggerItem>
        <Card className="flex items-center gap-4">
          <ProgressRing value={me.completion} size={60} />
          <div className="flex-1">
            <p className="font-extrabold">پروفایلت رو تکمیل کن!</p>
            <p className="mt-1 text-xs text-fg-muted">لنسرها به کارفرماهای با پروفایل کامل بیشتر پیشنهاد می‌دن.</p>
          </div>
          <ButtonLink to="/app/profile/edit" size="sm" variant="secondary">
            تکمیل
          </ButtonLink>
        </Card>
      </StaggerItem>
      <StaggerItem>
        <section>
          <SectionHeader title="لنسرهای پیشنهادی" to="/app/discover?tab=lancer" />
          <div className="mt-3 flex items-center gap-3 rounded-[16px] border border-stroke bg-surface p-4">
            <Avatar name="سارا احمدی" size={44} online verified />
            <div className="flex-1">
              <p className="text-sm font-bold">سارا احمدی</p>
              <p className="text-xs text-fg-subtle">برنامه‌نویس فرانت‌اند</p>
            </div>
            <RatingBadge value={4.8} />
          </div>
        </section>
      </StaggerItem>
    </StaggerList>
  )
}

export function Dashboard() {
  const { role } = useApp()
  return (
    <>
      <Header />
      <Screen withNav title="داشبورد">
        <RoleSwitch />
        <motion.div key={role} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {role === 'employer' ? <EmployerDashboard /> : <FreelancerDashboard />}
        </motion.div>
      </Screen>
    </>
  )
}

