import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FadeIn } from '@/components/FadeIn';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Stars, RatingStars } from '@/components/Icons';
import { getUserReviews } from '@/lib/userReviews';
import { ALL_REVIEWS, avgRating } from '@/data/products';
// Images removed - using external URLs instead
import { ArrowRight, X, CircleHelp, FlaskConical, BadgeCheck, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { ShopPage } from '@/pages/ShopPage';

interface HomePageProps {
  setPage: (page: string) => void;
}

const modalData = [
  {
    title: "Heat, Sweat, & Occlusion",
    text: "Phase I clears sweat, oil, and buildup with BHA + Sulfur, while Phase II restores hydration with a matte water-based gel that dries clean without grease, tack, or extra film.",
    icon: "bicep"
  },
  {
    title: "Bacteria & Inflammation",
    text: "Phase I Sulfur and Phase III 15% Azelaic Acid help target acne-causing bacteria and inflammation without relying on the harsh burn of benzoyl peroxide.",
    icon: "bacteria"
  },
  {
    title: "Excess Oil & Clogged Pores",
    text: "Phase I uses oil-soluble BHA to target pore-level buildup, Sulfur to help control oil, and Phase II to hydrate without adding shine or residue.",
    icon: "bottle"
  },
  {
    title: "Redness & Irritation",
    text: "Phase II uses Bisabolol and barrier-focused humectants to calm visible irritation, while Phase III Azelaic Acid helps reduce the look of redness and post-acne marks.",
    icon: "nosymbol"
  },
];

const PROTOCOL_CARDS = [
  { img: "https://raw.githubusercontent.com/epalmer859-source/Photos/main/acne-1%5B1%5D.png", title: "Heat, Sweat, & Occlusion", items: ["Competitive athletes", "High-volume lifters", "Labor-heavy jobs", "Prolonged workouts"] },
  { img: "https://raw.githubusercontent.com/epalmer859-source/Photos/main/acne-2%5B1%5D.png", title: "Bacteria and Inflammation", items: ["Acne that never fully clears", "Cycles of flare-ups", "Aggressive bulking phases", "Barriers compromised by irritation"] },
  { img: "https://raw.githubusercontent.com/epalmer859-source/Photos/main/acne-3%5B2%5D.png", title: "Excess Oil and Clogged Pores", items: ["Men with naturally oily skin", "Hormonal imbalances", "Breakouts that never fully clear", "Texture that never smooths out"] },
  { img: "https://raw.githubusercontent.com/epalmer859-source/Photos/main/acne-4%5B1%5D.png", title: "Redness & Irritation", items: ["Daily contact with equipment", "Repeated shaving", "Barriers weakened by overuse", "Irritation that never settles"] },
];

export function HomePage({ setPage }: HomePageProps) {
  const [modalOpen, setModalOpen] = useState<number | null>(null);
  const protocolScrollRef = useRef<HTMLDivElement>(null);
  const [protocolArrows, setProtocolArrows] = useState({ left: false, right: true });
  const [reviewIndex, setReviewIndex] = useState(0);
  const homeReviews = [...getUserReviews().slice().reverse(), ...ALL_REVIEWS].slice(0, 10);

  useEffect(() => {
    if (modalOpen !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  const updateProtocolArrows = () => {
    const el = protocolScrollRef.current;
    if (!el) return;
    const left = el.scrollLeft > 8;
    const right = el.scrollLeft < el.scrollWidth - el.clientWidth - 8;
    setProtocolArrows((prev) => (prev.left !== left || prev.right !== right ? { left, right } : prev));
  };

  useEffect(() => {
    const el = protocolScrollRef.current;
    if (!el) return;
    updateProtocolArrows();
    el.addEventListener('scroll', updateProtocolArrows);
    const ro = new ResizeObserver(updateProtocolArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateProtocolArrows);
      ro.disconnect();
    };
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-auto flex flex-col items-center justify-center px-0 sm:px-6 pt-16 sm:pt-16 lg:pt-12 pb-20 sm:pb-24 text-center relative overflow-visible">
        <div 
          className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.06) 0%, transparent 70%)' }}
        />

        <FadeIn className="mt-14 sm:mt-18 lg:mt-24 px-4 sm:px-0 relative z-10">
          <h1 
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-normal font-normal mb-3 sm:mb-4"
            style={{ fontFamily: 'var(--header)' }}
          >
            <span className="hidden lg:inline">Shut the Acne Cycle Down — For Good.</span>
            <span className="lg:hidden">End the Acne Cycle.</span>
          </h1>
          <p className="text-white text-lg font-normal mb-3 sm:mb-4" style={{ fontFamily: 'var(--header)' }}>
            <span className="text-[#E2CDB9] hidden lg:inline">Designed to bring men their confidence back.</span>
            <span className="text-[#E2CDB9] lg:hidden">Clinical-grade acne control for men.</span>
          </p>
          <div 
            className="flex items-center justify-center gap-2 tracking-normal text-sm font-medium mb-0"
            style={{ fontFamily: 'var(--header)', textShadow: '0 0 20px rgba(226,205,185,0.3)' }}
          >
            <span className="hidden lg:inline text-[#E2CDB9]/90">4.6★</span>
            <span className="hidden lg:inline text-white font-normal">Rated by 500+ Men in just 3 months</span>
            <span className="lg:hidden text-[#E2CDB9]">★ 4.6</span>
            <span className="lg:hidden text-white font-normal tracking-normal">from 500+ men</span>
          </div>
        </FadeIn>

        {/* Hero image behind, info boxes floating on top (desktop only) */}
        <FadeIn className="-mt-6 sm:-mt-10 lg:-mt-14 w-full max-w-[1600px] mx-auto px-0 sm:px-2 lg:px-6">
          <div className="relative flex items-center justify-center">
            {/* Product Image - full-bleed on mobile */}
            <div className="w-full flex items-center justify-center">
              <div className="w-full max-w-full lg:max-w-[min(82%,1000px)] rounded-none lg:rounded-xl overflow-hidden flex items-center justify-center">
                <ImageWithFallback 
                  src="/hero-products.png" 
                  alt="ASCEND 3-Phase System"
                  decoding="async"
                  fetchPriority="high"
                  className="hero-product-image w-full h-auto max-w-full object-contain scale-[1.15] lg:scale-100"
                />
              </div>
            </div>

            {/* Left Box - floating, slightly higher and further left from image */}
            <div className="hidden lg:flex absolute left-0 top-[42%] -translate-y-1/2 -translate-x-4 z-10 border border-white/25 rounded-sm px-5 py-4 flex-row items-center gap-4 bg-[#0d0d0d]/85 backdrop-blur-sm w-fit">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="#E2CDB9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="2" />
                  <path d="M12 8v2l2 6" />
                  <path d="M12 8l-2 1.5v5.5" />
                  <path d="M14 16l1.5-4 2 .5" />
                  <path d="M10 15l-1.5-3.5-1.5 1" />
                </svg>
              </div>
              <div className="flex flex-col text-left justify-center min-w-0">
                <h3 className="text-white font-semibold leading-tight mb-1 whitespace-nowrap" style={{ fontFamily: 'var(--header)', fontSize: '21px' }}>
                  Built for Men Under Pressure
                </h3>
                <p className="text-white text-sm font-medium leading-relaxed whitespace-nowrap" style={{ fontFamily: 'var(--header)' }}>
                  Heat. Sweat. Friction. Pressure.
                </p>
                <p className="text-[#E2CDB9] text-sm leading-relaxed mt-2 whitespace-nowrap" style={{ fontFamily: 'var(--header)' }}>
                  Acne shouldn't be part of the equation.
                </p>
              </div>
            </div>

            {/* Right Box - floating, slightly higher and further right from image */}
            <div className="hidden lg:flex absolute right-0 top-[42%] -translate-y-1/2 translate-x-8 z-10 border border-white/25 rounded-sm px-5 py-4 flex-row items-center gap-4 bg-[#0d0d0d]/85 backdrop-blur-sm w-fit">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10">
                <CircleHelp className="w-10 h-10 text-[#E2CDB9]" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col text-left justify-center min-w-0">
                <h3 className="text-white font-semibold leading-tight mb-1 whitespace-nowrap" style={{ fontFamily: 'var(--header)', fontSize: '21px' }}>
                  Tired of acne that never clears?
                </h3>
                <p className="text-white text-sm font-medium leading-relaxed italic whitespace-nowrap" style={{ fontFamily: 'var(--header)' }}>
                  ASCEND shuts the acne cycle down.
                </p>
                <p className="text-[#E2CDB9] text-sm leading-relaxed mt-2 not-italic whitespace-nowrap" style={{ fontFamily: 'var(--header)' }}>
                  So your skin stops holding you back.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn className="-mt-8 sm:-mt-12 w-full flex flex-col items-center gap-4">
          <button
            onClick={() => { setPage('Shop'); window.scrollTo(0,0); }}
            className="relative group inline-flex items-center gap-3 px-12 py-4 text-sm sm:text-base tracking-[0.2em] uppercase transition-all duration-500 hover:tracking-[0.25em] ml-4 sm:ml-6"
            style={{ fontFamily: 'var(--header)' }}
          >
            <div className="absolute inset-0 border-[1.5px] border-[#E2CDB9]/30 group-hover:border-[#E2CDB9]/60 transition-all duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E2CDB9]/5 to-transparent group-hover:via-[#E2CDB9]/10 transition-all duration-500" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/30 to-transparent blur-sm" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/50 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/30 to-transparent blur-sm" />
            <span className="relative z-10 text-[#E2CDB9]">Build My Routine</span>
            <ArrowRight className="relative z-10 w-4 h-4 text-[#E2CDB9]/70 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <div className="flex lg:hidden flex-col items-center gap-3 pt-5 w-full">
            {[
              { icon: <FlaskConical className="w-4 h-4 text-[#E2CDB9]" />, text: 'Formulated for Skin Under Stress.' },
              { icon: <BadgeCheck className="w-4 h-4 text-[#E2CDB9]" />, text: 'Clinically Validated Performance.' },
              { icon: <ShieldCheck className="w-4 h-4 text-[#E2CDB9]" />, text: 'No sulfates. No parabens. No drying alcohols.' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#000', boxShadow: '0 0 10px rgba(255,255,255,0.15)' }}>{item.icon}</span>
                <span className="text-xs font-medium text-[#E2CDB9]">{item.text}</span>
              </div>
            ))}
          </div>
          <div className="hidden lg:flex w-full flex-wrap items-center justify-center gap-6 lg:gap-10 pt-6 ml-10 sm:ml-14 lg:ml-24">
            {[
              { icon: <FlaskConical className="w-5 h-5 text-[#E2CDB9]" />, text: 'Formulated for Skin Under Stress.' },
              { icon: <BadgeCheck className="w-5 h-5 text-[#E2CDB9]" />, text: 'Clinically Validated Performance.' },
              { icon: <ShieldCheck className="w-5 h-5 text-[#E2CDB9]" />, text: 'No sulfates. No parabens. No drying alcohols.' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-3">
                <span className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#000', boxShadow: '0 0 12px rgba(255,255,255,0.2), 0 0 24px rgba(255,255,255,0.1)' }}>{item.icon}</span>
                <span className="text-sm font-medium text-[#E2CDB9]">{item.text}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* System Section */}
      <section className="section-pad mt-8 sm:mt-10 lg:mt-14 pt-6 sm:pt-8 md:pt-10 lg:pt-14 !pb-10 sm:!pb-14">
        <FadeIn>
          {/* Mobile: stacked layout (image, three phases line, CTA) */}
          <div className="lg:hidden flex flex-col items-center text-center max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl mb-6" style={{ fontFamily: 'var(--header)' }}>The ASCEND™ System</h2>
            <div className="flex justify-center items-center min-w-0 w-full mb-2">
              <ImageWithFallback src="/ascend-3tubes.png?v=3" alt="ASCEND Phase I, II, III" className="w-full max-w-[380px] sm:max-w-[420px] object-contain" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm sm:text-base tracking-widest font-medium text-white mb-8">
              <span>PHASE I</span><span className="text-[#E2CDB9]">→</span>
              <span>PHASE II</span><span className="text-[#E2CDB9]">→</span>
              <span>PHASE III</span>
            </div>
            <p className="text-[#E2CDB9] italic text-lg sm:text-xl mb-6" style={{ fontFamily: 'var(--header)' }}>Three phases. One outcome. No guesswork.</p>
            <button onClick={() => { setPage('Our System'); window.scrollTo(0,0); }} className="btn-gold text-sm sm:text-base">
              Explore the ASCEND™ System <ArrowRight className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
            </button>
          </div>

          {/* Desktop: original 2-col layout with divider */}
          <div className="hidden lg:block relative">
            <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-white/20 z-20 pointer-events-none" aria-hidden />
            <div className="grid grid-cols-2 gap-0 items-center">
              <div className="flex flex-col items-start text-left pl-4 pr-12 min-w-0 relative z-10 -mt-14">
                <h2 className="text-4xl lg:text-5xl mb-2 whitespace-nowrap" style={{ fontFamily: 'var(--header)' }}>The ASCEND System.</h2>
                <p className="text-[#E2CDB9] italic text-lg sm:text-xl mb-4 lg:mb-8 whitespace-nowrap">Three phases. One outcome. No guesswork.</p>
                <button
                  onClick={() => { setPage('Why ASCEND'); window.scrollTo(0, 0); }}
                  className="relative group inline-flex items-center gap-3 px-10 py-3.5 text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:tracking-[0.25em] mb-4 lg:mb-5 whitespace-nowrap"
                  style={{ fontFamily: 'var(--header)' }}
                >
                  <div className="absolute inset-0 border-[1.5px] border-[#E2CDB9]/30 group-hover:border-[#E2CDB9]/60 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E2CDB9]/5 to-transparent group-hover:via-[#E2CDB9]/10 transition-all duration-500" />
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/50 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/30 to-transparent blur-sm" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/50 to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/30 to-transparent blur-sm" />
                  <span className="relative z-10 text-[#E2CDB9]">See The ASCEND System</span>
                  <ArrowRight className="relative z-10 w-4 h-4 text-[#E2CDB9]/70 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                </button>
                <p className="text-[#E2CDB9] text-sm sm:text-base italic whitespace-nowrap">Clinically informed. System-driven. Built for long-term control.</p>
                <div className="flex flex-wrap gap-2 sm:gap-4 mt-6 lg:mt-7 text-sm sm:text-base tracking-widest font-medium text-white">
                  <span>PHASE I</span><span className="text-[#E2CDB9]">→</span>
                  <span>PHASE II</span><span className="text-[#E2CDB9]">→</span>
                  <span>PHASE III</span>
                </div>
              </div>
              <div className="flex items-center w-full">
                <ImageWithFallback src="/ascend-3tubes.png?v=3" alt="ASCEND Phase I, II, III" className="w-full object-contain" style={{ transform: 'scale(1.4)', transformOrigin: 'left center' }} />
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Acne Protocol Section */}
      <section className="pt-20 sm:pt-28 pb-14 sm:pb-20 px-4 sm:px-6 bg-black">
        <FadeIn className="text-center w-full mx-auto mb-10 sm:mb-16 px-2 sm:px-4">
          <h2
            className="text-[1.5rem] sm:text-[2.1rem] lg:text-[2.6rem] tracking-widest mb-4 sm:whitespace-nowrap"
            style={{ fontFamily: 'var(--header)' }}
          >
            THE MODERN-DAY ACNE PROTOCOL
          </h2>
          <p className="text-white italic text-lg" style={{ fontFamily: 'var(--header)' }}>Most treatments stop short.</p>
          <p className="text-xl mt-2 mb-5 text-[#E8C49A] lg:text-white" style={{ fontFamily: 'var(--header)' }}>We didn't.</p>
          <p className="hidden sm:block text-xl text-[#E8C49A]" style={{ fontFamily: 'var(--header)' }}>
            Because Acne Never Fails For Just <span className="text-2xl font-bold">ONE</span> Reason.
          </p>
        </FadeIn>

        {/* Mobile: scroll hint then scrollable cards with arrows */}
        <div className="lg:hidden relative">
          <div
            ref={protocolScrollRef}
            className="overflow-x-auto overflow-y-hidden flex gap-6 pb-4 px-2 scrollbar-none snap-x snap-mandatory touch-pan-x"
            style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
          >
            {PROTOCOL_CARDS.map((card, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[82vw] max-w-[320px] snap-center snap-always rounded-xl border border-white/10 bg-white/[0.03] p-5 flex flex-col text-center"
              >
                <div className="w-full h-[200px] flex items-center justify-center mb-4">
                  <img src={card.img} alt={card.title} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-lg mb-3 text-[#E2CDB9] leading-snug" style={{ fontFamily: 'var(--header)' }}>{card.title}</h3>
                <p className="text-white text-xs mb-2">Seen often in:</p>
                <ul className="list-disc pl-5 text-white text-xs leading-6 text-left flex-1 mb-4 text-[13px]">
                  {card.items.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
                <button
                  type="button"
                  onClick={() => setModalOpen(i)}
                  className="w-full min-h-[48px] btn-outline justify-center text-sm py-3 mt-auto border-[#E2CDB9] text-[#E2CDB9] hover:border-[#E2CDB9] hover:text-[#E2CDB9] hover:bg-[#E2CDB9]/5 touch-manipulation"
                  style={{ boxShadow: '0 0 20px rgba(226, 205, 185, 0.25), 0 0 40px rgba(226, 205, 185, 0.1)' }}
                >
                  How ASCEND addresses this +
                </button>
              </div>
            ))}
          </div>
          {protocolArrows.left && (
            <button
              type="button"
              onClick={() => { protocolScrollRef.current?.scrollBy({ left: -protocolScrollRef.current!.offsetWidth, behavior: 'smooth' }); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-white/20 bg-black/80 backdrop-blur-sm flex items-center justify-center text-white touch-manipulation shadow-lg"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-6 h-6 shrink-0" strokeWidth={2} />
            </button>
          )}
          {protocolArrows.right && (
            <button
              type="button"
              onClick={() => { protocolScrollRef.current?.scrollBy({ left: protocolScrollRef.current!.offsetWidth, behavior: 'smooth' }); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-white/20 bg-black/80 backdrop-blur-sm flex items-center justify-center text-white touch-manipulation shadow-lg"
              aria-label="Next card"
            >
              <ChevronRight className="w-6 h-6 shrink-0" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Desktop: grid */}
        <div className="hidden lg:grid grid-cols-4 gap-[4.5rem] max-w-[1400px] mx-auto px-6 items-stretch">
          {PROTOCOL_CARDS.map((card, i) => (
            <FadeIn key={i} style={{ transitionDelay: `${i * 0.1}s` }} className="flex">
              <div className="flex flex-col w-full text-center">
                <div className="w-full h-[280px] flex items-center justify-center mb-6">
                  <img src={card.img} alt={card.title} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl mb-4 text-[#E2CDB9] min-h-[2.5rem] flex items-start justify-center text-center leading-snug" style={{ fontFamily: 'var(--header)' }}>{card.title}</h3>
                <p className="text-white text-sm mb-3">Seen often in:</p>
                <ul className="list-disc pl-6 text-white text-sm leading-7 mb-6 text-left flex-1 max-w-[240px] mx-auto">
                  {card.items.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
                <button
                  onClick={() => setModalOpen(i)}
                  className="w-full btn-outline justify-center text-xs py-3 mt-auto border-[#E2CDB9] text-[#E2CDB9] hover:border-[#E2CDB9] hover:text-[#E2CDB9] hover:bg-[#E2CDB9]/5"
                  style={{ boxShadow: '0 0 20px rgba(226, 205, 185, 0.25), 0 0 40px rgba(226, 205, 185, 0.1)' }}
                >
                  How ASCEND treats this problem +
                </button>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Modal */}
      {modalOpen !== null && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden" style={{ touchAction: 'none' }}>
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={() => setModalOpen(null)}
          />
          <div
            className="relative bg-[#0a0a0a] border border-[#E2CDB9]/30 rounded-lg p-6 sm:p-10 max-w-xl w-full text-left"
          >
            <button
              onClick={() => setModalOpen(null)}
              className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/50 hover:text-white touch-manipulation"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl mb-5 text-[#E2CDB9]" style={{ fontFamily: 'var(--header)' }}>
              {modalData[modalOpen].title}
            </h3>
            <div className="gold-divider w-48 my-5" />
            <p className="text-white leading-relaxed mb-8" style={{ fontFamily: 'var(--header)', fontWeight: 400 }}>
              {modalData[modalOpen].text}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setModalOpen(null)}
                className="btn-gold"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Reviews Section — user reviews + seeded so count updates in real time */}
      <section className="pt-18 sm:pt-24 pb-8 sm:pb-10 px-6 bg-[var(--bg2)]">
        <FadeIn className="text-center mb-10">
          <h2 className="text-3xl mb-2" style={{ fontFamily: 'var(--header)' }}>
            What Men Are Saying
          </h2>
          <div className="flex items-center justify-center gap-3">
            <RatingStars rating={4.6} />
            <span className="text-[#E2CDB9] text-xl font-bold">{avgRating}</span>
            <span className="text-white text-sm" style={{ fontFamily: 'var(--header)' }}>from 486 reviews</span>
          </div>
        </FadeIn>

        {/* Mobile Carousel */}
        <div className="md:hidden max-w-6xl mx-auto">
          <div className="glass-card flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <div>
                <strong className="text-sm">{homeReviews[reviewIndex].name}</strong>
                {homeReviews[reviewIndex].verified && (
                  <span className="text-xs text-[#E2CDB9] ml-2">✓ Verified</span>
                )}
              </div>
              <span className="text-xs text-white/60">{homeReviews[reviewIndex].time}</span>
            </div>
            <Stars count={homeReviews[reviewIndex].star} />
            {homeReviews[reviewIndex].title && (
              <p className="text-white/90 text-sm mt-3 font-medium">{homeReviews[reviewIndex].title}</p>
            )}
            <p className="text-white/80 text-sm mt-3 leading-relaxed">{homeReviews[reviewIndex].text}</p>
            <p className="text-xs text-[#E2CDB9] mt-3 italic">Purchased: {homeReviews[reviewIndex].product}</p>
          </div>

          <div className="flex items-center justify-center gap-6 mt-6">
            <button
              onClick={() => setReviewIndex(i => Math.max(i - 1, 0))}
              disabled={reviewIndex === 0}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center disabled:opacity-30 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-white/60">{reviewIndex + 1} / {homeReviews.length}</span>
            <button
              onClick={() => setReviewIndex(i => Math.min(i + 1, homeReviews.length - 1))}
              disabled={reviewIndex === homeReviews.length - 1}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center disabled:opacity-30 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => { setPage('Reviews'); window.scrollTo(0,0); }}
              className="btn-gold text-sm"
            >
              See all {getUserReviews().length + ALL_REVIEWS.length} reviews <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {homeReviews.map((review) => (
            <FadeIn key={review.id}>
              <div className="glass-card h-full flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <strong className="text-sm">{review.name}</strong>
                    {review.verified && (
                      <span className="text-xs text-[#E2CDB9] ml-2">✓ Verified</span>
                    )}
                  </div>
                  <span className="text-xs text-white/60">{review.time}</span>
                </div>
                <Stars count={review.star} />
                {review.title && (
                  <p className="text-white/90 text-sm mt-3 font-medium">{review.title}</p>
                )}
                <p className="text-white/80 text-sm mt-3 leading-relaxed">{review.text}</p>
                <p className="text-xs text-[#E2CDB9] mt-3 italic">Purchased: {review.product}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <div className="hidden md:block text-center mt-8">
          <button
            onClick={() => { setPage('Reviews'); window.scrollTo(0,0); }}
            className="relative group inline-flex items-center gap-3 px-12 py-4 text-sm sm:text-base tracking-[0.2em] uppercase transition-all duration-500 hover:tracking-[0.25em]"
            style={{ fontFamily: 'var(--header)' }}
          >
            <div className="absolute inset-0 border-[1.5px] border-[#E2CDB9]/30 group-hover:border-[#E2CDB9]/60 transition-all duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E2CDB9]/5 to-transparent group-hover:via-[#E2CDB9]/10 transition-all duration-500" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/30 to-transparent blur-sm" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/50 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/30 to-transparent blur-sm" />
            <span className="relative z-10 text-[#E2CDB9]">See all {getUserReviews().length + ALL_REVIEWS.length} reviews</span>
            <ArrowRight className="relative z-10 w-4 h-4 text-[#E2CDB9]/70 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </section>

      {/* Shop section — same content as Shop page when scrolling Home */}
      <ShopPage setPage={setPage} embedded />
    </div>
  );
}
