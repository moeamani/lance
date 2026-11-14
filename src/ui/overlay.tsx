import { AnimatePresence, motion } from 'motion/react'
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Cancel01Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'
import { useLocale } from '../i18n/locale'
import { cn, Icon, IconButton } from './core'

/** Side sheet (mobile nav, filters). Esc closes, focus is trapped and restored. */
export function Sheet({ open, onClose, title, children, side = 'end' }: { open: boolean; onClose: () => void; title: string; children: ReactNode; side?: 'end' | 'bottom' }) {
  const panel = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  const { lang } = useLocale()

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>('a,button,input')?.focus(), 40)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current()
      if (e.key !== 'Tab' || !panel.current) return
      const f = panel.current.querySelectorAll<HTMLElement>('a,button,input,textarea,select')
      if (!f.length) return
      if (e.shiftKey && document.activeElement === f[0]) (e.preventDefault(), f[f.length - 1].focus())
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) (e.preventDefault(), f[0].focus())
    }
    addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [open])

  const fromEnd = lang === 'fa' ? '-100%' : '100%'
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div className="absolute inset-0 bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={side === 'end' ? { x: fromEnd } : { y: '100%' }}
            animate={side === 'end' ? { x: 0 } : { y: 0 }}
            exit={side === 'end' ? { x: fromEnd } : { y: '100%' }}
            transition={{ type: 'spring', stiffness: 420, damping: 40 }}
            className={cn(
              'absolute flex flex-col border-line bg-surface',
              side === 'end' ? 'inset-y-0 end-0 w-[min(380px,88vw)] border-s' : 'inset-x-0 bottom-0 max-h-[88dvh] rounded-t-[24px] border-t',
            )}
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <h2 id={titleId} className="heading text-[18px]">
                {title}
              </h2>
              <IconButton icon={Cancel01Icon} label={lang === 'fa' ? 'بستن' : 'Close'} onClick={onClose} />
            </div>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

/* ───────────── Toast ───────────── */
type T = { id: number; text: string }
const ToastCtx = createContext<(text: string) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<T[]>([])
  const show = useCallback((text: string) => {
    const id = Date.now()
    setItems((x) => [...x.slice(-2), { id, text }])
    setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 3200)
  }, [])
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {createPortal(
        <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex flex-col items-center gap-2 px-4">
          <AnimatePresence>
            {items.map((t) => (
              <motion.div
                key={t.id}
                role="status"
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className="rail pointer-events-auto flex items-center gap-2 rounded-md border border-line bg-raised px-4 py-3 text-[15px]"
              >
                <Icon icon={CheckmarkCircle02Icon} size={18} className="text-success" />
                {t.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </ToastCtx.Provider>
  )
}
export const useToast = () => useContext(ToastCtx)
