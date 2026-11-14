import { Search01Icon } from '@hugeicons/core-free-icons'
import type { ReactNode } from 'react'
import { CHARACTERS, Knight, Lancer, type KnightId } from '../brand/Knights'
import { Logo, Mark } from '../brand/Logo'
import { Beams, LedWall, Spark } from '../brand/Stage'
import { agents } from '../data/agents'
import { useLocale, type Bi } from '../i18n/locale'
import { useTitle } from '../layout/Shell'
import { Bar, GuideCard, OathCard, Vignette } from '../ui/cards'
import { cn, Container, Panel, Pip, Tag } from '../ui/core'
import { Steps } from '../ui/steps'

/**
 * The brand book. Everything here comes from the Lance brand file (04 · Brand — Guidelines and
 * 03 · Brand — Logos): logos, the mark, the Lancer, the palette and its ratio, the type families.
 * What the site adds is marked: the LED matrix that replaces the dot field, the five agent knights
 * drawn in the file's style, and the day theme.
 */

function Chapter({ n, title, lead, children, id }: { n: string; title: string; lead?: string; children: ReactNode; id: string }) {
  return (
    <section aria-labelledby={id} className="border-t border-line py-20">
      <div className="grid gap-10 lg:grid-cols-[280px_1fr] [&>*]:min-w-0">
        <div>
          <p className="numeral text-[13px] text-pink-ink">{n}</p>
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

const VALUES: { name: Bi; line: Bi }[] = [
  { name: { en: 'Trustworthy', fa: 'قابل اعتماد' }, line: { en: 'Money is held in escrow and every price comes with its reasons.', fa: 'پول در امانت می‌مونه و هر قیمتی دلیلش کنارش نوشته شده.' } },
  { name: { en: 'Transparent', fa: 'شفاف' }, line: { en: 'Agents show their plan and every step. Nothing happens behind your back.', fa: 'دستیارها برنامه و همه‌ی مراحل کارشون رو نشون می‌دن. هیچ کاری پشت سرت انجام نمی‌شه.' } },
  { name: { en: 'Professional', fa: 'حرفه‌ای' }, line: { en: 'Short sentences, real numbers, no hype. We talk like a good colleague.', fa: 'جمله‌های کوتاه، عددهای واقعی، بدون اغراق. مثل یه همکار خوب حرف می‌زنیم.' } },
]

const PALETTE: { group: Bi; items: { hex: string; name: Bi; ink: string }[] }[] = [
  {
    group: { en: 'Primary and ground', fa: 'رنگ اصلی و زمینه' },
    items: [
      { hex: '#FF7FE3', name: { en: 'Lance pink', fa: 'صورتی لنس' }, ink: '#0D0D0D' },
      { hex: '#0D0D0D', name: { en: 'Background', fa: 'پس‌زمینه' }, ink: '#FFFFFF' },
    ],
  },
  {
    group: { en: 'Secondary', fa: 'رنگ‌های مکمل' },
    items: [
      { hex: '#7FBDFF', name: { en: 'Sky', fa: 'آسمانی' }, ink: '#0D0D0D' },
      { hex: '#7FFFBF', name: { en: 'Mint', fa: 'نعنایی' }, ink: '#0D0D0D' },
      { hex: '#FFE57F', name: { en: 'Sun', fa: 'آفتابی' }, ink: '#0D0D0D' },
      { hex: '#FF2929', name: { en: 'Ember', fa: 'اخگری' }, ink: '#0D0D0D' },
    ],
  },
  {
    group: { en: 'Neutrals', fa: 'خنثی‌ها' },
    items: [
      { hex: '#141414', name: { en: 'Surface', fa: 'سطح' }, ink: '#FFFFFF' },
      { hex: '#1F1F1F', name: { en: 'Raised', fa: 'برجسته' }, ink: '#FFFFFF' },
      { hex: '#303030', name: { en: 'Stroke', fa: 'خط' }, ink: '#FFFFFF' },
      { hex: '#CCCCCC', name: { en: 'Muted text', fa: 'متن کم‌رنگ' }, ink: '#0D0D0D' },
    ],
  },
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
    situation: { en: 'Badge on a lanyard', fa: 'کارت شناسایی' },
    en: 'I’m a lancer.',
    fa: 'منم یه لنسرم!',
    note: 'Straight from the brand file’s posters. Persian keeps the exclamation and the spoken منم; English stays lowercase-calm.',
  },
]

const TONE_NAME: Record<string, Bi> = {
  pink: { en: 'Pink', fa: 'صورتی' },
  sky: { en: 'Sky', fa: 'آسمانی' },
  mint: { en: 'Mint', fa: 'نعنایی' },
  sun: { en: 'Sun', fa: 'آفتابی' },
}

const HELM: Record<KnightId, Bi> = {
  merlin: { en: 'Hood and beard · from the brand file', fa: 'شنل و ریش · از فایل برند' },
  scout: { en: 'Ranger’s hood and mask', fa: 'شنل جنگلبان و نقاب' },
  herald: { en: 'Sallet, plume, tabard', fa: 'کلاه‌خود سالت، پَر، ردای نشان‌دار' },
  smith: { en: 'Barbute with a Y opening', fa: 'کلاه‌خود باربوت با شکاف Y' },
  steward: { en: 'Crowned helm, cross visor', fa: 'کلاه‌خود تاج‌دار، نقاب صلیبی' },
  scribe: { en: 'Cowl, book and quill', fa: 'باشلق، کتاب و قلم پَر' },
  sentinel: { en: 'Great helm, visor slit', fa: 'کلاه‌خود بزرگ، شکاف دید' },
}

/** A logo on a ground, as on guideline sheet 11 (do) and sheet 13 (don't). */
function LogoTile({ bg, color, label, ok, children }: { bg: string; color?: string; label: string; ok: boolean; children?: ReactNode }) {
  const { t } = useLocale()
  return (
    <figure>
      <div className="grid aspect-[16/9] place-items-center overflow-hidden rounded-lg border border-white/10" style={{ background: bg }}>
        {children ?? <Logo size={30} color={color} />}
      </div>
      <figcaption className="mt-2 flex items-start gap-2 text-[13px] text-ink-muted">
        <span className={cn('font-medium', ok ? 'text-success' : 'text-danger')}>{ok ? t({ en: 'Do', fa: 'درست' }) : t({ en: 'Don’t', fa: 'نادرست' })}</span>
        <span>{label}</span>
      </figcaption>
    </figure>
  )
}

export function Brand() {
  useTitle({ en: 'Brand', fa: 'برند' })
  const { t, lang } = useLocale()
  const N = (i: number) => (lang === 'fa' ? ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۱۰'][i] : ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][i])
  return (
    <>
      {/* Cover: the brand book's first sheet, lit. */}
      <section className="night relative isolate overflow-hidden border-b border-line bg-ground text-ink">
        <LedWall figure="mark" fit={0.84} align={0.84} pitch={10} className="top-auto h-[240px] [mask-image:linear-gradient(to_bottom,transparent,#000_35%)] sm:top-0 sm:h-auto sm:[mask-image:none]" />
        <Beams className="opacity-50" />
        <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--ground)_35%,transparent_70%)] sm:bg-[linear-gradient(to_right,var(--ground)_40%,transparent_75%)] rtl:sm:bg-[linear-gradient(to_left,var(--ground)_40%,transparent_75%)]" />
        <Container className="relative flex min-h-[520px] flex-col justify-start pt-16 pb-[264px] sm:justify-center sm:py-20">
          <Logo size={44} />
          <h1 className="display mt-10 max-w-[620px] text-[clamp(2.4rem,5.4vw,4.4rem)]">{t({ en: 'The Lance brand book', fa: 'دفترچه‌ی برند لنس' })}</h1>
          <p className="mt-6 max-w-[56ch] text-[18px] text-ink-muted">
            {t({
              en: 'Freelancing is not only a job; it is a way of working on your own terms. We took that from the free lances of old: knights who served no single lord and moved with nothing but their skill. Every lancer with a craft plays that part today.',
              fa: 'فری‌لنسری فقط یه شغل نیست؛ یه سبک زندگی مستقله. ما از شوالیه‌های آزاد الهام گرفتیم؛ آدم‌هایی که بدون وابستگی حرکت می‌کردن و ابزارشون قدرت و مهارتشون بود. امروز هر فری‌لنسری که مهارت داره، همین نقش رو بازی می‌کنه.',
            })}
          </p>
        </Container>
      </section>

      <Container>
        <Chapter n={N(0)} id="b-values" title={t({ en: 'Values', fa: 'لحن برند' })} lead={t({ en: 'Three words from the guidelines. Every screen should earn all three.', fa: 'سه کلمه از دستورالعمل برند. هر صفحه باید هر سه رو داشته باشه.' })}>
          <ul className="grid gap-4 md:grid-cols-3">
            {VALUES.map((v) => (
              <li key={v.name.en}>
                <Panel className="h-full p-6">
                  <p className="display text-[30px] text-pink-ink">{t(v.name)}</p>
                  <p className="mt-3 text-[15px] text-ink-muted">{t(v.line)}</p>
                </Panel>
              </li>
            ))}
          </ul>
        </Chapter>

        <Chapter
          n={N(1)}
          id="b-logo"
          title={t({ en: 'Logo', fa: 'لوگو' })}
          lead={t({ en: 'The mark is a knight’s lance and a mouse pointer in one shape: the classic and the modern in a single frame.', fa: 'نماد لنس از نیزه‌ی شوالیه و نشانگر ماوس گرفته شده؛ حس کلاسیک و مدرن در یه قاب.' })}
        >
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <Panel className="night grid aspect-[16/10] place-items-center bg-ground p-6" lang="fa" dir="rtl">
              <Logo size={48} script="fa" />
            </Panel>
            <Panel className="night grid aspect-[16/10] place-items-center bg-ground p-6" lang="en" dir="ltr">
              <Logo size={48} script="en" />
            </Panel>
            <Panel className="night grid aspect-[16/10] place-items-center bg-ground p-6 md:aspect-auto md:w-40">
              <Mark size={120} />
            </Panel>
          </div>
          <p className="mt-4 text-[14px] text-ink-subtle">
            {t({ en: 'Persian logo · Latin logo · logomark. The logo never mirrors in RTL; the mark always leads the word.', fa: 'لوگوی فارسی · لوگوی لاتین · لوگومارک. لوگو در راست‌به‌چپ برعکس نمی‌شه و نماد همیشه جلوی کلمه می‌آد.' })}
          </p>

          <h3 className="heading mt-12 text-[20px]">{t({ en: 'Grounds', fa: 'رنگ پس‌زمینه' })}</h3>
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            <LogoTile ok bg="#0D0D0D" color="#FF7FE3" label={t({ en: 'Pink on dark: the main use', fa: 'صورتی روی تیره: کاربرد اصلی' })} />
            <LogoTile ok bg="#FF7FE3" color="#0D0D0D" label={t({ en: 'Black on pink', fa: 'مشکی روی صورتی' })} />
            <LogoTile ok bg="#FFFFFF" color="#0D0D0D" label={t({ en: 'Black on light grounds', fa: 'مشکی روی زمینه‌ی روشن' })} />
            <LogoTile ok bg="#520B42" color="#FF7FE3" label={t({ en: 'Pink on deep magenta', fa: 'صورتی روی ارغوانی تیره' })} />
          </div>
          <h3 className="heading mt-12 text-[20px]">{t({ en: 'Misuse', fa: 'دستورالعمل استفاده' })}</h3>
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            <LogoTile ok={false} bg="#0D0D0D" color="#9BFF45" label={t({ en: 'Colours outside the palette', fa: 'رنگ‌های خارج از پالت' })} />
            <LogoTile ok={false} bg="#0D0D0D" label={t({ en: 'Rotating or bending it', fa: 'چرخوندن یا خم کردن' })}>
              <span className="-rotate-12">
                <Logo size={30} color="#FF7FE3" />
              </span>
            </LogoTile>
            <LogoTile ok={false} bg="#0D0D0D" label={t({ en: 'Stretching the proportions', fa: 'به‌هم‌زدن نسبت‌ها' })}>
              <span className="scale-x-[1.6]">
                <Logo size={30} color="#FF7FE3" />
              </span>
            </LogoTile>
            <LogoTile ok={false} bg="#0D0D0D" label={t({ en: 'Glows and shadows', fa: 'افکت‌های درخشش و سایه' })}>
              <span className="[filter:drop-shadow(0_0_10px_#FF7FE3)_drop-shadow(4px_4px_0_#7FBDFF)]">
                <Logo size={30} color="#FF7FE3" />
              </span>
            </LogoTile>
          </div>
          <p className="mt-6 text-[14px] text-ink-subtle">
            {t({ en: 'Smallest size: 82 px on screen, 3 cm in print. Keep at least one tip-width of clear space on every side.', fa: 'کوچک‌ترین اندازه: ۸۲ پیکسل در صفحه و ۳ سانتی‌متر در چاپ. دورتادور لوگو حداقل به پهنای نوک نیزه فضای خالی بذار.' })}
          </p>
        </Chapter>

        <Chapter n={N(2)} id="b-lancer" title={t({ en: 'Personality', fa: 'شخصیت' })} lead={t({ en: 'The Lancer: legendary knights stood for trust, commitment, responsibility, and taking on big challenges.', fa: 'لنسر: شوالیه‌های افسانه‌ای نماد اعتماد، تعهد، مسئولیت‌پذیری و پذیرش چالش‌های بزرگ بودن.' })}>
          <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <div className="tile grid aspect-square place-items-center rounded-xl border border-white/10 p-10" style={{ ['--tint' as string]: 'var(--pink)' }}>
              <Lancer label={t({ en: 'The Lancer, a knight on horseback', fa: 'لنسر، شوالیه‌ی سوار بر اسب' })} className="h-full w-auto" />
            </div>
            <div className="flex flex-col gap-4 text-[15px] text-ink-muted">
              <p>{t({ en: 'The Lancer is the brand’s hero image. Use it whole, in one colour, on a dark ground or a brand tile. Never add a face, a shadow or a second colour.', fa: 'لنسر تصویر اصلی برنده. کامل و تک‌رنگ، روی زمینه‌ی تیره یا کاشی برند استفاده‌ش کن. صورت، سایه یا رنگ دوم بهش اضافه نکن.' })}</p>
              <p>{t({ en: 'On the site it rides across the LED wall on the home page, drawn pixel by pixel.', fa: 'توی سایت، روی دیوار ال‌ای‌دی صفحه‌ی اول، نقطه‌به‌نقطه روشن می‌شه.' })}</p>
            </div>
          </div>
        </Chapter>

        <Chapter n={N(3)} id="b-colour" title={t({ en: 'Colour', fa: 'رنگ‌ها' })} lead={t({ en: 'Black carries the page, white carries the words, pink carries the action. The secondaries mark categories, one each.', fa: 'مشکی صفحه رو نگه می‌داره، سفید کلمه‌ها رو و صورتی اقدام‌ها رو. رنگ‌های مکمل هر کدوم برای یه دسته‌ان.' })}>
          <div className="flex flex-col gap-8">
            {PALETTE.map((g) => (
              <div key={g.group.en}>
                <p className="text-[14px] text-ink-subtle">{t(g.group)}</p>
                <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {g.items.map((c) => (
                    <li key={c.hex} className="flex aspect-[5/3] flex-col justify-between rounded-lg border border-white/10 p-4" style={{ background: c.hex, color: c.ink }}>
                      <span className="text-[15px] font-semibold">{t(c.name)}</span>
                      <span className="mono text-[13px]" dir="ltr">
                        {c.hex}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="text-[14px] text-ink-subtle">{t({ en: 'Ratio', fa: 'نسبت استفاده از رنگ‌ها' })}</p>
              <div className="mt-3 flex h-12 overflow-hidden rounded-lg border border-white/10 text-[13px] font-medium" dir="ltr">
                <span className="grid place-items-center bg-[#0D0D0D] text-white" style={{ width: '60%' }}>60</span>
                <span className="grid place-items-center bg-white text-[#0D0D0D]" style={{ width: '30%' }}>30</span>
                <span className="grid place-items-center bg-[#FF7FE3] text-[#0D0D0D]" style={{ width: '10%' }}>10</span>
              </div>
              <p className="mt-4 text-[14px] text-ink-subtle">
                {t({ en: 'Site addition: in the day theme, pink stays a fill with black type, and pink text becomes deep magenta #A0127C so it passes 4.5:1.', fa: 'اضافه‌ی سایت: در حالت روز، صورتی فقط زمینه‌ی دکمه‌هاست با متن مشکی، و متن صورتی به ارغوانی تیره #A0127C تبدیل می‌شه تا کنتراستش کافی باشه.' })}
              </p>
            </div>
          </div>
        </Chapter>

        <Chapter n={N(4)} id="b-type" title={t({ en: 'Type', fa: 'تایپ‌فیس‌ها' })} lead={t({ en: 'One family per script, plus a mono for numbers and labels.', fa: 'برای هر خط یه خانواده، به‌اضافه‌ی یه فونت تک‌فاصله برای عددها و برچسب‌ها.' })}>
          <div className="grid gap-4 md:grid-cols-3">
            <Panel className="p-6" lang="fa" dir="rtl">
              <p className="text-[13px] text-ink-subtle" style={{ fontFamily: 'var(--font-fa)' }}>پیدا</p>
              <p className="mt-3 text-[44px] font-extrabold leading-tight" style={{ fontFamily: 'var(--font-fa)' }}>
                منم یه لنسرم!
              </p>
              <p className="mt-3 text-[15px] leading-loose text-ink-muted" style={{ fontFamily: 'var(--font-fa)' }}>
                آ ب پ ت ث ج چ ح خ د ذ ر ز ژ س ش ۱۲۳۴۵۶۷۸۹۰
              </p>
            </Panel>
            <Panel className="p-6" lang="en" dir="ltr">
              <p className="text-[13px] text-ink-subtle">Inter</p>
              <p className="display mt-3 text-[44px]" style={{ fontFamily: 'var(--font-sans)' }}>
                i’m a lancer
              </p>
              <p className="mt-3 text-[15px] text-ink-muted" style={{ fontFamily: 'var(--font-sans)' }}>
                AaBbCcDdEeFfGgHhIiJjKk 1234567890
              </p>
            </Panel>
            <Panel className="p-6" lang="en" dir="ltr">
              <p className="text-[13px] text-ink-subtle">IBM Plex Mono</p>
              <p className="mono mt-3 text-[30px] font-medium leading-tight">LANCE UP!</p>
              <p className="mono mt-3 text-[15px] text-ink-muted">0123456789 $1,950–$2,850</p>
            </Panel>
          </div>
          <p className="mt-4 text-[14px] text-ink-subtle">
            {t({ en: 'The guidelines name Peyda (Persian) and SF Pro (Latin). Peyda ships as licensed web fonts in nine weights, with Vazirmatn as the fallback while it loads; Inter stands in for SF Pro on the web.', fa: 'دستورالعمل برند «پیدا» رو برای فارسی و SF Pro رو برای لاتین مشخص کرده. «پیدا» با نُه وزن و مجوز وب روی سایت بارگذاری می‌شه و تا وقتی لود بشه، وزیرمتن جاش رو می‌گیره؛ روی وب، Inter جای SF Pro رو می‌گیره.' })}
          </p>
        </Chapter>

        <Chapter
          n={N(5)}
          id="b-knights"
          title={t({ en: 'The Round Table', fa: 'میزگرد' })}
          lead={t({ en: 'Merlin comes from the brand file. The other six agents are drawn in the same way: flat, angular, one colour, the face left as negative space.', fa: 'مرلین از فایل برند اومده. شش دستیار دیگه هم به همون شیوه کشیده شدن: تخت، زاویه‌دار، تک‌رنگ و صورت به‌شکل فضای خالی.' })}
        >
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {agents.map((a) => (
              <li key={a.id}>
                <Knight who={a.id} label={t(a.name)} className="aspect-[4/5] w-full" />
                <p className="mt-3 text-[14px] font-medium">{t(a.name)}</p>
                <p className="mt-0.5 text-[13px] text-ink-subtle">{t(HELM[a.id])}</p>
                <p className="mt-0.5 text-[13px] text-ink-subtle">{t(TONE_NAME[CHARACTERS[a.id].tone])}</p>
              </li>
            ))}
          </ul>
        </Chapter>

        <Chapter
          n={N(6)}
          id="b-led"
          title={t({ en: 'The LED stage', fa: 'صحنه‌ی ال‌ای‌دی' })}
          lead={t({ en: 'The guidelines show an LED wall behind a dark stage. The site builds that wall for real instead of drawing a flat dot field.', fa: 'دستورالعمل برند یه دیوار ال‌ای‌دی پشت یه صحنه‌ی تاریک نشون می‌ده. سایت به‌جای یه زمینه‌ی نقطه‌ای ساده، همون دیوار رو واقعاً می‌سازه.' })}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="night relative min-h-[320px] overflow-hidden rounded-xl border border-line bg-ground">
              <LedWall figure="merlin" fit={0.8} align={0.5} pitch={8} />
            </div>
            <div className="flex flex-col gap-4">
              <Panel className="p-6">
                <p className="font-medium">{t({ en: 'LED wall', fa: 'دیوار ال‌ای‌دی' })}</p>
                <p className="mt-2 text-[15px] text-ink-muted">{t({ en: 'Pixels inside the figure are lit with a soft bloom; the rest stay dim, so the wall reads as depth, not texture. One slow scan passes over it; it stops under reduced motion and off-screen.', fa: 'نقطه‌هایی که داخل شکل‌ان با یه هاله‌ی نرم روشن می‌شن و بقیه کم‌نور می‌مونن؛ پس دیوار حس عمق می‌ده، نه طرح تکراری. یه نوار نور آهسته ازش رد می‌شه که با «کاهش حرکت» یا وقتی دیده نشه متوقف می‌شه.' })}</p>
              </Panel>
              <Panel className="night relative overflow-hidden bg-ground p-6">
                <Beams className="opacity-70" />
                <p className="relative font-medium">{t({ en: 'Beams', fa: 'پرتوها' })}</p>
                <p className="relative mt-2 text-[15px] text-ink-muted">{t({ en: 'Thin pink lines from the stage photos. Behind headlines only, never behind body text.', fa: 'خط‌های باریک صورتی از عکس‌های صحنه. فقط پشت تیترها، هیچ‌وقت پشت متن اصلی.' })}</p>
              </Panel>
              <Panel className="flex items-center gap-5 p-6">
                <Spark size={56} className="shrink-0 text-pink" />
                <div>
                  <p className="font-medium">{t({ en: 'Pattern', fa: 'طرح‌ها' })}</p>
                  <p className="mt-1 text-[15px] text-ink-muted">{t({ en: 'The spark from the guidelines: two hooked strokes. Used as a divider or a quiet corner mark.', fa: 'جرقه‌ی دستورالعمل برند: دو خط قلاب‌دار. به‌عنوان جداکننده یا یه نشانه‌ی آروم گوشه‌ی کار.' })}</p>
                </div>
              </Panel>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {(['sky', 'pink', 'mint', 'sun', 'ember'] as const).map((tone) => (
              <div key={tone} className="tile grid aspect-square place-items-center rounded-lg border border-white/10" style={{ ['--tint' as string]: `var(--${tone})` }}>
                <Mark size={64} color={`var(--${tone})`} />
              </div>
            ))}
          </div>
          <p className="mt-3 text-[14px] text-ink-subtle">{t({ en: 'Brand tiles: a colour fading into black, one lance tip per area (Work, Hire, Agents, Learn, Showcase).', fa: 'کاشی‌های برند: یه رنگ که توی مشکی محو می‌شه، یه نوک نیزه برای هر بخش (کاریابی، استخدام، دستیارها، یادگیری، ویترین).' })}</p>
          <Panel className="mt-6 p-6">
            <p className="flex items-center gap-2 font-medium">
              <Pip pulse /> {t({ en: 'Pip and steps', fa: 'چراغک و مراحل' })}
            </p>
            <p className="mt-2 mb-5 text-[15px] text-ink-muted">{t({ en: 'One LED for “live” or “current”. Steps use Roman numerals in English and Persian digits in Persian.', fa: 'یه چراغ برای «در حال کار» یا «همین الان». مراحل در انگلیسی با اعداد رومی و در فارسی با اعداد فارسی نوشته می‌شن.' })}</p>
            <Steps steps={[t({ en: 'What', fa: 'چی' }), t({ en: 'Details', fa: 'جزئیات' }), t({ en: 'Price', fa: 'قیمت' }), t({ en: 'Review', fa: 'مرور' })]} current={2} />
          </Panel>
        </Chapter>

        <Chapter n={N(7)} id="b-cards" title={t({ en: 'Cards', fa: 'کارت‌ها' })} lead={t({ en: 'Guide cards teach one thing with a glimpse of the real interface. Oath cards are set like the “i’m a lancer” posters.', fa: 'کارت‌های راهنما با نمایی از رابط واقعی یه چیز رو یاد می‌دن. کارت‌های عهد مثل پوسترهای «منم یه لنسرم» چیده شدن.' })}>
          <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
            <GuideCard
              icon={Search01Icon}
              title={t({ en: 'Find work that fits', fa: 'کار مناسب پیدا کن' })}
              line={t({ en: 'Title, icon chip, one line, one vignette. The lit edge sits at the end side.', fa: 'عنوان، آیکون، یه خط، یه تصویر کوچیک. لبه‌ی روشن سمت انتهای کارته.' })}
              vignette={
                <Vignette>
                  <Bar w="70%" tone="pink" />
                  <Bar w="90%" />
                  <Bar w="55%" />
                </Vignette>
              }
            />
            <OathCard who="sentinel" tone="pink" label={t({ en: 'The Sentinel', fa: 'نگهبان' })} oath={t({ en: 'I check my work twice', fa: 'کارم رو دو بار چک می‌کنم' })} />
          </div>
        </Chapter>

        <Chapter n={N(8)} id="b-voice" title={t({ en: 'Voice', fa: 'لحن' })} lead={t({ en: 'English and Persian are written separately for the same intent. Neither is a translation of the other.', fa: 'انگلیسی و فارسی برای یه منظور، جدا از هم نوشته می‌شن. هیچ‌کدوم ترجمه‌ی اون یکی نیست.' })}>
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
                  <p lang="en" dir="ltr" className="mt-3 border-t border-line pt-3 text-[14px] text-ink-subtle">
                    {v.note}
                  </p>
                </Panel>
              </li>
            ))}
          </ul>
        </Chapter>

        <Chapter n={N(9)} id="b-space" title={t({ en: 'Space', fa: 'فاصله' })} lead={t({ en: 'A 4px grid. Tight inside a group, wide between groups.', fa: 'شبکه‌ی ۴ پیکسلی. داخل یه گروه نزدیک، بین گروه‌ها با فاصله.' })}>
          <div className="flex flex-wrap items-end gap-4">
            {[4, 8, 12, 16, 24, 32, 48, 64, 96].map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <span className="block rounded-[2px] bg-pink" style={{ width: s, height: s }} />
                <span className="text-[13px] text-ink-subtle tabular">{s}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[15px] text-ink-muted">{t({ en: 'Within a group 8–12, between groups 24–32, between sections 96–128. Radii are concentric: inner = outer − padding.', fa: 'داخل گروه ۸ تا ۱۲، بین گروه‌ها ۲۴ تا ۳۲، بین بخش‌ها ۹۶ تا ۱۲۸. گوشه‌ها هم‌مرکزن: گردی داخلی = گردی بیرونی منهای فاصله.' })}</p>
        </Chapter>
      </Container>
    </>
  )
}
