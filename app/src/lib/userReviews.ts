import type { Review } from '@/types';

const STORAGE_KEY = 'ascend_user_reviews';

function getStored(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Review[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getUserReviews(product?: string): Review[] {
  const all = getStored();
  if (!product) return all;
  return all.filter((r) => r.product === product);
}

export function addUserReview(review: Omit<Review, 'id'> & { verified?: boolean }): Review {
  try {
    const stored = getStored();
    const id = stored.length > 0 ? Math.max(...stored.map((r) => r.id)) + 1 : 100001;
    const newReview: Review = {
      ...review,
      id,
      verified: review.verified ?? false,
    };
    stored.push(newReview);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    return newReview;
  } catch (err) {
    console.error('Failed to save review', err);
    throw new Error('Could not save review. Try again.');
  }
}

export function deleteUserReview(id: number): void {
  const stored = getStored().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}

export function clearAllUserReviews(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}
