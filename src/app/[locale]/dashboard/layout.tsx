'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { LayoutDashboard, Heart, Clock, FolderOpen, Settings, LogOut, Sparkles, Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const isZh = locale === 'zh';

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/${locale}/login`);
    }
  }, [loading, user, locale, router]);

  if (loading || !user) {
    return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-zinc-400" /></div>;
  }

  const links = [
    { href: `/${locale}/dashboard`, icon: LayoutDashboard, label: isZh ? '概览' : 'Overview' },
    { href: `/${locale}/dashboard/favorites`, icon: Heart, label: isZh ? '收藏' : 'Favorites' },
    { href: `/${locale}/dashboard/history`, icon: Clock, label: isZh ? '历史' : 'History' },
    { href: `/${locale}/dashboard/collections`, icon: FolderOpen, label: isZh ? '合集' : 'Collections' },
    { href: `/${locale}/dashboard/settings`, icon: Settings, label: isZh ? '设置' : 'Settings' },
  ];

  return (
    <div className="flex -mx-4 sm:-mx-6 lg:-mx-8 min-h-[calc(100vh-8rem)]">
      {/* Sidebar */}
      <aside className="hidden md:block w-56 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <Link href={`/${locale}/dashboard`} className="flex items-center gap-2 font-bold">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <span className="text-sm">Dashboard</span>
          </Link>
        </div>
        <div className="p-3 space-y-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 font-medium' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                <l.icon className="h-4 w-4" />{l.label}
              </Link>
            );
          })}
        </div>
        <div className="absolute bottom-4 left-4">
          <button onClick={async () => { await signOut(); router.push(`/${locale}`); }} className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-red-500 transition-colors">
            <LogOut className="h-4 w-4" />{isZh ? '登出' : 'Sign out'}
          </button>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex justify-around py-2">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link key={l.href} href={l.href} className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'}`}>
              <l.icon className="h-5 w-5" />{l.label}
            </Link>
          );
        })}
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6 pb-20 md:pb-6">{children}</main>
    </div>
  );
}
