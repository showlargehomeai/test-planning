import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: { rejectUnauthorized: false },
  max: 3,
  idleTimeoutMillis: 30000,
});

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      // Product type distribution
      const typeResult = await client.query(`
        SELECT 'area' AS type, COUNT(*) AS count FROM area_products
        UNION ALL SELECT 'paint', COUNT(*) FROM paint_products
        UNION ALL SELECT 'decoration', COUNT(*) FROM decoration_products
        UNION ALL SELECT 'kitchen', COUNT(*) FROM kitchen_equipment
        UNION ALL SELECT 'bathroom', COUNT(*) FROM bathroom_equipment
      `);

      // Decoration category breakdown
      const decorationResult = await client.query(`
        SELECT decoration_category AS category, COUNT(*) AS count
        FROM decoration_products
        GROUP BY decoration_category
        ORDER BY count DESC
      `);

      // Kitchen category breakdown
      const kitchenResult = await client.query(`
        SELECT equipment_category AS category, COUNT(*) AS count
        FROM kitchen_equipment
        GROUP BY equipment_category
        ORDER BY count DESC
      `);

      // Bathroom category breakdown
      const bathroomResult = await client.query(`
        SELECT equipment_category AS category, COUNT(*) AS count
        FROM bathroom_equipment
        GROUP BY equipment_category
        ORDER BY count DESC
      `);

      const typeDistribution = typeResult.rows.map((r) => ({
        type: r.type,
        count: parseInt(r.count),
      }));

      const decorationCategories = decorationResult.rows.map((r) => ({
        category: r.category || "未分類",
        count: parseInt(r.count),
      }));

      const kitchenCategories = kitchenResult.rows.map((r) => ({
        category: r.category || "未分類",
        count: parseInt(r.count),
      }));

      const bathroomCategories = bathroomResult.rows.map((r) => ({
        category: r.category || "未分類",
        count: parseInt(r.count),
      }));

      return NextResponse.json({
        typeDistribution,
        decorationCategories,
        kitchenCategories,
        bathroomCategories,
        updatedAt: new Date().toISOString(),
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Categories query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch category data" },
      { status: 500 }
    );
  }
}
