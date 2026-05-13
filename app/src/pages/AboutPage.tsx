import { FadeIn } from '@/components/FadeIn';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { AscendBrandComparison } from '@/components/AscendBrandComparison';
import { ArrowRight, Droplets, Microscope, ShieldPlus, Flame, Waves } from 'lucide-react';

interface AboutPageProps {
  setPage: (page: string) => void;
  /** When true, render as a section (no top spacer) for use inside Home scroll */
  embedded?: boolean;
}

const pillars = [
  { label: "OIL\nREGULATION" },
  { label: "BACTERIA\nCONTROL" },
  { label: "BARRIER\nREPAIR" },
  { label: "INFLAMMATION\nCONTROL" },
  { label: "SWEAT &\nFRICTION MGMT" },
];

export function AboutPage({ setPage, embedded }: AboutPageProps) {
  return (
    <div id={embedded ? 'ascend-protocol' : undefined}>
      {!embedded && (
        <div className="h-20 bg-black" aria-hidden />
      )}
      {/* Hero Section - all text Jura (header font) */}
      <section 
        className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-28 relative"
        style={{ 
          background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.7) 100%), url(https://raw.githubusercontent.com/epalmer859-source/Photos/main/about-bg%5B1%5D.png) center/cover no-repeat',
          fontFamily: 'var(--header)'
        }}
      >
        <FadeIn>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal mb-2">
            Clear skin.
          </h1>
          <p className="text-2xl sm:text-3xl lg:text-4xl text-[#E2CDB9] italic">
            It's closer than you think.
          </p>
        </FadeIn>

        <FadeIn className="mt-20 max-w-2xl relative z-10">
          <p className="text-lg italic leading-relaxed">
            At ASCEND, we believe every man deserves a complete acne system that actually makes sense — not a pile of random products that drains his wallet.
          </p>
          <button
            onClick={() => { setPage('Compare'); window.scrollTo(0, 0); }}
            className="relative group inline-flex items-center gap-3 px-12 py-4 text-sm sm:text-base tracking-[0.2em] uppercase transition-all duration-500 hover:tracking-[0.25em] mt-12"
            style={{ fontFamily: 'var(--header)' }}
          >
            <div className="absolute inset-0 border-[1.5px] border-[#E2CDB9]/30 group-hover:border-[#E2CDB9]/60 transition-all duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E2CDB9]/5 to-transparent group-hover:via-[#E2CDB9]/10 transition-all duration-500" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/30 to-transparent blur-sm" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/50 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/30 to-transparent blur-sm" />
            <span className="relative z-10 text-[#E2CDB9]">Compare The System</span>
            <ArrowRight className="relative z-10 w-4 h-4 text-[#E2CDB9]/70 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </FadeIn>
      </section>

      {/* System Architecture Section - black background */}
      <section id="system-architecture" className="py-24 px-6 relative overflow-hidden bg-black">
        {/* Background Effects */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, rgba(212,165,116,0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(212,165,116,0.03) 0%, transparent 40%)'
          }}
        />
        <div className="absolute top-0 left-[10%] w-px h-full bg-gradient-to-b from-transparent via-[#E2CDB9]/10 to-transparent" />
        <div className="absolute top-0 right-[10%] w-px h-full bg-gradient-to-b from-transparent via-[#E2CDB9]/10 to-transparent" />
        <div className="absolute top-[30%] left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/5 to-transparent" />

        {/* Side Stats */}
        <div className="absolute left-[14%] top-1/2 -translate-y-1/2 text-left hidden lg:block">
          {[
            ['3', 'PHASES'],
            ['5', 'COMMON STRESSORS'],
            ['1', 'OUTCOME']
          ].map(([num, label], i) => (
            <div key={i} className="mb-10">
              <div className="text-4xl font-bold text-[#E2CDB9] tracking-wide" style={{ fontFamily: 'var(--header)' }}>{num}</div>
              <div className="text-xs tracking-widest text-white mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Key Actives */}
        <div className="absolute right-[12%] top-1/2 -translate-y-1/2 text-right hidden lg:block">
          <div className="text-xs tracking-widest text-white mb-5" style={{ textShadow: '0 0 8px rgba(255,255,255,0.5)' }}>KEY ACTIVES</div>
          {['Salicylic Acid', 'Sulfur Complex', 'Azelaic Acid', 'Zinc PCA'].map((active, i) => (
            <div 
              key={i} 
              className="mb-4 px-4 py-2.5 rounded border border-white/20"
              style={{ background: 'rgba(255,255,255,0.05)', boxShadow: '0 0 12px rgba(255,255,255,0.15), 0 0 24px rgba(255,255,255,0.08)' }}
            >
              <div className="text-sm font-medium text-white" style={{ textShadow: '0 0 6px rgba(255,255,255,0.4)' }}>{active}</div>
            </div>
          ))}
        </div>

        <FadeIn className="relative z-10 text-center">
          <h2 
            className="text-4xl sm:text-5xl tracking-widest mb-4"
            style={{ fontFamily: 'var(--header)' }}
          >
            System Architecture
          </h2>
          <p className="text-[#E2CDB9] text-lg italic mb-6">Five pillars. One integrated approach.</p>

          {/* Phase Flow */}
          <div className="flex items-center justify-center gap-3 mb-12 text-sm tracking-widest text-white">
            <span>PHASE I</span>
            <span>→</span>
            <span>PHASE II</span>
            <span>→</span>
            <span>PHASE III</span>
          </div>

          <div className="max-w-4xl mx-auto relative">
            {/* Clear Skin Result */}
            <div className="relative inline-block mb-12">
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-20"
                style={{ 
                  background: 'radial-gradient(ellipse, rgba(212,165,116,0.15) 0%, transparent 70%)',
                  filter: 'blur(20px)'
                }}
              />
              <div 
                className="relative px-16 py-7 rounded-lg border border-[#E2CDB9]/50"
                style={{ 
                  background: 'linear-gradient(145deg, rgba(212,165,116,0.12), rgba(212,165,116,0.03))',
                  boxShadow: '0 8px 32px rgba(212,165,116,0.15), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}
              >
                <span className="text-2xl tracking-widest font-semibold" style={{ fontFamily: 'var(--header)' }}>CLEAR SKIN</span>
              </div>
            </div>

            {/* Connector */}
            <div className="absolute left-1/2 top-20 w-0.5 h-12 -translate-x-1/2 bg-gradient-to-b from-[#E2CDB9] to-[#E2CDB9]/20">
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#E2CDB9]" />
              <div className="absolute top-11 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#E2CDB9]" />
            </div>

            {/* Five Pillars */}
            <div className="flex justify-center gap-4 flex-wrap mb-12 relative mt-8">
              <div className="absolute top-7 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/15 to-transparent" />
              
              {pillars.map((pillar, i) => (
                <div key={i} className="flex flex-col items-center gap-3.5 relative">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center border border-white/10"
                    style={{ 
                      background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, #000 70%)',
                      boxShadow: '0 0 14px rgba(255,255,255,0.2), 0 0 28px rgba(255,255,255,0.08)'
                    }}
                  >
                    {[
                      <Droplets key={0} className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />,
                      <Microscope key={1} className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />,
                      <ShieldPlus key={2} className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />,
                      <Flame key={3} className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />,
                      <Waves key={4} className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                    ][i]}
                  </div>
                  <div 
                    className="px-4 py-4 rounded-md text-xs tracking-wider font-medium whitespace-pre-line text-center min-w-[130px] leading-relaxed relative border border-white/10"
                    style={{ 
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#E2CDB9]/30" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#E2CDB9]/30" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#E2CDB9]/30" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#E2CDB9]/30" />
                    {pillar.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Connector */}
            <div className="relative h-12 mb-0">
              <div className="absolute left-1/2 top-0 w-0.5 h-12 -translate-x-1/2 bg-gradient-to-b from-[#E2CDB9]/30 to-[#E2CDB9]">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#E2CDB9]" />
              </div>
            </div>

            {/* The Ascend System */}
            <div className="relative inline-block">
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-24"
                style={{ 
                  background: 'radial-gradient(ellipse, rgba(212,165,116,0.2) 0%, transparent 70%)',
                  filter: 'blur(25px)'
                }}
              />
              <button 
                onClick={() => { setPage('Our System'); window.scrollTo(0,0); }}
                className="relative px-20 py-7 rounded-lg border border-[#E2CDB9]/60 hover:border-[#E2CDB9] hover:-translate-y-0.5 transition-all"
                style={{ 
                  background: 'linear-gradient(145deg, rgba(212,165,116,0.2), rgba(212,165,116,0.05))',
                  boxShadow: '0 12px 50px rgba(212,165,116,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                }}
              >
                <span className="text-xl tracking-widest font-semibold" style={{ fontFamily: 'var(--header)' }}>THE ASCEND SYSTEM</span>
                <span className="block text-xs text-[#E2CDB9] mt-2.5 tracking-widest">Click to explore →</span>
              </button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Reality Check Section - gym image behind chart */}
      <section 
        className="section-pad relative overflow-hidden"
        style={{
          backgroundImage: 'url(/about-gym-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/30" aria-hidden />
        <div className="relative z-10">
        <FadeIn>
          <AscendBrandComparison
            footer={
              <p className="text-center text-[#E2CDB9] italic text-2xl mt-8" style={{ fontFamily: 'var(--header)' }}>
                Control the variables. Own the outcome.
              </p>
            }
          />
        </FadeIn>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-pad">
        <FadeIn>
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <h2 
                className="text-2xl sm:text-3xl lg:text-4xl leading-snug mb-5"
                style={{ fontFamily: 'var(--header)' }}
              >
                You Built the Physique.<br /> <span className="text-[#E2CDB9]">We Perfect the Surface.</span>
              </h2>
              <p className="text-base text-white mb-7">
                A 3-phase clinical system designed to clear acne for good.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { setPage('Shop'); window.scrollTo(0,0); }}
                  className="btn-outline w-fit border-[#E2CDB9] text-[#E2CDB9] hover:border-[#E2CDB9] hover:text-[#E2CDB9] hover:bg-[#E2CDB9]/5"
                  style={{ boxShadow: '0 0 20px rgba(226, 205, 185, 0.25), 0 0 40px rgba(226, 205, 185, 0.1)' }}
                >
                  See if you're a fit
                </button>
                <button 
                  onClick={() => { setPage('Why ASCEND'); window.scrollTo(0,0); }}
                  className="btn-outline w-fit border-[#E2CDB9] text-[#E2CDB9] hover:border-[#E2CDB9] hover:text-[#E2CDB9] hover:bg-[#E2CDB9]/5"
                  style={{ boxShadow: '0 0 20px rgba(226, 205, 185, 0.25), 0 0 40px rgba(226, 205, 185, 0.1)' }}
                >
                  Learn How It Works <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="h-96 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
              <ImageWithFallback 
                src="/ascend-breed-of-man.png" 
                alt="You Built the Physique. We Perfect the Surface."
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
