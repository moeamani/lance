import { AnimatePresence, motion } from 'motion/react'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Attachment01Icon,
  BubbleChatIcon,
  Cancel01Icon,
  CustomerService01Icon,
  File01Icon,
  Image01Icon,
  Link01Icon,
  Notification03Icon,
  Search01Icon,
  SentIcon,
  SmileIcon,
  Tick02Icon,
  TickDouble02Icon,
  Video01Icon,
} from '@hugeicons/core-free-icons'
import { AppHeader } from '../../components/layout/AppHeader'
import {
  Avatar,
  CountBadge,
  EmptyState,
  Icon,
  IconButton,
  ProgressRing,
  SearchField,
  SegmentedControl,
  Sheet,
  Tag,
  useToast,
} from '../../components/ui'
import { quickReplies, type Conversation, type Message } from '../../data/mock'
import { cn } from '../../lib/cn'
import { formatDayMonth, formatFileSize, formatNumber, formatRelative, formatTime } from '../../lib/format'
import { useApp } from '../../store/AppStore'

/* ───────────────────────── Inbox ───────────────────────── */

function lastPreview(c: Conversation) {
  const m = c.messages[c.messages.length - 1]
  if (!m) return ''
  if (m.attachment) return m.attachment.kind === 'image' ? '📷 تصویر' : m.attachment.kind === 'link' ? '🔗 لینک' : '📎 فایل'
  return m.text ?? ''
}

export function Messages() {
  const { conversations } = useApp()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const cats = useMemo(() => [...new Set(conversations.map((c) => c.category))], [conversations])
  const [cat, setCat] = useState('all')
  const list = conversations
    .filter((c) => cat === 'all' || c.category === cat)
    .filter((c) => !q || c.with.name.includes(q) || c.messages.some((m) => m.text?.includes(q)))
    .sort((a, b) => +new Date(b.messages.at(-1)?.at ?? 0) - +new Date(a.messages.at(-1)?.at ?? 0))

  return (
    <>
      <AppHeader
        leading={false}
        title="پیام‌ها"
        actions={
          <>
            <IconButton icon={CustomerService01Icon} label="پشتیبانی" onClick={() => navigate('/app/messages/c3')} />
            <IconButton icon={Notification03Icon} label="اعلان‌ها" onClick={() => navigate('/app/notifications')} />
          </>
        }
      />
      <main className="flex-1 px-5 pt-2 pb-32">
        <SegmentedControl
          variant="pills"
          label="دسته گفتگوها"
          value={cat}
          onChange={setCat}
          options={[
            { value: 'all', label: 'همه', count: conversations.reduce((a, c) => a + c.unread, 0) },
            ...cats.map((c) => ({ value: c, label: c, count: conversations.filter((x) => x.category === c).reduce((a, x) => a + x.unread, 0) })),
          ]}
        />
        <SearchField className="mt-4" value={q} onChange={setQ} placeholder="جستجو در گفتگوها" />
        <motion.ul initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }} className="mt-4 flex flex-col gap-2">
          {list.map((c) => {
            const last = c.messages.at(-1)
            return (
              <motion.li key={c.id} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                <Link to={`/app/messages/${c.id}`} className={cn('flex items-center gap-3 rounded-[16px] border p-3 transition-colors', c.unread ? 'border-primary/25 bg-surface' : 'border-stroke bg-surface hover:border-stroke-strong')}>
                  <Avatar name={c.with.name} size={52} online={c.with.online} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={cn('truncate text-sm', c.unread ? 'font-extrabold' : 'font-bold')}>{c.with.name}</p>
                      <Tag tone="neutral" className="h-5 px-2 text-[10px]">
                        {c.with.role}
                      </Tag>
                      <span className="ms-auto shrink-0 text-[11px] text-fg-subtle">{last && formatTime(last.at)}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      {last?.from === 'me' && <Icon icon={last.read ? TickDouble02Icon : Tick02Icon} size={14} className={last.read ? 'text-primary' : 'text-fg-subtle'} />}
                      <p className={cn('truncate text-xs', c.unread ? 'text-fg' : 'text-fg-muted')}>{lastPreview(c)}</p>
                      <CountBadge count={c.unread} className="ms-auto" />
                    </div>
                  </div>
                </Link>
              </motion.li>
            )
          })}
        </motion.ul>
        {list.length === 0 && <EmptyState icon={BubbleChatIcon} title="گفتگویی پیدا نشد" description="وقتی با کارفرما یا لنسری گفتگو کنی، اینجا نمایش داده می‌شه." />}
      </main>
    </>
  )
}

/* ───────────────────────── Chat ───────────────────────── */

const autoReplies = ['دریافت شد، ممنونم 🙏', 'عالیه! تا عصر بررسی می‌کنم.', 'باشه، هماهنگ می‌کنیم.']

function Bubble({ m, quoted, highlight }: { m: Message; quoted?: Message; highlight?: string }) {
  const mine = m.from === 'me'
  const text = m.text && highlight ? m.text.split(highlight).flatMap((part, i, arr) => (i < arr.length - 1 ? [part, <mark key={i} className="rounded bg-warning/80 text-on-primary">{highlight}</mark>] : [part])) : m.text
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 34 }}
      className={cn('flex', mine ? 'justify-start' : 'justify-end')}
    >
      <div
        className={cn(
          'max-w-[82%] rounded-[18px] px-4 py-2.5 text-sm leading-7',
          mine ? 'rounded-ss-[6px] bg-primary text-on-primary' : 'rounded-se-[6px] border border-stroke bg-surface text-fg',
          m.attachment?.kind === 'image' && 'p-1.5',
        )}
      >
        {quoted && (
          <div className={cn('mb-2 rounded-[10px] border-s-[3px] px-3 py-1.5 text-xs', mine ? 'border-on-primary/50 bg-black/10' : 'border-primary bg-primary-soft')}>
            <p className={cn('font-bold', !mine && 'text-primary')}>{quoted.from === 'me' ? 'شما' : 'پاسخ'}</p>
            <p className="line-clamp-1 opacity-80">{quoted.text ?? 'پیوست'}</p>
          </div>
        )}
        {m.attachment?.kind === 'image' && (
          <div className="relative grid aspect-[4/3] w-60 place-items-center overflow-hidden rounded-[14px] bg-[linear-gradient(135deg,#1f1f1f,#2a1027)]">
            <div className="absolute inset-0 bg-dots opacity-40" />
            <Icon icon={Image01Icon} size={40} className="relative text-primary/70" />
            <span className="absolute bottom-2 start-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white" dir="ltr">
              {m.attachment.name}
            </span>
          </div>
        )}
        {m.attachment?.kind === 'link' && (
          <a href={m.attachment.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-[12px] bg-surface-sunken p-3 text-fg hover:bg-surface-raised">
            <Icon icon={Link01Icon} size={18} className="text-primary" />
            <span dir="ltr" className="truncate text-xs underline">
              {m.attachment.name}
            </span>
          </a>
        )}
        {m.attachment?.kind === 'file' && (
          <div className="flex items-center gap-2 rounded-[12px] bg-black/10 p-3">
            <Icon icon={File01Icon} size={20} />
            <div className="min-w-0">
              <p dir="ltr" className="truncate text-start text-xs font-bold">
                {m.attachment.name}
              </p>
              {m.attachment.size && <p className="text-[10px] opacity-70">{formatFileSize(m.attachment.size)}</p>}
            </div>
          </div>
        )}
        {text && <p className={cn(m.attachment && 'px-2 pt-1')}>{text}</p>}
        <p className={cn('mt-0.5 flex items-center justify-end gap-1 text-[10px] tabular', mine ? 'text-on-primary/60' : 'text-fg-subtle', m.attachment?.kind === 'image' && 'px-2 pb-1')}>
          {formatTime(m.at)}
          {mine && <Icon icon={m.read ? TickDouble02Icon : Tick02Icon} size={12} />}
        </p>
      </div>
    </motion.div>
  )
}

function Typing() {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-end" aria-live="polite" aria-label="در حال نوشتن">
      <div className="flex gap-1 rounded-[18px] rounded-se-[6px] border border-stroke bg-surface px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span key={i} className="size-2 rounded-full bg-fg-muted" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
        ))}
      </div>
    </motion.div>
  )
}

function ContactSheet({ c, open, onClose }: { c: Conversation; open: boolean; onClose: () => void }) {
  const { projects } = useApp()
  const project = projects.find((p) => p.id === c.projectId)
  const [tab, setTab] = useState<'image' | 'video' | 'file' | 'link'>('image')
  const media = c.messages.filter((m) => m.attachment?.kind === tab)
  return (
    <Sheet open={open} onClose={onClose} title="پروفایل">
      <div className="flex items-center gap-4 py-2">
        <Avatar name={c.with.name} size={72} online={c.with.online} />
        <div>
          <p className="text-xl font-extrabold">{c.with.name}</p>
          <p className="text-xs text-fg-muted">{c.with.online ? 'آنلاین' : `آخرین بازدید ${formatRelative(c.with.lastSeen)}`}</p>
          <Tag tone="neutral" className="mt-2">
            {c.with.role}
          </Tag>
        </div>
      </div>
      {project && (
        <Link to={`/app/projects/${project.id}`} onClick={onClose} className="mt-4 flex items-center gap-4 rounded-[16px] border border-stroke bg-surface p-4 hover:border-stroke-strong">
          <ProgressRing value={project.progress} size={56} />
          <div className="flex-1">
            <p className="font-bold">{project.title}</p>
            <p className="text-xs text-fg-muted">
              {formatNumber(project.tasks.filter((t) => t.done).length)} تسک از {formatNumber(project.tasks.length)} تسک انجام شد
            </p>
          </div>
          <Icon icon={ArrowLeft01Icon} size={18} className="text-fg-subtle" />
        </Link>
      )}
      <SegmentedControl
        className="mt-5"
        label="رسانه‌ها"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'image', label: 'تصاویر' },
          { value: 'video', label: 'ویدیوها' },
          { value: 'file', label: 'فایل‌ها' },
          { value: 'link', label: 'لینک‌ها' },
        ]}
      />
      {media.length ? (
        <div className="mt-4 grid grid-cols-3 gap-2 pb-4">
          {media.map((m) => (
            <div key={m.id} className="grid aspect-square place-items-center rounded-[12px] bg-surface text-primary">
              <Icon icon={tab === 'image' ? Image01Icon : tab === 'link' ? Link01Icon : File01Icon} size={28} />
            </div>
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-sm text-fg-subtle">موردی برای نمایش نیست.</p>
      )}
    </Sheet>
  )
}

export function Chat() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { conversations, sendMessage, markConversationRead } = useApp()
  const c = conversations.find((x) => x.id === id)
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState<Message | null>(null)
  const [typing, setTyping] = useState(false)
  const [incoming, setIncoming] = useState<Message[]>([])
  const [attachOpen, setAttachOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const [q, setQ] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (c?.unread) markConversationRead(c.id)
  }, [c?.id, c?.unread, markConversationRead])

  const all = useMemo(() => [...(c?.messages ?? []), ...incoming].sort((a, b) => +new Date(a.at) - +new Date(b.at)), [c?.messages, incoming])
  const shown = searching && q ? all.filter((m) => m.text?.includes(q)) : all

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [all.length, typing])

  if (!c) {
    return (
      <>
        <AppHeader title="پیام‌ها" backTo="/app/messages" />
        <EmptyState icon={BubbleChatIcon} title="گفتگو پیدا نشد" />
      </>
    )
  }

  const send = (body: string, attachment?: Message['attachment']) => {
    if (!body.trim() && !attachment) return
    sendMessage(c.id, { text: body.trim() || undefined, attachment, replyTo: replyTo?.id })
    setText('')
    setReplyTo(null)
    inputRef.current?.focus()
    // Simulated counterpart reply so the prototype feels alive.
    window.setTimeout(() => setTyping(true), 600)
    window.setTimeout(() => {
      setTyping(false)
      setIncoming((x) => [...x, { id: `in${Date.now()}`, from: 'them', text: autoReplies[(all.length + x.length) % autoReplies.length], at: new Date().toISOString() }])
    }, 2200)
  }

  let lastDay = ''
  const byId = new Map(all.map((m) => [m.id, m]))

  return (
    <div className="flex h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-stroke bg-bg/90 backdrop-blur-md">
        <AnimatePresence mode="wait" initial={false}>
          {searching ? (
            <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-[72px] items-center gap-2 px-5">
              <SearchField className="flex-1" value={q} onChange={setQ} placeholder="جستجو در این گفتگو" autoFocus />
              <IconButton icon={Cancel01Icon} label="بستن جستجو" onClick={() => (setSearching(false), setQ(''))} />
            </motion.div>
          ) : (
            <motion.div key="h" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-[72px] items-center gap-3 px-5">
              <IconButton icon={ArrowRight01Icon} label="بازگشت" onClick={() => navigate('/app/messages')} />
              <button type="button" onClick={() => setInfoOpen(true)} className="flex min-w-0 flex-1 items-center gap-3 text-start">
                <Avatar name={c.with.name} size={44} online={c.with.online} />
                <span className="min-w-0">
                  <span className="block truncate font-extrabold">{c.with.name}</span>
                  <span className={cn('block text-xs', c.with.online ? 'text-success' : 'text-fg-subtle')}>
                    {typing ? 'در حال نوشتن…' : c.with.online ? 'آنلاین' : `آخرین بازدید ${formatRelative(c.with.lastSeen)}`}
                  </span>
                </span>
              </button>
              <IconButton icon={Search01Icon} label="جستجو در گفتگو" onClick={() => setSearching(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4" role="log" aria-label={`گفتگو با ${c.with.name}`}>
        {shown.length === 0 && (
          <EmptyState icon={searching ? Search01Icon : BubbleChatIcon} title={searching ? 'پیامی پیدا نشد' : 'گفتگو رو شروع کن'} description={searching ? undefined : 'یه سلام ساده کافیه 👋'} />
        )}
        <div className="flex flex-col gap-2">
          {shown.map((m) => {
            const d = formatDayMonth(m.at)
            const showDay = d !== lastDay
            lastDay = d
            return (
              <Fragment key={m.id}>
                {showDay && (
                  <div className="my-3 flex justify-center">
                    <span className="rounded-full bg-surface px-3 py-1 text-[11px] text-fg-muted">{d}</span>
                  </div>
                )}
                <div
                  onDoubleClick={() => {
                    setReplyTo(m)
                    inputRef.current?.focus()
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    setReplyTo(m)
                  }}
                >
                  <Bubble m={m} quoted={m.replyTo ? byId.get(m.replyTo) : undefined} highlight={searching ? q : undefined} />
                </div>
              </Fragment>
            )
          })}
          <AnimatePresence>{typing && <Typing />}</AnimatePresence>
          <div ref={endRef} />
        </div>
      </div>

      <div className="border-t border-stroke/60 bg-bg px-5 pt-3 pb-safe">
        {!searching && (
          <div className="no-scrollbar -mx-5 mb-3 flex gap-2 overflow-x-auto px-5">
            {quickReplies.map((r) => (
              <motion.button key={r} type="button" whileTap={{ scale: 0.95 }} onClick={() => send(r)} className="h-9 shrink-0 rounded-full border border-primary/50 px-4 text-xs font-bold text-primary hover:bg-primary-soft">
                {r}
              </motion.button>
            ))}
          </div>
        )}
        <AnimatePresence>
          {replyTo && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="mb-2 flex items-center gap-2 rounded-[12px] border-s-[3px] border-primary bg-surface px-3 py-2">
                <div className="min-w-0 flex-1 text-xs">
                  <p className="font-bold text-primary">پاسخ به {replyTo.from === 'me' ? 'خودتان' : c.with.name}</p>
                  <p className="truncate text-fg-muted">{replyTo.text ?? 'پیوست'}</p>
                </div>
                <IconButton icon={Cancel01Icon} size="sm" variant="ghost" label="لغو پاسخ" onClick={() => setReplyTo(null)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(text)
          }}
          className="flex items-end gap-2"
        >
          <IconButton icon={Attachment01Icon} label="پیوست" size="lg" onClick={() => setAttachOpen(true)} />
          <div className="flex min-h-12 flex-1 items-end rounded-[14px] border border-stroke bg-surface px-3 focus-within:border-primary">
            <label htmlFor="composer" className="sr-only">
              پیامت رو بنویس
            </label>
            <textarea
              id="composer"
              ref={inputRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send(text)
                }
              }}
              placeholder="پیامت رو بنویس"
              className="max-h-32 min-h-12 flex-1 resize-none bg-transparent py-3 text-sm leading-6 outline-none placeholder:text-fg-subtle [field-sizing:content]"
            />
            <button type="button" aria-label="ایموجی" onClick={() => setText((t) => `${t}🙂`)} className="mb-2 grid size-8 place-items-center rounded-[8px] text-fg-muted hover:text-fg">
              <Icon icon={SmileIcon} size={22} />
            </button>
          </div>
          <AnimatePresence initial={false}>
            {text.trim() && (
              <motion.button
                type="submit"
                aria-label="ارسال"
                initial={{ scale: 0, width: 0 }}
                animate={{ scale: 1, width: 48 }}
                exit={{ scale: 0, width: 0 }}
                className="grid size-12 shrink-0 place-items-center rounded-[14px] bg-primary text-on-primary"
              >
                <Icon icon={SentIcon} size={22} directional />
              </motion.button>
            )}
          </AnimatePresence>
        </form>
        <p className="mt-2 text-center text-[10px] text-fg-subtle">برای پاسخ به یک پیام، روی آن دوبار ضربه بزنید.</p>
      </div>

      <Sheet open={attachOpen} onClose={() => setAttachOpen(false)} title="ارسال پیوست">
        <div className="grid grid-cols-4 gap-3 pb-6">
          {[
            { k: 'image' as const, l: 'تصویر', i: Image01Icon, n: 'design-v3.png' },
            { k: 'file' as const, l: 'ویدیو', i: Video01Icon, n: 'walkthrough.mp4' },
            { k: 'file' as const, l: 'فایل', i: File01Icon, n: 'brief.pdf' },
            { k: 'link' as const, l: 'لینک', i: Link01Icon, n: 'figma.com/file/lance' },
          ].map((a) => (
            <button
              key={a.l}
              type="button"
              onClick={() => {
                setAttachOpen(false)
                send('', { kind: a.k, name: a.n, size: 2_400_000, url: a.k === 'link' ? 'https://figma.com' : undefined })
                toast.show(`${a.l} ارسال شد.`)
              }}
              className="flex flex-col items-center gap-2 rounded-[16px] border border-stroke bg-surface py-4 text-xs font-bold hover:border-primary"
            >
              <span className="grid size-12 place-items-center rounded-full bg-primary-soft text-primary">
                <Icon icon={a.i} size={24} />
              </span>
              {a.l}
            </button>
          ))}
        </div>
      </Sheet>
      <ContactSheet c={c} open={infoOpen} onClose={() => setInfoOpen(false)} />
    </div>
  )
}
