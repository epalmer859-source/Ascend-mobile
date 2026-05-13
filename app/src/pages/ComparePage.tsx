import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FadeIn } from '@/components/FadeIn';
import { AscendBrandComparison } from '@/components/AscendBrandComparison';
import { ArrowRight, Check, X } from 'lucide-react';

const ACCUTANE_SIDE_EFFECTS = {
  source: 'Mayo Clinic',
  disclaimer: 'Along with its needed effects, a medicine may cause some unwanted effects. Although not all of these side effects may occur, if they do occur they may need medical attention.',
  sections: [
    {
      title: 'Check with your doctor immediately if any of the following side effects occur:',
      groups: [
        {
          label: 'More Common',
          items: ['Bone or joint pain', 'Burning, redness, itching, or other signs of eye inflammation', 'Difficulty with moving', 'Nosebleeds', 'Scaling, redness, burning, pain, or other signs of inflammation of the lips', 'Skin infection or rash'],
        },
        {
          label: 'Rare',
          items: ['Attempts at suicide or thoughts of suicide (usually stops after medicine is stopped)', 'Back pain', 'Bleeding or inflammation of the gums', 'Blurred vision or other changes in vision', 'Changes in behavior', 'Decreased vision after sunset or before sunrise (sudden or may continue after medicine is stopped)', 'Diarrhea (severe)', 'Headache (severe or continuing)', 'Mental depression', 'Nausea', 'Pain or tenderness of the eyes', 'Pain, tenderness, or stiffness in the muscles (long-term treatment)', 'Rectal bleeding', 'Stomach pain (severe)', 'Vomiting', 'Yellow eyes or skin'],
        },
        {
          label: 'Incidence Not Known',
          items: ['Black, tarry stools', 'Blistering, peeling, or loosening of the skin', 'Bloating', 'Bloody cough', 'Bloody or cloudy urine', 'Bone tenderness or aching', 'Burning or stinging of the skin', 'Chest pain or tightness', 'Confusion', 'Constipation', 'Continuing ringing or buzzing, or other unexplained noise in the ears', 'Cough', 'Dark-colored urine', 'Decrease in height', 'Difficulty breathing', 'Difficulty speaking', 'Difficulty swallowing', 'Discharge from the eyes', 'Dizziness', 'Double vision', 'Ear pain', 'Excessive tearing', 'Fainting', 'Fast, irregular, pounding, or racing heartbeat or pulse', 'Fever with or without chills', 'Fractures or delayed healing', 'Heartburn', 'High blood pressure', 'Hives, itching, or skin rash', 'Hoarseness', 'Inability to move the arms, legs, or facial muscles', 'Inability to speak', 'Indigestion', 'Inflamed tissue from infection', 'Irregular yellow patch or lump on the skin', 'Irritation', 'Joint redness, stiffness, or swelling', 'Lack or slowing of normal growth in children', 'Loosening of the fingernails', 'Loss of appetite', 'Loss of bladder control', 'Loss or change in hearing', 'Muscle cramps, pain, spasms, or weakness', 'Pain in the ribs, arms, or legs', 'Pain or burning in the throat', 'Pain or tenderness around the eyes and cheekbones', 'Painful cold sores or blisters on the lips, nose, eyes, or genitals', 'Painful or difficult urination', 'Pains in the chest, groin, or legs, especially calves of the legs', 'Pains in the stomach, side, or abdomen, possibly radiating to the back', 'Pale skin', 'Pinpoint red spots on the skin', 'Red irritated eyes', 'Red skin lesions, often with a purple center', 'Redness or soreness around the fingernails', 'Redness, soreness, or itching skin', 'Seizures', 'Sensitivity of the eyes to sunlight', 'Sneezing', 'Sore throat', 'Sores, ulcers, or white spots on the lips or tongue or inside the mouth', 'Stuffy or runny nose', 'Sudden loss of consciousness', 'Sudden loss of coordination', 'Sudden onset of severe acne on the chest and trunk', 'Sudden onset of slurred speech', 'Swelling of the eyelids, face, lips, hands, lower legs, or feet', 'Swollen, painful or tender lymph glands in the neck, armpit, or groin', 'Unusual bleeding or bruising', 'Unusual tiredness or weakness', 'Unusual weight gain or loss', 'Use of extreme physical or emotional force', 'Watery or bloody diarrhea'],
        },
      ],
    },
    {
      title: 'Some side effects may occur that usually do not need medical attention. These side effects may go away during treatment as your body adjusts to the medicine. Check with your health care professional if any of the following side effects continue or are bothersome:',
      groups: [
        {
          label: 'More Common',
          items: ['Crusting of the skin', 'Difficulty in wearing contact lenses (may continue after medicine is stopped)', 'Dryness of the eyes (may continue after treatment is stopped)', 'Dryness of the mouth or nose', 'Dryness or itching of the skin', 'Headache (mild)', 'Increased sensitivity of the skin to sunlight', 'Peeling of the skin on palms of the hands or soles of the feet', 'Stomach upset', 'Thinning of the hair (may continue after treatment is stopped)'],
        },
        {
          label: 'Incidence Not Known',
          items: ['Abnormal menstruation', 'Burning, crawling, itching, numbness, prickling, "pins and needles", or tingling feeling', 'Changes in fingernails or toenails', 'Dandruff', 'Darkening of the skin', 'Hair abnormalities', 'Hair loss', 'Increased hair growth, especially on the face', 'Lightening of normal skin color', 'Lightening of treated areas of dark skin', 'Nervousness', 'Oily skin', 'Redness of the face', 'Severe sunburn', 'Skin rash, encrusted, scaly and oozing', 'Stomach burning', 'Sweating', 'Trouble sleeping', 'Unusual drowsiness, dullness, tiredness, weakness, or feeling of sluggishness', 'Unusually warm skin of the face', 'Voice changes'],
        },
      ],
    },
  ],
};

interface ComparePageProps {
  setPage: (page: string) => void;
}


const ACNE_ROUTINES = [
  {
    name: 'Tiege Hanley',
    price: '$60+',
    what: "Men's routine / acne routine",
    tagline: 'Routine-first. Acne-second.',
    pitch: 'Tiege gives men a basic skincare routine — wash, moisturize, scrub, eye care.\n\nBut it does not give a true acne treatment phase.\n\nASCEND gives men a full acne system: cleanse, recover, treat — with a dedicated 150 mL 15% azelaic acid treatment phase.',
    loses: ['No dedicated acne treatment phase', 'More grooming than acne control', 'Smaller product sizes', 'No 15% azelaic acid', 'Less built for breakouts, redness, and post-acne marks'],
    wins: ['Full 3-phase acne system', 'Dedicated treatment step', '150 mL azelaic acid phase', 'More acne-focused actives', 'More volume and better long-term value'],
    advantage: 'Smaller supply, less treatment-volume story',
  },
  {
    name: 'BASED',
    price: '~$60 sale / ~$86 regular',
    what: 'General skincare kit',
    tagline: 'General skincare. Not acne control.',
    pitch: 'BASED gives men a basic skincare kit.\n\nASCEND gives men a full acne system: cleanse, recover, treat — with 450 mL total, 4 acne actives, and a dedicated 15% azelaic acid phase.\n\nASCEND is also built for men with zero-tack, zero-grease leave-ons — no sticky film, no shiny skincare face.',
    loses: ['No true acne treatment phase', 'Smaller total volume', 'No 15% azelaic acid', 'Less acne-focused'],
    wins: ['Full acne protocol', 'More product', 'More acne actives', 'Zero-tack leave-on finish'],
    advantage: 'ASCEND has more volume and stronger acne focus',
  },
  {
    name: 'Brickell',
    price: '$90',
    what: 'Acne system with 0.5 oz spot treatment',
    tagline: 'Premium price. Mostly salicylic acid. Tiny spot treatment.',
    pitch: 'Brickell charges more, but its acne system mainly leans on 2% salicylic acid, and the spot treatment is only about 15 mL.\n\nASCEND gives you a full 150 mL treatment phase with 15% azelaic acid, plus salicylic acid, sulfur, and niacinamide across the system.',
    loses: ['Higher price', 'Tiny spot treatment', 'Mostly salicylic-acid focused', 'No 15% azelaic acid phase', 'Less complete active strategy'],
    wins: ['Roughly 10x more treatment volume', 'Lower system price', '4 acne-focused actives', 'Dedicated 15% azelaic acid treatment', 'Zero-tack treatment finish'],
    advantage: 'ASCEND treatment is about 10x bigger',
  },
];

const PRESCRIPTION_PHARMA = [
  {
    name: 'Proactiv',
    price: '$91.80',
    priceSuffix: '/ 3-month system',
    what: 'Benzoyl peroxide acne system',
    tagline: 'Higher price. Less product. Harsher active strategy.',
    priceCompare: [
      { label: 'Proactiv', value: '$91.80 / 3-month system' },
      { label: 'ASCEND', value: '$78 / 450 mL / up to 4 months' },
    ],
    pitch: 'Proactiv costs more, lasts less, and relies on benzoyl peroxide — an active that can be harsh and drying. ASCEND uses a smoother 4-active system with zero-tack leave-ons.',
    loses: ['Higher price', 'Shorter supply', 'Less product volume', 'About $30.60/month vs ASCEND at $19.50/month', 'Benzoyl peroxide can be harsh for some users', 'No dedicated 15% azelaic acid treatment phase', 'No sulfur complex', 'Not built specifically for men', 'No zero-tack leave-on finish'],
    wins: ['More product, lower monthly cost', 'More complete active strategy', 'Dedicated 15% azelaic acid treatment phase', 'Zero-tack moisturizer + treatment', 'No greasy film or shiny "skincare face"', 'Built specifically for men'],
    advantage: 'Proactiv gives you a traditional benzoyl peroxide acne system. ASCEND gives men more product, lower monthly cost, smoother actives, and zero-tack phases built to leave no greasy film.',
  },
  {
    name: 'Accutane (Isotretinoin)',
    price: '$1,500–$6,000',
    priceSuffix: 'without insurance for the full course',
    what: 'Prescription oral medication',
    tagline: 'Nuclear option. Serious side effects.',
    priceCompare: [
      { label: 'Accutane (No Insurance)', value: '$1,500–$6,000 / full course' },
      { label: 'Accutane (With Insurance)', value: 'Free–$200 if accepted' },
      { label: 'ASCEND', value: '$78 / 450 mL / up to 4 months' },
    ],
    pitch: 'Accutane works for severe acne, but comes with blood tests, doctor visits, and harsh side effects.\n\nASCEND gives men a serious non-prescription acne protocol first:\n\nNo pills. No blood work. No monthly prescription process. No systemic medication.\n\nJust cleanse, recover, treat.\n\nSide note — If you drink, isotretinoin becomes an even bigger commitment. Alcohol and Accutane both stress the liver, making monitoring and blood work even more important.',
    loses: ['Requires prescription', 'Harsh side effects', 'Monthly blood work', 'Dry skin, lips, joints'],
    wins: ['No prescription needed', 'No systemic medication', 'Start immediately', 'Topical system'],
    advantage: 'No doctor visits, no side effects',
    hasSideEffects: true,
  },
  {
    name: 'Tretinoin (Retin-A)',
    price: '$50–$150+/mo',
    priceSuffix: 'without insurance / Free–$30 with insurance',
    what: 'Prescription retinoid',
    tagline: 'Effective but brutal adjustment period.',
    pitch: 'Tretinoin can be effective long-term, but the adjustment period can be rough — dryness, peeling, irritation, sun sensitivity, and purging can make a lot of men quit.\n\nASCEND is built as a serious non-prescription acne system designed to be easier to start and easier to stay consistent with.',
    loses: ['Prescription required', 'Purging phase', 'Sun sensitivity', 'Irritation and peeling'],
    wins: ['No prescription required', 'Designed for daily tolerance', 'Built-in barrier recovery', 'Zero-tack finish'],
    advantage: 'No purging, no prescription, immediate use',
  },
  {
    name: 'Curology / Apostrophe',
    price: '$20–$40+/mo',
    what: 'Telehealth custom prescription',
    tagline: 'Custom formula. Ongoing subscription cost.',
    pitch: 'Curology and Apostrophe give you a custom prescription cream, but you pay monthly forever.\nASCEND gives you a complete system you own.',
    loses: ['Ongoing subscription', 'Small monthly bottle', 'No full system', 'Dependent on provider'],
    wins: ['No subscription required', '450 mL total', 'Full 3-phase system', 'No forced monthly refill'],
    advantage: 'No subscription lock-in, full system ownership',
  },
  {
    name: 'Benzoyl Peroxide (OTC)',
    price: '$5–$15',
    what: 'Over-the-counter spot treatment',
    tagline: 'Cheap upfront. Harsh for some. Incomplete alone.',
    pitch: 'Benzoyl peroxide attacks acne bacteria. Azelaic acid goes further — targeting acne, redness, inflammation, and post-acne marks without the bleaching problem.',
    loses: ['Dries skin out', 'Bleaches clothes and sheets', 'No barrier recovery', 'Single-ingredient approach'],
    wins: ['15% azelaic acid treatment phase', 'Targets acne + redness + post-acne marks', 'No fabric bleaching', 'Smoother leave-on experience'],
    advantage: 'Complete system vs. single harsh ingredient',
  },
];


const TABS = [
  { key: 'acne-systems', label: 'Acne Systems' },
  { key: 'prescriptions', label: 'Prescriptions' },
  { key: 'mens-routines', label: "Men's Routines" },
] as const;

type TabKey = typeof TABS[number]['key'];

function getBrandsForTab(tab: TabKey) {
  if (tab === 'acne-systems') return PRESCRIPTION_PHARMA.filter(b => b.name === 'Proactiv' || b.name === 'Benzoyl Peroxide (OTC)');
  if (tab === 'prescriptions') return PRESCRIPTION_PHARMA.filter(b => b.name === 'Accutane (Isotretinoin)' || b.name === 'Tretinoin (Retin-A)' || b.name === 'Curology / Apostrophe');
  if (tab === 'mens-routines') return [...ACNE_ROUTINES];
  return [];
}

export function ComparePage({ setPage }: ComparePageProps) {
  const [tab, setTab] = useState<TabKey>('acne-systems');
  const [sideEffectsOpen, setSideEffectsOpen] = useState(false);
  const activeBrands = getBrandsForTab(tab);

  return (
    <div>
      {/* Hero */}
      <section
        className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 py-36 relative"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.75) 100%), url(/compare-hero-bg.png) center/contain no-repeat, black'
        }}
      >
        <FadeIn>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal mb-2" style={{ fontFamily: 'var(--header)' }}>
            How ASCEND stacks up.
          </h1>
          <p className="text-2xl sm:text-3xl lg:text-4xl text-[#D4A574] italic" style={{ fontFamily: 'var(--header)' }}>
            See the difference for yourself.
          </p>
        </FadeIn>

      </section>




      {/* Section 3 — Quick Competitor Lineup */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0a0a0a]">
        <FadeIn className="text-center mb-10 max-w-3xl mx-auto">
          <p className="text-[#E2CDB9] tracking-[0.3em] text-xs uppercase mb-4" style={{ fontFamily: 'var(--header)' }}>Quick Competitor Lineup</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-8" style={{ fontFamily: 'var(--header)' }}>
            How ASCEND <span className="text-[#E2CDB9]">Stacks Up</span>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative px-4 sm:px-6 py-3 text-xs sm:text-sm tracking-[0.15em] uppercase transition-all duration-300 ${
                  tab === t.key
                    ? 'text-[#E2CDB9]'
                    : 'text-white/40 hover:text-white/70'
                }`}
                style={{ fontFamily: 'var(--header)' }}
              >
                {tab === t.key && <div className="absolute inset-0 border border-[#E2CDB9]/30 bg-[#E2CDB9]/5" />}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </FadeIn>
        <div className="max-w-3xl mx-auto space-y-5">
          {activeBrands.map((brand, i) => (
            <FadeIn key={i}>
              <div className="border border-white/10 rounded-xl p-5 sm:p-6 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg sm:text-xl text-white" style={{ fontFamily: 'var(--header)' }}>{brand.name}</h3>
                  <span className="text-[#E2CDB9] text-sm" style={{ fontFamily: 'var(--header)' }}>
                    {brand.price}
                    {'priceSuffix' in brand && <span className="text-white/40 text-xs ml-1">{(brand as { priceSuffix: string }).priceSuffix}</span>}
                  </span>
                </div>

                <p className="text-white/60 text-sm mb-4">{brand.pitch.split('\n\n')[0]}</p>

                {'hasSideEffects' in brand && (
                  <button
                    onClick={() => setSideEffectsOpen(true)}
                    className="text-red-400/70 text-xs underline underline-offset-2 mb-4 block"
                  >
                    View known side effects (Mayo Clinic)
                  </button>
                )}

                {brand.name === 'Proactiv' && (
                  <div className="flex items-center gap-6 mb-4 pb-4 border-b border-white/10" style={{ fontFamily: 'var(--header)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-xs tracking-wide uppercase">{brand.name}</span>
                      <span className="text-white/50 text-lg font-semibold line-through decoration-red-400/50">{brand.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#E2CDB9] text-xs tracking-wide uppercase">ASCEND</span>
                      <span className="text-[#E2CDB9] text-lg font-semibold">$69.00</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-red-400/70 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'var(--header)' }}>Them</p>
                    {brand.loses.slice(0, 4).map((item, j) => (
                      <div key={j} className="flex items-start gap-2 mb-1.5">
                        <X className="w-3 h-3 text-red-400/60 flex-shrink-0 mt-0.5" />
                        <span className="text-white/60 text-sm leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-[#E2CDB9] text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'var(--header)' }}>ASCEND</p>
                    {brand.wins.slice(0, 4).map((item, j) => (
                      <div key={j} className="flex items-start gap-2 mb-1.5">
                        <Check className="w-3 h-3 text-[#E2CDB9] flex-shrink-0 mt-0.5" />
                        <span className="text-white/80 text-sm leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn className="text-center mt-14 max-w-2xl mx-auto">
          <div className="gold-divider w-48 mx-auto mb-8" />
          <p className="text-white/70 text-lg mb-2" style={{ fontFamily: 'var(--header)' }}>Most men's brands sell routines.</p>
          <p className="text-[#E2CDB9] text-xl sm:text-2xl italic" style={{ fontFamily: 'var(--header)', textShadow: '0 0 20px rgba(226,205,185,0.3)' }}>ASCEND sells the acne protocol.</p>
          <p className="text-white text-sm mt-4 tracking-wide" style={{ fontFamily: 'var(--header)' }}>450 mL. 4 actives. 3 phases. 1 system.</p>
        </FadeIn>
      </section>

      {/* Side Effects Modal */}
      {sideEffectsOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSideEffectsOpen(false)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl border border-red-400/20 bg-[#0a0a0a] p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg sm:text-xl text-white" style={{ fontFamily: 'var(--header)' }}>
                Accutane (Isotretinoin) — <span className="text-red-400/80">Known Side Effects</span>
              </h3>
              <button
                onClick={() => setSideEffectsOpen(false)}
                className="text-white/40 hover:text-white transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white text-xs sm:text-sm leading-relaxed italic" style={{ fontFamily: 'var(--header)' }}>
              {ACCUTANE_SIDE_EFFECTS.disclaimer}
            </p>
            {ACCUTANE_SIDE_EFFECTS.sections.map((section, si) => (
              <div key={si} className="space-y-4">
                <p className="text-white text-xs sm:text-sm font-medium leading-relaxed" style={{ fontFamily: 'var(--header)' }}>
                  {section.title}
                </p>
                {section.groups.map((group, gi) => (
                  <div key={gi} className="pl-2 sm:pl-4">
                    <p className="text-red-400/60 text-xs tracking-[0.15em] uppercase mb-2" style={{ fontFamily: 'var(--header)' }}>
                      {group.label}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item, ii) => (
                        <span key={ii} className="text-white text-xs px-2 py-1 border border-white/5 rounded bg-white/[0.02]" style={{ fontFamily: 'var(--header)' }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div className="pt-4 border-t border-white/5">
              <p className="text-white text-[10px] sm:text-xs leading-relaxed" style={{ fontFamily: 'var(--header)' }}>
                Source: Mayo Clinic — Isotretinoin (Oral Route) Side Effects. This information is provided for educational purposes only and does not constitute medical advice. Always consult your healthcare provider before starting or stopping any medication.
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Reality Check */}
      <section
        className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden"
        style={{
          backgroundImage: 'url(/about-gym-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/60" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, black 0%, transparent 12%, transparent 88%, black 100%), linear-gradient(to right, black 0%, transparent 10%, transparent 90%, black 100%)'
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(226,205,185,0.07) 0%, transparent 60%)'
          }}
          aria-hidden
        />
        <div className="relative z-10">
          <FadeIn className="text-center mb-14 sm:mb-16">
            <p className="text-[#E2CDB9] tracking-[0.3em] text-xs uppercase mb-4" style={{ fontFamily: 'var(--header)' }}>The Difference</p>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl tracking-[0.18em] font-semibold text-white"
              style={{ fontFamily: 'var(--header)' }}
            >
              REALITY CHECK
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ fontFamily: 'var(--header)' }}>
              <span className="text-white/90" style={{ textShadow: '0 0 10px rgba(255,255,255,0.25)' }}>Most brands fix symptoms.</span>{' '}
              <span className="text-[#E2CDB9] italic">ASCEND controls variables.</span>
            </p>
          </FadeIn>
          <FadeIn>
            <AscendBrandComparison
              showHeader={false}
              footer={
                <div className="mt-10 text-center">
                  <div className="gold-divider w-32 mx-auto mb-6" />
                  <p className="text-[#E2CDB9] italic text-xl sm:text-2xl tracking-wide" style={{ fontFamily: 'var(--header)', textShadow: '0 0 24px rgba(226,205,185,0.25)' }}>
                    Control the variables. Own the outcome.
                  </p>
                </div>
              }
            />
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.7) 100%), url(https://raw.githubusercontent.com/epalmer859-source/Photos/main/about-bg%5B1%5D.png) center/cover no-repeat'
        }}
      >
        <FadeIn className="relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-10 leading-tight" style={{ fontFamily: 'var(--header)' }}>
            Stop Buying Routines That Were<br /><span className="text-[#E2CDB9]">Not Built For Acne.</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12">
            {['3 full-size phases', '450 mL total', '4 major actives', '15% azelaic acid', 'Zero-tack finish', 'Masculine design', 'One complete acne protocol'].map((item, i) => (
              <FadeIn key={i} style={{ transitionDelay: `${i * 0.05}s` }}>
                <div className="flex items-center gap-2 border border-white/10 rounded-full px-4 py-2 bg-white/[0.03]">
                  <Check className="w-3.5 h-3.5 text-[#E2CDB9] flex-shrink-0" />
                  <span className="text-white/70 text-xs sm:text-sm whitespace-nowrap" style={{ fontFamily: 'var(--header)' }}>{item}</span>
                </div>
              </FadeIn>
            ))}
          </div>
          <p className="text-[#E2CDB9] tracking-[0.2em] text-sm uppercase mb-10" style={{ fontFamily: 'var(--header)' }}>
            Cleanse. Recover. Treat.
          </p>
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
            <span className="relative z-10 text-[#E2CDB9]">Start The Protocol</span>
            <ArrowRight className="relative z-10 w-4 h-4 text-[#E2CDB9]/70 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </FadeIn>
      </section>
    </div>
  );
}
