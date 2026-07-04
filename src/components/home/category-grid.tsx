"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (!ignore) {
          setCategories(Array.isArray(data.categories) ? data.categories : []);
        }
      } catch {
        if (!ignore) setCategories([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadCategories();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="py-10">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h2 className="section-title">Shop by Category</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {loading ? "Loading categories..." : categories.length > 0 ? "Browse your available categories" : "No categories have been added yet"}
          </p>
        </div>
        <Link
          href="/products"
          className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
        >
          All categories
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center text-sm text-muted-foreground">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-600 mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="font-medium text-foreground">No categories are available right now.</p>
          <p className="mt-1">Categories added in the admin panel will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center gap-2.5 p-3 rounded-2xl hover:bg-white dark:hover:bg-gray-800/50 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-gray-700/50"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white">
                  {cat.name.slice(0, 2)}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-center text-foreground/70 group-hover:text-brand-600 transition-colors leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
