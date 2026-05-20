'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { Sparkles, Mail, ArrowRight, Loader2, User } from 'lucide-react';

const OAUTH_PROVIDERS = [
  { id: 'google' as const, label: 'Google', icon: () => <span className="text-lg">G</span>, color: 'hover:bg-red-50 dark:hover:bg-red-950/30' },
  { id: 'github' as const, label: 'GitHub', icon: () => <span className="text-lg font-bold">GH</span>, color: 'hover:bg-zinc-100 dark:hover:bg-zinc-800' },
  { id: 'discord' as const, label: 'Discord', icon: () => <span className="text-lg">D</span>, color: 'hover:bg-indigo-50 dark:hover:bg-indigo-950/30' },
  { id: 'apple' as const, label: 'Apple', icon: () => <span className="text-lg">A</span>, color: 'hover:bg-zinc-100 dark:hover:bg-zinc-800' },
  { id: 'twitter' as const, label: 'X', icon: () => <span className="text-lg font-bold">X</span>, color: 'hover:bg-zinc-100 dark:hover:bg-zinc-800' },
];

export default function LoginPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const { signInWithOAuth, signInWithMagicLink, signInAsGuest, user, loading } = useAuth();
  const isZh = locale === 'zh';
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      router.replace(`/${locale}/dashboard`);
    }
  }, [loading, user, locale, router]);

  if (loading || user) {
    return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-zinc-400" /></div>;
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const result = await signInWithMagicLink(email);
    setBusy(false);
    if (result.ok) setSent(true);
    else setError(result.error || 'Failed');
  };

  const handleGuest = async () => {
    await signInAsGuest();
    router.push(`/${locale}/dashboard`);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-zinc-400" /></div>;
  }

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-2xl font-bold">
            <Sparkles className="h-7 w-7 text-indigo-500" />
            <span className="gradient-text">PromptAI</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {isZh ? '登录' : 'Sign in'}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">{isZh ? '选择登录方式' : 'Choose a sign-in method'}</p>
        </div>

        <div className="space-y-3">
          {/* OAuth buttons */}
          {OAUTH_PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => signInWithOAuth(p.id)}
              className={`w-full flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-3.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:shadow-md transition-all ${p.color}`}
            >
              <p.icon />
              {isZh ? '使用' : 'Continue with'} {p.label}
            </button>
          ))}

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200 dark:border-zinc-800" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white dark:bg-zinc-950 px-3 text-zinc-400">{isZh ? '或' : 'or'}</span></div>
          </div>

          {/* Email magic link */}
          <form onSubmit={handleMagicLink} className="space-y-3">
            {sent ? (
              <div className="rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4 text-sm text-green-700 dark:text-green-400 text-center">
                <Mail className="h-5 w-5 mx-auto mb-2" />
                {isZh ? '链接已发送！请检查邮箱' : 'Magic link sent! Check your email'}
              </div>
            ) : (
              <>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder={isZh ? 'your@email.com' : 'your@email.com'}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button type="submit" disabled={busy || !email}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 px-5 py-3 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                  {isZh ? '发送魔法链接' : 'Send Magic Link'}
                </button>
              </>
            )}
          </form>

          {/* Guest */}
          <button onClick={handleGuest}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 px-5 py-3 text-sm font-medium text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <User className="h-4 w-4" />
            {isZh ? '游客模式' : 'Continue as Guest'}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          {isZh ? '没有账号？' : "Don't have an account?"}{' '}
          <Link href={`/${locale}/register`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
            {isZh ? '注册' : 'Register'}
          </Link>
        </p>
      </div>
    </div>
  );
}
