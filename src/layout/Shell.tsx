import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, useLocation, useOutlet, useParams } from 'react-router-dom'
import { AiMagicIcon, ArrowLeft01Icon, Briefcase01Icon, Image01Icon, Menu01Icon, Moon02Icon, Mortarboard01Icon, Sun03Icon, UserMultiple02Icon } from '@hugeicons/core-free-icons'
import { Logo } from '../brand/Logo'
import { LANGS, LocaleProvider, useLocale, type Bi, type Lang } from '../i18n/locale'
import { ButtonLink, cn, Container, Icon, IconButton, type IconSvgElement } from '../ui/core'
import { Sheet } from '../ui/overlay'

export const NAV: { to: string; label: Bi; icon: IconSvgElement }[] = [
  { to: '/work', label: { en: 'Work', fa: 'کاریابی' }, icon: Briefcase01Icon },
  { to: '/hire', label: { en: 'Hire', fa: 'استخدام' }, icon: UserMultiple02Icon },
  { to: '/agents', label: { en: 'Agents', fa: 'دستیارها' }, icon: AiMagicIcon },
  { to: '/learn', label: { en: 'Learn', fa: 'یادگیری' }, icon: Mortarboard01Icon },
  { to: '/showcase', label: { en: 'Showcase', fa: 'ویترین' }, icon: Image01Icon },
]

/* ───────────── Theme ───────────── */
type Theme = 'night' | 'day'
function initialTheme(): Theme {
  try {
    const t = localStorage.getItem('lance:theme')
    if (t === 'night' || t === 'day') return t
  } catch {
    /* ignore */
  }
  return matchMedia('(prefers-color-scheme: light)').matches ? 'day' : 'night'
}
function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme)
  useEffect(() => {
    const root = document.documentElement
    // Switching themes must not trigger transitions (Rauno).
    root.classList.add('no-transitions')
    root.classList.remove('night', 'day')
    root.classList.add(theme)
    const t = setTimeout(() => root.classList.remove('no-transitions'), 50)
    try {
      localStorage.setItem('lance:theme', theme)
    } catch {
      /* ignore */
    }
    return () => clearTimeout(t)
  }, [theme])
  return [theme, setTheme] as const
}

function LangSwitch() {
  const { lang, switchTo } = useLocale()
  const next: Lang = lang === 'fa' ? 'en' : 'fa'
  return (
    <button
      type="button"
      onClick={() => switchTo(next)}
      lang={next}
      className="h-10 rounded-sm px-3 text-[14px] text-ink-muted transition-colors hover:bg-raised hover:text-ink"
      aria-label={lang === 'fa' ? 'Switch to English' : 'تغییر زبان به فارسی'}
    >
      {lang === 'fa' ? 'EN' : 'فا'}
    </button>
  )
}

function Header() {
  const { t, to, lang } = useLocale()
  const [theme, setTheme] = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const loc = useLocation()
  useEffect(() => setOpen(false), [loc.pathname])
  useEffect(() => {
    const on = () => setScrolled(scrollY > 8)
    on()
    addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])

  const themeBtn = (
    <IconButton
      icon={theme === 'night' ? Sun03Icon : Moon02Icon}
      label={theme === 'night' ? t({ en: 'Day theme', fa: 'حالت روز' }) : t({ en: 'Night theme', fa: 'حالت شب' })}
      onClick={() => setTheme(theme === 'night' ? 'day' : 'night')}
    />
  )

  return (
    <header className={cn('sticky top-0 z-40 border-b transition-colors duration-200', scrolled ? 'border-line bg-ground/85 backdrop-blur-md' : 'border-transparent bg-ground/0')}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-sm focus:bg-raised focus:px-3 focus:py-2">
        {t({ en: 'Skip to content', fa: 'رفتن به محتوا' })}
      </a>
      <Container className="flex h-[84px] items-center gap-4">
        <Link to={to('/')} aria-label={t({ en: 'Lance home', fa: 'صفحه‌ی اصلی لنس' })} className="shrink-0">
          <Logo size={28} />
        </Link>
        {/* The segmented nav pill from the Figma app header: icon + label, active item lit pink. */}
        <nav aria-label={t({ en: 'Main', fa: 'اصلی' })} className="hidden flex-1 justify-center xl:flex">
          <ul className="flex items-center gap-1 rounded-[14px] bg-surface p-1 day:border day:border-line">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={to(n.to)}
                  className={({ isActive }) => cn('relative flex h-11 items-center gap-2 rounded-[10px] px-4 text-[15px] transition-colors', isActive ? 'text-pink-ink' : 'text-ink-muted hover:text-ink')}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-[10px] bg-pink-soft" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                      <Icon icon={n.icon} size={19} className="relative" />
                      <span className="relative">{t(n.label)}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ms-auto flex items-center gap-1.5 xl:ms-0">
          <NavLink to={to('/plus')} className={({ isActive }) => cn('hidden h-10 items-center rounded-[10px] px-3 text-[15px] font-medium sm:flex', isActive ? 'text-sun-ink' : 'text-sun-ink/90 hover:text-sun-ink')}>
            {t({ en: 'Plus', fa: 'لنس پلاس' })}
          </NavLink>
          <LangSwitch />
          {themeBtn}
          <ButtonLink to={to('/sign-in')} variant="solid" className="max-md:hidden">
            {t({ en: 'Sign in', fa: 'ورود' })}
          </ButtonLink>
          <ButtonLink to={to('/start')} className="max-sm:hidden">
            {t({ en: 'Get started', fa: 'از اینجا شروع کن' })}
          </ButtonLink>
          <IconButton icon={Menu01Icon} label={t({ en: 'Menu', fa: 'منو' })} className="xl:hidden" onClick={() => setOpen(true)} />
        </div>
      </Container>

      <Sheet open={open} onClose={() => setOpen(false)} title={t({ en: 'Menu', fa: 'منو' })}>
        <nav aria-label={t({ en: 'Main', fa: 'اصلی' })}>
          <ul className="flex flex-col">
            {[...NAV, { to: '/plus', label: { en: 'Lance Plus', fa: 'لنس پلاس' } }, { to: '/sign-in', label: { en: 'Sign in', fa: 'ورود' } }].map((n) => (
              <li key={n.to}>
                <NavLink to={to(n.to)} className={({ isActive }) => cn('flex h-14 items-center gap-3 border-b border-line text-[18px]', isActive ? 'text-pink-ink' : 'text-ink-muted')}>
                  {'icon' in n && <Icon icon={n.icon as IconSvgElement} size={20} />}
                  {t(n.label)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <ButtonLink to={to('/start')} block size="lg" className="mt-6">
          {t({ en: 'Get started', fa: 'از اینجا شروع کن' })}
        </ButtonLink>
        <p className="mt-6 text-[14px] text-ink-subtle">{lang === 'fa' ? 'زبان و حالت نمایش از نوار بالا عوض می‌شه.' : 'Language and theme live in the top bar.'}</p>
      </Sheet>
    </header>
  )
}

function Footer() {
  const { t, to } = useLocale()
  // Footer as in the Figma landing: brand block, a panel of main links with arrows, then the rest.
  const main: { to: string; label: Bi }[] = [
    { to: '/hire', label: { en: 'For employers', fa: 'برای کارفرماها' } },
    { to: '/work', label: { en: 'For lancers', fa: 'برای لنسرها' } },
    { to: '/learn', label: { en: 'For starters', fa: 'برای تازه‌کارها' } },
    { to: '/agents', label: { en: 'The Round Table', fa: 'میزگرد دستیارها' } },
  ]
  const more: { to: string; label: Bi }[] = [
    { to: '/hire/new', label: { en: 'Post a project', fa: 'ثبت پروژه' } },
    { to: '/hire/offers/agentic-pmo', label: { en: 'Agentic PMO', fa: 'مدیریت پروژه‌ی هوشمند' } },
    { to: '/merlin', label: { en: 'Merlin price check', fa: 'قیمت‌گذاری با مرلین' } },
    { to: '/plus', label: { en: 'Lance Plus', fa: 'لنس پلاس' } },
    { to: '/dashboard', label: { en: 'Dashboard (demo)', fa: 'داشبورد (نمایشی)' } },
    { to: '/learn/teach', label: { en: 'Teach on Lance', fa: 'در لنس درس بده' } },
    { to: '/brand', label: { en: 'Brand', fa: 'برند' } },
    { to: '/docs', label: { en: 'Journeys & user docs', fa: 'مسیرهای کاربر و مستندات' } },
  ]
  const year = new Intl.DateTimeFormat(t({ en: 'en-GB', fa: 'fa-IR-u-ca-persian' }), { year: 'numeric' }).format(new Date())
  return (
    <footer className="mt-32">
      <Container className="grid gap-10 py-16 md:grid-cols-[1.15fr_1fr_1fr] [&>*]:min-w-0">
        <div className="max-w-[380px]">
          <Logo size={32} />
          <p className="mt-5 text-[15px] leading-relaxed text-ink-muted">
            {t({
              en: 'Lance is a freelancing platform for working together online: find work from every job site, hire with a fair price, hand routine work to agents, learn a skill and show what you make.',
              fa: 'لنس پلتفرم فریلنسینگ و دورکاریه: کار رو از همه‌ی سایت‌ها پیدا کن، با قیمت منصفانه استخدام کن، کارهای تکراری رو به دستیارها بسپار، مهارت یاد بگیر و کارت رو نشون بده.',
            })}
          </p>
          <p className="mt-4 text-[15px] font-semibold text-pink-ink">{t({ en: 'At Lance, working together online is simple, safe and fast.', fa: 'در لنس، مسیر همکاری آنلاین ساده، امن و سریع می‌شه.' })}</p>
        </div>
        <nav aria-label={t({ en: 'Who Lance is for', fa: 'لنس برای کیه' })}>
          <ul className="overflow-hidden rounded-lg bg-surface day:border day:border-line">
            {main.map((l) => (
              <li key={l.to} className="border-b border-line last:border-b-0">
                <Link to={to(l.to)} className="flex h-14 items-center justify-between px-5 text-[15px] text-ink-muted transition-colors hover:bg-raised hover:text-ink">
                  {t(l.label)}
                  <Icon icon={ArrowLeft01Icon} size={18} className="rotate-180 rtl:rotate-0" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={t({ en: 'More from Lance', fa: 'بیشتر از لنس' })}>
          <h2 className="mb-4 text-[14px] text-ink-subtle">{t({ en: 'More from Lance', fa: 'بیشتر از لنس' })}</h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-[15px]">
            {more.map((l) => (
              <li key={l.to}>
                <Link to={to(l.to)} className="text-ink-muted transition-colors hover:text-ink">
                  {t(l.label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <Container className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-6 text-[14px] text-ink-subtle">
        <span>
          © {year} {t({ en: 'Lance', fa: 'لنس' })}
        </span>
        <span>{t({ en: 'Demo content: listings and people are samples.', fa: 'محتوای نمایشی: آگهی‌ها و افراد نمونه هستن.' })}</span>
      </Container>
    </footer>
  )
}

/** Route frame for one language: sets <html lang/dir>, provides locale, transitions pages. */
export function LangShell() {
  const { lang } = useParams()
  const loc = useLocation()
  // Capture the element so the exiting page keeps its own content while fading out.
  const outlet = useOutlet()
  const valid = LANGS.includes(lang as Lang)
  useEffect(() => {
    if (!valid) return
    document.documentElement.lang = lang!
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr'
  }, [lang, valid])
  useEffect(() => {
    scrollTo({ top: 0 })
  }, [loc.pathname])
  if (!valid) return <Navigate to={`/en${loc.pathname}`} replace />
  return (
    <LocaleProvider lang={lang as Lang}>
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          id="main"
          key={loc.pathname.replace(/^\/(en|fa)/, '')}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="min-h-[60vh]"
        >
          {outlet}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </LocaleProvider>
  )
}

/** Small helper so pages can set the document title in their language. */
export function useTitle(title: Bi) {
  const { t } = useLocale()
  const text = t(title)
  useEffect(() => {
    document.title = `${text} · ${t({ en: 'Lance', fa: 'لنس' })}`
  }, [text, t])
}
