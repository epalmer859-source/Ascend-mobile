import { useState, useRef } from 'react';
import { FadeIn } from '@/components/FadeIn';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Shield, Target, Eye, Droplets, Wind } from 'lucide-react';

interface WhyAscendPageProps {
  setPage: (page: string) => void;
}


export function WhyAscendPage({ setPage }: WhyAscendPageProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { touchEnd.current = e.touches[0].clientX; };
  const handleTouchEnd = () => {
    const diff = touchStart.current - touchEnd.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setPhaseIndex(phaseIndex === 2 ? 0 : phaseIndex + 1);
      else setPhaseIndex(phaseIndex === 0 ? 2 : phaseIndex - 1);
    }
  };
  const phases = [
    { phase: 'I', name: 'Cleanse', img: '/phase-i-tube.png', desc: 'Remove oil, sweat, and acne-triggering buildup. Start every routine with a clean foundation.', color: 'from-[#E2CDB9]/10 to-transparent', productId: 1 },
    { phase: 'II', name: 'Recover', img: '/phase-ii-tube.png', desc: 'Support comfort, hydration, and barrier recovery. Keep skin strong enough to stay consistent.', color: 'from-[#E2CDB9]/10 to-transparent', productId: 2 },
    { phase: 'III', name: 'Treat', img: '/phase-iii-tube.png', desc: 'Target acne directly. The final phase completes the system and drives results.', color: 'from-[#E2CDB9]/10 to-transparent', productId: 3 },
  ];

  return (
    <div>
      {/* WHY MEN — big bold statement with background image */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="/why-ascend-hero-bg.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 pt-4">
          <p className="text-[#E2CDB9] tracking-[0.2em] text-xs uppercase mb-10" style={{ fontFamily: 'var(--header)' }}>The Real Answer</p>
          <h1 className="text-[1.7rem] sm:text-[2.1rem] lg:text-[3.25rem] mb-8 leading-[1.18]" style={{ fontFamily: 'var(--header)' }}>
            Men Have Been an<br /><span className="text-[#E2CDB9]">Afterthought</span> in Skincare.
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto mb-7">
            {['Too feminine', 'Too clinical', 'Too cheap', 'Too complicated', 'Too soft', 'Too "beauty"'].map((item, i) => (
              <div key={i} className="border border-white/10 rounded-lg px-3 py-2.5 bg-white/5 backdrop-blur-sm">
                <span className="text-white/60 text-[0.8rem] line-through decoration-[#E2CDB9]/60">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-[#E2CDB9] text-xl sm:text-2xl italic mt-8" style={{ fontFamily: 'var(--header)' }}>
            ASCEND™ was built directly for men — in look, feel, routine, and purpose.
          </p>
        </div>
      </section>

      {/* THE PROBLEM — image left, text right */}
      <section className="pt-10 sm:pt-16 pb-20 sm:pb-32 px-4 sm:px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 items-center">
            <FadeIn className="relative">
              <div className="relative rounded-xl overflow-hidden border border-white/10">
                <ImageWithFallback
                  src="/why-ascend-man.png"
                  alt="Men's skin under pressure"
                  className="w-full h-[350px] sm:h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />
              </div>
            </FadeIn>
            <FadeIn className="lg:pl-16">
              <p className="text-[#E2CDB9] tracking-[0.2em] text-xs uppercase mb-3" style={{ fontFamily: 'var(--header)' }}>The Problem</p>
              <h2 className="text-3xl sm:text-4xl mb-6" style={{ fontFamily: 'var(--header)' }}>
                Normal Acne Products <span className="text-[#E2CDB9]">Fail Men.</span>
              </h2>
              <div className="space-y-4 mb-8">
                {[
                  { label: 'Harsh products', desc: 'strip and irritate' },
                  { label: 'No moisturizer', desc: 'barrier breaks down' },
                  { label: 'Too many actives', desc: 'redness and peeling' },
                  { label: 'Random products', desc: 'no system, no results' },
                  { label: 'Quit too early', desc: 'acne never clears' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#E2CDB9] flex-shrink-0" />
                    <span className="text-white font-medium text-sm">{item.label}</span>
                    <span className="text-[#E2CDB9]/80 text-sm" style={{ textShadow: '0 0 12px rgba(226,205,185,0.25)' }}>— {item.desc}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed border-l-2 border-[#E2CDB9]/40 pl-4" style={{ textShadow: '0 0 14px rgba(226,205,185,0.3), 0 0 30px rgba(226,205,185,0.1)' }}>
                Acne involves oil, bacteria, clogged pores, and inflammation. The goal isn't to dry everything out — it's to control breakouts while keeping skin strong enough to stay consistent.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* AZELAIC ACID — flagship ingredient */}
      <section className="pt-16 sm:pt-24 pb-24 sm:pb-36 px-4 sm:px-6 bg-[var(--bg2)] relative overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.06) 0%, transparent 60%)' }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <FadeIn className="order-2 lg:order-1">
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
            </FadeIn>
            <FadeIn style={{ transitionDelay: '0.1s' }} className="order-1 lg:order-2 lg:ml-4">
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
            </FadeIn>
          </div>
        </div>
      </section>

      {/* THREE PHASES — product images with text */}
      <section id="the-system" className="py-12 sm:py-18 px-4 sm:px-6 bg-black relative scroll-mt-16">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.06) 0%, transparent 60%)' }}
        />
        <FadeIn className="text-center max-w-4xl mx-auto mb-14 relative z-10">
          <p className="text-[#E2CDB9] tracking-[0.2em] text-xs uppercase mb-3" style={{ fontFamily: 'var(--header)' }}>The System</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-4" style={{ fontFamily: 'var(--header)' }}>
            Three Phases. <span className="text-[#E2CDB9]">One Outcome.</span>
          </h2>
          <p className="text-white/80 text-base" style={{ textShadow: '0 0 10px rgba(255,255,255,0.25)' }}>No guesswork. No random bottles. Just structure.</p>
        </FadeIn>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Mobile carousel */}
          <div className="lg:hidden">
            <div
              className="relative"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <button
                onClick={() => { setPage(`Product:${phases[phaseIndex].productId}`); window.scrollTo(0, 0); }}
                className="group relative border border-white/10 rounded-xl overflow-hidden bg-white/[0.02] w-full text-left cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${phases[phaseIndex].color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[#E2CDB9] text-xs tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: 'var(--header)' }}>Phase {phases[phaseIndex].phase}</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>
                  <div className="h-[400px] sm:h-[440px] flex items-center justify-center mb-6 -mx-2">
                    <ImageWithFallback
                      src={phases[phaseIndex].img}
                      alt={`Phase ${phases[phaseIndex].phase}`}
                      className="h-full w-full object-contain scale-110 drop-shadow-[0_0_30px_rgba(226,205,185,0.15)]"
                    />
                  </div>
                  <h3 className="text-2xl sm:text-3xl mb-3 text-white" style={{ fontFamily: 'var(--header)' }}>{phases[phaseIndex].name}.</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{phases[phaseIndex].desc}</p>
                  <span className="inline-flex items-center gap-1.5 mt-4 text-[#E2CDB9] text-sm font-medium">
                    Shop Phase {phases[phaseIndex].phase} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </button>

              {/* Arrows */}
              <button
                onClick={(e) => { e.stopPropagation(); setPhaseIndex(phaseIndex === 0 ? 2 : phaseIndex - 1); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/15 flex items-center justify-center z-10 touch-manipulation"
              >
                <ChevronLeft className="w-5 h-5 text-[#E2CDB9]" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setPhaseIndex(phaseIndex === 2 ? 0 : phaseIndex + 1); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/15 flex items-center justify-center z-10 touch-manipulation"
              >
                <ChevronRight className="w-5 h-5 text-[#E2CDB9]" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-5">
              {phases.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPhaseIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 touch-manipulation ${i === phaseIndex ? 'bg-[#E2CDB9] w-6' : 'bg-white/30'}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop grid — unchanged */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            {phases.map((phase, i) => (
              <FadeIn key={i} style={{ transitionDelay: `${i * 0.15}s` }}>
                <button
                  onClick={() => { setPage(`Product:${phase.productId}`); window.scrollTo(0, 0); }}
                  className="group relative border border-white/10 rounded-xl overflow-hidden bg-white/[0.02] hover:border-[#E2CDB9]/30 transition-all duration-500 w-full text-left cursor-pointer"
                >
                  <div className={`absolute inset-0 bg-gradient-to-b ${phase.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-[#E2CDB9] text-xs tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: 'var(--header)' }}>Phase {phase.phase}</span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>
                    <div className="h-[220px] sm:h-[260px] flex items-center justify-center mb-6">
                      <ImageWithFallback
                        src={phase.img}
                        alt={`Phase ${phase.phase}`}
                        className="h-full object-contain drop-shadow-[0_0_30px_rgba(226,205,185,0.15)] group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="text-2xl sm:text-3xl mb-3 text-white" style={{ fontFamily: 'var(--header)' }}>{phase.name}.</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{phase.desc}</p>
                    <span className="inline-flex items-center gap-1.5 mt-4 text-[#E2CDB9] text-sm font-medium group-hover:gap-2.5 transition-all">
                      Shop Phase {phase.phase} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FILM-FREE TECHNOLOGY */}
      <section className="relative py-22 sm:py-28 px-4 sm:px-6 overflow-hidden bg-[var(--bg2)]">
        <FadeIn className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">
            <div>
              <FadeIn>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#E2CDB9]/10 flex items-center justify-center">
                    <Wind className="w-5 h-5 text-[#E2CDB9]" strokeWidth={1.5} />
                  </div>
                  <p className="text-[#E2CDB9] tracking-[0.3em] text-xs uppercase" style={{ fontFamily: 'var(--header)' }}>Engineered For Men</p>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-8 leading-tight" style={{ fontFamily: 'var(--header)' }}>
                  100% Film-Free.<br /><span className="text-[#E2CDB9]">Zero Evidence.</span>
                </h2>
                <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-8" style={{ fontFamily: 'var(--header)', textShadow: '0 0 12px rgba(226,205,185,0.2), 0 0 25px rgba(226,205,185,0.08)' }}>
                  Most moisturizers and treatments leave a visible film — that greasy, shiny, "something's on my face" look. For guys who are already sweating, working, and dealing with oily skin, that film makes everything worse.
                </p>
                <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-10" style={{ fontFamily: 'var(--header)', textShadow: '0 0 12px rgba(226,205,185,0.2), 0 0 25px rgba(226,205,185,0.08)' }}>
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
                        <p className="text-white/75 text-sm leading-relaxed" style={{ textShadow: '0 0 14px rgba(226,205,185,0.4), 0 0 30px rgba(226,205,185,0.15)' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="relative h-px w-full my-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E2CDB9]/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E2CDB9]/30 to-transparent blur-sm" />
                  <div className="absolute -inset-y-1 inset-x-0 bg-gradient-to-r from-transparent via-[#E2CDB9]/15 to-transparent blur-md" />
                </div>
              </FadeIn>
            </div>
            <FadeIn style={{ transitionDelay: '0.15s' }} className="flex justify-end">
              <div className="relative w-full lg:pl-6">
                <div className="relative rounded-xl border border-white/10 overflow-hidden">
                  <ImageWithFallback
                    src="/film-free-comparison.png"
                    alt="Visible film vs ASCEND invisible finish comparison"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 mt-3">
                  <p className="text-white/70 text-xs sm:text-sm tracking-[0.15em] uppercase text-center" style={{ fontFamily: 'var(--header)', textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>Visible Film</p>
                  <p className="text-[#E2CDB9] text-xs sm:text-sm tracking-[0.15em] uppercase text-center font-semibold" style={{ fontFamily: 'var(--header)' }}>ASCEND <span className="font-normal text-white/85" style={{ textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>Invisible Finish</span></p>
                </div>
              </div>
            </FadeIn>
          </div>
        </FadeIn>
      </section>


      {/* WHO IT'S FOR — visual split with product image */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-black">
        <div className="max-w-[90rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <FadeIn className="order-2 lg:order-1 lg:-ml-4">
              <p className="text-[#E2CDB9] tracking-[0.2em] text-xs uppercase mb-3" style={{ fontFamily: 'var(--header)' }}>Who This Is For</p>
              <h2 className="text-3xl sm:text-4xl mb-8" style={{ fontFamily: 'var(--header)' }}>
                For Men Who Want <span className="text-[#E2CDB9]">Clear Skin</span> Without the Beauty Routine.
              </h2>
              <div className="space-y-3 mb-8">
                {[
                  'Deal with acne, oil, or clogged pores',
                  'Sweat from training, sports, or work',
                  'Hate complicated skincare routines',
                  'Want something that looks masculine',
                  'Want a full system instead of guessing',
                  'Need skincare they will actually use',
                ].map((item, i) => (
                  <FadeIn key={i} style={{ transitionDelay: `${i * 0.06}s` }}>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#E2CDB9]/20 flex items-center justify-center flex-shrink-0" style={{ boxShadow: '0 0 12px rgba(226,205,185,0.25)' }}>
                        <span className="text-[#E2CDB9] text-xs font-bold" style={{ textShadow: '0 0 6px rgba(226,205,185,0.5)' }}>+</span>
                      </div>
                      <span className="text-white/80 text-sm sm:text-base" style={{ textShadow: '0 0 10px rgba(226,205,185,0.5), 0 0 24px rgba(226,205,185,0.4), 0 0 48px rgba(226,205,185,0.25)' }}>{item}</span>
                    </div>
                  </FadeIn>
                ))}
              </div>
              <div className="border-l-2 border-[#E2CDB9]/30 pl-4">
                <p className="text-[#E2CDB9] text-sm italic" style={{ textShadow: '0 0 14px rgba(226,205,185,0.4), 0 0 30px rgba(226,205,185,0.15)' }}>
                  Not for 12-step luxury rituals. Not for vague promises. For men who want a direct, structured system.
                </p>
              </div>
            </FadeIn>
            <FadeIn style={{ transitionDelay: '0.1s' }} className="order-3 lg:order-2 lg:ml-12">
              <button
                onClick={() => { setPage('Product:4'); window.scrollTo(0, 0); }}
                className="relative rounded-xl overflow-hidden border border-white/10 hover:border-[#E2CDB9]/30 transition-all duration-500 cursor-pointer w-full text-left group"
              >
                <ImageWithFallback
                  src="/ascend-full-system.png"
                  alt="ASCEND Full System"
                  className="w-full h-auto object-contain p-4 group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <p className="text-white text-lg font-semibold" style={{ fontFamily: 'var(--header)' }}>The Complete ASCEND System</p>
                    <p className="text-[#E2CDB9] text-sm">Cleanse. Recover. Treat.</p>
                  </div>
                  <span className="text-[#E2CDB9]/70 text-xs tracking-[0.15em] uppercase group-hover:text-[#E2CDB9] transition-colors flex items-center gap-1.5" style={{ fontFamily: 'var(--header)' }}>
                    Shop Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* EMOTIONAL CLOSE — cinematic CTA */}
      <section className="relative pt-24 sm:pt-32 pb-32 sm:pb-44 px-4 sm:px-6 overflow-hidden min-h-[80vh]">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="/confidence-bg.png"
            alt=""
            className="w-full h-full object-cover object-right-top"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.08) 0%, transparent 60%)' }}
        />
        <FadeIn className="relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-[#E2CDB9] tracking-[0.3em] text-xs uppercase mb-6" style={{ fontFamily: 'var(--header)' }}>The Result</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-8 leading-tight" style={{ fontFamily: 'var(--header)' }}>
            It Changes How You <span className="text-[#E2CDB9]">Show Up.</span>
          </h2>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-14" style={{ fontFamily: 'var(--header)' }}>
            How you walk into a room. How close you stand to people. How you look in pictures. How confident you feel face-to-face.
          </p>
          <div className="gold-divider w-48 mx-auto mb-12" />
          <h3 className="text-xl sm:text-2xl lg:text-3xl mt-8 mb-12 tracking-wide leading-relaxed" style={{ fontFamily: 'var(--header)' }}>
            Stop Guessing.<br /><span className="text-[#E2CDB9]">Start Ascending.</span>
          </h3>
          <button
            onClick={() => { setPage('Shop'); window.scrollTo(0, 0); }}
            className="relative group inline-flex items-center gap-3 px-12 py-4 text-sm sm:text-base tracking-[0.2em] uppercase transition-all duration-500 hover:tracking-[0.25em]"
            style={{ fontFamily: 'var(--header)' }}
          >
            <div className="absolute inset-0 border-[1.5px] border-[#E2CDB9]/30 group-hover:border-[#E2CDB9]/60 transition-all duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E2CDB9]/5 to-transparent group-hover:via-[#E2CDB9]/10 transition-all duration-500" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/30 to-transparent blur-sm" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/50 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/30 to-transparent blur-sm" />
            <span className="relative z-10 text-[#E2CDB9]">Shop ASCEND</span>
            <ArrowRight className="relative z-10 w-4 h-4 text-[#E2CDB9]/70 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </FadeIn>
      </section>
    </div>
  );
}
