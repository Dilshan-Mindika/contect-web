export type UserRole =
  | 'SUPER_ADMIN'
  | 'FINANCE_DIRECTOR'
  | 'OPERATIONS_HEAD'
  | 'HR_MANAGER'
  | 'SALES_DIRECTOR'
  | 'PROJECT_ENGINEER';

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
  estimatedValue: number;
  stage: LeadStage;
  probability: number;
  contactEmail: string;
  phone: string;
  assignedTo: string;
  lastUpdated: string;
  notes: string;
}

export type InvoiceStatus = 'PAID' | 'PENDING' | 'OVERDUE';

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  projectName: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
}

export type ProjectPhase = 'DESIGN' | 'FOUNDATION' | 'STRUCTURAL' | 'INTERIOR' | 'HANDOVER';
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
  budget: number;
  spent: number;
  progress: number;
  phase: ProjectPhase;
  siteEngineer: string;
  startDate: string;
  targetCompletion: string;
  tasks: ProjectTask[];
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
  unitCost: number;
  warehouseLocation: string;
  supplier: string;
  status: StockStatus;
}

export type POStatus = 'PENDING' | 'APPROVED' | 'DISPATCHED' | 'FULFILLED';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  date: string;
  totalAmount: number;
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
  salary: number;
  joinDate: string;
  status: EmployeeStatus;
  attendanceRate: number;
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
export type AuditModule = 'AUTH' | 'FINANCE' | 'PROJECTS' | 'INVENTORY' | 'HR' | 'CRM' | 'SECURITY';

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

