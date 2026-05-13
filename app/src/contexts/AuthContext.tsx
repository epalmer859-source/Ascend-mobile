import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { api } from '@/api/client';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export type AuthResult = { success: true; user: AuthUser } | { success: false; error: string };

interface AuthContextType {
  user: AuthUser | null;
  isLoaded: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, confirmPassword: string, name: string) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toAuthUser(u: { id: string; email: string; name?: string }): AuthUser {
  return {
    id: u.id,
    email: u.email,
    name: u.name ?? u.email.split('@')[0] ?? 'Customer',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    api.getMe().then(({ data, status }) => {
      if (status === 200 && data?.user) {
        setUser(toAuthUser(data.user));
      } else {
        setUser(null);
      }
      setIsLoaded(true);
    });
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !password) {
      return { success: false, error: 'Email and password are required.' };
    }
    const { data, error, status } = await api.login({ email: trimmed, password });
    if (status >= 400 || error) {
      return { success: false, error: error || 'Sign in failed.' };
    }
    const me = await api.getMe();
    if (me.status === 200 && me.data?.user) {
      const authUser = toAuthUser(me.data.user);
      setUser(authUser);
      return { success: true, user: authUser };
    }
    if (data?.user) {
      const authUser = toAuthUser(data.user);
      setUser(authUser);
      return { success: true, user: authUser };
    }
    return { success: false, error: 'Invalid response from server.' };
  }, []);

  const signUp = useCallback(async (
    email: string,
    password: string,
    confirmPassword: string,
    name: string
  ): Promise<AuthResult> => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !password) {
      return { success: false, error: 'Email and password are required.' };
    }
    if (password !== confirmPassword) {
      return { success: false, error: 'Password and confirm password do not match.' };
    }
    const { data, error, status } = await api.register({
      email: trimmed,
      password,
      confirmPassword,
      name: (name || '').trim() || undefined,
    });
    if (status >= 400 || error) {
      return { success: false, error: error || 'Sign up failed.' };
    }
    // Establish session so getMe works (backend does not set cookie on register)
    const loginRes = await api.login({ email: trimmed, password });
    if (loginRes.status >= 400 || loginRes.error) {
      return { success: false, error: loginRes.error || 'Account created but sign-in failed.' };
    }
    const me = await api.getMe();
    if (me.status === 200 && me.data?.user) {
      const authUser = toAuthUser(me.data.user);
      setUser(authUser);
      return { success: true, user: authUser };
    }
    if (data?.user) {
      const authUser = toAuthUser(data.user);
      setUser(authUser);
      return { success: true, user: authUser };
    }
    return { success: false, error: 'Invalid response from server.' };
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoaded, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
