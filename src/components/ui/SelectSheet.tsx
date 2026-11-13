import { AnimatePresence } from 'motion/react'
import { useId, useMemo, useState, type ReactNode } from 'react'
import { ArrowDown01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { cn } from '../../lib/cn'
import { Button } from './Button'
import { Chip } from './Chip'
import { FieldShell, controlCls } from './Field'
import { Icon, type IconSvgElement } from './Icon'
import { SearchField } from './Misc'
import { Sheet } from './Sheet'

export type SelectOption = { value: string; label: string; icon?: IconSvgElement; group?: string }

type BaseProps = {
  label?: ReactNode
  placeholder: string
  options: SelectOption[]
  icon?: IconSvgElement
  error?: string | false
  hint?: ReactNode
  searchable?: boolean
  sheetTitle?: string
  labelAction?: ReactNode
}

type SingleProps = BaseProps & { multiple?: false; value: string | null; onChange: (v: string | null) => void }
type MultiProps = BaseProps & { multiple: true; value: string[]; onChange: (v: string[]) => void; max?: number }

/**
 * Field-looking trigger that opens a searchable bottom-sheet picker.
 * The Figma «Selecting» dropdowns were native-select-like rows with a down
 * arrow; on mobile a sheet gives bigger targets, search and multi-select.
 */
export function SelectSheet(props: SingleProps | MultiProps) {
  const { label, placeholder, options, icon, error, hint, searchable = options.length > 8, sheetTitle, labelAction } = props
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const id = useId()
  const [draft, setDraft] = useState<string[]>([])

  const selected = props.multiple ? props.value : props.value ? [props.value] : []
  const filtered = useMemo(() => options.filter((o) => o.label.includes(q.trim())), [options, q])
  const display = props.multiple ? null : options.find((o) => o.value === props.value)

  const openSheet = () => {
    setDraft(selected)
    setQ('')
    setOpen(true)
  }

  const toggle = (v: string) => {
    if (!props.multiple) {
      props.onChange(v)
      setOpen(false)
      return
    }
    setDraft((d) => (d.includes(v) ? d.filter((x) => x !== v) : props.max && d.length >= props.max ? d : [...d, v]))
  }

  const current = props.multiple ? draft : selected

  return (
    <FieldShell id={id} label={label} error={error} hint={hint} labelAction={labelAction}>
      <button
        id={id}
        type="button"
        onClick={openSheet}
        aria-haspopup="dialog"
        aria-invalid={error ? true : undefined}
        className={cn(controlCls, 'flex h-14 items-center gap-3 px-4 text-start text-sm')}
      >
        {(display?.icon ?? icon) && <Icon icon={(display?.icon ?? icon)!} size={20} className="text-fg-muted" />}
        <span className={cn('flex-1 truncate', !display && !props.multiple && 'text-fg-subtle', props.multiple && 'text-fg-subtle')}>
          {props.multiple ? (selected.length ? `${new Intl.NumberFormat('fa-IR').format(selected.length)} مورد انتخاب شده` : placeholder) : display?.label ?? placeholder}
        </span>
        <Icon icon={ArrowDown01Icon} size={20} className="text-fg-muted" />
      </button>
      {props.multiple && selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {selected.map((v) => (
              <Chip key={v} onRemove={() => props.onChange(selected.filter((x) => x !== v))}>
                {options.find((o) => o.value === v)?.label ?? v}
              </Chip>
            ))}
          </AnimatePresence>
        </div>
      )}
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={sheetTitle ?? (typeof label === 'string' ? label : placeholder)}
        footer={
          props.multiple ? (
            <Button
              block
              size="lg"
              onClick={() => {
                props.onChange(draft)
                setOpen(false)
              }}
            >
              تایید {draft.length > 0 && `(${new Intl.NumberFormat('fa-IR').format(draft.length)})`}
            </Button>
          ) : undefined
        }
      >
        {searchable && <SearchField value={q} onChange={setQ} placeholder="جستجو…" className="sticky top-0 z-10 mb-2 bg-surface-sunken pb-2" />}
        <ul role="listbox" aria-multiselectable={props.multiple || undefined} className="flex flex-col">
          {filtered.map((o) => {
            const on = current.includes(o.value)
            return (
              <li key={o.value} role="option" aria-selected={on}>
                <button
                  type="button"
                  onClick={() => toggle(o.value)}
                  className={cn('flex min-h-14 w-full items-center gap-3 rounded-[12px] px-3 text-start text-sm transition-colors hover:bg-white-soft', on && 'text-primary')}
                >
                  {o.icon && (
                    <span className={cn('grid size-9 place-items-center rounded-[10px]', on ? 'bg-primary-soft' : 'bg-surface')}>
                      <Icon icon={o.icon} size={18} />
                    </span>
                  )}
                  <span className="flex-1 font-semibold">{o.label}</span>
                  {on && <Icon icon={Tick02Icon} size={20} strokeWidth={2.5} />}
                </button>
              </li>
            )
          })}
          {filtered.length === 0 && <li className="py-10 text-center text-sm text-fg-subtle">نتیجه‌ای پیدا نشد.</li>}
        </ul>
      </Sheet>
    </FieldShell>
  )
}
