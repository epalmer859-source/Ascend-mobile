import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { StarIcon } from '@/components/Icons';
import { addUserReview } from '@/lib/userReviews';
import { X, PenLine } from 'lucide-react';

const PRODUCT_OPTIONS = ['Phase I', 'Phase II', 'Phase III', 'The Full System'];

const DURATION_MS = 280;

interface ReviewFormProps {
  product?: string;
  onSubmitted?: () => void;
  compact?: boolean;
  prominent?: boolean;
}

export function ReviewForm({ product, onSubmitted, compact, prominent }: ReviewFormProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [name, setName] = useState('');
  const [purchased, setPurchased] = useState(false);
  const [stars, setStars] = useState(0);
  const [text, setText] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(product ?? 'Phase I');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setClosing(false);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setMounted(true));
      });
      return () => cancelAnimationFrame(id);
    }
    setMounted(false);
  }, [open]);

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setSubmitting(false);
      setName('');
      setPurchased(false);
      setStars(0);
      setText('');
      setError('');
      setMounted(false);
    }, DURATION_MS);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    const trimName = name.trim();
    const trimText = text.trim();
    if (!trimName) {
      setError('Please enter your name.');
      return;
    }
    if (stars < 1 || stars > 5) {
      setError('Please select a rating.');
      return;
    }
    if (!trimText) {
      setError('Please write your review.');
      return;
    }
    if (!purchased) {
      setError('Please confirm that you have purchased this product.');
      return;
    }
    setSubmitting(true);
    const productForReview = product ?? selectedProduct;
    addUserReview({
      name: trimName,
      star: stars,
      text: trimText,
      product: productForReview,
      time: 'Just now',
      verified: purchased,
    });
    setSubmitted(true);
    onSubmitted?.();
  };

  if (!open) {
    if (prominent) {
      return (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-[70%] mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 p-4 sm:p-5 rounded-2xl border-2 border-[#E2CDB9]/40 bg-[#E2CDB9]/10 hover:border-[#E2CDB9]/55 hover:bg-[#E2CDB9]/15 text-left transition-all duration-300 group shadow-[0_0_24px_-4px_rgba(226,205,185,0.12)] hover:shadow-[0_0_32px_-4px_rgba(226,205,185,0.22)]"
        >
          <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-white/15 border border-white/30 flex items-center justify-center group-hover:bg-white/25 transition-colors">
            <PenLine className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div className="text-center sm:text-left">
            <span className="block text-base sm:text-lg font-semibold text-[#E2CDB9]" style={{ fontFamily: 'var(--header)' }}>
              Write a review
            </span>
            <span className="block text-xs text-white/70">
              Share your experience. Your feedback helps others.
            </span>
          </div>
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-5 py-2.5 rounded-xl border border-[#E2CDB9]/40 bg-[#E2CDB9]/10 text-[#E2CDB9] text-sm font-medium hover:bg-[#E2CDB9]/20 hover:border-[#E2CDB9]/60 transition-all duration-200"
      >
        Write a review
      </button>
    );
  }

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-form-title"
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-6 transition-all ease-out ${
        mounted && !closing
          ? 'bg-black/15 backdrop-blur-xl opacity-100'
          : 'bg-black/0 backdrop-blur-0 opacity-0'
      }`}
      style={{ transitionDuration: `${DURATION_MS}ms` }}
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div
        className={`relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#0a0a0a]/98 shadow-2xl overflow-hidden transition-all ease-out ${
          mounted && !closing
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-[0.97] translate-y-4'
        }`}
        style={{
          transitionDuration: `${DURATION_MS}ms`,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="p-8 text-center">
            <h3
              id="review-form-title"
              className="text-xl font-semibold text-white mb-2 tracking-tight"
              style={{ fontFamily: 'var(--header)' }}
            >
              Thank you
            </h3>
            <p className="text-white/70 text-sm mb-6">Your review has been submitted.</p>
            <button
              type="button"
              onClick={closeModal}
              className="w-full py-3 px-5 rounded-xl bg-[#E2CDB9]/15 border border-[#E2CDB9]/40 text-[#E2CDB9] text-sm font-medium hover:bg-[#E2CDB9]/25 transition-all duration-200"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={`p-8 sm:p-10 ${compact ? 'space-y-3' : 'space-y-5'}`}>
            <h3
              id="review-form-title"
              className="text-lg font-semibold text-white pr-10 tracking-tight"
              style={{ fontFamily: 'var(--header)' }}
            >
              Write a review
            </h3>
            <div>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#E2CDB9]/40 focus:ring-1 focus:ring-[#E2CDB9]/20 transition-all duration-200"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={purchased}
                onChange={(e) => setPurchased(e.target.checked)}
                className="w-4 h-4 rounded border-white/30 bg-white/5 text-[#E2CDB9] focus:ring-[#E2CDB9]/40"
              />
              <span className="text-sm text-white/70">I purchased this product (Verified Buyer)</span>
            </label>
            {!product && (
              <div>
                <label className="text-white/50 text-xs font-medium block mb-2 uppercase tracking-wider">Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#E2CDB9]/40 transition-all duration-200"
                >
                  {PRODUCT_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <span className="text-white/50 text-xs font-medium block mb-2 uppercase tracking-wider">Rating</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setStars(n)}
                    className="p-1 rounded-lg hover:bg-white/5 transition-colors duration-150"
                    aria-label={`${n} stars`}
                  >
                    <StarIcon filled={n <= stars} className="w-7 h-7 cursor-pointer" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <textarea
                placeholder="Your review..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={compact ? 2 : 3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 text-sm resize-none focus:outline-none focus:border-[#E2CDB9]/40 focus:ring-1 focus:ring-[#E2CDB9]/20 transition-all duration-200"
              />
            </div>
            {error && (
              <p className="text-red-400/90 text-xs -mt-1">{error}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-[#E2CDB9] text-black text-sm font-semibold hover:bg-[#E2CDB9]/90 active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting…' : 'Submit review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
