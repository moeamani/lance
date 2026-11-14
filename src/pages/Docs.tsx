import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons'
import { Link } from 'react-router-dom'
import { useLocale, type Bi } from '../i18n/locale'
import { useTitle } from '../layout/Shell'
import { ButtonLink, Container, Icon, PageHeader, Tag } from '../ui/core'

/** The diagram atlas, generated with the diagram-design skill into /public/atlas. */
export const ATLAS: { file: string; kind: Bi; title: Bi; line: Bi }[] = [
  { file: 'personas', kind: { en: 'User document', fa: 'مستند کاربر' }, title: { en: 'Who Lance is for', fa: 'لنس برای کیه' }, line: { en: 'Four personas with their jobs-to-be-done.', fa: 'چهار پرسونا و کارهایی که می‌خوان انجام بدن.' } },
  { file: 'sitemap', kind: { en: 'Information architecture', fa: 'معماری اطلاعات' }, title: { en: 'Sitemap', fa: 'نقشه‌ی سایت' }, line: { en: 'Five intents, their pages, and the utilities.', fa: 'پنج هدف، صفحه‌هاشون و ابزارهای جانبی.' } },
  { file: 'journey-starter', kind: { en: 'Journey', fa: 'مسیر کاربر' }, title: { en: 'Starter: zero to first client', fa: 'تازه‌کار: از صفر تا اولین کارفرما' }, line: { en: 'Learn, make, show, price, propose.', fa: 'یاد بگیر، بساز، نشون بده، قیمت بذار، پیشنهاد بده.' } },
  { file: 'journey-freelancer', kind: { en: 'Journey', fa: 'مسیر کاربر' }, title: { en: 'Freelancer: from Radar to paid', fa: 'فریلنسر: از رادار تا دریافت پول' }, line: { en: 'Find, tailor, propose, deliver, get paid.', fa: 'پیدا کن، رزومه رو آماده کن، پیشنهاد بده، تحویل بده، پول بگیر.' } },
  { file: 'journey-employer', kind: { en: 'Journey', fa: 'مسیر کاربر' }, title: { en: 'Employer: post to release', fa: 'کارفرما: از ثبت تا آزادسازی پول' }, line: { en: 'Post with Merlin, choose, fund escrow, approve.', fa: 'ثبت با مرلین، انتخاب، واریز به امانت، تأیید.' } },
  { file: 'journey-agents', kind: { en: 'Journey', fa: 'مسیر کاربر' }, title: { en: 'Agent user: brief to shipped', fa: 'کاربر دستیار: از بریف تا انتشار' }, line: { en: 'Pick a knight, brief it, review, ship.', fa: 'یه شوالیه انتخاب کن، بریف بده، بررسی کن، منتشر کن.' } },
  { file: 'journey-teacher', kind: { en: 'Journey', fa: 'مسیر کاربر' }, title: { en: 'Teacher: course to first sale', fa: 'مدرس: از دوره تا اولین فروش' }, line: { en: 'Draft, record, review, publish, sell.', fa: 'پیش‌نویس، ضبط، بررسی، انتشار، فروش.' } },
  { file: 'blueprint-pmo', kind: { en: 'Service blueprint', fa: 'نقشه‌ی خدمت' }, title: { en: 'Agentic PMO', fa: 'مدیریت پروژه‌ی هوشمند' }, line: { en: 'What the client sees, and what runs behind it.', fa: 'چیزی که کارفرما می‌بینه و چیزی که پشتش اجرا می‌شه.' } },
  { file: 'state-project', kind: { en: 'State machine', fa: 'ماشین حالت' }, title: { en: 'Project and escrow lifecycle', fa: 'چرخه‌ی پروژه و امانت' }, line: { en: 'Every state money and work can be in.', fa: 'همه‌ی حالت‌هایی که پول و کار می‌تونن داشته باشن.' } },
]

export function Docs() {
  useTitle({ en: 'Journeys & user docs', fa: 'مسیرهای کاربر و مستندات' })
  const { t, to } = useLocale()
  return (
    <Container>
      <PageHeader
        title={t({ en: 'Journeys and user documents', fa: 'مسیرهای کاربر و مستندات' })}
        lead={t({
          en: 'How Lance is structured and how each kind of person moves through it. Drawn with the diagram-design skill; the written IA and design plan live in the repository’s docs folder.',
          fa: 'لنس چطور چیده شده و هر نوع کاربر چطور ازش عبور می‌کنه. با مهارت diagram-design کشیده شده؛ سند معماری اطلاعات و برنامه‌ی طراحی در پوشه‌ی docs مخزن هستن.',
        })}
        actions={
          <ButtonLink to={to('/brand')} variant="outline">
            {t({ en: 'Brand book', fa: 'کتاب برند' })}
          </ButtonLink>
        }
      />
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ATLAS.map((a) => (
          <li key={a.file}>
            <a href={`/atlas/${a.file}.html`} target="_blank" rel="noopener" className="lift flex h-full flex-col rounded-lg border border-line bg-surface p-6">
              <Tag>{t(a.kind)}</Tag>
              <h2 className="heading mt-4 flex items-start justify-between gap-3 text-[20px]">
                {t(a.title)}
                <Icon icon={ArrowUpRight01Icon} size={18} directional className="mt-1 text-ink-subtle" />
              </h2>
              <p className="mt-2 text-[15px] text-ink-muted">{t(a.line)}</p>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-[15px] text-ink-subtle">
        {t({ en: 'All diagrams in one page:', fa: 'همه‌ی نمودارها در یه صفحه:' })}{' '}
        <a href="/atlas/index.html" target="_blank" rel="noopener" className="text-pink-ink underline underline-offset-4">
          {t({ en: 'the Lance atlas', fa: 'اطلس لنس' })}
        </a>
      </p>
    </Container>
  )
}

export function NotFound() {
  const { t, to } = useLocale()
  useTitle({ en: 'Not found', fa: 'پیدا نشد' })
  return (
    <Container narrow className="py-32 text-center">
      <p className="numeral text-[13px] text-ink-subtle">CDIV</p>
      <h1 className="display mt-4 text-[clamp(2rem,4vw,3rem)]">{t({ en: 'This page isn’t here', fa: 'این صفحه اینجا نیست' })}</h1>
      <p className="mt-4 text-ink-muted">{t({ en: 'The link may be old. Every part of Lance is one click from home.', fa: 'شاید لینک قدیمی باشه. همه‌ی بخش‌های لنس از صفحه‌ی اصلی یه کلیک فاصله دارن.' })}</p>
      <Link to={to('/')} className="mt-8 inline-flex h-11 items-center rounded-md bg-pink px-5 font-medium text-on-accent">
        {t({ en: 'Go home', fa: 'برگشت به خانه' })}
      </Link>
    </Container>
  )
}
