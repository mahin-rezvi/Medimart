export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/neon";

// ─── GET: List products with optional filters ─────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category")?.trim();
  const slug = searchParams.get("slug")?.trim();
  const featured = searchParams.get("featured")?.trim();
  const flashSale = searchParams.get("flashSale")?.trim();
  const limit = parseInt(searchParams.get("limit") ?? "24", 10);

  try {
    const conditions: string[] = ["is_active = true"];
    const params: unknown[] = [];

    if (category) {
      conditions.push("category = $" + (params.length + 1));
      params.push(category);
    }

    if (slug) {
      conditions.push("slug = $" + (params.length + 1));
      params.push(slug);
    }

    if (featured === "true") {
      conditions.push("is_featured = true");
    }

    if (flashSale === "true") {
      conditions.push("is_flash_sale = true");
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `SELECT id, name, slug, price, discount_price, images, rating, review_count, stock, brand, category, description, is_active, is_featured, is_flash_sale, created_at, updated_at FROM products ${whereClause} ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(Math.max(limit, 1));

    const result = await query(sql, params);
    const products = (result.rows ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      price: Number(row.price ?? 0),
      discountPrice: row.discount_price ? Number(row.discount_price) : undefined,
      images: Array.isArray(row.images) ? row.images : [],
      rating: row.rating ? Number(row.rating) : undefined,
      reviewCount: row.review_count ? Number(row.review_count) : undefined,
      stock: Number(row.stock ?? 0),
      brand: row.brand,
      category: row.category,
      description: row.description,
      isActive: Boolean(row.is_active),
      isFeatured: Boolean(row.is_featured),
      isFlashSale: Boolean(row.is_flash_sale),
    }));

    return NextResponse.json({ products, total: products.length });
  } catch (err) {
    console.warn("[api/products] Failed to read products:", err);
    return NextResponse.json({ products: [], total: 0, source: "fallback" });
  }
}

// ─── POST: Create product (admin only) ────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await query(
      `INSERT INTO products (name, slug, price, discount_price, images, rating, review_count, stock, brand, category, description, is_active, is_featured, is_flash_sale, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW()) RETURNING id`,
      [
        body.name,
        body.slug,
        body.price,
        body.discountPrice ?? null,
        body.images ?? [],
        body.rating ?? null,
        body.reviewCount ?? 0,
        body.stock ?? 0,
        body.brand ?? null,
        body.category ?? null,
        body.description ?? null,
        body.isActive ?? true,
        body.isFeatured ?? false,
        body.isFlashSale ?? false,
      ]
    );

    const insertedId = result.rows?.[0]?.id;
    return NextResponse.json({ id: insertedId }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
