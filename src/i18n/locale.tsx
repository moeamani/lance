import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export type Lang = 'en' | 'fa'
export const LANGS: Lang[] = ['en', 'fa']

/** Copy is written per language, side by side, never generated from one another. */
export type Bi<T = string> = { en: T; fa: T }

type Currency = 'IRT' | 'USD'

type Locale = {
  lang: Lang
  dir: 'ltr' | 'rtl'
  /** Pick the string (or any value) for the active language. */
  t: <T>(copy: Bi<T>) => T
  num: (n: number, opts?: Intl.NumberFormatOptions) => string
  money: (amount: number, currency: Currency, opts?: { compact?: boolean }) => string
  /** A price range the way people say it: "38–53M toman", «۳۸ تا ۵۳ میلیون تومان», "$1,950–$2,850". */
  range: (low: number, high: number, currency: Currency) => string
  date: (d: Date | string, style?: 'short' | 'long') => string
  ago: (d: Date | string) => string
  /** Build a link inside the current language. */
  to: (path: string) => string
  switchTo: (lang: Lang) => void
}

const LocaleCtx = createContext<Locale | null>(null)

export function LocaleProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  const value = useMemo<Locale>(() => {
    const tag = lang === 'fa' ? 'fa-IR' : 'en-US'
    const nf = new Intl.NumberFormat(tag)
    const cal = lang === 'fa' ? 'fa-IR-u-ca-persian' : 'en-GB'
    const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })
    return {
      lang,
      dir: lang === 'fa' ? 'rtl' : 'ltr',
      t: (copy) => copy[lang],
      num: (n, opts) => (opts ? new Intl.NumberFormat(tag, opts).format(n) : nf.format(n)),
      money: (amount, currency, opts) => {
        if (currency === 'USD') {
          // Persian readers say «۹۰۰ دلار»; a $ next to Persian digits mixes scripts.
          if (lang === 'fa') return `${new Intl.NumberFormat(tag, { notation: opts?.compact ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(amount)} دلار`
          return new Intl.NumberFormat(tag, { style: 'currency', currency: 'USD', maximumFractionDigits: 0, notation: opts?.compact ? 'compact' : 'standard' }).format(amount)
        }
        // Toman: Iranians quote prices in toman; "M" reads naturally in English, میلیون in Persian.
        if (opts?.compact && amount >= 1_000_000) {
          const m = new Intl.NumberFormat(tag, { maximumFractionDigits: 1 }).format(amount / 1_000_000)
          return lang === 'fa' ? `${m} میلیون تومان` : `${m}M toman`
        }
        return lang === 'fa' ? `${nf.format(amount)} تومان` : `${nf.format(amount)} toman`
      },
      range: (low, high, currency) => {
        const f = (n: number, o?: Intl.NumberFormatOptions) => new Intl.NumberFormat(tag, o).format(n)
        if (currency === 'IRT' && low >= 1_000_000) {
          const m = (n: number) => f(n / 1_000_000, { maximumFractionDigits: 1 })
          return lang === 'fa' ? `${m(low)} تا ${m(high)} میلیون تومان` : `${m(low)}–${m(high)}M toman`
        }
        if (currency === 'USD') return lang === 'fa' ? `${f(low)} تا ${f(high)} دلار` : `$${f(low)}–$${f(high)}`
        return lang === 'fa' ? `${f(low)} تا ${f(high)} تومان` : `${f(low)}–${f(high)} toman`
      },
      date: (d, style = 'long') =>
        new Intl.DateTimeFormat(cal, style === 'long' ? { day: 'numeric', month: 'long', year: 'numeric' } : { day: 'numeric', month: 'short' }).format(new Date(d)),
      ago: (d) => {
        const s = (new Date(d).getTime() - Date.now()) / 1000
        const a = Math.abs(s)
        if (a < 3600) return rtf.format(Math.round(s / 60), 'minute')
        if (a < 86400) return rtf.format(Math.round(s / 3600), 'hour')
        return rtf.format(Math.round(s / 86400), 'day')
      },
      to: (path) => `/${lang}${path.startsWith('/') ? path : `/${path}`}`.replace(/\/$/, '') || `/${lang}`,
      switchTo: (next) => {
        const rest = pathname.replace(/^\/(en|fa)(?=\/|$)/, '')
        try {
          localStorage.setItem('lance:lang', next)
        } catch {
          /* private mode */
        }
        navigate(`/${next}${rest}${search}`, { replace: true })
      },
    }
  }, [lang, navigate, pathname, search])

  return <LocaleCtx.Provider value={value}>{children}</LocaleCtx.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleCtx)
  if (!ctx) throw new Error('useLocale outside LocaleProvider')
  return ctx
}

/** First visit: Persian browsers land on /fa, everyone else on /en; then the stored choice wins. */
export function preferredLang(): Lang {
  try {
    const saved = localStorage.getItem('lance:lang')
    if (saved === 'en' || saved === 'fa') return saved
  } catch {
    /* ignore */
  }
  return navigator.languages?.some((l) => l.startsWith('fa')) ? 'fa' : 'en'
}
