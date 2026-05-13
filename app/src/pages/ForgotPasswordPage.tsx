import { useState } from 'react';
import { FadeIn } from '@/components/FadeIn';
import { Mail, ArrowLeft, Check } from 'lucide-react';

interface ForgotPasswordPageProps {
  setPage: (page: string) => void;
}

export function ForgotPasswordPage({ setPage }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    setLoading(true);
    // In production, call your API to send a password-reset email.
    // Example: await fetch('/api/forgot-password', { method: 'POST', body: JSON.stringify({ email: trimmed }) });
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <FadeIn>
            <button
              onClick={() => setPage('SignIn')}
              className="flex items-center gap-2 text-white/50 hover:text-[#E2CDB9] transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Sign in
            </button>
            <div className="glass-card p-8 sm:p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--header)' }}>
                Check your email
              </h1>
              <p className="text-white/60 text-sm mb-8">
                If an account exists for <span className="text-white/80">{email}</span>, we've sent instructions to reset your password. You'll receive a new password or a reset link via email—check your inbox and spam folder.
              </p>
              <button onClick={() => setPage('SignIn')} className="btn-gold w-full">
                Back to Sign in
              </button>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <FadeIn>
          <button
            onClick={() => setPage('SignIn')}
            className="flex items-center gap-2 text-white/50 hover:text-[#E2CDB9] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign in
          </button>
          <div className="glass-card p-8 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-1" style={{ fontFamily: 'var(--header)' }}>
              Forgot password?
            </h1>
            <p className="text-white/60 text-sm mb-8">
              Enter the email address for your account and we'll send you a new password via email.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold justify-center py-3 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Email me a new password'}
              </button>
            </form>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
