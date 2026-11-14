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

/* ───────────── Button ───────────── */
type Variant = 'primary' | 'gilt' | 'solid' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'
const base =
  'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background,color,border-color,box-shadow] duration-150 disabled:pointer-events-none disabled:opacity-45'
const variants: Record<Variant, string> = {
  // Cobalt is light = action. Its glow is the only shadow in the system.
  primary: 'bg-cobalt text-on-accent shadow-[0_0_0_1px_color-mix(in_oklab,var(--cobalt)_60%,transparent),0_6px_24px_-8px_color-mix(in_oklab,var(--cobalt)_calc(80%*var(--glow)),transparent)] hover:brightness-110',
  gilt: 'bg-gilt text-[#14110a] hover:brightness-105',
  solid: 'bg-ink text-ground hover:opacity-90',
  outline: 'border border-line-strong text-ink hover:border-ink-subtle bg-transparent',
  ghost: 'text-ink-muted hover:text-ink hover:bg-raised',
}
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[14px] rounded-sm',
  md: 'h-11 px-5 text-[15px] rounded-md',
  lg: 'h-13 px-6 text-[16px] rounded-md',
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
        className={cn('inline-grid shrink-0 place-items-center rounded-sm text-ink-muted transition-colors hover:bg-raised hover:text-ink', size === 'sm' ? 'size-9' : 'size-10', className)}
        {...rest}
      >
        <Icon icon={icon} size={size === 'sm' ? 18 : 20} directional={directional} />
      </motion.button>
    )
  },
)

/* ───────────── Tags ───────────── */
type Tone = 'neutral' | 'cobalt' | 'gilt' | 'success' | 'danger'
const tones: Record<Tone, string> = {
  neutral: 'bg-raised text-ink-muted border-line',
  cobalt: 'bg-cobalt-soft text-cobalt-ink border-transparent',
  gilt: 'bg-gilt-soft text-gilt-ink border-transparent',
  success: 'bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-success border-transparent',
  danger: 'bg-[color-mix(in_oklab,var(--danger)_14%,transparent)] text-danger border-transparent',
}
export function Tag({ children, tone = 'neutral', className, icon }: { children: ReactNode; tone?: Tone; className?: string; icon?: IconSvgElement }) {
  return (
    <span className={cn('inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[13px] whitespace-nowrap', tones[tone], className)}>
      {icon && <Icon icon={icon} size={14} />}
      {children}
    </span>
  )
}

/** LED pip: a small light that means "live" or "current". */
export function Pip({ tone = 'cobalt', pulse }: { tone?: 'cobalt' | 'gilt' | 'success'; pulse?: boolean }) {
  const c = tone === 'gilt' ? 'var(--gilt)' : tone === 'success' ? 'var(--success)' : 'var(--cobalt)'
  return <span aria-hidden className={cn('inline-block size-1.5 rounded-full', pulse && 'breathe')} style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
}

/* ───────────── Surfaces ───────────── */
export function Panel({ className, rail, as: As = 'div', children, ...rest }: { className?: string; rail?: 'cobalt' | 'gilt'; as?: 'div' | 'section' | 'article' | 'li'; children: ReactNode } & React.HTMLAttributes<HTMLElement>) {
  return (
    <As className={cn('rounded-lg border border-line bg-surface', rail && 'rail', rail === 'gilt' && 'rail-gilt', className)} {...rest}>
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

export function SectionHead({ title, lead, action, className, id }: { title: ReactNode; lead?: ReactNode; action?: ReactNode; className?: string; id?: string }) {
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

export const inputCls =
  'w-full rounded-md border border-line bg-raised px-4 text-[16px] text-ink placeholder:text-ink-subtle outline-none transition-[border-color,box-shadow] duration-150 hover:border-line-strong focus:border-cobalt focus:shadow-[0_0_0_3px_var(--cobalt-soft)] aria-[invalid=true]:border-danger'

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
            'min-h-11 rounded-md border px-4 py-2 text-start text-[15px] transition-colors duration-150',
            selected(o.value) ? 'border-cobalt bg-cobalt-soft text-ink' : 'border-line bg-raised text-ink-muted hover:border-line-strong hover:text-ink',
          )}
        >
          <span className="block">{o.label}</span>
          {o.hint && <span className="block text-[13px] text-ink-subtle">{o.hint}</span>}
        </button>
      ))}
    </div>
  )
}
