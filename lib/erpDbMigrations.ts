import { query } from '@/lib/db';

let migrated = false;

async function addColumnIfMissing(table: string, column: string, definition: string) {
  const cols = await query<Record<string, unknown>[]>(
    `SHOW COLUMNS FROM \`${table}\` LIKE ?`,
    [column]
  );
  if (cols && cols.length === 0) {
    await query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
  }
}

/**
 * Safely ensures all optional construction & engineering columns exist in MySQL contec_erp.
 */
export async function ensureConstructionDbColumns(): Promise<void> {
  if (migrated) return;

  try {
    // 1. Projects optional construction & CIDA fields
    await addColumnIfMissing('projects', 'category', "VARCHAR(32) DEFAULT 'PRIVATE'");
    await addColumnIfMissing('projects', 'cida_classification', "VARCHAR(160) DEFAULT 'CIDA Grade CS2'");
    await addColumnIfMissing('projects', 'project_manager', "VARCHAR(160) DEFAULT ''");
    await addColumnIfMissing('projects', 'consultant_architect', "VARCHAR(160) DEFAULT ''");
    await addColumnIfMissing('projects', 'soil_foundation_type', "VARCHAR(160) DEFAULT ''");
    await addColumnIfMissing('projects', 'permit_number', "VARCHAR(80) DEFAULT ''");
    await addColumnIfMissing('projects', 'insurance_policy', "VARCHAR(80) DEFAULT ''");
    await addColumnIfMissing('projects', 'retention_pct', 'DECIMAL(5,2) DEFAULT 5.00');
    await addColumnIfMissing('projects', 'lad_per_day_lkr', 'DECIMAL(15,2) DEFAULT 250000.00');
    await addColumnIfMissing('projects', 'defect_liability_months', 'INT DEFAULT 12');
    await addColumnIfMissing('projects', 'gps_coordinates', "VARCHAR(80) DEFAULT ''");
    await addColumnIfMissing('projects', 'notes', 'TEXT');

    // 2. Invoices optional IPC & tax fields
    await addColumnIfMissing('invoices', 'ipc_number', "VARCHAR(64) DEFAULT ''");
    await addColumnIfMissing('invoices', 'sscl_tax', 'DECIMAL(15,2) DEFAULT 0.00');
    await addColumnIfMissing('invoices', 'retention_deducted', 'DECIMAL(15,2) DEFAULT 0.00');
    await addColumnIfMissing('invoices', 'payment_method', "VARCHAR(64) DEFAULT 'BANK_TRANSFER'");
    await addColumnIfMissing('invoices', 'bank_reference', "VARCHAR(120) DEFAULT ''");

    // 3. Site Daily Logs optional engineering & QA fields
    await addColumnIfMissing('site_daily_logs', 'project_name', "VARCHAR(200) DEFAULT ''");
    await addColumnIfMissing('site_daily_logs', 'skilled_workers', 'INT DEFAULT 0');
    await addColumnIfMissing('site_daily_logs', 'unskilled_workers', 'INT DEFAULT 0');
    await addColumnIfMissing('site_daily_logs', 'toolbox_talk_topic', "VARCHAR(255) DEFAULT ''");
    await addColumnIfMissing('site_daily_logs', 'supervisor_name', "VARCHAR(120) DEFAULT ''");
    await addColumnIfMissing('site_daily_logs', 'concrete_grade', "VARCHAR(32) DEFAULT 'G35'");
    await addColumnIfMissing('site_daily_logs', 'drawing_ref', "VARCHAR(120) DEFAULT ''");
    await addColumnIfMissing('site_daily_logs', 'visitor_notes', 'TEXT');

    // 4. Machinery Fleet optional commercial & compliance fields
    await addColumnIfMissing('machinery_fleet', 'assigned_site_name', "VARCHAR(160) DEFAULT ''");
    await addColumnIfMissing('machinery_fleet', 'serial_number', "VARCHAR(80) DEFAULT ''");
    await addColumnIfMissing('machinery_fleet', 'daily_hire_rate_lkr', 'DECIMAL(12,2) DEFAULT 95000.00');
    await addColumnIfMissing('machinery_fleet', 'insurance_expiry', 'DATE NULL');

    // 5. Inventory optional supplier & batch fields
    await addColumnIfMissing('inventory_materials', 'supplier_name', "VARCHAR(160) DEFAULT ''");
    await addColumnIfMissing('inventory_materials', 'batch_cert_number', "VARCHAR(80) DEFAULT ''");
    await addColumnIfMissing('inventory_materials', 'reorder_qty', 'DECIMAL(12,2) DEFAULT 0.00');

    migrated = true;
  } catch (err) {
    console.warn('[CONTEC MIGRATION WARNING]', (err as Error).message);
  }
}
