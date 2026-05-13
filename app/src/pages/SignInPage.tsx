import { useState } from 'react';
import { FadeIn } from '@/components/FadeIn';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';

interface SignInPageProps {
  setPage: (page: string) => void;
  /** After successful sign-in, navigate here (default Profile) */
  returnTo?: string;
}

export function SignInPage({ setPage, returnTo = 'Profile' }: SignInPageProps) {
  const { login, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }
    if (mode === 'signup' && (password.length < 6 || confirmPassword.length < 6)) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const result = mode === 'signin'
      ? await login(email, password)
      : await signUp(email, password, confirmPassword, name);
    setLoading(false);
    if (result.success) {
      setPage(returnTo);
      window.scrollTo(0, 0);
    } else {
      setError(result.error || (mode === 'signin' ? 'Sign in failed.' : 'Sign up failed.'));
    }
  };

  const switchMode = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setError('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <FadeIn>
          <button
            onClick={() => setPage('Profile')}
            className="flex items-center gap-2 text-white/50 hover:text-[#E2CDB9] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="glass-card p-8 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-1" style={{ fontFamily: 'var(--header)' }}>
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </h1>
            <p className="text-white/60 text-sm mb-8">
              {mode === 'signin'
                ? 'Sign in to access your account, orders, and subscriptions.'
                : 'Create an account to save your details and track orders.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="input-field w-full pl-11"
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-field w-full pl-11"
                    autoComplete="email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field w-full pl-11"
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  />
                </div>
                {mode === 'signin' && (
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => setPage('ForgotPassword')}
                      className="text-sm text-[#E2CDB9] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Confirm password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-field w-full pl-11"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              )}
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold justify-center py-3 disabled:opacity-50"
              >
                {loading ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <p className="text-center text-white/50 text-sm mt-6">
              {mode === 'signin' ? (
                <>
                  Don't have an account?{' '}
                  <button type="button" onClick={() => switchMode('signup')} className="text-[#E2CDB9] hover:underline">
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button type="button" onClick={() => switchMode('signin')} className="text-[#E2CDB9] hover:underline">
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
