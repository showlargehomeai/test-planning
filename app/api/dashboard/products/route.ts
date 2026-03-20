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
      // Total product count (all statuses)
      const totalResult = await client.query(
        "SELECT COUNT(*) AS total FROM products"
      );

      // Active product count
      const activeResult = await client.query(
        "SELECT COUNT(*) AS count FROM products WHERE status = 'active'"
      );

      // Daily new products (last 90 days)
      const dailyResult = await client.query(`
        SELECT
          DATE(created_at) AS date,
          COUNT(*) AS count
        FROM products
        WHERE created_at >= NOW() - INTERVAL '90 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `);

      // Cumulative product growth
      const cumulativeResult = await client.query(`
        SELECT
          date,
          SUM(count) OVER (ORDER BY date) AS cumulative
        FROM (
          SELECT DATE(created_at) AS date, COUNT(*) AS count
          FROM products
          GROUP BY DATE(created_at)
          ORDER BY date ASC
        ) daily
      `);

      // Today
      const todayResult = await client.query(`
        SELECT COUNT(*) AS count
        FROM products
        WHERE DATE(created_at) = CURRENT_DATE
      `);

      // This week
      const weekResult = await client.query(`
        SELECT COUNT(*) AS count
        FROM products
        WHERE created_at >= DATE_TRUNC('week', NOW())
      `);

      // This month
      const monthResult = await client.query(`
        SELECT COUNT(*) AS count
        FROM products
        WHERE created_at >= DATE_TRUNC('month', NOW())
      `);

      // Product breakdown by type (count per subtype table)
      const typeBreakdown = await client.query(`
        SELECT
          'area_products' AS type,
          COUNT(*) AS count
        FROM area_products
        UNION ALL
        SELECT 'paint_products', COUNT(*) FROM paint_products
        UNION ALL
        SELECT 'decoration_products', COUNT(*) FROM decoration_products
        UNION ALL
        SELECT 'kitchen_equipment', COUNT(*) FROM kitchen_equipment
        UNION ALL
        SELECT 'bathroom_equipment', COUNT(*) FROM bathroom_equipment
      `);

      const typeLabels: Record<string, string> = {
        area_products: "空間商品",
        paint_products: "油漆商品",
        decoration_products: "裝飾商品",
        kitchen_equipment: "廚房設備",
        bathroom_equipment: "衛浴設備",
      };

      return NextResponse.json({
        total: parseInt(totalResult.rows[0].total),
        active: parseInt(activeResult.rows[0].count),
        today: parseInt(todayResult.rows[0].count),
        thisWeek: parseInt(weekResult.rows[0].count),
        thisMonth: parseInt(monthResult.rows[0].count),
        daily: dailyResult.rows.map((r) => ({
          date: r.date.toISOString().split("T")[0],
          count: parseInt(r.count),
        })),
        cumulative: cumulativeResult.rows.map((r) => ({
          date: r.date.toISOString().split("T")[0],
          cumulative: parseInt(r.cumulative),
        })),
        typeBreakdown: typeBreakdown.rows.map((r) => ({
          type: r.type,
          label: typeLabels[r.type] || r.type,
          count: parseInt(r.count),
        })),
        updatedAt: new Date().toISOString(),
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Products dashboard query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products data" },
      { status: 500 }
    );
  }
}
