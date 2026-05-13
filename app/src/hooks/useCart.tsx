import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Product, CartItem, Subscription } from '@/types';

export type PurchaseType = 'one_time' | 'subscription';

export type AddToCartOptions = {
  purchaseType: PurchaseType;
  sellingPlanId?: string;
};

interface CartContextType {
  items: CartItem[];
  subscriptions: Subscription[];
  addToCart: (product: Product, quantity?: number, options?: AddToCartOptions) => void;
  removeFromCart: (productId: number, purchaseType: PurchaseType) => void;
  updateQuantity: (productId: number, quantity: number, purchaseType: PurchaseType) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  subscriptionTotal: number;
  discount: number;
  total: number;
  discountCode: string | null;
  applyDiscountCode: (code: string) => boolean;
  removeDiscountCode: () => void;
  addSubscription: (subscription: Omit<Subscription, 'id' | 'status' | 'refillRequested'>) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  pauseSubscription: (id: string) => void;
  resumeSubscription: (id: string) => void;
  cancelSubscription: (id: string) => void;
  respondToRefill: (id: string, response: 'refill' | 'delay') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function toCartItem(product: Product, quantity: number, options?: AddToCartOptions): CartItem {
  const purchaseType = options?.purchaseType ?? 'one_time';
  const price =
    purchaseType === 'subscription' && product.subscriptionPrice != null
      ? product.subscriptionPrice
      : product.price;
  return {
    product,
    title: product.name,
    price,
    variantId: product.variantId,
    image: product.image,
    quantity,
    purchaseType,
    sellingPlanId: options?.sellingPlanId,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  const addToCart = useCallback(
    (product: Product, quantity = 1, options?: AddToCartOptions) => {
      const purchaseType = options?.purchaseType ?? 'one_time';
      setItems((prev) => {
        const existing = prev.find(
          (item) => item.product.id === product.id && item.purchaseType === purchaseType
        );
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id && item.purchaseType === purchaseType
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        const newItem = toCartItem(product, quantity, options);
        return [...prev, newItem];
      });
    },
    []
  );

  const removeFromCart = useCallback((productId: number, purchaseType: PurchaseType) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.purchaseType === purchaseType)
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: number, quantity: number, purchaseType: PurchaseType) => {
      if (quantity <= 0) {
        removeFromCart(productId, purchaseType);
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId && item.purchaseType === purchaseType
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setDiscountCode(null);
  }, []);

  const applyDiscountCode = useCallback((code: string): boolean => {
    const validCodes = ['WELCOME10', 'ASCEND10', 'SAVE10'];
    if (validCodes.includes(code.toUpperCase())) {
      setDiscountCode(code.toUpperCase());
      return true;
    }
    return false;
  }, []);

  const removeDiscountCode = useCallback(() => {
    setDiscountCode(null);
  }, []);

  const addSubscription = useCallback(
    (subscriptionData: Omit<Subscription, 'id' | 'status' | 'refillRequested'>) => {
      const newSubscription: Subscription = {
        ...subscriptionData,
        id: `SUB-${Date.now().toString(36).toUpperCase()}`,
        status: 'active',
        refillRequested: false,
      };
      setSubscriptions((prev) => [...prev, newSubscription]);
    },
    []
  );

  const updateSubscription = useCallback((id: string, updates: Partial<Subscription>) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub))
    );
  }, []);

  const pauseSubscription = useCallback((id: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: 'paused' } : sub))
    );
  }, []);

  const resumeSubscription = useCallback((id: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: 'active' } : sub))
    );
  }, []);

  const cancelSubscription = useCallback((id: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: 'cancelled' } : sub))
    );
  }, []);

  const respondToRefill = useCallback((id: string, response: 'refill' | 'delay') => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id !== id) return sub;
        if (response === 'refill') {
          const now = new Date();
          const nextRefill = new Date();
          nextRefill.setDate(
            now.getDate() + (sub.product.subscriptionInterval || 5) * 7
          );
          return {
            ...sub,
            lastRefillDate: now.toISOString(),
            nextRefillDate: nextRefill.toISOString(),
            refillRequested: false,
            refillResponseDeadline: undefined,
          };
        }
        const nextCheck = new Date();
        nextCheck.setDate(nextCheck.getDate() + 7);
        return {
          ...sub,
          nextRefillDate: nextCheck.toISOString(),
          refillRequested: false,
          refillResponseDeadline: undefined,
        };
      })
    );
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const price =
      item.purchaseType === 'subscription' && item.product.subscriptionPrice != null
        ? item.product.subscriptionPrice
        : item.product.price;
    return sum + price * item.quantity;
  }, 0);
  const subscriptionTotal = items
    .filter((item) => item.purchaseType === 'subscription')
    .reduce((sum, item) => {
      const price = item.product.subscriptionPrice ?? item.product.price;
      return sum + price * item.quantity;
    }, 0);
  const discount = discountCode && subtotal >= 30 ? 10 : 0;
  const total = Math.max(0, subtotal - discount);

  return (
    <CartContext.Provider
      value={{
        items,
        subscriptions,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        subscriptionTotal,
        discount,
        total,
        discountCode,
        applyDiscountCode,
        removeDiscountCode,
        addSubscription,
        updateSubscription,
        pauseSubscription,
        resumeSubscription,
        cancelSubscription,
        respondToRefill,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
