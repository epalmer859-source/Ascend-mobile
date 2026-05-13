import { useState } from 'react';
import { FadeIn } from '@/components/FadeIn';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { PHASE_I_INGREDIENT_SLIDES } from '@/data/phaseIIngredients';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const phases = [
  { 
    name: "CLEAR",
    label: "Phase I – Core Acne Cleanser",
    desc: "Reset the skin. Eliminate buildup. Take control.",
    how: [
      "Breaks down pore-clogging oil and sweat at the source",
      "Clears bacteria without stripping the barrier",
      "Resets the skin for Restore and Treat"
    ],
    ing: "2% Salicylic Acid",
    ingType: "Active Ingredient",
    ingDesc: "Oil-soluble BHA that penetrates pores to dissolve buildup, unclog congestion, and reduce acne."
  },
  { 
    name: "Restore",
    label: "Phase II – Barrier Preparation & Recovery",
    desc: "Restore barrier function. Replenish essential lipids. Stabilize the skin for treatment.",
    how: [
      "Rebuilds the skin barrier with skin-identical ceramides.",
      "Rehydrates and stabilizes the skin at an optimized pH.",
      "Prepares the skin to optimally absorb targeted treatment."
    ],
    ing: "Niacinamide",
    ingType: "Barrier Active",
    ingDesc: "A form of vitamin B3 that strengthens the skin barrier, controls oil, reduces redness, and helps clear breakouts."
  },
  { 
    name: "Treat",
    label: "Phase III – Final Acne Treatment",
    desc: "Target acne at its source. Normalize skin. End the cycle.",
    how: [
      "Targets acne-causing bacteria with 15% Azelaic Acid.",
      "Reduces redness and post-breakout discoloration.",
      "Regulates excess sebum and shine using Zinc PCA."
    ],
    ing: "15% Azelaic Acid",
    ingType: "Active Ingredient",
    ingDesc: "Multifunctional acid that reduces acne-causing bacteria and calms inflammation to prevent breakouts and fade post-acne marks."
  },
];

interface SystemPageProps {
  /** When true, render as a section for use inside Home scroll */
  embedded?: boolean;
}

export function SystemPage({ embedded }: SystemPageProps = {}) {
  const [phaseIIngredientSlide, setPhaseIIngredientSlide] = useState(0);

  return (
    <div id={embedded ? 'our-system' : undefined}>
      {/* Hero Section */}
      <section 
        className={`flex flex-col items-center justify-center text-center px-6 ${embedded ? 'py-20' : 'min-h-[70vh] py-36'}`}
        style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(212,165,116,0.06), transparent 60%)' }}
      >
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-3" style={{ fontFamily: 'var(--header)' }}>
            The ASCEND System.
          </h2>
          <p className="text-lg text-white mb-5">Three Phases. One outcome. No Guesswork.</p>
          <div className="gold-divider w-48 mb-5" />
          <p className="text-[#E2CDB9] italic text-base">Engineered to work in sequence. Built to lock in results.</p>
        </FadeIn>

        <FadeIn className="flex items-center gap-6 mt-12 flex-wrap justify-center">
          {['Clear', 'Restore', 'Treat'].map((phase, i) => (
            <div key={i} className="flex items-center gap-6">
              <div 
                className="px-8 py-5 rounded border border-[#E2CDB9] text-xl font-medium"
                style={{ 
                  animation: `glowPulse 3s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`
                }}
              >
                {phase}
                <div className="text-xs text-white mt-1">Phase {['I', 'II', 'III'][i]}</div>
              </div>
              {i < 2 && <span className="text-[#E2CDB9] text-2xl font-bold">»</span>}
            </div>
          ))}
        </FadeIn>
      </section>

      {/* Phase Details */}
      {phases.map((phase, i) => (
        <section 
          key={i} 
          className="py-20 px-6 border-t border-white/10"
          style={{ background: i % 2 === 0 ? 'var(--bg)' : 'var(--bg2)' }}
        >
          {i === 0 && (
            <FadeIn className="text-center mb-20">
              <p className="text-[#E2CDB9] italic text-xl">Phase 1 of 3. The Foundation of Clear Skin.</p>
              <div className="gold-divider w-72 mt-4" />
            </FadeIn>
          )}
          {i === 1 && (
            <FadeIn className="text-center mb-20">
              <p className="text-[#E2CDB9] italic text-xl">Phase 2 of 3. Repair. Restore. Lock In Results.</p>
              <div className="gold-divider w-72 mt-4" />
            </FadeIn>
          )}
          {i === 2 && (
            <FadeIn className="text-center mb-20">
              <p className="text-[#E2CDB9] italic text-xl">Phase 3 of 3. The final corrective phase of the ASCEND system.</p>
              <div className="gold-divider w-72 mt-4" />
            </FadeIn>
          )}

          <FadeIn>
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 max-w-6xl mx-auto items-start">
              <div>
                <h2 
                  className="text-5xl sm:text-6xl mb-2 tracking-widest"
                  style={{ fontFamily: i === 0 ? 'var(--header)' : 'serif' }}
                >
                  {phase.name}
                </h2>
                <h3 className="text-xl font-normal mb-3" style={{ fontFamily: 'var(--header)' }}>
                  {phase.label}
                </h3>
                <p className="text-white text-base mb-6">{phase.desc}</p>
                <div className="gold-divider w-48 mb-6" />
                <h4 className="text-[#E2CDB9] italic text-base mb-4">How it works</h4>
                <ul className="list-disc pl-5 text-white/80 text-base leading-8">
                  {phase.how.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
                {i === 0 && (
                  <div className="mt-16">
                    <p className="text-[#E2CDB9] text-xs tracking-widest uppercase mb-3">Full ingredients</p>
                    <p className="text-white text-sm leading-relaxed">
                      Water (Aqua), {PHASE_I_INGREDIENT_SLIDES.map((s, idx) => (
                        <span key={idx}>
                          {s.name}
                          {idx < PHASE_I_INGREDIENT_SLIDES.length - 1 ? ', ' : '.'}
                        </span>
                      ))}
                    </p>
                  </div>
                )}
              </div>

              {i === 0 ? (
                /* Phase I: ingredient slideshow */
                <div className="lg:sticky lg:top-28">
                  <div className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col">
                    {(() => {
                      const slide = PHASE_I_INGREDIENT_SLIDES[phaseIIngredientSlide];
                      const total = PHASE_I_INGREDIENT_SLIDES.length;
                      return (
                        <>
                          <div className="p-4 sm:p-6 flex flex-col">
                            <p className="text-[#E2CDB9] text-sm tracking-widest uppercase mb-2">{slide.category}</p>
                            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--header)' }}>{slide.name}</h3>
                            <div className="w-fit max-w-full mx-auto rounded-xl overflow-hidden border border-white/10 mb-3 shrink-0">
                              <ImageWithFallback src={slide.image} alt={slide.name} className="max-h-44 sm:max-h-56 w-auto h-auto object-contain block" />
                            </div>
                            <p className="text-white text-base leading-relaxed" style={{ fontFamily: 'var(--header)' }}>{slide.description}</p>
                          </div>
                          <div className="flex items-center justify-between px-5 pb-5 shrink-0">
                            <button type="button" onClick={() => setPhaseIIngredientSlide(s => (s === 0 ? total - 1 : s - 1))} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors" aria-label="Previous">
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="flex gap-2 flex-wrap justify-center">
                              {PHASE_I_INGREDIENT_SLIDES.map((_, idx) => (
                                <button key={idx} type="button" onClick={() => setPhaseIIngredientSlide(idx)} className={`w-2.5 h-2.5 rounded-full transition-colors ${phaseIIngredientSlide === idx ? 'bg-[#E2CDB9]' : 'bg-white/40 hover:bg-white/60'}`} aria-label={`Slide ${idx + 1}`} />
                              ))}
                            </div>
                            <button type="button" onClick={() => setPhaseIIngredientSlide(s => (s === total - 1 ? 0 : s + 1))} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors" aria-label="Next">
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="glass-card lg:sticky lg:top-28">
                  <div className="h-52 rounded-lg border border-white/10 mb-4 flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a1a, #0d0d0d)' }}>
                    <ImageWithFallback src={`/phase-${i === 1 ? 'ii' : 'iii'}-tube.png`} alt={phase.label} className="w-full h-full object-contain" />
                  </div>
                  <div className="text-center text-[#E2CDB9] text-sm font-semibold mb-2 tracking-wide">{phase.ingType}</div>
                  <div className="text-center text-2xl font-bold mb-3">{phase.ing}</div>
                  <p className="text-white text-sm text-center leading-relaxed">{phase.ingDesc}</p>
                  <div className="flex justify-center gap-1.5 mt-4">
                    {[0, 1, 2, 3, 4].map((d) => (
                      <div key={d} className={`w-2 h-2 rounded-full ${d === 0 ? 'bg-white' : 'bg-white/20'}`} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        </section>
      ))}
    </div>
  );
}
