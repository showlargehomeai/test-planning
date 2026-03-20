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
      // Total catalog count
      const totalResult = await client.query(
        "SELECT COUNT(*) AS total FROM catalogs"
      );

      // Daily new catalogs (last 90 days)
      const dailyResult = await client.query(`
        SELECT
          DATE(uploaded_at) AS date,
          COUNT(*) AS count
        FROM catalogs
        WHERE uploaded_at >= NOW() - INTERVAL '90 days'
        GROUP BY DATE(uploaded_at)
        ORDER BY date ASC
      `);

      // Cumulative catalog growth
      const cumulativeResult = await client.query(`
        SELECT
          date,
          SUM(count) OVER (ORDER BY date) AS cumulative
        FROM (
          SELECT DATE(uploaded_at) AS date, COUNT(*) AS count
          FROM catalogs
          GROUP BY DATE(uploaded_at)
          ORDER BY date ASC
        ) daily
      `);

      // Today new
      const todayResult = await client.query(`
        SELECT COUNT(*) AS count
        FROM catalogs
        WHERE DATE(uploaded_at) = CURRENT_DATE
      `);

      // This week new
      const weekResult = await client.query(`
        SELECT COUNT(*) AS count
        FROM catalogs
        WHERE uploaded_at >= DATE_TRUNC('week', NOW())
      `);

      // This month new
      const monthResult = await client.query(`
        SELECT COUNT(*) AS count
        FROM catalogs
        WHERE uploaded_at >= DATE_TRUNC('month', NOW())
      `);

      // Top 10 vendors by catalog count
      const topVendorsResult = await client.query(`
        SELECT
          v.name AS vendor_name,
          COUNT(c.id) AS catalog_count
        FROM catalogs c
        JOIN vendors v ON c.vendor_id = v.id
        GROUP BY v.id, v.name
        ORDER BY catalog_count DESC
        LIMIT 10
      `);

      // Upload frequency: average catalogs per week over last 12 weeks
      const avgWeekResult = await client.query(`
        SELECT COALESCE(AVG(weekly_count), 0) AS avg_per_week
        FROM (
          SELECT
            DATE_TRUNC('week', uploaded_at) AS week,
            COUNT(*) AS weekly_count
          FROM catalogs
          WHERE uploaded_at >= NOW() - INTERVAL '12 weeks'
          GROUP BY DATE_TRUNC('week', uploaded_at)
        ) weeks
      `);

      return NextResponse.json({
        total: parseInt(totalResult.rows[0].total),
        today: parseInt(todayResult.rows[0].count),
        thisWeek: parseInt(weekResult.rows[0].count),
        thisMonth: parseInt(monthResult.rows[0].count),
        avgPerWeek: parseFloat(parseFloat(avgWeekResult.rows[0].avg_per_week).toFixed(1)),
        daily: dailyResult.rows.map((r) => ({
          date: r.date.toISOString().split("T")[0],
          count: parseInt(r.count),
        })),
        cumulative: cumulativeResult.rows.map((r) => ({
          date: r.date.toISOString().split("T")[0],
          cumulative: parseInt(r.cumulative),
        })),
        topVendors: topVendorsResult.rows.map((r) => ({
          name: r.vendor_name,
          count: parseInt(r.catalog_count),
        })),
        updatedAt: new Date().toISOString(),
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Catalog dashboard query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch catalog data" },
      { status: 500 }
    );
  }
}
