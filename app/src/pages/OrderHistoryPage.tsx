import { useState } from 'react';
import { useOrderHistory } from '@/hooks/useOrderHistory';
import { FadeIn } from '@/components/FadeIn';
import { ArrowLeft, Package, ChevronDown, ChevronUp, Truck, RefreshCw } from 'lucide-react';

interface OrderHistoryPageProps {
  setPage: (page: string) => void;
  /** When provided (e.g. embedded in Profile), Back calls this instead of setPage('Profile') */
  onBack?: () => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function OrderHistoryPage({ setPage, onBack }: OrderHistoryPageProps) {
  const { orders } = useOrderHistory();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <button
            onClick={onBack ?? (() => setPage('Profile'))}
            className="flex items-center gap-2 text-white/50 hover:text-[#E2CDB9] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> {onBack ? 'Back' : 'Back to Profile'}
          </button>
          <h1 className="text-3xl sm:text-4xl font-semibold mb-2" style={{ fontFamily: 'var(--header)' }}>
            Order History
          </h1>
          <p className="text-white/60 mb-8">
            View your past orders, items, and shipping details.
          </p>
        </FadeIn>

        {orders.length === 0 ? (
          <FadeIn>
            <div className="glass-card text-center py-16 px-6">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <Package className="w-10 h-10 text-white/40" />
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--header)' }}>
                No orders yet
              </h2>
              <p className="text-white/60 mb-8 max-w-sm mx-auto">
                Orders you place after checkout will appear here with full details.
              </p>
              <button onClick={() => setPage('Shop')} className="btn-gold">
                Shop Now
              </button>
            </div>
          </FadeIn>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <FadeIn key={order.id}>
                <div className="glass-card overflow-hidden">
                  <button
                    onClick={() => setExpandedId((id) => (id === order.id ? null : order.id))}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left hover:border-[#E2CDB9]/40 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-[#E2CDB9]/10 flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-[#E2CDB9]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-[#E2CDB9] font-medium truncate">{order.orderNumber}</p>
                        <p className="text-white/60 text-sm">{formatDate(order.date)}</p>
                        <p className="text-white/50 text-sm mt-0.5">
                          {order.lineItems.length} item{order.lineItems.length !== 1 ? 's' : ''} · ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {expandedId === order.id ? (
                      <ChevronUp className="w-5 h-5 text-white/40 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/40 flex-shrink-0" />
                    )}
                  </button>

                  {expandedId === order.id && (
                    <div className="px-5 pb-5 pt-0 border-t border-white/10 space-y-5">
                      {/* Shipping */}
                      <div>
                        <h4 className="text-sm font-semibold text-white/80 mb-2 flex items-center gap-2">
                          <Truck className="w-4 h-4" /> Shipping address
                        </h4>
                        <p className="text-white/70 text-sm">
                          {order.shippingInfo.firstName} {order.shippingInfo.lastName}<br />
                          {order.shippingInfo.address}<br />
                          {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zip}<br />
                          {order.shippingInfo.country === 'US' ? 'United States' : order.shippingInfo.country}
                        </p>
                        <p className="text-white/60 text-sm mt-1">{order.shippingInfo.email} · {order.shippingInfo.phone}</p>
                        <p className="text-white/50 text-xs mt-1">
                          {order.shippingMethod === 'standard' ? 'Standard (5-7 days)' : 'Express (2-3 days)'}
                        </p>
                      </div>

                      {/* Items */}
                      <div>
                        <h4 className="text-sm font-semibold text-white/80 mb-3">Order items</h4>
                        <div className="space-y-3">
                          {order.lineItems.map((line, idx) => (
                            <div
                              key={idx}
                              className="flex gap-3 py-3 border-b border-white/5 last:border-0"
                            >
                              <div className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs text-[#E2CDB9]" style={{ fontFamily: 'var(--header)' }}>
                                  {line.name}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm flex items-center gap-2 flex-wrap">
                                  {line.productName}
                                  {line.isSubscription && (
                                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                                      <RefreshCw className="w-3 h-3" /> Subscription
                                    </span>
                                  )}
                                </p>
                                {line.size && <p className="text-white/50 text-xs">{line.size}</p>}
                                <p className="text-white/50 text-xs">Qty: {line.quantity}</p>
                                {line.isSubscription && line.subscriptionInterval && (
                                  <p className="text-green-400/70 text-xs">Refill every {line.subscriptionInterval} weeks</p>
                                )}
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className={`font-semibold text-sm ${line.isSubscription ? 'text-green-400' : ''}`}>
                                  ${(line.price * line.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Totals */}
                      <div className="bg-white/5 rounded-lg p-4 space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-white/60">Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-green-400"><span>Discount</span><span>-${order.discount.toFixed(2)}</span></div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-white/60">Shipping</span>
                          <span className="text-white">$0.00</span>
                        </div>
                        <div className="gold-divider my-2" />
                        <div className="flex justify-between font-bold text-base">
                          <span>Total</span>
                          <span className="text-[#E2CDB9]">${order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {order.hasSubscriptions && (
                        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <p className="text-xs text-green-400 flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            This order included a subscription. Future refills ship FREE.
                          </p>
                          <button
                            onClick={() => setPage('Subscriptions')}
                            className="mt-3 text-sm text-green-400 hover:underline"
                          >
                            Manage subscriptions →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
