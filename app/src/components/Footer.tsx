import { Stars } from './Icons';
import { ALL_REVIEWS, avgRating } from '@/data/products';

const NAV_LINKS = [
  { label: 'Home', route: 'Home' },
  { label: 'Why ASCEND', route: 'Why ASCEND' },
  { label: 'Compare', route: 'Compare' },
  { label: 'Shop', route: 'Shop' },
  { label: 'Reviews', route: 'Reviews' },
  { label: 'Contact', route: 'Contact' },
];

interface FooterProps {
  setPage: (page: string) => void;
}

export function Footer({ setPage }: FooterProps) {
  const handleNavClick = (link: string) => {
    setPage(link);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="footer-enter border-t border-white/10 py-12 sm:py-16 px-4 sm:px-6 lg:px-10 pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-[var(--bg2)]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        {/* Brand */}
        <div>
          <div 
            className="text-3xl font-bold mb-4 tracking-wider"
            style={{ fontFamily: 'var(--header)' }}
          >
            ASCEND
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Clinical-grade acne control engineered for men who perform. No compromises.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-[#E2CDB9] text-xs tracking-widest uppercase mb-4">
            Navigate
          </h4>
          <div className="space-y-0">
            {NAV_LINKS.map((link) => (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className="block w-full text-left py-3 min-h-[44px] text-white/70 hover:text-[#E2CDB9] transition-colors text-sm touch-manipulation"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* System */}
        <div>
          <h4 className="text-[#E2CDB9] text-xs tracking-widest uppercase mb-4">
            The System
          </h4>
          <div className="space-y-2">
            {['Phase I — Clear', 'Phase II — Restore', 'Phase III — Treat'].map((phase) => (
              <div key={phase} className="text-white/70 text-sm">
                {phase}
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h4 className="text-[#E2CDB9] text-xs tracking-widest uppercase mb-4">
            Reviews
          </h4>
          <div className="flex items-center gap-2 mb-2">
            <Stars count={5} />
            <span className="text-[#E2CDB9] font-bold">{avgRating}</span>
          </div>
          <p className="text-white/70 text-sm">
            {ALL_REVIEWS.length} verified reviews
          </p>
        </div>
      </div>

      <div className="gold-divider w-full max-w-6xl mx-auto mt-10 mb-5" />
      
      <p className="text-center text-white/50 text-xs">
        © 2026 ASCEND™ — All rights reserved. Results may vary.
      </p>
    </footer>
  );
}
