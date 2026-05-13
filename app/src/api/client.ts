/**
 * API client for production backend.
 * All requests send cookies (credentials: 'include') for session auth.
 */

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

type Json = Record<string, unknown>;

async function request<T = Json>(
  path: string,
  options: Omit<RequestInit, 'body'> & { body?: Json } = {}
): Promise<{ data?: T; error?: string; status: number }> {
  const { body, ...rest } = options;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    credentials: 'include',
    headers,
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });
  let data: T | undefined;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text) as T;
    } catch {
      // non-JSON response
    }
  }
  const error = (data as { error?: string })?.error || (res.ok ? undefined : text || res.statusText);
  return { data, error, status: res.status };
}

export const api = {
  async getMe() {
    return request<{ user: { id: string; email: string; name: string } }>('/me');
  },

  async register(payload: { email: string; password: string; confirmPassword: string; name?: string }) {
    return request<{ user: { id: string; email: string; name: string } }>('/auth/register', {
      method: 'POST',
      body: payload,
    });
  },

  async login(payload: { email: string; password: string }) {
    return request<{ user: { id: string; email: string; name: string } }>('/auth/login', {
      method: 'POST',
      body: payload,
    });
  },

  async logout() {
    return request('/auth/logout', { method: 'POST' });
  },

  async getOrders() {
    return request<{ orders: unknown[] }>('/orders');
  },

  async getOrder(id: string) {
    return request<{ order: unknown }>(`/orders/${id}`);
  },

  async createCheckoutSession(payload: {
    mode: 'payment' | 'subscription';
    idempotencyKey?: string;
    items?: { name: string; price: number; quantity: number; sku?: string }[];
    itemsWithPriceIds?: { priceId: string; quantity: number }[];
    priceId?: string;
  }) {
    return request<{ url: string }>('/api/checkout/session', {
      method: 'POST',
      body: payload,
    });
  },

  async getOrderStatusBySession(sessionId: string) {
    return request<{ status: string }>(`/api/orders/by-session/${encodeURIComponent(sessionId)}`);
  },

  async createPortalSession(customerId: string) {
    return request<{ url: string }>('/billing/portal', {
      method: 'POST',
      body: { customerId },
    });
  },
};
