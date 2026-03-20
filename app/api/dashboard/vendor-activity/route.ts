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
      // Vendor last login with activity level
      const vendorsResult = await client.query(`
        SELECT v.id, v.name, u.last_login_at,
          CASE 
            WHEN u.last_login_at >= NOW() - INTERVAL '7 days' THEN 'active'
            WHEN u.last_login_at >= NOW() - INTERVAL '30 days' THEN 'moderate'
            ELSE 'inactive'
          END AS activity_level
        FROM vendors v
        LEFT JOIN users u ON v.user_id = u.id
        WHERE v.is_active = true
        ORDER BY u.last_login_at DESC NULLS LAST
      `);

      // Top 20 vendors by product update frequency (last 30 days)
      const topUpdatersResult = await client.query(`
        SELECT v.id, v.name, COUNT(p.id)::int AS products_updated
        FROM vendors v
        LEFT JOIN products p ON p.vendor_id = v.id AND p.updated_at >= NOW() - INTERVAL '30 days'
        WHERE v.is_active = true
        GROUP BY v.id, v.name
        ORDER BY products_updated DESC
        LIMIT 20
      `);

      // Activity summary
      const summaryResult = await client.query(`
        SELECT 
          COUNT(*) FILTER (WHERE u.last_login_at >= NOW() - INTERVAL '7 days')::int AS active_7d,
          COUNT(*) FILTER (WHERE u.last_login_at >= NOW() - INTERVAL '30 days')::int AS active_30d,
          COUNT(*) FILTER (WHERE u.last_login_at < NOW() - INTERVAL '30 days' OR u.last_login_at IS NULL)::int AS inactive
        FROM vendors v
        LEFT JOIN users u ON v.user_id = u.id
        WHERE v.is_active = true
      `);

      const summary = summaryResult.rows[0];

      return NextResponse.json({
        vendors: vendorsResult.rows.map((r) => ({
          id: r.id,
          name: r.name,
          lastLoginAt: r.last_login_at ? r.last_login_at.toISOString() : null,
          activityLevel: r.activity_level,
        })),
        topUpdaters: topUpdatersResult.rows.map((r) => ({
          id: r.id,
          name: r.name,
          productsUpdated: r.products_updated,
        })),
        summary: {
          active_7d: summary.active_7d,
          active_30d: summary.active_30d,
          inactive: summary.inactive,
        },
        updatedAt: new Date().toISOString(),
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Vendor activity query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendor activity data" },
      { status: 500 }
    );
  }
}
