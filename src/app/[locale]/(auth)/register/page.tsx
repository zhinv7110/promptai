'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

const OAUTH_PROVIDERS = [
  { id: 'google' as const, label: 'Google', icon: () => <span className="text-lg">G</span> },
  { id: 'github' as const, label: 'GitHub', icon: () => <span className="text-lg">GH</span> },
  { id: 'discord' as const, label: 'Discord', icon: () => <span className="text-lg">D</span> },
];

export default function RegisterPage() {
  const { locale } = useParams<{ locale: string }>();
  const { signInWithOAuth } = useAuth();
  const isZh = locale === 'zh';

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-2xl font-bold">
            <Sparkles className="h-7 w-7 text-indigo-500" />
            <span className="gradient-text">PromptAI</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{isZh ? '注册' : 'Register'}</h1>
          <p className="mt-1 text-sm text-zinc-500">{isZh ? '创建账号，开始收藏提示词' : 'Create an account to save prompts'}</p>
        </div>
        <div className="space-y-3">
          {OAUTH_PROVIDERS.map((p) => (
            <button key={p.id} onClick={() => signInWithOAuth(p.id)}
              className="w-full flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-3.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:shadow-md transition-all">
              <span className="text-lg mr-1"><p.icon /></span>{isZh ? '使用' : 'Sign up with'} {p.label}
            </button>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-zinc-400">
          {isZh ? '已有账号？' : 'Already have an account?'}{' '}
          <Link href={`/${locale}/login`} className="text-indigo-600 dark:text-indigo-400 hover:underline">{isZh ? '登录' : 'Sign in'}</Link>
        </p>
      </div>
    </div>
  );
}
