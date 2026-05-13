import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FadeIn } from '@/components/FadeIn';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { RatingStars } from '@/components/Icons';
import { useCart } from '@/hooks/useCart';
import { getSellingPlansForHandle } from '@/lib/shopifyStorefront';
import { products, ALL_REVIEWS } from '@/data/products';
import { ArrowRight, ShoppingCart, X } from 'lucide-react';

interface ShopPageProps {
  setPage: (page: string) => void;
  /** When true, render as a section on Home scroll (less top padding) */
  embedded?: boolean;
}

export function ShopPage({ setPage, embedded }: ShopPageProps) {
  const { addToCart } = useCart();
  const [purchaseChoiceProductId, setPurchaseChoiceProductId] = useState<number | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const getReviewCount = (shortName: string) =>
    ALL_REVIEWS.filter((r) => r.product === shortName).length;
  const purchaseChoiceProduct = products.find((p) => p.id === purchaseChoiceProductId) ?? null;

  useEffect(() => {
    if (purchaseChoiceProductId != null) {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [purchaseChoiceProductId]);

  const handleChoosePurchaseType = async (isSubscription: boolean) => {
    if (!purchaseChoiceProduct) return;
    if (isSubscription) {
      setSubscriptionError(null);
      setSubscriptionLoading(true);
      try {
        const plans = await getSellingPlansForHandle(purchaseChoiceProduct.handle);
        const planId = plans[0]?.sellingPlanId;
        if (!planId) {
          setSubscriptionError('No subscription option for this product. Try the product page.');
          setSubscriptionLoading(false);
          return;
        }
        addToCart(purchaseChoiceProduct, 1, {
          purchaseType: 'subscription',
          sellingPlanId: planId,
        });
        setPurchaseChoiceProductId(null);
        setPage('Cart');
        window.scrollTo(0, 0);
      } catch (e) {
        setSubscriptionError(
          e instanceof Error ? e.message : 'Could not load subscription. Try again.'
        );
      } finally {
        setSubscriptionLoading(false);
      }
      return;
    }
    addToCart(purchaseChoiceProduct, 1, { purchaseType: 'one_time' });
    setPurchaseChoiceProductId(null);
    setPage('Cart');
    window.scrollTo(0, 0);
  };

  return (
    <div id={embedded ? 'shop' : undefined} className={`${embedded ? 'pt-6 sm:pt-8' : 'pt-32'} pb-20 px-4 sm:px-6 lg:px-8`}>
      {/* Header */}
      <FadeIn className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-3" style={{ fontFamily: 'var(--header)' }}>
          Shop
        </h2>
        <p className="text-[#E2CDB9] text-lg font-normal" style={{ fontFamily: 'var(--header)' }}>
          Designed to bring men their confidence back.
        </p>
        <p className="lg:hidden text-[#E2CDB9] text-xs mt-3 flex items-center justify-center gap-1.5 opacity-80">
          Swipe to explore products <ArrowRight className="w-3.5 h-3.5" />
        </p>
      </FadeIn>

      {/* Products Grid */}
      <div 
        className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none gap-4 lg:gap-6 max-w-7xl mx-auto mb-10 pb-4 scrollbar-none -mx-4 px-6 sm:-mx-6 sm:px-8 lg:mx-auto lg:px-0 scroll-pl-6 sm:scroll-pl-8"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {products.map((product, i) => (
          <div 
            key={product.id}
            className="flex flex-shrink-0 w-[80vw] sm:w-[400px] lg:w-auto snap-start lg:snap-align-none"
          >
            <FadeIn 
              delay={i * 0.08} 
              direction="scale"
              className="w-full flex"
            >
              <div 
                className="w-full glass-card flex flex-col relative group cursor-pointer hover:border-[#E2CDB9]/50 transition-all p-4 sm:p-5"
              onClick={() => { setPage(`Product:${product.id}`); window.scrollTo(0,0); }}
            >
              {/* Badges */}
              <div className="absolute top-3 left-3 right-3 flex justify-between z-10">
                {product.id === 4 && (
                  <span className="px-2 py-1 bg-[#E2CDB9] text-black text-[10px] font-bold rounded-full">
                    BEST VALUE
                  </span>
                )}
                {product.id === 4 && product.subscriptionEligible && (
                  <span className="px-2 py-1 bg-green-500 text-black text-[10px] font-bold rounded-full flex items-center gap-1 ml-auto">
                    SAVE ${product.price - (product.subscriptionPrice || 0)}
                  </span>
                )}
              </div>

              {/* Product Image — cropped to fit */}
              <div 
                className="aspect-[3/4] w-full rounded-lg border border-white/10 mb-4 overflow-hidden flex items-center justify-center transition-all group-hover:border-[#E2CDB9]/50"
                style={{ background: [1, 2, 3].includes(product.id) ? '#0a0a0a' : 'linear-gradient(to bottom right, #1a1a1a, #0a0a0a)' }}
              >
                {[1, 2, 3].includes(product.id) ? (
                  <ImageWithFallback 
                    src={`/phase-${product.id === 1 ? 'i' : product.id === 2 ? 'ii' : 'iii'}-tube.png`} 
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                ) : product.id === 4 ? (
                  <ImageWithFallback
                    src="/ascend-full-system.png"
                    alt={product.name}
                    className="w-full h-full object-contain object-center"
                    style={{ background: '#000', transform: 'scale(1.28)' }}
                  />
                ) : (
                  <div className="text-center p-2">
                    <div className="text-xs tracking-widest font-bold" style={{ fontFamily: 'var(--header)' }}>ASCEND</div>
                    <div className="text-base text-[#E2CDB9] mt-1" style={{ fontFamily: 'var(--header)' }}>{product.shortName}</div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              {[1, 2, 3].includes(product.id) && (
                <p className="text-[#E2CDB9] text-xs uppercase tracking-[0.2em] mb-1">
                  {product.id === 1 && 'Clear'}
                  {product.id === 2 && 'Restore'}
                  {product.id === 3 && 'Treat'}
                </p>
              )}
              <h3 
                className="text-lg font-medium mb-0.5 leading-snug"
                style={{ fontFamily: 'var(--header)' }}
              >
                {product.name}
              </h3>
              {[1, 2, 3].includes(product.id) ? (
                <p className="text-[#E2CDB9] text-sm italic mb-1 leading-relaxed">
                  {product.id === 1 && 'Salicylic Acid + Sulfur Complex'}
                  {product.id === 2 && '5% Niacinamide + Advanced Hydration Complex'}
                  {product.id === 3 && '15% Azelaic + Zinc PCA'}
                </p>
              ) : (
                <>
                  <p className="text-[#E2CDB9] text-sm italic mb-1">{product.sub}</p>
                  {product.id !== 4 && (
                    <p className="text-white text-sm mb-1 leading-relaxed line-clamp-2">{product.desc.split('.')[0]}.</p>
                  )}
                </>
              )}
              {product.size && <p className="text-white/50 text-xs mb-3">{product.size}</p>}

              <div className="flex items-center gap-2 mb-1">
                <RatingStars rating={4.6} />
                <span className="text-xs text-white/60">({getReviewCount(product.shortName)})</span>
              </div>
              <div className="text-center mb-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); setPage(`Product:${product.id}`); window.scrollTo(0,0); }}
                  className="text-[11px] text-white/50 underline hover:text-white transition-colors"
                >
                  Write a review
                </button>
              </div>

              {/* Pricing */}
              <div className="mt-auto">
                {product.subscriptionEligible && product.subscriptionPrice ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl font-bold text-green-400">${product.subscriptionPrice}</span>
                      <span className="text-xs text-green-400/90">refill (Subscribe & Save)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white">${product.price}</span>
                      <span className="text-xs text-white/50">single</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xl font-bold">${product.price}</span>
                )}
                
                {/* Add to cart + View Details */}
                <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPurchaseChoiceProductId(product.id);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#E2CDB9]/10 border border-[#E2CDB9]/40 text-[#E2CDB9] text-sm font-medium hover:bg-[#E2CDB9]/20 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4 flex-shrink-0" /> Add to cart
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setPage(`Product:${product.id}`); window.scrollTo(0, 0); }}
                    className="w-full text-[#E2CDB9] text-sm flex items-center justify-center gap-1 py-1.5 hover:underline"
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              </div>
            </FadeIn>
          </div>
        ))}
      </div>

      {/* Subscribe & Save — marketing depiction (headline + 4-column grid) */}
      <FadeIn>
        <div className="max-w-5xl mx-auto">
          <div 
            className="glass-card border-white/20 mt-2 sm:mt-4"
            style={{ boxShadow: '0 0 60px rgba(255, 255, 255, 0.08), 0 0 120px rgba(255, 255, 255, 0.04)' }}
          >
            <div className="text-center py-6 sm:py-8 px-4 sm:px-8">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-normal text-green-400 tracking-tight leading-tight mb-3" style={{ fontFamily: 'var(--header)' }}>
                Subscribe & Save
              </p>
              <p className="text-white text-sm sm:text-base mb-6" style={{ fontFamily: 'var(--header)' }}>
                ASCEND's signature service for consistency.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6 pt-6 sm:pt-8 border-t border-white/5 max-w-3xl mx-auto">
                <div className="space-y-2">
                  <p className="text-white text-[10px] uppercase tracking-[0.2em]">Price</p>
                  <p className="text-green-400 text-sm font-medium">Save 15%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-white text-[10px] uppercase tracking-[0.2em]">Consistent routine</p>
                  <p className="text-green-400 text-sm font-medium">Stay on a steady treatment schedule</p>
                </div>
                <div className="space-y-2">
                  <p className="text-white text-[10px] uppercase tracking-[0.2em]">Delivery</p>
                  <p className="text-green-400 text-sm font-medium">4–7 weeks</p>
                </div>
                <div className="space-y-2">
                  <p className="text-white text-[10px] uppercase tracking-[0.2em]">Control</p>
                  <p className="text-green-400 text-sm font-medium">Pause or cancel</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-green-400/90 text-base tracking-wide mt-5 sm:mt-6" style={{ fontFamily: 'var(--header)' }}>
            Better value. Consistent results. Total control.
          </p>
        </div>
      </FadeIn>

      {/* Purchase Choice Modal — portaled to body so it's always viewport-centered */}
      {purchaseChoiceProduct && createPortal(
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          onClick={() => { setPurchaseChoiceProductId(null); setSubscriptionError(null); }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden />
          <div
            className="relative w-full max-w-md rounded-xl border border-white/15 bg-[#0b0b0b] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { setPurchaseChoiceProductId(null); setSubscriptionError(null); }}
              className="absolute top-3 right-3 text-white/60 hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--header)' }}>
              Choose purchase type
            </h3>
            <p className="text-white/70 text-sm mb-5">{purchaseChoiceProduct.name}</p>

            {subscriptionError && (
              <p className="text-red-400 text-sm mb-3">{subscriptionError}</p>
            )}
            {purchaseChoiceProduct.subscriptionEligible && purchaseChoiceProduct.subscriptionPrice ? (
              <div className="space-y-3">
                <button
                  onClick={() => void handleChoosePurchaseType(true)}
                  disabled={subscriptionLoading}
                  className="w-full rounded-lg border border-green-500/40 bg-green-500/10 p-4 text-left hover:bg-green-500/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-medium text-sm">Subscribe & Save</span>
                    <span className="text-green-400 font-bold text-sm">${purchaseChoiceProduct.subscriptionPrice}</span>
                  </div>
                  <p className="text-green-300/80 text-[10px] mt-1">
                    {subscriptionLoading ? 'Loading…' : 'Added as subscription; choose frequency at checkout.'}
                  </p>
                </button>

                <button
                  onClick={() => void handleChoosePurchaseType(false)}
                  disabled={subscriptionLoading}
                  className="w-full rounded-lg border border-[#E2CDB9]/40 bg-[#E2CDB9]/10 p-4 text-left hover:bg-[#E2CDB9]/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[#E2CDB9] font-medium">Buy Single Time</span>
                    <span className="text-[#E2CDB9] font-bold">${purchaseChoiceProduct.price}</span>
                  </div>
                  <p className="text-white/60 text-xs mt-1">One-time purchase</p>
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleChoosePurchaseType(false)}
                className="w-full rounded-lg border border-[#E2CDB9]/40 bg-[#E2CDB9]/10 p-4 text-left hover:bg-[#E2CDB9]/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#E2CDB9] font-medium">Buy Single Time</span>
                  <span className="text-[#E2CDB9] font-bold">${purchaseChoiceProduct.price}</span>
                </div>
              </button>
            )}
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
