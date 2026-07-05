export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { query } from "@/lib/neon";

export async function GET() {
  try {
    const [productsResult, ordersResult, usersResult] = await Promise.all([
      query<{ count: number }>("SELECT COUNT(*)::int AS count FROM products"),
      query<{ count: number }>("SELECT COUNT(*)::int AS count FROM orders"),
      query<{ count: number }>("SELECT COUNT(*)::int AS count FROM users"),
    ]);

    const [categoryResult, recentOrdersResult, revenueResult] = await Promise.all([
      query<{ name: string | null; value: number }>(`
        SELECT COALESCE(c.name, 'Uncategorized') AS name, COUNT(p.id)::int AS value
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        GROUP BY COALESCE(c.name, 'Uncategorized')
        ORDER BY value DESC, name ASC
        LIMIT 5
      `),
      query<{ id: string; customer_name: string | null; total: string | number | null; status: string | null; created_at: string | null }>(`
        SELECT o.id, u.name AS customer_name, o.total_price AS total, o.status, o.created_at
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 6
      `),
      query<{ revenue: string | number | null }>("SELECT COALESCE(SUM(total_price), 0)::numeric(12,2) AS revenue FROM orders"),
    ]);

    const products = Number(productsResult.rows?.[0]?.count ?? 0);
    const orders = Number(ordersResult.rows?.[0]?.count ?? 0);
    const users = Number(usersResult.rows?.[0]?.count ?? 0);
    const revenue = Number(revenueResult.rows?.[0]?.revenue ?? 0);

    const recentOrders = (recentOrdersResult.rows ?? []).map((row) => ({
      id: row.id,
      customer: { name: row.customer_name || "Guest" },
      total: Number(row.total ?? 0),
      status: row.status ?? "UNKNOWN",
      createdAt: row.created_at ? { seconds: Math.floor(new Date(row.created_at).getTime() / 1000) } : null,
    }));

    const categories = (categoryResult.rows ?? []).map((row, index) => ({
      name: row.name ?? "Uncategorized",
      value: Number(row.value ?? 0),
      color: ["#0ea5e9", "#8b5cf6", "#ec4899", "#22c55e", "#f97316"][index % 5],
    }));

    return NextResponse.json({ stats: { products, orders, users, revenue }, recentOrders, categories });
  } catch (error) {
    console.error("[api/admin/dashboard] Failed to load dashboard data:", error);
    return NextResponse.json({ stats: { products: 0, orders: 0, users: 0, revenue: 0 }, recentOrders: [], categories: [] }, { status: 500 });
  }
}
