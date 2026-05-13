import { useId, type SVGProps } from 'react';

export function StarIcon({ filled, ...props }: SVGProps<SVGSVGElement> & { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#E2CDB9' : 'none'} stroke="#E2CDB9" strokeWidth="2" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function Stars({ count }: { count: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} filled={i <= count} />
      ))}
    </span>
  );
}

export function RatingStars({ rating = 4.6 }: { rating?: number }) {
  const uid = useId();
  const full = Math.floor(rating);
  const partial = Math.round((rating - full) * 100);

  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        if (i <= full) {
          return (
            <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#E2CDB9" stroke="#E2CDB9" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          );
        }
        if (i === full + 1 && partial > 0) {
          const gradId = `${uid}-partial-${i}`;
          return (
            <svg key={i} width="16" height="16" viewBox="0 0 24 24" stroke="#E2CDB9" strokeWidth="2">
              <defs>
                <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
                  <stop offset={`${partial}%`} stopColor="#E2CDB9" />
                  <stop offset={`${partial}%`} stopColor="transparent" />
                </linearGradient>
              </defs>
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                fill={`url(#${gradId})`}
              />
            </svg>
          );
        }
        return (
          <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E2CDB9" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      })}
    </span>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E2CDB9" strokeWidth="2.5" strokeLinecap="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2.5" strokeLinecap="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function CartIcon({ count, onClick }: { count: number; onClick?: () => void }) {
  return (
    <div onClick={onClick} className="relative cursor-pointer">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-2 bg-[#FF4D6A] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
          {count}
        </span>
      )}
    </div>
  );
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function ChatIcon() {
  return (
    <div className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6B8A] to-[#FF4D6A] flex items-center justify-center cursor-pointer shadow-lg shadow-[#FF4D6A]/40 z-50 hover:scale-110 transition-transform">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    </div>
  );
}
