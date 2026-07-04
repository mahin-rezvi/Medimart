"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/products/product-card";

interface Product {
  id: string;
  name: string;
  slug?: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  stock: number;
  brand?: string;
  category?: string;
}

export default function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?limit=8")
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Trending Now 🔥</h2>
            <p className="text-muted-foreground text-sm mt-1">Most popular products this week</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[3/4] bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="section-title">Trending Now 🔥</h2>
          <p className="text-muted-foreground text-sm mt-1">Most popular products this week</p>
        </div>
        <Link href="/products?sort=trending" className="text-brand-600 hover:text-brand-700 text-sm font-semibold">
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
