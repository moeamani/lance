import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FilterHorizontalIcon, Location01Icon, Search01Icon, Sorting05Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { AppHeader } from '../../components/layout/AppHeader'
import { Screen } from '../../components/layout/Screen'
import { LancerCard, ProjectCard } from '../../components/domain/Cards'
import { Button, Chip, EmptyState, Icon, IconButton, SearchField, SegmentedControl, SelectSheet, Sheet, Slider, StarRating } from '../../components/ui'
import { allSkills, cities, projectTypes } from '../../data/catalog'
import { lancers, projects } from '../../data/mock'
import { cn } from '../../lib/cn'
import { formatNumber, formatToman } from '../../lib/format'

type Tab = 'project' | 'lancer'
type Sort = 'rating' | 'newest' | 'budget'
type Filters = { city: string | null; skills: string[]; minRating: number; maxBudget: number }

const SORTS: { value: Sort; label: string }[] = [
  { value: 'rating', label: 'بیشترین امتیاز' },
  { value: 'newest', label: 'جدیدترین' },
  { value: 'budget', label: 'بیشترین بودجه' },
]
const emptyFilters: Filters = { city: null, skills: [], minRating: 0, maxBudget: 30_000_000 }

/**
 * «08 · Discovery» — tab (project/lancer), category, sort, results and a
 * filter sheet. Adds: free-text search, active-filter chips you can clear
 * one by one, a live result count on the «اعمال فیلتر» button, and empty states.
 */
export function Discover() {
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) ?? 'project'
  const [q, setQ] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [sort, setSort] = useState<Sort>('rating')
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [draft, setDraft] = useState<Filters>(emptyFilters)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const apply = (f: Filters) => {
    const base = tab === 'project' ? projects : lancers
    return base.filter((x) => {
      const text = 'description' in x ? `${x.title} ${x.description} ${x.skills.join(' ')}` : `${x.name} ${x.title} ${x.skills.map((s) => s.name).join(' ')}`
      if (q && !text.includes(q.trim())) return false
      if (f.city && f.city !== 'دورکاری (همه شهرها)' && x.city !== f.city && x.city !== 'دورکاری (همه شهرها)') return false
      const skills = 'description' in x ? x.skills : x.skills.map((s) => s.name)
      if (f.skills.length && !f.skills.some((s) => skills.includes(s))) return false
      if ('budget' in x && x.budget > f.maxBudget) return false
      if ('rating' in x && f.minRating && x.rating < f.minRating) return false
      if ('employerRating' in x && f.minRating && x.employerRating < f.minRating) return false
      if (category && 'category' in x) {
        const label = projectTypes.find((p) => p.value === category)?.label
        if (label && !(label.startsWith(x.category) || x.category.startsWith(label))) return false
      }
      return true
    })
  }

  const results = useMemo(() => {
    const r = apply(filters)
    return [...r].sort((a, b) => {
      if (sort === 'budget' && 'budget' in a && 'budget' in b) return b.budget - a.budget
      if (sort === 'newest' && 'postedAt' in a && 'postedAt' in b) return +new Date(b.postedAt) - +new Date(a.postedAt)
      const ra = 'rating' in a ? a.rating : (a as (typeof projects)[number]).employerRating
      const rb = 'rating' in b ? b.rating : (b as (typeof projects)[number]).employerRating
      return rb - ra
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, q, filters, sort, category])

  const draftCount = useMemo(() => apply(draft).length, [draft, tab, q, category]) // eslint-disable-line react-hooks/exhaustive-deps

  const activeChips = [
    filters.city && { k: 'city', label: filters.city, clear: () => setFilters({ ...filters, city: null }) },
    ...filters.skills.map((s) => ({ k: s, label: s, clear: () => setFilters({ ...filters, skills: filters.skills.filter((x) => x !== s) }) })),
    filters.minRating > 0 && { k: 'rating', label: `امتیاز ${formatNumber(filters.minRating)}+`, clear: () => setFilters({ ...filters, minRating: 0 }) },
    tab === 'project' && filters.maxBudget < emptyFilters.maxBudget && { k: 'budget', label: `تا ${formatToman(filters.maxBudget, { compact: true })}`, clear: () => setFilters({ ...filters, maxBudget: emptyFilters.maxBudget }) },
  ].filter(Boolean) as { k: string; label: string; clear: () => void }[]

  return (
    <>
      <AppHeader
        leading={false}
        title="جستجو"
        actions={
          <IconButton
            icon={FilterHorizontalIcon}
            label="فیلتر"
            dot={activeChips.length > 0}
            onClick={() => {
              setDraft(filters)
              setFilterOpen(true)
            }}
          />
        }
      />
      <Screen withNav title="جستجو">
        <div className="flex flex-col gap-3">
          <SegmentedControl
            label="نوع جستجو"
            value={tab}
            onChange={(v) => {
              setParams(v === 'project' ? {} : { tab: v }, { replace: true })
              setFilters(emptyFilters)
            }}
            options={[
              { value: 'project', label: 'پروژه' },
              { value: 'lancer', label: 'لنسر' },
            ]}
          />
          <SearchField value={q} onChange={setQ} placeholder={tab === 'project' ? 'جستجو در پروژه‌ها…' : 'جستجوی نام یا مهارت…'} />
          {tab === 'project' && (
            <SelectSheet placeholder="همه دسته‌ها" sheetTitle="دسته‌بندی" options={projectTypes} value={category} onChange={setCategory} />
          )}
          <AnimatePresence>
            {activeChips.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap gap-2 overflow-hidden">
                {activeChips.map((c) => (
                  <Chip key={c.k} onRemove={c.clear}>
                    {c.label}
                  </Chip>
                ))}
                <button type="button" onClick={() => setFilters(emptyFilters)} className="h-9 px-2 text-xs font-bold text-fg-muted underline underline-offset-4 hover:text-fg">
                  پاک کردن همه
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-5 mb-3 flex items-center justify-between">
          <p className="text-sm font-extrabold" aria-live="polite">
            نتایج ({formatNumber(results.length)})
          </p>
          <button type="button" onClick={() => setSortOpen(true)} className="-me-2 inline-flex h-10 items-center gap-1.5 rounded-[10px] px-2 text-xs text-fg-muted hover:bg-white-soft hover:text-fg">
            <Icon icon={Sorting05Icon} size={18} />
            ترتیب: {SORTS.find((s) => s.value === sort)?.label}
          </button>
        </div>

        <motion.ul layout className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {results.map((x, i) => (
              <motion.li key={x.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.03 } }} exit={{ opacity: 0, scale: 0.96 }}>
                {'description' in x ? <ProjectCard p={x} /> : <LancerCard l={x} />}
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        {results.length === 0 && (
          <EmptyState
            icon={Search01Icon}
            title="نتیجه‌ای پیدا نشد"
            description="فیلترها رو کمتر کن یا عبارت دیگه‌ای جستجو کن."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setFilters(emptyFilters)
                  setQ('')
                  setCategory(null)
                }}
              >
                پاک کردن فیلترها
              </Button>
            }
          />
        )}
      </Screen>

      <Sheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="فیلتر"
        headerAction={
          <button type="button" onClick={() => setDraft(emptyFilters)} className="text-xs font-bold text-primary">
            تنظیم مجدد
          </button>
        }
        footer={
          <Button
            block
            size="lg"
            onClick={() => {
              setFilters(draft)
              setFilterOpen(false)
            }}
          >
            نمایش {formatNumber(draftCount)} نتیجه
          </Button>
        }
      >
        <div className="flex flex-col gap-6 pt-2">
          <SelectSheet
            label="لوکیشن"
            placeholder="همه شهرها"
            icon={Location01Icon}
            options={cities.map((c) => ({ value: c, label: c }))}
            value={draft.city}
            onChange={(v) => setDraft({ ...draft, city: v })}
            labelAction={
              draft.city ? (
                <button type="button" onClick={() => setDraft({ ...draft, city: null })} className="text-xs text-primary">
                  تنظیم مجدد
                </button>
              ) : undefined
            }
          />
          <SelectSheet multiple label="مهارت موردنیاز" placeholder="انتخاب مهارت" options={allSkills.map((s) => ({ value: s, label: s }))} value={draft.skills} onChange={(v) => setDraft({ ...draft, skills: v })} searchable />
          {tab === 'project' && (
            <div>
              <p className="mb-3 text-sm font-bold">حداکثر بودجه</p>
              <div className="rounded-[14px] border border-stroke bg-surface p-4">
                <Slider label="حداکثر بودجه" min={1_000_000} max={30_000_000} step={500_000} value={draft.maxBudget} onChange={(v) => setDraft({ ...draft, maxBudget: v })} format={(n) => formatToman(n, { compact: true })} />
                <p className="mt-2 text-xl font-extrabold tabular">{formatToman(draft.maxBudget)}</p>
              </div>
            </div>
          )}
          <div>
            <p className="mb-4 text-sm font-bold">{tab === 'project' ? 'حداقل امتیاز کارفرما' : 'سطح بندی'}</p>
            <StarRating value={draft.minRating} onChange={(v) => setDraft({ ...draft, minRating: v })} />
          </div>
        </div>
      </Sheet>

      <Sheet open={sortOpen} onClose={() => setSortOpen(false)} title="مرتب‌سازی">
        <ul role="listbox" className="flex flex-col pb-4">
          {SORTS.filter((s) => tab === 'project' || s.value === 'rating' || s.value === 'newest').map((s) => (
            <li key={s.value} role="option" aria-selected={sort === s.value}>
              <button
                type="button"
                onClick={() => {
                  setSort(s.value)
                  setSortOpen(false)
                }}
                className={cn('flex h-14 w-full items-center justify-between rounded-[12px] px-3 text-sm font-bold hover:bg-white-soft', sort === s.value && 'text-primary')}
              >
                {s.label}
                {sort === s.value && <Icon icon={Tick02Icon} size={20} strokeWidth={2.5} />}
              </button>
            </li>
          ))}
        </ul>
      </Sheet>
    </>
  )
}
