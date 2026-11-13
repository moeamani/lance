import { AnimatePresence, motion, useDragControls, type PanInfo } from 'motion/react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { cn } from '../../lib/cn'
import { IconButton } from './IconButton'

type SheetProps = {
  open: boolean
  onClose: () => void
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  /** Header action on the end side (e.g. «تنظیم مجدد»). */
  headerAction?: ReactNode
  className?: string
}

function useDialogBehaviour(open: boolean, onCloseProp: () => void, panel: React.RefObject<HTMLElement | null>) {
  // Keep the latest onClose without re-running the effect (callers pass inline arrows).
  const closeRef = useRef(onCloseProp)
  closeRef.current = onCloseProp
  useEffect(() => {
    if (!open) return
    const onClose = () => closeRef.current()
    const prev = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => {
      const first = panel.current?.querySelector<HTMLElement>('[autofocus], input, textarea, button:not([data-close])')
      ;(first ?? panel.current)?.focus()
    }, 60)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panel.current) {
        // Minimal focus trap.
        const f = panel.current.querySelectorAll<HTMLElement>('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      prev?.focus?.()
    }
  }, [open, panel])
}

/**
 * Bottom sheet — filters, proposal form, OTP, pickers. Drag the handle (or
 * the sheet) down to dismiss, Esc to close, focus is trapped and restored.
 */
export function Sheet({ open, onClose, title, description, children, footer, headerAction, className }: SheetProps) {
  const panel = useRef<HTMLDivElement>(null)
  const drag = useDragControls()
  const titleId = useId()
  const descId = useId()
  useDialogBehaviour(open, onClose, panel)

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 600) onClose()
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            drag="y"
            dragControls={drag}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={onDragEnd}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            className={cn(
              'relative flex max-h-[92dvh] w-full max-w-[480px] flex-col rounded-t-[28px] border border-b-0 border-stroke bg-surface-sunken shadow-sheet outline-none',
              className,
            )}
          >
            <div className="flex cursor-grab touch-none justify-center pt-3 pb-1 active:cursor-grabbing" onPointerDown={(e) => drag.start(e)}>
              <span className="h-1.5 w-10 rounded-full bg-stroke-strong" aria-hidden />
            </div>
            {(title || headerAction) && (
              <div className="flex items-center gap-3 px-5 pt-2 pb-3">
                <IconButton icon={Cancel01Icon} label="بستن" size="sm" onClick={onClose} data-close />
                <div className="min-w-0 flex-1">
                  {title && (
                    <h2 id={titleId} className="text-xl font-extrabold">
                      {title}
                    </h2>
                  )}
                </div>
                {headerAction}
              </div>
            )}
            {description && (
              <p id={descId} className="px-5 pb-2 text-sm leading-6 text-fg-muted">
                {description}
              </p>
            )}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">{children}</div>
            {footer && <div className="border-t border-stroke/60 px-5 pt-3 pb-safe">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

/** Centered dialog for confirmations («پایان پروژه؟»). */
export function Dialog({
  open,
  onClose,
  title,
  description,
  icon,
  actions,
  tone = 'default',
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  actions: ReactNode
  tone?: 'default' | 'danger'
}) {
  const panel = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useDialogBehaviour(open, onClose, panel)
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-5">
          <motion.div className="absolute inset-0 bg-black/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            ref={panel}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className={cn('relative w-full max-w-[360px] rounded-[24px] border bg-surface p-6 text-center outline-none', tone === 'danger' ? 'border-danger/30' : 'border-stroke')}
          >
            {icon && <div className="mx-auto mb-4 grid size-14 place-items-center">{icon}</div>}
            <h2 id={titleId} className="text-lg font-extrabold">
              {title}
            </h2>
            {description && <p className="mt-2 text-sm leading-6 text-fg-muted">{description}</p>}
            <div className="mt-6 flex gap-3">{actions}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
