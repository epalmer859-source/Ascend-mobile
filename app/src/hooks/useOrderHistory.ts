import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { Order } from '@/types';

const STORAGE_PREFIX = 'ascend_order_history_';

function getStorageKey(userId: string | null): string {
  return `${STORAGE_PREFIX}${userId ?? 'guest'}`;
}

function loadOrders(storageKey: string): Order[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOrders(storageKey: string, orders: Order[]) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(orders));
  } catch (_) {}
}

export function useOrderHistory() {
  const { user } = useAuth();
  const storageKey = getStorageKey(user?.id ?? null);
  const [orders, setOrders] = useState<Order[]>(() => loadOrders(storageKey));

  // Reload orders when user changes (login / logout / switch account)
  useEffect(() => {
    setOrders(loadOrders(storageKey));
  }, [storageKey]);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => {
      const next = [order, ...prev];
      saveOrders(storageKey, next);
      return next;
    });
  }, [storageKey]);

  return { orders, addOrder };
}
