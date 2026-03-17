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
      // 總用戶數
      const totalResult = await client.query(
        "SELECT COUNT(*) AS total FROM users"
      );

      // 每日新增用戶 (最近 90 天)
      const dailyResult = await client.query(`
        SELECT
          DATE(created_at) AS date,
          COUNT(*) AS count
        FROM users
        WHERE created_at >= NOW() - INTERVAL '90 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `);

      // 累計成長曲線 (每日累計)
      const cumulativeResult = await client.query(`
        SELECT
          date,
          SUM(count) OVER (ORDER BY date) AS cumulative
        FROM (
          SELECT DATE(created_at) AS date, COUNT(*) AS count
          FROM users
          GROUP BY DATE(created_at)
          ORDER BY date ASC
        ) daily
      `);

      // 今日新增
      const todayResult = await client.query(`
        SELECT COUNT(*) AS count
        FROM users
        WHERE DATE(created_at) = CURRENT_DATE
      `);

      // 昨日新增
      const yesterdayResult = await client.query(`
        SELECT COUNT(*) AS count
        FROM users
        WHERE DATE(created_at) = CURRENT_DATE - 1
      `);

      // 本週新增
      const weekResult = await client.query(`
        SELECT COUNT(*) AS count
        FROM users
        WHERE created_at >= DATE_TRUNC('week', NOW())
      `);

      // 本月新增
      const monthResult = await client.query(`
        SELECT COUNT(*) AS count
        FROM users
        WHERE created_at >= DATE_TRUNC('month', NOW())
      `);

      // 最近 7 天每日活躍用戶 (透過 last_login_at)
      const dauResult = await client.query(`
        SELECT
          DATE(last_login_at) AS date,
          COUNT(*) AS count
        FROM users
        WHERE last_login_at >= NOW() - INTERVAL '7 days'
          AND last_login_at IS NOT NULL
        GROUP BY DATE(last_login_at)
        ORDER BY date ASC
      `);

      return NextResponse.json({
        total: parseInt(totalResult.rows[0].total),
        today: parseInt(todayResult.rows[0].count),
        yesterday: parseInt(yesterdayResult.rows[0].count),
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
        dau: dauResult.rows.map((r) => ({
          date: r.date.toISOString().split("T")[0],
          count: parseInt(r.count),
        })),
        updatedAt: new Date().toISOString(),
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Dashboard query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
