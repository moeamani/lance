import { AnimatePresence, motion } from 'motion/react'
import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { Alert02Icon, Call02Icon, ViewIcon, ViewOffSlashIcon } from '@hugeicons/core-free-icons'
import { cn } from '../../lib/cn'
import { Icon, type IconSvgElement } from './Icon'

type FieldShellProps = {
  label?: ReactNode
  hint?: ReactNode
  error?: string | false | null
  /** Shown at the end of the label row, e.g. «تنظیم مجدد» */
  labelAction?: ReactNode
  id: string
  children: ReactNode
  className?: string
}

/** Label + control + hint/error. Errors are announced and linked via aria-describedby. */
export function FieldShell({ label, hint, error, labelAction, id, children, className }: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {(label || labelAction) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <label htmlFor={id} className="text-sm font-bold text-fg">
              {label}
            </label>
          )}
          {labelAction}
        </div>
      )}
      {children}
      <AnimatePresence initial={false} mode="wait">
        {error ? (
          <motion.p
            key="err"
            id={`${id}-msg`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-xs text-danger"
          >
            <Icon icon={Alert02Icon} size={14} />
            {error}
          </motion.p>
        ) : hint ? (
          <motion.p key="hint" id={`${id}-msg`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-fg-subtle">
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export const controlCls =
  'peer w-full bg-surface text-fg placeholder:text-fg-subtle border border-stroke rounded-[12px] outline-none transition-[border-color,box-shadow] duration-200 hover:border-stroke-strong focus:border-primary focus:shadow-[0_0_0_4px_var(--color-primary-soft)] aria-[invalid=true]:border-danger aria-[invalid=true]:focus:shadow-[0_0_0_4px_var(--color-danger-soft)] disabled:opacity-50'

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: ReactNode
  hint?: ReactNode
  error?: string | false | null
  labelAction?: ReactNode
  iconStart?: IconSvgElement
  trailing?: ReactNode
  containerClassName?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, labelAction, iconStart, trailing, className, containerClassName, id: idProp, ...rest },
  ref,
) {
  const auto = useId()
  const id = idProp ?? auto
  // Icon/trailing slots are placed in the page's (RTL) direction; an LTR input
  // (phone, password) would flip logical padding, so use physical sides there.
  const ltr = rest.dir === 'ltr'
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} labelAction={labelAction} className={containerClassName}>
      <div className="relative">
        {iconStart && (
          <span className="pointer-events-none absolute inset-y-0 start-4 z-10 grid place-items-center text-fg-muted">
            <Icon icon={iconStart} size={20} />
          </span>
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${id}-msg` : undefined}
          className={cn(
            controlCls,
            'h-14 px-4 text-sm',
            iconStart && (ltr ? 'pr-12' : 'ps-12'),
            trailing && (ltr ? 'pl-14' : 'pe-14'),
            className,
          )}
          {...rest}
        />
        {trailing && <span className="absolute inset-y-0 end-2 grid place-items-center">{trailing}</span>}
      </div>
    </FieldShell>
  )
})

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: ReactNode
  hint?: ReactNode
  error?: string | false | null
  maxChars?: number
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, hint, error, maxChars, className, id: idProp, value, ...rest },
  ref,
) {
  const auto = useId()
  const id = idProp ?? auto
  const len = typeof value === 'string' ? value.length : 0
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <div className="relative">
        <textarea
          ref={ref}
          id={id}
          value={value}
          maxLength={maxChars}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${id}-msg` : undefined}
          className={cn(controlCls, 'min-h-32 resize-none p-4 text-sm leading-7', className)}
          {...rest}
        />
        {maxChars && (
          <span className="pointer-events-none absolute bottom-3 end-4 text-[11px] text-fg-subtle tabular">
            {new Intl.NumberFormat('fa-IR').format(len)} / {new Intl.NumberFormat('fa-IR').format(maxChars)}
          </span>
        )}
      </div>
    </FieldShell>
  )
})

export const PasswordField = forwardRef<HTMLInputElement, Omit<TextFieldProps, 'type' | 'trailing'>>(function PasswordField(props, ref) {
  const [show, setShow] = useState(false)
  return (
    <TextField
      ref={ref}
      type={show ? 'text' : 'password'}
      dir="ltr"
      autoComplete="new-password"
      className="text-start [direction:ltr] placeholder:text-right"
      trailing={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="grid size-10 place-items-center rounded-[10px] text-fg-muted hover:bg-white-soft hover:text-fg"
          aria-label={show ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
          aria-pressed={show}
        >
          <Icon icon={show ? ViewOffSlashIcon : ViewIcon} size={20} />
        </button>
      }
      {...props}
    />
  )
})

/** Iranian mobile input: fixed +98 prefix, LTR digits, numeric keypad. */
export const PhoneField = forwardRef<HTMLInputElement, Omit<TextFieldProps, 'type' | 'iconStart'>>(function PhoneField(
  { className, ...props },
  ref,
) {
  return (
    <TextField
      ref={ref}
      type="tel"
      inputMode="numeric"
      autoComplete="tel-national"
      dir="ltr"
      iconStart={Call02Icon}
      placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
      className={cn('text-left tracking-wider tabular placeholder:text-left', className)}
      {...props}
    />
  )
})
