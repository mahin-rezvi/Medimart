"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, LogIn } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";

interface CartItem {
  id: string;
  name: string;
  variant: string | null;
  price: number;
  quantity: number;
  image: string | null;
}

export default function CartPage() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (loading || typeof window === "undefined") return;

    const storageKey = user?.uid ? `medimart-cart-${user.uid}` : "medimart-cart-guest";
    const stored = window.localStorage.getItem(storageKey);

    if (!user) {
      setItems([]);
      window.localStorage.removeItem("medimart-cart-guest");
      setHydrated(true);
      return;
    }

    try {
      const parsed = stored ? (JSON.parse(stored) as CartItem[]) : [];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    } finally {
      setHydrated(true);
    }
  }, [user?.uid, loading]);

  useEffect(() => {
    if (!hydrated || loading || typeof window === "undefined") return;

    if (!user) {
      window.localStorage.removeItem("medimart-cart-guest");
      return;
    }

    const storageKey = `medimart-cart-${user.uid}`;
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, hydrated, loading, user?.uid]);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item removed from cart");
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 1000 ? 0 : 80;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-20 h-20 text-muted mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">
          {user
            ? "Save products for later and they’ll stay here for your account."
            : "Sign in to keep a personal cart and access it across devices."}
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/products" className="btn-primary">Browse Products</Link>
          {!user && (
            <Link href="/login" className="btn-outline inline-flex items-center gap-2">
              <LogIn className="w-4 h-4" /> Sign In
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-2xl p-4 flex gap-4">
              <div className="w-24 h-24 bg-muted rounded-xl flex items-center justify-center shrink-0">
                <span className="text-3xl opacity-30">🛍️</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
                {item.variant && <p className="text-xs text-muted-foreground mt-0.5">{item.variant}</p>}
                <p className="font-bold text-brand-700 dark:text-brand-400 mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 border border-border rounded-lg p-1">
                    <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center hover:bg-muted rounded">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center hover:bg-muted rounded">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Coupon */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-semibold text-sm mb-3">Have a coupon?</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon code"
                className="form-input h-10 text-sm flex-1"
              />
              <button className="btn-outline h-10 px-4 text-sm whitespace-nowrap">Apply</button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card border border-border rounded-2xl p-6 h-fit sticky top-20">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium"}>
                {shipping === 0 ? "FREE" : formatPrice(shipping)}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-muted-foreground bg-muted rounded-lg p-2">
                Add {formatPrice(1000 - subtotal)} more for FREE shipping!
              </p>
            )}
            <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-brand-700 dark:text-brand-400">{formatPrice(total)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>

          <Link href="/products" className="text-center block mt-3 text-sm text-brand-600 hover:underline">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
