'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FileText, BookOpen, Upload, LogOut, Menu, X, Sparkles } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('admin_token')) setAuthed(true);
    setReady(true);
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) });
    const d = await r.json();
    setBusy(false);
    if (d.ok) { localStorage.setItem('admin_token', d.token); setAuthed(true); }
    else setErr(locale === 'zh' ? '密码错误' : 'Wrong password');
  };

  if (!ready) return null;
  if (!authed) {
    return (
      <div className="flex items-center justify-center py-24">
        <form onSubmit={login} className="w-full max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
          <div className="text-center mb-6">
            <Sparkles className="mx-auto h-10 w-10 text-indigo-500" />
            <h1 className="mt-3 text-xl font-bold">PromptAI Admin</h1>
          </div>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder={locale === 'zh' ? '管理密码' : 'Password'} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 mb-3" autoFocus />
          {err && <p className="text-sm text-red-500 mb-3">{err}</p>}
          <button type="submit" disabled={busy || !pw} className="w-full rounded-xl bg-zinc-900 dark:bg-zinc-50 px-4 py-3 text-sm font-semibold text-white dark:text-zinc-900 disabled:opacity-50">{busy ? '...' : locale === 'zh' ? '登录' : 'Login'}</button>
        </form>
      </div>
    );
  }

  const links = [
    { href: `/${locale}/admin`, icon: LayoutDashboard, label: locale === 'zh' ? '仪表盘' : 'Dashboard' },
    { href: `/${locale}/admin/prompts`, icon: FileText, label: locale === 'zh' ? '提示词' : 'Prompts' },
    { href: `/${locale}/admin/blog`, icon: BookOpen, label: locale === 'zh' ? '博客' : 'Blog' },
    { href: `/${locale}/admin/import`, icon: Upload, label: locale === 'zh' ? '导入' : 'Import' },
  ];

  const logout = () => { localStorage.removeItem('admin_token'); setAuthed(false); };

  return (
    <div className="flex -m-6 min-h-[calc(100vh-8rem)]">
      {/* Sidebar */}
      <aside className="hidden md:block w-56 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <Link href={`/${locale}/admin`} className="flex items-center gap-2 text-lg font-bold">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">Admin</span>
          </Link>
        </div>
        <nav className="p-3 space-y-1">
          {links.map(l => {
            const active = l.href === pathname || (l.href !== `/${locale}/admin` && pathname.startsWith(l.href));
            return (
              <Link key={l.href} href={l.href} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${active ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 font-medium' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                <l.icon className="h-4 w-4" />{l.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4">
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-red-500 transition-colors"><LogOut className="h-4 w-4" />{locale === 'zh' ? '退出' : 'Logout'}</button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebar && <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebar(false)}><div className="absolute left-0 top-0 h-full w-56 bg-white dark:bg-zinc-950" onClick={e => e.stopPropagation()}><aside>{/* mini sidebar */}</aside></div></div>}

      {/* Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="md:hidden mb-4"><button onClick={() => setSidebar(true)} className="p-1"><Menu className="h-5 w-5" /></button></div>
        {children}
      </main>
    </div>
  );
}
