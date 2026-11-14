import { Search01Icon } from '@hugeicons/core-free-icons'
import { Knight, type KnightId } from '../brand/Knights'
import { Logo, Mark } from '../brand/Logo'
import { useLocale, type Bi } from '../i18n/locale'
import { useTitle } from '../layout/Shell'
import { Bar, GuideCard, OathCard, Vignette } from '../ui/cards'
import { cn, Container, Panel, Pip, Tag } from '../ui/core'
import { Steps } from '../ui/steps'

function Chapter({ n, title, lead, children, id }: { n: string; title: string; lead?: string; children: React.ReactNode; id: string }) {
  return (
    <section aria-labelledby={id} className="border-t border-line py-20">
      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <div>
          <p className="numeral text-[13px] text-ink-subtle">{n}</p>
          <h2 id={id} className="heading mt-2 text-[28px]">
            {title}
          </h2>
          {lead && <p className="mt-3 text-[15px] text-ink-muted">{lead}</p>}
        </div>
        <div>{children}</div>
      </div>
    </section>
  )
}

const SWATCHES: { name: Bi; night: string; day: string; role: Bi }[] = [
  { name: { en: 'Basalt', fa: 'بازالت' }, night: '#111318', day: '#F1F2F4', role: { en: 'Ground. Night is basalt, day is cool marble; never cream.', fa: 'زمینه. شب بازالته، روز مرمر سرد؛ هیچ‌وقت کرم.' } },
  { name: { en: 'Surface', fa: 'سطح' }, night: '#181B21', day: '#FBFBFC', role: { en: 'Panels and cards. Borders, not shadows, separate them.', fa: 'پنل‌ها و کارت‌ها. جداشدنشون با خط حاشیه‌ست، نه سایه.' } },
  { name: { en: 'Ink', fa: 'جوهر' }, night: '#EDEEF1', day: '#14161B', role: { en: 'Text. Muted ink is still at least 4.5:1.', fa: 'متن. حتی متن کم‌رنگ هم حداقل کنتراست ۴.۵ داره.' } },
  { name: { en: 'Cobalt LED', fa: 'نور کبالت' }, night: '#5B7CFF', day: '#2F55E6', role: { en: 'Machine light: actions, agents, Merlin. Never decoration.', fa: 'نور ماشین: اقدام‌ها، دستیارها، مرلین. هیچ‌وقت برای تزئین نیست.' } },
  { name: { en: 'Gilt', fa: 'طلایی' }, night: '#E2B65C', day: '#9A6B12', role: { en: 'Human gold: craft, the Hall, Plus.', fa: 'طلای انسانی: هنر دست، تالار، پلاس.' } },
]

const VOICE: { situation: Bi; en: string; fa: string; note: string }[] = [
  {
    situation: { en: 'Empty search', fa: 'جستجوی بی‌نتیجه' },
    en: 'Nothing matches yet. Clear a filter, or let the Scout tell you when a match appears.',
    fa: 'فعلاً چیزی پیدا نشد. یکی از فیلترها رو بردار، یا بذار پیشاهنگ هر وقت مورد مناسب پیدا شد خبرت کنه.',
    note: 'Persian uses the friendly تو and spoken verb forms (نشد، بذار), the way Iranians talk to a helpful colleague.',
  },
  {
    situation: { en: 'Primary call to action', fa: 'دکمه‌ی اصلی' },
    en: 'Start',
    fa: 'از اینجا شروع کن',
    note: 'A one-word verb reads curt in Persian; the invitation is warmer and still short.',
  },
  {
    situation: { en: 'Agent boundary', fa: 'مرز کار دستیار' },
    en: 'Never sends anything. Every word is yours to change.',
    fa: 'هیچ‌چیزی رو خودش نمی‌فرسته؛ هر کلمه‌ش رو می‌تونی عوض کنی.',
    note: 'Same promise, different rhythm: Persian joins the two clauses with a semicolon, as a speaker would.',
  },
]

const CAST: { id: KnightId; light: Bi; sigil: Bi }[] = [
  { id: 'merlin', light: { en: 'Staff orb', fa: 'گوی عصا' }, sigil: { en: 'Stars', fa: 'ستاره' } },
  { id: 'scout', light: { en: 'Visor slit', fa: 'شکاف کلاه‌خود' }, sigil: { en: 'Lozenge', fa: 'لوزی' } },
  { id: 'herald', light: { en: 'Eyes', fa: 'چشم‌ها' }, sigil: { en: 'Chevron and scroll', fa: 'شورون و طومار' } },
  { id: 'smith', light: { en: 'Hammer head', fa: 'سر چکش' }, sigil: { en: 'Hammer', fa: 'چکش' } },
  { id: 'steward', light: { en: 'Eyes', fa: 'چشم‌ها' }, sigil: { en: 'Chain and keys', fa: 'زنجیر و کلید' } },
  { id: 'scribe', light: { en: 'Quill nib', fa: 'نوک قلم' }, sigil: { en: 'Quill', fa: 'قلم' } },
  { id: 'sentinel', light: { en: 'Visor slit', fa: 'شکاف کلاه‌خود' }, sigil: { en: 'Shield', fa: 'سپر' } },
]

export function Brand() {
  useTitle({ en: 'Brand', fa: 'برند' })
  const { t, lang } = useLocale()
  const N = (i: number) => (lang === 'fa' ? ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸'][i] : ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][i])
  return (
    <Container>
      <header className="grid items-center gap-10 py-16 lg:grid-cols-[1fr_auto]">
        <div className="max-w-[720px]">
          <h1 className="display text-[clamp(2.4rem,5vw,4.2rem)]">{t({ en: 'A free lance, standing in the arch.', fa: 'یه نیزه‌ی آزاد، ایستاده در طاق.' })}</h1>
          <p className="mt-6 text-[18px] text-ink-muted">
            {t({
              en: '“Freelance” comes from Walter Scott’s Ivanhoe (1819): a free lance was a knight who served no single lord. Lance keeps that story. Neoclassical architecture gives it order; LED light marks every place where something can be done.',
              fa: 'واژه‌ی «فری‌لنس» از رمان آیوانهوی والتر اسکات (۱۸۱۹) اومده: «نیزه‌ی آزاد» شوالیه‌ای بود که به هیچ اربابی وابسته نبود. لنس همین داستان رو نگه می‌داره. معماری نئوکلاسیک بهش نظم می‌ده و نور ال‌ای‌دی هر جایی رو که می‌شه کاری انجام داد، روشن می‌کنه.',
            })}
          </p>
        </div>
        <div className="relative mx-auto grid size-56 place-items-center rounded-full border border-line">
          <div className="absolute inset-6 rounded-full border border-line" />
          <Mark size={120} className="text-ink" />
        </div>
      </header>

      <Chapter n={N(0)} id="b-mark" title={t({ en: 'The mark', fa: 'نشان' })} lead={t({ en: 'A lance in an arched niche, with its pennant. Built on a 48-unit grid.', fa: 'نیزه‌ای در یه طاقچه‌ی قوسی، با پرچمش. روی شبکه‌ی ۴۸ واحدی ساخته شده.' })}>
        <div className="grid gap-4 md:grid-cols-3">
          <Panel className="grid aspect-square place-items-center p-6">
            <svg viewBox="0 0 48 48" className="size-full max-w-[220px]" aria-label={t({ en: 'Construction grid', fa: 'شبکه‌ی ساخت' })} role="img">
              {Array.from({ length: 13 }).map((_, i) => (
                <g key={i} stroke="var(--line)" strokeWidth="0.15">
                  <line x1={i * 4} y1="0" x2={i * 4} y2="48" />
                  <line x1="0" y1={i * 4} x2="48" y2={i * 4} />
                </g>
              ))}
              <circle cx="24" cy="21" r="15" fill="none" stroke="var(--cobalt)" strokeWidth="0.3" strokeDasharray="1 1" />
              <g className="text-ink">
                <path d="M9 45V21a15 15 0 0 1 30 0v24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M24 45V20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M25.5 22.5l9.5 3.2-9.5 3.2z" fill="currentColor" />
                <path d="M24 6.5l3.6 7-3.6 7-3.6-7z" fill="var(--cobalt)" />
              </g>
            </svg>
          </Panel>
          <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-line p-6" style={{ background: '#111318', color: '#edeef1', ['--cobalt' as string]: '#5b7cff' }}>
            <Logo size={34} />
            <span className="text-[13px] text-[#a3a8b3]">{t({ en: 'On night', fa: 'روی شب' })}</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-6 rounded-lg border border-line p-6" style={{ background: '#f1f2f4', color: '#14161b', ['--cobalt' as string]: '#2f55e6' }}>
            <Logo size={34} />
            <span className="text-[13px] text-[#565c68]">{t({ en: 'On day', fa: 'روی روز' })}</span>
          </div>
        </div>
        <ul className="mt-6 grid gap-3 text-[15px] text-ink-muted sm:grid-cols-3">
          <li>{t({ en: 'Clear space: the height of the tip on every side.', fa: 'فضای خالی دورش: به اندازه‌ی ارتفاع نوک نیزه از هر طرف.' })}</li>
          <li>{t({ en: 'Smallest size: 20px. Below that, use the tip alone.', fa: 'کوچک‌ترین اندازه: ۲۰ پیکسل. کوچیک‌تر از اون فقط نوک نیزه.' })}</li>
          <li>{t({ en: 'The mark never mirrors in Persian, and the tip is only ever cobalt.', fa: 'نشان در فارسی برعکس نمی‌شه و نوک نیزه همیشه کبالته.' })}</li>
        </ul>
      </Chapter>

      <Chapter n={N(1)} id="b-color" title={t({ en: 'Colour', fa: 'رنگ' })} lead={t({ en: 'Two lights, each with one meaning. Everything else is stone.', fa: 'دو نور، هر کدوم با یه معنی. بقیه‌ی همه‌چیز سنگه.' })}>
        <ul className="flex flex-col divide-y divide-line rounded-lg border border-line">
          {SWATCHES.map((s) => (
            <li key={s.name.en} className="grid items-center gap-4 p-4 sm:grid-cols-[88px_160px_1fr]">
              <span className="flex gap-1" aria-hidden>
                <span className="size-10 rounded-sm border border-line" style={{ background: s.night }} />
                <span className="size-10 rounded-sm border border-line" style={{ background: s.day }} />
              </span>
              <span>
                <span className="block font-medium">{t(s.name)}</span>
                <span className="block text-[13px] text-ink-subtle tabular" dir="ltr">
                  {s.night} / {s.day}
                </span>
              </span>
              <span className="text-[15px] text-ink-muted">{t(s.role)}</span>
            </li>
          ))}
        </ul>
      </Chapter>

      <Chapter n={N(2)} id="b-type" title={t({ en: 'Type', fa: 'حروف' })} lead={t({ en: 'One family per script. Inter for English, Vazirmatn for Persian. The classical voice comes from proportion, not ornament.', fa: 'برای هر خط یه خانواده‌ی فونت: اینتر برای انگلیسی و وزیرمتن برای فارسی. حس کلاسیک از تناسب میاد، نه از تزئین.' })}>
        <div className="grid gap-4 md:grid-cols-2">
          <Panel className="p-6" lang="en" dir="ltr">
            <p className="text-[13px] text-ink-subtle">Inter · 620 · −3.5%</p>
            <p className="display mt-3 text-[56px]" style={{ fontFamily: 'var(--font-sans)', letterSpacing: '-0.035em', lineHeight: 1.02 }}>
              Free lance
            </p>
            <p className="mt-4 text-[17px] text-ink-muted" style={{ fontFamily: 'var(--font-sans)' }}>
              Body at 17/1.55. Numbers are tabular: 1,250,000 toman.
            </p>
          </Panel>
          <Panel className="p-6" lang="fa" dir="rtl">
            <p className="text-[13px] text-ink-subtle">وزیرمتن · ۷۶۰</p>
            <p className="mt-3 text-[48px] font-[760] leading-[1.35]" style={{ fontFamily: 'var(--font-fa)' }}>
              نیزه‌ی آزاد
            </p>
            <p className="mt-4 text-[17px] leading-[1.9] text-ink-muted" style={{ fontFamily: 'var(--font-fa)' }}>
              متن با اندازه‌ی ۱۷ و فاصله‌ی سطر ۱.۹. اعداد فارسی‌ان: ۱٬۲۵۰٬۰۰۰ تومان.
            </p>
          </Panel>
        </div>
        <Panel className="mt-4 p-6">
          <p className="mb-5 text-[15px] text-ink-muted">{t({ en: 'Steps use Roman numerals in English and Persian digits in Persian. The lit pip marks where you are.', fa: 'مراحل در انگلیسی با اعداد رومی و در فارسی با اعداد فارسی نوشته می‌شن. چراغ روشن، جایی که هستی رو نشون می‌ده.' })}</p>
          <Steps steps={[t({ en: 'What', fa: 'چی' }), t({ en: 'Details', fa: 'جزئیات' }), t({ en: 'Price', fa: 'قیمت' }), t({ en: 'Review', fa: 'مرور' })]} current={2} />
        </Panel>
      </Chapter>

      <Chapter n={N(3)} id="b-light" title={t({ en: 'Light', fa: 'نور' })} lead={t({ en: 'LED light is the only ornament, and it always marks something you can do.', fa: 'نور ال‌ای‌دی تنها تزئین ماست و همیشه چیزی رو نشون می‌ده که می‌شه انجامش داد.' })}>
        <div className="grid gap-4 md:grid-cols-3">
          <Panel rail="cobalt" className="p-6">
            <p className="font-medium">{t({ en: 'Rail', fa: 'ریل نور' })}</p>
            <p className="mt-2 text-[15px] text-ink-muted">{t({ en: 'A lit top edge on the surface where the main action lives.', fa: 'لبه‌ی بالایی روشن، روی سطحی که اقدام اصلی اونجاست.' })}</p>
          </Panel>
          <div className="relative overflow-hidden rounded-lg border border-line bg-surface p-6">
            <span aria-hidden className="flutes absolute inset-0" />
            <span aria-hidden className="sweep absolute inset-x-0 h-1/2" style={{ background: 'linear-gradient(to top, transparent, color-mix(in oklab, var(--cobalt) 45%, transparent), transparent)' }} />
            <p className="relative font-medium">{t({ en: 'Fluting and sweep', fa: 'شیار و جاروی نور' })}</p>
            <p className="relative mt-2 text-[15px] text-ink-muted">{t({ en: 'Column grooves carry one slow sweep, in the hero only. It pauses when off-screen.', fa: 'شیارهای ستون فقط یه جاروی آهسته‌ی نور دارن، اونم فقط در بخش اول صفحه. وقتی دیده نشه متوقف می‌شه.' })}</p>
          </div>
          <Panel className="p-6">
            <p className="flex items-center gap-2 font-medium">
              <Pip pulse /> {t({ en: 'Pip', fa: 'چراغک' })}
            </p>
            <p className="mt-2 text-[15px] text-ink-muted">{t({ en: 'A single LED for “live” or “current”: a working agent, your current step.', fa: 'یه چراغ کوچیک برای «در حال کار» یا «همین الان»: دستیاری که داره کار می‌کنه، مرحله‌ای که توشی.' })}</p>
          </Panel>
        </div>
        <ul className="mt-6 flex flex-col gap-2 text-[15px] text-ink-muted">
          <li>{t({ en: 'No dot grids, no glow on static blocks, no neon text.', fa: 'نه شبکه‌ی نقطه‌ای، نه درخشش روی بلوک‌های ثابت، نه متن نئونی.' })}</li>
          <li>{t({ en: 'Interactions finish in 200ms or less; loops stop under reduced motion.', fa: 'تعامل‌ها حداکثر ۲۰۰ میلی‌ثانیه طول می‌کشن و حلقه‌ها با «کاهش حرکت» متوقف می‌شن.' })}</li>
        </ul>
      </Chapter>

      <Chapter n={N(4)} id="b-knights" title={t({ en: 'The Round Table', fa: 'میزگرد' })} lead={t({ en: 'Seven characters drawn in one construction: a bust in a 160 × 200 niche, a fixed palette, one cobalt light, one gilt sign.', fa: 'هفت شخصیت با یه ساختار: نیم‌تنه در طاقچه‌ی ۱۶۰ در ۲۰۰، پالت ثابت، یه نور کبالت و یه نشان طلایی.' })}>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {CAST.map((c) => (
            <li key={c.id}>
              <Knight who={c.id} label={c.id} className="aspect-[4/5] w-full" />
              <p className="mt-2 text-[13px] text-ink-subtle">
                {t({ en: 'Light', fa: 'نور' })}: <span className="text-ink-muted">{t(c.light)}</span>
              </p>
              <p className="text-[13px] text-ink-subtle">
                {t({ en: 'Sign', fa: 'نشان' })}: <span className="text-ink-muted">{t(c.sigil)}</span>
              </p>
            </li>
          ))}
        </ul>
      </Chapter>

      <Chapter n={N(5)} id="b-cards" title={t({ en: 'Cards', fa: 'کارت‌ها' })} lead={t({ en: 'Guide cards teach one thing with a glimpse of the real interface. Oath cards give starters one habit to keep.', fa: 'کارت‌های راهنما با نمایی از رابط واقعی یه چیز رو یاد می‌دن. کارت‌های عهد به تازه‌کارها یه عادت می‌دن که نگهش دارن.' })}>
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <GuideCard
            icon={Search01Icon}
            title={t({ en: 'Find work that fits', fa: 'کار مناسب پیدا کن' })}
            line={t({ en: 'Title, icon chip, one line, one vignette. The lit edge sits at the end side.', fa: 'عنوان، آیکون، یه خط، یه تصویر کوچیک. لبه‌ی روشن سمت انتهای کارته.' })}
            vignette={
              <Vignette>
                <Bar w="70%" tone="cobalt" />
                <Bar w="90%" />
                <Bar w="55%" />
              </Vignette>
            }
          />
          <OathCard who="sentinel" tone="cobalt" label={t({ en: 'The Sentinel', fa: 'نگهبان' })} oath={t({ en: 'I check my work twice', fa: 'کارم رو دو بار چک می‌کنم' })} />
        </div>
      </Chapter>

      <Chapter n={N(6)} id="b-voice" title={t({ en: 'Voice', fa: 'لحن' })} lead={t({ en: 'English and Persian are written separately for the same intent. Neither is a translation of the other.', fa: 'انگلیسی و فارسی برای یه منظور، جدا از هم نوشته می‌شن. هیچ‌کدوم ترجمه‌ی اون یکی نیست.' })}>
        <ul className="flex flex-col gap-4">
          {VOICE.map((v) => (
            <li key={v.situation.en}>
              <Panel className="p-5">
                <Tag>{t(v.situation)}</Tag>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <p lang="en" dir="ltr" className="text-[16px]" style={{ fontFamily: 'var(--font-sans)', lineHeight: 1.55 }}>
                    {v.en}
                  </p>
                  <p lang="fa" dir="rtl" className="text-[16px]" style={{ fontFamily: 'var(--font-fa)', lineHeight: 1.9 }}>
                    {v.fa}
                  </p>
                </div>
                <p lang="en" dir="ltr" className={cn('mt-3 border-t border-line pt-3 text-[14px] text-ink-subtle')}>
                  {v.note}
                </p>
              </Panel>
            </li>
          ))}
        </ul>
      </Chapter>

      <Chapter n={N(7)} id="b-space" title={t({ en: 'Space', fa: 'فاصله' })} lead={t({ en: 'A 4px grid. Tight inside a group, wide between groups.', fa: 'شبکه‌ی ۴ پیکسلی. داخل یه گروه نزدیک، بین گروه‌ها با فاصله.' })}>
        <div className="flex flex-wrap items-end gap-4">
          {[4, 8, 12, 16, 24, 32, 48, 64, 96].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <span className="block rounded-[2px] bg-cobalt/70" style={{ width: s, height: s }} />
              <span className="text-[13px] text-ink-subtle tabular">{s}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[15px] text-ink-muted">{t({ en: 'Within a group 8–12, between groups 24–32, between sections 96–128. Radii are concentric: inner = outer − padding.', fa: 'داخل گروه ۸ تا ۱۲، بین گروه‌ها ۲۴ تا ۳۲، بین بخش‌ها ۹۶ تا ۱۲۸. گوشه‌ها هم‌مرکزن: گردی داخلی = گردی بیرونی منهای فاصله.' })}</p>
      </Chapter>
    </Container>
  )
}

