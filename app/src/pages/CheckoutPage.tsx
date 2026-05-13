import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { FadeIn } from '@/components/FadeIn';
import { Check, ChevronRight, Truck, Package, ArrowLeft, RefreshCw, Mail, Phone, Bell } from 'lucide-react';
import type { ShippingInfo, Order, OrderLineItem } from '@/types';
import { useOrderHistory } from '@/hooks/useOrderHistory';
import { products } from '@/data/products';
import { US_STATE_OPTIONS } from '@/data/shipping';
import { api } from '@/api/client';

interface CheckoutPageProps {
  setPage: (page: string) => void;
}

type CheckoutStep = 'shipping' | 'review' | 'confirmation';
type NotificationMethod = 'email' | 'sms' | 'both';

// Snapshot stored before redirect to Stripe so we can show review after return (full page load)
interface CheckoutReturnData {
  shippingInfo: ShippingInfo;
  shippingMethod: 'standard' | 'express';
  notificationMethod: NotificationMethod;
  lineItems: { name: string; productName: string; size?: string; quantity: number; price: number; isSubscription: boolean; subscriptionInterval?: number }[];
  subtotal: number;
  discount: number;
  baseShippingCost: number;
  total: number;
  hasSubscriptions: boolean;
  subscriptionInterval?: number;
}

export function CheckoutPage({ setPage }: CheckoutPageProps) {
  const { items, subtotal, discount, total, clearCart, addSubscription } = useCart();
  const { addOrder } = useOrderHistory();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [notificationMethod, setNotificationMethod] = useState<NotificationMethod>('email');
  const [checkoutReturnData, setCheckoutReturnData] = useState<CheckoutReturnData | null>(null);
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [confirmedOrderTotal, setConfirmedOrderTotal] = useState<number | null>(null);

  // Handle return from Stripe: restore order snapshot and show Review step
  const [orderStatusFromSession, setOrderStatusFromSession] = useState<string | null>(null);
  const [returnSessionId, setReturnSessionId] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') !== 'success') return;
    const sessionId = params.get('session_id');
    if (sessionId) setReturnSessionId(sessionId);
    const returnDataRaw = sessionStorage.getItem('checkout_return_data');
    if (returnDataRaw) {
      try {
        const data = JSON.parse(returnDataRaw) as CheckoutReturnData;
        setCheckoutReturnData(data);
        setShippingInfo(data.shippingInfo);
        setShippingMethod(data.shippingMethod);
        setNotificationMethod(data.notificationMethod);
      } catch (_) {}
    }
    const stored = sessionStorage.getItem('checkout_subscriptions');
    if (stored) {
      try {
        const subs = JSON.parse(stored);
        subs.forEach((s: { productId: number; quantity: number; notificationMethod: NotificationMethod; email: string; phone: string }) => {
          const product = products.find(p => p.id === s.productId);
          if (product) {
            const nextRefill = new Date();
            nextRefill.setDate(nextRefill.getDate() + (product.subscriptionInterval || 5) * 7);
            addSubscription({
              product,
              quantity: s.quantity,
              startDate: new Date().toISOString(),
              nextRefillDate: nextRefill.toISOString(),
              notificationMethod: s.notificationMethod,
              email: s.email,
              phone: s.phone,
            });
          }
        });
      } finally {
        sessionStorage.removeItem('checkout_subscriptions');
      }
    }
    setCurrentStep('review');
    window.history.replaceState({}, '', window.location.pathname);
    window.scrollTo(0, 0);
  }, [addSubscription]);

  // Poll order status by session_id when returning from Stripe
  useEffect(() => {
    if (!returnSessionId) return;
    let cancelled = false;
    const poll = async () => {
      const { data, status } = await api.getOrderStatusBySession(returnSessionId);
      if (cancelled) return;
      if (status === 200 && data?.status) setOrderStatusFromSession(data.status);
    };
    poll();
    const t = setInterval(poll, 2000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [returnSessionId]);

  const subscriptionItems = items.filter(item => item.purchaseType === 'subscription');
  const hasSubscriptions = subscriptionItems.length > 0;
  const baseShippingCost = 0;

  if (items.length === 0 && !checkoutReturnData && currentStep !== 'confirmation') {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <h1 className="text-3xl font-semibold mb-4" style={{ fontFamily: 'var(--header)' }}>
              Your Cart is Empty
            </h1>
            <p className="text-white/60 mb-8">Add some products to proceed with checkout.</p>
            <button onClick={() => setPage('Shop')} className="btn-gold">
              Shop Now
            </button>
          </FadeIn>
        </div>
      </div>
    );
  }

  const goToStripeCheckout = async () => {
    setIsProcessing(true);
    setCheckoutError(null);
    const lineItems = items.map((item) => {
      const price = item.purchaseType === 'subscription' && item.product.subscriptionPrice != null
        ? item.product.subscriptionPrice
        : item.product.price;
      return {
        name: item.product.shortName || item.product.name,
        price,
        quantity: item.quantity,
      };
    });
    if (subscriptionItems.length > 0) {
      sessionStorage.setItem(
        'checkout_subscriptions',
        JSON.stringify(
          subscriptionItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            notificationMethod,
            email: shippingInfo.email,
            phone: shippingInfo.phone,
          }))
        )
      );
    }
    const returnData: CheckoutReturnData = {
      shippingInfo,
      shippingMethod,
      notificationMethod,
      lineItems: items.map((item) => ({
        name: item.product.shortName || item.product.name,
        productName: item.product.name,
        size: item.product.size,
        quantity: item.quantity,
        price: item.purchaseType === 'subscription' ? (item.product.subscriptionPrice ?? item.product.price) : item.product.price,
        isSubscription: item.purchaseType === 'subscription',
        subscriptionInterval: item.product.subscriptionInterval,
      })),
      subtotal,
      discount,
      baseShippingCost,
      total,
      hasSubscriptions: subscriptionItems.length > 0,
      subscriptionInterval: subscriptionItems[0]?.product.subscriptionInterval,
    };
    sessionStorage.setItem('checkout_return_data', JSON.stringify(returnData));
    try {
      const { data, error, status } = await api.createCheckoutSession({
        mode: 'payment',
        items: lineItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });
      if (status >= 400 || error) {
        throw new Error(error || 'Checkout failed');
      }
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error('No checkout URL returned');
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Could not start checkout. Ensure you are signed in and the backend is running.');
      setIsProcessing(false);
    }
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await goToStripeCheckout();
  };

  const handleConfirmOrder = () => {
    const num = `ASC-${Date.now().toString(36).toUpperCase()}`;
    const orderTotal = checkoutReturnData?.total ?? total;
    const rd = checkoutReturnData;
    const lineItems: OrderLineItem[] = rd
      ? rd.lineItems
      : items.map((item) => ({
          name: item.product.shortName || item.product.name,
          productName: item.product.name,
          size: item.product.size,
          quantity: item.quantity,
          price: item.purchaseType === 'subscription' ? (item.product.subscriptionPrice ?? item.product.price) : item.product.price,
          isSubscription: item.purchaseType === 'subscription',
          subscriptionInterval: item.product.subscriptionInterval,
        }));
    const order: Order = {
      id: num,
      orderNumber: num,
      date: new Date().toISOString(),
      shippingInfo: { ...shippingInfo },
      shippingMethod,
      notificationMethod,
      lineItems,
      subtotal: rd?.subtotal ?? subtotal,
      discount: rd?.discount ?? discount,
      baseShippingCost: rd?.baseShippingCost ?? baseShippingCost,
      total: orderTotal,
      hasSubscriptions: rd?.hasSubscriptions ?? hasSubscriptions,
      subscriptionInterval: rd?.subscriptionInterval ?? subscriptionItems[0]?.product.subscriptionInterval,
    };
    addOrder(order);
    setConfirmedOrderTotal(orderTotal);
    setOrderNumber(num);
    clearCart();
    sessionStorage.removeItem('checkout_return_data');
    sessionStorage.removeItem('checkout_subscriptions');
    setCurrentStep('confirmation');
    window.scrollTo(0, 0);
  };

  const StepIndicator = () => (
    <div className="step-indicator mb-8">
      {[
        { key: 'shipping', label: 'Shipping', icon: Truck },
        { key: 'review', label: 'Review & Confirm', icon: Package }
      ].map((step, index) => {
        const StepIcon = step.icon;
        const isActive = currentStep === step.key;
        const isCompleted = step.key === 'shipping' && (currentStep === 'review' || currentStep === 'confirmation');
        return (
          <div key={step.key} className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
            <div className="step-number">
              {isCompleted ? <Check className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
            </div>
            <span className="hidden sm:inline">{step.label}</span>
            {index < 1 && <ChevronRight className="w-4 h-4 text-white/20" />}
          </div>
        );
      })}
    </div>
  );

  if (currentStep === 'shipping') {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <button onClick={() => setPage('Cart')} className="flex items-center gap-2 text-white/50 hover:text-[#E2CDB9] transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Cart
            </button>
            <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: 'var(--header)' }}>Checkout</h1>
            <p className="text-white/60 mb-8">Complete your order in just a few steps.</p>
            <StepIndicator />
          </FadeIn>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FadeIn>
                <form onSubmit={handleShippingSubmit} className="glass-card">
                  <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'var(--header)' }}>Shipping Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-2">First Name *</label>
                      <input type="text" required value={shippingInfo.firstName} onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})} placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-2">Last Name *</label>
                      <input type="text" required value={shippingInfo.lastName} onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})} placeholder="Doe" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-2">Email *</label>
                      <input type="email" required value={shippingInfo.email} onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})} placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-2">Phone *</label>
                      <input type="tel" required value={shippingInfo.phone} onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})} placeholder="(555) 123-4567" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm text-white/60 mb-2">Address *</label>
                    <input type="text" required value={shippingInfo.address} onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})} placeholder="123 Main Street, Apt 4B" />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-2">City *</label>
                      <input type="text" required value={shippingInfo.city} onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})} placeholder="New York" />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-2">State *</label>
                      <select required value={shippingInfo.state} onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}>
                        {US_STATE_OPTIONS.map((opt) => (
                          <option key={opt.value || 'blank'} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-2">ZIP Code *</label>
                      <input type="text" required value={shippingInfo.zip} onChange={(e) => setShippingInfo({...shippingInfo, zip: e.target.value})} placeholder="10001" />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm text-white/60 mb-2">Country *</label>
                    <select value={shippingInfo.country} onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                  <h3 className="text-lg font-medium mb-4" style={{ fontFamily: 'var(--header)' }}>Shipping Method</h3>
                  {hasSubscriptions && (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-green-400 text-sm flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        <strong>All subscription refills ship FREE.</strong> This order only.
                      </p>
                    </div>
                  )}
                  {hasSubscriptions && (
                    <div className="mb-6 p-5 bg-green-500/10 border border-green-500/30 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--header)' }}>
                        <Bell className="w-5 h-5 text-green-400" /> Subscription Notifications
                      </h3>
                      <p className="text-white/70 text-sm mb-4">How would you like to be notified when your refill is ready in {subscriptionItems[0]?.product.subscriptionInterval} weeks?</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(['email', 'sms', 'both'] as const).map((m) => (
                          <button key={m} type="button" onClick={() => setNotificationMethod(m)} className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${notificationMethod === m ? 'border-[#E2CDB9] bg-[#E2CDB9]/10' : 'border-white/10 hover:border-white/30'}`}>
                            {m === 'email' && <Mail className="w-6 h-6" />}
                            {m === 'sms' && <Phone className="w-6 h-6" />}
                            {m === 'both' && <Bell className="w-6 h-6" />}
                            <span className="text-sm">{m === 'email' ? 'Email' : m === 'sms' ? 'Text' : 'Both'}</span>
                          </button>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-white/5 rounded-lg">
                        <p className="text-xs text-white/60"><strong className="text-white">How it works:</strong> You'll receive a notification when your refill is ready. You have 5 days to respond with "Refill Now" or "Not Ready". If we don't hear from you, we'll ship automatically.</p>
                      </div>
                    </div>
                  )}
                  <div className="space-y-3 mb-6">
                    <label className={`radio-label ${shippingMethod === 'standard' ? 'selected' : ''}`}>
                      <input type="radio" name="shipping" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} className="sr-only" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Standard Shipping</span>
                          <span className="text-white">$0.00</span>
                        </div>
                        <p className="text-white/50 text-sm">5-7 business days</p>
                      </div>
                    </label>
                    <label className={`radio-label ${shippingMethod === 'express' ? 'selected' : ''}`}>
                      <input type="radio" name="shipping" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="sr-only" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Express Shipping</span>
                          <span className="text-white">$0.00</span>
                        </div>
                        <p className="text-white/50 text-sm">2-3 business days</p>
                      </div>
                    </label>
                  </div>
                  {checkoutError && (
                    <p className="text-red-400 text-sm mb-4 text-center">{checkoutError}</p>
                  )}
                  <button type="submit" disabled={isProcessing} className="w-full btn-gold justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                    {isProcessing ? (<><div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Redirecting to Stripe...</>) : (<>Continue to Payment <ChevronRight className="w-5 h-5" /></>)}
                  </button>
                  <p className="text-center text-white/40 text-xs mt-4">You will complete payment securely on Stripe, then return here to review and confirm.</p>
                </form>
              </FadeIn>
            </div>
            <div className="lg:col-span-1">
              <FadeIn>
                <div className="glass-card lg:sticky lg:top-28">
                  <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--header)' }}>Order Summary</h2>
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    {items.map((item) => (
                      <div key={`${item.purchaseType === 'subscription' ? 'sub' : 'ot'}-${item.product.id}`} className="flex justify-between text-sm gap-2 min-w-0">
                        <span className="text-white/60 flex items-center gap-1 min-w-0 truncate">
                          {item.purchaseType === 'subscription' && <RefreshCw className="w-3 h-3 text-green-400 flex-shrink-0" />}
                          {item.product.shortName} × {item.quantity}
                        </span>
                        <span className={`flex-shrink-0 ${item.purchaseType === 'subscription' ? 'text-green-400' : ''}`}>
                          ${((item.purchaseType === 'subscription' ? (item.product.subscriptionPrice || item.product.price) : item.product.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="gold-divider mb-4" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-white/60">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                    {discount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                  </div>
                  <div className="gold-divider my-4" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#E2CDB9]">${total.toFixed(2)}</span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'review') {
    const rd = checkoutReturnData;
    const reviewSubtotal = rd ? rd.subtotal : subtotal;
    const reviewDiscount = rd ? rd.discount : discount;
    const finalTotal = rd ? rd.total : total;
    const reviewHasSubs = rd ? rd.hasSubscriptions : hasSubscriptions;
    const reviewSubInterval = rd ? rd.subscriptionInterval : subscriptionItems[0]?.product.subscriptionInterval;
    const reviewLineItems = rd ? rd.lineItems : items.map((item) => ({ name: item.product.shortName || item.product.name, productName: item.product.name, size: item.product.size, quantity: item.quantity, price: item.purchaseType === 'subscription' ? (item.product.subscriptionPrice ?? item.product.price) : item.product.price, isSubscription: item.purchaseType === 'subscription', subscriptionInterval: item.product.subscriptionInterval }));

    return (
      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            {returnSessionId && (
              <p className="mb-4 text-sm text-white/70">
                {orderStatusFromSession === 'paid' ? 'Payment confirmed.' : 'Confirming your payment...'}
              </p>
            )}
            {!rd && (
              <button onClick={() => setCurrentStep('shipping')} className="flex items-center gap-2 text-white/50 hover:text-[#E2CDB9] transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Shipping
              </button>
            )}
            <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: 'var(--header)' }}>Review & Confirm</h1>
            <p className="text-white/60 mb-8">{rd ? 'Payment complete. Review your Ascend order below, then confirm.' : 'Verify your order details below.'}</p>
            <StepIndicator />
          </FadeIn>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <FadeIn>
                <div className="glass-card">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--header)' }}>Shipping Address</h3>
                    {!rd && <button onClick={() => setCurrentStep('shipping')} className="text-[#E2CDB9] text-sm hover:underline">Edit</button>}
                  </div>
                  <p className="text-white/80">{shippingInfo.firstName} {shippingInfo.lastName}<br />{shippingInfo.address}<br />{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}<br />{shippingInfo.country === 'US' ? 'United States' : shippingInfo.country}</p>
                  <p className="text-white/60 mt-2">{shippingInfo.email}</p>
                  <p className="text-white/60">{shippingInfo.phone}</p>
                </div>
              </FadeIn>
              <FadeIn>
                <div className="glass-card">
                  <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--header)' }}>Payment</h3>
                  <div className="flex items-center gap-3">
                    <Check className="w-8 h-8 text-green-400" />
                    <div>
                      <p className="text-white/80">Paid via Stripe</p>
                      <p className="text-white/60 text-sm">Payment completed securely on Stripe</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
              {reviewHasSubs && (
                <FadeIn>
                  <div className="glass-card border-green-500/30">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2" style={{ fontFamily: 'var(--header)' }}><RefreshCw className="w-5 h-5 text-green-400" /> Subscription Settings</h3>
                      {!rd && <button onClick={() => setCurrentStep('shipping')} className="text-[#E2CDB9] text-sm hover:underline">Edit</button>}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-white/60">Notification Method:</span>
                        <span className="text-green-400">{notificationMethod === 'email' && 'Email'}{notificationMethod === 'sms' && 'Text Message'}{notificationMethod === 'both' && 'Email & Text'}</span>
                      </div>
                      <div className="p-3 bg-green-500/10 rounded-lg">
                        <p className="text-sm text-white/70"><strong className="text-white">Your refill schedule:</strong> We'll notify you after {reviewSubInterval ?? 5} weeks. You'll have 5 days to respond before automatic shipment.</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              )}
              <FadeIn>
                <div className="glass-card">
                  <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--header)' }}>Order Items</h3>
                  <div className="space-y-4">
                    {reviewLineItems.map((line, idx) => (
                      <div key={idx} className="flex gap-4 pb-4 border-b border-white/10 last:border-0">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-lg border border-white/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-[#E2CDB9]" style={{ fontFamily: 'var(--header)' }}>{line.name}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium flex items-center gap-2">
                            {line.productName}
                            {line.isSubscription && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Subscription</span>}
                          </h4>
                          {line.size && <p className="text-white/60 text-sm">{line.size}</p>}
                          <p className="text-white/60 text-sm">Qty: {line.quantity}</p>
                          {line.isSubscription && line.subscriptionInterval && <p className="text-green-400/70 text-xs">Refill every {line.subscriptionInterval} weeks</p>}
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${line.isSubscription ? 'text-green-400' : ''}`}>
                            ${(line.price * line.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
            <div className="lg:col-span-1">
              <FadeIn>
                <div className="glass-card lg:sticky lg:top-28">
                  <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--header)' }}>Order Total</h2>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between"><span className="text-white/60">Subtotal</span><span>${reviewSubtotal.toFixed(2)}</span></div>
                    {reviewDiscount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>-${reviewDiscount.toFixed(2)}</span></div>}
                  </div>
                  <div className="gold-divider my-4" />
                  <div className="flex justify-between text-xl font-bold mb-6">
                    <span>Total</span>
                    <span className="text-[#E2CDB9]">${finalTotal.toFixed(2)}</span>
                  </div>
                  <button onClick={handleConfirmOrder} className="w-full btn-gold justify-center">
                    Review and Confirm <Check className="w-4 h-4" />
                  </button>
                  <p className="text-center text-white/40 text-xs mt-4">By confirming, you agree to our Terms of Service and Privacy Policy.</p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Order Confirmation
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <FadeIn>
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold mb-4" style={{ fontFamily: 'var(--header)' }}>Order Confirmed!</h1>
          <p className="text-white/60 mb-2 text-lg">Thank you for your purchase, {shippingInfo.firstName}!</p>
          <p className="text-white/40 mb-8">Your order number is <span className="text-[#E2CDB9] font-mono">{orderNumber}</span></p>
          <div className="glass-card text-left mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--header)' }}>Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-white/60">Order Number</span><span className="font-mono">{orderNumber}</span></div>
              <div className="flex justify-between"><span className="text-white/60">Email</span><span>{shippingInfo.email}</span></div>
              <div className="flex justify-between"><span className="text-white/60">Payment Method</span><span>Stripe</span></div>
              <div className="flex justify-between"><span className="text-white/60">Shipping Method</span><span>{shippingMethod === 'standard' ? 'Standard (5-7 days)' : 'Express (2-3 days)'}</span></div>
              {hasSubscriptions && (
                <div className="flex justify-between">
                  <span className="text-white/60">Subscription Notifications</span>
                  <span className="text-green-400">{notificationMethod === 'email' && 'Email'}{notificationMethod === 'sms' && 'Text'}{notificationMethod === 'both' && 'Both'}</span>
                </div>
              )}
              <div className="gold-divider my-3" />
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-[#E2CDB9]">${(confirmedOrderTotal ?? total).toFixed(2)}</span></div>
            </div>
          </div>
              {(hasSubscriptions || checkoutReturnData?.hasSubscriptions) && (
                <div className="glass-card border-green-500/30 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <RefreshCw className="w-6 h-6 text-green-400" />
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--header)' }}>Your Subscription is Active</h3>
                  </div>
                  <p className="text-white/70 text-sm mb-4">We'll notify you via {notificationMethod === 'email' ? 'email' : notificationMethod === 'sms' ? 'text message' : 'email and text'} when your refill is ready in {checkoutReturnData?.subscriptionInterval ?? subscriptionItems[0]?.product.subscriptionInterval ?? 5} weeks.</p>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <p className="text-xs text-white/60"><strong className="text-white">Remember:</strong> You'll have 5 days to respond. Choose "Refill Now" to ship immediately, "Not Ready" to delay, or do nothing and we'll ship automatically.</p>
              </div>
              <div className="mt-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                <p className="text-xs text-green-400 flex items-center gap-2"><Truck className="w-4 h-4" /><strong>All future refills ship FREE.</strong> Never pay shipping on subscription orders again.</p>
              </div>
              <button onClick={() => setPage('Subscriptions')} className="mt-4 w-full py-3 border border-green-500 text-green-400 rounded-lg hover:bg-green-500 hover:text-black transition-all text-sm font-medium">Manage Subscriptions</button>
            </div>
          )}
          <p className="text-white/60 mb-8">We've sent a confirmation email to {shippingInfo.email} with your order details.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setPage('Shop')} className="btn-gold">Continue Shopping</button>
            <button onClick={() => setPage('Home')} className="btn-outline">Back to Home</button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
