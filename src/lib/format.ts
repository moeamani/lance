/**
 * Locale helpers for an Iranian (fa-IR) audience.
 *
 * The Figma file mixes «ریال» and «تومان» on the same card and sometimes
 * mixes Latin/Persian digits. Everything money- or number-shaped in the UI
 * goes through these helpers so that never happens in code.
 */

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩'

/** Latin (and Arabic-Indic) digits → Extended Arabic-Indic (Persian) digits. */
export function toFaDigits(input: string | number): string {
  return String(input)
    .replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)])
    .replace(/[٠-٩]/g, (d) => FA_DIGITS[AR_DIGITS.indexOf(d)])
}

/** Persian / Arabic digits → Latin digits. Use before validating user input. */
export function toEnDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)))
}

const numberFmt = new Intl.NumberFormat('fa-IR')

/** 12500000 → «۱۲٬۵۰۰٬۰۰۰» */
export function formatNumber(n: number): string {
  return numberFmt.format(n)
}

/** Single source of truth for money: always Toman, always Persian digits. */
export function formatToman(n: number, opts: { compact?: boolean } = {}): string {
  if (opts.compact) {
    if (n >= 1_000_000_000) return `${formatNumber(+(n / 1_000_000_000).toFixed(1))} میلیارد تومان`
    if (n >= 1_000_000) return `${formatNumber(+(n / 1_000_000).toFixed(1))} میلیون تومان`
    if (n >= 1_000) return `${formatNumber(Math.round(n / 1_000))} هزار تومان`
  }
  return `${formatNumber(n)} تومان`
}

export function formatPercent(n: number): string {
  return `${formatNumber(Math.round(n))}٪`
}

const jalaliDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
const jalaliLong = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric', month: 'long' })
const jalaliLongYear = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const timeFmt = new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit', hour12: false })

/** → «۱۴۰۴/۱۱/۱۳» */
export const formatDate = (d: Date | string) => jalaliDate.format(new Date(d))
/** → «۱۴ آذر» */
export const formatDayMonth = (d: Date | string) => jalaliLong.format(new Date(d))
/** → «۲۴ آذر ۱۴۰۴» */
export const formatLongDate = (d: Date | string) => jalaliLongYear.format(new Date(d))
/** → «۱۳:۴۵» */
export const formatTime = (d: Date | string) => timeFmt.format(new Date(d))

const rtf = new Intl.RelativeTimeFormat('fa', { numeric: 'auto' })

/** → «۲ ساعت پیش», «دیروز» */
export function formatRelative(d: Date | string, now = Date.now()): string {
  const diff = (new Date(d).getTime() - now) / 1000
  const abs = Math.abs(diff)
  if (abs < 60) return 'همین حالا'
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute')
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour')
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), 'day')
  return formatDate(d)
}

/** 09121234567 → «۰۹۱۲ ۱۲۳ ۴۵۶۷» */
export function formatMobile(raw: string): string {
  const d = toEnDigits(raw).replace(/\D/g, '')
  const parts = [d.slice(0, 4), d.slice(4, 7), d.slice(7, 11)].filter(Boolean)
  return toFaDigits(parts.join(' '))
}

/** Mask the middle of a mobile number for display: «۰۹۱۲ ••• ۴۵۶۷» */
export function maskMobile(raw: string): string {
  const d = toEnDigits(raw).replace(/\D/g, '')
  if (d.length < 8) return toFaDigits(d)
  return toFaDigits(`${d.slice(0, 4)} ••• ${d.slice(-4)}`)
}

/** 3.2 MB style sizes in Persian. */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${formatNumber(bytes)} بایت`
  if (bytes < 1024 ** 2) return `${formatNumber(+(bytes / 1024).toFixed(1))} کیلوبایت`
  return `${formatNumber(+(bytes / 1024 ** 2).toFixed(1))} مگابایت`
}

/** Days → human duration: 7 → «۷ روز», 30 → «۱ ماه» */
export function formatDays(days: number): string {
  if (days >= 30 && days % 30 === 0) return `${formatNumber(days / 30)} ماه`
  return `${formatNumber(days)} روز`
}
