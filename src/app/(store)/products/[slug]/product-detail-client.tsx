"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string | number;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  rating?: number;
  reviewCount?: number;
  brand?: string;
  category?: string;
  description?: string;
  [key: string]: unknown;
}

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const displayPrice = product.discountPrice ?? product.price;
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const rating = product.rating ?? 0;
  const reviewCount = product.reviewCount ?? 0;

  const addToCart = () => {
    toast.success(`${product.name} added to cart!`);
  };

  const buyNow = () => {
    toast.success("Redirecting to checkout…");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Image Gallery */}
      <div className="space-y-3">
        <div className="aspect-square bg-muted rounded-2xl overflow-hidden flex items-center justify-center">
          {product.images && product.images[activeImg] ? (
            <Image
              src={product.images[activeImg]}
              alt={product.name}
              width={600}
              height={600}
              className="object-contain"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-linear-to-br from-muted to-muted/50">
              <span className="text-8xl opacity-20">📱</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {(product.images && product.images.length > 0
            ? product.images
            : [null, null, null, null]
          ).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden bg-muted ${
                activeImg === i ? "border-brand-600" : "border-border"
              }`}
            >
              {img ? (
                <Image
                  src={img}
                  alt=""
                  width={64}
                  height={64}
                  className="object-contain w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl opacity-20">
                  📱
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-5">
        <div>
          {product.brand && (
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={`/brand/${product.brand}`}
                className="text-brand-600 text-sm font-semibold hover:underline"
              >
                {product.brand}
              </Link>
            </div>
          )}
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight">
            {product.name}
          </h1>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= Math.round(rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
        </div>

        {/* Price */}
        <div className="flex items-end gap-3">
          <span className="font-display text-4xl font-bold text-brand-700 dark:text-brand-400">
            {formatPrice(displayPrice)}
          </span>
          {discount > 0 && (
            <>
              <span className="text-muted-foreground line-through text-lg">
                {formatPrice(product.price)}
              </span>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold px-2 py-1 rounded-lg">
                -{discount}% OFF
              </span>
            </>
          )}
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-4">
          <p className="text-sm font-semibold">Quantity:</p>
          <div className="flex items-center gap-2 border border-border rounded-xl p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-lg"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <button
              onClick={() =>
                setQuantity(Math.min(Math.max(product.stock ?? 0, 1), quantity + 1))
              }
              className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-sm text-muted-foreground">
            {Math.max(product.stock ?? 0, 0)} in stock
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={addToCart}
            className="flex-1 btn-outline flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" /> Add to Cart
          </button>
          <button
            onClick={buyNow}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            Buy Now
          </button>
          <button className="w-11 h-11 border-2 border-border rounded-xl flex items-center justify-center hover:border-red-400 hover:bg-red-50 hover:text-red-500 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
          <button className="w-11 h-11 border-2 border-border rounded-xl flex items-center justify-center hover:border-brand-400 hover:bg-brand-50 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Trust */}
        <div className="grid grid-cols-3 gap-3 border-t border-border pt-5">
          {[
            { icon: Shield, label: "Official Warranty" },
            { icon: Truck, label: "Fast Delivery" },
            { icon: RotateCcw, label: "7-Day Returns" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 text-center">
              <div className="w-9 h-9 bg-brand-50 dark:bg-brand-950/30 rounded-xl flex items-center justify-center">
                <Icon className="w-4 h-4 text-brand-600" />
              </div>
              <span className="text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Description Section */}
      <div className="md:col-span-2 mt-12 border-t border-border pt-8 space-y-8">
        <div>
          <h3 className="font-semibold text-lg mb-4">Description</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {product.description || "No description available"}
          </p>
        </div>
      </div>
    </div>
  );
}
