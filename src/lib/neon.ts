import { Pool, type QueryResultRow } from "pg";

let pool: Pool | null = null;

export function getDatabasePool() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
      max: 5,
    });
  }

  return pool;
}

export async function query<T extends QueryResultRow = Record<string, unknown>>(text: string, params: unknown[] = []) {
  const dbPool = getDatabasePool();

  if (!dbPool) {
    return { rows: [] as T[], rowCount: 0 };
  }

  const client = await dbPool.connect();

  try {
    const result = await client.query<T>(text, params);
    return result;
  } catch (error) {
    console.warn("[neon] Query failed:", error);
    return { rows: [] as T[], rowCount: 0 };
  } finally {
    client.release();
  }
}
