import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken, COOKIE_NAME } from '@/lib/erp/auth';
import { query } from '@/lib/db';
import {
  INITIAL_LEADS,
  INITIAL_INVOICES,
  INITIAL_PROJECTS,
  INITIAL_INVENTORY,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_EMPLOYEES,
  INITIAL_LEAVES,
  INITIAL_AUDIT_LOGS,
  INITIAL_WEBSITE_INQUIRIES,
  INITIAL_MACHINERY,
  INITIAL_SITE_LOGS,
  INITIAL_QUOTATIONS,
} from '@/lib/erp/store';

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

  try {
    const [
      dbProjects,
      dbInvoices,
      dbInquiries,
      dbInventory,
      dbMachinery,
      dbSiteLogs,
      dbQuotations,
      dbAuditLogs,
    ] = await Promise.all([
      query<Record<string, unknown>[]>('SELECT * FROM projects ORDER BY created_at DESC'),
      query<Record<string, unknown>[]>('SELECT * FROM invoices ORDER BY issue_date DESC'),
      query<Record<string, unknown>[]>('SELECT * FROM website_inquiries ORDER BY created_at DESC'),
      query<Record<string, unknown>[]>('SELECT * FROM inventory_materials ORDER BY name ASC'),
      query<Record<string, unknown>[]>('SELECT * FROM machinery_fleet ORDER BY asset_id ASC'),
      query<Record<string, unknown>[]>('SELECT * FROM site_daily_logs ORDER BY log_date DESC'),
      query<Record<string, unknown>[]>('SELECT * FROM construction_quotations ORDER BY created_at DESC'),
      query<Record<string, unknown>[]>('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100'),
    ]);

    const projects = dbProjects && dbProjects.length > 0
      ? dbProjects.map((p) => ({
          id: String(p.id),
          companyId: (p.company_id as 'COMP_A' | 'COMP_B') || 'COMP_A',
          code: String(p.code),
          name: String(p.name),
          client: String(p.client),
          location: String(p.location),
          budget: Number(p.budget),
          spent: Number(p.spent || 0),
          progress: Number(p.progress || 0),
          phase: String(p.phase || 'DESIGN'),
          siteEngineer: String(p.site_engineer),
          startDate: String(p.start_date).slice(0, 10),
          targetCompletion: String(p.target_completion).slice(0, 10),
          tasks: [],
        }))
      : INITIAL_PROJECTS;

    const invoices = dbInvoices && dbInvoices.length > 0
      ? dbInvoices.map((inv) => ({
          id: String(inv.id),
          companyId: (inv.company_id as 'COMP_A' | 'COMP_B') || 'COMP_A',
          invoiceNumber: String(inv.invoice_number),
          clientName: String(inv.client_name),
          projectName: String(inv.project_name),
          issueDate: String(inv.issue_date).slice(0, 10),
          dueDate: String(inv.due_date).slice(0, 10),
          subtotal: Number(inv.subtotal),
          tax: Number(inv.tax),
          total: Number(inv.total),
          status: String(inv.status) as 'PAID' | 'PENDING' | 'OVERDUE',
          items: [],
        }))
      : INITIAL_INVOICES;

    const websiteInquiries = dbInquiries && dbInquiries.length > 0
      ? dbInquiries.map((inq) => ({
          id: String(inq.id),
          clientName: String(inq.client_name),
          email: String(inq.email),
          phone: String(inq.phone || ''),
          projectType: String(inq.project_type),
          budgetRange: String(inq.budget_range || 'Flexible'),
          message: String(inq.message),
          date: inq.created_at ? new Date(String(inq.created_at)).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          status: String(inq.status) as 'NEW' | 'CONTACTED' | 'CONVERTED_TO_QUOTE' | 'ARCHIVED',
        }))
      : INITIAL_WEBSITE_INQUIRIES;

    const inventory = dbInventory && dbInventory.length > 0
      ? dbInventory.map((item) => ({
          id: String(item.id),
          companyId: (item.company_id as 'COMP_A' | 'COMP_B') || 'COMP_A',
          sku: String(item.sku),
          name: String(item.name),
          category: String(item.category),
          quantity: Number(item.quantity),
          unit: String(item.unit),
          minThreshold: Number(item.min_threshold),
          unitCost: Number(item.unit_cost),
          location: String(item.warehouse_location),
          status: String(item.status) as 'OPTIMAL' | 'LOW_STOCK' | 'CRITICAL',
          lastRestocked: new Date().toISOString().slice(0, 10),
        }))
      : INITIAL_INVENTORY;

    const auditLogs = dbAuditLogs && dbAuditLogs.length > 0
      ? dbAuditLogs.map((a) => ({
          id: String(a.id),
          companyId: (a.company_id as 'COMP_A' | 'COMP_B') || 'COMP_A',
          timestamp: a.timestamp ? new Date(String(a.timestamp)).toISOString() : new Date().toISOString(),
          actorName: String(a.actor_name),
          actorEmail: String(a.actor_email),
          role: String(a.role),
          action: String(a.action),
          module: String(a.module),
          details: String(a.details),
          ipAddress: String(a.ip_address || '127.0.0.1'),
          severity: String(a.severity || 'INFO') as 'INFO' | 'WARNING' | 'CRITICAL',
        }))
      : INITIAL_AUDIT_LOGS;

    return NextResponse.json({
      success: true,
      dbConnected: Boolean(dbProjects !== null),
      data: {
        leads: INITIAL_LEADS,
        invoices,
        projects,
        inventory,
        purchaseOrders: INITIAL_PURCHASE_ORDERS,
        employees: INITIAL_EMPLOYEES,
        leaves: INITIAL_LEAVES,
        auditLogs,
        websiteInquiries,
        machinery: dbMachinery && dbMachinery.length > 0 ? INITIAL_MACHINERY : INITIAL_MACHINERY,
        siteLogs: dbSiteLogs && dbSiteLogs.length > 0 ? INITIAL_SITE_LOGS : INITIAL_SITE_LOGS,
        quotations: dbQuotations && dbQuotations.length > 0 ? INITIAL_QUOTATIONS : INITIAL_QUOTATIONS,
      },
    });
  } catch (error) {
    console.error('[ERP DATA GET ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to retrieve ERP data from database' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: Valid JWT session required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, payload } = body;

    if (action === 'UPDATE_INQUIRY_STATUS' && payload?.id && payload?.status) {
      await query('UPDATE website_inquiries SET status = ? WHERE id = ?', [payload.status, payload.id]);
      await query(
        `INSERT INTO audit_logs (id, company_id, actor_name, actor_email, role, action, module, details, severity)
         VALUES (?, 'COMP_A', ?, ?, ?, 'UPDATE_INQUIRY_STATUS', 'CRM', ?, 'INFO')`,
        [`aud-${Date.now()}`, user.name, user.email, user.role, `Inquiry ${payload.id} marked as ${payload.status}`]
      );
      return NextResponse.json({ success: true });
    }

    if (action === 'UPDATE_INVOICE_STATUS' && payload?.id && payload?.status) {
      await query('UPDATE invoices SET status = ? WHERE id = ?', [payload.status, payload.id]);
      await query(
        `INSERT INTO audit_logs (id, company_id, actor_name, actor_email, role, action, module, details, severity)
         VALUES (?, 'COMP_A', ?, ?, ?, 'UPDATE_INVOICE_STATUS', 'FINANCE', ?, 'INFO')`,
        [`aud-${Date.now()}`, user.name, user.email, user.role, `Invoice ${payload.id} marked as ${payload.status}`]
      );
      return NextResponse.json({ success: true });
    }

    if (action === 'ADJUST_INVENTORY' && payload?.id && typeof payload?.quantity === 'number') {
      await query('UPDATE inventory_materials SET quantity = ?, status = ? WHERE id = ?', [
        payload.quantity,
        payload.status || 'OPTIMAL',
        payload.id,
      ]);
      await query(
        `INSERT INTO audit_logs (id, company_id, actor_name, actor_email, role, action, module, details, severity)
         VALUES (?, 'COMP_A', ?, ?, ?, 'ADJUST_INVENTORY', 'INVENTORY', ?, 'INFO')`,
        [`aud-${Date.now()}`, user.name, user.email, user.role, `Adjusted stock for ${payload.id} to ${payload.quantity}`]
      );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    console.error('[ERP DATA POST ERROR]', error);
    return NextResponse.json({ error: 'Failed to persist ERP mutation' }, { status: 500 });
  }
}
