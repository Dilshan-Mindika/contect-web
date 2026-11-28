-- =============================================================================
-- CONTEC Design & Build — Enterprise Construction ERP & BMS MySQL Schema
-- Version: 5.0.0 (Multi-Company, 12 Core Modules, CIDA Directive 102/2024, LKR)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS contec_erp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE contec_erp;

-- 1. Companies & Legal Entities (Multi-Company Architecture)
CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    registration_number VARCHAR(64) NOT NULL UNIQUE,
    tin VARCHAR(64) NOT NULL,
    vat_number VARCHAR(64) NOT NULL,
    cida_grade VARCHAR(64) NOT NULL,
    address TEXT NOT NULL,
    contact_email VARCHAR(160) NOT NULL,
    phone VARCHAR(40) NOT NULL,
    currency VARCHAR(10) DEFAULT 'LKR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Executive Users & RBAC Matrix
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    title VARCHAR(120) NOT NULL,
    department VARCHAR(80) NOT NULL,
    avatar VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Master Construction Sites & Mega-Projects
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(32) DEFAULT 'COMP_A',
    code VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    client VARCHAR(160) NOT NULL,
    location VARCHAR(200) NOT NULL,
    budget DECIMAL(15, 2) NOT NULL,
    spent DECIMAL(15, 2) DEFAULT 0.00,
    progress INT DEFAULT 0,
    phase ENUM('DESIGN', 'FOUNDATION', 'STRUCTURAL', 'INTERIOR', 'HANDOVER') NOT NULL DEFAULT 'DESIGN',
    site_engineer VARCHAR(120) NOT NULL,
    start_date DATE NOT NULL,
    target_completion DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Bill of Quantities (BOQ) & Structural Cost Elements
CREATE TABLE IF NOT EXISTS boq_items (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL,
    item_code VARCHAR(32) NOT NULL,
    section ENUM('PRELIMINARIES', 'EARTHWORK', 'SUBSTRUCTURE', 'SUPERSTRUCTURE', 'MEP', 'FACADE', 'FINISHES', 'INFRASTRUCTURE') NOT NULL,
    description TEXT NOT NULL,
    unit VARCHAR(20) NOT NULL,
    quantity DECIMAL(12, 2) NOT NULL,
    unit_rate DECIMAL(12, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Site Daily Construction Logs (Weather, Concrete Pours, Safety/OSHA)
CREATE TABLE IF NOT EXISTS site_daily_logs (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL,
    company_id VARCHAR(32) DEFAULT 'COMP_A',
    log_date DATE NOT NULL,
    weather_summary VARCHAR(100) NOT NULL,
    ambient_temp_celsius DECIMAL(4, 1) NOT NULL,
    workforce_count INT NOT NULL,
    concrete_poured_m3 DECIMAL(10, 2) DEFAULT 0.00,
    slump_test_mm DECIMAL(5, 1) DEFAULT 0.0,
    safety_incidents INT DEFAULT 0,
    osha_compliance_status ENUM('COMPLIANT', 'OBSERVATION', 'BREACH') DEFAULT 'COMPLIANT',
    supervisor_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Heavy Plant & Machinery Fleet Operations
CREATE TABLE IF NOT EXISTS machinery_fleet (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(32) DEFAULT 'COMP_B',
    asset_id VARCHAR(32) NOT NULL UNIQUE,
    equipment_name VARCHAR(160) NOT NULL,
    category ENUM('TOWER_CRANE', 'EXCAVATOR', 'BOOM_PUMP', 'BULLDOZER', 'GENERATOR') NOT NULL,
    assigned_site_id VARCHAR(64),
    operator_name VARCHAR(120),
    fuel_capacity_pct INT DEFAULT 100,
    operating_hours DECIMAL(10, 1) DEFAULT 0.0,
    next_service_date DATE,
    status ENUM('OPERATIONAL', 'MAINTENANCE', 'STANDBY', 'REPAIR') DEFAULT 'OPERATIONAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_site_id) REFERENCES projects(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 7. Construction Quotations & Commercial Tenders
CREATE TABLE IF NOT EXISTS construction_quotations (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(32) DEFAULT 'COMP_A',
    quote_number VARCHAR(32) NOT NULL UNIQUE,
    client_name VARCHAR(160) NOT NULL,
    client_company VARCHAR(160) NOT NULL,
    client_email VARCHAR(160) NOT NULL,
    project_scope VARCHAR(255) NOT NULL,
    valid_until DATE NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    tax_vat DECIMAL(15, 2) NOT NULL,
    grand_total DECIMAL(15, 2) NOT NULL,
    retention_pct INT DEFAULT 5,
    status ENUM('DRAFT', 'ISSUED', 'ACCEPTED', 'REVISED', 'DECLINED') DEFAULT 'ISSUED',
    terms_and_conditions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 8. Commercial Progress Invoices
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(32) DEFAULT 'COMP_A',
    invoice_number VARCHAR(32) NOT NULL UNIQUE,
    client_name VARCHAR(160) NOT NULL,
    project_name VARCHAR(200) NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    tax DECIMAL(15, 2) NOT NULL,
    total DECIMAL(15, 2) NOT NULL,
    status ENUM('PAID', 'PENDING', 'OVERDUE') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 9. Subcontractor Trade Partners
CREATE TABLE IF NOT EXISTS subcontractors (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(32) DEFAULT 'COMP_A',
    trade_name VARCHAR(160) NOT NULL,
    specialty VARCHAR(120) NOT NULL,
    assigned_project_id VARCHAR(64),
    safety_rating DECIMAL(3, 1) DEFAULT 5.0,
    insurance_expiry DATE NOT NULL,
    contract_value DECIMAL(15, 2) NOT NULL,
    status ENUM('ACTIVE', 'PENDING_AUDIT', 'SUSPENDED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_project_id) REFERENCES projects(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 10. Yard Material Inventory & Heavy Stock
CREATE TABLE IF NOT EXISTS inventory_materials (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(32) DEFAULT 'COMP_A',
    sku VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity DECIMAL(12, 2) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    min_threshold DECIMAL(12, 2) NOT NULL,
    unit_cost DECIMAL(12, 2) NOT NULL,
    warehouse_location VARCHAR(160) NOT NULL,
    status ENUM('OPTIMAL', 'LOW_STOCK', 'CRITICAL') DEFAULT 'OPTIMAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 11. Chart of Accounts & General Ledger (Double-Entry GL)
CREATE TABLE IF NOT EXISTS general_ledger_accounts (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(32) NOT NULL,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(160) NOT NULL,
    category ENUM('ASSETS', 'LIABILITIES', 'EQUITY', 'INCOME', 'EXPENSES') NOT NULL,
    sub_category VARCHAR(80),
    balance_lkr DECIMAL(15, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 12. Site Labour Daily Muster Rolls (15-Day Wages & Fingerprint Audit)
CREATE TABLE IF NOT EXISTS daily_labour_muster (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(32) NOT NULL,
    project_id VARCHAR(64) NOT NULL,
    project_code VARCHAR(32) NOT NULL,
    muster_date DATE NOT NULL,
    total_present INT NOT NULL,
    total_skilled INT NOT NULL,
    total_unskilled INT NOT NULL,
    approved_by VARCHAR(120) NOT NULL,
    status VARCHAR(32) DEFAULT 'APPROVED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 13. CIDA Directive 102/2024 Interim Payment Certificates (IPC)
CREATE TABLE IF NOT EXISTS cida_ipcs (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(32) NOT NULL,
    project_id VARCHAR(64) NOT NULL,
    project_code VARCHAR(32) NOT NULL,
    ipc_number VARCHAR(32) NOT NULL,
    period_end DATE NOT NULL,
    cumulative_gross_lkr DECIMAL(15, 2) NOT NULL,
    net_certified_lkr DECIMAL(15, 2) NOT NULL,
    status VARCHAR(32) DEFAULT 'CERTIFIED_BY_CONSULTANT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 14. Central Document Vault (DMS & SHA-256 Provenance)
CREATE TABLE IF NOT EXISTS vault_documents (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(32) NOT NULL,
    document_ref_number VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    related_entity_id VARCHAR(64),
    file_format VARCHAR(16) NOT NULL,
    file_size_kb INT NOT NULL,
    upload_date DATE NOT NULL,
    uploaded_by VARCHAR(120) NOT NULL,
    is_confidential BOOLEAN DEFAULT FALSE,
    sha256_hash VARCHAR(64) DEFAULT '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 15. Security Audit & Transaction Log
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(32) DEFAULT 'COMP_A',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actor_name VARCHAR(120) NOT NULL,
    actor_email VARCHAR(160) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(80) NOT NULL,
    module VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(45),
    severity ENUM('INFO', 'WARNING', 'CRITICAL') DEFAULT 'INFO'
) ENGINE=InnoDB;

-- 16. Website CMS Showcase Projects & Dynamic Content
CREATE TABLE IF NOT EXISTS website_showcase (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(160) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    completion_year VARCHAR(10) NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 17. Website Inquiries (Incoming leads from /contact)
CREATE TABLE IF NOT EXISTS website_inquiries (
    id VARCHAR(64) PRIMARY KEY,
    client_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL,
    phone VARCHAR(40),
    project_type VARCHAR(120) NOT NULL,
    budget_range VARCHAR(80),
    message TEXT NOT NULL,
    status ENUM('NEW', 'CONTACTED', 'CONVERTED_TO_QUOTE', 'ARCHIVED') DEFAULT 'NEW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 18. Email Dispatch & Notification Outbox
CREATE TABLE IF NOT EXISTS email_outbox (
    id VARCHAR(64) PRIMARY KEY,
    recipient_email VARCHAR(160) NOT NULL,
    recipient_name VARCHAR(120),
    subject VARCHAR(255) NOT NULL,
    email_type ENUM('QUOTATION', 'SAFETY_ALERT', 'INVOICE', 'PO_APPROVAL', 'SYSTEM') NOT NULL,
    status ENUM('QUEUED', 'SENT', 'FAILED') DEFAULT 'SENT',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_message VARCHAR(255)
) ENGINE=InnoDB;

-- =============================================================================
-- 2NF Normalized Master & Child Tables
-- =============================================================================

-- 19. Normalized Clients Directory (Eliminates client repetition across projects/invoices/quotes)
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
) ENGINE=InnoDB;

-- 20. Normalized Departments Lookup
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(32) DEFAULT 'COMP_A',
    name VARCHAR(120) NOT NULL UNIQUE,
    head_name VARCHAR(120) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 21. Employees Master (Permanent & Temp Hourly)
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(32) DEFAULT 'COMP_A',
    emp_id VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(160) NOT NULL,
    role VARCHAR(120) NOT NULL,
    department_id VARCHAR(64) NULL,
    employment_type ENUM('PERMANENT', 'CONTRACT', 'TEMP_HOURLY', 'CONSULTANT') DEFAULT 'PERMANENT',
    salary_lkr DECIMAL(15, 2) DEFAULT 0.00,
    hourly_rate_lkr DECIMAL(12, 2) DEFAULT 0.00,
    email VARCHAR(160) DEFAULT '',
    phone VARCHAR(40) DEFAULT '',
    nic VARCHAR(32) DEFAULT '',
    status ENUM('ACTIVE', 'ON_LEAVE', 'INACTIVE') DEFAULT 'ACTIVE',
    join_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 22. 2NF Employee Attendance (Every attribute depends on full composite PK: employee_id + attendance_date)
CREATE TABLE IF NOT EXISTS employee_attendance (
    employee_id VARCHAR(64) NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('PRESENT', 'ON_SITE', 'HALF_DAY', 'ABSENT') NOT NULL DEFAULT 'PRESENT',
    hours_worked DECIMAL(5, 2) NOT NULL DEFAULT 8.00,
    ot_hours DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    hourly_payout_lkr DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (employee_id, attendance_date),
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 23. 2NF Invoice Line Items
CREATE TABLE IF NOT EXISTS invoice_items (
    id VARCHAR(64) PRIMARY KEY,
    invoice_id VARCHAR(64) NOT NULL,
    line_no INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    unit VARCHAR(32) DEFAULT 'Unit',
    quantity DECIMAL(12, 2) NOT NULL DEFAULT 1.00,
    unit_rate DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    line_total DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    UNIQUE KEY uq_invoice_line (invoice_id, line_no)
) ENGINE=InnoDB;

-- 24. 2NF Quotation Line Items
CREATE TABLE IF NOT EXISTS quotation_items (
    id VARCHAR(64) PRIMARY KEY,
    quotation_id VARCHAR(64) NOT NULL,
    line_no INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    unit VARCHAR(32) DEFAULT 'Unit',
    quantity DECIMAL(12, 2) NOT NULL DEFAULT 1.00,
    unit_rate DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    line_total DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (quotation_id) REFERENCES construction_quotations(id) ON DELETE CASCADE,
    UNIQUE KEY uq_quotation_line (quotation_id, line_no)
) ENGINE=InnoDB;

-- 25. 2NF Role-to-Permission Junction Table
CREATE TABLE IF NOT EXISTS erp_role_permissions (
    role VARCHAR(64) NOT NULL,
    permission_key VARCHAR(64) NOT NULL,
    PRIMARY KEY (role, permission_key)
) ENGINE=InnoDB;
