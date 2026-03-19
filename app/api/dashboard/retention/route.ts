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
      // Weekly cohort retention (last 12 weeks)
      const retentionResult = await client.query(`
        SELECT
          DATE_TRUNC('week', created_at)::date AS week,
          COUNT(*) AS registered,
          ROUND(
            COUNT(*) FILTER (WHERE last_login_at::date > created_at::date)::numeric
            * 100.0 / NULLIF(COUNT(*), 0), 1
          ) AS day1,
          CASE
            WHEN DATE_TRUNC('week', created_at) <= NOW() - INTERVAL '7 days' THEN
              ROUND(
                COUNT(*) FILTER (WHERE last_login_at >= created_at + INTERVAL '7 days')::numeric
                * 100.0 / NULLIF(COUNT(*), 0), 1
              )
            ELSE NULL
          END AS day7,
          CASE
            WHEN DATE_TRUNC('week', created_at) <= NOW() - INTERVAL '30 days' THEN
              ROUND(
                COUNT(*) FILTER (WHERE last_login_at >= created_at + INTERVAL '30 days')::numeric
                * 100.0 / NULLIF(COUNT(*), 0), 1
              )
            ELSE NULL
          END AS day30
        FROM users
        WHERE created_at >= NOW() - INTERVAL '12 weeks'
        GROUP BY DATE_TRUNC('week', created_at)
        ORDER BY week ASC
      `);

      // DAU today
      const dauResult = await client.query(`
        SELECT COUNT(DISTINCT id) AS count FROM users
        WHERE DATE(last_login_at) = CURRENT_DATE AND last_login_at IS NOT NULL
      `);

      // DAU yesterday (for trend)
      const dauPrevResult = await client.query(`
        SELECT COUNT(DISTINCT id) AS count FROM users
        WHERE DATE(last_login_at) = CURRENT_DATE - 1 AND last_login_at IS NOT NULL
      `);

      // WAU: unique users active in last 7 days
      const wauResult = await client.query(`
        SELECT COUNT(DISTINCT id) AS count FROM users
        WHERE last_login_at >= NOW() - INTERVAL '7 days' AND last_login_at IS NOT NULL
      `);

      // WAU previous period (7–14 days ago)
      const wauPrevResult = await client.query(`
        SELECT COUNT(DISTINCT id) AS count FROM users
        WHERE last_login_at >= NOW() - INTERVAL '14 days'
          AND last_login_at < NOW() - INTERVAL '7 days'
          AND last_login_at IS NOT NULL
      `);

      // MAU: unique users active in last 30 days
      const mauResult = await client.query(`
        SELECT COUNT(DISTINCT id) AS count FROM users
        WHERE last_login_at >= NOW() - INTERVAL '30 days' AND last_login_at IS NOT NULL
      `);

      // MAU previous period (30–60 days ago)
      const mauPrevResult = await client.query(`
        SELECT COUNT(DISTINCT id) AS count FROM users
        WHERE last_login_at >= NOW() - INTERVAL '60 days'
          AND last_login_at < NOW() - INTERVAL '30 days'
          AND last_login_at IS NOT NULL
      `);

      const dau = parseInt(dauResult.rows[0].count);
      const dauPrev = parseInt(dauPrevResult.rows[0].count);
      const wau = parseInt(wauResult.rows[0].count);
      const wauPrev = parseInt(wauPrevResult.rows[0].count);
      const mau = parseInt(mauResult.rows[0].count);
      const mauPrev = parseInt(mauPrevResult.rows[0].count);

      return NextResponse.json({
        retention: retentionResult.rows.map((r) => ({
          week: r.week.toISOString().split("T")[0],
          registered: parseInt(r.registered),
          day1: r.day1 !== null ? parseFloat(r.day1) : null,
          day7: r.day7 !== null ? parseFloat(r.day7) : null,
          day30: r.day30 !== null ? parseFloat(r.day30) : null,
        })),
        dau,
        dauTrend:
          dauPrev > 0 ? Math.round(((dau - dauPrev) / dauPrev) * 100) : 0,
        wau,
        wauTrend:
          wauPrev > 0 ? Math.round(((wau - wauPrev) / wauPrev) * 100) : 0,
        mau,
        mauTrend:
          mauPrev > 0 ? Math.round(((mau - mauPrev) / mauPrev) * 100) : 0,
        updatedAt: new Date().toISOString(),
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Retention query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch retention data" },
      { status: 500 }
    );
  }
}
