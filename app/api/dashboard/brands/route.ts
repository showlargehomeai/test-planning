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
      // Total brand count
      const totalResult = await client.query(
        "SELECT COUNT(*) AS total FROM brands"
      );

      // Daily new brands (last 90 days)
      const dailyResult = await client.query(`
        SELECT
          DATE(created_at) AS date,
          COUNT(*) AS count
        FROM brands
        WHERE created_at >= NOW() - INTERVAL '90 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `);

      // Cumulative brand growth
      const cumulativeResult = await client.query(`
        SELECT
          date,
          SUM(count) OVER (ORDER BY date) AS cumulative
        FROM (
          SELECT DATE(created_at) AS date, COUNT(*) AS count
          FROM brands
          GROUP BY DATE(created_at)
          ORDER BY date ASC
        ) daily
      `);

      // Today new
      const todayResult = await client.query(`
        SELECT COUNT(*) AS count
        FROM brands
        WHERE DATE(created_at) = CURRENT_DATE
      `);

      // This week new
      const weekResult = await client.query(`
        SELECT COUNT(*) AS count
        FROM brands
        WHERE created_at >= DATE_TRUNC('week', NOW())
      `);

      // This month new
      const monthResult = await client.query(`
        SELECT COUNT(*) AS count
        FROM brands
        WHERE created_at >= DATE_TRUNC('month', NOW())
      `);

      // Top 10 vendors by brand count
      const topVendorsResult = await client.query(`
        SELECT v.name, COUNT(b.id) as brand_count
        FROM brands b
        JOIN vendors v ON b.vendor_id = v.id
        GROUP BY v.id, v.name
        ORDER BY brand_count DESC
        LIMIT 10
      `);

      return NextResponse.json({
        total: parseInt(totalResult.rows[0].total),
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
        topVendors: topVendorsResult.rows.map((r) => ({
          name: r.name,
          brandCount: parseInt(r.brand_count),
        })),
        updatedAt: new Date().toISOString(),
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Brand dashboard query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand data" },
      { status: 500 }
    );
  }
}
