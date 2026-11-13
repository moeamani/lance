import { motion } from 'motion/react'
import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight01Icon, Calendar03Icon, Clock01Icon, Share08Icon } from '@hugeicons/core-free-icons'
import { AppHeader } from '../../components/layout/AppHeader'
import { Screen } from '../../components/layout/Screen'
import { Icon, IconButton, StaggerItem, StaggerList, Tag, useToast } from '../../components/ui'
import { blogPosts } from '../../data/mock'
import { formatLongDate, formatNumber } from '../../lib/format'
import { PublicFooter } from './PublicChrome'

function Cover({ gradient, title, layoutId }: { gradient: string; title: string; layoutId: string }) {
  return (
    <motion.div layoutId={layoutId} className={`relative grid aspect-[16/9] place-items-center overflow-hidden rounded-[14px] bg-gradient-to-br ${gradient}`}>
      <div className="absolute inset-0 bg-dots opacity-40" aria-hidden />
      <span className="relative max-w-[80%] text-center text-lg font-extrabold text-white/90 drop-shadow">{title.split(' ').slice(0, 3).join(' ')}</span>
    </motion.div>
  )
}

function Meta({ minutes, date }: { minutes: number; date: string }) {
  return (
    <div className="flex items-center gap-4 text-xs text-fg-muted">
      <span className="inline-flex items-center gap-1.5">
        <Icon icon={Clock01Icon} size={16} />
        {formatNumber(minutes)} دقیقه مطالعه
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Icon icon={Calendar03Icon} size={16} />
        {formatLongDate(date)}
      </span>
    </div>
  )
}

export function BlogList() {
  return (
    <>
      <AppHeader title="بلاگ" backTo="/" />
      <Screen title="بلاگ" className="px-5">
        <StaggerList className="flex flex-col gap-4">
          {blogPosts.map((p) => (
            <StaggerItem key={p.id}>
              <Link to={`/blog/${p.id}`} className="group block rounded-[18px] border border-stroke bg-surface p-3 transition-colors hover:border-stroke-strong">
                <Cover gradient={p.gradient} title={p.title} layoutId={`cover-${p.id}`} />
                <div className="px-2 pt-4 pb-2">
                  <Tag tone="neutral">{p.tag}</Tag>
                  <h2 className="mt-3 text-lg font-extrabold leading-8">{p.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-fg-muted">{p.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <Meta minutes={p.minutes} date={p.date} />
                    <Icon icon={ArrowUpRight01Icon} size={20} className="text-fg-subtle transition-transform group-hover:-translate-y-0.5 group-hover:text-primary" directional />
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerList>
      </Screen>
      <PublicFooter />
    </>
  )
}

export function BlogPost() {
  const { id } = useParams()
  const toast = useToast()
  const post = blogPosts.find((p) => p.id === id) ?? blogPosts[0]
  const others = blogPosts.filter((p) => p.id !== post.id)
  return (
    <>
      <AppHeader
        backTo="/blog"
        actions={
          <IconButton
            icon={Share08Icon}
            label="اشتراک‌گذاری"
            onClick={async () => {
              try {
                if (navigator.share) await navigator.share({ title: post.title, url: location.href })
                else {
                  await navigator.clipboard.writeText(location.href)
                  toast.show('لینک مقاله کپی شد.')
                }
              } catch {
                /* user cancelled */
              }
            }}
          />
        }
      />
      <Screen title={post.title}>
        <article>
          <Cover gradient={post.gradient} title={post.title} layoutId={`cover-${post.id}`} />
          <Tag tone="neutral" className="mt-5">
            {post.tag}
          </Tag>
          <h1 className="mt-3 text-2xl font-extrabold leading-10">{post.title}</h1>
          <div className="mt-3">
            <Meta minutes={post.minutes} date={post.date} />
          </div>
          <div className="mt-6 flex flex-col gap-5 text-[15px] leading-8 text-fg-muted">
            <p>{post.excerpt}</p>
            <h2 className="text-lg font-extrabold text-fg">۱. با بریف شروع کنید، نه با رزومه</h2>
            <p>کارفرما ده‌ها پیشنهاد می‌خواند. اولین جمله‌ی شما باید نشان دهد بریف را دقیق خوانده‌اید: دو جزئیات مشخص از توضیحات پروژه را تکرار کنید و بگویید چطور حلشان می‌کنید.</p>
            <h2 className="text-lg font-extrabold text-fg">۲. یک مایلستون کوچک پیشنهاد بدهید</h2>
            <p>به جای قول دادن کل پروژه، یک گام اول کوچک با تعریف «انجام‌شده» واضح پیشنهاد بدهید. این ریسک کارفرما را پایین می‌آورد و در لنس، مبلغ همان مایلستون در ضمانت قرار می‌گیرد.</p>
            <blockquote className="rounded-[14px] border-s-4 border-primary bg-primary-soft p-4 text-fg">
              پیشنهادهایی که با یک مایلستون کوچک و مشخص شروع می‌شوند، معمولاً سریع‌تر پذیرفته می‌شوند.
            </blockquote>
            <h2 className="text-lg font-extrabold text-fg">۳. فقط یک نمونه‌کار مرتبط</h2>
            <p>ده لینک نفرستید. یک نمونه‌کار که دقیقاً شبیه این پروژه است، از ده نمونه‌ی نامرتبط قانع‌کننده‌تر است.</p>
          </div>
        </article>

        <h2 className="mt-12 mb-4 text-lg font-extrabold">مقاله‌های بیشتر</h2>
        <div className="flex flex-col gap-3">
          {others.map((p) => (
            <Link key={p.id} to={`/blog/${p.id}`} className="flex gap-3 rounded-[16px] border border-stroke bg-surface p-3 hover:border-stroke-strong">
              <div className={`size-20 shrink-0 rounded-[12px] bg-gradient-to-br ${p.gradient}`} />
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-bold leading-6">{p.title}</p>
                <p className="mt-1 text-xs text-fg-subtle">{formatNumber(p.minutes)} دقیقه مطالعه</p>
              </div>
            </Link>
          ))}
        </div>
      </Screen>
    </>
  )
}
