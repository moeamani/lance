import type { KnightId } from '../brand/Knights'
import type { Bi } from '../i18n/locale'

export type Agent = {
  id: KnightId
  name: Bi
  role: Bi
  line: Bi
  /** What you give it, what you get back. */
  input: Bi
  output: Bi
  /** The boundary it never crosses. */
  limit: Bi
  plan: 'free' | 'plus'
  home: string // where it lives in the product
  /** A short scripted run used in demos. */
  run: { step: Bi; result: Bi }[]
}

export const agents: Agent[] = [
  {
    id: 'merlin',
    name: { en: 'Merlin', fa: 'مرلین' },
    role: { en: 'Prices your project', fa: 'قیمت پروژه رو تخمین می‌زنه' },
    line: {
      en: 'Reads your brief, compares it with finished projects of the same size, and gives you a fair price range with its reasons written out.',
      fa: 'بریفت رو می‌خونه، با پروژه‌های هم‌اندازه‌ای که قبلاً تموم شدن مقایسه می‌کنه و یه بازه‌ی قیمت منصفانه می‌ده؛ دلیل‌هاش رو هم کنارش می‌نویسه.',
    },
    input: { en: 'A brief, the skills it needs, a deadline', fa: 'بریف، مهارت‌های لازم و مهلت' },
    output: { en: 'A low–high range, the reasons, and how sure it is', fa: 'یه بازه‌ی کمینه تا بیشینه، دلیل‌ها و میزان اطمینان' },
    limit: { en: 'Suggests a price. You set it.', fa: 'فقط پیشنهاد می‌ده؛ قیمت نهایی رو خودت تعیین می‌کنی.' },
    plan: 'free',
    home: '/agents/merlin',
    run: [
      { step: { en: 'Reading the brief', fa: 'خوندن بریف' }, result: { en: 'Mobile app, 12 screens, 2 user roles', fa: 'اپ موبایل، ۱۲ صفحه، دو نوع کاربر' } },
      { step: { en: 'Finding similar finished projects', fa: 'پیدا کردن پروژه‌های مشابه' }, result: { en: '34 matches from the last 12 months', fa: '۳۴ مورد مشابه از ۱۲ ماه گذشته' } },
      { step: { en: 'Adjusting for deadline and level', fa: 'تنظیم بر اساس مهلت و سطح' }, result: { en: 'Tight deadline: +15%', fa: 'مهلت کوتاه: ۱۵٪ بیشتر' } },
      { step: { en: 'Writing the range', fa: 'نوشتن بازه' }, result: { en: 'Ready. The reasons are below', fa: 'آماده‌ست؛ دلیل‌ها پایین نوشته شده' } },
    ],
  },
  {
    id: 'scout',
    name: { en: 'The Scout', fa: 'پیشاهنگ' },
    role: { en: 'Finds jobs on every site', fa: 'از همه‌ی سایت‌ها برات کار پیدا می‌کنه' },
    line: {
      en: 'Checks Lance, Ponisha, Karlancer, Jobinja, LinkedIn, Upwork and Remote OK, drops the duplicates, and keeps only jobs that match your skills.',
      fa: 'لنس، پونیشا، کارلنسر، جابینجا، لینکدین، آپ‌ورک و ریموت‌اوکی رو می‌گرده، آگهی‌های تکراری رو کنار می‌ذاره و فقط کارهایی رو نگه می‌داره که به مهارت‌هات می‌خوره.',
    },
    input: { en: 'Your skills and the kind of work you want', fa: 'مهارت‌هات و نوع کاری که دنبالشی' },
    output: { en: 'One list, ranked by fit, with the source of each job', fa: 'یه فهرست، مرتب‌شده بر اساس تناسب، با منبع هر آگهی' },
    limit: { en: 'Links to the original post. Never applies for you.', fa: 'به آگهی اصلی لینک می‌ده و هیچ‌وقت به جای تو درخواست نمی‌فرسته.' },
    plan: 'free',
    home: '/work',
    run: [
      { step: { en: 'Reading your skills', fa: 'خوندن مهارت‌هات' }, result: { en: 'Figma, UI design, design systems', fa: 'فیگما، طراحی رابط، دیزاین سیستم' } },
      { step: { en: 'Checking 7 sources', fa: 'گشتن ۷ منبع' }, result: { en: '212 new posts since yesterday', fa: '۲۱۲ آگهی تازه از دیروز' } },
      { step: { en: 'Removing duplicates', fa: 'حذف موارد تکراری' }, result: { en: '41 duplicates merged', fa: '۴۱ مورد تکراری ادغام شد' } },
      { step: { en: 'Ranking by fit', fa: 'مرتب‌سازی بر اساس تناسب' }, result: { en: '18 strong matches', fa: '۱۸ مورد خیلی مرتبط' } },
    ],
  },
  {
    id: 'herald',
    name: { en: 'The Herald', fa: 'جارچی' },
    role: { en: 'Drafts your proposals', fa: 'پیش‌نویس پیشنهادت رو می‌نویسه' },
    line: {
      en: 'Turns a job post and your profile into a first draft that opens with the client’s problem and proposes one small first milestone. You edit; you send.',
      fa: 'از روی آگهی و پروفایلت یه پیش‌نویس می‌نویسه که با مشکل کارفرما شروع می‌شه و یه قدم اول کوچیک پیشنهاد می‌ده. ویرایش و فرستادنش با خودت.',
    },
    input: { en: 'A job post and your profile', fa: 'آگهی و پروفایلت' },
    output: { en: 'A proposal draft and a first milestone', fa: 'پیش‌نویس پیشنهاد و قدم اول' },
    limit: { en: 'Never sends anything. Every word is yours to change.', fa: 'هیچ‌چیزی رو خودش نمی‌فرسته؛ هر کلمه‌ش رو می‌تونی عوض کنی.' },
    plan: 'free',
    home: '/agents/herald',
    run: [
      { step: { en: 'Reading the job post', fa: 'خوندن آگهی' }, result: { en: 'They need checkout redesigned before a sale', fa: 'قبل از حراج، صفحه‌ی پرداخت رو از نو می‌خوان' } },
      { step: { en: 'Matching your work', fa: 'پیدا کردن کارهای مرتبطت' }, result: { en: '2 checkout projects in your Showcase', fa: '۲ پروژه‌ی پرداخت توی ویترینت' } },
      { step: { en: 'Proposing a first step', fa: 'پیشنهاد قدم اول' }, result: { en: 'A 3-day audit with 10 fixes', fa: 'بررسی سه‌روزه با ۱۰ پیشنهاد اصلاح' } },
      { step: { en: 'Writing the draft', fa: 'نوشتن پیش‌نویس' }, result: { en: '182 words, ready to edit', fa: '۱۸۲ کلمه، آماده‌ی ویرایش' } },
    ],
  },
  {
    id: 'smith',
    name: { en: 'The Smith', fa: 'آهنگر' },
    role: { en: 'Tailors your CV to a job', fa: 'رزومه‌ت رو برای هر آگهی آماده می‌کنه' },
    line: {
      en: 'Reads a job description, finds the skills it asks for, and reshapes your CV around the ones you really have. It never invents experience.',
      fa: 'شرح شغل رو می‌خونه، مهارت‌هایی رو که می‌خواد پیدا می‌کنه و رزومه‌ت رو حول همون‌هایی که واقعاً داری از نو می‌چینه. هیچ سابقه‌ای از خودش نمی‌سازه.',
    },
    input: { en: 'Your CV and a job description', fa: 'رزومه‌ت و شرح شغل' },
    output: { en: 'A tailored CV, a match score, and what’s missing', fa: 'رزومه‌ی هماهنگ با آگهی، درصد تطابق و چیزهایی که کمه' },
    limit: { en: 'Only rewrites what is already true about you.', fa: 'فقط چیزهایی رو بازنویسی می‌کنه که واقعاً درباره‌ت درسته.' },
    plan: 'plus',
    home: '/plus/cv',
    run: [
      { step: { en: 'Reading the job description', fa: 'خوندن شرح شغل' }, result: { en: '9 required skills, 4 nice-to-have', fa: '۹ مهارت ضروری، ۴ مهارت امتیازی' } },
      { step: { en: 'Matching your CV', fa: 'مقایسه با رزومه‌ت' }, result: { en: '7 of 9 found', fa: '۷ از ۹ پیدا شد' } },
      { step: { en: 'Reordering for this role', fa: 'چیدن دوباره برای این نقش' }, result: { en: 'Moved design-systems work to the top', fa: 'سابقه‌ی دیزاین سیستم رفت بالای رزومه' } },
      { step: { en: 'Listing the gaps', fa: 'فهرست کمبودها' }, result: { en: 'Accessibility audits, Webflow', fa: 'ممیزی دسترس‌پذیری، وب‌فلو' } },
    ],
  },
  {
    id: 'steward',
    name: { en: 'The Steward', fa: 'پیشکار' },
    role: { en: 'Runs your project, PMO-style', fa: 'مدیریت پروژه‌ت رو به عهده می‌گیره' },
    line: {
      en: 'Breaks a brief into a backlog, plans two-week sprints, writes the stand-up summary each morning and flags anything slipping before it costs you.',
      fa: 'بریف رو به فهرست کارها می‌شکنه، اسپرینت‌های دوهفته‌ای می‌چینه، هر صبح خلاصه‌ی جلسه‌ی روزانه رو می‌نویسه و هر کاری عقب بیفته رو زودتر خبر می‌ده.',
    },
    input: { en: 'A project brief and your team', fa: 'بریف پروژه و اعضای تیم' },
    output: { en: 'Backlog, sprints, daily summary, risk flags', fa: 'فهرست کارها، اسپرینت‌ها، خلاصه‌ی روزانه و هشدار ریسک' },
    limit: { en: 'Plans and reports. People make the calls.', fa: 'برنامه می‌ریزه و گزارش می‌ده؛ تصمیم با آدم‌هاست.' },
    plan: 'plus',
    home: '/plus/scrum',
    run: [
      { step: { en: 'Reading the brief', fa: 'خوندن بریف' }, result: { en: 'Online shop, 3 roles, launch in 8 weeks', fa: 'فروشگاه آنلاین، سه نقش، راه‌اندازی تا ۸ هفته' } },
      { step: { en: 'Writing epics and stories', fa: 'نوشتن اپیک‌ها و استوری‌ها' }, result: { en: '5 epics, 31 stories', fa: '۵ اپیک، ۳۱ استوری' } },
      { step: { en: 'Planning sprints', fa: 'چیدن اسپرینت‌ها' }, result: { en: '4 sprints of 2 weeks', fa: '۴ اسپرینت دوهفته‌ای' } },
      { step: { en: 'Setting the stand-up', fa: 'تنظیم جلسه‌ی روزانه' }, result: { en: 'Summary at 9:30 every weekday', fa: 'خلاصه هر روز کاری ساعت ۹:۳۰' } },
    ],
  },
  {
    id: 'scribe',
    name: { en: 'The Scribe', fa: 'کاتب' },
    role: { en: 'Writes and translates', fa: 'می‌نویسه و ترجمه می‌کنه' },
    line: {
      en: 'Drafts posts, docs and product copy, and translates between Persian and English by meaning rather than word by word.',
      fa: 'پست، مستند و متن محصول می‌نویسه و بین فارسی و انگلیسی ترجمه می‌کنه؛ معنی‌به‌معنی، نه کلمه‌به‌کلمه.',
    },
    input: { en: 'A topic, a tone, a length', fa: 'موضوع، لحن و طول متن' },
    output: { en: 'A draft in one or both languages', fa: 'پیش‌نویس به یک یا هر دو زبان' },
    limit: { en: 'Marks every claim it can’t source.', fa: 'هر ادعایی که منبع نداره رو علامت می‌زنه.' },
    plan: 'free',
    home: '/agents/scribe',
    run: [
      { step: { en: 'Reading your notes', fa: 'خوندن یادداشت‌هات' }, result: { en: 'Launch post, friendly tone', fa: 'پست معرفی، لحن صمیمی' } },
      { step: { en: 'Drafting in Persian', fa: 'نوشتن نسخه‌ی فارسی' }, result: { en: '240 words', fa: '۲۴۰ کلمه' } },
      { step: { en: 'Writing the English version', fa: 'نوشتن نسخه‌ی انگلیسی' }, result: { en: 'Rewritten, not translated', fa: 'بازنویسی شد، نه ترجمه‌ی تحت‌اللفظی' } },
      { step: { en: 'Flagging claims', fa: 'علامت زدن ادعاها' }, result: { en: '1 number needs a source', fa: 'یه عدد منبع لازم داره' } },
    ],
  },
  {
    id: 'sentinel',
    name: { en: 'The Sentinel', fa: 'نگهبان' },
    role: { en: 'Checks delivery against the brief', fa: 'تحویل رو با توافق مقایسه می‌کنه' },
    line: {
      en: 'Before money leaves escrow, compares what was delivered with what was agreed and lists anything missing, for both sides to see.',
      fa: 'قبل از این‌که پول از امانت آزاد بشه، چیزی که تحویل داده شده رو با توافق مقایسه می‌کنه و هر کمبودی رو برای هر دو طرف فهرست می‌کنه.',
    },
    input: { en: 'The brief, the milestone, the delivered files', fa: 'بریف، قدم کاری و فایل‌های تحویلی' },
    output: { en: 'A checklist: met, partly met, missing', fa: 'یه چک‌لیست: انجام شده، نیمه‌کاره، انجام نشده' },
    limit: { en: 'Advises. Only the client releases payment.', fa: 'فقط نظر می‌ده؛ آزاد کردن پول با کارفرماست.' },
    plan: 'free',
    home: '/agents/sentinel',
    run: [
      { step: { en: 'Reading the milestone', fa: 'خوندن قدم کاری' }, result: { en: '6 deliverables agreed', fa: '۶ خروجی توافق شده' } },
      { step: { en: 'Opening the files', fa: 'باز کردن فایل‌ها' }, result: { en: '14 files, 2 links', fa: '۱۴ فایل، ۲ لینک' } },
      { step: { en: 'Checking each deliverable', fa: 'بررسی تک‌تک خروجی‌ها' }, result: { en: '5 met, 1 partly met', fa: '۵ انجام شده، ۱ نیمه‌کاره' } },
      { step: { en: 'Writing the note', fa: 'نوشتن یادداشت' }, result: { en: 'Dark-mode icons are missing', fa: 'آیکون‌های حالت تیره جا مونده' } },
    ],
  },
]

export const agentById = (id: string) => agents.find((a) => a.id === id)
