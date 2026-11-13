import { toEnDigits } from './format'

/**
 * Real validators for the Iranian-specific fields in the onboarding and
 * identity-verification flows. The Figma screens show error states for these
 * fields but the rules themselves need to live somewhere — here.
 */

export type ValidationResult = { ok: true } | { ok: false; message: string }

const ok: ValidationResult = { ok: true }
const fail = (message: string): ValidationResult => ({ ok: false, message })

/** Iranian mobile: 09XXXXXXXXX (also accepts +989… / 989… / 9…). */
export function normalizeMobile(raw: string): string {
  let d = toEnDigits(raw).replace(/\D/g, '')
  if (d.startsWith('0098')) d = d.slice(4)
  else if (d.startsWith('98')) d = d.slice(2)
  if (d.startsWith('9')) d = `0${d}`
  return d
}

export function validateMobile(raw: string): ValidationResult {
  const d = normalizeMobile(raw)
  if (!d) return fail('شماره موبایل را وارد کنید.')
  if (!/^09\d{9}$/.test(d)) return fail('شماره موبایل باید ۱۱ رقم باشد و با ۰۹ شروع شود.')
  return ok
}

/** کد ملی — 10 digits with a mod-11 check digit. */
export function validateNationalId(raw: string): ValidationResult {
  const code = toEnDigits(raw).replace(/\D/g, '')
  if (!code) return fail('کد ملی را وارد کنید.')
  if (code.length !== 10) return fail('کد ملی باید ۱۰ رقم باشد.')
  if (/^(\d)\1{9}$/.test(code)) return fail('کد ملی معتبر نیست.')
  const check = Number(code[9])
  const sum = code
    .slice(0, 9)
    .split('')
    .reduce((acc, d, i) => acc + Number(d) * (10 - i), 0)
  const r = sum % 11
  const valid = r < 2 ? check === r : check === 11 - r
  return valid ? ok : fail('کد ملی معتبر نیست. لطفاً دوباره بررسی کنید.')
}

/** شماره شبا — IR + 24 digits, ISO 13616 mod-97 check. */
export function normalizeSheba(raw: string): string {
  return toEnDigits(raw).replace(/[\s-]/g, '').toUpperCase().replace(/^(?!IR)/, 'IR')
}

export function validateSheba(raw: string): ValidationResult {
  const s = normalizeSheba(raw)
  if (s === 'IR') return fail('شماره شبا را وارد کنید.')
  if (!/^IR\d{24}$/.test(s)) return fail('شماره شبا باید ۲۴ رقم بعد از IR باشد.')
  // Move country code + check digits to the end, letters → numbers (I=18, R=27).
  const rearranged = s.slice(4) + '1827' + s.slice(2, 4)
  let rem = 0
  for (const ch of rearranged) rem = (rem * 10 + Number(ch)) % 97
  return rem === 1 ? ok : fail('شماره شبا معتبر نیست.')
}

/** Known bank prefixes (digits 5–7 of SHEBA) for showing the bank name live. */
const BANKS: Record<string, string> = {
  '012': 'بانک ملت',
  '017': 'بانک ملی',
  '018': 'بانک تجارت',
  '019': 'بانک صادرات',
  '015': 'بانک سپه',
  '016': 'بانک کشاورزی',
  '021': 'پست بانک',
  '054': 'بانک پارسیان',
  '055': 'بانک اقتصاد نوین',
  '056': 'بانک سامان',
  '057': 'بانک پاسارگاد',
  '062': 'بانک آینده',
  '013': 'بانک رفاه',
  '020': 'بانک توسعه صادرات',
  '059': 'بانک سینا',
}

export function bankFromSheba(raw: string): string | null {
  const s = normalizeSheba(raw)
  if (s.length < 7) return null
  return BANKS[s.slice(4, 7)] ?? null
}

export type PasswordRule = { id: string; label: string; test: (p: string) => boolean }

/** Live checklist rules — replaces the static red/yellow/green copy in Figma. */
export const PASSWORD_RULES: PasswordRule[] = [
  { id: 'len', label: 'حداقل ۸ کاراکتر', test: (p) => p.length >= 8 },
  { id: 'case', label: 'حروف بزرگ و کوچک انگلیسی', test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { id: 'num', label: 'حداقل یک عدد', test: (p) => /\d/.test(toEnDigits(p)) },
  { id: 'sym', label: 'حداقل یک کاراکتر خاص (!@#…)', test: (p) => /[^A-Za-z0-9؀-ۿ\s]/.test(p) },
]

export function passwordStrength(p: string): 0 | 1 | 2 | 3 | 4 {
  return PASSWORD_RULES.filter((r) => r.test(p)).length as 0 | 1 | 2 | 3 | 4
}

export function validateName(raw: string): ValidationResult {
  const v = raw.trim()
  if (!v) return fail('نام و نام خانوادگی را وارد کنید.')
  if (v.length < 3) return fail('نام باید حداقل ۳ حرف باشد.')
  return ok
}
