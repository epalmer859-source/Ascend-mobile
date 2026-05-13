import { FadeIn } from '@/components/FadeIn';
import { ImageWithFallback } from '@/components/ImageWithFallback';

const phases = [
  { 
    num: "Phase I",
    sub: "The controlled foundation of the ASCEND™ system.",
    left: {
      title: "ENGINEERED. NOT IMPROVISED.",
      items: [
        "Function-first actives selected for predictable performance.",
        "Blended with barrier-compatible humectants to regulate hydration.",
        "pH-engineered for stability and skin compatibility."
      ]
    },
    right: {
      title: "WHY THIS WORKS.",
      items: [
        "Cleans deep without wrecking your skin barrier.",
        "Stops the cycle of dryness, irritation, and over-oil production.",
        "Shuts down acne at the source instead of chasing symptoms."
      ]
    },
    complex: "ASCEND™ Active Complex",
    complexBullets: "Targets pores without barrier damage • No flaking • No rebound oil • No guesswork",
    ings: [
      {
        name: "Salicylic Acid",
        sub: "Targeted Pore Corrector",
        desc: "ASCEND™ refines salicylic acid through deliberate formulation and controlled delivery to achieve consistent pore correction without irritation."
      },
      {
        name: "Sulfur Complex",
        sub: "Strategic Oil Regulation & Antibacterial",
        desc: "ASCEND™ selects high-purity sulfur and precisely controls its integration to harmonize oil production while addressing acne's bacterial environment without overwhelming the skin barrier."
      }
    ]
  },
  { 
    num: "Phase II",
    sub: "Repair the Barrier. Lock the Results.",
    left: {
      title: "BUILT FOR REPAIR. NOT TEMPORARY RELIEF",
      items: [
        "Skin-identical ceramide complex rebuilds surface lipid structure.",
        "5% Niacinamide stabilizes the barrier post-correction.",
        "Balanced with multiple humectants and soothing agents."
      ]
    },
    right: {
      title: "WHY THIS WORKS",
      items: [
        "Restores moisture balance so oil production stays in check.",
        "Stabilizes the skin barrier to enhance Phase III effectiveness.",
        "Prevents acne from restarting once correction begins."
      ]
    },
    complex: "ASCEND™ Triple Lipid Matrix",
    complexBullets: "Non-occlusive recovery • Reinforces the barrier • Results, preserved. • No sensitivity rebound",
    ings: [
      {
        name: "Ceramide-Complex",
        sub: "Structural Barrier Restoration",
        desc: "ASCEND™ engineers a ceramide complex designed to reinforce the skin barrier through targeted lipid restoration and controlled hydration retention."
      },
      {
        name: "Purified Niacinamide",
        sub: "Oil Control & Skin Clarity",
        desc: "ASCEND™ uses purified niacinamide to regulate excess oil and refine tone and texture, enhancing clarity and visibly minimizing pores while maintaining optimal barrier stability and cellular balance."
      }
    ]
  },
  { 
    num: "Phase III",
    sub: "Precision treatment. Results secured.",
    left: {
      title: "TREATMENT-LEVEL CORRECTION",
      items: [
        "15% Azelaic Acid delivered at clinical treatment concentration.",
        "Actively reduces acne lesions, redness, and uneven tone.",
        "Zinc PCA regulates sebum during treatment exposure.",
        "Non-oxidative antibacterial system for consistent correction."
      ]
    },
    right: {
      title: "WHY THIS WORKS.",
      items: [
        "Eliminates bacteria without irritation or barrier breakdown.",
        "Selected over benzoyl peroxide to preserve skin stability.",
        "Reduces inflammation and visible redness during active treatment."
      ]
    },
    complex: "ASCEND™ Azelaic System",
    complexBullets: "Active acne corrected • Visible redness reduced during treatment • Oil production controlled • No purging",
    ings: [
      {
        name: "Azelaic Acid",
        sub: "Clinical Treatment Active",
        desc: "ASCEND™ uses treatment-level azelaic acid to correct active acne while reducing redness and inflammation. Non-oxidative antibacterial control delivers consistent results without purging or irritation."
      },
      {
        name: "Zinc PCA",
        sub: "Sebum Control & Treatment Stabilization",
        desc: "ASCEND™ incorporates Zinc PCA to support antimicrobial control during active treatment. By helping limit bacterial activity and inflammatory signaling, Zinc PCA complements azelaic acid and helps maintain a stable treatment environment."
      }
    ]
  },
];

const INGREDIENT_IMAGES: Record<string, string> = {
  'Phase I-0': '/salicylic-acid.png',
  'Phase I-1': '/sulfur.png',
  'Phase II-0': '/ceramides.png',
  'Phase II-1': '/niacinamide.png',
  'Phase III-0': '/azelaic-acid.png',
  'Phase III-1': '/zinc-pca.png',
};

export function FormulationPage() {
  return (
    <div style={{ fontFamily: 'var(--header)' }}>
      {/* Hero — compact on mobile, full-screen on desktop */}
      <section 
        className="flex flex-col items-center justify-center text-center px-4 pt-28 pb-14 lg:min-h-screen lg:pt-0 lg:pb-0 relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(212,165,116,0.05), transparent 60%)' }}
      >
        <FadeIn className="flex flex-col items-center w-full max-w-xl">
          <p className="text-[10px] sm:text-sm tracking-[0.3em] text-[#E2CDB9]/70 mb-6 lg:mb-12 uppercase">
            Science-Led · Barrier-Safe · Results-Driven
          </p>

          <h1 
            className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-light leading-[1.15] mb-4 lg:mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Inside the<br />Formulation
          </h1>

          <p className="text-white/90 italic text-sm sm:text-base lg:text-lg mb-8 lg:mb-16">
            A phase-by-phase look at each signature formulation.
          </p>

          <div className="hidden lg:flex flex-col items-center gap-0">
            <span className="text-[10px] tracking-[0.4em] text-[#E2CDB9] uppercase mb-4">Explore</span>
            <div className="w-px h-20 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </FadeIn>
      </section>

      {/* Phase Sections — mobile: single column, tighter; desktop: unchanged */}
      {phases.map((phase, i) => (
        <section 
          key={i} 
          className="py-10 px-4 lg:py-16 lg:px-6 border-t border-white/10 relative overflow-hidden"
          style={{ background: i === 0 ? undefined : 'var(--bg)' }}
        >
          <div>
            <FadeIn className="text-center max-w-4xl mx-auto mb-8 lg:mb-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-2" style={{ fontFamily: 'var(--header)' }}>
                {phase.num} <span className="text-white">&mdash; {['Clear', 'Repair', 'Treat'][i]}</span>
              </h2>
              <p className="text-[#E2CDB9] italic text-sm lg:text-base">{phase.sub}</p>
              <div className="gold-divider w-48 lg:w-72 mt-4 lg:mt-5 mx-auto" />
            </FadeIn>

            <FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-w-5xl mx-auto mb-8 lg:mb-10">
                {[phase.left, phase.right].map((card, j) => (
                  <div key={j} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 lg:glass-card lg:border-none lg:p-5">
                    <h4 className="formulation-header-glow text-[#E2CDB9] text-sm lg:text-lg tracking-widest font-bold mb-3 lg:mb-4">
                      {card.title}
                    </h4>
                    <ul className="list-disc pl-4 lg:pl-5 text-white text-sm leading-relaxed lg:leading-7 space-y-1">
                      {card.items.map((item, k) => <li key={k}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn className="text-center max-w-5xl mx-auto mb-8 lg:mb-10">
              <div className="gold-divider w-full mb-6 lg:mb-8" />
              <div className="pt-4 lg:pt-8">
                <h3 className="formulation-complex-glow text-[#E2CDB9] mb-4 lg:mb-6 text-lg lg:text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, lineHeight: 1.2 }}>
                  {phase.complex.includes('™') ? (
                    <>
                      <span className="not-italic">{phase.complex.split('™')[0]}™</span>
                      <span className="italic">{phase.complex.split('™')[1]}</span>
                    </>
                  ) : (
                    <span className="italic">{phase.complex}</span>
                  )}
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:gap-x-12 mb-6 lg:mb-8" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                  {phase.complexBullets.split(' • ').map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[#E2CDB9] text-sm lg:text-xl formulation-complex-glow">
                      <span>•</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="gold-divider w-full mt-4 lg:mt-8" />
            </FadeIn>

            <FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block" style={{ background: 'linear-gradient(180deg, transparent, rgba(226,205,185,0.4) 10%, rgba(226,205,185,0.4) 90%, transparent)', height: '120%', minHeight: '18rem' }} aria-hidden />
                {phase.ings.map((ing, j) => {
                  const phaseKey = `Phase ${['I', 'II', 'III'][i]}-${j}`;
                  const imgSrc = INGREDIENT_IMAGES[phaseKey];
                  return (
                    <div key={j} className={`relative flex flex-col lg:block py-4 lg:py-0 lg:min-h-[20rem] ${j === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                      {/* Mobile: image on top, in flow */}
                      {imgSrc && (
                        <div className="relative flex items-center justify-center mb-4 lg:absolute lg:inset-0 lg:flex lg:items-end lg:justify-end lg:pt-8 lg:pb-0 pointer-events-none z-0">
                          <ImageWithFallback
                            src={imgSrc}
                            alt={ing.name}
                            className="max-h-40 w-auto object-contain lg:max-w-[85%] lg:max-h-64 xl:max-h-80 object-center lg:object-right-bottom"
                          />
                        </div>
                      )}
                      <div className="relative z-10 flex flex-col lg:max-w-[15.5rem] xl:max-w-[18.5rem]">
                        <div className="min-h-0 lg:min-h-[6.25rem]">
                          <h3 className="text-[#E2CDB9] text-xl lg:text-3xl mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{ing.name}</h3>
                          <p className="text-white/90 text-xs lg:text-sm mb-3 lg:whitespace-nowrap">{ing.sub}</p>
                          <div className="gold-divider w-16 lg:w-20 mb-3 lg:mb-4" />
                        </div>
                        <p className="text-white text-sm leading-relaxed">{ing.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </FadeIn>
          </div>
        </section>
      ))}

      {/* Closing Statement */}
      <FadeIn className="text-center py-12 px-4 lg:py-16 lg:px-6">
        <p className="text-[#E2CDB9] italic text-base sm:text-lg lg:text-xl max-w-xl mx-auto" style={{ fontFamily: 'var(--header)' }}>
          Every phase engineered with purpose. Every ingredient chosen to finish the job.
        </p>
      </FadeIn>
    </div>
  );
}
