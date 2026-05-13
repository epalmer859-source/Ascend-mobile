import { useEffect, useRef, type ReactNode } from 'react';

type FadeDirection = 'up' | 'left' | 'right' | 'scale';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Entrance direction: up (default), left, right, scale */
  direction?: FadeDirection;
  /** Stagger delay in seconds (e.g. 0.1 for 100ms) */
  delay?: number;
}

export function FadeIn({ children, className = '', style, direction = 'up', delay }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const directionClass = direction === 'up' ? '' : direction === 'left' ? 'slide-left' : direction === 'right' ? 'slide-right' : 'scale-in';
  const combinedStyle = {
    ...style,
    ...(delay != null && delay > 0 ? { transitionDelay: `${delay}s` } : {}),
  };

  return (
    <div ref={ref} className={`fade-section ${directionClass} ${className}`.trim()} style={combinedStyle}>
      {children}
    </div>
  );
}
