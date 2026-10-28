-- =============================================================================
-- CONTEC Design & Build — Enterprise Construction ERP & BMS MySQL Schema
-- Version: 4.2.0 (Civil, Structural, BOQ, Plant & Machinery, Website CMS)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS contec_erp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE contec_erp;

-- 1. Executive Users & RBAC Matrix
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

-- 2. Master Construction Sites & Mega-Projects
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY,
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

-- 3. Bill of Quantities (BOQ) & Structural Cost Elements
CREATE TABLE IF NOT EXISTS boq_items (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL,
    item_code VARCHAR(32) NOT NULL,
    section ENUM('EARTHWORK', 'SUBSTRUCTURE', 'SUPERSTRUCTURE', 'MEP', 'FACADE', 'FINISHES') NOT NULL,
    description TEXT NOT NULL,
    unit VARCHAR(20) NOT NULL,
    quantity DECIMAL(12, 2) NOT NULL,
    unit_rate DECIMAL(12, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Site Daily Construction Logs (Weather, Concrete Pours, Safety/OSHA)
CREATE TABLE IF NOT EXISTS site_daily_logs (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL,
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

-- 5. Heavy Plant & Machinery Fleet Operations
CREATE TABLE IF NOT EXISTS machinery_fleet (
    id VARCHAR(64) PRIMARY KEY,
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

-- 6. Construction Quotations & Commercial Tenders
CREATE TABLE IF NOT EXISTS construction_quotations (
    id VARCHAR(64) PRIMARY KEY,
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

-- 7. Commercial Progress Invoices
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(64) PRIMARY KEY,
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

-- 8. Subcontractor Trade Partners
CREATE TABLE IF NOT EXISTS subcontractors (
    id VARCHAR(64) PRIMARY KEY,
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

-- 9. Yard Material Inventory & Heavy Stock
CREATE TABLE IF NOT EXISTS inventory_materials (
    id VARCHAR(64) PRIMARY KEY,
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

-- 10. Website CMS Showcase Projects & Dynamic Content
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

-- 11. Website Inquiries (Incoming leads from /contact)
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

-- 12. Security Audit & Transaction Log
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
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

-- 13. Email Dispatch & Notification Outbox
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

