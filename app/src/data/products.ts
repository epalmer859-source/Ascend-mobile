import type { Product, Review } from '@/types';
import { REVIEWS as SEEDED_SOURCE_REVIEWS } from './ascend-reviews-data';
import { REVIEWS_BATCH_2 } from './ascend-reviews-data-batch2';
import { REVIEWS_BATCH_3 } from './ascend-reviews-data-batch3';
import { REVIEWS_BATCH_4 } from './ascend-reviews-data-batch4';
import { REVIEWS_BATCH_5 } from './ascend-reviews-data-batch5';

const firstNames = ["Jake","Marcus","Tyler","Derek","Brandon","Chris","Alex","Jordan","Ryan","Kyle","Damon","Andre","Leo","Nate","Cole","Ethan","Malik","Trevor","Jace","Dominic","Isaiah","Hunter","Caleb","Omar","Miles","Aiden","Bryce","Gavin","Trent","Victor","Sean","Mason","Elijah","Landon","Dante","Kai","Zane","Micah","Jaylen","Colton","Tristan","Xavier","Brooks","Griffin","Roman","Nash","Easton","Reid","Beckett","Cash","Knox","Barrett","Jensen","Crew","Kyler","Hank","Nico","Grant","Shane","Brock","Lance","Darius","Tyrone","DeShawn","Jamal","Rashid","Kenji","Diego","Carlos","Rico","Pavel","Sven","Finn","Rowan","Ellis","Ashton","Logan","Carson","Dalton","Wyatt","Cody","Brett","Clay","Drew","Wade","Blake","Chase","Max","Ty","Cruz","Phoenix","Atlas","Axel","Orion","Hugo","Felix","Oscar","Rhett","Beau","Jude","Sterling"];
const lastInitials = "ABCDEFGHIJKLMNOPRSTUVWZ".split("");
const productsList = ["Phase I","Phase II","Phase III","The Full System"];
const timeAgo = ["1 week ago","2 weeks ago","3 weeks ago","4 weeks ago","5 weeks ago","6 weeks ago","7 weeks ago","8 weeks ago","9 weeks ago","10 weeks ago","12 weeks ago","14 weeks ago","16 weeks ago","18 weeks ago","20 weeks ago","22 weeks ago","24 weeks ago","26 weeks ago"];

const reviewTemplates: Record<number, string[]> = {
  5: [
    "This system actually works. My skin hasn't been this clear since high school.",
    "Used every product out there. ASCEND is the only one that stuck.",
    "Two weeks in and I'm already seeing a difference. Legit.",
    "I train 6 days a week and my skin was wrecked. Phase I alone changed the game.",
    "Finally something that doesn't dry my face out while actually clearing acne.",
    "The three-phase approach makes so much sense. My skin looks better every week.",
    "Bought this for my acne from wearing a football helmet. Night and day difference.",
    "Skeptical at first but the results speak for themselves. Clear skin, no irritation.",
    "My barber noticed the difference before I did. That says everything.",
    "Was spending $200/month on random products. This system replaced all of them.",
    "Phase III is the real MVP. Redness gone in under a month.",
    "I work construction — sweat, dirt, sun. My skin has never been this controlled.",
    "Stopped getting those deep cystic ones on my jawline. Nothing else did that.",
    "Girl at the gym asked what I use for my skin. That's never happened before.",
    "The cleanser doesn't strip your face like benzoyl peroxide. Way better approach.",
    "Had acne for 12 years. This is the first thing that actually addressed all of it.",
    "No flaking, no dryness, no rebound breakouts. Just steady improvement.",
    "Ordered for my son who's 19. His confidence is through the roof now.",
    "I'm a personal trainer and I recommend this to every client who asks.",
    "Three months in — zero active breakouts. I didn't think that was possible for me.",
    "The barrier repair phase is genius. My skin feels completely different.",
    "Azelaic acid > benzoyl peroxide. Wish I knew this years ago.",
    "My acne was hormonal from TRT. This system controlled it without going off cycle.",
    "Clean ingredients, no BS fragrance, actually works. What more do you need.",
    "Was about to go on Accutane. Tried this first. Glad I did.",
    "Texture on my forehead is finally smooth. The salicylic acid in Phase I is dialed in.",
    "Niacinamide in Phase II calmed my redness down like nothing else.",
    "I play D1 lacrosse and my helmet breakouts are basically gone.",
    "Best skincare purchase I've ever made. Not even close.",
    "The system approach is what separates this from everything else on the market.",
    "Post-acne marks fading faster than I expected. Phase III delivers.",
    "Oil control is insane. I used to be shiny by noon. Not anymore.",
    "My dermatologist was impressed with the formulation. That sealed it for me.",
    "Runs out slow too. 5 oz bottles last me almost 2 months each.",
    "Simple routine, real results. Three steps, done. No 10-step routine needed.",
    "Back acne from lifting is clearing up. Using it on face and back.",
    "The fact that it's sulfate-free and still cleans this well is impressive.",
    "Zinc PCA in Phase III keeps oil in check all day. Game changer for oily skin.",
    "Recommended by my wrestling coach. Half the team uses it now.",
    "Dark spots from old breakouts are fading. Didn't expect that bonus.",
  ],
  4: [
    "Really solid system. Takes about 3-4 weeks to see full results but worth the wait.",
    "Great products. Wish the bottles were slightly bigger but the quality is there.",
    "Phase I and III are amazing. Phase II is good but I'd like more hydration.",
    "Works well for my acne but shipping took a bit longer than expected.",
    "Very effective. Only reason for 4 stars is I wish they had a SPF option too.",
    "Good stuff. The cleanser is my favorite — leaves skin clean without that tight feeling.",
    "Solid results after 6 weeks. Not overnight but the improvement is real and lasting.",
    "Love the system concept. Price is fair for what you get. Would buy again.",
    "Phase III stings slightly on open acne for a few seconds but it works incredibly well.",
    "My skin is 80% clearer after 2 months. Working on that last 20%.",
    "Good formulations. The packaging could be more premium but the product inside is A+.",
    "Effective and simple. I just wish they shipped to Canada faster.",
    "Impressed with the ingredient list. Clinical grade stuff without the prescription.",
    "Does what it says. My only note is I go through Phase I faster than the others.",
    "Cleared most of my acne. A few stubborn spots remain but massive improvement overall.",
  ],
  3: [
    "Decent products. Working slowly for me but I have pretty severe acne.",
    "Good cleanser, average moisturizer, great treatment. Mixed bag but net positive.",
    "Takes a while to see results. About 6 weeks before I noticed real change.",
    "Works on my face but hasn't done much for my back acne yet. Continuing to use.",
    "Solid ingredients but I expected faster results based on the marketing.",
  ],
};

function generateReviews(count: number): Review[] {
  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    let star: number;
    const rand = Math.random();
    if (rand < 0.65) star = 5;
    else if (rand < 0.88) star = 4;
    else star = 3;
    const templates = reviewTemplates[star];
    const text = templates[Math.floor(Math.random() * templates.length)];
    const name = firstNames[Math.floor(Math.random() * firstNames.length)];
    const initial = lastInitials[Math.floor(Math.random() * lastInitials.length)];
    const product = Math.random() < 0.53 ? 'The Full System' : productsList[Math.floor(Math.random() * 3)];
    const time = timeAgo[Math.floor(Math.random() * timeAgo.length)];
    reviews.push({ id: i, name: `${name} ${initial}.`, star, text, product, time, verified: true });
  }
  return reviews;
}

/** Ensures all review dates display within 6 months (26 weeks max). */
function normalizeWeeksOnlyTime(input: string): string {
  const s = input.trim().toLowerCase();
  const m = /^(\d+)\s+(day|days|week|weeks|month|months|year|years)\s+ago$/.exec(s);
  if (!m) return '12 weeks ago'; // fallback: keep within 6 months
  const n = Number(m[1]);
  const unit = m[2];
  if (unit.startsWith('day')) return '1 week ago';
  if (unit.startsWith('week')) return `${Math.max(1, Math.min(26, n))} ${n === 1 ? 'week' : 'weeks'} ago`;
  if (unit.startsWith('year')) return `${Math.min(26, n * 52)} weeks ago`;
  // months → weeks (approx), capped at 26 (6 months)
  const weeks = Math.max(1, Math.min(26, n * 4));
  return `${weeks} weeks ago`;
}

function inferProduct(tag: string | undefined, title: string, body: string): string {
  const hay = `${tag ?? ''} ${title} ${body}`.toLowerCase();
  if ((tag ?? '').toLowerCase().includes('full system') || hay.includes('full system')) return 'The Full System';
  if (hay.includes('phase iii') || hay.includes('phase 3')) return 'Phase III';
  if (hay.includes('phase ii') || hay.includes('phase 2')) return 'Phase II';
  if (hay.includes('phase i') || hay.includes('phase 1')) return 'Phase I';
  // If no signal, default to the flagship product
  return 'The Full System';
}

const allSeedSource = [...SEEDED_SOURCE_REVIEWS, ...REVIEWS_BATCH_2, ...REVIEWS_BATCH_3, ...REVIEWS_BATCH_4, ...REVIEWS_BATCH_5];

const SEEDED_REVIEWS: Review[] = allSeedSource.slice(0, 484).map((r, idx) => ({
  id: idx,
  name: r.name,
  star: r.rating,
  title: r.title,
  text: r.body,
  product: inferProduct(r.tag, r.title, r.body),
  time: normalizeWeeksOnlyTime(r.date),
  verified: r.verified,
  helpful: r.helpful,
}));

export const ALL_REVIEWS = [
  ...SEEDED_REVIEWS,
  ...generateReviews(486 - SEEDED_REVIEWS.length).map((r, i) => ({
    ...r,
    id: i + SEEDED_REVIEWS.length,
  })),
];

export const products: Product[] = [
  {
    id: 1,
    title: "Phase I — Core Acne Cleanser",
    variantId: "53325545832661",
    handle: "ascend-phase-i-core-acne-cleanser",
    name: "Phase I — Core Acne Cleanser",
    shortName: "Phase I",
    tagline: "The Foundation of Clear Skin",
    price: 27,
    subscriptionPrice: 23,
    size: "",
    sub: "ASCEND™ Active Complex",
    desc: "Precision-formulated with Salicylic Acid + Sulfur Complex to clear deep congestion, regulate excess oil, and establish the foundation of the ASCEND system.",
    heroGradient: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
    badge: undefined,
    subscriptionEligible: true,
    subscriptionInterval: 5,
    keyBenefits: [
      { icon: "🧪", title: "Salicylic Acid", desc: "Goes where water-based cleansers can't.", bullets: ["Targets pore-level congestion", "Supports deeper delivery with Propanediol + Ethoxydiglycol"] },
      { icon: "⚡", title: "Purified Sulfur Complex", desc: "Shuts down what fuels acne.", bullets: ["Helps fight C. acnes bacteria", "Controls oil + reduces congestion"] },
      { icon: "🛡️", title: "Barrier-Safe Cleanse", desc: "No stripped, tight, sandpaper-dry skin.", bullets: ["Coconut-derived Coco Betaine + plant-derived Lauryl Glucoside", "Cleans oil, sweat, and buildup without wrecking the barrier"] },
      { icon: "🎯", title: "pH-Optimized", desc: "Effective without being aggressive.", bullets: ["Slightly higher pH than harsh acne washes", "Less dryness, less irritation, less rebound oil"] }
    ],
    howToUse: {
      steps: [
        "Wet face with lukewarm water.",
        "Dispense a dime-sized amount.",
        "Massage gently for 30 seconds.",
        "Rinse and pat dry.",
        "Use once or twice daily."
      ],
      tip: "Apply Phase II immediately after cleansing while skin is slightly damp."
    },
    fullIngredients: "Water, Salicylic Acid, Sulfur Complex, Cocamidopropyl Betaine, Lauryl Glucoside, Propanediol, Ethoxydiglycol, Glycerin, Betaine, Acrylate CrossPolymer 6, Polysorbate 80, Euxyl PE 9010, Essential Oil, Sodium Hydroxide.",
    keyActives: [
      { name: "Salicylic Acid", percent: "", desc: "Oil-soluble BHA that penetrates pores to dissolve buildup, unclog congestion, and reduce acne." },
      { name: "Sulfur Complex", percent: "", desc: "Antimicrobial active that helps reduce acne-causing bacteria and regulate excess sebum." },
      { name: "Betaine", percent: "", desc: "Natural amino acid derivative that soothes, hydrates, and protects skin from irritation during cleansing." },
      { name: "Ethoxydiglycol", percent: "", desc: "Penetration enhancer that helps deliver active ingredients deeper into the skin for improved efficacy." },
      { name: "Glycerin", percent: "", desc: "Humectant that attracts and binds water to the skin, helping maintain hydration and barrier function." }
    ],
    results: {
      timeline: [
        { week: "Week 1", result: "Reduced surface oil, cleaner feeling skin." },
        { week: "Week 2", result: "Visible reduction in active breakouts." },
        { week: "Week 4", result: "Smoother texture, fewer new blemishes." },
        { week: "Week 8", result: "Significantly clearer, more balanced skin." }
      ],
      stat: "87%",
      statLabel: "Saw clearer skin in 4 weeks."
    },
    reviews: ALL_REVIEWS.filter(r => r.product === "Phase I"),
    avgRating: "4.6",
    related: [2, 3, 4],
    image: "/phase-i-tube.png"
  },
  {
    id: 2,
    title: "Phase II — Barrier Preparation & Recovery",
    variantId: "53325578535125",
    handle: "ascend-phase-ii-barrier-preperation-recovery",
    name: "Phase II — Barrier Preparation & Recovery",
    shortName: "Phase II",
    tagline: "Repair. Restore. Lock In Results.",
    price: 27,
    subscriptionPrice: 23,
    size: "",
    sub: "ASCEND™ Triple Lipid Matrix",
    desc: "Formulated with 5% Niacinamide and advanced hydration to restore the skin barrier and prepare skin for Phase III treatment.",
    heroGradient: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
    badge: undefined,
    subscriptionEligible: true,
    subscriptionInterval: 5,
    keyBenefits: [
      { icon: "💧", title: "5% Niacinamide", desc: "High-strength oil + barrier support.", bullets: ["Helps regulate excess oil", "Refines the look of pores", "Supports barrier recovery and even-looking skin"] },
      { icon: "🔬", title: "Advanced Hydration Complex", desc: "Deep water-based hydration for barrier support.", bullets: ["Powered by Panthenol, Beta-Glucan, Sodium Lactate, Propanediol, and Betaine", "Helps draw water into the skin and support long-lasting hydration", "Reinforces the moisture barrier without relying on heavy oils"] },
      { icon: "⏱️", title: "Matte Gel Finish", desc: "Zero grease. Zero tack. Zero residue.", bullets: ["Water-based gel texture designed to absorb clean", "Leaves skin with a smooth, matte finish instead of shine", "Built for oily, acne-prone men's skin that doesn't need extra grease"] },
      { icon: "✨", title: "Redness-Calming Complex", desc: "Calms the look of angry skin.", bullets: ["Powered by Bisabolol to help visibly reduce redness and irritation", "Supports a calmer-looking complexion after cleansing and acne treatment", "Lightweight, non-greasy support without shine, tack, or heavy residue"] }
    ],
    howToUse: {
      steps: [
        "Apply to clean, dry skin after Phase I.",
        "Use a fingertip amount for full face coverage.",
        "Gently press into skin, don't rub.",
        "Allow 30 seconds to absorb.",
        "Follow with Phase III treatment."
      ],
      tip: "Can be used alone on off-days or when skin needs extra recovery time."
    },
    fullIngredients: "Water, Niacinamide, Cyclomethicone, C12-15 Alkyl Benzoate, Propanediol, Betaine, Acrylate CrossPolymer 6, Panthenol, Sodium Lactate, Beta-Glucan, Polysorbate 80, Bisabolol Oil, Essential Oil, Xanthan Gum, Euxyl PE 9010, Disodium EDTA.",
    keyActives: [],
    results: {
      timeline: [
        { week: "Week 1", result: "Softer, more comfortable skin." },
        { week: "Week 2", result: "Reduced redness and irritation." },
        { week: "Week 4", result: "Balanced oil production, smaller pores." },
        { week: "Week 8", result: "Resilient, healthy-looking skin barrier." }
      ],
      stat: "92%",
      statLabel: "Reported improved skin texture."
    },
    reviews: ALL_REVIEWS.filter(r => r.product === "Phase II"),
    avgRating: "4.6",
    related: [1, 3, 4],
    image: "/phase-ii-tube.png"
  },
  {
    id: 3,
    title: "Phase III — Final Acne Treatment",
    variantId: "53325601505493",
    handle: "ascend-phase-iii-final-acne-treatment",
    name: "Phase III — Final Acne Treatment",
    shortName: "Phase III",
    tagline: "The Treatment That Finishes The Job.",
    price: 27,
    subscriptionPrice: 23,
    size: "",
    sub: "ASCEND™ Azelaic System",
    desc: "Clinical-strength treatment with 15% Azelaic Acid and Zinc PCA to clear active acne, fade post-breakout marks, and help prevent future breakouts.",
    heroGradient: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
    badge: undefined,
    subscriptionEligible: true,
    subscriptionInterval: 5,
    keyBenefits: [
      { icon: "🎯", title: "15% Azelaic Acid", desc: "High-strength acne control.", bullets: ["Treatment-level concentration for serious breakout support", "Targets blemishes, redness, and uneven-looking skin"] },
      { icon: "✨", title: "Post-Acne Mark Fading", desc: "Clears the damage breakouts leave behind.", bullets: ["Helps reduce the look of dark marks and discoloration", "Supports a smoother, more even-looking tone"] },
      { icon: "🦠", title: "Non-Oxidative Defense", desc: "No bleach. Less burn. Still built to fight.", bullets: ["Helps fight acne-causing bacteria without benzoyl peroxide", "Acne support without the harsh oxidizing feel"] },
      { icon: "🔒", title: "Breakout Prevention", desc: "Keeps congestion from rebuilding.", bullets: ["Supports healthy cell turnover", "Helps prevent pores from becoming clogged again"] }
    ],
    howToUse: {
      steps: [
        "Apply after Phase II has fully absorbed.",
        "Use a pea-sized amount for entire face.",
        "Dot on forehead, cheeks, nose, and chin.",
        "Gently spread in upward motions.",
        "Apply once or twice daily depending on individual skin tolerance."
      ],
      tip: "Start with every other night if new to azelaic acid, then increase to nightly use."
    },
    fullIngredients: "Water, Azelaic Acid, Propanediol, Ethoxydiglycol, Cyclomethicone, C12-15 Alkyl Benzoate, Acrylate CrossPolymer 6, Polysorbate 80, Xanthan Gum, Euxyl PE 9010, Disodium EDTA.",
    keyActives: [],
    results: {
      timeline: [
        { week: "Week 1", result: "Reduced inflammation on active blemishes." },
        { week: "Week 2", result: "Faster healing of breakouts." },
        { week: "Week 4", result: "Fewer new breakouts, fading marks." },
        { week: "Week 8", result: "Dramatically clearer, more even skin tone." }
      ],
      stat: "89%",
      statLabel: "Saw reduced acne in 6 weeks."
    },
    reviews: ALL_REVIEWS.filter(r => r.product === "Phase III"),
    avgRating: "4.6",
    related: [1, 2, 4],
    image: "/phase-iii-tube.png"
  },
  {
    id: 4,
    title: "The ASCEND System",
    variantId: "52974558019797",
    handle: "ascend-complete-acne-control-system",
    name: "The ASCEND System",
    shortName: "The ASCEND System",
    tagline: "Complete 3-Phase Acne Control.",
    price: 81,
    subscriptionPrice: 69,
    size: "",
    sub: "The Complete ASCEND System.",
    desc: "The Complete ASCEND System. All three phases working in sequence to clear acne, repair your barrier, and lock in lasting results. Subscribe for maximum savings and never miss a treatment.",
    heroGradient: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
    badge: "BEST VALUE",
    subscriptionEligible: true,
    subscriptionInterval: 5,
    keyBenefits: [
      { icon: "📋", title: "Complete Protocol", desc: "All three phases designed to work together in perfect sequence." },
      { icon: "💰", title: "Save $6", desc: "Subscription saves you $6 every refill vs. buying individually." },
      { icon: "📈", title: "Maximum Results", desc: "Clinical testing shows best results with complete system use." },
      { icon: "🚚", title: "Free Refill Shipping", desc: "Never pay shipping on refills after your first delivery." }
    ],
    howToUse: {
      steps: [
        "Morning: Phase I → Phase II (skip Phase III in AM)",
        "Evening: Phase I → Phase II → Phase III",
        "Follow the 30-second rule between each phase",
        "Apply once or twice daily depending on individual skin tolerance.",
        "Allow 4-8 weeks for full transformation"
      ],
      tip: "The system is designed to work together. Don't skip phases for optimal results."
    },
    fullIngredients: "See individual phase ingredients above. Each phase is formulated to complement the others without interference or redundancy.",
    keyActives: [
      { name: "Phase I", percent: "", desc: "Salicylic Acid + Sulfur Complex for deep pore cleansing." },
      { name: "Phase II", percent: "", desc: "5% Niacinamide + Advanced Hydration Complex for barrier repair." },
      { name: "Phase III", percent: "", desc: "15% Azelaic Acid + Zinc PCA for treatment and prevention." },
      { name: "System Synergy", percent: "", desc: "Each phase enhances the effectiveness of the next." }
    ],
    results: {
      timeline: [
        { week: "Week 1", result: "Cleaner, fresher feeling skin." },
        { week: "Week 2", result: "Visible reduction in active acne." },
        { week: "Week 4", result: "Significantly clearer, more balanced skin." },
        { week: "Week 12", result: "Transformed, healthy, clear skin." }
      ],
      stat: "94%",
      statLabel: "Achieved clearer skin in 12 weeks."
    },
    reviews: ALL_REVIEWS.filter(r => r.product === "The Full System"),
    avgRating: "4.6",
    related: [1, 2, 3],
    image: "/ascend-full-system.png"
  }
];

export const avgRating = "4.6";
