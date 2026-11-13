import { AnimatePresence, motion } from 'motion/react'
import { useId, useRef, useState } from 'react'
import { Cancel01Icon, CloudUploadIcon, File01Icon, Image01Icon } from '@hugeicons/core-free-icons'
import { cn } from '../../lib/cn'
import { formatFileSize, formatNumber } from '../../lib/format'
import { Icon } from './Icon'

export type PickedFile = { id: string; name: string; size: number; type: string; progress: number }

type Props = {
  label?: string
  maxSizeMB?: number
  maxFiles?: number
  accept?: string
  files: PickedFile[]
  onChange: (files: PickedFile[]) => void
  onError?: (msg: string) => void
  compact?: boolean
}

/**
 * Upload area with drag & drop, limits shown up-front (Figma shows them as
 * loose captions), per-file progress and removal.
 * Upload is simulated — swap `simulate` for a real XHR/fetch upload.
 */
export function FileDrop({ label = 'بارگذاری فایل', maxSizeMB = 15, maxFiles = 50, accept, files, onChange, onError, compact }: Props) {
  const input = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const id = useId()
  const latest = useRef(files)
  latest.current = files

  const simulate = (f: PickedFile) => {
    let p = 0
    const t = window.setInterval(() => {
      p = Math.min(100, p + 8 + Math.random() * 18)
      if (!latest.current.some((x) => x.id === f.id)) return window.clearInterval(t) // removed mid-upload
      const next = latest.current.map((x) => (x.id === f.id ? { ...x, progress: p } : x))
      latest.current = next
      onChange(next)
      if (p >= 100) window.clearInterval(t)
    }, 140)
  }

  const add = (list: FileList | null) => {
    if (!list) return
    const incoming: PickedFile[] = []
    for (const file of Array.from(list)) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        onError?.(`حجم «${file.name}» بیشتر از ${formatNumber(maxSizeMB)} مگابایت است.`)
        continue
      }
      incoming.push({ id: `${file.name}-${file.size}-${Date.now()}`, name: file.name, size: file.size, type: file.type, progress: 0 })
    }
    const room = maxFiles - files.length
    if (incoming.length > room) onError?.(`حداکثر ${formatNumber(maxFiles)} فایل می‌توانید بارگذاری کنید.`)
    const next = [...files, ...incoming.slice(0, Math.max(0, room))]
    latest.current = next
    onChange(next)
    incoming.slice(0, room).forEach(simulate)
  }

  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          add(e.dataTransfer.files)
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed text-center transition-colors',
          compact ? 'h-14 flex-row' : 'py-6',
          over ? 'border-primary bg-primary-soft' : 'border-primary/40 hover:border-primary hover:bg-primary-soft/50',
        )}
      >
        <Icon icon={CloudUploadIcon} size={compact ? 20 : 28} className="text-primary" />
        <span className="text-sm font-bold text-primary">{label}</span>
        {!compact && (
          <span className="text-xs text-fg-subtle">
            حداکثر {formatNumber(maxSizeMB)} مگابایت · تا {formatNumber(maxFiles)} فایل
          </span>
        )}
        <input ref={input} id={id} type="file" multiple accept={accept} className="sr-only" onChange={(e) => add(e.target.files)} />
      </label>
      <ul className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {files.map((f) => (
            <motion.li
              key={f.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 rounded-[12px] border border-stroke bg-surface p-3">
                <span className="grid size-10 place-items-center rounded-[10px] bg-primary-soft text-primary">
                  <Icon icon={f.type.startsWith('image/') ? Image01Icon : File01Icon} size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p dir="auto" className="truncate text-sm font-bold">
                    {f.name}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-stroke">
                      <motion.div className="h-full bg-primary" animate={{ width: `${f.progress}%` }} />
                    </div>
                    <span className="text-[11px] text-fg-subtle">{f.progress >= 100 ? formatFileSize(f.size) : `${formatNumber(Math.round(f.progress))}٪`}</span>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={`حذف ${f.name}`}
                  onClick={() => onChange(files.filter((x) => x.id !== f.id))}
                  className="grid size-9 place-items-center rounded-[10px] text-fg-muted hover:bg-danger-soft hover:text-danger"
                >
                  <Icon icon={Cancel01Icon} size={18} />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
