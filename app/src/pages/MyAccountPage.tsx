import { FadeIn } from '@/components/FadeIn';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, ArrowLeft, LogOut } from 'lucide-react';

interface MyAccountPageProps {
  setPage: (page: string) => void;
}

export function MyAccountPage({ setPage }: MyAccountPageProps) {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <FadeIn>
            <button
              onClick={() => setPage('Profile')}
              className="flex items-center gap-2 text-white/50 hover:text-[#E2CDB9] transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Profile
            </button>
            <div className="glass-card p-10 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#E2CDB9]/20 flex items-center justify-center">
                <User className="w-10 h-10 text-[#E2CDB9]" />
              </div>
              <h1 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--header)' }}>
                My Account
              </h1>
              <p className="text-white/60 mb-8">
                Sign in to view and manage your account details.
              </p>
              <button onClick={() => setPage('SignIn')} className="btn-gold w-full">
                Sign in
              </button>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <FadeIn>
          <button
            onClick={() => setPage('Profile')}
            className="flex items-center gap-2 text-white/50 hover:text-[#E2CDB9] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </button>
          <h1 className="text-3xl sm:text-4xl font-semibold mb-2" style={{ fontFamily: 'var(--header)' }}>
            My Account
          </h1>
          <p className="text-white/60 mb-8">
            Your account details and preferences.
          </p>
        </FadeIn>

        <FadeIn>
          <div className="glass-card p-6 sm:p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#E2CDB9]/20 flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-[#E2CDB9]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--header)' }}>{user.name}</h2>
                <p className="text-white/60 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" /> {user.email}
                </p>
              </div>
            </div>
            <div className="border-t border-white/10 pt-6">
              <p className="text-white/50 text-sm mb-4">
                Update email, password, and saved addresses in a future update.
              </p>
              <button
                onClick={() => { logout(); setPage('Profile'); }}
                className="flex items-center gap-2 px-4 py-2.5 border border-white/20 rounded-lg text-white/80 hover:border-red-500/50 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
