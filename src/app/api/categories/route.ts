export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { query } from "@/lib/neon";

export async function GET() {
  try {
    const result = await query(`SELECT id, name, slug, icon FROM categories WHERE is_active = true ORDER BY name ASC`);
    const categories = (result.rows ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      icon: row.icon,
    }));

    return NextResponse.json({ categories });
  } catch (error) {
    console.warn("[api/categories] Failed to load categories:", error);
    return NextResponse.json({ categories: [] });
  }
}
