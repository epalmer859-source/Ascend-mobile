import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { FadeIn } from '@/components/FadeIn';
// Subscription management page
import { RefreshCw, Mail, Phone, Bell, Play, Pause, X, Check, Package, Clock, Calendar, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import type { Subscription } from '@/types';

interface SubscriptionsPageProps {
  setPage: (page: string) => void;
  /** When provided (e.g. embedded in Profile), Back button calls this instead of setPage('Profile') */
  onBack?: () => void;
}

// Demo subscriptions for initial view
const demoSubscriptions: Subscription[] = [
  {
    id: 'SUB-ABC123',
    product: {
      id: 4,
      title: "The Full System",
      variantId: "52974558019797",
      handle: "ascend-complete-acne-control-system",
      name: "The Full System",
      shortName: "The Full System",
      tagline: "Complete 3-Phase Acne Control.",
      price: 62,
      subscriptionPrice: 55,
      size: "3 Total",
      sub: "All Three Phases",
      desc: "The complete ASCEND experience.",
      heroGradient: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
      subscriptionEligible: true,
      subscriptionInterval: 5,
      keyBenefits: [],
      howToUse: { steps: [], tip: "" },
      fullIngredients: "",
      keyActives: [],
      results: { timeline: [], stat: "", statLabel: "" },
      reviews: [],
      avgRating: "4.9",
      related: []
    },
    quantity: 1,
    startDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), // 5 weeks ago
    nextRefillDate: new Date().toISOString(), // Today
    status: 'active',
    notificationMethod: 'email',
    email: 'john@example.com',
    refillRequested: true,
    refillResponseDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
  },
  {
    id: 'SUB-XYZ789',
    product: {
      id: 1,
      title: "Phase I — Core Acne Cleanser",
      variantId: "53325545832661",
      handle: "ascend-phase-i-core-acne-cleanser",
      name: "Phase I — Core Acne Cleanser",
      shortName: "Phase I",
      tagline: "The Foundation of Clear Skin",
      price: 22,
      subscriptionPrice: 19,
      size: "",
      sub: "ASCEND™ Active Complex",
      desc: "Deep pore cleansing with 2% Salicylic Acid.",
      heroGradient: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
      subscriptionEligible: true,
      subscriptionInterval: 5,
      keyBenefits: [],
      howToUse: { steps: [], tip: "" },
      fullIngredients: "",
      keyActives: [],
      results: { timeline: [], stat: "", statLabel: "" },
      reviews: [],
      avgRating: "4.8",
      related: []
    },
    quantity: 1,
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // ~8 weeks ago
    nextRefillDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    status: 'active',
    notificationMethod: 'both',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    refillRequested: false,
    lastRefillDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export function SubscriptionsPage({ setPage, onBack }: SubscriptionsPageProps) {
  const { subscriptions, pauseSubscription, resumeSubscription, cancelSubscription, respondToRefill } = useCart();
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);
  const [responseSuccess, setResponseSuccess] = useState<string | null>(null);

  // Use demo subscriptions if none exist
  const displaySubscriptions = subscriptions.length > 0 ? subscriptions : demoSubscriptions;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleRefillResponse = (subId: string, response: 'refill' | 'delay') => {
    respondToRefill(subId, response);
    setResponseSuccess(response === 'refill' ? 'Refill confirmed! Your order will ship soon.' : 'No problem! We\'ll check back with you in 7 days.');
    setTimeout(() => setResponseSuccess(null), 5000);
  };

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <button onClick={onBack ?? (() => setPage('Profile'))} className="flex items-center gap-2 text-white/50 hover:text-[#E2CDB9] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> {onBack ? 'Back' : 'Back to Profile'}
          </button>
          <h1 className="text-3xl sm:text-4xl font-semibold mb-2" style={{ fontFamily: 'var(--header)' }}>
            Your Subscriptions
          </h1>
          <p className="text-white/60 mb-8">
            Manage your refill schedule and notification preferences.
          </p>
        </FadeIn>

        {/* Success Message */}
        {responseSuccess && (
          <FadeIn>
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <p className="text-green-400">{responseSuccess}</p>
            </div>
          </FadeIn>
        )}

        {/* Active Refill Requests */}
        {displaySubscriptions.filter(s => s.refillRequested && s.status === 'active').length > 0 && (
          <FadeIn>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--header)' }}>
                <AlertCircle className="w-5 h-5 text-[#E2CDB9]" />
                Refill Requests
              </h2>
              
              {displaySubscriptions.filter(s => s.refillRequested && s.status === 'active').map((sub) => (
                <div key={sub.id} className="glass-card border-[#E2CDB9]/50 mb-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-lg border border-[#E2CDB9]/30 flex items-center justify-center">
                        <span className="text-xs text-[#E2CDB9]" style={{ fontFamily: 'var(--header)' }}>{sub.product.shortName}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{sub.product.name}</h3>
                        {sub.product.size && <p className="text-white/60 text-sm">{sub.product.size}</p>}
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-[#E2CDB9]" />
                          <span className="text-[#E2CDB9] text-sm">
                            {getDaysRemaining(sub.refillResponseDeadline!)} days to respond
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleRefillResponse(sub.id, 'delay')}
                        className="px-6 py-3 border border-white/20 text-white rounded-lg hover:border-white/50 transition-all text-sm font-medium"
                      >
                        Not Ready
                      </button>
                      <button
                        onClick={() => handleRefillResponse(sub.id, 'refill')}
                        className="px-6 py-3 bg-[#E2CDB9] text-black rounded-lg hover:bg-[#E8C49A] transition-all text-sm font-medium flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Refill Now — ${(sub.product.subscriptionPrice || sub.product.price) * sub.quantity}
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-white/60 text-sm">
                      <strong className="text-white/80">What happens next?</strong>
                      <br />
                      • <span className="text-[#E2CDB9]">"Refill Now"</span> — We'll process payment and ship immediately
                      <br />
                      • <span className="text-white/80">"Not Ready"</span> — We'll ask again in 7 days
                      <br />
                      • <span className="text-white/50">No response</span> — We'll ship automatically in {getDaysRemaining(sub.refillResponseDeadline!)} days
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* All Subscriptions */}
        <FadeIn>
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--header)' }}>
            All Subscriptions
          </h2>
        </FadeIn>

        {displaySubscriptions.length === 0 ? (
          <FadeIn>
            <div className="glass-card text-center py-12">
              <RefreshCw className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--header)' }}>No Active Subscriptions</h3>
              <p className="text-white/60 mb-6">Subscribe to your favorite products and never run out.</p>
              <button onClick={() => setPage('Shop')} className="btn-gold">
                Browse Products <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </FadeIn>
        ) : (
          <div className="space-y-4">
            {displaySubscriptions.map((sub) => (
              <FadeIn key={sub.id}>
                <div className={`glass-card ${sub.status === 'paused' ? 'opacity-70' : ''} ${sub.status === 'cancelled' ? 'opacity-50' : ''}`}>
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-lg border border-white/10 flex items-center justify-center">
                        <span className="text-xs text-[#E2CDB9]" style={{ fontFamily: 'var(--header)' }}>{sub.product.shortName}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{sub.product.name}</h3>
                          {sub.status === 'active' && !sub.refillRequested && (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">Active</span>
                          )}
                          {sub.status === 'paused' && (
                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Paused</span>
                          )}
                          {sub.status === 'cancelled' && (
                            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">Cancelled</span>
                          )}
                        </div>
                        {(sub.product.size || sub.quantity > 1) && (
                          <p className="text-white/60 text-sm">
                            {sub.product.size ? `${sub.product.size} × ${sub.quantity}` : `Qty: ${sub.quantity}`}
                          </p>
                        )}
                        <p className="text-green-400 text-sm font-medium">
                          ${(sub.product.subscriptionPrice || sub.product.price) * sub.quantity} / refill
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    {sub.status === 'active' && !sub.refillRequested && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => pauseSubscription(sub.id)}
                          className="p-2 border border-white/20 rounded-lg hover:border-white/50 transition-all"
                          title="Pause Subscription"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowCancelConfirm(sub.id)}
                          className="p-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                          title="Cancel Subscription"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    {sub.status === 'paused' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => resumeSubscription(sub.id)}
                          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all text-sm font-medium flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" /> Resume
                        </button>
                        <button
                          onClick={() => setShowCancelConfirm(sub.id)}
                          className="p-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                          title="Cancel Subscription"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                        <Calendar className="w-3 h-3" /> Started
                      </div>
                      <p className="text-sm">{formatDate(sub.startDate)}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                        <RefreshCw className="w-3 h-3" /> Refill Every
                      </div>
                      <p className="text-sm">{sub.product.subscriptionInterval} weeks</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                        <Package className="w-3 h-3" /> Next Refill
                      </div>
                      <p className={`text-sm ${sub.refillRequested ? 'text-[#E2CDB9]' : ''}`}>
                        {sub.refillRequested ? 'Waiting for your response' : formatDate(sub.nextRefillDate)}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                        {sub.notificationMethod === 'email' && <Mail className="w-3 h-3" />}
                        {sub.notificationMethod === 'sms' && <Phone className="w-3 h-3" />}
                        {sub.notificationMethod === 'both' && <Bell className="w-3 h-3" />}
                        Notifications
                      </div>
                      <p className="text-sm capitalize">{sub.notificationMethod === 'both' ? 'Email & Text' : sub.notificationMethod}</p>
                    </div>
                  </div>

                  {/* Cancel Confirmation */}
                  {showCancelConfirm === sub.id && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-white/80 text-sm mb-3">
                        Are you sure you want to cancel this subscription? You'll need to create a new subscription to resume refills.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => cancelSubscription(sub.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm"
                        >
                          Yes, Cancel
                        </button>
                        <button
                          onClick={() => setShowCancelConfirm(null)}
                          className="px-4 py-2 border border-white/20 rounded-lg hover:border-white/50 transition-all text-sm"
                        >
                          Keep Subscription
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        )}

        {/* How Subscriptions Work */}
        <FadeIn className="mt-12">
          <div className="glass-card">
            <h3 className="text-lg font-semibold mb-6" style={{ fontFamily: 'var(--header)' }}>
              How ASCEND Subscriptions Work
            </h3>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#E2CDB9]/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#E2CDB9] font-bold">1</span>
                </div>
                <h4 className="font-medium mb-2">Subscribe</h4>
                <p className="text-white/60 text-sm">Choose Subscribe & Save at checkout. Save 10-15% on every refill.</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#E2CDB9]/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#E2CDB9] font-bold">2</span>
                </div>
                <h4 className="font-medium mb-2">Get Notified</h4>
                <p className="text-white text-sm">After 5 weeks, we'll notify you via email, text, or both.</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#E2CDB9]/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#E2CDB9] font-bold">3</span>
                </div>
                <h4 className="font-medium mb-2">You Decide</h4>
                <p className="text-white/60 text-sm">5 days to respond: "Refill Now", "Not Ready", or we'll ship automatically.</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#E2CDB9]/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#E2CDB9] font-bold">4</span>
                </div>
                <h4 className="font-medium mb-2">Stay in Control</h4>
                <p className="text-white/60 text-sm">Pause, resume, or cancel anytime from this page.</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
