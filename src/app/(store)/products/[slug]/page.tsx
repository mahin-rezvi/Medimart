import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductDetailClient } from "./product-detail-client";

type Params = Promise<{ slug: string }>;

async function fetchProduct(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/products?slug=${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.products?.[0] || null;
  } catch (error) {
    console.error("[product-detail] Failed to fetch product:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  return {
    title: product?.name || "Product",
    description: product?.description || "View product details",
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-2">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist in our database.</p>
        <Link href="/products" className="btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/category/${product.category}`} className="hover:text-brand-600">{product.category}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <ProductDetailClient product={product} />
    </div>
  );
}
