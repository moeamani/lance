import {
  AiMagicIcon,
  Briefcase01Icon,
  Camera01Icon,
  ChartLineData01Icon,
  CodeIcon,
  CustomerSupportIcon,
  EyeIcon,
  GlobeIcon,
  LaptopIcon,
  Megaphone01Icon,
  MusicNote01Icon,
  Note01Icon,
  PaintBoardIcon,
  PenTool03Icon,
  SeoIcon,
  SmartPhone01Icon,
  LanguageSkillIcon,
  UserGroupIcon,
  Video01Icon,
  VideoReplayIcon,
} from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '../components/ui/Icon'

export type Category = { slug: string; title: string; short: string; icon: IconSvgElement; blurb: string }

/** Service categories — the 10 category landings in «01 · Public / Landing». */
export const categories: Category[] = [
  { slug: 'web', title: 'توسعه وب‌سایت', short: 'وب‌سایت', icon: GlobeIcon, blurb: 'از لندینگ ساده تا فروشگاه و پنل‌های پیچیده، با برنامه‌نویس‌های بررسی‌شده.' },
  { slug: 'app', title: 'توسعه اپلیکیشن', short: 'اپلیکیشن', icon: SmartPhone01Icon, blurb: 'اپ اندروید، iOS و کراس‌پلتفرم؛ از MVP تا انتشار در استورها.' },
  { slug: 'ui', title: 'طراحی رابط کاربری', short: 'UI/UX', icon: LaptopIcon, blurb: 'تحقیق کاربر، وایرفریم و رابط‌های تمیز که تبدیل می‌سازند.' },
  { slug: 'seo', title: 'سئو', short: 'سئو', icon: SeoIcon, blurb: 'سئو فنی، محتوایی و لینک‌سازی برای دیده شدن در گوگل.' },
  { slug: 'filming', title: 'فیلم‌برداری', short: 'فیلم‌برداری', icon: Video01Icon, blurb: 'تیزر تبلیغاتی، مستند برند و پوشش رویداد.' },
  { slug: 'editing', title: 'تدوین', short: 'تدوین', icon: VideoReplayIcon, blurb: 'تدوین ریلز، یوتیوب و تیزر با رنگ‌بندی و صداگذاری.' },
  { slug: 'photography', title: 'عکاسی', short: 'عکاسی', icon: Camera01Icon, blurb: 'عکاسی محصول، پرتره و صنعتی با تحویل سریع.' },
  { slug: 'scenario', title: 'سناریو نویسی', short: 'سناریو', icon: Note01Icon, blurb: 'ایده‌پردازی و سناریو برای تیزر، انیمیشن و شبکه‌های اجتماعی.' },
  { slug: 'branding', title: 'هویت بصری', short: 'برندینگ', icon: EyeIcon, blurb: 'لوگو، رنگ، تایپوگرافی و راهنمای برند یکپارچه.' },
  { slug: 'motion', title: 'انیمیشن', short: 'موشن', icon: AiMagicIcon, blurb: 'موشن‌گرافیک، اینفوگرافیک متحرک و انیمیشن دوبعدی.' },
]

/** Skill taxonomy — «مهارت هاتون رو به ما بگید» (Add Skill flow). */
export const skillGroups: { id: string; title: string; icon: IconSvgElement; skills: string[] }[] = [
  { id: 'design', title: 'طراحی و گرافیک', icon: PaintBoardIcon, skills: ['طراحی رابط کاربری', 'تجربه کاربری', 'طراحی لوگو', 'تصویرسازی', 'طراحی پوستر', 'موشن گرافیک'] },
  { id: 'web', title: 'طراحی وب و برنامه‌نویسی', icon: CodeIcon, skills: ['React', 'Next.js', 'Vue', 'وردپرس', 'Laravel', 'Django', 'Node.js'] },
  { id: 'dev', title: 'برنامه‌نویسی', icon: LaptopIcon, skills: ['Python', 'Flutter', 'Kotlin', 'Swift', 'Go', 'هوش مصنوعی'] },
  { id: 'content', title: 'تولید محتوا', icon: PenTool03Icon, skills: ['کپی‌رایتینگ', 'مقاله‌نویسی', 'سناریو نویسی', 'ویراستاری'] },
  { id: 'seo', title: 'سئو', icon: ChartLineData01Icon, skills: ['سئو فنی', 'سئو محتوایی', 'لینک‌سازی'] },
  { id: 'social', title: 'مدیریت شبکه‌های اجتماعی', icon: UserGroupIcon, skills: ['اینستاگرام', 'لینکدین', 'تولید ریلز'] },
  { id: 'video', title: 'ویدئو و تدوین', icon: Video01Icon, skills: ['تدوین', 'فیلم‌برداری', 'رنگ‌بندی', 'صداگذاری'] },
  { id: 'marketing', title: 'بازاریابی دیجیتال', icon: Megaphone01Icon, skills: ['تبلیغات گوگل', 'ایمیل مارکتینگ', 'استراتژی محتوا'] },
  { id: 'translate', title: 'ترجمه و زبان', icon: LanguageSkillIcon, skills: ['ترجمه انگلیسی', 'ترجمه عربی', 'ترجمه ترکی'] },
  { id: 'admin', title: 'امور اداری و پشتیبانی', icon: CustomerSupportIcon, skills: ['ورود اطلاعات', 'پشتیبانی مشتری', 'دستیار مجازی'] },
  { id: 'finance', title: 'مهارت‌های مالی و کسب‌وکار', icon: Briefcase01Icon, skills: ['حسابداری', 'مدل کسب‌وکار', 'تحلیل مالی'] },
  { id: 'music', title: 'هنر و موسیقی', icon: MusicNote01Icon, skills: ['آهنگسازی', 'میکس و مستر', 'گویندگی'] },
]

export const allSkills = skillGroups.flatMap((g) => g.skills)

export const cities = ['تهران', 'اصفهان', 'شیراز', 'مشهد', 'تبریز', 'کرج', 'رشت', 'یزد', 'دورکاری (همه شهرها)']

export const projectTypes = [
  { value: 'ui', label: 'طراحی رابط کاربری', icon: LaptopIcon },
  { value: 'web', label: 'توسعه وب‌سایت', icon: GlobeIcon },
  { value: 'app', label: 'توسعه اپلیکیشن', icon: SmartPhone01Icon },
  { value: 'branding', label: 'هویت بصری', icon: EyeIcon },
  { value: 'video', label: 'ویدئو و تدوین', icon: Video01Icon },
  { value: 'content', label: 'تولید محتوا', icon: PenTool03Icon },
  { value: 'seo', label: 'سئو', icon: SeoIcon },
]
