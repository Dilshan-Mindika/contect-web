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

    // 6. 2NF Normalized Master & Child Tables
    await query(`
      CREATE TABLE IF NOT EXISTS clients (
        id VARCHAR(64) PRIMARY KEY,
        company_id VARCHAR(32) DEFAULT 'COMP_A',
        name VARCHAR(160) NOT NULL,
        company_name VARCHAR(160) DEFAULT '',
        email VARCHAR(160) DEFAULT '',
        phone VARCHAR(40) DEFAULT '',
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_clients_name_company (name, company_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS departments (
        id VARCHAR(64) PRIMARY KEY,
        company_id VARCHAR(32) DEFAULT 'COMP_A',
        name VARCHAR(120) NOT NULL UNIQUE,
        head_name VARCHAR(120) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS employees (
        id VARCHAR(64) PRIMARY KEY,
        company_id VARCHAR(32) DEFAULT 'COMP_A',
        emp_id VARCHAR(32) NOT NULL UNIQUE,
        name VARCHAR(160) NOT NULL,
        role VARCHAR(120) NOT NULL,
        department_id VARCHAR(64) NULL,
        employment_type ENUM('PERMANENT', 'CONTRACT', 'TEMP_HOURLY', 'CONSULTANT') DEFAULT 'PERMANENT',
        salary_lkr DECIMAL(15,2) DEFAULT 0.00,
        hourly_rate_lkr DECIMAL(12,2) DEFAULT 0.00,
        email VARCHAR(160) DEFAULT '',
        phone VARCHAR(40) DEFAULT '',
        nic VARCHAR(32) DEFAULT '',
        status ENUM('ACTIVE', 'ON_LEAVE', 'INACTIVE') DEFAULT 'ACTIVE',
        join_date DATE NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS employee_attendance (
        employee_id VARCHAR(64) NOT NULL,
        attendance_date DATE NOT NULL,
        status ENUM('PRESENT', 'ON_SITE', 'HALF_DAY', 'ABSENT') NOT NULL DEFAULT 'PRESENT',
        hours_worked DECIMAL(5,2) NOT NULL DEFAULT 8.00,
        ot_hours DECIMAL(5,2) NOT NULL DEFAULT 0.00,
        hourly_payout_lkr DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (employee_id, attendance_date),
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS invoice_items (
        id VARCHAR(64) PRIMARY KEY,
        invoice_id VARCHAR(64) NOT NULL,
        line_no INT NOT NULL,
        description VARCHAR(255) NOT NULL,
        unit VARCHAR(32) DEFAULT 'Unit',
        quantity DECIMAL(12,2) NOT NULL DEFAULT 1.00,
        unit_rate DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        line_total DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
        UNIQUE KEY uq_invoice_line (invoice_id, line_no)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS quotation_items (
        id VARCHAR(64) PRIMARY KEY,
        quotation_id VARCHAR(64) NOT NULL,
        line_no INT NOT NULL,
        description VARCHAR(255) NOT NULL,
        unit VARCHAR(32) DEFAULT 'Unit',
        quantity DECIMAL(12,2) NOT NULL DEFAULT 1.00,
        unit_rate DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        line_total DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        FOREIGN KEY (quotation_id) REFERENCES construction_quotations(id) ON DELETE CASCADE,
        UNIQUE KEY uq_quotation_line (quotation_id, line_no)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS erp_role_permissions (
        role VARCHAR(64) NOT NULL,
        permission_key VARCHAR(64) NOT NULL,
        PRIMARY KEY (role, permission_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Foreign-key reference columns on header tables for 2NF linkage
    await addColumnIfMissing('projects', 'client_id', 'VARCHAR(64) NULL');
    await addColumnIfMissing('invoices', 'client_id', 'VARCHAR(64) NULL');
    await addColumnIfMissing('invoices', 'project_id', 'VARCHAR(64) NULL');
    await addColumnIfMissing('construction_quotations', 'client_id', 'VARCHAR(64) NULL');

    migrated = true;
  } catch (err) {
    console.warn('[CONTEC MIGRATION WARNING]', (err as Error).message);
  }
}
