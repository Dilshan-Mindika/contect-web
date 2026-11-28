export type CompanyId = 'COMP_A' | 'COMP_B';
export type ActiveCompany = 'COMP_A' | 'COMP_B' | 'CONSOLIDATED';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'FINANCE_DIRECTOR'
  | 'OPERATIONS_HEAD'
  | 'HR_MANAGER'
  | 'SALES_DIRECTOR'
  | 'PROJECT_ENGINEER'
  | 'QUANTITY_SURVEYOR'
  | 'SAFETY_ENGINEER'
  | 'PROJECT_DIRECTOR';

export type Permission =
  | 'view_financials'
  | 'manage_invoices'
  | 'manage_projects'
  | 'manage_inventory'
  | 'manage_employees'
  | 'manage_crm'
  | 'view_audit_logs'
  | 'admin_settings';

export interface ERPUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  department: string;
  avatar: string;
  permissions: Permission[];
}

// =============================================================================
// Module 01: Company & Administration Types
// =============================================================================

export interface DirectorRecord {
  id: string;
  name: string;
  designation: string;
  nic: string;
  isSignatory: boolean;
  signingLimitLkr: number;
  email: string;
  phone: string;
}

export interface BankAccountRecord {
  id: string;
  bankName: string;
  branch: string;
  accountNumber: string;
  accountType: 'CURRENT' | 'SAVINGS' | 'ESCROW';
  currency: 'LKR';
  balanceLkr: number;
  swiftCode?: string;
}

export interface DocumentSequenceRecord {
  module: 'PAYMENT_VOUCHER' | 'PURCHASE_ORDER' | 'GRN' | 'IPC' | 'INVOICE' | 'PROJECT';
  prefix: string; // e.g. "A-PV", "B-PV"
  nextNumber: number;
  format: string; // e.g. "{prefix}-{num:04d}"
}

export interface ApprovalRule {
  id: string;
  transactionType: 'PR' | 'PO' | 'PAYMENT_VOUCHER' | 'IPC' | 'SUBCONTRACT';
  minAmountLkr: number;
  maxAmountLkr: number;
  approverRole: UserRole;
  description: string;
}

export interface CompanyProfile {
  id: CompanyId;
  code: string;
  name: string;
  tradeName: string;
  regNumber: string;
  registeredAddress: string;
  incorporationDate: string;
  tinNumber: string;
  vatNumber: string;
  brExpiryDate: string;
  taxClearanceExpiryDate: string;
  cidaGrade: string;
  cidaRegNo: string;
  cidaExpiryDate: string;
  financialYearStart: string; // e.g. "04-01" (April 1st)
  financialYearEnd: string;   // e.g. "03-31" (March 31st)
  depreciationPolicy: 'STRAIGHT_LINE' | 'REDUCING_BALANCE';
  inventoryValuation: 'FIFO' | 'WEIGHTED_AVG';
  directors: DirectorRecord[];
  bankAccounts: BankAccountRecord[];
  documentSequences: DocumentSequenceRecord[];
  approvalRules: ApprovalRule[];
}

// =============================================================================
// Module 02: Project Management Types
// =============================================================================

export type ProjectPhase = 'DESIGN' | 'PILING' | 'FOUNDATION' | 'STRUCTURAL' | 'MEP_ENVELOPE' | 'INTERIOR' | 'HANDOVER';
export type TaskStatus = 'BACKLOG' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ProjectTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
}

export interface Project {
  id: string;
  companyId?: CompanyId;
  code: string;
  name: string;
  client: string;
  category?: 'GOVERNMENT' | 'PRIVATE' | 'SEMI_GOVT';
  location: string;
  budget: number; // In LKR
  spent: number; // In LKR
  progress: number; // Percentage
  phase: ProjectPhase;
  siteEngineer: string;
  projectManager?: string;
  startDate: string;
  targetCompletion: string;
  actualCompletion?: string;
  tasks: ProjectTask[];
  cidaClassification?: string;
  plannedValueLkr?: number;
  earnedValueLkr?: number;
  cpi?: number; // Cost Performance Index (EV / AC)
  spi?: number; // Schedule Performance Index (EV / PV)
  ladAmountPerDayLkr?: number; // Liquidated & Ascertained Damages in LKR
  retentionHeldLkr?: number;
  originalContractSumLkr?: number;
  approvedVariationsLkr?: number;
}

// =============================================================================
// Module 03: Accounting & Double-Entry Finance Types
// =============================================================================

export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

export interface GeneralLedgerAccount {
  id: string;
  code: string; // e.g. "1010", "2010", "4010", "5010"
  name: string;
  type: AccountType;
  companyId: CompanyId;
  balanceLkr: number;
  description?: string;
}

export interface JournalLine {
  accountId: string;
  accountCode: string;
  accountName: string;
  debitLkr: number;
  creditLkr: number;
  memo?: string;
  projectCode?: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: string; // e.g. "A-JV-0012"
  companyId: CompanyId;
  date: string;
  description: string;
  referenceType: 'MANUAL' | 'PAYMENT' | 'RECEIPT' | 'DEPRECIATION' | 'MATERIAL_ISSUE' | 'LABOUR_PAYROLL';
  referenceNo?: string;
  lines: JournalLine[];
  totalDebitLkr: number;
  totalCreditLkr: number;
  isPosted: boolean;
  postedAt?: string;
  postedBy?: string;
  isReversed?: boolean;
}

export interface CashBookEntry {
  id: string;
  companyId: CompanyId;
  date: string;
  voucherNo: string;
  type: 'RECEIPT' | 'PAYMENT';
  accountName: string;
  particulars: string;
  amountLkr: number;
  balanceLkr: number;
  paymentMode: 'CASH' | 'CHEQUE' | 'ONLINE_TRANSFER';
  projectCode?: string;
}

export type InvoiceStatus = 'PAID' | 'PENDING' | 'OVERDUE';

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number; // In LKR
  amount: number; // In LKR
}

export interface Invoice {
  id: string;
  companyId?: CompanyId;
  invoiceNumber: string;
  ipcNumber?: string; // Interim Payment Certificate #
  clientName: string;
  projectName: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number; // In LKR
  tax: number; // In LKR
  ssclTax?: number; // Social Security Contribution Levy (2.5%) in LKR
  retentionDeducted?: number; // Retention withheld (typically 5% - 10%) in LKR
  advanceRecovery?: number; // Advance mobilization recovery in LKR
  priceEscalation?: number; // CIDA formula price fluctuation in LKR
  total: number; // Net payable in LKR
  status: InvoiceStatus;
}

// =============================================================================
// Module 04: HR & Human Resource Management Types
// =============================================================================

export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';

export interface Employee {
  id: string;
  companyId?: CompanyId;
  empId: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  nic?: string;
  salary: number; // Basic Monthly in LKR
  fixedAllowancesLkr?: number;
  epfEmployeeLkr?: number; // 8%
  epfEmployerLkr?: number; // 12%
  etfEmployerLkr?: number; // 3%
  annualPackageLkr?: number; // Annual in LKR
  epfNo?: string;
  joinDate: string;
  status: EmployeeStatus;
  attendanceRate: number;
  tradeCertification?: string;
}

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type LeaveType = 'ANNUAL' | 'SICK' | 'MATERNITY' | 'EMERGENCY';

export interface LeaveRequest {
  id: string;
  companyId?: CompanyId;
  employeeName: string;
  department: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
}

// =============================================================================
// Module 05: Site Labour Management Types
// =============================================================================

export type LabourTrade =
  | 'MASON'
  | 'CARPENTER'
  | 'STEEL_FIXER'
  | 'BAR_BENDER'
  | 'HELPER'
  | 'ELECTRICIAN'
  | 'PLUMBER'
  | 'PAINTER'
  | 'MACHINE_OPERATOR';

export interface SiteLabourWorker {
  id: string;
  companyId: CompanyId;
  workerCode: string; // e.g. "LB-042"
  fullName: string;
  trade: LabourTrade;
  nic?: string;
  dailyWageRateLkr: number;
  otHourlyRateLkr: number;
  phone: string;
  assignedProjectCode: string;
  subcontractorGang?: string;
}

export interface DailyLabourMusterRoll {
  id: string;
  companyId: CompanyId;
  projectId: string;
  projectCode: string;
  date: string;
  supervisorName: string;
  engineerVerifiedBy?: string;
  isVerified: boolean;
  totalWorkersPresent: number;
  totalWageCostLkr: number;
  entries: {
    workerId: string;
    workerName: string;
    trade: LabourTrade;
    shiftDays: number; // 1.0, 0.5, etc.
    otHours: number;
    wageAmountLkr: number;
    advanceDeductionLkr: number;
  }[];
}

export interface LabourPayrollCycle {
  id: string;
  companyId: CompanyId;
  cyclePeriod: string; // e.g. "2026-11-01 to 2026-11-15 (Half-Month 1)"
  projectId: string;
  projectCode: string;
  totalGrossWagesLkr: number;
  totalAdvancesDeductedLkr: number;
  totalNetPayableLkr: number;
  status: 'DRAFT' | 'VERIFIED' | 'APPROVED' | 'DISBURSED';
  disbursedDate?: string;
}

// =============================================================================
// Module 06: Procurement & 3-Way Match Types
// =============================================================================

export interface PurchaseRequisition {
  id: string;
  prNumber: string; // e.g. "A-PR-0042"
  companyId: CompanyId;
  projectId: string;
  projectCode: string;
  requestedBy: string;
  requiredDate: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  estimatedCostLkr: number;
  budgetLineCode: string;
  status: 'PENDING' | 'APPROVED' | 'PO_ISSUED' | 'REJECTED';
}

export type POStatus = 'PENDING' | 'APPROVED' | 'DISPATCHED' | 'FULFILLED';

export interface PurchaseOrder {
  id: string;
  companyId?: CompanyId;
  poNumber: string;
  supplier: string;
  date: string;
  totalAmount: number; // In LKR
  status: POStatus;
  itemsCount: number;
  approvedBy?: string;
  prReference?: string;
  projectCode?: string;
}

export interface GoodsReceivedNote {
  id: string;
  grnNumber: string; // e.g. "A-GRN-0105"
  companyId: CompanyId;
  poNumber: string;
  projectId: string;
  supplierName: string;
  receivedDate: string;
  invoiceNumber?: string;
  inspectedBy: string;
  qualityPassed: boolean;
  itemsReceived: {
    itemSku: string;
    name: string;
    orderedQty: number;
    receivedQty: number;
    damagedQty: number;
    unit: string;
  }[];
  totalAcceptedValueLkr: number;
}

export interface ThreeWayMatchRecord {
  id: string;
  companyId: CompanyId;
  poNumber: string;
  poAmountLkr: number;
  grnNumber: string;
  grnAcceptedValueLkr: number;
  invoiceNumber: string;
  invoiceAmountLkr: number;
  varianceLkr: number;
  matchStatus: 'EXACT_MATCH' | 'WITHIN_TOLERANCE' | 'PRICE_VARIANCE' | 'QTY_VARIANCE';
  approvedForPayment: boolean;
}

// =============================================================================
// Module 07: Inventory & Multi-Store Management Types
// =============================================================================

export type StockStatus = 'OPTIMAL' | 'LOW_STOCK' | 'CRITICAL';

export interface InventoryItem {
  id: string;
  companyId?: CompanyId;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  unitCost: number; // In LKR
  warehouseLocation: string;
  supplier: string;
  status: StockStatus;
  millTestCertificateNo?: string;
  qualityStandard?: string; // e.g. SLS 375 / BS 4449
}

export interface WarehouseStore {
  id: string;
  companyId: CompanyId;
  storeCode: string; // e.g. "WH-CENTRAL", "ST-PORTCITY"
  name: string;
  storeType: 'CENTRAL_WAREHOUSE' | 'SITE_STORE';
  location: string;
  storekeeperName: string;
  totalValueLkr: number;
}

export interface MaterialIssueNote {
  id: string;
  minNumber: string; // e.g. "A-MIN-0092"
  companyId: CompanyId;
  storeCode: string;
  projectId: string;
  projectCode: string;
  issueDate: string;
  storekeeperName: string;
  receiverName: string;
  items: {
    itemSku: string;
    name: string;
    qtyIssued: number;
    unit: string;
    unitRateLkr: number;
    amountLkr: number;
  }[];
  totalMaterialCostLkr: number;
}

// =============================================================================
// Module 08: Machinery Telematics & Maintenance Types
// =============================================================================

export type MachineryCategory =
  | 'TOWER_CRANE'
  | 'EXCAVATOR'
  | 'BOOM_PUMP'
  | 'BULLDOZER'
  | 'GENERATOR'
  | 'SOIL_COMPACTOR'
  | 'TIPPER_TRUCK';

export type MachineryStatus = 'OPERATIONAL' | 'MAINTENANCE' | 'STANDBY' | 'REPAIR';

export interface MachineryFleet {
  id: string;
  companyId?: CompanyId;
  assetId: string;
  name: string;
  category: MachineryCategory;
  assignedSite: string;
  operatorName: string;
  fuelCapacityPct: number;
  fuelCapacityLiters?: number;
  fuelConsumptionRateLph?: number; // Liters per hour
  dailyHireRateLkr?: number; // In LKR/day
  operatingHours: number;
  idleHours?: number;
  nextServiceDate: string;
  status: MachineryStatus;
  telemetrySignal?: 'STRONG' | 'MODERATE' | 'OFFLINE';
  revenueLicenseExpiry?: string;
  insuranceExpiry?: string;
}

export interface MachineryFuelLog {
  id: string;
  machineryId: string;
  companyId: CompanyId;
  assetId: string;
  date: string;
  litersIssued: number;
  fuelRatePerLiterLkr: number; // e.g. 370
  totalFuelCostLkr: number;
  odometerOrHours: number;
  projectId: string;
}

// =============================================================================
// Module 09: Project Budgeting & Cost Control Types
// =============================================================================

export interface ProjectBudgetBaseline {
  id: string;
  projectId: string;
  projectCode: string;
  companyId: CompanyId;
  approvedDate: string;
  totalBaselineBudgetLkr: number;
  materialsBudgetLkr: number;
  labourBudgetLkr: number;
  machineryBudgetLkr: number;
  subcontractorBudgetLkr: number;
  siteOverheadBudgetLkr: number;
  actualMaterialsSpentLkr: number;
  actualLabourSpentLkr: number;
  actualMachinerySpentLkr: number;
  actualSubcontractSpentLkr: number;
  actualOverheadSpentLkr: number;
  committedCostLkr: number;
  forecastVarianceLkr: number;
}

// =============================================================================
// Module 10: Government Contract Management & CIDA Directive 102/2024 IPC Types
// =============================================================================

export interface GovernmentContractRecord {
  id: string;
  companyId: CompanyId;
  contractNumber: string; // e.g. "RDA/CE3/2025/08"
  tenderNumber: string;
  title: string;
  employerName: string; // e.g. "Road Development Authority (RDA)"
  cidaRegistrationGrade: string; // "CS2"
  originalContractSumLkr: number;
  approvedVariationsLkr: number;
  revisedContractSumLkr: number;
  bidBondBank: string;
  bidBondAmountLkr: number;
  bidBondExpiry: string;
  performanceSecurityBank: string;
  performanceSecurityAmountLkr: number;
  performanceSecurityExpiry: string;
  mobilizationAdvancePaidLkr: number;
  advanceRecoveryRatePct: number; // typically 15% - 20%
  retentionLimitPct: number; // typically 5%
  status: 'TENDER_ACTIVE' | 'AWARDED' | 'IN_EXECUTION' | 'HANDOVER' | 'DLP_PERIOD' | 'FINAL_SETTLED';
}

export interface CIDA102IPC {
  id: string;
  companyId: CompanyId;
  ipcNumber: string; // e.g. "A-IPC-007"
  contractNumber: string;
  projectName: string;
  employerName: string;
  contractorName: string;
  issueDate: string;
  periodTo: string;
  cumulativeWorksGrossLkr: number; // Line 1
  addBoqVariationsLkr: number;     // Line 2
  addNewStarRateVariationsLkr: number; // Line 3
  addPriceEscalationLkr: number;   // Line 4
  addMaterialsOnSiteLkr: number;   // Line 5 (80% advance)
  grossValuationLkr: number;       // Line 6 Subtotal
  lessRetentionDeductionLkr: number; // Line 7 (5%)
  lessAdvanceRecoveryLkr: number;  // Line 8
  lessLiquidatedDamagesLkr: number; // Line 9
  lessPreviousGrossCertifiedLkr: number; // Line 10
  netCertifiedExclusiveVatLkr: number; // Line 11
  ssclLevy2_5PctLkr: number;       // Statutory SSCL (2.5%)
  vat18PctLkr: number;             // Statutory VAT (18%)
  grandTotalCertifiedPayableLkr: number;
  status: 'SUBMITTED' | 'ENGINEER_CERTIFIED' | 'EMPLOYER_APPROVED' | 'DISBURSED';
}

// =============================================================================
// Module 11: Health, Safety & Compliance (HSE) Types
// =============================================================================

export interface SafetyInspectionChecklist {
  id: string;
  companyId: CompanyId;
  projectId: string;
  projectCode: string;
  inspectionDate: string;
  inspectorName: string;
  scorePct: number;
  scaffoldingStatus: 'SAFE_GREEN_TAG' | 'YELLOW_WARNING' | 'RED_UNSAFE';
  electricalEarthingStatus: 'COMPLIANT' | 'NEEDS_ATTENTION';
  ppeCompliancePct: number;
  excavationShoringStatus: 'COMPLIANT' | 'OBSERVATION';
  openCorrectiveActionsCount: number;
}

export interface PPEIssueRecord {
  id: string;
  companyId: CompanyId;
  projectId: string;
  workerName: string;
  trade: string;
  itemType: 'SAFETY_HELMET' | 'STEEL_TOE_BOOTS' | 'HIGH_VIS_VEST' | 'FALL_HARNESS' | 'SAFETY_GOGGLES' | 'HEAVY_GLOVES';
  serialOrTagNo: string;
  issueDate: string;
  acknowledgedByWorker: boolean;
}

export interface SafetyIncidentLog {
  id: string;
  companyId: CompanyId;
  projectId: string;
  projectCode: string;
  incidentDate: string;
  severity: 'NEAR_MISS' | 'FIRST_AID' | 'MEDICAL_TREATMENT' | 'LOST_TIME_INJURY_LTIR';
  location: string;
  description: string;
  injuredPerson?: string;
  rootCause: string;
  immediateCorrectiveAction: string;
  managementNotified: boolean;
}

// =============================================================================
// Module 12: Central Document Vault & Immutable Audit Trail Types
// =============================================================================

export type DocumentCategory =
  | 'CONTRACT'
  | 'INVOICE'
  | 'PAYMENT_VOUCHER'
  | 'JOURNAL_VOUCHER'
  | 'BANK_STATEMENT'
  | 'PURCHASE_ORDER'
  | 'EMPLOYEE_FILE'
  | 'PAYROLL_SHEET'
  | 'TAX_RETURN'
  | 'CIDA_IPC';

export interface VaultDocument {
  id: string;
  companyId: CompanyId;
  documentRefNumber: string;
  title: string;
  category: DocumentCategory;
  relatedEntityId?: string; // Project ID, Invoice ID, Employee ID
  fileFormat: 'PDF' | 'EXCEL' | 'WORD' | 'IMAGE';
  fileSizeKb: number;
  uploadDate: string;
  uploadedBy: string;
  tags: string[];
  isConfidential: boolean;
}

export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type AuditModule =
  | 'AUTH'
  | 'SYSTEM'
  | 'COMPANY'
  | 'FINANCE'
  | 'PROJECTS'
  | 'INVENTORY'
  | 'PROCUREMENT'
  | 'HR'
  | 'SITE_LABOUR'
  | 'CRM'
  | 'SECURITY'
  | 'BOQ'
  | 'MACHINERY'
  | 'COST_CONTROL'
  | 'CONTRACTS'
  | 'SAFETY'
  | 'DOCUMENTS'
  | 'SITE_LOGS'
  | 'WEBSITE';

export interface AuditLog {
  id: string;
  companyId?: CompanyId;
  timestamp: string;
  actorName: string;
  actorEmail: string;
  role: UserRole;
  action: string;
  module: AuditModule;
  details: string;
  ipAddress: string;
  severity: AuditSeverity;
}

// =============================================================================
// Site Telemetry & BOQ Construction Types
// =============================================================================

export type OSHAStatus = 'COMPLIANT' | 'OBSERVATION' | 'BREACH';

export interface ConcreteCubeTest {
  id: string;
  sampleCode: string;
  pourLocation: string;
  concreteGrade: 'G25' | 'G30' | 'G35' | 'G40' | 'G50' | 'SCC';
  castDate: string;
  testAgeDays: 7 | 14 | 28;
  targetStrengthMpa: number;
  achievedStrengthMpa: number;
  status: 'PASS' | 'PENDING' | 'FAIL';
  testedByLab: string;
}

export interface SiteDailyLog {
  id: string;
  companyId?: CompanyId;
  projectId: string;
  projectName: string;
  logDate: string;
  weatherSummary: string;
  ambientTempC: number;
  rainfallHours?: number;
  workforceCount: number;
  skilledWorkersCount?: number;
  unskilledWorkersCount?: number;
  concretePouredM3: number;
  slumpTestMm: number;
  safetyIncidents: number;
  oshaStatus: OSHAStatus;
  toolboxTalkTopic?: string;
  supervisorNotes: string;
  supervisorName: string;
  cubeTests?: ConcreteCubeTest[];
}

export type BOQSection =
  | 'PRELIMINARIES'
  | 'EARTHWORK'
  | 'SUBSTRUCTURE'
  | 'SUPERSTRUCTURE'
  | 'MEP'
  | 'FACADE'
  | 'FINISHES'
  | 'INFRASTRUCTURE';

export interface BOQItem {
  id: string;
  itemCode: string;
  section: BOQSection;
  description: string;
  unit: string;
  quantity: number;
  unitRate: number; // In LKR
  totalAmount: number; // In LKR
  laborPct?: number; // Rate analysis %
  materialPct?: number;
  equipmentPct?: number;
  overheadProfitPct?: number;
}

export type QuotationStatus = 'DRAFT' | 'ISSUED' | 'ACCEPTED' | 'REVISED' | 'DECLINED';

export interface ConstructionQuotation {
  id: string;
  companyId?: CompanyId;
  quoteNumber: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  projectScope: string;
  validUntil: string;
  boqItems: BOQItem[];
  subtotal: number; // In LKR
  ssclTax?: number; // SSCL @ 2.5% in LKR
  taxVat: number; // VAT @ 18% in LKR
  retentionPct: number; // Typically 5% or 10%
  retentionAmount?: number; // In LKR
  advancePaymentPct?: number; // Typically 20%
  defectLiabilityMonths?: number; // Typically 12-24 months
  grandTotal: number; // Total contract sum in LKR
  status: QuotationStatus;
  termsAndConditions: string;
  createdDate: string;
  cidaGrading?: string;
}

export type LeadStage = 'NEW' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';

export interface CRMLead {
  id: string;
  companyId?: CompanyId;
  clientName: string;
  company: string;
  projectType: string;
  estimatedValue: number; // In LKR
  stage: LeadStage;
  probability: number;
  contactEmail: string;
  phone: string;
  assignedTo: string;
  lastUpdated: string;
  notes: string;
  cidaCategory?: string;
  tenderDeadline?: string;
}

export interface Subcontractor {
  id: string;
  companyId?: CompanyId;
  tradeName: string;
  specialty: string;
  assignedProject: string;
  safetyRating: number;
  insuranceExpiry: string;
  contractValue: number; // In LKR
  status: 'ACTIVE' | 'PENDING_AUDIT' | 'SUSPENDED';
  cidaGrade?: string;
  retentionHeldLkr?: number;
}

export interface WebsiteShowcaseProject {
  id: string;
  title: string;
  category: string;
  location: string;
  imageUrl: string;
  description: string;
  completionYear: string;
  featured: boolean;
  contractValueLkr?: number;
  cidaRating?: string;
}

export interface WebsiteInquiry {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
  message: string;
  date: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED_TO_QUOTE' | 'ARCHIVED';
}
