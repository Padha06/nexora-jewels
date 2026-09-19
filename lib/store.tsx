'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CartLine } from '@/lib/whatsapp';

const CART_KEY = 'nexora-cart';
const WISH_KEY = 'nexora-wishlist';
const SEEN_KEY = 'nexora-recently-viewed';

interface ShopState {
  cart: CartLine[];
  addLine: (l: CartLine) => void;
  removeLine: (sku: string, variant: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWish: (slug: string) => void;
  recentlyViewed: string[];
  pushViewed: (slug: string) => void;
}

const Ctx = createContext<ShopState | null>(null);

function load<T>(k: string, fb: T): T {
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fb;
  } catch {
    return fb;
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setSeen] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(load<CartLine[]>(CART_KEY, []));
    setWishlist(load<string[]>(WISH_KEY, []));
    setSeen(load<string[]>(SEEN_KEY, []));
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem(SEEN_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed, ready]);

  const addLine: ShopState['addLine'] = (l) =>
    setCart((c) => {
      const i = c.findIndex((x) => x.sku === l.sku && x.variant === l.variant);
      if (i >= 0) {
        const next = [...c];
        next[i] = { ...next[i], qty: next[i].qty + l.qty };
        return next;
      }
      return [...c, l];
    });
  const removeLine: ShopState['removeLine'] = (sku, variant) =>
    setCart((c) => c.filter((x) => !(x.sku === sku && x.variant === variant)));
  const clearCart = () => setCart([]);
  const toggleWish = (slug: string) =>
    setWishlist((w) => (w.includes(slug) ? w.filter((s) => s !== slug) : [...w, slug]));
  const pushViewed = (slug: string) =>
    setSeen((s) => [slug, ...s.filter((x) => x !== slug)].slice(0, 8));

  return (
    <Ctx.Provider value={{ cart, addLine, removeLine, clearCart, wishlist, toggleWish, recentlyViewed, pushViewed }}>
      {children}
    </Ctx.Provider>
  );
}

export function useShop(): ShopState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useShop must be used inside ShopProvider');
  return v;
}
