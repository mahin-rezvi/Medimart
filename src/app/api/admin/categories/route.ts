export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { query } from "@/lib/neon";

export async function GET() {
  try {
    const result = await query<{ id: string; name: string; slug: string; icon: string | null; is_active: boolean }>(
      `SELECT id, name, slug, icon, is_active FROM categories ORDER BY name ASC`
    );

    const categories = (result.rows ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      icon: row.icon ?? undefined,
      isActive: Boolean(row.is_active),
    }));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("[api/admin/categories] Failed to load categories:", error);
    return NextResponse.json({ categories: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, icon, isActive } = body;
    const result = await query<{ id: string }>(
      `INSERT INTO categories (id, name, slug, icon, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id`,
      [slug, name, slug, icon ?? null, Boolean(isActive)]
    );

    return NextResponse.json({ id: result.rows?.[0]?.id ?? slug }, { status: 201 });
  } catch (error) {
    console.error("[api/admin/categories] Failed to create category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, slug, icon, isActive } = body;
    await query(
      `UPDATE categories SET name = $1, slug = $2, icon = $3, is_active = $4, updated_at = NOW() WHERE id = $5`,
      [name, slug, icon ?? null, Boolean(isActive), id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/admin/categories] Failed to update category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    await query(`DELETE FROM categories WHERE id = $1`, [body.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/admin/categories] Failed to delete category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
