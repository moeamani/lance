import { motion, useAnimationControls } from 'motion/react'
import { useEffect, useRef } from 'react'
import { cn } from '../../lib/cn'
import { toEnDigits, toFaDigits } from '../../lib/format'

type Props = {
  length?: number
  value: string
  onChange: (v: string) => void
  onComplete?: (v: string) => void
  error?: boolean
  success?: boolean
  autoFocus?: boolean
  disabled?: boolean
}

/**
 * OTP boxes — improvements over the Figma OTP modal:
 *  • one hidden-label input group with autocomplete="one-time-code" (SMS autofill on iOS/Android)
 *  • paste the whole code into any box
 *  • auto-advance / backspace-to-previous / arrow keys (RTL-aware)
 *  • accepts Persian digits from a Persian keyboard
 *  • shake + red on error, green on success
 * Boxes are laid out LTR because codes are read left-to-right even in Persian SMS.
 */
export function OtpInput({ length = 4, value, onChange, onComplete, error, success, autoFocus, disabled }: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const controls = useAnimationControls()
  const digits = Array.from({ length }, (_, i) => value[i] ?? '')

  useEffect(() => {
    if (error) controls.start({ x: [0, -8, 8, -6, 6, -3, 0], transition: { duration: 0.4 } })
  }, [error, controls])

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus()
  }, [autoFocus])

  const setAt = (i: number, d: string) => {
    const arr = digits.slice()
    arr[i] = d
    const next = arr.join('').slice(0, length)
    onChange(next)
    if (arr.every(Boolean)) onComplete?.(next)
  }

  const handleInput = (i: number, raw: string) => {
    const clean = toEnDigits(raw).replace(/\D/g, '')
    if (!clean) return
    if (clean.length > 1) {
      // Paste or SMS autofill into one box → spread across all boxes.
      const merged = (digits.slice(0, i).join('') + clean).slice(0, length)
      onChange(merged)
      refs.current[Math.min(merged.length, length - 1)]?.focus()
      if (merged.length === length) onComplete?.(merged)
      return
    }
    setAt(i, clean)
    if (i < length - 1) refs.current[i + 1]?.focus()
  }

  return (
    <motion.div animate={controls} dir="ltr" className="flex justify-center gap-3" role="group" aria-label="کد تایید">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          value={d ? toFaDigits(d) : ''}
          disabled={disabled}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={length}
          aria-label={`رقم ${toFaDigits(i + 1)}`}
          aria-invalid={error || undefined}
          onFocus={(e) => e.currentTarget.select()}
          onChange={(e) => handleInput(i, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              e.preventDefault()
              if (digits[i]) setAt(i, '')
              else if (i > 0) {
                refs.current[i - 1]?.focus()
                setAt(i - 1, '')
              }
            } else if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus()
            else if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus()
          }}
          className={cn(
            'size-16 rounded-[14px] border bg-surface text-center text-2xl font-extrabold text-fg outline-none transition-all duration-200 tabular',
            // Exactly one border colour applies — Tailwind can't resolve two by class order.
            error
              ? 'border-danger text-danger focus:shadow-[0_0_0_4px_var(--color-danger-soft)]'
              : success
                ? 'border-success text-success'
                : cn(d ? 'border-stroke-strong' : 'border-stroke', 'focus:border-primary focus:shadow-[0_0_0_4px_var(--color-primary-soft)]'),
          )}
        />
      ))}
    </motion.div>
  )
}
