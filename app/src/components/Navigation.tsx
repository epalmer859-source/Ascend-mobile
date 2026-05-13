import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { CartIcon, MenuIcon, CloseIcon } from './Icons';

const NAV_LINKS = [
  { label: 'Home', route: 'Home' },
  { label: 'Why ASCEND', route: 'Why ASCEND' },
  { label: 'Compare', route: 'Compare' },
  { label: 'Shop', route: 'Shop' },
  { label: 'Reviews', route: 'Reviews' },
  { label: 'Contact', route: 'Contact' },
];

interface NavigationProps {
  page: string;
  setPage: (page: string) => void;
}

export function Navigation({ page, setPage }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user } = useAuth();
  const goToAccount = () => {
    window.location.href = 'https://shopify.com/78718927061/account';
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show nav on Welcome page
  if (page === 'Welcome') return null;

  const handleNavClick = (link: string) => {
    setPage(link);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <nav 
      className={`nav-enter fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-10 py-4 transition-all duration-300 w-full max-w-[100vw] overflow-hidden ${
        scrolled 
          ? 'bg-black/95 backdrop-blur-md border-b border-white/5' 
          : 'bg-transparent'
      }`}
    >
      <div className="grid grid-cols-3 items-center w-full min-w-0">
        {/* Left - Nav links in one line */}
        <div className="flex items-center justify-start gap-4 min-w-0">
          <button 
            className="lg:hidden flex-shrink-0 touch-target min-w-[44px] min-h-[44px] p-2 -m-1 touch-manipulation"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
          <div className="hidden lg:flex items-center flex-nowrap gap-4 xl:gap-5 min-w-0">
            {NAV_LINKS.map((link) => (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className={`text-xs xl:text-sm font-medium tracking-wide transition-all pb-1 flex-shrink-0 whitespace-nowrap ${
                  page === link.route 
                    ? 'text-white border-b border-white' 
                    : 'text-white/80 hover:text-white'
                }`}
                style={page === link.route ? { textShadow: '0 0 10px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.4)' } : { textShadow: '0 0 6px rgba(255,255,255,0.15)' }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center - Logo */}
        <div className="flex items-center justify-center min-w-0">
          <button 
            onClick={() => handleNavClick('Home')}
            className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-wider truncate max-w-full"
            style={{ fontFamily: 'var(--header)' }}
          >
            ASCEND
          </button>
        </div>

        {/* Right - My Account + Profile + Cart */}
        <div className="flex items-center justify-end gap-3 sm:gap-5 min-w-0 flex-shrink-0">
          {!user && (
            <button
              onClick={goToAccount}
              className="hidden sm:inline text-sm font-medium text-white/70 hover:text-[#E2CDB9] transition-colors"
            >
              My Account
            </button>
          )}
          <button
            onClick={goToAccount}
            className="touch-target min-w-[44px] min-h-[44px] p-2 rounded-lg transition-colors text-white/80 hover:text-[#E2CDB9] hover:bg-white/5"
            aria-label="Account"
          >
            <User className="w-6 h-6" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('Cart')}
            className="touch-target min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={`Cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}
          >
            <CartIcon count={totalItems} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] lg:hidden flex flex-col items-center justify-center pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] bg-transparent backdrop-blur-md"
          style={{ fontFamily: 'var(--header)' }}
        >
          <button
            type="button"
            className="absolute top-5 right-5 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/90 hover:text-white touch-manipulation transition-colors"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>

          <nav className="flex flex-col items-center justify-center gap-0 w-full max-w-xs px-8" aria-label="Mobile menu">
            <button type="button" onClick={() => handleNavClick('Home')} className="w-full py-4 text-[1.05rem] font-medium text-white text-center tracking-[0.12em] uppercase opacity-95 hover:opacity-100 transition-opacity">Home</button>
            <button type="button" onClick={() => handleNavClick('Why ASCEND')} className="w-full py-4 text-[1.05rem] font-medium text-white text-center tracking-[0.12em] uppercase opacity-95 hover:opacity-100 transition-opacity">Why ASCEND</button>
            <button type="button" onClick={() => handleNavClick('Compare')} className="w-full py-4 text-[1.05rem] font-medium text-white text-center tracking-[0.12em] uppercase opacity-95 hover:opacity-100 transition-opacity">Compare</button>
            <button type="button" onClick={() => handleNavClick('Shop')} className="w-full py-4 text-[1.05rem] font-medium text-white text-center tracking-[0.12em] uppercase opacity-95 hover:opacity-100 transition-opacity">Shop</button>
            <button type="button" onClick={() => handleNavClick('Reviews')} className="w-full py-4 text-[1.05rem] font-medium text-white text-center tracking-[0.12em] uppercase opacity-95 hover:opacity-100 transition-opacity">Reviews</button>
            <button type="button" onClick={() => handleNavClick('Contact')} className="w-full py-4 text-[1.05rem] font-medium text-white text-center tracking-[0.12em] uppercase opacity-95 hover:opacity-100 transition-opacity">Contact</button>
            <button type="button" onClick={goToAccount} className="w-full py-4 text-[1.05rem] font-medium text-white text-center tracking-[0.12em] uppercase opacity-95 hover:opacity-100 transition-opacity flex items-center justify-center gap-2 mt-2">
              <User className="w-5 h-5 opacity-90" strokeWidth={1.5} /> Account
            </button>
          </nav>
        </div>,
        document.body
      )}
    </nav>
  );
}
