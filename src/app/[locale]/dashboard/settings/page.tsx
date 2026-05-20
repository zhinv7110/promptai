'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Settings, User, Mail, Globe, Moon } from 'lucide-react';

export default function SettingsPage() {
  const { locale } = useParams<{ locale: string }>();
  const { user } = useAuth();
  const isZh = locale === 'zh';

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">{isZh ? '账户设置' : 'Account Settings'}</h1>

      <div className="space-y-6 max-w-2xl">
        {/* Profile */}
        <div className="glass rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4"><User className="h-4 w-4" />{isZh ? '个人资料' : 'Profile'}</h2>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {user?.email?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">{user?.email || (isZh ? '游客' : 'Guest')}</p>
              <p className="text-sm text-zinc-500">{user?.id?.slice(0, 8)}...</p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="glass rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4"><Settings className="h-4 w-4" />{isZh ? '偏好设置' : 'Preferences'}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"><Globe className="h-4 w-4" />{isZh ? '语言' : 'Language'}</div>
              <select defaultValue={locale} className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-1.5 text-sm">
                <option value="en">English</option><option value="zh">中文</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"><Moon className="h-4 w-4" />{isZh ? '主题' : 'Theme'}</div>
              <select defaultValue="system" className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-1.5 text-sm">
                <option value="system">{isZh ? '跟随系统' : 'System'}</option><option value="light">{isZh ? '浅色' : 'Light'}</option><option value="dark">{isZh ? '深色' : 'Dark'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="glass rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4"><Mail className="h-4 w-4" />{isZh ? '邮箱' : 'Email'}</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{user?.email || (isZh ? '游客模式' : 'Guest mode')}</p>
        </div>
      </div>
    </div>
  );
}
