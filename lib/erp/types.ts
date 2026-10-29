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

export type LeadStage = 'NEW' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';

export interface CRMLead {
  id: string;
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

export type InvoiceStatus = 'PAID' | 'PENDING' | 'OVERDUE';

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number; // In LKR
  amount: number; // In LKR
}

export interface Invoice {
  id: string;
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
  code: string;
  name: string;
  client: string;
  location: string;
  budget: number; // In LKR
  spent: number; // In LKR
  progress: number; // Percentage
  phase: ProjectPhase;
  siteEngineer: string;
  startDate: string;
  targetCompletion: string;
  tasks: ProjectTask[];
  cidaClassification?: string;
  plannedValueLkr?: number;
  earnedValueLkr?: number;
  cpi?: number; // Cost Performance Index (EV / AC)
  spi?: number; // Schedule Performance Index (EV / PV)
  ladAmountPerDayLkr?: number; // Liquidated & Ascertained Damages in LKR
}

export type StockStatus = 'OPTIMAL' | 'LOW_STOCK' | 'CRITICAL';

export interface InventoryItem {
  id: string;
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

export type POStatus = 'PENDING' | 'APPROVED' | 'DISPATCHED' | 'FULFILLED';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  date: string;
  totalAmount: number; // In LKR
  status: POStatus;
  itemsCount: number;
  approvedBy?: string;
}

export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';

export interface Employee {
  id: string;
  empId: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  salary: number; // Monthly in LKR
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
  employeeName: string;
  department: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
}

export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type AuditModule =
  | 'AUTH'
  | 'FINANCE'
  | 'PROJECTS'
  | 'INVENTORY'
  | 'HR'
  | 'CRM'
  | 'SECURITY'
  | 'BOQ'
  | 'MACHINERY'
  | 'SITE_LOGS'
  | 'WEBSITE';

export interface AuditLog {
  id: string;
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
// Construction Domain Specialization Types
// =============================================================================

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
  nextServiceDate: string;
  status: MachineryStatus;
  telemetrySignal?: 'STRONG' | 'MODERATE' | 'OFFLINE';
}

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

export type QuotationStatus = 'DRAFT' | 'ISSUED' | 'ACCEPTED' | 'REVISED' | 'DECLINED';

export interface ConstructionQuotation {
  id: string;
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

export interface Subcontractor {
  id: string;
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
