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

    // 3. Clear existing seed data to ensure fresh state
    console.log('[CONTEC SEEDER] Seeding core enterprise data...');

    // Users
    await connection.query(`
      INSERT INTO users (id, name, email, role, title, department, avatar, password_hash)
      VALUES 
      ('usr_admin_01', 'Elena Vance', 'admin@contec.com', 'SUPER_ADMIN', 'Chief Executive Officer', 'Executive Board', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'ContecSuper2026!'),
      ('usr_fin_02', 'Arthur Sterling', 'finance@contec.com', 'FINANCE_DIRECTOR', 'Chief Financial Officer', 'Corporate Finance', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', 'Finance2026!'),
      ('usr_ops_03', 'Marcus Chen', 'operations@contec.com', 'OPERATIONS_HEAD', 'VP of Construction & Site Ops', 'Field Operations', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'OpsLead2026!'),
      ('usr_hr_04', 'Sophia Al-Mansoor', 'hr@contec.com', 'HR_MANAGER', 'Chief People & Talent Officer', 'People & Culture', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'PeopleFirst2026!'),
      ('usr_sales_05', 'Julian Voss', 'sales@contec.com', 'SALES_DIRECTOR', 'VP of Global Business Development', 'Commercial & CRM', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'ContecSales2026!'),
      ('usr_eng_06', 'Maya Lin', 'engineer@contec.com', 'PROJECT_ENGINEER', 'Principal Structural Architect & BIM Lead', 'Structural Engineering', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'CivilBIM2026!')
      ON DUPLICATE KEY UPDATE name=VALUES(name), title=VALUES(title);
    `);

    // Projects
    await connection.query(`
      INSERT INTO projects (id, code, name, client, location, budget, spent, progress, phase, site_engineer, start_date, target_completion)
      VALUES 
      ('prj-01', 'CNT-PRJ-241', 'The Lumina Waterfront Residences', 'Meridian Prime Real Estate', 'Dubai Maritime Coastal Zone', 18750000.00, 6850000.00, 38, 'FOUNDATION', 'Maya Lin', '2026-04-10', '2027-12-15'),
      ('prj-02', 'CNT-PRJ-198', 'Astraea Skyrise Tower', 'Astraea Holdings Ltd.', 'Financial District, Singapore', 38000000.00, 24200000.00, 65, 'STRUCTURAL', 'Elena Vance & Marcus Chen', '2025-08-01', '2027-03-30'),
      ('prj-03', 'CNT-PRJ-310', 'Eco-Conservatory Biosphere', 'Nordic Biome Ventures', 'Oslo Science Park, Norway', 14200000.00, 12100000.00, 88, 'INTERIOR', 'Maya Lin', '2025-02-15', '2026-12-20'),
      ('prj-04', 'CNT-PRJ-405', 'Pacific Hyperloop Interchange', 'Pacific Trans-Urban Consortium', 'Seattle-Portland High Speed Corridor', 52000000.00, 8900000.00, 18, 'DESIGN', 'Marcus Chen', '2026-07-01', '2029-06-30')
      ON DUPLICATE KEY UPDATE budget=VALUES(budget), spent=VALUES(spent), progress=VALUES(progress);
    `);

    // BOQ Items
    await connection.query(`
      INSERT INTO boq_items (id, project_id, item_code, section, description, unit, quantity, unit_rate, total_amount)
      VALUES 
      ('boq-01', 'prj-01', 'C-101', 'EARTHWORK', 'Deep excavation, diaphragm slurry wall & rock anchors', 'm³', 45000.00, 48.00, 2160000.00),
      ('boq-02', 'prj-01', 'C-102', 'SUBSTRUCTURE', 'Mass concrete raft foundation C50 with silica fume', 'm³', 18000.00, 210.00, 3780000.00),
      ('boq-03', 'prj-02', 'C-103', 'SUPERSTRUCTURE', 'Robotic welded high-tensile steel frame superstructure', 'tons', 8200.00, 850.00, 6970000.00),
      ('boq-04', 'prj-02', 'C-104', 'FACADE', 'Double skin curved unitized low-E curtain walling', 'm²', 12500.00, 360.00, 4500000.00),
      ('boq-05', 'prj-03', 'C-105', 'MEP', 'Intelligent BMS, variable refrigerant HVAC & solar pumps', 'kit', 1.00, 2800000.00, 2800000.00)
      ON DUPLICATE KEY UPDATE total_amount=VALUES(total_amount);
    `);

    // Plant & Machinery Fleet
    await connection.query(`
      INSERT INTO machinery_fleet (id, asset_id, equipment_name, category, assigned_site_id, operator_name, fuel_capacity_pct, operating_hours, next_service_date, status)
      VALUES 
      ('mach-01', 'TC-280-01', 'Liebherr 280 EC-H 16 Litronic High-Rise Tower Crane', 'TOWER_CRANE', 'prj-02', 'Tariq Al-Hashemi', 92, 1420.5, '2026-11-20', 'OPERATIONAL'),
      ('mach-02', 'EX-349-04', 'Caterpillar 349 Heavy Hydraulic Excavator (49 Ton)', 'EXCAVATOR', 'prj-01', 'Vikram Singh', 68, 2180.0, '2026-11-05', 'OPERATIONAL'),
      ('mach-03', 'BP-42M-02', 'Putzmeister BSF 42-5.16H High-Pressure Boom Pump', 'BOOM_PUMP', 'prj-01', 'Dmitri Volkov', 45, 890.2, '2026-10-30', 'MAINTENANCE'),
      ('mach-04', 'DZ-D85-01', 'Komatsu D85EX-18 Heavy Earthmoving Crawler Dozer', 'BULLDOZER', 'prj-04', 'Marcus Vance', 84, 3200.4, '2026-12-15', 'OPERATIONAL'),
      ('mach-05', 'GEN-500K-03', 'Cummins C500D5e 500kVA Heavy Acoustic Prime Generator', 'GENERATOR', 'prj-03', 'Site Electrical Crew', 79, 640.0, '2027-01-10', 'STANDBY')
      ON DUPLICATE KEY UPDATE status=VALUES(status), fuel_capacity_pct=VALUES(fuel_capacity_pct);
    `);

    // Site Daily Logs
    await connection.query(`
      INSERT INTO site_daily_logs (id, project_id, log_date, weather_summary, ambient_temp_celsius, workforce_count, concrete_poured_m3, slump_test_mm, safety_incidents, osha_compliance_status, supervisor_notes)
      VALUES 
      ('log-site-01', 'prj-01', '2026-10-28', 'Clear, 28°C, Wind 12 km/h NW', 28.5, 64, 420.00, 120.0, 0, 'COMPLIANT', 'Level B2 core wall pour completed seamlessly. 14 ready-mix trucks discharged. Cube samples 26-B2-01 to 08 taken for 7-day curing lab test.'),
      ('log-site-02', 'prj-02', '2026-10-28', 'Partly Cloudy, 31°C, Wind 8 km/h S', 31.0, 92, 180.00, 110.0, 0, 'COMPLIANT', 'Tower Crane #1 erected Level 43 steel outrigger node. Acoustic curtain wall brackets inspected and torque certified.'),
      ('log-site-03', 'prj-03', '2026-10-27', 'Overcast, 14°C, Wind 15 km/h E', 14.2, 38, 0.00, 0.0, 0, 'COMPLIANT', 'Geodesic timber arch installation reached 92%. Internal micro-climate HVAC ducting pressure tests passed at 1.5 bar.')
      ON DUPLICATE KEY UPDATE concrete_poured_m3=VALUES(concrete_poured_m3);
    `);

    // Construction Quotations
    await connection.query(`
      INSERT INTO construction_quotations (id, quote_number, client_name, client_company, client_email, project_scope, valid_until, subtotal, tax_vat, grand_total, retention_pct, status, terms_and_conditions)
      VALUES 
      ('quote-01', 'CNT-QT-2026-401', 'Astraea Capital Partners', 'Astraea Holdings Ltd.', 'acquisitions@astraea-holdings.com', 'Turnkey Aerospace-Grade Skyscraper & Structural Core', '2026-12-15', 20210000.00, 1010500.00, 21220500.00, 5, 'ISSUED', 'Standard FIDIC commercial contract. Payment milestones: 10% Advance, 35% Substructure, 30% Superstructure, 20% MEP & Handover. 5% Retention held for 12 months Defect Liability.'),
      ('quote-02', 'CNT-QT-2026-402', 'Meridian Prime Real Estate', 'Meridian Prime Real Estate', 'developments@meridianprime.ae', 'Coastal Luxury Residential Towers with Deep Piling', '2026-11-30', 17400000.00, 870000.00, 18270000.00, 5, 'ACCEPTED', 'All work executed under FIDIC Yellow Book standard engineering contract conditions.')
      ON DUPLICATE KEY UPDATE grand_total=VALUES(grand_total), status=VALUES(status);
    `);

    // Invoices
    await connection.query(`
      INSERT INTO invoices (id, invoice_number, client_name, project_name, issue_date, due_date, subtotal, tax, total, status)
      VALUES 
      ('inv-1001', 'CNT-2026-089', 'Meridian Prime Real Estate', 'The Lumina Waterfront Residences', '2026-10-15', '2026-11-15', 2250000.00, 112500.00, 2362500.00, 'PAID'),
      ('inv-1002', 'CNT-2026-090', 'Astraea Holdings Ltd.', 'Astraea Skyrise Tower', '2026-10-20', '2026-11-20', 3750000.00, 187500.00, 3937500.00, 'PENDING'),
      ('inv-1003', 'CNT-2026-091', 'Apex Logistics Hub', 'Automated Distribution Terminal', '2026-09-10', '2026-10-10', 1400000.00, 70000.00, 1470000.00, 'OVERDUE')
      ON DUPLICATE KEY UPDATE total=VALUES(total), status=VALUES(status);
    `);

    // Subcontractors
    await connection.query(`
      INSERT INTO subcontractors (id, trade_name, specialty, assigned_project_id, safety_rating, insurance_expiry, contract_value, status)
      VALUES 
      ('sub-01', 'Al-Futtaim Deep Foundations Ltd.', 'Secant Piling, Slurry Diaphragm Walls & Geotech', 'prj-01', 4.9, '2027-08-30', 4200000.00, 'ACTIVE'),
      ('sub-02', 'Schüco International Façades', 'High-Wind Triple Glazed Curtain Walls & BIPV Units', 'prj-02', 5.0, '2027-12-15', 6800000.00, 'ACTIVE'),
      ('sub-03', 'Drake & Scull Engineering Consortium', 'Mechanical, Electrical, Plumbing (MEP) & Fire Suppression', 'prj-03', 4.8, '2027-05-10', 3100000.00, 'ACTIVE')
      ON DUPLICATE KEY UPDATE status=VALUES(status);
    `);

    // Website Showcase Projects
    await connection.query(`
      INSERT INTO website_showcase (id, title, category, location, image_url, description, completion_year, featured, display_order)
      VALUES 
      ('web-prj-01', 'The Skyrise Marina Tower', 'Commercial High-Rise', 'Dubai Coastal District', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'A 64-story parametric skyscraper with integrated aerodynamic wind dampers and BIPV solar skin.', '2026', TRUE, 1),
      ('web-prj-02', 'Neo-Villas Maritime Island', 'Luxury Residential', 'Sri Lanka Coastal Sanctuary', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'Turnkey off-grid cantilevered luxury villas crafted with pre-stressed structural concrete and mass timber.', '2025', TRUE, 2),
      ('web-prj-03', 'Silicon Biophilic Data Hub', 'Technology & Mission Critical', 'Singapore Central', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', 'Zero-emission computing campus engineered with submerged cryogenic cooling and Passivhaus standards.', '2026', FALSE, 3)
      ON DUPLICATE KEY UPDATE title=VALUES(title);
    `);

    // Website Inquiries
    await connection.query(`
      INSERT INTO website_inquiries (id, client_name, email, phone, project_type, budget_range, message, status)
      VALUES 
      ('inq-01', 'Dr. Tariq Mansour', 't.mansour@gulf-invest.ae', '+971 50 892 1100', 'Commercial Mixed-Use Hospital', '$20M - $35M', 'Seeking turnkey design & build EPC partner for a 12-story seismic-resistant medical center.', 'NEW'),
      ('inq-02', 'Kirsten Vestergaard', 'kirsten@nordic-dwellings.dk', '+45 32 99 80 12', 'Eco-Resort Timber Pavilion Cluster', '$8M - $15M', 'Requesting preliminary BOQ and parametric structural engineering consultation.', 'CONTACTED')
      ON DUPLICATE KEY UPDATE status=VALUES(status);
    `);

    console.log('[CONTEC SEEDER] Database seeding successfully completed!');
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

