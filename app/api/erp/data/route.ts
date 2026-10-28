import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken, COOKIE_NAME } from '@/lib/erp/auth';
import {
  INITIAL_LEADS,
  INITIAL_INVOICES,
  INITIAL_PROJECTS,
  INITIAL_INVENTORY,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_EMPLOYEES,
  INITIAL_LEAVES,
  INITIAL_AUDIT_LOGS,
} from '@/lib/erp/store';

// Helper to authenticate request
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
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized: Valid JWT session required' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      leads: INITIAL_LEADS,
      invoices: INITIAL_INVOICES,
      projects: INITIAL_PROJECTS,
      inventory: INITIAL_INVENTORY,
      purchaseOrders: INITIAL_PURCHASE_ORDERS,
      employees: INITIAL_EMPLOYEES,
      leaves: INITIAL_LEAVES,
      auditLogs: INITIAL_AUDIT_LOGS,
    },
  });
}

