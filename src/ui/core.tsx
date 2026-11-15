import { motion, type HTMLMotionProps } from 'motion/react'
import { forwardRef, useId, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import clsx from 'clsx'

export const cn = clsx
export type { IconSvgElement }

/* ───────────── Icon ───────────── */
export function Icon({ icon, size = 20, className, directional, stroke = 1.6 }: { icon: IconSvgElement; size?: number; className?: string; directional?: boolean; stroke?: number }) {
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={stroke} className={cn('shrink-0', directional && 'flip-rtl', className)} aria-hidden />
}

/* ───────────── Button ─────────────
 * From the Figma web screens: pink fill with black type (main action), dark fill (secondary, e.g.
 * "Sign in"), light outline (hero secondary), pink outline (in-card actions), sun (Plus).
 */
type Variant = 'primary' | 'sun' | 'solid' | 'outline' | 'pinkline' | 'ghost' | 'onpink'
type Size = 'sm' | 'md' | 'lg'
const base =
  'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-semibold transition-[background,color,border-color,box-shadow,filter] duration-150 disabled:pointer-events-none disabled:opacity-45'
const variants: Record<Variant, string> = {
  primary: 'bg-pink text-on-accent shadow-[0_10px_28px_-12px_color-mix(in_oklab,var(--pink)_calc(90%*var(--glow)),transparent)] hover:brightness-105',
  sun: 'bg-sun text-[#14110a] hover:brightness-105',
  solid: 'bg-raised text-ink hover:bg-line day:border day:border-line',
  outline: 'border border-ink-muted/70 text-ink hover:border-ink hover:bg-ink/5 bg-transparent',
  pinkline: 'border border-pink text-pink-ink hover:bg-pink-soft bg-transparent',
  ghost: 'text-ink-muted hover:text-ink hover:bg-raised',
  // Black button on a pink band (the Figma join banner).
  onpink: 'bg-[#0D0D0D] text-[#FF7FE3] hover:bg-black',
}
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[14px] rounded-[8px]',
  md: 'h-11 px-5 text-[15px] rounded-[10px]',
  lg: 'h-13 px-7 text-[16px] rounded-[12px]',
}
type Common = { variant?: Variant; size?: Size; icon?: IconSvgElement; iconEnd?: IconSvgElement; directional?: boolean; block?: boolean; className?: string; children?: ReactNode }

export const Button = forwardRef<HTMLButtonElement, Common & Omit<HTMLMotionProps<'button'>, 'children'>>(function Button(
  { variant = 'primary', size = 'md', icon, iconEnd, directional, block, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <motion.button ref={ref} type={type} whileTap={{ scale: 0.97 }} transition={{ duration: 0.12 }} className={cn(base, variants[variant], sizes[size], block && 'w-full', className)} {...rest}>
      {icon && <Icon icon={icon} size={18} directional={directional} />}
      {children}
      {iconEnd && <Icon icon={iconEnd} size={18} directional={directional} />}
    </motion.button>
  )
})

export function ButtonLink({ variant = 'primary', size = 'md', icon, iconEnd, directional, block, className, children, ...rest }: Common & LinkProps) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], block && 'w-full', 'active:scale-[0.97]', className)} {...rest}>
      {icon && <Icon icon={icon} size={18} directional={directional} />}
      {children}
      {iconEnd && <Icon icon={iconEnd} size={18} directional={directional} />}
    </Link>
  )
}

export const IconButton = forwardRef<HTMLButtonElement, { icon: IconSvgElement; label: string; directional?: boolean; className?: string; size?: 'sm' | 'md' } & Omit<HTMLMotionProps<'button'>, 'children'>>(
  function IconButton({ icon, label, directional, className, size = 'md', type = 'button', ...rest }, ref) {
    return (
      <motion.button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        whileTap={{ scale: 0.94 }}
        className={cn('inline-grid shrink-0 place-items-center rounded-[10px] text-ink-muted transition-colors hover:bg-raised hover:text-ink', size === 'sm' ? 'size-9' : 'size-10', className)}
        {...rest}
      >
        <Icon icon={icon} size={size === 'sm' ? 18 : 20} directional={directional} />
      </motion.button>
    )
  },
)

/* ───────────── Tags ───────────── */
type Tone = 'neutral' | 'pink' | 'sun' | 'success' | 'danger'
const tones: Record<Tone, string> = {
  neutral: 'bg-raised text-ink-muted day:border day:border-line',
  pink: 'bg-pink-soft text-pink-ink',
  sun: 'bg-sun-soft text-sun-ink',
  success: 'bg-mint-soft text-mint-ink',
  danger: 'bg-[color-mix(in_oklab,var(--danger)_14%,transparent)] text-danger',
}
export function Tag({ children, tone = 'neutral', className, icon }: { children: ReactNode; tone?: Tone; className?: string; icon?: IconSvgElement }) {
  return (
    <span className={cn('inline-flex h-7 items-center gap-1.5 rounded-[8px] px-2.5 text-[13px] font-medium whitespace-nowrap', tones[tone], className)}>
      {icon && <Icon icon={icon} size={14} />}
      {children}
    </span>
  )
}

/** Round icon chip: a pink-tinted disc with a pink icon, as on the Figma service tiles and cards. */
export function IconChip({ icon, size = 44, tone = 'pink', className }: { icon: IconSvgElement; size?: number; tone?: 'pink' | 'sun' | 'sky' | 'mint'; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('inline-grid shrink-0 place-items-center rounded-full', className)}
      style={{ width: size, height: size, background: `color-mix(in oklab, var(--${tone}) 22%, transparent)`, color: `var(--${tone}-ink)` }}
    >
      <Icon icon={icon} size={Math.round(size * 0.48)} />
    </span>
  )
}

/** The Figma headline device: one word in pink. */
export function Hl({ children }: { children: ReactNode }) {
  return <span className="text-pink-ink">{children}</span>
}

/** LED pip: a small light that means "live" or "current". */
export function Pip({ tone = 'pink', pulse }: { tone?: 'pink' | 'sun' | 'success'; pulse?: boolean }) {
  const c = tone === 'sun' ? 'var(--sun)' : tone === 'success' ? 'var(--success)' : 'var(--pink)'
  return <span aria-hidden className={cn('inline-block size-1.5 rounded-full', pulse && 'breathe')} style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
}

/* ───────────── Surfaces ───────────── */
export function Panel({ className, rail, as: As = 'div', children, ...rest }: { className?: string; rail?: 'pink' | 'sun'; as?: 'div' | 'section' | 'article' | 'li'; children: ReactNode } & React.HTMLAttributes<HTMLElement>) {
  return (
    <As className={cn('rounded-lg border border-line/70 bg-surface', rail && 'rail', rail === 'sun' && 'rail-sun', className)} {...rest}>
      {children}
    </As>
  )
}

/* ───────────── Page layout ───────────── */
export function Container({ className, children, narrow }: { className?: string; children: ReactNode; narrow?: boolean }) {
  return <div className={cn('mx-auto w-full px-5 sm:px-8', narrow ? 'max-w-[760px]' : 'max-w-[1200px]', className)}>{children}</div>
}

export function PageHeader({ title, lead, crumbs, actions, className }: { title: ReactNode; lead?: ReactNode; crumbs?: { label: string; to?: string }[]; actions?: ReactNode; className?: string }) {
  return (
    <header className={cn('pt-10 pb-10 sm:pt-14', className)}>
      {crumbs && (
        <nav aria-label="Breadcrumb" className="mb-5 text-[14px] text-ink-subtle">
          <ol className="flex flex-wrap items-center gap-2">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-2">
                {c.to ? (
                  <Link to={c.to} className="hover:text-ink">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-ink-muted">
                    {c.label}
                  </span>
                )}
                {i < crumbs.length - 1 && <span aria-hidden>/</span>}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-[720px]">
          <h1 className="display text-[clamp(2.25rem,4.6vw,3.75rem)]">{title}</h1>
          {lead && <p className="mt-4 max-w-[60ch] text-[18px] text-ink-muted">{lead}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </header>
  )
}

export function SectionHead({ title, lead, action, className, id, center }: { title: ReactNode; lead?: ReactNode; action?: ReactNode; className?: string; id?: string; center?: boolean }) {
  if (center)
    return (
      <div className={cn('mx-auto mb-12 max-w-[720px] text-center', className)}>
        <h2 id={id} className="heading text-[clamp(1.6rem,2.8vw,2.25rem)]">
          {title}
        </h2>
        {lead && <p className="mt-3 text-[17px] text-ink-muted">{lead}</p>}
        {action && <div className="mt-6 flex justify-center">{action}</div>}
      </div>
    )
  return (
    <div className={cn('mb-8 flex flex-wrap items-end justify-between gap-4', className)}>
      <div className="max-w-[640px]">
        <h2 id={id} className="heading text-[clamp(1.6rem,2.6vw,2.25rem)]">
          {title}
        </h2>
        {lead && <p className="mt-3 text-ink-muted">{lead}</p>}
      </div>
      {action}
    </div>
  )
}

/* ───────────── Fields ─────────────
 * Labels above, persistent; help under the label; errors under the field; 16px+ input text.
 */
export function Field({ label, help, error, optional, children, id }: { label: ReactNode; help?: ReactNode; error?: string | false; optional?: string; children: (p: { id: string; describedBy?: string; invalid?: boolean }) => ReactNode; id?: string }) {
  const auto = useId()
  const fid = id ?? auto
  const hid = `${fid}-help`
  const eid = `${fid}-err`
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fid} className="flex items-baseline justify-between gap-3 text-[15px] font-medium">
        {label}
        {optional && <span className="text-[13px] font-normal text-ink-subtle">{optional}</span>}
      </label>
      {help && (
        <p id={hid} className="-mt-1 text-[14px] text-ink-subtle">
          {help}
        </p>
      )}
      {children({ id: fid, describedBy: cn(help && hid, error && eid) || undefined, invalid: !!error })}
      {error && (
        <p id={eid} role="alert" className="text-[14px] text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

/* Filled fields, as in the Figma forms: #1F1F1F, no border at rest, pink border on focus. */
export const inputCls =
  'w-full rounded-[10px] border border-transparent bg-raised px-4 text-[16px] text-ink placeholder:text-ink-subtle outline-none transition-[border-color,box-shadow] duration-150 day:border-line hover:border-line-strong focus:border-pink focus:shadow-[0_0_0_3px_var(--pink-soft)] aria-[invalid=true]:border-danger'

export function Choice({ options, value, onChange, label, multiple }: { options: { value: string; label: ReactNode; hint?: ReactNode }[]; value: string | string[]; onChange: (v: string) => void; label: string; multiple?: boolean }) {
  const selected = (v: string) => (Array.isArray(value) ? value.includes(v) : value === v)
  return (
    <div role={multiple ? 'group' : 'radiogroup'} aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role={multiple ? 'checkbox' : 'radio'}
          aria-checked={selected(o.value)}
          onClick={() => onChange(o.value)}
          className={cn(
            'min-h-11 rounded-[10px] border px-4 py-2 text-start text-[15px] transition-colors duration-150',
            selected(o.value) ? 'border-pink bg-pink-soft text-pink-ink' : 'border-transparent bg-raised text-ink-muted hover:border-line-strong hover:text-ink day:border-line',
          )}
        >
          <span className="block">{o.label}</span>
          {o.hint && <span className="block text-[13px] text-ink-subtle">{o.hint}</span>}
        </button>
      ))}
    </div>
  )
}
