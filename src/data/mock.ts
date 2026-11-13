/**
 * Mock domain data. Copy replaces the lorem ipsum / «فیچر اول» / «سوال سوم»
 * placeholders from the Figma file with realistic product copy.
 * Swap this module for API calls — screens only depend on these types.
 */

const day = 86400000
const now = Date.now()
const ago = (ms: number) => new Date(now - ms).toISOString()
const ahead = (ms: number) => new Date(now + ms).toISOString()

export type Lancer = {
  id: string
  name: string
  title: string
  bio: string
  rating: number
  reviews: number
  projects: number
  years: number
  verified: boolean
  online: boolean
  city: string
  skills: { name: string; level: 'مبتدی' | 'متوسط' | 'پیشرفته' }[]
  responseTime: string
  onTimeRate: number
  satisfaction: number
  hourly: number
  avatar?: string
}

export type Project = {
  id: string
  title: string
  category: string
  employer: string
  employerRating: number
  budget: number
  days: number
  postedAt: string
  description: string
  responsibilities: string[]
  skills: string[]
  proposals: number
  attachments: { name: string; size: number; kind: 'image' | 'pdf' }[]
  city: string
  urgent?: boolean
}

export type TaskItem = { id: string; title: string; done: boolean; due?: string; note?: string }

export type ActiveProject = {
  id: string
  title: string
  category: string
  counterpart: string
  progress: number
  deadline: string
  amount: number
  escrowStep: 0 | 1 | 2
  status: 'active' | 'searching' | 'done'
  tasks: TaskItem[]
}

export type Notification = {
  id: string
  kind: 'project' | 'payment' | 'message'
  title: string
  body: string
  at: string
  read: boolean
  important?: boolean
  to?: string
}

export type Payment = {
  id: string
  title: string
  amount: number
  at: string
  status: 'success' | 'failed' | 'pending'
  direction: 'out' | 'in'
  ref: string
  method: string
}

export type Message = {
  id: string
  from: 'me' | 'them'
  text?: string
  at: string
  read?: boolean
  attachment?: { kind: 'image' | 'file' | 'link'; name: string; size?: number; url?: string }
  replyTo?: string
}

export type Conversation = {
  id: string
  with: { name: string; role: 'کارفرما' | 'لنسر' | 'پشتیبانی'; online: boolean; lastSeen: string }
  category: string
  messages: Message[]
  unread: number
  projectId?: string
}

export const me = {
  name: 'محمد امانی',
  title: 'طراح رابط کاربری',
  phone: '09123858118',
  email: 'hello@lance.ir',
  city: 'تهران',
  bio: 'طراح رابط کاربری‌ام؛ تجربه‌ی کاربری روان، طراحی تمیز و رابط‌های مدرن برای اپ‌ها و وب‌سایت‌ها خلق می‌کنم.',
  skills: [
    { name: 'طراحی رابط کاربری', level: 'پیشرفته' as const },
    { name: 'تجربه کاربری', level: 'پیشرفته' as const },
    { name: 'فیلم‌برداری', level: 'مبتدی' as const },
  ],
  completion: 75,
}

export const lancers: Lancer[] = [
  {
    id: 'l1',
    name: 'محمد امانی',
    title: 'طراح رابط کاربری',
    bio: 'طراح رابط کاربری‌ام؛ تجربه‌ی کاربری روان، طراحی تمیز و رابط‌های مدرن برای اپ‌ها و وب‌سایت‌ها خلق می‌کنم.',
    rating: 4.9,
    reviews: 86,
    projects: 152,
    years: 7,
    verified: true,
    online: true,
    city: 'تهران',
    skills: [
      { name: 'طراحی رابط کاربری', level: 'پیشرفته' },
      { name: 'Figma', level: 'پیشرفته' },
      { name: 'فیلم‌برداری', level: 'مبتدی' },
    ],
    responseTime: '۲ ساعت و ۴۰ دقیقه',
    onTimeRate: 97,
    satisfaction: 94,
    hourly: 450000,
    avatar: 'brand',
  },
  {
    id: 'l2',
    name: 'سارا احمدی',
    title: 'برنامه‌نویس فرانت‌اند',
    bio: 'React و Next.js کار می‌کنم و عاشق انیمیشن‌های ریز و رابط‌های سریعم. ۴۰+ پروژه فروشگاهی تحویل داده‌ام.',
    rating: 4.8,
    reviews: 54,
    projects: 61,
    years: 5,
    verified: true,
    online: false,
    city: 'اصفهان',
    skills: [
      { name: 'React', level: 'پیشرفته' },
      { name: 'Next.js', level: 'پیشرفته' },
      { name: 'Node.js', level: 'متوسط' },
    ],
    responseTime: '۴۵ دقیقه',
    onTimeRate: 92,
    satisfaction: 96,
    hourly: 600000,
  },
  {
    id: 'l3',
    name: 'آرمان رستمی',
    title: 'تدوینگر و موشن دیزاینر',
    bio: 'تدوین ریلز و تیزر برای برندهای غذایی و مد. رنگ‌بندی سینمایی و تحویل در ۴۸ ساعت.',
    rating: 4.6,
    reviews: 31,
    projects: 44,
    years: 4,
    verified: false,
    online: true,
    city: 'شیراز',
    skills: [
      { name: 'تدوین', level: 'پیشرفته' },
      { name: 'موشن گرافیک', level: 'متوسط' },
    ],
    responseTime: '۳ ساعت',
    onTimeRate: 88,
    satisfaction: 90,
    hourly: 350000,
  },
  {
    id: 'l4',
    name: 'نیما مختاری',
    title: 'طراح هویت بصری',
    bio: 'لوگو و هویت بصری برای استارتاپ‌ها؛ از ورکشاپ کشف برند تا راهنمای کامل.',
    rating: 4.7,
    reviews: 22,
    projects: 29,
    years: 6,
    verified: true,
    online: false,
    city: 'تهران',
    skills: [
      { name: 'طراحی لوگو', level: 'پیشرفته' },
      { name: 'تصویرسازی', level: 'متوسط' },
    ],
    responseTime: '۱ ساعت',
    onTimeRate: 95,
    satisfaction: 93,
    hourly: 500000,
  },
]

export const projects: Project[] = [
  {
    id: 'p1',
    title: 'طراحی رابط کاربری اپلیکیشن فروشگاهی',
    category: 'طراحی رابط کاربری',
    employer: 'نیما مختاری',
    employerRating: 4.5,
    budget: 12_000_000,
    days: 14,
    postedAt: ago(3 * day),
    description:
      'یک اپ فروشگاهی پوشاک داریم که نسخه وب آن فعال است. می‌خواهیم اپ موبایل را از صفر طراحی کنیم: صفحه اصلی، لیست و جزئیات محصول، سبد خرید، پرداخت و پروفایل. سیستم طراحی فعلی وب در فیگما موجود است.',
    responsibilities: ['طراحی ۱۲ تا ۱۵ صفحه اصلی با حالت‌های خالی و خطا', 'پروتوتایپ قابل کلیک برای تست کاربر', 'تحویل کامپوننت‌ها با Auto Layout و متغیرها', 'یک جلسه هند‌آف با تیم توسعه'],
    skills: ['طراحی رابط کاربری', 'تجربه کاربری', 'Figma'],
    proposals: 8,
    attachments: [
      { name: 'brief-v2.pdf', size: 2_700_000, kind: 'pdf' },
      { name: 'current-web.jpg', size: 2_700_000, kind: 'image' },
    ],
    city: 'دورکاری (همه شهرها)',
    urgent: true,
  },
  {
    id: 'p2',
    title: 'طراحی بنر تبلیغاتی کمپین یلدا',
    category: 'طراحی گرافیک',
    employer: 'کافه رستوران سورنا',
    employerRating: 4.2,
    budget: 2_000_000,
    days: 7,
    postedAt: ago(1 * day),
    description: 'برای کمپین یلدا ۵ بنر برای اینستاگرام (پست و استوری) و یک بنر بیلبورد کوچک لازم داریم.',
    responsibilities: ['۵ طرح شبکه اجتماعی', '۱ طرح چاپی', 'فایل‌های لایه‌باز'],
    skills: ['طراحی پوستر', 'تصویرسازی'],
    proposals: 23,
    attachments: [],
    city: 'تهران',
  },
  {
    id: 'p3',
    title: 'پیاده‌سازی لندینگ با Next.js',
    category: 'توسعه وب',
    employer: 'استارتاپ ری‌را',
    employerRating: 4.8,
    budget: 18_000_000,
    days: 21,
    postedAt: ago(5 * 3600000),
    description: 'طرح فیگمای لندینگ آماده است؛ پیاده‌سازی ریسپانسیو با انیمیشن‌های اسکرول و فرم ثبت‌نام متصل به API.',
    responsibilities: ['پیاده‌سازی پیکسل‌پرفکت', 'Lighthouse بالای ۹۰', 'اتصال فرم به API'],
    skills: ['React', 'Next.js'],
    proposals: 5,
    attachments: [{ name: 'landing.fig.pdf', size: 5_400_000, kind: 'pdf' }],
    city: 'دورکاری (همه شهرها)',
  },
  {
    id: 'p4',
    title: 'تدوین ۱۰ ریلز آموزشی',
    category: 'ویدئو و تدوین',
    employer: 'آکادمی کدنویس',
    employerRating: 4.6,
    budget: 6_500_000,
    days: 10,
    postedAt: ago(2 * day),
    description: 'راش‌ها آماده است. تدوین با زیرنویس فارسی، موشن ساده و موزیک بدون کپی‌رایت.',
    responsibilities: ['۱۰ ریلز زیر ۶۰ ثانیه', 'زیرنویس', 'کاور برای هر ریلز'],
    skills: ['تدوین', 'موشن گرافیک'],
    proposals: 14,
    attachments: [],
    city: 'دورکاری (همه شهرها)',
  },
]

export const activeProjects: ActiveProject[] = [
  {
    id: 'a1',
    title: 'طراحی وب‌سایت B2B',
    category: 'توسعه وب',
    counterpart: 'امیرحسین فلاح',
    progress: 50,
    deadline: ahead(9 * day),
    amount: 20_000_000,
    escrowStep: 1,
    status: 'active',
    tasks: [
      { id: 't1', title: 'دریافت نیازمندی و تحقیق اولیه', done: true },
      { id: 't2', title: 'طراحی کانسپت لوگو', done: true },
      { id: 't3', title: 'نهایی‌سازی لوگو', done: false, due: ahead(2 * day) },
      { id: 't4', title: 'طراحی وایرفریم صفحات سایت', done: false, due: ahead(5 * day) },
      { id: 't5', title: 'طراحی UI نهایی سایت', done: false, due: ahead(9 * day) },
    ],
  },
  {
    id: 'a2',
    title: 'ادیت ویدیو ریل',
    category: 'ویدئو و تدوین',
    counterpart: '',
    progress: 0,
    deadline: ahead(12 * day),
    amount: 4_000_000,
    escrowStep: 0,
    status: 'searching',
    tasks: [],
  },
  {
    id: 'a3',
    title: 'پیاده‌سازی وب‌سایت با ری‌اکت',
    category: 'توسعه وب',
    counterpart: 'سارا احمدی',
    progress: 72,
    deadline: ahead(4 * day),
    amount: 35_000_000,
    escrowStep: 1,
    status: 'active',
    tasks: [
      { id: 't1', title: 'راه‌اندازی پروژه و CI', done: true },
      { id: 't2', title: 'صفحه اصلی', done: true },
      { id: 't3', title: 'صفحات محصول', done: true },
      { id: 't4', title: 'اتصال به API', done: false, due: ahead(3 * day) },
    ],
  },
  {
    id: 'a4',
    title: 'هویت بصری کافه سورنا',
    category: 'هویت بصری',
    counterpart: 'نیما مختاری',
    progress: 100,
    deadline: ago(10 * day),
    amount: 9_000_000,
    escrowStep: 2,
    status: 'done',
    tasks: [{ id: 't1', title: 'تحویل راهنمای برند', done: true }],
  },
]

export const notifications: Notification[] = [
  { id: 'n1', kind: 'project', title: 'تأخیر در پروژه', body: 'مهلت تحویل تسک «نهایی‌سازی لوگو» در پروژه طراحی وب‌سایت B2B فردا تمام می‌شود.', at: ago(2 * 3600000), read: false, important: true, to: '/app/projects/a1' },
  { id: 'n2', kind: 'payment', title: 'واریز به کیف پول', body: '۲۰٬۰۰۰٬۰۰۰ تومان بابت پروژه «طراحی وب‌سایت B2B» در ضمانت لنس قرار گرفت.', at: ago(5 * 3600000), read: false, to: '/app/projects/a1' },
  { id: 'n3', kind: 'message', title: 'پیام جدید از نیما مختاری', body: 'سلام، فایل‌های نهایی رو کی می‌فرستی؟', at: ago(26 * 3600000), read: true, to: '/app/messages/c1' },
  { id: 'n4', kind: 'project', title: 'پیشنهاد شما دیده شد', body: 'کارفرمای پروژه «طراحی رابط کاربری اپلیکیشن فروشگاهی» پیشنهادتان را بررسی کرد.', at: ago(2 * day), read: true, to: '/app/discover/p1' },
  { id: 'n5', kind: 'payment', title: 'تراکنش ناموفق', body: 'پرداخت ۵٬۵۰۰٬۰۰۰ تومان ناموفق بود. مبلغ کسرشده تا ۴۸ ساعت برمی‌گردد.', at: ago(3 * day), read: true, important: true, to: '/app/wallet' },
]

export const payments: Payment[] = [
  { id: 'pay1', title: 'پرداخت پروژه طراحی وب‌سایت B2B', amount: 5_500_000, at: ago(1 * day), status: 'success', direction: 'out', ref: '33562342819821', method: 'درگاه بانکی' },
  { id: 'pay2', title: 'پرداخت پروژه ادیت ویدیو', amount: 5_500_000, at: ago(3 * day), status: 'success', direction: 'out', ref: '33562342819822', method: 'کیف پول' },
  { id: 'pay3', title: 'پرداخت پروژه هویت بصری', amount: 5_500_000, at: ago(4 * day), status: 'failed', direction: 'out', ref: '33562342819823', method: 'درگاه بانکی' },
  { id: 'pay4', title: 'خرید اشتراک لنس پلاس', amount: 1_249_000, at: ago(6 * day), status: 'pending', direction: 'out', ref: '33562342819824', method: 'درگاه بانکی' },
  { id: 'inc1', title: 'آزادسازی پروژه هویت بصری کافه سورنا', amount: 9_000_000, at: ago(10 * day), status: 'success', direction: 'in', ref: '33562342819830', method: 'کیف پول' },
  { id: 'inc2', title: 'آزادسازی فاز اول اپ فروشگاهی', amount: 15_000_000, at: ago(18 * day), status: 'success', direction: 'in', ref: '33562342819831', method: 'کیف پول' },
]

export const conversations: Conversation[] = [
  {
    id: 'c1',
    with: { name: 'نیما مختاری', role: 'کارفرما', online: false, lastSeen: ago(10 * 60000) },
    category: 'رابط کاربری',
    unread: 2,
    projectId: 'a1',
    messages: [
      { id: 'm1', from: 'me', text: 'سلام خسته نباشید!', at: ago(50 * 60000), read: true },
      { id: 'm2', from: 'me', text: 'چطوره؟', at: ago(49 * 60000), read: true },
      { id: 'm3', from: 'me', text: 'سعی کردم هر سه حالت رو در نظر بگیرم.', at: ago(48 * 60000), read: true },
      { id: 'm4', from: 'me', attachment: { kind: 'image', name: 'concepts.png', size: 1_800_000 }, at: ago(47 * 60000), read: true },
      { id: 'm5', from: 'them', text: 'سلام روز شما بخیر ممنونم. لطفا در سایت بارگذاری کنید', replyTo: 'm1', at: ago(20 * 60000) },
      { id: 'm6', from: 'them', text: 'نسخه دوم لوگو خیلی بهتره 👌', at: ago(19 * 60000) },
    ],
  },
  {
    id: 'c2',
    with: { name: 'سارا احمدی', role: 'لنسر', online: true, lastSeen: ago(0) },
    category: 'توسعه وب',
    unread: 0,
    projectId: 'a3',
    messages: [
      { id: 'm1', from: 'them', text: 'صفحه محصول رو پوش کردم، لینک پیش‌نمایش:', at: ago(3 * 3600000) },
      { id: 'm2', from: 'them', attachment: { kind: 'link', name: 'preview.rira.dev/product', url: 'https://example.com' }, at: ago(3 * 3600000) },
      { id: 'm3', from: 'me', text: 'عالیه، تا عصر بررسی می‌کنم.', at: ago(2 * 3600000), read: true },
    ],
  },
  {
    id: 'c3',
    with: { name: 'پشتیبانی لنس', role: 'پشتیبانی', online: true, lastSeen: ago(0) },
    category: 'پشتیبانی',
    unread: 1,
    messages: [{ id: 'm1', from: 'them', text: 'سلام! احراز هویت شما تأیید شد ✅ حالا می‌توانید برداشت کنید.', at: ago(day) }],
  },
]

export const quickReplies = ['انجام شد', 'چشم در اسرع وقت انجام میشه', 'فایل رو بررسی می‌کنم', 'ممنون از بازخوردتون']

export const reviews = [
  { id: 'r1', name: 'آرمان رستمی', role: 'بنیان‌گذار استارتاپ · کارفرما', rating: 5, text: 'برای بازطراحی اپلیکیشنمون دنبال یه تیم رابط کاربری می‌گشتم. کمتر از یک روز چند پیشنهاد خوب گرفتم و شروع به کار کردیم.' },
  { id: 'r2', name: 'سارا احمدی', role: 'طراح رابط کاربری · فری‌لنسر', rating: 5, text: 'فری‌لنسری‌مو با لنس شروع کردم. پورتفولیوی اختصاصی باعث شد کارفرماها راحت‌تر بهم اعتماد کنن.' },
  { id: 'r3', name: 'میلاد کریمی', role: 'مدیر محصول · کارفرما', rating: 4, text: 'نگرانی اصلیم پرداخت امن بود. تو لنس پول تا تحویل نهایی نگه داشته می‌شه؛ همین خیالمو راحت کرد.' },
]

export const faqs = [
  { id: 'f1', q: 'لنس چطوری کار می‌کنه؟', a: 'کارفرما پروژه را ثبت می‌کند، لنسرها پیشنهاد می‌دهند و بعد از توافق، مبلغ پروژه در ضمانت لنس قرار می‌گیرد. با تأیید تحویل، پول برای لنسر آزاد می‌شود.' },
  { id: 'f2', q: 'چطوری می‌تونم پروژه ثبت کنم؟', a: 'از دکمه «ثبت پروژه رایگان» نوع پروژه، توضیحات، مهارت‌ها و بودجه را وارد کنید. ثبت پروژه رایگان است و فقط بعد از انتخاب لنسر پرداخت انجام می‌شود.' },
  { id: 'f3', q: 'کارمزد لنس چقدره؟', a: 'برای کارفرما ثبت پروژه رایگان است. از هر پرداخت موفق، درصد کوچکی به‌عنوان کارمزد از سهم لنسر کسر می‌شود که پیش از پذیرش پروژه به‌وضوح نمایش داده می‌شود.' },
  { id: 'f4', q: 'اگه از نتیجه راضی نباشم چی میشه؟', a: 'تا وقتی تحویل را تأیید نکرده‌اید پول آزاد نمی‌شود. در صورت اختلاف، تیم داوری لنس پیام‌ها و خروجی‌ها را بررسی کرده و رأی نهایی صادر می‌کند.' },
]

export const blogPosts = [
  {
    id: 'b1',
    title: 'معرفی هوش مصنوعی‌های کاربردی برای فریلنسرها',
    excerpt: 'هفت ابزار هوش مصنوعی که زمان تحویل پروژه را نصف می‌کنند — از نوشتن پیشنهاد تا خلاصه‌سازی جلسه.',
    minutes: 6,
    date: ago(14 * day),
    tag: 'ابزار',
    gradient: 'from-[#1b2b6b] via-[#3a2b8f] to-[#ff7fe3]',
  },
  {
    id: 'b2',
    title: 'چطور یک پیشنهاد (Proposal) برنده بنویسیم؟',
    excerpt: 'با دو جمله از بریف شروع کنید، یک مایلستون کوچک پیشنهاد بدهید و فقط یک نمونه‌کار مرتبط بفرستید.',
    minutes: 4,
    date: ago(20 * day),
    tag: 'آموزش',
    gradient: 'from-[#2b0d26] via-[#7a1f66] to-[#ff7fe3]',
  },
  {
    id: 'b3',
    title: 'قیمت‌گذاری پروژه برای تازه‌کارها',
    excerpt: 'سه روش قیمت‌گذاری (ساعتی، ثابت، ارزش‌محور) و اینکه کِی از کدام استفاده کنیم.',
    minutes: 8,
    date: ago(30 * day),
    tag: 'کسب‌وکار',
    gradient: 'from-[#0d2b22] via-[#1f7a5c] to-[#7fffbf]',
  },
]

export const templates = [
  { id: 'tp1', title: 'طراحی رابط کاربری', tasks: 5, icon: 'ui' },
  { id: 'tp2', title: 'توسعه اپلیکیشن', tasks: 8, icon: 'app' },
  { id: 'tp3', title: 'طراحی وب‌سایت', tasks: 6, icon: 'web' },
  { id: 'tp4', title: 'هویت بصری', tasks: 4, icon: 'branding' },
]

export const courses = [
  { id: 'co1', title: 'آموزش مقدماتی فیگما', students: 10, rating: 4.5, featured: true },
  { id: 'co2', title: 'اصول تجربه کاربری', students: 24, rating: 4.8 },
]

export const experiences = [
  { id: 'e1', role: 'طراح محصول', company: 'لنس', period: '۱ سال', active: true },
  { id: 'e2', role: 'مدیر هنری', company: 'فانوس', period: '۱ سال' },
  { id: 'e3', role: 'طراح رابط کاربری', company: 'رهنما', period: '۲ ماه' },
]

export const requests = lancers.map((l, i) => ({ ...l, proposal: [12_000_000, 10_500_000, 14_000_000, 11_000_000][i], days: [14, 18, 10, 15][i] }))
