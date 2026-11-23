# Multi-Company 12-Module Construction ERP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

This plan details the full implementation of the **Web-based Construction Enterprise Management System (CEMS)** managing **Two Legal Entities** (*Contec Engineering & Construction (Pvt) Ltd* and *Contec Heavy Infra & Equipment (Pvt) Ltd*) across all **12 Core Construction Modules**.

---

### Task 1: Multi-Company Types & State Expansion
- [ ] Add `CompanyId = 'COMP_A' | 'COMP_B'` and `ActiveCompany = 'COMP_A' | 'COMP_B' | 'CONSOLIDATED'` in `lib/erp/types.ts`.
- [ ] Add multi-company data models for all 12 modules in `lib/erp/types.ts`:
  - `CompanyProfile`, `DirectorRecord`, `BankAccountRecord`, `DocumentSequenceRecord`, `ApprovalRule`
  - Double-entry `JournalEntry`, `GeneralLedgerAccount`, `CashBookEntry`, `BankReconciliation`
  - `MusterRollEntry`, `LabourRate`, `LabourPayrollCycle` (15-day half-monthly)
  - `PurchaseRequisition`, `RFQ`, `ThreeWayMatchRecord`
  - `WarehouseStore`, `MaterialRequisition`, `MaterialIssueNote`, `StockTransfer`
  - `FuelLogRecord`, `EquipmentMaintenanceRecord`, `EquipmentAllocation`
  - `BudgetBaseline`, `ProjectCostBreakdown`, `EVMMetrics`
  - `TenderRecord`, `BankBondRecord`, `CIDA102IPCRecord`
  - `SafetyInspection`, `PPERecord`, `SafetyIncidentRecord`, `ToolboxTalk`
  - `VaultDocument`
- [ ] Add rich seed datasets in `lib/erp/store.ts` for both Company A and Company B.
- [ ] Update `lib/erp/AuthContext.tsx` with `activeCompany`, `setActiveCompany`, and multi-company filtering & mutation handlers.

---

### Task 2: Global Navigation, Top Bar & Company Switcher
- [ ] Update `components/erp/ERPLayoutContent.tsx` with:
  - Top bar **Company Switcher** (`Company A: Contec Engineering` | `Company B: Contec Heavy Infra` | `🏢 Consolidated View`).
  - Company-specific badges, TIN/VAT indicator, and fast switching.
  - Grouped 12-module sidebar navigation matching the blueprint:
    - `01. Company & Admin` (`/erp/company`)
    - `02. Projects & Sites` (`/erp/projects`)
    - `03. Finance & Accounts` (`/erp/finance`)
    - `04. HR & Workforce` (`/erp/hr`)
    - `05. Site Labour & Wages` (`/erp/site-labour`)
    - `06. Procurement & POs` (`/erp/procurement`)
    - `07. Inventory & Stores` (`/erp/inventory`)
    - `08. Plant & Machinery` (`/erp/machinery`)
    - `09. Cost Control & EVM` (`/erp/budgeting`)
    - `10. Government Contracts & IPC` (`/erp/contracts`)
    - `11. Health & Safety HSE` (`/erp/safety`)
    - `12. Document Vault & Audit` (`/erp/audit`)

---

### Task 3: Implementation of Modules 01 to 04
- [ ] Implement `app/erp/company/page.tsx` (Module 01: Company & Administration).
- [ ] Upgrade `app/erp/projects/page.tsx` (Module 02: Project Management with 360° Cockpit).
- [ ] Upgrade `app/erp/finance/page.tsx` (Module 03: Accounting & Finance with Double-Entry Ledger, Cash/Bank books, AR/AP, and Consolidated Statements).
- [ ] Upgrade `app/erp/hr/page.tsx` (Module 04: HR & Workforce with Sri Lankan EPF/ETF Payroll and Payslip Generation).

---

### Task 4: Implementation of Modules 05 to 08
- [ ] Implement `app/erp/site-labour/page.tsx` (Module 05: Site Labour Management, 15-day wages, and direct project cost posting).
- [ ] Implement `app/erp/procurement/page.tsx` (Module 06: Procurement & Purchasing, PR, RFQ, PO, GRN, and 3-Way Match).
- [ ] Upgrade `app/erp/inventory/page.tsx` (Module 07: Inventory & Multi-Store with MIN, transfers, and material cost debits).
- [ ] Upgrade `app/erp/machinery/page.tsx` (Module 08: Plant & Machinery Fleet with Auto Diesel fuel tracking and equipment cost allocation).

---

### Task 5: Implementation of Modules 09 to 12 & Main Dashboard
- [ ] Implement `app/erp/budgeting/page.tsx` (Module 09: Project Budgeting & Cost Control with baseline budget, real-time variance, and EVM).
- [ ] Implement `app/erp/contracts/page.tsx` (Module 10: Government Contract Management & CIDA 102/2024 IPC Engine with printable A4 certificate).
- [ ] Implement `app/erp/safety/page.tsx` (Module 11: Health, Safety & Compliance HSE with inspections, PPE, incidents, and toolbox talks).
- [ ] Upgrade `app/erp/audit/page.tsx` (Module 12: Central Document Vault & Immutable Cryptographic Audit Trail).
- [ ] Upgrade `app/erp/page.tsx` (Executive Command Hub with real-time company-wise and consolidated KPI rollups).

---

### Task 6: Database Seeder, Security & Production Verification
- [ ] Update `database/seed.js` with all multi-company tables and records in LKR.
- [ ] Execute `node database/seed.js` to seed the MySQL database.
- [ ] Run `npm run lint` to verify 0 errors and 0 warnings.
- [ ] Run `npm run build` to verify all 27+ routes compile cleanly.
- [ ] Run `npm audit` to guarantee 0 vulnerabilities.
