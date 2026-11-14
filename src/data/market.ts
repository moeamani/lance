import type { Bi } from '../i18n/locale'

/* Demo content. Sources are real sites; the postings are illustrative samples, marked as such in the UI. */

const H = 3600_000
const D = 24 * H
const ago = (ms: number) => new Date(Date.now() - ms).toISOString()

export type Discipline = 'design' | 'dev' | 'writing' | 'video' | 'marketing' | 'data' | 'business' | 'teaching'
export const disciplines: { id: Discipline; label: Bi }[] = [
  { id: 'design', label: { en: 'Design', fa: 'طراحی' } },
  { id: 'dev', label: { en: 'Development', fa: 'برنامه‌نویسی' } },
  { id: 'writing', label: { en: 'Writing', fa: 'نویسندگی' } },
  { id: 'video', label: { en: 'Video', fa: 'ویدیو' } },
  { id: 'marketing', label: { en: 'Marketing', fa: 'بازاریابی' } },
  { id: 'data', label: { en: 'Data', fa: 'داده' } },
  { id: 'business', label: { en: 'Business', fa: 'کسب‌وکار' } },
  { id: 'teaching', label: { en: 'Teaching', fa: 'آموزش' } },
]

export type Source = 'lance' | 'ponisha' | 'karlancer' | 'jobinja' | 'linkedin' | 'upwork' | 'remoteok'
export const sources: Record<Source, { name: Bi; url: string }> = {
  lance: { name: { en: 'Lance', fa: 'لنس' }, url: '' },
  ponisha: { name: { en: 'Ponisha', fa: 'پونیشا' }, url: 'https://ponisha.ir' },
  karlancer: { name: { en: 'Karlancer', fa: 'کارلنسر' }, url: 'https://www.karlancer.com' },
  jobinja: { name: { en: 'Jobinja', fa: 'جابینجا' }, url: 'https://jobinja.ir' },
  linkedin: { name: { en: 'LinkedIn', fa: 'لینکدین' }, url: 'https://www.linkedin.com/jobs' },
  upwork: { name: { en: 'Upwork', fa: 'آپ‌ورک' }, url: 'https://www.upwork.com' },
  remoteok: { name: { en: 'Remote OK', fa: 'ریموت‌اوکی' }, url: 'https://remoteok.com' },
}

export type Job = {
  id: string
  title: Bi
  org: Bi
  source: Source
  discipline: Discipline
  level: 'starter' | 'mid' | 'senior'
  pay: { amount: number; currency: 'IRT' | 'USD'; per: 'project' | 'month' | 'hour' }
  skills: string[]
  remote: boolean
  posted: string
  fit: number
  summary: Bi
  /** Also seen on — merged duplicates. */
  dupes?: Source[]
}

export const jobs: Job[] = [
  {
    id: 'checkout-redesign',
    title: { en: 'Redesign a checkout flow before the spring sale', fa: 'بازطراحی مراحل پرداخت قبل از حراج بهار' },
    org: { en: 'A home-goods shop in Isfahan', fa: 'یه فروشگاه لوازم خانه در اصفهان' },
    source: 'lance',
    discipline: 'design',
    level: 'mid',
    pay: { amount: 38_000_000, currency: 'IRT', per: 'project' },
    skills: ['Figma', 'UX research', 'E-commerce'],
    remote: true,
    posted: ago(3 * H),
    fit: 94,
    summary: {
      en: 'Cart abandonment is high on mobile. They want the checkout reduced to three steps and tested with five customers.',
      fa: 'خیلی از مشتری‌ها روی موبایل وسط خرید ول می‌کنن. می‌خوان پرداخت سه مرحله‌ای بشه و با پنج مشتری تست بشه.',
    },
    dupes: ['ponisha'],
  },
  {
    id: 'design-system-react',
    title: { en: 'Build a small design system in React', fa: 'ساخت یه دیزاین سیستم کوچیک با ری‌اکت' },
    org: { en: 'Fintech startup, Tehran', fa: 'استارتاپ مالی، تهران' },
    source: 'jobinja',
    discipline: 'dev',
    level: 'senior',
    pay: { amount: 95_000_000, currency: 'IRT', per: 'month' },
    skills: ['React', 'TypeScript', 'Design systems'],
    remote: false,
    posted: ago(9 * H),
    fit: 81,
    summary: {
      en: '20 core components with RTL support and docs. Three-month contract, office in Tehran two days a week.',
      fa: '۲۰ کامپوننت پایه با پشتیبانی راست‌به‌چپ و مستندات. قرارداد سه‌ماهه، هفته‌ای دو روز حضوری در تهران.',
    },
  },
  {
    id: 'saas-onboarding-copy',
    title: { en: 'Onboarding emails for a SaaS product', fa: 'ایمیل‌های خوشامدگویی برای یه محصول نرم‌افزاری' },
    org: { en: 'B2B scheduling tool', fa: 'ابزار زمان‌بندی برای شرکت‌ها' },
    source: 'upwork',
    discipline: 'writing',
    level: 'mid',
    pay: { amount: 900, currency: 'USD', per: 'project' },
    skills: ['Copywriting', 'Email', 'SaaS'],
    remote: true,
    posted: ago(26 * H),
    fit: 72,
    summary: {
      en: 'Six emails for the first two weeks of a trial, in English. They share their current open rates.',
      fa: 'شش ایمیل برای دو هفته‌ی اول دوره‌ی آزمایشی، به انگلیسی. نرخ باز شدن فعلی رو هم در اختیارت می‌ذارن.',
    },
  },
  {
    id: 'reels-editor',
    title: { en: 'Edit 12 short videos a month for a café chain', fa: 'تدوین ماهی ۱۲ ویدیوی کوتاه برای یه کافه‌ی زنجیره‌ای' },
    org: { en: 'Café chain, Shiraz', fa: 'کافه‌ی زنجیره‌ای، شیراز' },
    source: 'ponisha',
    discipline: 'video',
    level: 'starter',
    pay: { amount: 14_000_000, currency: 'IRT', per: 'month' },
    skills: ['Premiere', 'Reels', 'Color'],
    remote: true,
    posted: ago(2 * D),
    fit: 66,
    summary: {
      en: 'Footage is shot in-house. You cut, caption in Persian and colour. A good first client for a starter editor.',
      fa: 'فیلم‌ها رو خودشون می‌گیرن. تدوین، زیرنویس فارسی و اصلاح رنگ با توئه. برای شروع کار یه تدوینگر تازه‌کار عالیه.',
    },
    dupes: ['karlancer'],
  },
  {
    id: 'data-dashboard',
    title: { en: 'Sales dashboard in Power BI', fa: 'داشبورد فروش با پاور بی‌آی' },
    org: { en: 'Distribution company', fa: 'شرکت پخش' },
    source: 'karlancer',
    discipline: 'data',
    level: 'mid',
    pay: { amount: 22_000_000, currency: 'IRT', per: 'project' },
    skills: ['Power BI', 'SQL', 'Excel'],
    remote: true,
    posted: ago(30 * H),
    fit: 58,
    summary: {
      en: 'Connect three Excel exports, clean them, and build one page managers can read in two minutes.',
      fa: 'سه خروجی اکسل رو به هم وصل کن، تمیزشون کن و یه صفحه بساز که مدیرها تو دو دقیقه بخوننش.',
    },
  },
  {
    id: 'product-designer-remote',
    title: { en: 'Product designer, remote, part-time', fa: 'طراح محصول، دورکاری، پاره‌وقت' },
    org: { en: 'European health app', fa: 'یه اپ سلامت اروپایی' },
    source: 'remoteok',
    discipline: 'design',
    level: 'senior',
    pay: { amount: 35, currency: 'USD', per: 'hour' },
    skills: ['Figma', 'Prototyping', 'Accessibility'],
    remote: true,
    posted: ago(4 * D),
    fit: 77,
    summary: {
      en: '20 hours a week, overlap with CET mornings. Portfolio with shipped mobile work required.',
      fa: 'هفته‌ای ۲۰ ساعت، با هم‌پوشانی صبح‌های وقت اروپای مرکزی. نمونه‌کار موبایلِ منتشرشده لازمه.',
    },
    dupes: ['linkedin'],
  },
  {
    id: 'seo-content-plan',
    title: { en: 'Three-month SEO content plan', fa: 'برنامه‌ی محتوای سئو برای سه ماه' },
    org: { en: 'Online language school', fa: 'آموزشگاه زبان آنلاین' },
    source: 'linkedin',
    discipline: 'marketing',
    level: 'mid',
    pay: { amount: 1_400, currency: 'USD', per: 'project' },
    skills: ['SEO', 'Content strategy', 'Persian'],
    remote: true,
    posted: ago(6 * D),
    fit: 49,
    summary: {
      en: 'Keyword research in Persian and English, a 12-week calendar, and briefs for the first eight articles.',
      fa: 'تحقیق کلمات کلیدی فارسی و انگلیسی، تقویم ۱۲ هفته‌ای و بریف هشت مقاله‌ی اول.',
    },
  },
]

export type Offer = {
  slug: string
  title: Bi
  by: Bi
  agentAssisted: boolean
  discipline: Discipline
  from: number
  currency: 'IRT'
  days: number
  line: Bi
  tiers?: { name: Bi; price: number; days: number; includes: Bi[] }[]
}

export const offers: Offer[] = [
  {
    slug: 'agentic-pmo',
    title: { en: 'Agentic PMO: your project, run for you', fa: 'دفتر مدیریت پروژه‌ی هوشمند: پروژه‌ت رو برات جلو می‌بریم' },
    by: { en: 'The Steward with a Lance project manager', fa: 'پیشکار، همراه یه مدیر پروژه‌ی لنس' },
    agentAssisted: true,
    discipline: 'business',
    from: 6_000_000,
    currency: 'IRT',
    days: 14,
    line: {
      en: 'Give us the brief and your team. The Steward writes the backlog, plans sprints and reports every morning; a human PM reviews it every week.',
      fa: 'بریف و اعضای تیمت رو بده. پیشکار فهرست کارها رو می‌نویسه، اسپرینت‌ها رو می‌چینه و هر صبح گزارش می‌ده؛ یه مدیر پروژه‌ی واقعی هم هر هفته همه‌چیز رو بررسی می‌کنه.',
    },
    tiers: [
      {
        name: { en: 'Squire', fa: 'سرباز' },
        price: 6_000_000,
        days: 14,
        includes: [
          { en: 'Backlog and sprint plan from your brief', fa: 'فهرست کارها و برنامه‌ی اسپرینت از روی بریفت' },
          { en: 'Daily stand-up summary', fa: 'خلاصه‌ی جلسه‌ی روزانه' },
          { en: 'You run the meetings', fa: 'جلسه‌ها رو خودت اداره می‌کنی' },
        ],
      },
      {
        name: { en: 'Steward', fa: 'پیشکار' },
        price: 18_000_000,
        days: 28,
        includes: [
          { en: 'Everything in Squire', fa: 'هر چی در بسته‌ی سرباز هست' },
          { en: 'Weekly review with a Lance PM', fa: 'جلسه‌ی هفتگی با مدیر پروژه‌ی لنس' },
          { en: 'Risk flags before deadlines slip', fa: 'هشدار ریسک قبل از عقب افتادن مهلت‌ها' },
        ],
      },
      {
        name: { en: 'Castellan', fa: 'کوتوال' },
        price: 45_000_000,
        days: 56,
        includes: [
          { en: 'A dedicated PM, three calls a week', fa: 'مدیر پروژه‌ی اختصاصی، هفته‌ای سه جلسه' },
          { en: 'Hiring help from Lance freelancers', fa: 'کمک در جذب فریلنسر از لنس' },
          { en: 'Sentinel checks every milestone', fa: 'نگهبان همه‌ی قدم‌ها رو بررسی می‌کنه' },
        ],
      },
    ],
  },
  {
    slug: 'logo-and-identity',
    title: { en: 'Logo and a one-page identity guide', fa: 'لوگو و راهنمای هویت بصری یک‌صفحه‌ای' },
    by: { en: 'Kian Rahimi, brand designer', fa: 'کیان رحیمی، طراح برند' },
    agentAssisted: false,
    discipline: 'design',
    from: 12_000_000,
    currency: 'IRT',
    days: 10,
    line: { en: 'Three directions, one refined, colour and type rules on a single page.', fa: 'سه ایده‌ی اولیه، یکی‌ش نهایی می‌شه، با قواعد رنگ و فونت در یه صفحه.' },
  },
  {
    slug: 'landing-page-react',
    title: { en: 'A fast landing page in React', fa: 'یه صفحه‌ی فرود سریع با ری‌اکت' },
    by: { en: 'Parisa Tavakoli, front-end developer', fa: 'پریسا توکلی، برنامه‌نویس فرانت‌اند' },
    agentAssisted: false,
    discipline: 'dev',
    from: 20_000_000,
    currency: 'IRT',
    days: 12,
    line: { en: 'From your Figma file to a live page, RTL-ready, scoring 90+ on Lighthouse.', fa: 'از فایل فیگمات تا یه صفحه‌ی آنلاین، با پشتیبانی راست‌به‌چپ و امتیاز بالای ۹۰ در لایت‌هاوس.' },
  },
  {
    slug: 'bilingual-launch-post',
    title: { en: 'Launch announcement in Persian and English', fa: 'متن معرفی محصول به فارسی و انگلیسی' },
    by: { en: 'The Scribe, edited by a human writer', fa: 'کاتب، با ویرایش یه نویسنده‌ی واقعی' },
    agentAssisted: true,
    discipline: 'writing',
    from: 3_500_000,
    currency: 'IRT',
    days: 3,
    line: { en: 'Two versions written for each audience, not translated, plus three social posts.', fa: 'دو نسخه که هر کدوم برای مخاطب خودش نوشته شده، نه ترجمه؛ به‌علاوه‌ی سه پست شبکه‌ی اجتماعی.' },
  },
]

export type Course = {
  slug: string
  kind: 'path' | 'course'
  title: Bi
  teacher: Bi
  discipline: Discipline
  level: 'starter' | 'mid' | 'senior'
  lessons: number
  hours: number
  price: number // 0 = free
  line: Bi
  outline: Bi[]
}

export const courses: Course[] = [
  {
    slug: 'first-client-ui',
    kind: 'path',
    title: { en: 'From zero to your first UI client', fa: 'از صفر تا اولین کارفرمای طراحی رابط' },
    teacher: { en: 'Lance Academy', fa: 'آکادمی لنس' },
    discipline: 'design',
    level: 'starter',
    lessons: 6,
    hours: 14,
    price: 0,
    line: { en: 'Learn Figma basics, redesign one real screen, publish it to Showcase, and send your first proposal.', fa: 'اصول فیگما رو یاد بگیر، یه صفحه‌ی واقعی رو از نو طراحی کن، توی ویترین منتشرش کن و اولین پیشنهادت رو بفرست.' },
    outline: [
      { en: 'Figma in one afternoon', fa: 'فیگما در یک بعدازظهر' },
      { en: 'Copy a great screen, then improve it', fa: 'یه صفحه‌ی خوب رو کپی کن، بعد بهترش کن' },
      { en: 'Spacing and type that look professional', fa: 'فاصله‌گذاری و تایپوگرافی حرفه‌ای' },
      { en: 'Your first Showcase piece', fa: 'اولین نمونه‌کارت در ویترین' },
      { en: 'Price it with Merlin', fa: 'قیمت‌گذاری با مرلین' },
      { en: 'Send a proposal that gets read', fa: 'پیشنهادی بفرست که خونده بشه' },
    ],
  },
  {
    slug: 'first-client-dev',
    kind: 'path',
    title: { en: 'From zero to your first web client', fa: 'از صفر تا اولین پروژه‌ی وب' },
    teacher: { en: 'Lance Academy', fa: 'آکادمی لنس' },
    discipline: 'dev',
    level: 'starter',
    lessons: 7,
    hours: 22,
    price: 0,
    line: { en: 'HTML, CSS and a little React, one landing page built end to end, and how to scope a fixed-price job.', fa: 'اچ‌تی‌ام‌ال، سی‌اس‌اس و کمی ری‌اکت؛ ساخت کامل یه صفحه‌ی فرود و این‌که کار قیمت‌مقطوع رو چطور تعریف کنی.' },
    outline: [
      { en: 'The web in one page', fa: 'وب در یک صفحه' },
      { en: 'Layout with CSS grid', fa: 'چیدمان با گرید' },
      { en: 'Right-to-left done properly', fa: 'راست‌به‌چپ، درست و اصولی' },
      { en: 'A first React component', fa: 'اولین کامپوننت ری‌اکت' },
      { en: 'Ship it for free', fa: 'انتشار رایگان' },
      { en: 'Scope a fixed-price job', fa: 'تعریف یه کار قیمت‌مقطوع' },
      { en: 'Your first proposal', fa: 'اولین پیشنهاد' },
    ],
  },
  {
    slug: 'motion-for-ui',
    kind: 'course',
    title: { en: 'Motion for interfaces', fa: 'انیمیشن برای رابط کاربری' },
    teacher: { en: 'Babak Jafari', fa: 'بابک جعفری' },
    discipline: 'design',
    level: 'mid',
    lessons: 12,
    hours: 6,
    price: 1_900_000,
    line: { en: 'When to animate, how long, and which easing, with 20 small exercises in Figma and code.', fa: 'کِی انیمیشن بذاری، چقدر طول بکشه و با چه شتابی؛ با ۲۰ تمرین کوچیک در فیگما و کد.' },
    outline: [
      { en: 'Why most motion feels slow', fa: 'چرا بیشتر انیمیشن‌ها کُند به نظر می‌رسن' },
      { en: 'Easing you can feel', fa: 'شتابی که حسش می‌کنی' },
      { en: 'Enter, exit, interrupt', fa: 'ورود، خروج، قطع شدن' },
    ],
  },
  {
    slug: 'pricing-freelance',
    kind: 'course',
    title: { en: 'Pricing your freelance work', fa: 'قیمت‌گذاری کار فریلنسری' },
    teacher: { en: 'Mina Karimi', fa: 'مینا کریمی' },
    discipline: 'business',
    level: 'starter',
    lessons: 8,
    hours: 3,
    price: 900_000,
    line: { en: 'Hourly, fixed or value-based: pick the right one for the job and say your number without flinching.', fa: 'ساعتی، مقطوع یا بر اساس ارزش؛ برای هر کار درستش رو انتخاب کن و قیمتت رو بدون تردید بگو.' },
    outline: [
      { en: 'Three ways to price', fa: 'سه روش قیمت‌گذاری' },
      { en: 'Using Merlin’s range', fa: 'استفاده از بازه‌ی مرلین' },
      { en: 'Saying the number', fa: 'گفتن عدد' },
    ],
  },
]

export type Piece = {
  slug: string
  title: Bi
  maker: Bi
  discipline: Discipline
  curated: boolean
  /** Visual recipe for the generated cover (no stock imagery). */
  cover: 'app' | 'type' | 'grid' | 'chart' | 'film' | 'brand'
  hue: number
  line: Bi
}

export const pieces: Piece[] = [
  { slug: 'nowruz-shop', title: { en: 'Checkout for a Nowruz pop-up shop', fa: 'صفحه‌ی پرداخت برای فروشگاه نوروزی' }, maker: { en: 'Hamed Sadeghi', fa: 'حامد صادقی' }, discipline: 'design', curated: true, cover: 'app', hue: 225, line: { en: 'Four steps became two. Tested with six shoppers in a weekend.', fa: 'چهار مرحله شد دو مرحله. آخر هفته با شش خریدار تست شد.' } },
  { slug: 'farsi-type-specimen', title: { en: 'A Persian type specimen', fa: 'نمونه‌برگ یک فونت فارسی' }, maker: { en: 'Leila Haghighi', fa: 'لیلا حقیقی' }, discipline: 'design', curated: true, cover: 'type', hue: 42, line: { en: 'Specimen pages for a display face, set in both scripts.', fa: 'صفحه‌های نمونه برای یه فونت تیتر، به هر دو خط.' } },
  { slug: 'clinic-site', title: { en: 'Booking site for a dental clinic', fa: 'سایت نوبت‌دهی یه کلینیک دندان‌پزشکی' }, maker: { en: 'Parisa Tavakoli', fa: 'پریسا توکلی' }, discipline: 'dev', curated: false, cover: 'grid', hue: 165, line: { en: 'Next.js, RTL, and an appointment form that works on slow phones.', fa: 'نکست‌جی‌اس، راست‌به‌چپ و فرم نوبتی که روی گوشی‌های کند هم کار می‌کنه.' } },
  { slug: 'transit-data', title: { en: 'Tehran metro ridership, visualised', fa: 'مسافران مترو تهران، به زبان تصویر' }, maker: { en: 'Reza Nouri', fa: 'رضا نوری' }, discipline: 'data', curated: true, cover: 'chart', hue: 12, line: { en: 'Open data turned into one clear chart per line.', fa: 'داده‌های باز، برای هر خط یه نمودار روشن.' } },
  { slug: 'cafe-reels', title: { en: 'Twelve reels for a Shiraz café', fa: 'دوازده ریلز برای یه کافه در شیراز' }, maker: { en: 'Babak Jafari', fa: 'بابک جعفری' }, discipline: 'video', curated: false, cover: 'film', hue: 330, line: { en: 'Shot on a phone, cut to the beat, captioned in Persian.', fa: 'با گوشی فیلم‌برداری شده، روی ریتم تدوین شده، با زیرنویس فارسی.' } },
  { slug: 'tea-brand', title: { en: 'Identity for a Lahijan tea brand', fa: 'هویت بصری یه برند چای لاهیجان' }, maker: { en: 'Kian Rahimi', fa: 'کیان رحیمی' }, discipline: 'design', curated: false, cover: 'brand', hue: 95, line: { en: 'A mark drawn from tea-leaf veins, and a label system for six blends.', fa: 'نشانی که از رگه‌های برگ چای اومده و سیستم برچسب برای شش ترکیب.' } },
]
