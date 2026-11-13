import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft01Icon, Call02Icon, InstagramIcon, Linkedin01Icon, NewTwitterIcon, TelegramIcon } from '@hugeicons/core-free-icons'
import { Icon, ListGroup, ListRow, Logo } from '../../components/ui'
import { fadeUp } from '../../lib/motion'
import { toFaDigits } from '../../lib/format'

/** Reveal-on-scroll section wrapper used on public pages. */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

/** «خدمات برتر لنس» style heading with the brand word highlighted. */
export function SectionTitle({ children, sub, className }: { children: ReactNode; sub?: ReactNode; className?: string }) {
  return (
    <div className={`text-center ${className ?? ''}`}>
      <h2 className="text-balance text-2xl font-extrabold leading-10">{children}</h2>
      {sub && <p className="mx-auto mt-2 max-w-[320px] text-sm leading-6 text-fg-muted">{sub}</p>}
    </div>
  )
}

export const Brand = ({ children = 'لنس' }: { children?: ReactNode }) => <span className="text-primary">{children}</span>

export function PublicTopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stroke/40 bg-bg/80 px-5 backdrop-blur-md">
      <Link to="/" aria-label="لنس — صفحه اصلی">
        <Logo height={26} />
      </Link>
      <nav className="flex items-center gap-1 text-sm">
        <Link to="/blog" className="rounded-[10px] px-3 py-2 text-fg-muted hover:bg-white-soft hover:text-fg">
          بلاگ
        </Link>
        <Link to="/auth/login" className="rounded-[10px] border border-stroke px-3 py-2 font-bold hover:border-stroke-strong">
          ورود
        </Link>
      </nav>
    </header>
  )
}

export function PublicFooter() {
  return (
    <footer className="mt-16 border-t border-stroke/60 px-5 pt-10 pb-12">
      <Logo height={36} />
      <p className="mt-5 text-sm leading-7 text-fg-muted">
        <Brand /> پلتفرم فریلنسینگ و دورکاری برای همکاری با بهترین فریلنسرهای ایران است. در لنس می‌توانید هر نوع پروژه‌ای را برون‌سپاری کنید یا به‌عنوان فریلنسر انجام دهید؛
        از برنامه‌نویسی و طراحی سایت تا تولید محتوا، عکاسی، طراحی گرافیک و ادیت ویدیو.
      </p>
      <p className="mt-3 text-sm font-bold text-primary">در لنس، مسیر همکاری آنلاین ساده، امن و سریع می‌شود.</p>

      <ListGroup className="mt-8">
        <ListRow to="/projects/new" title="برای کارفرماها" />
        <ListRow to="/auth/signup" title="برای لنسرها" />
        <ListRow to="/app/settings/about" title="درباره ما" />
        <ListRow to="/app/messages/c3" title="تماس با ما" />
      </ListGroup>

      <div className="mt-8 flex flex-col gap-6">
        <div>
          <p className="text-sm text-fg-muted">
            صفحه رسمی <Brand /> رو دنبال کنید!
          </p>
          <div className="mt-3 flex gap-2">
            {[
              { icon: InstagramIcon, label: 'اینستاگرام' },
              { icon: NewTwitterIcon, label: 'ایکس' },
              { icon: Linkedin01Icon, label: 'لینکدین' },
              { icon: TelegramIcon, label: 'تلگرام' },
            ].map((s) => (
              <a key={s.label} href="#" aria-label={s.label} className="grid size-11 place-items-center rounded-[12px] border border-stroke bg-surface text-fg-muted transition-colors hover:border-primary hover:text-primary">
                <Icon icon={s.icon} size={20} />
              </a>
            ))}
          </div>
        </div>
        <a href="tel:+989123858118" className="flex items-center gap-3 text-sm">
          <Icon icon={Call02Icon} size={20} className="text-fg-muted" />
          <span dir="ltr" className="tabular">
            {toFaDigits('+98 912 385 8118')}
          </span>
        </a>
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-stroke/60 pt-6 text-xs text-fg-subtle">
        <span>© {new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' }).format(new Date())} لنس — همه حقوق محفوظ است.</span>
        <span dir="ltr">
          Powered by <span className="font-bold text-warning">Syntex</span>
        </span>
      </div>
    </footer>
  )
}

export function ArrowCta({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-1 text-sm font-bold text-primary">
      {children}
      <Icon icon={ArrowLeft01Icon} size={18} className="transition-transform group-hover:-translate-x-1" />
    </Link>
  )
}
