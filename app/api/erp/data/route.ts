import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken, COOKIE_NAME } from '@/lib/erp/auth';
import { query } from '@/lib/db';
import { ensureConstructionDbColumns } from '@/lib/erpDbMigrations';
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

async function logDbAudit(
  user: { name: string; email: string; role: string },
  action: string,
  moduleName: string,
  details: string,
  companyId = 'COMP_A'
) {
  await query(
    `INSERT INTO audit_logs (id, company_id, actor_name, actor_email, role, action, module, details, severity)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'INFO')`,
    [`aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`, companyId, user.name, user.email, user.role, action, moduleName, details]
  );
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
    await ensureConstructionDbColumns();

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
      query<Record<string, unknown>[]>('SELECT * FROM site_daily_logs ORDER BY log_date DESC, created_at DESC'),
      query<Record<string, unknown>[]>('SELECT * FROM construction_quotations ORDER BY created_at DESC'),
      query<Record<string, unknown>[]>('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100'),
    ]);

    const projects =
      dbProjects && dbProjects.length > 0
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
            category: (String(p.category || 'PRIVATE') as 'GOVERNMENT' | 'PRIVATE'),
            siteEngineer: String(p.site_engineer),
            projectManager: String(p.project_manager || 'Eng. Marcus Chen (VP Operations)'),
            cidaClassification: String(p.cida_classification || 'CIDA Grade CS2'),
            startDate: String(p.start_date).slice(0, 10),
            targetCompletion: String(p.target_completion).slice(0, 10),
            ladAmountPerDayLkr: Number(p.lad_per_day_lkr || 250000),
            retentionHeldLkr: Math.round((Number(p.spent || 0) * Number(p.retention_pct || 5)) / 100),
            originalContractSumLkr: Number(p.budget),
            tasks: [],
          }))
        : INITIAL_PROJECTS;

    const invoices =
      dbInvoices && dbInvoices.length > 0
        ? dbInvoices.map((inv) => ({
            id: String(inv.id),
            companyId: (inv.company_id as 'COMP_A' | 'COMP_B') || 'COMP_A',
            invoiceNumber: String(inv.invoice_number),
            ipcNumber: String(inv.ipc_number || ''),
            clientName: String(inv.client_name),
            projectName: String(inv.project_name),
            issueDate: String(inv.issue_date).slice(0, 10),
            dueDate: String(inv.due_date).slice(0, 10),
            subtotal: Number(inv.subtotal),
            ssclTax: Number(inv.sscl_tax || 0),
            tax: Number(inv.tax),
            retentionDeducted: Number(inv.retention_deducted || 0),
            total: Number(inv.total),
            status: String(inv.status) as 'PAID' | 'PENDING' | 'OVERDUE',
            items: [],
          }))
        : INITIAL_INVOICES;

    const websiteInquiries =
      dbInquiries && dbInquiries.length > 0
        ? dbInquiries.map((inq) => ({
            id: String(inq.id),
            clientName: String(inq.client_name),
            email: String(inq.email),
            phone: String(inq.phone || ''),
            projectType: String(inq.project_type),
            budgetRange: String(inq.budget_range || 'Flexible'),
            message: String(inq.message),
            date: inq.created_at
              ? new Date(String(inq.created_at)).toISOString().slice(0, 10)
              : new Date().toISOString().slice(0, 10),
            status: String(inq.status) as 'NEW' | 'CONTACTED' | 'CONVERTED_TO_QUOTE' | 'ARCHIVED',
          }))
        : INITIAL_WEBSITE_INQUIRIES;

    const inventory =
      dbInventory && dbInventory.length > 0
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
            warehouseLocation: String(item.warehouse_location),
            status: String(item.status) as 'OPTIMAL' | 'LOW_STOCK' | 'CRITICAL',
            lastRestocked: new Date().toISOString().slice(0, 10),
          }))
        : INITIAL_INVENTORY;

    const machinery =
      dbMachinery && dbMachinery.length > 0
        ? dbMachinery.map((m) => ({
            id: String(m.id),
            companyId: (m.company_id as 'COMP_A' | 'COMP_B') || 'COMP_B',
            assetId: String(m.asset_id),
            name: String(m.equipment_name),
            category: String(m.category) as typeof INITIAL_MACHINERY[0]['category'],
            assignedSite: String(m.assigned_site_name || m.assigned_site_id || 'Central Plant Yard'),
            operatorName: String(m.operator_name || 'Assigned Operator'),
            fuelCapacityPct: Number(m.fuel_capacity_pct ?? 100),
            operatingHours: Number(m.operating_hours ?? 0),
            nextServiceDate: m.next_service_date ? String(m.next_service_date).slice(0, 10) : '2026-12-15',
            dailyHireRateLkr: Number(m.daily_hire_rate_lkr || 95000),
            status: String(m.status || 'OPERATIONAL') as typeof INITIAL_MACHINERY[0]['status'],
          }))
        : INITIAL_MACHINERY;

    const siteLogs =
      dbSiteLogs && dbSiteLogs.length > 0
        ? dbSiteLogs.map((l) => ({
            id: String(l.id),
            companyId: (l.company_id as 'COMP_A' | 'COMP_B') || 'COMP_A',
            projectId: String(l.project_id),
            projectName: String(l.project_name || 'Active Construction Site'),
            logDate: String(l.log_date).slice(0, 10),
            weatherSummary: String(l.weather_summary),
            ambientTempC: Number(l.ambient_temp_celsius || 30),
            workforceCount: Number(l.workforce_count || 0),
            skilledWorkersCount: Number(l.skilled_workers || 0),
            unskilledWorkersCount: Number(l.unskilled_workers || 0),
            concretePouredM3: Number(l.concrete_poured_m3 || 0),
            slumpTestMm: Number(l.slump_test_mm || 0),
            toolboxTalkTopic: String(l.toolbox_talk_topic || 'Daily HSE Briefing'),
            safetyIncidents: Number(l.safety_incidents || 0),
            oshaStatus: String(l.osha_compliance_status || 'COMPLIANT') as 'COMPLIANT' | 'OBSERVATION' | 'BREACH',
            supervisorNotes: String(l.supervisor_notes || ''),
            supervisorName: String(l.supervisor_name || 'Site Engineer'),
            cubeTests: [],
          }))
        : INITIAL_SITE_LOGS;

    const quotations =
      dbQuotations && dbQuotations.length > 0
        ? dbQuotations.map((q) => ({
            id: String(q.id),
            companyId: (q.company_id as 'COMP_A' | 'COMP_B') || 'COMP_A',
            quoteNumber: String(q.quote_number),
            clientName: String(q.client_name),
            clientCompany: String(q.client_company),
            clientEmail: String(q.client_email),
            projectScope: String(q.project_scope),
            createdDate: q.created_at ? new Date(String(q.created_at)).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
            validUntil: String(q.valid_until).slice(0, 10),
            subtotal: Number(q.subtotal),
            taxRate: 18,
            taxAmount: Number(q.tax_vat),
            grandTotal: Number(q.grand_total),
            retentionPct: Number(q.retention_pct || 5),
            status: String(q.status || 'ISSUED') as typeof INITIAL_QUOTATIONS[0]['status'],
            termsAndConditions: String(q.terms_and_conditions || ''),
            boqItems: [],
          }))
        : INITIAL_QUOTATIONS;

    const auditLogs =
      dbAuditLogs && dbAuditLogs.length > 0
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
        machinery,
        siteLogs,
        quotations,
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
    await ensureConstructionDbColumns();
    const body = await req.json();
    const { action, payload } = body;

    if (action === 'ADD_PROJECT' && payload?.name) {
      const id = payload.id || `prj-${Date.now()}`;
      const code = payload.code || `CNT-PRJ-${Math.floor(100 + Math.random() * 900)}`;
      const phaseEnum = ['DESIGN', 'FOUNDATION', 'STRUCTURAL', 'INTERIOR', 'HANDOVER'].includes(payload.phase)
        ? payload.phase
        : 'DESIGN';

      await query(
        `INSERT INTO projects (
          id, company_id, code, name, client, location, budget, spent, progress, phase,
          category, cida_classification, project_manager, consultant_architect, soil_foundation_type,
          permit_number, insurance_policy, retention_pct, lad_per_day_lkr, defect_liability_months,
          gps_coordinates, notes, site_engineer, start_date, target_completion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          payload.companyId || 'COMP_A',
          code,
          payload.name,
          payload.client || 'Private Client',
          payload.location || 'Kandy, Sri Lanka',
          Number(payload.budget || 0),
          Number(payload.spent || 0),
          Number(payload.progress || 5),
          phaseEnum,
          payload.category || 'PRIVATE',
          payload.cidaClassification || 'CIDA Grade CS2',
          payload.projectManager || user.name,
          payload.consultantArchitect || '',
          payload.soilFoundationType || '',
          payload.permitNumber || '',
          payload.insurancePolicy || '',
          Number(payload.retentionPct ?? 5),
          Number(payload.ladAmountPerDayLkr ?? 250000),
          Number(payload.defectLiabilityMonths ?? 12),
          payload.gpsCoordinates || '',
          payload.notes || '',
          payload.siteEngineer || user.name,
          payload.startDate || new Date().toISOString().slice(0, 10),
          payload.targetCompletion || '2027-12-31',
        ]
      );
      await logDbAudit(user, 'PROJECT_REGISTERED', 'PROJECTS', `Registered project ${payload.name} (${code})`, payload.companyId || 'COMP_A');
      return NextResponse.json({ success: true, id, code });
    }

    if (action === 'ADD_SITE_LOG' && payload?.projectId) {
      const id = payload.id || `log-${Date.now()}`;
      await query(
        `INSERT INTO site_daily_logs (
          id, project_id, project_name, company_id, log_date, weather_summary, ambient_temp_celsius,
          workforce_count, skilled_workers, unskilled_workers, concrete_poured_m3, slump_test_mm,
          concrete_grade, toolbox_talk_topic, safety_incidents, osha_compliance_status,
          supervisor_notes, supervisor_name, drawing_ref, visitor_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          payload.projectId,
          payload.projectName || '',
          payload.companyId || 'COMP_A',
          payload.logDate || new Date().toISOString().slice(0, 10),
          payload.weatherSummary || 'Clear',
          Number(payload.ambientTempC || 30),
          Number(payload.workforceCount || 0),
          Number(payload.skilledWorkersCount || 0),
          Number(payload.unskilledWorkersCount || 0),
          Number(payload.concretePouredM3 || 0),
          Number(payload.slumpTestMm || 0),
          payload.concreteGrade || 'G35',
          payload.toolboxTalkTopic || '',
          Number(payload.safetyIncidents || 0),
          payload.oshaStatus || 'COMPLIANT',
          payload.supervisorNotes || '',
          payload.supervisorName || user.name,
          payload.drawingRef || '',
          payload.visitorNotes || '',
        ]
      );
      await logDbAudit(user, 'SITE_LOG_FILED', 'SITE_LOGS', `Filed daily log for ${payload.projectName || payload.projectId}`, payload.companyId || 'COMP_A');
      return NextResponse.json({ success: true, id });
    }

    if (action === 'ADD_MACHINERY' && payload?.name) {
      const id = payload.id || `eq-${Date.now()}`;
      const assetId = payload.assetId || `CNT-EQ-${Math.floor(100 + Math.random() * 900)}`;
      const catEnum = ['TOWER_CRANE', 'EXCAVATOR', 'BOOM_PUMP', 'BULLDOZER', 'GENERATOR'].includes(payload.category)
        ? payload.category
        : 'EXCAVATOR';
      await query(
        `INSERT INTO machinery_fleet (
          id, company_id, asset_id, equipment_name, category, assigned_site_name,
          operator_name, fuel_capacity_pct, operating_hours, next_service_date,
          serial_number, daily_hire_rate_lkr, insurance_expiry, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          payload.companyId || 'COMP_B',
          assetId,
          payload.name,
          catEnum,
          payload.assignedSite || 'Central Plant Yard',
          payload.operatorName || 'Unassigned',
          Number(payload.fuelCapacityPct ?? 100),
          Number(payload.operatingHours ?? 0),
          payload.nextServiceDate || '2026-12-30',
          payload.serialNumber || '',
          Number(payload.dailyHireRateLkr ?? 95000),
          payload.insuranceExpiry || null,
          payload.status || 'OPERATIONAL',
        ]
      );
      await logDbAudit(user, 'MACHINERY_REGISTERED', 'MACHINERY', `Registered fleet asset ${payload.name} (${assetId})`, payload.companyId || 'COMP_B');
      return NextResponse.json({ success: true, id, assetId });
    }

    if (action === 'UPDATE_MACHINERY_STATUS' && payload?.id && payload?.status) {
      await query('UPDATE machinery_fleet SET status = ? WHERE id = ?', [payload.status, payload.id]);
      await logDbAudit(user, 'MACHINERY_STATUS_UPDATED', 'MACHINERY', `Asset ${payload.id} set to ${payload.status}`, 'COMP_B');
      return NextResponse.json({ success: true });
    }

    if (action === 'ADD_INVOICE' && payload?.clientName) {
      const id = payload.id || `inv-${Date.now()}`;
      const invoiceNumber = payload.invoiceNumber || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      await query(
        `INSERT INTO invoices (
          id, company_id, invoice_number, ipc_number, client_name, project_name,
          issue_date, due_date, subtotal, sscl_tax, tax, retention_deducted, total, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          payload.companyId || 'COMP_A',
          invoiceNumber,
          payload.ipcNumber || '',
          payload.clientName,
          payload.projectName || '',
          payload.issueDate || new Date().toISOString().slice(0, 10),
          payload.dueDate || new Date().toISOString().slice(0, 10),
          Number(payload.subtotal || 0),
          Number(payload.ssclTax || 0),
          Number(payload.tax || 0),
          Number(payload.retentionDeducted || 0),
          Number(payload.total || 0),
          payload.status || 'PENDING',
        ]
      );
      await logDbAudit(user, 'INVOICE_ISSUED', 'FINANCE', `Issued invoice ${invoiceNumber} for ${payload.clientName}`, payload.companyId || 'COMP_A');
      return NextResponse.json({ success: true, id, invoiceNumber });
    }

    if (action === 'UPDATE_INQUIRY_STATUS' && payload?.id && payload?.status) {
      await query('UPDATE website_inquiries SET status = ? WHERE id = ?', [payload.status, payload.id]);
      await logDbAudit(user, 'UPDATE_INQUIRY_STATUS', 'CRM', `Inquiry ${payload.id} marked as ${payload.status}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'UPDATE_INVOICE_STATUS' && payload?.id && payload?.status) {
      await query('UPDATE invoices SET status = ? WHERE id = ?', [payload.status, payload.id]);
      await logDbAudit(user, 'UPDATE_INVOICE_STATUS', 'FINANCE', `Invoice ${payload.id} marked as ${payload.status}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'ADJUST_INVENTORY' && payload?.id && typeof payload?.quantity === 'number') {
      await query('UPDATE inventory_materials SET quantity = ?, status = ? WHERE id = ?', [
        payload.quantity,
        payload.status || 'OPTIMAL',
        payload.id,
      ]);
      await logDbAudit(user, 'ADJUST_INVENTORY', 'INVENTORY', `Adjusted stock for ${payload.id} to ${payload.quantity}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'UPDATE_PROJECT' && payload?.id) {
      await query(
        `UPDATE projects SET name=?, client=?, location=?, budget=?, spent=?, progress=?, phase=?,
         category=?, cida_classification=?, project_manager=?, site_engineer=?, notes=? WHERE id=?`,
        [
          payload.name,
          payload.client,
          payload.location || '',
          Number(payload.budget || 0),
          Number(payload.spent || 0),
          Number(payload.progress || 0),
          payload.phase || 'DESIGN',
          payload.category || 'PRIVATE',
          payload.cidaClassification || '',
          payload.projectManager || '',
          payload.siteEngineer || '',
          payload.notes || '',
          payload.id,
        ]
      );
      await logDbAudit(user, 'PROJECT_UPDATED', 'PROJECTS', `Updated project ${payload.name} (${payload.id})`);
      return NextResponse.json({ success: true });
    }

    if (action === 'DELETE_PROJECT' && payload?.id) {
      await query('DELETE FROM projects WHERE id = ?', [payload.id]);
      await logDbAudit(user, 'PROJECT_DELETED', 'PROJECTS', `Deleted project ${payload.id}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'UPDATE_INVOICE' && payload?.id) {
      await query(
        'UPDATE invoices SET client_name=?, project_name=?, total=?, subtotal=?, tax=?, status=?, due_date=? WHERE id=?',
        [
          payload.clientName,
          payload.projectName,
          Number(payload.total || 0),
          Number(payload.subtotal || 0),
          Number(payload.tax || 0),
          payload.status || 'PENDING',
          payload.dueDate || new Date().toISOString().slice(0, 10),
          payload.id,
        ]
      );
      await logDbAudit(user, 'INVOICE_UPDATED', 'FINANCE', `Updated invoice ${payload.id}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'DELETE_INVOICE' && payload?.id) {
      await query('DELETE FROM invoices WHERE id = ?', [payload.id]);
      await logDbAudit(user, 'INVOICE_DELETED', 'FINANCE', `Deleted invoice ${payload.id}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'ADD_INVENTORY' && payload?.name) {
      const id = payload.id || `mat-${Date.now()}`;
      const sku = payload.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
      await query(
        `INSERT INTO inventory_materials (id, company_id, sku, name, category, quantity, unit, min_threshold, unit_cost, warehouse_location, status, supplier_name)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          payload.companyId || 'COMP_A',
          sku,
          payload.name,
          payload.category || 'Structural',
          Number(payload.quantity || 0),
          payload.unit || 'Units',
          Number(payload.minThreshold || 10),
          Number(payload.unitCost || 0),
          payload.warehouseLocation || 'Kandy Central Yard',
          payload.status || 'OPTIMAL',
          payload.supplierName || '',
        ]
      );
      await logDbAudit(user, 'INVENTORY_ADDED', 'INVENTORY', `Added material ${payload.name} (${sku})`);
      return NextResponse.json({ success: true, id, sku });
    }

    if (action === 'UPDATE_INVENTORY' && payload?.id) {
      await query(
        'UPDATE inventory_materials SET name=?, category=?, quantity=?, unit=?, min_threshold=?, unit_cost=?, warehouse_location=?, status=? WHERE id=?',
        [
          payload.name,
          payload.category || 'Structural',
          Number(payload.quantity || 0),
          payload.unit || 'Units',
          Number(payload.minThreshold || 10),
          Number(payload.unitCost || 0),
          payload.warehouseLocation || 'Kandy Central Yard',
          payload.status || 'OPTIMAL',
          payload.id,
        ]
      );
      await logDbAudit(user, 'INVENTORY_UPDATED', 'INVENTORY', `Updated material ${payload.name} (${payload.id})`);
      return NextResponse.json({ success: true });
    }

    if (action === 'DELETE_INVENTORY' && payload?.id) {
      await query('DELETE FROM inventory_materials WHERE id = ?', [payload.id]);
      await logDbAudit(user, 'INVENTORY_DELETED', 'INVENTORY', `Deleted material ${payload.id}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'UPDATE_MACHINERY' && payload?.id) {
      await query(
        'UPDATE machinery_fleet SET equipment_name=?, assigned_site_name=?, operator_name=?, daily_hire_rate_lkr=?, operating_hours=?, status=? WHERE id=?',
        [
          payload.name,
          payload.assignedSite || '',
          payload.operatorName || '',
          Number(payload.dailyHireRateLkr || 95000),
          Number(payload.operatingHours || 0),
          payload.status || 'OPERATIONAL',
          payload.id,
        ]
      );
      await logDbAudit(user, 'MACHINERY_UPDATED', 'MACHINERY', `Updated machinery ${payload.name}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'DELETE_MACHINERY' && payload?.id) {
      await query('DELETE FROM machinery_fleet WHERE id = ?', [payload.id]);
      await logDbAudit(user, 'MACHINERY_DELETED', 'MACHINERY', `Deleted machinery ${payload.id}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'UPDATE_SITE_LOG' && payload?.id) {
      await query(
        'UPDATE site_daily_logs SET weather_summary=?, workforce_count=?, concrete_poured_m3=?, slump_test_mm=?, osha_compliance_status=?, supervisor_notes=? WHERE id=?',
        [
          payload.weatherSummary || '',
          Number(payload.workforceCount || 0),
          Number(payload.concretePouredM3 || 0),
          Number(payload.slumpTestMm || 0),
          payload.oshaStatus || 'COMPLIANT',
          payload.supervisorNotes || '',
          payload.id,
        ]
      );
      await logDbAudit(user, 'SITE_LOG_UPDATED', 'SITE_LOGS', `Updated site log ${payload.id}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'DELETE_SITE_LOG' && payload?.id) {
      await query('DELETE FROM site_daily_logs WHERE id = ?', [payload.id]);
      await logDbAudit(user, 'SITE_LOG_DELETED', 'SITE_LOGS', `Deleted site log ${payload.id}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'ADD_INQUIRY' && payload?.clientName) {
      const id = payload.id || `inq-${Date.now()}`;
      await query(
        'INSERT INTO website_inquiries (id, client_name, email, phone, project_type, budget_range, message, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          id,
          payload.clientName,
          payload.email || '',
          payload.phone || '',
          payload.projectType || 'Residential',
          payload.budgetRange || 'Flexible',
          payload.message || '',
          payload.status || 'NEW',
        ]
      );
      await logDbAudit(user, 'INQUIRY_CREATED', 'CRM', `Created inquiry for ${payload.clientName}`);
      return NextResponse.json({ success: true, id });
    }

    if (action === 'UPDATE_INQUIRY' && payload?.id) {
      await query(
        'UPDATE website_inquiries SET client_name=?, email=?, phone=?, project_type=?, budget_range=?, message=?, status=? WHERE id=?',
        [
          payload.clientName,
          payload.email || '',
          payload.phone || '',
          payload.projectType || 'Residential',
          payload.budgetRange || 'Flexible',
          payload.message || '',
          payload.status || 'NEW',
          payload.id,
        ]
      );
      await logDbAudit(user, 'INQUIRY_UPDATED', 'CRM', `Updated inquiry ${payload.id}`);
      return NextResponse.json({ success: true });
    }

    if (action === 'DELETE_INQUIRY' && payload?.id) {
      await query('DELETE FROM website_inquiries WHERE id = ?', [payload.id]);
      await logDbAudit(user, 'INQUIRY_DELETED', 'CRM', `Deleted inquiry ${payload.id}`);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    console.error('[ERP DATA POST ERROR]', error);
    return NextResponse.json({ error: 'Failed to persist ERP mutation' }, { status: 500 });
  }
}
