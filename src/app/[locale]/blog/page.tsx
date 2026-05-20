import { getBlogPosts } from '@/lib/data';
import { use } from 'react';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Props = { params: Promise<{ locale: string }> };

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const isZh = locale === 'zh';
  const posts = await getBlogPosts(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          {isZh ? '博客' : 'Blog'}
        </h1>
        <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          {isZh
            ? 'AI 艺术提示词技巧、教程和行业洞察'
            : 'AI art prompt tips, tutorials, and industry insights'}
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-500">{isZh ? '暂无文章' : 'No posts yet'}</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const title = isZh ? post.title_zh : post.title_en;
            const excerpt = isZh ? post.excerpt_zh : post.excerpt_en;
            return (
              <Link
                key={post.slug}
                href={`/${locale}/blog/${post.slug}`}
                className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
              >
                <div className="h-40 bg-gradient-to-br from-indigo-400 via-purple-400 to-cyan-400 dark:from-indigo-600 dark:via-purple-600 dark:to-cyan-600 flex items-center justify-center">
                  {post.featured_image ? (
                    <img src={post.featured_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl opacity-30">
                      {post.tags?.includes('beginner') || post.tags?.includes('入门') ? '🌱' : post.tags?.includes('advanced') || post.tags?.includes('进阶') ? '🚀' : '🎨'}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mb-3">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {post.date?.split('T')[0] || ''}
                    </span>
                    {post.tags && post.tags.length > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <Tag className="h-3 w-3" /> {post.tags[0]}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {title}
                  </h2>
                  {excerpt && (
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">{excerpt}</p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {isZh ? '阅读更多' : 'Read more'} <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
