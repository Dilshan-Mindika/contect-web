/* eslint-disable */
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Basic .env parser
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        let val = trimmed.substring(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    }
  }
}

loadEnv();

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'Dila1011@',
  multipleStatements: true,
};

const DB_NAME = process.env.MYSQL_DATABASE || 'contec_erp';

async function seed() {
  console.log(`[CONTEC SEEDER] Connecting to MySQL at ${dbConfig.host}:${dbConfig.port} as '${dbConfig.user}'...`);

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('[CONTEC SEEDER] Connected successfully to MySQL server.');

    // 1. Create and select Database
    console.log(`[CONTEC SEEDER] Ensuring database '${DB_NAME}' exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${DB_NAME}\`;`);

    // 2. Read and apply schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('[CONTEC SEEDER] Executing schema.sql DDL definitions...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);
      console.log('[CONTEC SEEDER] All construction tables created or verified.');
    }

    // 2.1 Safely add company_id column if table already existed without it
    const tablesToMigrate = ['projects', 'machinery_fleet', 'invoices', 'construction_quotations', 'subcontractors', 'inventory_materials', 'site_daily_logs', 'audit_logs'];
    for (const tbl of tablesToMigrate) {
      try {
        const [cols] = await connection.query(`SHOW COLUMNS FROM \`${tbl}\` LIKE 'company_id';`);
        if (!cols || cols.length === 0) {
          const defaultComp = tbl === 'machinery_fleet' ? 'COMP_B' : 'COMP_A';
          await connection.query(`ALTER TABLE \`${tbl}\` ADD COLUMN \`company_id\` VARCHAR(32) DEFAULT '${defaultComp}' AFTER \`id\`;`);
          console.log(`[CONTEC SEEDER] Added 'company_id' column to '${tbl}'.`);
        }
      } catch (e) {
        // Table might not exist or already updated
      }
    }

    console.log('[CONTEC SEEDER] Seeding multi-company enterprise data in Sri Lankan Rupees (LKR)...');

    // 1. Companies Master (Company A & Company B)
    await connection.query(`
      INSERT INTO companies (id, name, registration_number, tin, vat_number, cida_grade, address, contact_email, phone, currency)
      VALUES 
      ('COMP_A', 'Contec Engineering & Construction (Pvt) Ltd', 'PV-00249811', 'TIN-10928374-0001', 'VAT-10928374-7000', 'Grade CS2 (Major Civil & Building Contractor)', 'No. 45, Alfred Place, Colombo 03, Sri Lanka', 'director@contec.lk', '+94 11 257 8900', 'LKR'),
      ('COMP_B', 'Contec Heavy Infra & Equipment (Pvt) Ltd', 'PV-00299104', 'TIN-20984712-0002', 'VAT-20984712-7000', 'Grade EM1 / C1 (Plant, Heavy Machinery & Earthmoving)', 'No. 12/B, Industrial Zone, Peliyagoda, Sri Lanka', 'plant@contec.lk', '+94 11 294 5600', 'LKR')
      ON DUPLICATE KEY UPDATE name=VALUES(name), cida_grade=VALUES(cida_grade);
    `);

    // 2. Executive Users & Signatories
    await connection.query(`
      INSERT INTO users (id, name, email, role, title, department, avatar, password_hash)
      VALUES 
      ('usr_admin_01', 'Eng. Elena Vance', 'director@contec.com', 'SUPER_ADMIN', 'Managing Director & Chartered Civil Engineer', 'Executive Board', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'Dila1011@'),
      ('usr_fin_02', 'Arthur Sterling', 'finance@contec.com', 'FINANCE_DIRECTOR', 'Chief Financial Officer & Cost Controller', 'Corporate Finance', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', 'Dila1011@'),
      ('usr_ops_03', 'Eng. Marcus Chen', 'operations@contec.com', 'OPERATIONS_HEAD', 'VP of Construction & Site Ops', 'Field Operations', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'Dila1011@'),
      ('usr_hr_04', 'Sophia Al-Mansoor', 'hr@contec.com', 'HR_MANAGER', 'Chief People Officer', 'People & Culture', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'Dila1011@'),
      ('usr_sales_05', 'Julian Voss', 'sales@contec.com', 'SALES_DIRECTOR', 'VP of Commercial & Tenders', 'Commercial & CRM', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Dila1011@'),
      ('usr_eng_06', 'Eng. Maya Lin', 'architect@contec.com', 'PROJECT_ENGINEER', 'Principal Structural Architect & BIM Lead', 'Structural Engineering', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Dila1011@'),
      ('usr_qs_07', 'Kavita Patel', 'qs@contec.com', 'QUANTITY_SURVEYOR', 'Chief Quantity Surveyor & Commercial Estimator', 'Quantity Surveying & Contracts', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150', 'Dila1011@'),
      ('usr_safe_08', 'David Okafor', 'safety@contec.com', 'SAFETY_ENGINEER', 'Senior Site Safety Engineer (HSE & OSHA)', 'Safety & Quality Assurance', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Dila1011@')
      ON DUPLICATE KEY UPDATE name=VALUES(name), title=VALUES(title);
    `);

    // 3. Projects in LKR
    await connection.query(`
      INSERT INTO projects (id, company_id, code, name, client, location, budget, spent, progress, phase, site_engineer, start_date, target_completion)
      VALUES 
      ('prj-01', 'COMP_A', 'CNT-PRJ-241', 'Colombo Port City Marina Residences', 'Port City Colombo Holdings', 'Port City Marine Drive, Colombo 01', 3850000000.00, 1463000000.00, 38, 'FOUNDATION', 'Eng. Maya Lin (Chartered Structural Eng)', '2026-04-10', '2027-12-15'),
      ('prj-02', 'COMP_A', 'CNT-PRJ-198', 'Kandy Hills Scenic Resort & Convention Hub', 'Kandy Scenic Sanctuaries Pvt Ltd', 'George E. De Silva Mawatha, Kandy', 2250000000.00, 1462500000.00, 65, 'STRUCTURAL', 'Eng. Marcus Chen & Eng. Elena Vance', '2025-08-01', '2027-03-30'),
      ('prj-03', 'COMP_A', 'CNT-PRJ-310', 'Nuwara Eliya High-Altitude Eco Pavilion', 'Nuwara Eliya Eco Ventures', 'Pedro Estate Ridge, Nuwara Eliya', 680000000.00, 598400000.00, 88, 'INTERIOR', 'Eng. David Okafor (BIM Coordinator)', '2025-02-15', '2026-12-20'),
      ('prj-04', 'COMP_A', 'CNT-PRJ-405', 'Central Expressway Viaduct & Bridge Section', 'Road Development Authority (RDA)', 'Kurunegala-Kandy Section 3, Sri Lanka', 5200000000.00, 936000000.00, 18, 'FOUNDATION', 'Eng. Tariq Mansour (Lead Geotech Eng)', '2026-07-01', '2029-06-30')
      ON DUPLICATE KEY UPDATE budget=VALUES(budget), spent=VALUES(spent), progress=VALUES(progress);
    `);

    // 4. Chart of Accounts & General Ledger in LKR
    await connection.query(`
      INSERT INTO general_ledger_accounts (id, company_id, code, name, category, sub_category, balance_lkr, is_active)
      VALUES 
      ('gl-a-1010', 'COMP_A', '1010', 'Commercial Bank - Main Operational Current A/C', 'ASSETS', 'CASH_AND_EQUIVALENTS', 285400000.00, TRUE),
      ('gl-a-1020', 'COMP_A', '1020', 'Hatton National Bank - Client Escrow Retention A/C', 'ASSETS', 'CASH_AND_EQUIVALENTS', 120500000.00, TRUE),
      ('gl-a-1100', 'COMP_A', '1100', 'Accounts Receivable - Certified Client IPC Claims', 'ASSETS', 'ACCOUNTS_RECEIVABLE', 412000000.00, TRUE),
      ('gl-a-4010', 'COMP_A', '4010', 'Contract Revenue - Certified Civil & Building Works', 'INCOME', 'OPERATING_REVENUE', 1463000000.00, TRUE),
      ('gl-b-1010', 'COMP_B', '1010', 'Sampath Bank - Plant & Fleet Operating A/C', 'ASSETS', 'CASH_AND_EQUIVALENTS', 145000000.00, TRUE),
      ('gl-b-1510', 'COMP_B', '1510', 'Heavy Construction Machinery & Tower Crane Fleet', 'ASSETS', 'FIXED_ASSETS', 1280000000.00, TRUE),
      ('gl-b-4010', 'COMP_B', '4010', 'Plant & Equipment Hire / Leasing Revenue', 'INCOME', 'OPERATING_REVENUE', 342000000.00, TRUE)
      ON DUPLICATE KEY UPDATE balance_lkr=VALUES(balance_lkr);
    `);

    // 5. Site Labour Daily Muster Rolls
    await connection.query(`
      INSERT INTO daily_labour_muster (id, company_id, project_id, project_code, muster_date, total_present, total_skilled, total_unskilled, approved_by, status)
      VALUES 
      ('mst-01', 'COMP_A', 'prj-01', 'CNT-PRJ-241', '2026-10-28', 86, 52, 34, 'Eng. Maya Lin (Chartered Structural Eng)', 'APPROVED'),
      ('mst-02', 'COMP_A', 'prj-02', 'CNT-PRJ-198', '2026-10-28', 68, 40, 28, 'Eng. Marcus Chen (VP Ops)', 'APPROVED'),
      ('mst-03', 'COMP_B', 'prj-04', 'CNT-PRJ-405', '2026-10-28', 35, 25, 10, 'Plant Ops Manager (Comp B)', 'APPROVED')
      ON DUPLICATE KEY UPDATE total_present=VALUES(total_present);
    `);

    // 6. CIDA Directive 102/2024 Interim Payment Certificates
    await connection.query(`
      INSERT INTO cida_ipcs (id, company_id, project_id, project_code, ipc_number, period_end, cumulative_gross_lkr, net_certified_lkr, status)
      VALUES 
      ('ipc-a-01', 'COMP_A', 'prj-01', 'CNT-PRJ-241', 'A-IPC-014', '2026-10-25', 1463000000.00, 168800000.00, 'CERTIFIED_BY_CONSULTANT'),
      ('ipc-a-02', 'COMP_A', 'prj-02', 'CNT-PRJ-198', 'A-IPC-008', '2026-10-20', 1462500000.00, 92840000.00, 'CERTIFIED_BY_CONSULTANT'),
      ('ipc-b-01', 'COMP_B', 'prj-04', 'CNT-PRJ-405', 'B-IPC-003', '2026-10-15', 385000000.00, 48200000.00, 'SUBMITTED_TO_EMPLOYER')
      ON DUPLICATE KEY UPDATE net_certified_lkr=VALUES(net_certified_lkr);
    `);

    // 7. Central Document Vault with SHA-256 Hashes
    await connection.query(`
      INSERT INTO vault_documents (id, company_id, document_ref_number, title, category, related_entity_id, file_format, file_size_kb, upload_date, uploaded_by, is_confidential, sha256_hash)
      VALUES 
      ('doc-01', 'COMP_A', 'A-CNT-2026-001', 'Colombo Port City Marina Residences Master Contract Agreement (FIDIC)', 'CONTRACT', 'CNT-PRJ-241', 'PDF', 18450, '2026-04-10', 'Eng. Elena Vance', TRUE, '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'),
      ('doc-02', 'COMP_A', 'A-IPC-CERT-014', 'IPC #014 Consultant Certified Valuation & Retention Schedule', 'CIDA_IPC', 'CNT-PRJ-241', 'PDF', 4200, '2026-10-26', 'Kavita Patel (Chief QS)', FALSE, '3c59dc048e8850243be8079a5c74d079'),
      ('doc-03', 'COMP_A', 'A-TAX-VAT-Q3-26', 'Inland Revenue Department VAT & SSCL Q3/2026 Clearance Return', 'TAX_RETURN', 'VAT-10928374-7000', 'PDF', 2850, '2026-10-15', 'Arthur Sterling (CFO)', TRUE, 'c28a5840f0d393693e50668b0b973ef4'),
      ('doc-04', 'COMP_B', 'B-FLEET-CAT-349', 'Caterpillar 349D Excavator Telematics Calibration & Safety Certificate', 'CONTRACT', 'EX-349-04', 'PDF', 3100, '2026-09-12', 'Plant Fleet Director', FALSE, '9a0364b9e99bb480dd25e1f0284c8555'),
      ('doc-05', 'COMP_B', 'B-PV-2026-0089', 'Lanka IOC Bulk Auto Diesel Delivery Voucher (12,000L @ LKR 370/L)', 'PAYMENT_VOUCHER', 'B-PV-0089', 'PDF', 1250, '2026-10-27', 'Site Fuel Logistics', FALSE, 'e3b0c44298fc1c149afbf4c8996fb924')
      ON DUPLICATE KEY UPDATE title=VALUES(title);
    `);

    // 8. Plant & Machinery Fleet
    await connection.query(`
      INSERT INTO machinery_fleet (id, company_id, asset_id, equipment_name, category, assigned_site_id, operator_name, fuel_capacity_pct, operating_hours, next_service_date, status)
      VALUES 
      ('mach-01', 'COMP_B', 'TC-280-01', 'Liebherr 280 EC-H 16 Litronic High-Rise Tower Crane', 'TOWER_CRANE', 'prj-01', 'Sunil Wickramasinghe (Certified Operator)', 92, 1420.5, '2026-11-20', 'OPERATIONAL'),
      ('mach-02', 'COMP_B', 'EX-349-04', 'Caterpillar 349D Heavy Hydraulic Excavator (49 Ton)', 'EXCAVATOR', 'prj-01', 'Chaminda Silva', 68, 2180.0, '2026-11-05', 'OPERATIONAL'),
      ('mach-03', 'COMP_B', 'BP-42M-02', 'Putzmeister BSF 42-5.16H High-Pressure Boom Pump', 'BOOM_PUMP', 'prj-01', 'Nihal Fernando', 45, 890.2, '2026-10-30', 'MAINTENANCE'),
      ('mach-04', 'COMP_B', 'DZ-D85-01', 'Komatsu D85EX-18 Heavy Earthmoving Crawler Dozer', 'BULLDOZER', 'prj-04', 'Prasanna Bandara', 84, 3200.4, '2026-12-15', 'OPERATIONAL'),
      ('mach-05', 'COMP_B', 'GEN-500K-03', 'Cummins C500D5e 500kVA Heavy Acoustic Prime Power Generator', 'GENERATOR', 'prj-02', 'Site Electrical Crew', 79, 640.0, '2027-01-10', 'STANDBY')
      ON DUPLICATE KEY UPDATE status=VALUES(status), fuel_capacity_pct=VALUES(fuel_capacity_pct);
    `);

    console.log('[CONTEC SEEDER] Database seeding successfully completed in LKR for both Company A and Company B!');
  } catch (err) {
    console.error('[CONTEC SEEDER ERROR]', err.message);
    console.log(`[CONTEC SEEDER NOTE] If MySQL server is offline, verify MySQL service is running on port ${dbConfig.port}. The application continues to run seamlessly with built-in resilient fallback.`);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seed();
