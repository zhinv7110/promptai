'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { type Session, type User } from '@supabase/supabase-js';
import { createBrowserSupabase } from '@/lib/supabase/browser';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signInWithOAuth: (provider: 'google' | 'apple' | 'discord' | 'github' | 'twitter') => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<{ ok: boolean; error?: string }>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthCtx = createContext<AuthState>({
  session: null, user: null, loading: true,
  signInWithOAuth: async () => {},
  signInWithMagicLink: async () => ({ ok: false }),
  signInAsGuest: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabase();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithOAuth = useCallback(async (provider: 'google' | 'apple' | 'discord' | 'github' | 'twitter') => {
    await supabase.auth.signInWithOAuth({
      provider: provider === 'twitter' ? 'twitter' : provider,
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
  }, [supabase]);

  const signInWithMagicLink = useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    });
    return error ? { ok: false, error: error.message } : { ok: true };
  }, [supabase]);

  const signInAsGuest = useCallback(async () => {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) console.error('Guest login failed:', error.message);
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  }, [supabase]);

  return (
    <AuthCtx.Provider value={{ session, user, loading, signInWithOAuth, signInWithMagicLink, signInAsGuest, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}
