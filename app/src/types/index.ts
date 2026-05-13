export interface Product {
  id: number;
  title: string;
  variantId: string;
  handle: string;
  name: string;
  shortName: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  subscriptionPrice?: number;
  size: string;
  sub: string;
  desc: string;
  heroGradient: string;
  badge?: string;
  discountEligible?: boolean;
  subscriptionEligible?: boolean;
  subscriptionInterval?: number; // weeks between refills
  keyBenefits: { icon: string; title: string; desc: string; bullets?: string[] }[];
  howToUse: { steps: string[]; tip: string };
  fullIngredients: string;
  keyActives: { name: string; percent: string; desc: string }[];
  results: {
    timeline: { week: string; result: string }[];
    stat: string;
    statLabel: string;
  };
  reviews: Review[];
  avgRating: string;
  related: number[];
  image?: string;
}

export interface Review {
  id: number;
  name: string;
  star: number;
  title?: string;
  text: string;
  product: string;
  time: string;
  verified: boolean;
  helpful?: number;
}

export interface CartItem {
  product: Product;
  title: string;
  price: number;
  variantId: string;
  image?: string;
  quantity: number;
  purchaseType: 'one_time' | 'subscription';
  sellingPlanId?: string;
}

export interface Subscription {
  id: string;
  product: Product;
  quantity: number;
  startDate: string;
  nextRefillDate: string;
  status: 'active' | 'paused' | 'cancelled';
  notificationMethod: 'email' | 'sms' | 'both';
  email?: string;
  phone?: string;
  refillRequested: boolean;
  refillResponseDeadline?: string;
  lastRefillDate?: string;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PaymentInfo {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

/** Line item snapshot for a completed order */
export interface OrderLineItem {
  name: string;
  productName: string;
  size?: string;
  quantity: number;
  price: number;
  isSubscription: boolean;
  subscriptionInterval?: number;
}

/** Completed order stored for history */
export interface Order {
  id: string;
  orderNumber: string;
  date: string; // ISO
  shippingInfo: ShippingInfo;
  shippingMethod: 'standard' | 'express';
  notificationMethod: 'email' | 'sms' | 'both';
  lineItems: OrderLineItem[];
  subtotal: number;
  discount: number;
  baseShippingCost: number;
  total: number;
  hasSubscriptions: boolean;
  subscriptionInterval?: number;
}
