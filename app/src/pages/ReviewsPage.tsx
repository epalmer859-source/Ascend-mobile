import { useState, useMemo } from 'react';
import { FadeIn } from '@/components/FadeIn';
import { Stars, RatingStars } from '@/components/Icons';
import { ReviewForm } from '@/components/ReviewForm';
import { getUserReviews } from '@/lib/userReviews';
import { ALL_REVIEWS, avgRating } from '@/data/products';
import { ArrowRight } from 'lucide-react';

export function ReviewsPage() {
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(24);
  const [userReviews, setUserReviews] = useState(() => getUserReviews());

  const allReviews = useMemo(
    () => [...userReviews, ...ALL_REVIEWS],
    [userReviews]
  );

  const handleReviewSubmitted = () => {
    setUserReviews(getUserReviews());
  };

  const filtered = allReviews.filter(r => {
    if (starFilter !== 'all' && r.star !== starFilter) return false;
    if (productFilter !== 'all' && r.product !== productFilter) return false;
    return true;
  });

  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: allReviews.filter(r => r.star === star).length,
    pct: allReviews.length ? Math.round(allReviews.filter(r => r.star === star).length / allReviews.length * 100) : 0
  }));

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-3" style={{ fontFamily: 'var(--header)' }}>
            Customer Reviews
          </h2>
          <div className="flex items-center justify-center gap-3 mb-2">
            <RatingStars rating={4.6} />
            <span className="text-2xl font-bold text-[#E2CDB9]">{avgRating}</span>
          </div>
          <p className="text-white text-base">Based on {allReviews.length} reviews</p>
        </FadeIn>

        {/* Write a review — big centered CTA */}
        <FadeIn className="max-w-2xl mx-auto mb-12">
          <ReviewForm onSubmitted={handleReviewSubmitted} prominent />
        </FadeIn>

        {/* Rating Distribution */}
        <FadeIn className="max-w-lg mx-auto mb-10">
          {distribution.map(d => (
            <div 
              key={d.star} 
              className="flex items-center gap-3 mb-2 cursor-pointer"
              onClick={() => setStarFilter(starFilter === d.star ? 'all' : d.star)}
            >
              <span className={`text-sm w-14 text-right ${starFilter === d.star ? 'text-[#E2CDB9]' : 'text-white/60'}`}>
                {d.star} star
              </span>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${starFilter === d.star ? 'bg-[#E2CDB9]' : 'bg-[#E2CDB9]/50'}`}
                  style={{ width: `${d.pct}%` }}
                />
              </div>
              <span className="text-xs text-white/60 w-10">{d.pct}%</span>
            </div>
          ))}
        </FadeIn>

        {/* Product Filter */}
        <FadeIn className="flex gap-3 justify-center flex-wrap mb-8">
          {['all', 'Phase I', 'Phase II', 'Phase III', 'The Full System'].map(p => (
            <button
              key={p}
              onClick={() => setProductFilter(p)}
              className={`px-5 py-2 rounded-full text-sm transition-all ${
                productFilter === p
                  ? 'border border-[#E2CDB9] bg-[#E2CDB9]/10 text-[#E2CDB9]'
                  : 'border border-white/10 text-white/60 hover:border-[#E2CDB9]/50'
              }`}
            >
              {p === 'all' ? 'All Products' : p}
            </button>
          ))}
        </FadeIn>

        <p className="text-center text-white text-sm mb-6">
          {filtered.length} reviews
          {starFilter !== 'all' && ` (${starFilter} star)`}
          {productFilter !== 'all' && ` for ${productFilter}`}
        </p>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.slice(0, visibleCount).map((r, i) => (
            <FadeIn key={r.id} delay={i * 0.04} direction="scale">
              <div className="glass-card h-full flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <strong className="text-sm">{r.name}</strong>
                  {r.verified && (
                    <span className="text-xs text-[#E2CDB9] ml-2 border border-[#E2CDB9]/30 px-2 py-0.5 rounded-full">
                      ✓ Verified Buyer
                    </span>
                  )}
                </div>
                <span className="text-xs text-white/50 whitespace-nowrap">{r.time}</span>
              </div>
              <Stars count={r.star} />
              {r.title && (
                <p className="text-white/90 text-sm mt-3 font-medium">{r.title}</p>
              )}
              <p className="text-white/80 text-sm mt-3 leading-relaxed">{r.text}</p>
              <p className="text-xs text-[#E2CDB9] mt-3 italic">Purchased: {r.product}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {visibleCount < filtered.length && (
          <div className="text-center mt-10">
            <button 
              onClick={() => setVisibleCount(c => c + 24)}
              className="btn-gold"
            >
              Load more reviews ({filtered.length - visibleCount} remaining) <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
