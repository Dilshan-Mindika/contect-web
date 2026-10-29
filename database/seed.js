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

    // 3. Clear existing seed data to ensure fresh state
    console.log('[CONTEC SEEDER] Seeding core enterprise data in Sri Lankan Rupees (LKR)...');

    // Users
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

    // Projects in LKR
    await connection.query(`
      INSERT INTO projects (id, code, name, client, location, budget, spent, progress, phase, site_engineer, start_date, target_completion)
      VALUES 
      ('prj-01', 'CNT-PRJ-241', 'Colombo Port City Marina Residences', 'Port City Colombo Holdings', 'Port City Marine Drive, Colombo 01', 3850000000.00, 1463000000.00, 38, 'FOUNDATION', 'Eng. Maya Lin (Chartered Structural Eng)', '2026-04-10', '2027-12-15'),
      ('prj-02', 'CNT-PRJ-198', 'Kandy Hills Scenic Resort & Convention Hub', 'Kandy Scenic Sanctuaries Pvt Ltd', 'George E. De Silva Mawatha, Kandy', 2250000000.00, 1462500000.00, 65, 'STRUCTURAL', 'Eng. Marcus Chen & Eng. Elena Vance', '2025-08-01', '2027-03-30'),
      ('prj-03', 'CNT-PRJ-310', 'Nuwara Eliya High-Altitude Eco Pavilion', 'Nuwara Eliya Eco Ventures', 'Pedro Estate Ridge, Nuwara Eliya', 680000000.00, 598400000.00, 88, 'INTERIOR', 'Eng. David Okafor (BIM Coordinator)', '2025-02-15', '2026-12-20'),
      ('prj-04', 'CNT-PRJ-405', 'Central Expressway Viaduct & Bridge Section', 'Road Development Authority (RDA)', 'Kurunegala-Kandy Section 3, Sri Lanka', 5200000000.00, 936000000.00, 18, 'FOUNDATION', 'Eng. Tariq Mansour (Lead Geotech Eng)', '2026-07-01', '2029-06-30')
      ON DUPLICATE KEY UPDATE budget=VALUES(budget), spent=VALUES(spent), progress=VALUES(progress);
    `);

    // BOQ Items in LKR
    await connection.query(`
      INSERT INTO boq_items (id, project_id, item_code, section, description, unit, quantity, unit_rate, total_amount)
      VALUES 
      ('boq-01', 'prj-01', 'BILL-01', 'EARTHWORK', 'Deep marine excavation, secant pile diaphragm walls & rock anchors', 'm³', 45000.00, 9500.00, 427500000.00),
      ('boq-02', 'prj-01', 'BILL-02', 'SUBSTRUCTURE', 'Mass concrete raft foundation C40/50 with micro-silica', 'm³', 16000.00, 44000.00, 704000000.00),
      ('boq-03', 'prj-02', 'BILL-03', 'SUPERSTRUCTURE', 'High-tensile BS 4449 G500 rebar & post-tensioned slabs', 'tons', 3800.00, 355000.00, 1349000000.00),
      ('boq-04', 'prj-02', 'BILL-04', 'FACADE', 'Double skin unitized low-E curved architectural curtain walling', 'm²', 14500.00, 78000.00, 1131000000.00),
      ('boq-05', 'prj-03', 'BILL-05', 'MEP', 'Intelligent BMS, variable refrigerant HVAC & solar pumps', 'lot', 1.00, 750000000.00, 750000000.00)
      ON DUPLICATE KEY UPDATE total_amount=VALUES(total_amount);
    `);

    // Plant & Machinery Fleet
    await connection.query(`
      INSERT INTO machinery_fleet (id, asset_id, equipment_name, category, assigned_site_id, operator_name, fuel_capacity_pct, operating_hours, next_service_date, status)
      VALUES 
      ('mach-01', 'TC-280-01', 'Liebherr 280 EC-H 16 Litronic High-Rise Tower Crane', 'TOWER_CRANE', 'prj-01', 'Sunil Wickramasinghe (Certified Operator)', 92, 1420.5, '2026-11-20', 'OPERATIONAL'),
      ('mach-02', 'EX-349-04', 'Caterpillar 349D Heavy Hydraulic Excavator (49 Ton)', 'EXCAVATOR', 'prj-01', 'Chaminda Silva', 68, 2180.0, '2026-11-05', 'OPERATIONAL'),
      ('mach-03', 'BP-42M-02', 'Putzmeister BSF 42-5.16H High-Pressure Boom Pump', 'BOOM_PUMP', 'prj-01', 'Nihal Fernando', 45, 890.2, '2026-10-30', 'MAINTENANCE'),
      ('mach-04', 'DZ-D85-01', 'Komatsu D85EX-18 Heavy Earthmoving Crawler Dozer', 'BULLDOZER', 'prj-04', 'Prasanna Bandara', 84, 3200.4, '2026-12-15', 'OPERATIONAL'),
      ('mach-05', 'GEN-500K-03', 'Cummins C500D5e 500kVA Heavy Acoustic Prime Power Generator', 'GENERATOR', 'prj-02', 'Site Electrical Crew', 79, 640.0, '2027-01-10', 'STANDBY')
      ON DUPLICATE KEY UPDATE status=VALUES(status), fuel_capacity_pct=VALUES(fuel_capacity_pct);
    `);

    // Site Daily Logs
    await connection.query(`
      INSERT INTO site_daily_logs (id, project_id, log_date, weather_summary, ambient_temp_celsius, workforce_count, concrete_poured_m3, slump_test_mm, safety_incidents, osha_compliance_status, supervisor_notes)
      VALUES 
      ('log-site-01', 'prj-01', '2026-10-28', 'Partly Cloudy, 30°C, Wind 14 km/h SW', 30.2, 86, 420.00, 120.0, 0, 'COMPLIANT', 'Level B2 foundation raft pour completed smoothly. 14 ready-mix trucks discharged from Insee Peliyagoda plant. 6 cube samples taken for 7-day and 28-day testing.'),
      ('log-site-02', 'prj-02', '2026-10-28', 'Intermittent Rain, 24°C, Wind 6 km/h NE', 24.0, 68, 160.00, 110.0, 0, 'COMPLIANT', 'Tower crane operational after morning rain cleared. Level 4 concrete columns poured with Tokyo Super G35 mix. Rain delay of 1.5 hrs logged.')
      ON DUPLICATE KEY UPDATE concrete_poured_m3=VALUES(concrete_poured_m3);
    `);

    // Construction Quotations in LKR
    await connection.query(`
      INSERT INTO construction_quotations (id, quote_number, client_name, client_company, client_email, project_scope, valid_until, subtotal, tax_vat, grand_total, retention_pct, status, terms_and_conditions)
      VALUES 
      ('quote-01', 'CNT-QT-2026-401', 'Port City Luxury Developments PLC', 'Port City Colombo Holdings', 'tenders@portcity-developments.lk', 'Turnkey Design & Build EPC Contract - High-Rise Ocean Residences & Substructure', '2026-12-31', 4456500000.00, 802170000.00, 5370082500.00, 5, 'ISSUED', 'Governed under FIDIC Red Book 2017 & CIDA SBD-02. 20% Advance against unconditional Bank Guarantee. 5% Retention held.'),
      ('quote-02', 'CNT-QT-2026-402', 'Kandy Scenic Sanctuaries Pvt Ltd', 'Central Hills Hospitality Group', 'projects@centralhills.lk', 'Hillside Eco-Resort & Multi-Tier Panoramic Conference Center', '2026-11-30', 1818500000.00, 327330000.00, 2191292500.00, 5, 'ACCEPTED', 'All structural works executed under CIDA SBD-02 conditions of contract. 5% retention for 12 months DLP.')
      ON DUPLICATE KEY UPDATE grand_total=VALUES(grand_total), status=VALUES(status);
    `);

    // Invoices / Interim Payment Certificates in LKR
    await connection.query(`
      INSERT INTO invoices (id, invoice_number, client_name, project_name, issue_date, due_date, subtotal, tax, total, status)
      VALUES 
      ('inv-1001', 'CNT-IPC-2026-089', 'Port City Colombo Holdings', 'Colombo Port City Marina Residences', '2026-10-15', '2026-11-15', 160000000.00, 28800000.00, 168800000.00, 'PAID'),
      ('inv-1002', 'CNT-IPC-2026-090', 'Kandy Scenic Sanctuaries Pvt Ltd', 'Kandy Hills Scenic Resort & Convention Hub', '2026-10-20', '2026-11-20', 88000000.00, 15840000.00, 92840000.00, 'PENDING'),
      ('inv-1003', 'CNT-IPC-2026-091', 'Nuwara Eliya Eco Ventures', 'Nuwara Eliya High-Altitude Eco Pavilion', '2026-09-10', '2026-10-10', 45000000.00, 8100000.00, 47475000.00, 'OVERDUE')
      ON DUPLICATE KEY UPDATE total=VALUES(total), status=VALUES(status);
    `);

    // Subcontractors in LKR
    await connection.query(`
      INSERT INTO subcontractors (id, trade_name, specialty, assigned_project_id, safety_rating, insurance_expiry, contract_value, status)
      VALUES 
      ('sub-01', 'Access Geotech & Piling Lanka Ltd', 'Secant Piling, Slurry Diaphragm Walls & Soil Nailing', 'prj-01', 4.9, '2027-08-30', 480000000.00, 'ACTIVE'),
      ('sub-02', 'Sanken MEP Engineering Services', '3-Phase High Voltage, Intelligent BMS & Fire Suppression', 'prj-01', 4.8, '2027-05-15', 395000000.00, 'ACTIVE'),
      ('sub-03', 'Sierra Civil Works & Asphalt Solutions', 'Heavy Earthmoving, Road Realignment & Drainage', 'prj-04', 4.7, '2027-01-20', 620000000.00, 'ACTIVE')
      ON DUPLICATE KEY UPDATE status=VALUES(status);
    `);

    // Raw Materials Inventory in LKR
    await connection.query(`
      INSERT INTO inventory_materials (id, sku, name, category, quantity, unit, min_threshold, unit_cost, warehouse_location, status)
      VALUES 
      ('inv-item-01', 'STEEL-RB-500B', 'High-Yield Deformed Tor Steel (BS 4449 G500B / SLS 375: 25mm)', 'Structural Steel', 480.00, 'Metric Tons', 120.00, 345000.00, 'Central Stockyard Alpha - Kandy', 'OPTIMAL'),
      ('inv-item-02', 'CEM-OPC-50', 'Ordinary Portland Cement (SLS 107 Grade 42.5N, 50kg Bags)', 'Cementitious', 2400.00, 'Bags', 1000.00, 2350.00, 'Covered Cement Depot 2 - Port City', 'LOW_STOCK'),
      ('inv-item-03', 'CONC-G40-PUMP', 'Ready-Mix Concrete Grade 40 (G40 Micro-Silica Mix)', 'Ready-Mix Concrete', 850.00, 'm³', 300.00, 42500.00, 'Batching Plant Dispatch - Peliyagoda Hub', 'OPTIMAL'),
      ('inv-item-04', 'SAND-M-CUBE', 'Manufactured River Sand (M-Sand Graded for Structural Concrete)', 'Aggregates', 340.00, 'Cubes', 100.00, 28500.00, 'Aggregate Stockyard - Peradeniya', 'OPTIMAL'),
      ('inv-item-05', 'PLY-FILM-18', 'Phenolic Film-Faced Marine Shuttering Plywood (18mm, 8x4 ft)', 'Formwork', 1150.00, 'Sheets', 300.00, 9500.00, 'Timber & Formwork Yard - Peliyagoda', 'OPTIMAL')
      ON DUPLICATE KEY UPDATE quantity=VALUES(quantity), unit_cost=VALUES(unit_cost);
    `);

    // Website Showcase Projects
    await connection.query(`
      INSERT INTO website_showcase (id, title, category, location, image_url, description, completion_year, featured, display_order)
      VALUES 
      ('web-prj-01', 'The Skyrise Marina Tower', 'Commercial High-Rise', 'Port City Colombo, Sri Lanka', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'A 54-story parametric skyscraper engineered with deep sea secant piling, aerodynamic wind dampers, and BIPV solar skin.', '2026', TRUE, 1),
      ('web-prj-02', 'Kandy Ridge Luxury Sanctuary', 'Luxury Hospitality', 'Hunnasgiriya Ridge, Kandy', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'Turnkey off-grid cantilevered luxury pavilion cluster crafted with pre-stressed structural concrete and locally sourced mass timber.', '2025', TRUE, 2),
      ('web-prj-03', 'Central Viaduct Expressway Bridge', 'Civil Infrastructure', 'Central Province Corridor, Sri Lanka', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', 'Post-tensioned segmental concrete box girder bridge spanning 2.8 km of rugged montane terrain.', '2026', FALSE, 3)
      ON DUPLICATE KEY UPDATE title=VALUES(title);
    `);

    // Website Inquiries in LKR
    await connection.query(`
      INSERT INTO website_inquiries (id, client_name, email, phone, project_type, budget_range, message, status)
      VALUES 
      ('inq-01', 'Dr. Tariq Mansour', 't.mansour@gulf-invest.ae', '+971 50 892 1100', 'Commercial Mixed-Use Hospital Complex', 'LKR 1.5B - 3.5B', 'Seeking turnkey design & build EPC partner for a 12-story seismic-resistant medical center in Colombo 07.', 'NEW'),
      ('inq-02', 'Kirsten Vestergaard', 'kirsten@nordic-dwellings.dk', '+45 32 99 80 12', 'Eco-Resort Timber Pavilion Cluster', 'LKR 650M - 1.2B', 'Requesting preliminary BOQ and parametric structural engineering consultation for a coastal sanctuary in Tangalle.', 'CONTACTED')
      ON DUPLICATE KEY UPDATE status=VALUES(status);
    `);

    console.log('[CONTEC SEEDER] Database seeding successfully completed in LKR!');
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
