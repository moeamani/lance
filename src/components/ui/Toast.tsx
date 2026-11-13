import { AnimatePresence, motion } from 'motion/react'
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Alert02Icon, CheckmarkCircle02Icon, InformationCircleIcon } from '@hugeicons/core-free-icons'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'

type ToastTone = 'success' | 'error' | 'info'
type Toast = { id: number; message: ReactNode; tone: ToastTone; action?: { label: string; onClick: () => void } }
type Ctx = { show: (message: ReactNode, opts?: { tone?: ToastTone; action?: Toast['action']; duration?: number }) => void }

const ToastContext = createContext<Ctx | null>(null)

const toneMeta = {
  success: { icon: CheckmarkCircle02Icon, cls: 'text-success' },
  error: { icon: Alert02Icon, cls: 'text-danger' },
  info: { icon: InformationCircleIcon, cls: 'text-primary' },
}

/**
 * Toasts — the Figma file has «Toast» / «Toast Error» and ~24 one-off frames
 * like «پروفایل لنسر با موفقیت ذخیره شد!». One provider covers them all, adds
 * an undo action, and announces politely to screen readers.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const show = useCallback<Ctx['show']>(
    (message, { tone = 'success', action, duration = 3200 } = {}) => {
      const id = Date.now() + Math.random()
      setToasts((t) => [...t.slice(-2), { id, message, tone, action }])
      window.setTimeout(() => dismiss(id), duration)
    },
    [dismiss],
  )
  const value = useMemo(() => ({ show }), [show])
  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-3 z-[60] mx-auto flex max-w-[480px] flex-col items-center gap-2 px-4">
          <AnimatePresence initial={false}>
            {toasts.map((t) => {
              const meta = toneMeta[t.tone]
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: -24, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => Math.abs(info.offset.x) > 80 && dismiss(t.id)}
                  role={t.tone === 'error' ? 'alert' : 'status'}
                  className="pointer-events-auto flex w-full items-center gap-3 rounded-[14px] border border-stroke bg-surface-raised/95 px-4 py-3 text-sm shadow-lg backdrop-blur"
                >
                  <Icon icon={meta.icon} size={22} className={meta.cls} />
                  <span className="flex-1 font-medium">{t.message}</span>
                  {t.action && (
                    <button
                      type="button"
                      className={cn('rounded-[8px] px-2 py-1 text-xs font-bold text-primary hover:bg-primary-soft')}
                      onClick={() => {
                        t.action!.onClick()
                        dismiss(t.id)
                      }}
                    >
                      {t.action.label}
                    </button>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
