import type { ReactNode } from 'react';
import { Check, X } from 'lucide-react';

/** Single skincare tube outline — matches full-system lineup shape (repeated ×3 for ASCEND icon). */
const TUBE_PATH =
  'M17 8h14v6l4 8v42a4 4 0 01-4 4H17a4 4 0 01-4-4V22l4-8V8z';

/** Same rows as About “Reality Check” — MOST BRANDS vs ASCEND by variable. */
export const ASCEND_BRAND_COMPARISON_ROWS: { label: string; mostBrands: boolean }[] = [
  { label: 'Excess Oil', mostBrands: false },
  { label: 'Clogged Pores', mostBrands: true },
  { label: 'Bacteria Buildup', mostBrands: true },
  { label: 'Inflammation', mostBrands: false },
  { label: 'Barrier Damage', mostBrands: false },
  { label: 'Sweat + Friction', mostBrands: false },
];

const GRID =
  'grid grid-cols-[minmax(0,1.45fr)_minmax(104px,1fr)_minmax(104px,1fr)]';

function GoldCheckCircle() {
  return (
    <div className="relative mx-auto flex h-10 w-10 shrink-0 items-center justify-center" aria-hidden>
      <div className="absolute inset-0 rounded-full border-[1.5px] border-[#E2CDB9]/40" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#E2CDB9]/[0.12] via-transparent to-[#E2CDB9]/[0.06]" />
      <div className="absolute inset-x-[6px] top-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/60 to-transparent" />
      <div className="absolute inset-x-[6px] top-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/30 to-transparent blur-[2px]" />
      <div className="absolute inset-x-[6px] bottom-0 h-px bg-gradient-to-r from-transparent via-[#E2CDB9]/40 to-transparent" />
      <Check className="relative z-10 h-[18px] w-[18px] text-[#E2CDB9]" strokeWidth={2.75} />
    </div>
  );
}

function MutedOthersCheck() {
  return (
    <div className="relative mx-auto flex h-10 w-10 shrink-0 items-center justify-center" aria-hidden>
      <div className="absolute inset-0 rounded-full border border-white/[0.14]" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.06] via-transparent to-white/[0.03]" />
      <div className="absolute inset-x-[6px] top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="absolute inset-x-[6px] bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <Check className="relative z-10 h-4 w-4 text-white/44" strokeWidth={2.5} />
    </div>
  );
}

function GreyOthersX() {
  return (
    <div className="relative mx-auto flex h-10 w-10 shrink-0 items-center justify-center" aria-hidden>
      <div className="absolute inset-0 rounded-full border border-white/[0.08]" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.03] via-transparent to-white/[0.015]" />
      <div className="absolute inset-x-[8px] top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      <X className="relative z-10 h-[17px] w-[17px] text-white/22" strokeWidth={2.25} />
    </div>
  );
}

function GenericBottleSilhouette({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d={TUBE_PATH}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity={1}
      />
      <line x1="20" y1="28" x2="28" y2="28" stroke="currentColor" strokeWidth="1" opacity={0.72} />
      <line x1="20" y1="36" x2="28" y2="36" stroke="currentColor" strokeWidth="1" opacity={0.72} />
    </svg>
  );
}

/** Three-phase lineup: same tube silhouette as “most brands,” gold, vector-only (no photo). */
function AscendThreeTubesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 118 72"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {[0, 38, 76].map((tx) => (
        <g key={tx} transform={`translate(${tx},0)`}>
          <path
            d={TUBE_PATH}
            fill="currentColor"
            fillOpacity={0.08}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <line x1="20" y1="28" x2="28" y2="28" stroke="var(--gold)" strokeWidth={1} opacity={0.65} />
          <line x1="20" y1="36" x2="28" y2="36" stroke="var(--gold)" strokeWidth={1} opacity={0.65} />
        </g>
      ))}
    </svg>
  );
}

interface AscendBrandComparisonProps {
  className?: string;
  headingClassName?: string;
  showHeader?: boolean;
  /** Display headline (large, high-impact). */
  title?: string;
  /** Supporting copy — string uses default styling, or pass JSX for custom hierarchy. */
  subtitle?: ReactNode;
  footer?: ReactNode;
}

export function AscendBrandComparison({
  className = '',
  headingClassName = 'mb-12 text-center sm:mb-16',
  showHeader = true,
  title = 'REALITY CHECK',
  subtitle = 'Most brands fix symptoms. ASCEND controls variables.',
  footer,
}: AscendBrandComparisonProps) {
  return (
    <div className={className}>
      {showHeader && (
        <div className={`${headingClassName} mx-auto max-w-4xl px-2 sm:px-4`}>
          <h2
            className="mx-auto max-w-[22ch] text-balance text-[clamp(1.75rem,4.4vw,3.1rem)] font-semibold leading-[1.06] tracking-[0.11em] text-white"
            style={{ fontFamily: 'var(--header)' }}
          >
            {title}
          </h2>
          {typeof subtitle === 'string' ? (
            <p className="mx-auto mt-4 max-w-3xl text-pretty text-base font-light leading-relaxed text-white/72 sm:text-lg lg:text-xl">
              {subtitle}
            </p>
          ) : (
            <div className="mx-auto mt-4 max-w-3xl">{subtitle}</div>
          )}
        </div>
      )}

      <div
        className="mx-auto max-w-4xl overflow-x-auto rounded-2xl border border-white/[0.1] bg-gradient-to-b from-[#141414] to-[#070707] shadow-[0_12px_48px_rgba(0,0,0,0.5)]"
        role="region"
        aria-label="ASCEND compared to most brands"
      >
        <div className="min-w-[min(100%,380px)] sm:min-w-0">
          {/* Column headers: question | most brands (first “knockout”) | ascend (winner) */}
          <div className={`${GRID} border-b border-white/10`}>
            <div className="flex flex-col justify-center border-r border-white/10 px-4 py-5 sm:px-6 sm:py-6">
              <p
                className="text-left text-[16px] font-semibold leading-snug text-white sm:text-[18px] lg:text-[19px]"
                style={{ fontFamily: 'var(--header)' }}
              >
                Why choose <span className="text-[var(--gold)]">ASCEND</span>?
              </p>
            </div>

            {/* Middle: most brands — same deep fill as before; strokes/icons read a touch clearer */}
            <div className="flex flex-col items-center justify-end border-r border-white/10 bg-[#0a0a0a] px-2 py-5 sm:py-6">
              <GenericBottleSilhouette className="mb-3 h-[3.75rem] w-11 text-[#d4cfc8] sm:h-16 sm:w-12" />
              <span
                className="max-w-[5.5rem] text-center text-[9px] font-bold leading-tight tracking-[0.14em] text-[#d4cfc8] sm:max-w-none sm:text-[10px] sm:tracking-[0.18em]"
                style={{ fontFamily: 'var(--header)' }}
              >
                MOST BRANDS
              </span>
            </div>

            {/* Right: ASCEND — emphasis */}
            <div className="relative flex flex-col items-center justify-end overflow-hidden bg-[#0a0a0a] px-2 py-5 sm:py-6">
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--gold)]/[0.1] via-transparent to-transparent"
                aria-hidden
              />
              <div className="relative z-[1] flex w-full flex-col items-center">
                <div className="mb-3 flex h-[3.75rem] w-full max-w-[9rem] items-center justify-center sm:h-16 sm:max-w-[10rem]">
                  <AscendThreeTubesIcon className="h-full w-full max-h-[3.75rem] text-white drop-shadow-[0_4px_18px_rgba(226,205,185,0.22)] sm:max-h-16" />
                </div>
                <span
                  className="text-center text-[10px] font-bold tracking-[0.28em] text-white sm:text-xs"
                  style={{ fontFamily: 'var(--header)' }}
                >
                  ASCEND
                </span>
              </div>
            </div>
          </div>

          {/* Rows */}
          {ASCEND_BRAND_COMPARISON_ROWS.map((row, i) => (
            <div
              key={row.label}
              className={`${GRID} border-t border-white/[0.06] ${
                i % 2 === 0 ? 'bg-black/20' : 'bg-transparent'
              }`}
            >
              <div className="flex min-h-[56px] items-center border-r border-white/10 px-4 py-3 sm:min-h-[60px] sm:px-6 sm:py-3.5">
                <span className="text-left text-[14px] leading-snug text-white/88 sm:text-[15px] lg:text-base" style={{ fontFamily: 'var(--header)' }}>{row.label}</span>
              </div>
              <div className="flex min-h-[56px] items-center justify-center border-r border-white/10 bg-[#0a0a0a] px-2 py-2.5 sm:min-h-[60px]">
                {row.mostBrands ? <MutedOthersCheck /> : <GreyOthersX />}
              </div>
              <div className="flex min-h-[56px] items-center justify-center bg-[#0a0a0a] px-2 py-2.5 sm:min-h-[60px]">
                <GoldCheckCircle />
              </div>
            </div>
          ))}
        </div>
      </div>

      {footer}
    </div>
  );
}
