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
      // Total vendor count
      const totalResult = await client.query(
        "SELECT COUNT(*) AS total FROM vendors"
      );

      // Active vendor count
      const activeResult = await client.query(
        "SELECT COUNT(*) AS count FROM vendors WHERE is_active = true"
      );

      // Verified vendor count
      const verifiedResult = await client.query(
        "SELECT COUNT(*) AS count FROM vendors WHERE is_verified = true"
      );

      // Daily new vendors (last 90 days)
      const dailyResult = await client.query(`
        SELECT
          DATE(created_at) AS date,
          COUNT(*) AS count
        FROM vendors
        WHERE created_at >= NOW() - INTERVAL '90 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `);

      // Cumulative vendor growth
      const cumulativeResult = await client.query(`
        SELECT
          date,
          SUM(count) OVER (ORDER BY date) AS cumulative
        FROM (
          SELECT DATE(created_at) AS date, COUNT(*) AS count
          FROM vendors
          GROUP BY DATE(created_at)
          ORDER BY date ASC
        ) daily
      `);

      // Today
      const todayResult = await client.query(`
        SELECT COUNT(*) AS count
        FROM vendors
        WHERE DATE(created_at) = CURRENT_DATE
      `);

      // This week
      const weekResult = await client.query(`
        SELECT COUNT(*) AS count
        FROM vendors
        WHERE created_at >= DATE_TRUNC('week', NOW())
      `);

      // This month
      const monthResult = await client.query(`
        SELECT COUNT(*) AS count
        FROM vendors
        WHERE created_at >= DATE_TRUNC('month', NOW())
      `);

      // Payment tier distribution
      const tierResult = await client.query(`
        SELECT
          COALESCE(payment_tier, 'none') AS tier,
          COUNT(*) AS count
        FROM vendors
        GROUP BY payment_tier
        ORDER BY count DESC
      `);

      return NextResponse.json({
        total: parseInt(totalResult.rows[0].total),
        active: parseInt(activeResult.rows[0].count),
        verified: parseInt(verifiedResult.rows[0].count),
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
        tierDistribution: tierResult.rows.map((r) => ({
          tier: r.tier,
          count: parseInt(r.count),
        })),
        updatedAt: new Date().toISOString(),
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Vendors dashboard query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendors data" },
      { status: 500 }
    );
  }
}
