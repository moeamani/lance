import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, useLocation, useOutlet, useParams } from 'react-router-dom'
import { Menu01Icon, Moon02Icon, Sun03Icon } from '@hugeicons/core-free-icons'
import { Logo } from '../brand/Logo'
import { LANGS, LocaleProvider, useLocale, type Bi, type Lang } from '../i18n/locale'
import { ButtonLink, cn, Container, IconButton } from '../ui/core'
import { Sheet } from '../ui/overlay'

export const NAV: { to: string; label: Bi }[] = [
  { to: '/work', label: { en: 'Work', fa: 'کاریابی' } },
  { to: '/hire', label: { en: 'Hire', fa: 'استخدام' } },
  { to: '/agents', label: { en: 'Agents', fa: 'دستیارها' } },
  { to: '/learn', label: { en: 'Learn', fa: 'یادگیری' } },
  { to: '/showcase', label: { en: 'Showcase', fa: 'ویترین' } },
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
    <header className={cn('sticky top-0 z-40 border-b transition-colors duration-200', scrolled ? 'border-line bg-ground/85 backdrop-blur-md' : 'border-transparent bg-ground')}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-sm focus:bg-raised focus:px-3 focus:py-2">
        {t({ en: 'Skip to content', fa: 'رفتن به محتوا' })}
      </a>
      <Container className="flex h-[68px] items-center gap-6">
        <Link to={to('/')} aria-label={t({ en: 'Lance home', fa: 'صفحه‌ی اصلی لنس' })} className="shrink-0">
          <Logo size={26} />
        </Link>
        <nav aria-label={t({ en: 'Main', fa: 'اصلی' })} className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={to(n.to)}
                  className={({ isActive }) =>
                    cn('relative flex h-10 items-center rounded-sm px-3.5 text-[15px] transition-colors', isActive ? 'text-ink' : 'text-ink-muted hover:text-ink')
                  }
                >
                  {({ isActive }) => (
                    <>
                      {t(n.label)}
                      {isActive && (
                        <motion.span
                          layoutId="nav-led"
                          className="absolute inset-x-3 -bottom-[15px] h-px bg-pink shadow-[0_0_10px_var(--pink)]"
                          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ms-auto flex items-center gap-1 lg:ms-0">
          <NavLink to={to('/plus')} className={({ isActive }) => cn('hidden h-10 items-center rounded-sm px-3 text-[15px] sm:flex', isActive ? 'text-sun-ink' : 'text-sun-ink/90 hover:text-sun-ink')}>
            {t({ en: 'Plus', fa: 'لنس پلاس' })}
          </NavLink>
          <LangSwitch />
          {themeBtn}
          <Link to={to('/sign-in')} className="hidden h-10 items-center rounded-sm px-3 text-[15px] text-ink-muted hover:text-ink md:flex">
            {t({ en: 'Sign in', fa: 'ورود' })}
          </Link>
          <ButtonLink to={to('/start')} size="sm" className="ms-1 max-sm:hidden">
            {t({ en: 'Start', fa: 'از اینجا شروع کن' })}
          </ButtonLink>
          <IconButton icon={Menu01Icon} label={t({ en: 'Menu', fa: 'منو' })} className="lg:hidden" onClick={() => setOpen(true)} />
        </div>
      </Container>

      <Sheet open={open} onClose={() => setOpen(false)} title={t({ en: 'Menu', fa: 'منو' })}>
        <nav aria-label={t({ en: 'Main', fa: 'اصلی' })}>
          <ul className="flex flex-col">
            {[...NAV, { to: '/plus', label: { en: 'Lance Plus', fa: 'لنس پلاس' } }, { to: '/sign-in', label: { en: 'Sign in', fa: 'ورود' } }].map((n) => (
              <li key={n.to}>
                <NavLink to={to(n.to)} className={({ isActive }) => cn('flex h-14 items-center border-b border-line text-[18px]', isActive ? 'text-ink' : 'text-ink-muted')}>
                  {t(n.label)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <ButtonLink to={to('/start')} block size="lg" className="mt-6">
          {t({ en: 'Start', fa: 'از اینجا شروع کن' })}
        </ButtonLink>
        <p className="mt-6 text-[14px] text-ink-subtle">{lang === 'fa' ? 'زبان و حالت نمایش از نوار بالا عوض می‌شه.' : 'Language and theme live in the top bar.'}</p>
      </Sheet>
    </header>
  )
}

function Footer() {
  const { t, to } = useLocale()
  const groups: { title: Bi; links: { to: string; label: Bi }[] }[] = [
    {
      title: { en: 'Work', fa: 'کاریابی' },
      links: [
        { to: '/work', label: { en: 'Job Radar', fa: 'رادار کار' } },
        { to: '/plus/cv', label: { en: 'CV tailor', fa: 'رزومه‌ساز' } },
        { to: '/showcase', label: { en: 'Showcase', fa: 'ویترین' } },
      ],
    },
    {
      title: { en: 'Hire', fa: 'استخدام' },
      links: [
        { to: '/hire/new', label: { en: 'Post a project', fa: 'ثبت پروژه' } },
        { to: '/hire/offers/agentic-pmo', label: { en: 'Agentic PMO', fa: 'مدیریت پروژه‌ی هوشمند' } },
        { to: '/agents/merlin', label: { en: 'Ask Merlin for a price', fa: 'قیمت رو از مرلین بپرس' } },
      ],
    },
    {
      title: { en: 'Learn', fa: 'یادگیری' },
      links: [
        { to: '/learn', label: { en: 'Paths for starters', fa: 'مسیرهای شروع' } },
        { to: '/learn/teach', label: { en: 'Teach on Lance', fa: 'در لنس درس بده' } },
        { to: '/start', label: { en: 'How Lance works', fa: 'لنس چطور کار می‌کنه' } },
      ],
    },
    {
      title: { en: 'Lance', fa: 'لنس' },
      links: [
        { to: '/brand', label: { en: 'Brand', fa: 'برند' } },
        { to: '/docs', label: { en: 'Journeys & user docs', fa: 'مسیرهای کاربر و مستندات' } },
        { to: '/plus', label: { en: 'Lance Plus', fa: 'لنس پلاس' } },
      ],
    },
  ]
  const year = new Intl.DateTimeFormat(t({ en: 'en-GB', fa: 'fa-IR-u-ca-persian' }), { year: 'numeric' }).format(new Date())
  return (
    <footer className="mt-32 border-t border-line">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.2fr_repeat(4,1fr)]">
        <div className="max-w-[280px]">
          <Logo size={28} />
          <p className="mt-4 text-[15px] text-ink-muted">
            {t({
              en: 'Work, hiring, learning and agents for people who work on their own terms.',
              fa: 'کار، استخدام، یادگیری و دستیار هوشمند، برای کسایی که مستقل کار می‌کنن.',
            })}
          </p>
        </div>
        {groups.map((g) => (
          <nav key={g.title.en} aria-label={t(g.title)}>
            <h2 className="mb-4 text-[14px] text-ink-subtle">{t(g.title)}</h2>
            <ul className="flex flex-col gap-3 text-[15px]">
              {g.links.map((l) => (
                <li key={l.to}>
                  <Link to={to(l.to)} className="text-ink-muted transition-colors hover:text-ink">
                    {t(l.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
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
