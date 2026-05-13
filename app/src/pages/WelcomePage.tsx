import { FadeIn } from '@/components/FadeIn';
import { ArrowRight, FlaskConical, Zap, RotateCcw } from 'lucide-react';

interface WelcomePageProps {
  setPage: (page: string) => void;
}

export function WelcomePage({ setPage }: WelcomePageProps) {

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)' }}
      >
        {/* Background Glow */}
        <div 
          className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
          style={{ 
            background: 'radial-gradient(ellipse, rgba(212,165,116,0.08) 0%, transparent 60%)',
            filter: 'blur(80px)'
          }}
        />

        {/* Floating Particles */}
        <div className="absolute top-[20%] left-[15%] w-1 h-1 bg-[#E2CDB9] rounded-full opacity-30 animate-pulse" />
        <div className="absolute top-[35%] right-[20%] w-1.5 h-1.5 bg-[#E2CDB9] rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[25%] left-[25%] w-1 h-1 bg-[#E2CDB9] rounded-full opacity-25 animate-pulse" style={{ animationDelay: '0.5s' }} />

        <FadeIn className="flex flex-col items-center">
          {/* Logo */}
          <div 
            className="text-sm tracking-[0.3em] text-[#E2CDB9] mb-16"
            style={{ fontFamily: 'var(--header)' }}
          >
            ASCEND
          </div>

          {/* Main Headline */}
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl text-center mb-4 leading-tight"
            style={{ fontFamily: 'var(--header)' }}
          >
            Clear Skin Is
            <br />
            <span className="text-[#E2CDB9]">Closer Than You Think.</span>
          </h1>

          {/* Futuristic glowing divider */}
          <div 
            className="w-48 sm:w-64 h-px my-6 mx-auto"
            style={{ 
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.15) 80%, transparent 100%)',
              boxShadow: '0 0 12px rgba(255,255,255,0.4), 0 0 24px rgba(255,255,255,0.2)'
            }}
          />

          <p 
            className="text-base sm:text-lg text-white text-center max-w-md mb-12 leading-relaxed tracking-widest uppercase mx-auto"
            style={{ fontFamily: 'var(--header)' }}
          >
            This is where you ASCEND.
          </p>
        </FadeIn>

        {/* Join the team / Sign up or Log in */}
        <FadeIn className="w-full max-w-md" delay={0.2} direction="scale">
          <div 
            className="p-8 sm:p-10 rounded-2xl"
            style={{ 
              background: 'linear-gradient(145deg, rgba(212,165,116,0.1), rgba(0,0,0,0.6))',
              border: '1px solid rgba(212,165,116,0.3)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(212,165,116,0.1)'
            }}
          >
            <h2 className="text-2xl sm:text-3xl mb-7 text-center" style={{ fontFamily: 'var(--header)' }}>
              Begin The Upgrade
            </h2>

            <button 
              onClick={() => setPage('Home')}
              className="w-full flex items-center justify-center gap-2 py-4 px-8 bg-[#E2CDB9] text-black font-semibold rounded-lg hover:bg-[#E8C49A] transition-colors text-lg"
              style={{ fontFamily: 'var(--header)' }}
            >
              Get started <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </FadeIn>
      </section>

      {/* Features Bar */}
      <section className="py-10 px-6 bg-[var(--bg2)] border-t border-white/10">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-x-8 gap-y-4 sm:gap-x-12">
          <div className="flex items-center gap-3 whitespace-nowrap flex-shrink-0">
            <FlaskConical className="w-5 h-5 text-[#E2CDB9]" />
            <span className="text-sm text-white/70">Clinically Validated Performance</span>
          </div>
          <div className="flex items-center gap-3 whitespace-nowrap flex-shrink-0">
            <Zap className="w-5 h-5 text-[#E2CDB9]" />
            <span className="text-sm text-white/70">Performance-Driven Formulations</span>
          </div>
          <div className="flex items-center gap-3 whitespace-nowrap flex-shrink-0">
            <span className="text-xl">🇺🇸</span>
            <span className="text-sm text-white/70">Made in USA</span>
          </div>
          <div className="flex items-center gap-3 whitespace-nowrap flex-shrink-0">
            <RotateCcw className="w-5 h-5 text-[#E2CDB9]" />
            <span className="text-sm text-white/70">30 day money back guaranteed</span>
          </div>
        </div>
      </section>
    </div>
  );
}
