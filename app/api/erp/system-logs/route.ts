import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken, COOKIE_NAME } from '@/lib/erp/auth';
import { checkDbConnection, query } from '@/lib/db';

async function getAuthUser(req: NextRequest) {
  let token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  if (!token) return null;
  return await verifyJwtToken(token);
}

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const start = Date.now();
  const dbStatus = await checkDbConnection();
  const dbLatencyMs = Date.now() - start;

  const mem = process.memoryUsage();
  const tableCounts: Record<string, number> = {};

  const tables = ['projects', 'invoices', 'inventory_items', 'machinery', 'site_logs', 'audit_logs', 'erp_users', 'public_projects', 'public_services'];
  for (const tbl of tables) {
    try {
      const rows = await query<{ cnt: number }[]>(`SELECT COUNT(*) AS cnt FROM ${tbl}`);
      if (rows && rows[0]) tableCounts[tbl] = Number(rows[0].cnt || 0);
    } catch {
      // ignore missing table
    }
  }

  return NextResponse.json({
    success: true,
    runtime: {
      nodeVersion: process.version,
      platform: process.platform,
      uptimeSeconds: Math.round(process.uptime()),
      rssMb: Math.round(mem.rss / 1024 / 1024),
      heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotalMb: Math.round(mem.heapTotal / 1024 / 1024),
      env: process.env.NODE_ENV || 'development',
    },
    database: {
      ...dbStatus,
      latencyMs: dbLatencyMs,
      tableCounts,
    },
    timestamp: new Date().toISOString(),
  });
}
