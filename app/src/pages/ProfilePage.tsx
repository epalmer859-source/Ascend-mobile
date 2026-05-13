import { useState, lazy, Suspense } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { FadeIn } from '@/components/FadeIn';
import { User, RefreshCw, Package, Settings, ChevronRight, Mail } from 'lucide-react';

const SubscriptionsPage = lazy(() => import('@/pages/SubscriptionsPage').then((m) => ({ default: m.SubscriptionsPage })));

interface ProfilePageProps {
  setPage: (page: string) => void;
}

export function ProfilePage({ setPage }: ProfilePageProps) {
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  const { subscriptions } = useCart();
  const { user } = useAuth();
  const activeCount = subscriptions.filter((s) => s.status === 'active').length;

  if (showSubscriptions) {
    return (
      <Suspense fallback={<div className="pt-32 pb-20 px-4 flex justify-center"><div className="w-8 h-8 border-2 border-[#E2CDB9] border-t-transparent rounded-full animate-spin" /></div>}>
        <SubscriptionsPage
          setPage={setPage}
          onBack={() => setShowSubscriptions(false)}
        />
      </Suspense>
    );
  }

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <FadeIn>
          <h1 className="text-3xl sm:text-4xl font-semibold mb-2" style={{ fontFamily: 'var(--header)' }}>
            Profile
          </h1>
          <p className="text-white/60 mb-8">
            Manage your account, subscriptions, and orders.
          </p>
        </FadeIn>

        {/* My Account / Sign in */}
        <FadeIn>
          <button
            onClick={() => setPage(user ? 'MyAccount' : 'SignIn')}
            className="w-full glass-card mb-6 flex items-center justify-between gap-4 p-5 text-left hover:border-[#E2CDB9]/40 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#E2CDB9]/20 flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-[#E2CDB9]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--header)' }}>My Account</h2>
                {user ? (
                  <p className="text-white/60 text-sm">{user.name} · {user.email}</p>
                ) : (
                  <p className="text-white/60 text-sm">Sign in to see your details and order history.</p>
                )}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-[#E2CDB9] flex-shrink-0" />
          </button>
        </FadeIn>

        {/* Profile sections */}
        <div className="space-y-4">
          {/* My Subscriptions */}
          <FadeIn>
            <button
              onClick={() => setShowSubscriptions(true)}
              className="w-full glass-card flex items-center justify-between gap-4 p-5 text-left hover:border-[#E2CDB9]/40 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--header)' }}>My Subscriptions</h3>
                  <p className="text-white/60 text-sm">
                    {activeCount > 0
                      ? `${activeCount} active — manage refills and notifications`
                      : 'Manage your refill schedule and save on every order'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-[#E2CDB9] flex-shrink-0" />
            </button>
          </FadeIn>

          {/* Order History */}
          <FadeIn>
            <button
              onClick={() => setPage('OrderHistory')}
              className="w-full glass-card flex items-center justify-between gap-4 p-5 text-left hover:border-[#E2CDB9]/40 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-[#E2CDB9]" />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--header)' }}>Order History</h3>
                  <p className="text-white/60 text-sm">View past orders and track shipments</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-[#E2CDB9] flex-shrink-0" />
            </button>
          </FadeIn>

          {/* Account Details */}
          <FadeIn>
            <button
              onClick={() => setPage('MyAccount')}
              className="w-full glass-card flex items-center justify-between gap-4 p-5 text-left hover:border-[#E2CDB9]/40 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Settings className="w-6 h-6 text-white/60" />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--header)' }}>Account Details</h3>
                  <p className="text-white/60 text-sm">Email, password, and saved addresses</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-[#E2CDB9] flex-shrink-0" />
            </button>
          </FadeIn>

          {/* Contact / Support */}
          <FadeIn>
            <button
              onClick={() => setPage('Contact')}
              className="w-full glass-card flex items-center justify-between gap-4 p-5 text-left hover:border-[#E2CDB9]/40 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#E2CDB9]" />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--header)' }}>Contact & Support</h3>
                  <p className="text-white/60 text-sm">Get in touch or reach customer care</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-[#E2CDB9] flex-shrink-0" />
            </button>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
