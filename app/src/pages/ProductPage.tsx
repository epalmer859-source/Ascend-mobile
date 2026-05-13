import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { FadeIn } from '@/components/FadeIn';
import { AscendBrandComparison } from '@/components/AscendBrandComparison';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Stars, RatingStars } from '@/components/Icons';
import { useCart } from '@/hooks/useCart';
import { products } from '@/data/products';
import { PHASE_I_INGREDIENT_SLIDES } from '@/data/phaseIIngredients';
import { getSellingPlansForHandle } from '@/lib/shopifyStorefront';
import { getUserReviews } from '@/lib/userReviews';
import { ReviewForm } from '@/components/ReviewForm';
import { ArrowLeft, ArrowRight, Check, RefreshCw, Truck, Sparkles, ChevronLeft, ChevronRight, ShoppingCart, FlaskConical, Zap, Shield, Target, Microscope, Droplets, Timer, Lock, ClipboardList, BadgeDollarSign, TrendingUp, Wind, Eye, type LucideIcon } from 'lucide-react';

const KEY_BENEFIT_ICONS: Record<string, LucideIcon> = {
  '🧪': FlaskConical,
  '⚡': Zap,
  '🛡️': Shield,
  '🎯': Target,
  '🔬': Microscope,
  '💧': Droplets,
  '🔄': RefreshCw,
  '⏱️': Timer,
  '✨': Sparkles,
  '🦠': FlaskConical,
  '🔒': Lock,
  '📋': ClipboardList,
  '💰': BadgeDollarSign,
  '📈': TrendingUp,
  '🚚': Truck,
};

interface ProductPageProps {
  productId: number;
  setPage: (page: string) => void;
}

export function ProductPage({ productId, setPage }: ProductPageProps) {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'benefits' | 'howToUse' | 'ingredients' | 'results'>('benefits');
  const [purchaseType, setPurchaseType] = useState<'subscription' | 'onetime'>('onetime');
  const [addError, setAddError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [reviewsKey, setReviewsKey] = useState(0);
  const [phaseIISlide, setPhaseIISlide] = useState(0);
  const [phaseIIBackImageError, setPhaseIIBackImageError] = useState(false);
  const [phaseIIISlide, setPhaseIIISlide] = useState(0);
  const [phaseIIIBackImageError, setPhaseIIIBackImageError] = useState(false);
  const [phaseISlide, setPhaseISlide] = useState(0);
  const [phaseIBackImageError, setPhaseIBackImageError] = useState(false);
  const [phaseISlide3ImageError, setPhaseISlide3ImageError] = useState(false);
  const [fullSystemSlide, setFullSystemSlide] = useState(0);
  const [fullSystemBackImageError, setFullSystemBackImageError] = useState(false);
  const [phaseIIngredientSlide, setPhaseIIngredientSlide] = useState(0);
  const [showFullIngredientsList, setShowFullIngredientsList] = useState(false);
  const tabScrollRef = useRef<HTMLDivElement>(null);
  const [tabScrollAtStart, setTabScrollAtStart] = useState(true);
  const [tabScrollAtEnd, setTabScrollAtEnd] = useState(false);

  const updateTabScrollEdges = useCallback(() => {
    const el = tabScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const threshold = 2;
    setTabScrollAtStart(scrollLeft <= threshold);
    setTabScrollAtEnd(scrollLeft >= scrollWidth - clientWidth - threshold);
  }, []);

  useEffect(() => {
    const el = tabScrollRef.current;
    if (!el) return;
    updateTabScrollEdges();
    el.addEventListener('scroll', updateTabScrollEdges);
    const ro = new ResizeObserver(updateTabScrollEdges);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateTabScrollEdges);
      ro.disconnect();
    };
  }, [updateTabScrollEdges, productId]);

  const product = products.find(p => p.id === productId);
  const productReviews = useMemo(
    () => (product ? [...getUserReviews(product.shortName), ...product.reviews] : []),
    [reviewsKey, product?.id]
  );

  if (!product) {
    return (
      <div className="min-h-screen pt-32 px-6 text-center">
        <h1 className="text-2xl mb-4">Product not found</h1>
        <button onClick={() => setPage('Shop')} className="btn-gold">
          Back to Shop
        </button>
      </div>
    );
  }

  const relatedProducts = product.related.map(id => products.find(p => p.id === id)).filter(Boolean);

  const currentPrice = purchaseType === 'subscription' && product.subscriptionPrice
    ? product.subscriptionPrice
    : product.price;

  const handleAddToCart = async () => {
    setAddError(null);
    setAdding(true);
    try {
      if (purchaseType === 'subscription') {
        const plans = await getSellingPlansForHandle(product.handle);
        const planId = plans[0]?.sellingPlanId;
        if (!planId) {
          setAddError('No subscription option for this product. Try one-time purchase.');
          setAdding(false);
          return;
        }
        addToCart(product, 1, { purchaseType: 'subscription', sellingPlanId: planId });
      } else {
        addToCart(product, 1, { purchaseType: 'one_time' });
      }
      setPage('Cart');
      window.scrollTo(0, 0);
    } catch (e) {
      setAddError(e instanceof Error ? e.message : 'Could not add to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={{ fontFamily: 'var(--header)' }}>
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div 
          className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{ 
            background: 'radial-gradient(ellipse, rgba(212,165,116,0.1) 0%, transparent 60%)',
            filter: 'blur(60px)'
          }}
        />

        <div className="max-w-6xl mx-auto min-w-0">
          <button 
            onClick={() => setPage('Shop')} 
            className="flex items-center gap-2 text-white hover:text-[#E2CDB9] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </button>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start relative z-10">
            {/* Product Image */}
            <FadeIn>
              <div className="relative lg:mt-8">
                {product.badge && (
                  <div className="absolute -top-4 right-10 bg-[#E2CDB9] text-black text-xs font-bold px-4 py-2 rounded-full z-10">
                    {product.badge}
                  </div>
                )}
                {purchaseType === 'subscription' && product.subscriptionEligible && (
                  <div className="absolute -top-4 left-10 bg-green-500 text-black text-xs font-bold px-4 py-2 rounded-full z-10 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> MOST POPULAR
                  </div>
                )}
                <div 
                  className="h-80 lg:h-[450px] rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden relative"
                  style={{ 
                    background: [1, 2, 3].includes(product.id) ? '#0a0a0a' : 'linear-gradient(145deg, #1a1a1a, #0a0a0a)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                  }}
                >
                  {product.id === 2 ? (
                    /* Phase II slideshow: front of tube + back placeholder (replace with your image at /phase-ii-tube-back.png) */
                    <>
                      {phaseIISlide === 0 ? (
                        <ImageWithFallback 
                          src="/phase-ii-tube.png"
                          alt={product.name}
                          className="w-full h-full object-contain absolute inset-0"
                        />
                      ) : phaseIIBackImageError ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0a]">
                          <p className="text-[#E2CDB9] text-xs tracking-[0.2em] uppercase mb-6">Back of tube</p>
                          <p className="text-white/90 text-sm font-medium mb-2">Ingredients & directions</p>
                          <p className="text-white/50 text-xs max-w-[200px]">Drop your image in the <strong className="text-white/70">app/public</strong> folder and name it <strong className="text-white/70">phase-ii-tube-back.png</strong> to see it here.</p>
                        </div>
                      ) : (
                        <ImageWithFallback 
                          src="/phase-ii-tube-back.png"
                          alt={`${product.name} - Back of tube`}
                          className="w-full h-full object-contain absolute inset-0"
                          onError={() => setPhaseIIBackImageError(true)}
                        />
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setPhaseIISlide(s => (s === 0 ? 1 : 0)); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white z-10 transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setPhaseIISlide(s => (s === 1 ? 0 : 1)); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white z-10 transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {[0, 1].map((i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setPhaseIISlide(i); }}
                            className={`w-2.5 h-2.5 rounded-full transition-colors ${phaseIISlide === i ? 'bg-[#E2CDB9]' : 'bg-white/40 hover:bg-white/60'}`}
                            aria-label={`Slide ${i + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  ) : product.id === 1 ? (
                    /* Phase I slideshow: front + back of tube */
                    <>
                      {phaseISlide === 0 ? (
                        <ImageWithFallback
                          src="/phase-i-tube.png"
                          alt={product.name}
                          className="w-full h-full object-contain absolute inset-0"
                        />
                      ) : phaseIBackImageError ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0a]">
                          <p className="text-[#E2CDB9] text-xs tracking-[0.2em] uppercase mb-6">Back of tube</p>
                          <p className="text-white/90 text-sm font-medium mb-2">Ingredients & directions</p>
                        </div>
                      ) : (
                        <ImageWithFallback
                          src="/phase-i-tube-back.png"
                          alt={`${product.name} - Back of tube`}
                          className="w-full h-full object-contain absolute inset-0"
                          onError={() => setPhaseIBackImageError(true)}
                        />
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setPhaseISlide(s => (s === 0 ? 1 : 0)); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white z-10 transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setPhaseISlide(s => (s === 1 ? 0 : 1)); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white z-10 transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {[0, 1].map((i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setPhaseISlide(i); }}
                            className={`w-2.5 h-2.5 rounded-full transition-colors ${phaseISlide === i ? 'bg-[#E2CDB9]' : 'bg-white/40 hover:bg-white/60'}`}
                            aria-label={`Slide ${i + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  ) : product.id === 3 ? (
                    /* Phase III slideshow: front + back of tube */
                    <>
                      {phaseIIISlide === 0 ? (
                        <ImageWithFallback 
                          src="/phase-iii-tube.png"
                          alt={product.name}
                          className="w-full h-full object-contain absolute inset-0"
                        />
                      ) : phaseIIIBackImageError ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0a]">
                          <p className="text-[#E2CDB9] text-xs tracking-[0.2em] uppercase mb-6">Back of tube</p>
                          <p className="text-white/90 text-sm font-medium mb-2">Ingredients & directions</p>
                        </div>
                      ) : (
                        <ImageWithFallback 
                          src="/phase-iii-tube-back.png"
                          alt={`${product.name} - Back of tube`}
                          className="w-full h-full object-contain absolute inset-0"
                          onError={() => setPhaseIIIBackImageError(true)}
                        />
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setPhaseIIISlide(s => (s === 0 ? 1 : 0)); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white z-10 transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setPhaseIIISlide(s => (s === 1 ? 0 : 1)); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white z-10 transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {[0, 1].map((i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setPhaseIIISlide(i); }}
                            className={`w-2.5 h-2.5 rounded-full transition-colors ${phaseIIISlide === i ? 'bg-[#E2CDB9]' : 'bg-white/40 hover:bg-white/60'}`}
                            aria-label={`Slide ${i + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  ) : product.id === 4 ? (
                    /* Full System slideshow: front (3 tubes) + back (3 tubes backs) */
                    <>
                      {fullSystemSlide === 0 ? (
                        <ImageWithFallback 
                          src="/ascend-full-system.png"
                          alt={product.name}
                          className="w-full h-full object-contain absolute inset-0"
                        />
                      ) : fullSystemBackImageError ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0a]">
                          <p className="text-[#E2CDB9] text-xs tracking-[0.2em] uppercase mb-6">Back of tubes</p>
                          <p className="text-white/90 text-sm font-medium">Directions & ingredients</p>
                        </div>
                      ) : (
                        <ImageWithFallback 
                          src="/ascend-full-system-back.png"
                          alt={`${product.name} - Back of tubes`}
                          className="w-full h-full object-contain absolute inset-0"
                          onError={() => setFullSystemBackImageError(true)}
                        />
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFullSystemSlide(s => (s === 0 ? 1 : 0)); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white z-10 transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFullSystemSlide(s => (s === 1 ? 0 : 1)); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 flex items-center justify-center text-white z-10 transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {[0, 1].map((i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setFullSystemSlide(i); }}
                            className={`w-2.5 h-2.5 rounded-full transition-colors ${fullSystemSlide === i ? 'bg-[#E2CDB9]' : 'bg-white/40 hover:bg-white/60'}`}
                            aria-label={`Slide ${i + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </FadeIn>

            {/* Product Info */}
            <FadeIn>
              <div className="min-w-0">
                <p className="text-[#E2CDB9] text-sm tracking-widest mb-3">{product.sub}</p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-2 leading-tight whitespace-normal lg:whitespace-nowrap break-words" style={{ fontFamily: 'var(--header)' }}>
                  {product.name}
                </h1>
                <p className="text-[#E2CDB9] italic text-lg mb-5">{product.tagline}</p>

                <div className="flex items-center gap-3 mb-5">
                  <RatingStars rating={4.6} />
                  <span className="text-[#E2CDB9] font-bold">{product.avgRating}</span>
                  <span className="text-white text-sm">(120 Verified reviews)</span>
                </div>

                <p className="text-white text-sm leading-relaxed mb-4" style={{ fontFamily: 'var(--header)' }}>{product.desc}</p>

                <ul className="space-y-2 mb-6 text-white text-sm">
                  {product.id === 2 ? (
                    <>
                      <li className="flex items-center gap-2">
                        <span className="text-[#E2CDB9]">✔</span>
                        Rebalances skin after cleansing.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#E2CDB9]">✔</span>
                        Replenishes essential hydration and lipids.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#E2CDB9]">✔</span>
                        Prepares and optimizes skin for treatment.
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-2">
                        <span className="text-[#E2CDB9]">✔</span>
                        Targets acne-causing congestion
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#E2CDB9]">✔</span>
                        Controls excess oil production
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#E2CDB9]">✔</span>
                        Prepares skin for treatment phases
                      </li>
                    </>
                  )}
                </ul>

                {product.id === 1 && (
                  <div className="hidden lg:block mt-10 mb-6">
                    <p className="text-[#E2CDB9] text-xs tracking-widest uppercase mb-2">Full ingredients</p>
                    <p className="text-white text-sm leading-relaxed">
                      Water, {PHASE_I_INGREDIENT_SLIDES.map((s, i) => (
                        <span key={i}>
                          {s.name}
                          {i < PHASE_I_INGREDIENT_SLIDES.length - 1 ? ', ' : '.'}
                        </span>
                      ))}
                    </p>
                  </div>
                )}

                {/* Purchase Type — minimal, luxury; green for Subscribe & Save */}
                {product.subscriptionEligible && (
                  <div className="mb-8">
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setPurchaseType('subscription')}
                        className={`py-4 px-5 rounded-lg border transition-all text-left ${
                          purchaseType === 'subscription'
                            ? 'border-green-500/50 bg-green-500/10'
                            : 'border-white/10 hover:border-green-500/20'
                        }`}
                      >
                        <p className="text-[9px] uppercase tracking-[0.2em] text-green-400/90 mb-1">Subscribe & Save</p>
                        <p className="text-2xl font-semibold text-green-400" style={{ fontFamily: 'var(--header)' }}>${product.subscriptionPrice}</p>
                        <p className="text-[10px] text-green-400/60 mt-0.5">per refill</p>
                      </button>
                      <button
                        onClick={() => setPurchaseType('onetime')}
                        className={`py-4 px-5 rounded-lg border transition-all text-left ${
                          purchaseType === 'onetime'
                            ? 'border-[#E2CDB9]/50 bg-[#E2CDB9]/5'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">Single purchase</p>
                        <p className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--header)' }}>${product.price}</p>
                        <p className="text-xs text-white/50 mt-0.5">one-time</p>
                      </button>
                    </div>
                    {purchaseType === 'subscription' && (
                      <p className="mt-4 text-[10px] text-green-400/80 tracking-wide">
                        Save 15% · Free shipping on refills · Pause or cancel anytime
                      </p>
                    )}
                  </div>
                )}

                <div className="hidden lg:flex items-center gap-4 mb-7">
                  <span className="text-3xl font-bold">${currentPrice}</span>
                  {purchaseType === 'subscription' && product.subscriptionPrice && (
                    <span className="text-white line-through text-xl">${product.price}</span>
                  )}
                  {product.size && <span className="text-white text-sm">{product.size}</span>}
                </div>

                {/* Add to cart */}
                <div className="mb-6">
                  <button
                    onClick={() => void handleAddToCart()}
                    disabled={adding}
                    className={`w-full flex items-center justify-center gap-3 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed ${purchaseType === 'subscription' ? 'bg-green-500 hover:bg-green-400 text-black' : 'btn-gold'}`}
                  >
                    <ShoppingCart className="w-5 h-5 flex-shrink-0" />
                    {adding ? 'Adding…' : 'Add to cart'}
                  </button>
                  {addError && <p className="text-red-400 text-sm mt-2">{addError}</p>}
                </div>

                <div className="flex gap-6 text-xs text-white">
                  <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Dermatologist-tested</span>
                  <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Cruelty-free</span>
                  <span className="flex items-center gap-1"><Check className="w-3 h-3" /> 30-day money back guarantee</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Subscribe & Save — comparison table, luxury card */}
      {product.subscriptionEligible && (
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-green-500/20">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <div
                className="rounded-[20px] overflow-hidden bg-[#0a0a0a] border border-green-500/20"
                style={{
                  boxShadow: '0 1px 0 0 rgba(74,222,128,0.08) inset, 0 24px 64px -24px rgba(0,0,0,0.5)',
                }}
              >
                <div className="text-center pt-10 sm:pt-12 pb-8 px-8 sm:px-12">
                  <h3 className="text-xl sm:text-2xl font-medium text-white tracking-[-0.02em] mb-2" style={{ fontFamily: 'var(--header)' }}>
                    Why Our Customers Choose Subscribe & Save
                  </h3>
                  <p className="text-green-400 text-sm tracking-wide">
                    Better value. Consistent results. Total control.
                  </p>
                </div>
                <div className="border-t border-green-500/20 mx-6 sm:mx-8 mb-8 sm:mb-10">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-green-500/20">
                        <th className="py-5 px-0 pr-4 text-[11px] font-medium tracking-[0.18em] text-white uppercase border-r border-white/20" style={{ fontFamily: 'var(--header)' }}>
                          One-Time Purchase
                        </th>
                        <th className="py-5 px-0 pl-4 text-[11px] font-medium tracking-[0.18em] text-green-400/80 uppercase" style={{ fontFamily: 'var(--header)' }}>
                          Subscribe & Save
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-[15px]">
                      <tr className="border-b border-green-500/15">
                        <td className="py-4 pr-4 text-white border-r border-white/20">$27 per product</td>
                        <td className="py-4 pl-4 text-green-300/90 font-medium">$23 per refill</td>
                      </tr>
                      <tr className="border-b border-green-500/15">
                        <td className="py-4 pr-4 text-white border-r border-white/20">Flexible ordering</td>
                        <td className="py-4 pl-4 text-green-300/90 font-medium">Consistent treatment schedule</td>
                      </tr>
                      <tr className="border-b border-green-500/15">
                        <td className="py-4 pr-4 text-white border-r border-white/20">Easy to forget reorders</td>
                        <td className="py-4 pl-4 text-green-300/90 font-medium">Automatic delivery (4–7 weeks)</td>
                      </tr>
                      <tr>
                        <td className="py-4 pr-4 text-white border-r border-white/20">Skincare when you remember</td>
                        <td className="py-4 pl-4 text-green-400 font-medium">Consistent treatment schedule</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Engineered for Men — Phase II only */}
      {product.id === 2 && (
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-[#E2CDB9]/10 flex items-center justify-center">
                      <Wind className="w-5 h-5 text-[#E2CDB9]" strokeWidth={1.5} />
                    </div>
                    <p className="text-[#E2CDB9] tracking-[0.3em] text-xs uppercase" style={{ fontFamily: 'var(--header)' }}>Engineered For Men</p>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-8 leading-tight" style={{ fontFamily: 'var(--header)' }}>
                    100% Film-Free.<br /><span className="text-[#E2CDB9]">Zero Evidence.</span>
                  </h2>
                  <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-8" style={{ fontFamily: 'var(--header)' }}>
                    Most moisturizers and treatments leave a visible film — that greasy, shiny, "something's on my face" look. For guys who are already sweating, working, and dealing with oily skin, that film makes everything worse.
                  </p>
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-10" style={{ fontFamily: 'var(--header)' }}>
                    We specifically formulated Phase II and Phase III to be completely film-free. They dry in seconds, leave zero residue, and create a seamless barrier of protection and treatment — without anyone ever knowing anything is on your skin.
                  </p>
                  <div className="relative h-px w-full my-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E2CDB9]/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E2CDB9]/30 to-transparent blur-sm" />
                    <div className="absolute -inset-y-1 inset-x-0 bg-gradient-to-r from-transparent via-[#E2CDB9]/15 to-transparent blur-md" />
                  </div>
                  <div className="space-y-6 mt-6">
                    {[
                      { icon: Droplets, title: 'Dries in seconds', desc: 'No waiting. No patting. Apply and move on with your day.' },
                      { icon: Eye, title: 'Completely invisible', desc: 'No shine. No film. No "skincare face." Just clean, treated skin.' },
                      { icon: Shield, title: 'Seamless protection', desc: 'Full barrier support and active treatment — without the evidence.' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#E2CDB9]/20 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ boxShadow: '0 0 12px rgba(226,205,185,0.2)' }}>
                          <item.icon className="w-5 h-5 text-[#E2CDB9]" strokeWidth={2.5} style={{ filter: 'drop-shadow(0 0 4px rgba(226,205,185,0.4))' }} />
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold mb-0.5">{item.title}</p>
                          <p className="text-white/75 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="relative h-px w-full my-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E2CDB9]/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E2CDB9]/30 to-transparent blur-sm" />
                    <div className="absolute -inset-y-1 inset-x-0 bg-gradient-to-r from-transparent via-[#E2CDB9]/15 to-transparent blur-md" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="relative w-full lg:pl-6">
                    <div className="relative rounded-xl border border-white/10 overflow-hidden">
                      <ImageWithFallback
                        src="/film-free-comparison.png"
                        alt="Visible film vs ASCEND invisible finish comparison"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-2 mt-3">
                      <p className="text-white/70 text-xs sm:text-sm tracking-[0.15em] uppercase text-center" style={{ fontFamily: 'var(--header)' }}>Visible Film</p>
                      <p className="text-[#E2CDB9] text-xs sm:text-sm tracking-[0.15em] uppercase text-center font-semibold" style={{ fontFamily: 'var(--header)' }}>ASCEND <span className="font-normal text-white/85">Invisible Finish</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Flagship Active — Phase III only */}
      {product.id === 3 && (
        <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-[var(--bg2)] relative overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.06) 0%, transparent 60%)' }}
          />
          <div className="max-w-6xl mx-auto relative z-10">
            <FadeIn>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div className="order-2 lg:order-1">
                  <p className="text-[#E2CDB9] tracking-[0.3em] text-xs uppercase mb-3" style={{ fontFamily: 'var(--header)' }}>Flagship Active</p>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-4 leading-tight" style={{ fontFamily: 'var(--header)' }}>
                    Azelaic Acid.<br /><span className="text-[#E2CDB9]">Prescription-Grade.</span>
                  </h2>
                  <p className="text-white/85 text-sm sm:text-base leading-[2.4] mb-8" style={{ textShadow: '0 0 12px rgba(226,205,185,0.2)' }}>
                    The single ingredient that separates ASCEND from everything else on the shelf. Delivered at a prescription-grade percentage — <span className="text-[#E2CDB9]" style={{ textShadow: '0 0 14px rgba(226,205,185,0.4), 0 0 30px rgba(226,205,185,0.15)' }}>the same concentration used in clinical settings.</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {[
                      { icon: Target, label: 'Kills Bacteria', desc: 'Eliminates acne-causing bacteria at the source' },
                      { icon: Shield, label: 'Neutralizes Redness', desc: 'Calms inflammation and visible irritation' },
                      { icon: Eye, label: 'Fades Marks', desc: 'Reduces post-acne hyperpigmentation over time' },
                      { icon: Zap, label: 'Transforms Skin', desc: 'Works beyond the pimple — improves tone and texture' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                        <div className="w-9 h-9 rounded-lg bg-[#E2CDB9]/20 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ boxShadow: '0 0 12px rgba(226,205,185,0.2)' }}>
                          <item.icon className="w-4 h-4 text-[#E2CDB9]" strokeWidth={2.5} style={{ filter: 'drop-shadow(0 0 4px rgba(226,205,185,0.4))' }} />
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">{item.label}</p>
                          <p className="text-white/75 text-xs leading-relaxed" style={{ textShadow: '0 0 14px rgba(226,205,185,0.4), 0 0 30px rgba(226,205,185,0.15)' }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-l-2 border-[#E2CDB9]/40 pl-4">
                    <p className="text-[#E2CDB9] text-sm italic">
                      This isn't a trace amount buried in a formula. It's the engine of the entire system.
                    </p>
                  </div>
                </div>
                <div className="order-1 lg:order-2 lg:ml-4">
                  <div className="relative rounded-xl overflow-hidden border border-white/10">
                    <ImageWithFallback
                      src="/azelaic-acid-hero.png"
                      alt="Azelaic Acid — ASCEND's flagship active ingredient"
                      className="w-full h-[350px] sm:h-[450px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-0 right-0">
                      <p className="text-[#E2CDB9] text-xs tracking-[0.3em] uppercase font-semibold text-center" style={{ fontFamily: 'var(--header)' }}>Prescription-Grade Azelaic Acid</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Tab Navigation */}
      <section className="border-t border-b border-white/10 bg-[var(--bg2)]">
        {/* Mobile: scrollable tabs + arrows */}
        <div className="lg:hidden relative flex items-stretch">
          <button
            type="button"
            onClick={() => tabScrollRef.current?.scrollBy({ left: -120, behavior: 'smooth' })}
            className={`flex-shrink-0 w-10 flex items-center justify-center text-white/70 hover:text-white border-r border-white/10 transition-opacity ${tabScrollAtStart ? 'invisible pointer-events-none' : ''}`}
            aria-label="Scroll tabs left"
            aria-hidden={tabScrollAtStart}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div
            ref={tabScrollRef}
            className="flex-1 min-w-0 overflow-x-auto scrollbar-none flex snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="flex">
              {['benefits', 'howToUse', 'ingredients', 'results'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`flex-shrink-0 snap-center px-4 py-4 text-xs tracking-widest uppercase transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-[#E2CDB9] border-[#E2CDB9]'
                      : 'text-white border-transparent hover:text-[#E2CDB9]'
                  }`}
                  style={{ fontFamily: 'var(--header)' }}
                >
                  {tab === 'howToUse' ? 'How To Use' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => tabScrollRef.current?.scrollBy({ left: 120, behavior: 'smooth' })}
            className={`flex-shrink-0 w-10 flex items-center justify-center text-white/70 hover:text-white border-l border-white/10 transition-opacity ${tabScrollAtEnd ? 'invisible pointer-events-none' : ''}`}
            aria-label="Scroll tabs right"
            aria-hidden={tabScrollAtEnd}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        {/* Desktop: centered tabs */}
        <div className="hidden lg:block max-w-6xl mx-auto">
          <div className="flex justify-center">
            {['benefits', 'howToUse', 'ingredients', 'results'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-6 sm:px-8 py-5 text-sm tracking-widest uppercase transition-all border-b-2 ${
                  activeTab === tab
                    ? 'text-[#E2CDB9] border-[#E2CDB9]'
                    : 'text-white border-transparent hover:text-[#E2CDB9]'
                }`}
                style={{ fontFamily: 'var(--header)' }}
              >
                {tab === 'howToUse' ? 'How To Use' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {activeTab === 'benefits' && (
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl mb-3" style={{ fontFamily: 'var(--header)' }}>Key Benefits</h2>
              <p className="text-[#E2CDB9] italic">Engineered for performance. Built for results.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {product.keyBenefits.map((benefit, i) => (
                <div key={i} className="glass-card text-center">
                  <div className="mb-4 flex justify-center" aria-hidden>
                  {KEY_BENEFIT_ICONS[benefit.icon] ? (
                    (() => {
                      const Icon = KEY_BENEFIT_ICONS[benefit.icon];
                      return (
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-white/30 bg-white/5 text-[var(--gold)]">
                          <Icon className="w-6 h-6 shrink-0" stroke="currentColor" />
                        </span>
                      );
                    })()
                  ) : (
                    <span className="text-4xl">{benefit.icon}</span>
                  )}
                </div>
                  <h3 className="text-lg mb-2" style={{ fontFamily: 'var(--header)' }}>{benefit.title}</h3>
                  {benefit.bullets ? (
                    <>
                      <p className="text-[#E2CDB9] text-sm italic mb-3">{benefit.desc}</p>
                      <ul className="text-white text-sm leading-relaxed space-y-1.5 text-left inline-block">
                        {benefit.bullets.map((b, bi) => (
                          <li key={bi} className="flex items-start gap-2">
                            <span className="text-[#E2CDB9] mt-0.5 shrink-0">&#x2022;</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="text-white text-sm leading-relaxed">{benefit.desc}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-16 pt-16 border-t border-white/10">
              {product.id === 2 ? (
                <div className="relative rounded-3xl overflow-hidden px-6 py-16 sm:px-12 sm:py-20" style={{ backgroundImage: 'url(/phase-ii-compare-bg.png)', backgroundSize: 'cover', backgroundPosition: '45% center' }}>
                  <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.35) 100%)' }} />
                  <div className="relative z-10 mx-auto max-w-4xl text-center mb-12 sm:mb-16">
                    <h2
                      className="mx-auto max-w-[22ch] text-balance text-[clamp(1.75rem,4.4vw,3.1rem)] font-semibold leading-[1.06] tracking-[0.11em] text-white"
                      style={{ fontFamily: 'var(--header)' }}
                    >
                      HOW WE COMPARE
                    </h2>
                    <div className="mx-auto max-w-3xl mt-4" style={{ fontFamily: 'var(--header)' }}>
                      <div className="gold-divider w-72 sm:w-[28rem] mb-6 sm:mb-8 mx-auto" aria-hidden />
                      <p className="text-2xl font-medium leading-[1.2] sm:text-3xl lg:text-4xl">
                        <span className="text-white">Same hydration.</span>{' '}
                        <span className="text-[var(--gold)]">Different physics.</span>
                      </p>
                      <p className="mx-auto mt-5 max-w-2xl text-base font-normal leading-relaxed text-white/85 sm:mt-6 sm:text-lg lg:text-xl" style={{ textShadow: '0 0 30px rgba(226,205,185,0.3), 0 0 60px rgba(226,205,185,0.15), 0 0 100px rgba(226,205,185,0.1)' }}>
                        ASCEND™ doesn't coat your face in grease and call it moisture. It uses a water-based gel system with multi-humectant hydration, barrier support, and a matte zero-residue finish — built for men who need hydration without shine, tack, or clogged pores.
                      </p>
                    </div>
                  </div>
                  <div
                    className="relative z-10 mx-auto max-w-4xl overflow-x-auto rounded-2xl border border-white/[0.1] bg-gradient-to-b from-[#141414] to-[#070707] shadow-[0_12px_48px_rgba(0,0,0,0.5)]"
                  >
                    <div className="min-w-[min(100%,380px)] sm:min-w-0">
                      <div className="grid grid-cols-[1fr_1fr] border-b border-white/10">
                        <div className="flex items-center justify-center border-r border-white/10 bg-[#0a0a0a] px-4 py-5 sm:py-6">
                          <span className="text-center text-[10px] sm:text-xs font-bold tracking-[0.18em] text-white/60 uppercase" style={{ fontFamily: 'var(--header)' }}>
                            MOST MOISTURIZERS
                          </span>
                        </div>
                        <div className="relative flex items-center justify-center overflow-hidden bg-[#0a0a0a] px-4 py-5 sm:py-6">
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--gold)]/[0.1] via-transparent to-transparent" aria-hidden />
                          <span className="relative z-[1] text-center text-[10px] sm:text-xs font-bold tracking-[0.28em] text-[#E2CDB9] uppercase" style={{ fontFamily: 'var(--header)' }}>
                            ASCEND™
                          </span>
                        </div>
                      </div>
                      {[
                        ['Greasy residue', 'Zero-grease gel finish'],
                        ['Sticky/tacky feel', 'Clean matte finish'],
                        ['Heavy oils', 'Water-based hydration'],
                        ['Shine buildup', 'No added shine'],
                        ['Basic moisture', 'Multi-humectant hydration complex'],
                        ['Barrier neglect', 'Barrier-supporting recovery blend'],
                        ['Redness ignored', 'Bisabolol redness-calming support'],
                        ['Not made for oily men', 'Built for oily, acne-prone men\'s skin'],
                      ].map(([others, ascend], i) => (
                        <div
                          key={i}
                          className={`grid grid-cols-[1fr_1fr] border-t border-white/[0.06] ${i % 2 === 0 ? 'bg-black/20' : 'bg-transparent'}`}
                        >
                          <div className="flex min-h-[56px] items-center border-r border-white/10 bg-[#0a0a0a] px-4 py-3 sm:px-6 sm:py-3.5">
                            <span className="text-[13px] sm:text-[15px] text-white/70 leading-snug" style={{ fontFamily: 'var(--header)', textShadow: '0 0 10px rgba(255,255,255,0.15)' }}>{others}</span>
                          </div>
                          <div className="flex min-h-[56px] items-center bg-[#0a0a0a] px-4 py-3 sm:px-6 sm:py-3.5">
                            <span className="text-[13px] sm:text-[15px] text-[#E2CDB9] leading-snug font-medium" style={{ fontFamily: 'var(--header)' }}>{ascend}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : product.id === 3 ? (
                <div className="relative rounded-3xl overflow-hidden px-6 py-16 sm:px-12 sm:py-20" style={{ backgroundImage: 'url(/phase-iii-compare-bg.png)', backgroundSize: 'cover', backgroundPosition: '45% center' }}>
                  <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.35) 100%)' }} />
                  <div className="relative z-10 mx-auto max-w-4xl text-center mb-10 sm:mb-12">
                    <h2
                      className="mx-auto max-w-[22ch] text-balance text-[clamp(1.25rem,3.5vw,2.2rem)] font-semibold leading-[1.06] tracking-[0.11em] text-white"
                      style={{ fontFamily: 'var(--header)' }}
                    >
                      HOW WE COMPARE
                    </h2>
                    <div className="mx-auto max-w-3xl mt-3" style={{ fontFamily: 'var(--header)' }}>
                      <div className="gold-divider w-56 sm:w-80 mb-5 sm:mb-6 mx-auto" aria-hidden />
                      <p className="text-xl font-medium leading-[1.2] sm:text-2xl lg:text-3xl">
                        <span className="text-white">Same breakouts.</span>{' '}
                        <span className="text-[var(--gold)]">Different treatment.</span>
                      </p>
                      <p className="mx-auto mt-4 max-w-2xl text-sm font-normal leading-relaxed text-white sm:mt-5 sm:text-base lg:text-lg" style={{ textShadow: '0 0 20px rgba(226,205,185,0.5), 0 0 50px rgba(226,205,185,0.25), 0 0 90px rgba(226,205,185,0.15)' }}>
                        <span className="text-[#E2CDB9] font-medium">ASCEND™ Phase III</span> targets breakouts, redness, congestion, and post-acne marks with 15% Azelaic Acid — without the harsh burn of traditional acne treatments.
                      </p>
                    </div>
                  </div>
                  <div
                    className="relative z-10 mx-auto max-w-4xl overflow-x-auto rounded-2xl border border-white/[0.1] bg-gradient-to-b from-[#141414] to-[#070707] shadow-[0_12px_48px_rgba(0,0,0,0.5)]"
                  >
                    <div className="min-w-[min(100%,380px)] sm:min-w-0">
                      <div className="grid grid-cols-[1fr_1fr] border-b border-white/10">
                        <div className="flex items-center justify-center border-r border-white/10 bg-[#0a0a0a] px-4 py-5 sm:py-6">
                          <span className="text-center text-[10px] sm:text-xs font-bold tracking-[0.18em] text-white/60 uppercase" style={{ fontFamily: 'var(--header)' }}>
                            MOST TREATMENTS
                          </span>
                        </div>
                        <div className="relative flex items-center justify-center overflow-hidden bg-[#0a0a0a] px-4 py-5 sm:py-6">
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--gold)]/[0.1] via-transparent to-transparent" aria-hidden />
                          <span className="relative z-[1] text-center text-[10px] sm:text-xs font-bold tracking-[0.28em] text-[#E2CDB9] uppercase" style={{ fontFamily: 'var(--header)' }}>
                            ASCEND™ PHASE III
                          </span>
                        </div>
                      </div>
                      {[
                        ['Harsh oxidizing actives', 'Non-oxidative acne support'],
                        ['Excess dryness', 'Barrier-conscious treatment'],
                        ['Redness ignored', 'Helps calm the look of redness'],
                        ['Dark marks left behind', 'Helps fade post-acne discoloration'],
                        ['Breakouts only', 'Breakouts + aftermath'],
                        ['Can bleach fabrics', 'No benzoyl peroxide bleaching'],
                        ['Over-strips the skin', 'Designed to support consistency'],
                        ['One-dimensional acne control', 'Acne, tone, redness, and pore support'],
                      ].map(([others, ascend], i) => (
                        <div
                          key={i}
                          className={`grid grid-cols-[1fr_1fr] border-t border-white/[0.06] ${i % 2 === 0 ? 'bg-black/20' : 'bg-transparent'}`}
                        >
                          <div className="flex min-h-[56px] items-center border-r border-white/10 bg-[#0a0a0a] px-4 py-3 sm:px-6 sm:py-3.5">
                            <span className="text-[13px] sm:text-[15px] text-white/70 leading-snug" style={{ fontFamily: 'var(--header)', textShadow: '0 0 10px rgba(255,255,255,0.15)' }}>{others}</span>
                          </div>
                          <div className="flex min-h-[56px] items-center bg-[#0a0a0a] px-4 py-3 sm:px-6 sm:py-3.5">
                            <span className="text-[13px] sm:text-[15px] text-[#E2CDB9] leading-snug font-medium" style={{ fontFamily: 'var(--header)' }}>{ascend}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <AscendBrandComparison
                  title="HOW WE COMPARE"
                  subtitle={
                    <div className="mx-auto max-w-3xl text-center" style={{ fontFamily: 'var(--header)' }}>
                      <div className="gold-divider w-72 sm:w-[28rem] mb-6 sm:mb-8" aria-hidden />
                      <p className="text-2xl font-medium leading-[1.2] sm:text-3xl lg:text-4xl">
                        <span className="text-white">Same breakouts.</span>{' '}
                        <span className="text-[var(--gold)]">Different physics.</span>
                      </p>
                      <p className="mx-auto mt-5 max-w-2xl text-base font-normal leading-relaxed text-white/65 sm:mt-6 sm:text-lg lg:text-xl">
                        ASCEND™ controls every variable that drives acne, not just the symptom on the surface.
                      </p>
                    </div>
                  }
                />
              )}
            </div>
          </FadeIn>
        )}

        {activeTab === 'howToUse' && (
          <FadeIn>
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl mb-4 lg:mb-6" style={{ fontFamily: 'var(--header)' }}>How To Use</h2>
                <div className="space-y-3 lg:space-y-4">
                  {product.howToUse.steps.map((step, i) => (
                    <div key={i} className="flex gap-3 lg:gap-4 items-start">
                      <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full border border-[#E2CDB9] flex items-center justify-center text-xs lg:text-sm text-[#E2CDB9] flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-white text-sm lg:text-base pt-0.5 lg:pt-1 leading-snug lg:whitespace-nowrap min-w-0">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div 
                className="glass-card py-4 px-4 lg:py-6 lg:px-6"
                style={{ background: 'linear-gradient(145deg, rgba(212,165,116,0.08), rgba(212,165,116,0.02))' }}
              >
                <div className="text-[#E2CDB9] text-xs tracking-widest mb-2 lg:mb-3">PRO TIP</div>
                <p className="text-white text-sm lg:text-base leading-relaxed italic">{product.howToUse.tip}</p>
              </div>
            </div>
          </FadeIn>
        )}

        {activeTab === 'ingredients' && (
          <FadeIn>
            <div className="mb-10 text-center">
              <h2 className="text-2xl sm:text-3xl mb-3" style={{ fontFamily: 'var(--header)' }}>Key Ingredients</h2>
              <p className="text-[#E2CDB9] italic">Every ingredient chosen for a specific purpose.</p>
            </div>

            {product.id === 1 ? (
              /* Phase I: ingredient slideshow + scrollable list on right */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
                {/* Left: slideshow card */}
                <div className="lg:col-span-2">
                  <div className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col">
                    {(() => {
                      const slide = PHASE_I_INGREDIENT_SLIDES[phaseIIngredientSlide];
                      const total = PHASE_I_INGREDIENT_SLIDES.length;
                      return (
                        <>
                          <div className="p-4 sm:p-6 flex flex-col">
                            <p className="text-[#E2CDB9] text-xs tracking-widest uppercase mb-2">{slide.category}</p>
                            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--header)' }}>{slide.name}</h3>
                            <div className="w-fit max-w-full mx-auto rounded-xl overflow-hidden border border-white/10 mb-3 shrink-0">
                              <ImageWithFallback
                                src={slide.image}
                                alt={slide.name}
                                className="max-h-40 sm:max-h-44 w-auto h-auto object-contain block"
                              />
                            </div>
                            <p className="text-white text-sm leading-relaxed" style={{ fontFamily: 'var(--header)' }}>{slide.description}</p>
                          </div>
                          <div className="flex items-center justify-between px-4 pb-4 shrink-0">
                            <button
                              type="button"
                              onClick={() => setPhaseIIngredientSlide(s => (s === 0 ? total - 1 : s - 1))}
                              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
                              aria-label="Previous"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="flex gap-1.5 flex-wrap justify-center">
                              {PHASE_I_INGREDIENT_SLIDES.map((_, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => setPhaseIIngredientSlide(i)}
                                  className={`w-2 h-2 rounded-full transition-colors ${phaseIIngredientSlide === i ? 'bg-[#E2CDB9]' : 'bg-white/40 hover:bg-white/60'}`}
                                  aria-label={`Slide ${i + 1}`}
                                />
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => setPhaseIIngredientSlide(s => (s === total - 1 ? 0 : s + 1))}
                              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
                              aria-label="Next"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
                {/* Right: scrollable ingredient list */}
                <div className="lg:col-span-1">
                  <div className="glass-card rounded-2xl border border-white/10 p-4">
                    <p className="text-[#E2CDB9] text-xs tracking-widest uppercase mb-3">Ingredients</p>
                    <div className="max-h-[420px] overflow-y-auto overflow-x-hidden pr-1 space-y-1 scroll-smooth">
                      {PHASE_I_INGREDIENT_SLIDES.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPhaseIIngredientSlide(i)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                            phaseIIngredientSlide === i
                              ? 'bg-[#E2CDB9]/20 border border-[#E2CDB9]/50 text-white'
                              : 'border border-transparent hover:bg-white/10 text-white/90 hover:text-white'
                          }`}
                        >
                          <span className="text-xs text-white/50 block mb-0.5">{s.category}</span>
                          <span className="text-sm font-medium">{s.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                {product.keyActives.map((active, i) => (
                  <div key={i} className="glass-card">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg" style={{ fontFamily: 'var(--header)' }}>{active.name}</h3>
                      {active.percent && <span className="text-[#E2CDB9] text-sm font-semibold">{active.percent}</span>}
                    </div>
                    <div className="gold-divider w-16 mb-3" />
                    <p className="text-white text-sm leading-relaxed">{active.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Desktop: full list always visible */}
            <div className="hidden lg:block glass-card">
              <h3 className="text-base mb-4 text-[#E2CDB9]" style={{ fontFamily: 'var(--header)' }}>FULL INGREDIENT LIST</h3>
              <p className="text-white text-sm leading-7">{product.fullIngredients}</p>
            </div>
            {/* Mobile: tap card to reveal full list */}
            <div className="lg:hidden">
              {!showFullIngredientsList ? (
                <button
                  type="button"
                  onClick={() => setShowFullIngredientsList(true)}
                  className="w-full glass-card text-left flex items-center justify-between gap-3 py-4 px-5 border border-white/10 hover:border-[#E2CDB9]/30 transition-colors"
                >
                  <h3 className="text-base text-[#E2CDB9]" style={{ fontFamily: 'var(--header)' }}>Full ingredient list</h3>
                  <ChevronRight className="w-5 h-5 text-white/60 shrink-0" />
                </button>
              ) : (
                <div className="glass-card">
                  <h3 className="text-base mb-4 text-[#E2CDB9]" style={{ fontFamily: 'var(--header)' }}>FULL INGREDIENT LIST</h3>
                  <p className="text-white text-sm leading-7">{product.fullIngredients}</p>
                </div>
              )}
            </div>
          </FadeIn>
        )}

        {activeTab === 'results' && (
          <FadeIn>
            <div className="text-center mb-12">
              <div 
                className="inline-block px-14 py-10 rounded-2xl border border-[#E2CDB9]/30"
                style={{ background: 'linear-gradient(145deg, rgba(212,165,116,0.1), rgba(212,165,116,0.02))' }}
              >
                <div className="text-6xl sm:text-7xl font-bold text-[#E2CDB9] leading-none" style={{ fontFamily: 'var(--header)' }}>
                  {product.results.stat}
                </div>
                <p className="text-white text-base mt-3">{product.results.statLabel}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {product.results.timeline.map((item, i) => (
                <div key={i} className="glass-card text-center relative">
                  {i < 3 && (
                    <div 
                      className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5"
                      style={{ background: 'linear-gradient(90deg, #E2CDB9, transparent)' }}
                    />
                  )}
                  <div className="text-[#E2CDB9] text-xs tracking-widest mb-3">{item.week}</div>
                  <p className="text-white text-sm leading-relaxed">{item.result}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        )}
      </section>

      {/* Reviews Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--bg2)] border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl mb-3" style={{ fontFamily: 'var(--header)' }}>Customer Reviews</h2>
            <div className="flex items-center justify-center gap-3">
              <RatingStars rating={4.6} />
              <span className="text-[#E2CDB9] text-2xl font-bold">{product.avgRating}</span>
              <span className="text-white">Based on {productReviews.length} reviews</span>
            </div>
          </FadeIn>

          <div className="max-w-md mx-auto mb-10 flex justify-center">
            <ReviewForm product={product.shortName} compact onSubmitted={() => setReviewsKey((k) => k + 1)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {productReviews.slice(0, 6).map((review) => (
              <FadeIn key={review.id}>
                <div className="glass-card h-full flex flex-col">
                  <div className="flex justify-between mb-3">
                    <div>
                      <strong className="text-sm">{review.name}</strong>
                      {review.verified && <span className="text-xs text-[#E2CDB9] ml-2">✓ Verified</span>}
                    </div>
                    <span className="text-xs text-white">{review.time}</span>
                  </div>
                  <Stars count={review.star} />
                  {review.title && (
                    <p className="text-white/90 text-sm mt-3 font-medium">{review.title}</p>
                  )}
                  <p className="text-white text-sm leading-relaxed mt-3">{review.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          {productReviews.length > 6 && (
            <div className="text-center mt-8">
              <button 
                onClick={() => { setPage('Reviews'); window.scrollTo(0,0); }}
                className="btn-outline"
              >
                See All {productReviews.length} Reviews <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-10">
            <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--header)' }}>Complete Your Routine</h2>
            <p className="text-[#E2CDB9] italic">Products that work better together.</p>
            <p className="lg:hidden text-[#E2CDB9] text-xs mt-3 flex items-center justify-center gap-1.5 opacity-80">
              Swipe to explore <ArrowRight className="w-3.5 h-3.5" />
            </p>
          </FadeIn>

          <div 
            className="flex lg:grid lg:grid-cols-3 overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none gap-4 lg:gap-6 pb-4 scrollbar-none -mx-4 px-6 sm:-mx-6 sm:px-8 lg:mx-auto lg:px-0 scroll-pl-6 sm:scroll-pl-8"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {relatedProducts.map((related, i) => related && (
              <div 
                key={i}
                className="flex flex-shrink-0 w-[80vw] sm:w-[400px] lg:w-auto snap-start lg:snap-align-none"
              >
                <FadeIn className="w-full flex">
                  <div 
                    className="w-full glass-card flex flex-col cursor-pointer hover:border-[#E2CDB9]/30 transition-colors"
                    onClick={() => { setPage(`Product:${related.id}`); window.scrollTo(0,0); }}
                  >
                  <div 
                    className="aspect-[3/4] w-full rounded-lg border border-white/10 mb-4 overflow-hidden flex items-center justify-center"
                    style={{ background: [1, 2, 3].includes(related.id) ? '#0a0a0a' : 'linear-gradient(to bottom right, #1a1a1a, #0a0a0a)' }}
                  >
                    {[1, 2, 3].includes(related.id) ? (
                      <ImageWithFallback
                        src={`/phase-${related.id === 1 ? 'i' : related.id === 2 ? 'ii' : 'iii'}-tube.png`}
                        alt={related.name}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : related.id === 4 ? (
                      <ImageWithFallback
                        src="/ascend-full-system.png"
                        alt={related.name}
                        className="w-full h-full object-contain object-center"
                        style={{ background: '#000', transform: 'scale(1.28)' }}
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-xs tracking-widest font-bold" style={{ fontFamily: 'var(--header)' }}>ASCEND</div>
                        <div className="text-base text-[#E2CDB9] mt-1" style={{ fontFamily: 'var(--header)' }}>{related.shortName}</div>
                      </div>
                    )}
                  </div>
                  <h3 className="text-base mb-1" style={{ fontFamily: 'var(--header)' }}>{related.name}</h3>
                  <p className="text-[#E2CDB9] text-sm">${related.price}</p>
                  {related.subscriptionEligible && (
                    <p className="text-green-400 text-[10px] mt-1 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> or ${related.subscriptionPrice}/refill
                    </p>
                  )}
                </div>
              </FadeIn>
            </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
