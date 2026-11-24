"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ERPUser,
  CompanyId,
  ActiveCompany,
  CompanyProfile,
  CRMLead,
  Invoice,
  Project,
  InventoryItem,
  PurchaseOrder,
  Employee,
  LeaveRequest,
  AuditLog,
  LeadStage,
  InvoiceStatus,
  TaskStatus,
  POStatus,
  LeaveStatus,
  AuditModule,
  AuditSeverity,
  MachineryFleet,
  MachineryStatus,
  SiteDailyLog,
  ConstructionQuotation,
  QuotationStatus,
  Subcontractor,
  WebsiteShowcaseProject,
  WebsiteInquiry,
  GeneralLedgerAccount,
  JournalEntry,
  CashBookEntry,
  SiteLabourWorker,
  DailyLabourMusterRoll,
  LabourPayrollCycle,
  PurchaseRequisition,
  GoodsReceivedNote,
  ThreeWayMatchRecord,
  WarehouseStore,
  MaterialIssueNote,
  MachineryFuelLog,
  ProjectBudgetBaseline,
  GovernmentContractRecord,
  CIDA102IPC,
  SafetyInspectionChecklist,
  PPEIssueRecord,
  SafetyIncidentLog,
  VaultDocument,
} from './types';
import { ENTERPRISE_USERS } from './auth';
import {
  INITIAL_COMPANIES,
  INITIAL_GL_ACCOUNTS,
  INITIAL_JOURNALS,
  INITIAL_CASH_BOOK,
  INITIAL_LABOUR_WORKERS,
  INITIAL_MUSTER_ROLLS,
  INITIAL_LABOUR_PAYROLLS,
  INITIAL_PURCHASE_REQS,
  INITIAL_GRNS,
  INITIAL_THREE_WAY_MATCH,
  INITIAL_STORES,
  INITIAL_MINS,
  INITIAL_FUEL_LOGS,
  INITIAL_BUDGET_BASELINES,
  INITIAL_GOVT_CONTRACTS,
  INITIAL_CIDA_IPCS,
  INITIAL_SAFETY_INSPECTIONS,
  INITIAL_PPE_RECORDS,
  INITIAL_SAFETY_INCIDENTS,
  INITIAL_VAULT_DOCUMENTS,
  INITIAL_LEADS,
  INITIAL_INVOICES,
  INITIAL_PROJECTS,
  INITIAL_INVENTORY,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_EMPLOYEES,
  INITIAL_LEAVES,
  INITIAL_AUDIT_LOGS,
  INITIAL_MACHINERY,
  INITIAL_SITE_LOGS,
  INITIAL_QUOTATIONS,
  INITIAL_SUBCONTRACTORS,
  INITIAL_WEBSITE_PROJECTS,
  INITIAL_WEBSITE_INQUIRIES,
} from './store';

interface ERPContextType {
  user: ERPUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchPersona: (email: string) => Promise<void>;

  // Multi-Company State
  activeCompany: ActiveCompany;
  setActiveCompany: (company: ActiveCompany) => void;
  companies: CompanyProfile[];
  updateCompanyProfile: (companyId: CompanyId, updates: Partial<CompanyProfile>) => void;
  getNextDocNumber: (companyId: CompanyId, module: string) => string;

  // Module 01 to 12 Core State
  leads: CRMLead[];
  invoices: Invoice[];
  projects: Project[];
  inventory: InventoryItem[];
  purchaseOrders: PurchaseOrder[];
  employees: Employee[];
  leaves: LeaveRequest[];
  auditLogs: AuditLog[];
  machinery: MachineryFleet[];
  siteLogs: SiteDailyLog[];
  quotations: ConstructionQuotation[];
  subcontractors: Subcontractor[];
  websiteProjects: WebsiteShowcaseProject[];
  websiteInquiries: WebsiteInquiry[];

  // Finance & Accounting (Module 03)
  glAccounts: GeneralLedgerAccount[];
  journalEntries: JournalEntry[];
  cashBook: CashBookEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'entryNumber' | 'isPosted'>) => { success: boolean; error?: string };
  postJournalEntry: (id: string) => void;
  addCashBookEntry: (entry: Omit<CashBookEntry, 'id' | 'balanceLkr'>) => void;

  // Site Labour Management (Module 05)
  labourWorkers: SiteLabourWorker[];
  musterRolls: DailyLabourMusterRoll[];
  labourPayrolls: LabourPayrollCycle[];
  addLabourWorker: (worker: Omit<SiteLabourWorker, 'id' | 'workerCode'>) => void;
  addMusterRoll: (muster: Omit<DailyLabourMusterRoll, 'id'>) => void;
  verifyMusterRoll: (id: string, verifierName: string) => void;

  // Procurement & Purchasing (Module 06)
  purchaseRequisitions: PurchaseRequisition[];
  goodsReceivedNotes: GoodsReceivedNote[];
  threeWayMatches: ThreeWayMatchRecord[];
  addPurchaseRequisition: (pr: Omit<PurchaseRequisition, 'id' | 'prNumber'>) => void;
  approvePurchaseRequisition: (id: string) => void;
  addGoodsReceivedNote: (grn: Omit<GoodsReceivedNote, 'id' | 'grnNumber'>) => void;

  // Inventory & Stores (Module 07)
  stores: WarehouseStore[];
  materialIssueNotes: MaterialIssueNote[];
  addMaterialIssueNote: (min: Omit<MaterialIssueNote, 'id' | 'minNumber'>) => void;

  // Machinery & Telematics (Module 08)
  fuelLogs: MachineryFuelLog[];
  addFuelLog: (log: Omit<MachineryFuelLog, 'id'>) => void;

  // Budgeting & Cost Control (Module 09)
  budgetBaselines: ProjectBudgetBaseline[];

  // Government Contracts & CIDA Directive 102/2024 IPC Engine (Module 10)
  govtContracts: GovernmentContractRecord[];
  cidaIpcs: CIDA102IPC[];
  addCidaIpc: (ipc: Omit<CIDA102IPC, 'id' | 'ipcNumber'>) => void;
  updateCidaIpcStatus: (id: string, status: CIDA102IPC['status']) => void;

  // HSE Safety (Module 11)
  safetyInspections: SafetyInspectionChecklist[];
  ppeRecords: PPEIssueRecord[];
  safetyIncidents: SafetyIncidentLog[];
  addSafetyInspection: (inspection: Omit<SafetyInspectionChecklist, 'id'>) => void;
  addSafetyIncident: (incident: Omit<SafetyIncidentLog, 'id'>) => void;

  // Central Vault & Audit (Module 12)
  vaultDocuments: VaultDocument[];
  addVaultDocument: (doc: Omit<VaultDocument, 'id'>) => void;

  // Basic Entity Mutations
  addLead: (lead: Omit<CRMLead, 'id' | 'lastUpdated'>) => void;
  updateLeadStage: (id: string, stage: LeadStage) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  addProject: (project: Omit<Project, 'id' | 'code' | 'tasks'>) => void;
  updateTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => void;
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'date'>) => void;
  updatePOStatus: (id: string, status: POStatus) => void;
  adjustStock: (id: string, quantityDelta: number) => void;
  updateLeaveStatus: (id: string, status: LeaveStatus) => void;
  addEmployee: (employee: Omit<Employee, 'id' | 'empId'>) => void;
  addQuotation: (quotation: Omit<ConstructionQuotation, 'id' | 'quoteNumber' | 'createdDate'>) => void;
  updateQuotationStatus: (id: string, status: QuotationStatus) => void;
  addSiteDailyLog: (log: Omit<SiteDailyLog, 'id'>) => void;
  updateMachineryStatus: (id: string, status: MachineryStatus) => void;
  addWebsiteProject: (project: Omit<WebsiteShowcaseProject, 'id'>) => void;
  deleteWebsiteProject: (id: string) => void;
  updateInquiryStatus: (id: string, status: WebsiteInquiry['status']) => void;
  sendQuotationEmailAction: (quotationId: string) => Promise<{ success: boolean; simulated?: boolean; message?: string }>;
  logAuditEvent: (action: string, module: AuditModule, details: string, severity?: AuditSeverity, companyId?: CompanyId) => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export function ERPProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ERPUser | null>(ENTERPRISE_USERS['admin@contec.com']);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Active Company Selection
  const [activeCompany, setActiveCompany] = useState<ActiveCompany>('COMP_A');
  const [companies, setCompanies] = useState<CompanyProfile[]>(INITIAL_COMPANIES);

  // Core Data States
  const [leads, setLeads] = useState<CRMLead[]>(INITIAL_LEADS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(INITIAL_LEAVES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Construction Specialized Data States
  const [machinery, setMachinery] = useState<MachineryFleet[]>(INITIAL_MACHINERY);
  const [siteLogs, setSiteLogs] = useState<SiteDailyLog[]>(INITIAL_SITE_LOGS);
  const [quotations, setQuotations] = useState<ConstructionQuotation[]>(INITIAL_QUOTATIONS);
  const [subcontractors] = useState<Subcontractor[]>(INITIAL_SUBCONTRACTORS);
  const [websiteProjects, setWebsiteProjects] = useState<WebsiteShowcaseProject[]>(INITIAL_WEBSITE_PROJECTS);
  const [websiteInquiries, setWebsiteInquiries] = useState<WebsiteInquiry[]>(INITIAL_WEBSITE_INQUIRIES);

  // 12-Module Sub-State
  const [glAccounts] = useState<GeneralLedgerAccount[]>(INITIAL_GL_ACCOUNTS);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(INITIAL_JOURNALS);
  const [cashBook, setCashBook] = useState<CashBookEntry[]>(INITIAL_CASH_BOOK);
  const [labourWorkers, setLabourWorkers] = useState<SiteLabourWorker[]>(INITIAL_LABOUR_WORKERS);
  const [musterRolls, setMusterRolls] = useState<DailyLabourMusterRoll[]>(INITIAL_MUSTER_ROLLS);
  const [labourPayrolls] = useState<LabourPayrollCycle[]>(INITIAL_LABOUR_PAYROLLS);
  const [purchaseRequisitions, setPurchaseRequisitions] = useState<PurchaseRequisition[]>(INITIAL_PURCHASE_REQS);
  const [goodsReceivedNotes, setGoodsReceivedNotes] = useState<GoodsReceivedNote[]>(INITIAL_GRNS);
  const [threeWayMatches] = useState<ThreeWayMatchRecord[]>(INITIAL_THREE_WAY_MATCH);
  const [stores] = useState<WarehouseStore[]>(INITIAL_STORES);
  const [materialIssueNotes, setMaterialIssueNotes] = useState<MaterialIssueNote[]>(INITIAL_MINS);
  const [fuelLogs, setFuelLogs] = useState<MachineryFuelLog[]>(INITIAL_FUEL_LOGS);
  const [budgetBaselines] = useState<ProjectBudgetBaseline[]>(INITIAL_BUDGET_BASELINES);
  const [govtContracts] = useState<GovernmentContractRecord[]>(INITIAL_GOVT_CONTRACTS);
  const [cidaIpcs, setCidaIpcs] = useState<CIDA102IPC[]>(INITIAL_CIDA_IPCS);
  const [safetyInspections, setSafetyInspections] = useState<SafetyInspectionChecklist[]>(INITIAL_SAFETY_INSPECTIONS);
  const [ppeRecords] = useState<PPEIssueRecord[]>(INITIAL_PPE_RECORDS);
  const [safetyIncidents, setSafetyIncidents] = useState<SafetyIncidentLog[]>(INITIAL_SAFETY_INCIDENTS);
  const [vaultDocuments, setVaultDocuments] = useState<VaultDocument[]>(INITIAL_VAULT_DOCUMENTS);

  // Check existing session on mount and hydrate live MySQL ERP data
  useEffect(() => {
    async function hydrateErpData() {
      try {
        const dataRes = await fetch('/api/erp/data');
        if (dataRes.ok) {
          const payload = await dataRes.json();
          if (payload.success && payload.data) {
            if (payload.data.projects?.length) setProjects(payload.data.projects);
            if (payload.data.invoices?.length) setInvoices(payload.data.invoices);
            if (payload.data.websiteInquiries?.length) setWebsiteInquiries(payload.data.websiteInquiries);
            if (payload.data.inventory?.length) setInventory(payload.data.inventory);
            if (payload.data.auditLogs?.length) setAuditLogs(payload.data.auditLogs);
          }
        }
      } catch {
        // Fallback to initial seeded store if offline
      }
    }

    async function initAuth() {
      try {
        const res = await fetch('/api/erp/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
            await hydrateErpData();
          }
        } else {
          const storedToken = localStorage.getItem('contec_erp_token');
          const storedUser = localStorage.getItem('contec_erp_user');
          if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            await hydrateErpData();
          } else {
            // Default active staff session for seamless dashboard access
            setUser(ENTERPRISE_USERS['admin@contec.com']);
          }
        }
      } catch (err) {
        console.error('Session verification error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/erp/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Authentication rejected' };
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('contec_erp_token', data.token);
      localStorage.setItem('contec_erp_user', JSON.stringify(data.user));
      logAuditEvent('LOGIN_SUCCESS', 'AUTH', `User logged in: ${data.user.email}`, 'INFO');
      return { success: true };
    } catch {
      return { success: false, error: 'Network failure during authentication' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/erp/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout network notice:', e);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('contec_erp_token');
    localStorage.removeItem('contec_erp_user');
  };

  const switchPersona = async (email: string) => {
    const target = ENTERPRISE_USERS[email];
    if (target) {
      await login(email, target.passwordHash);
    }
  };

  const logAuditEvent = (
    action: string,
    module: AuditModule,
    details: string,
    severity: AuditSeverity = 'INFO',
    companyId?: CompanyId
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      companyId: companyId || (activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany),
      timestamp: new Date().toISOString(),
      actorName: user?.name || 'Automated Cryptographic Agent',
      actorEmail: user?.email || 'system@contec.lk',
      role: user?.role || 'SUPER_ADMIN',
      action,
      module,
      details,
      ipAddress: '127.0.0.1 (Local Verified Node)',
      severity,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const updateCompanyProfile = (companyId: CompanyId, updates: Partial<CompanyProfile>) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, ...updates } : c))
    );
    logAuditEvent('COMPANY_PROFILE_UPDATED', 'COMPANY', `Updated company profile: ${companyId}`);
  };

  const getNextDocNumber = (companyId: CompanyId, module: string): string => {
    const comp = companies.find((c) => c.id === companyId) || companies[0];
    const seq = comp.documentSequences.find((s) => s.module === module);
    if (seq) {
      const num = seq.nextNumber;
      seq.nextNumber += 1;
      return `${seq.prefix}-${num.toString().padStart(4, '0')}`;
    }
    return `${companyId === 'COMP_A' ? 'A' : 'B'}-${module.slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;
  };

  // Module 03: Finance & Double-Entry Ledger
  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'entryNumber' | 'isPosted'>) => {
    const totalDebit = entry.lines.reduce((acc, l) => acc + (Number(l.debitLkr) || 0), 0);
    const totalCredit = entry.lines.reduce((acc, l) => acc + (Number(l.creditLkr) || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return { success: false, error: `Double-entry balance check failed! Total Debits (Rs. ${totalDebit.toLocaleString()}) must equal Total Credits (Rs. ${totalCredit.toLocaleString()}).` };
    }

    const company = entry.companyId || (activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany);
    const entryNumber = `${company === 'COMP_A' ? 'A' : 'B'}-JV-${Math.floor(100 + Math.random() * 900)}`;

    const newJv: JournalEntry = {
      ...entry,
      id: `jv-${Date.now()}`,
      entryNumber,
      companyId: company,
      totalDebitLkr: totalDebit,
      totalCreditLkr: totalCredit,
      isPosted: false,
    };

    setJournalEntries((prev) => [newJv, ...prev]);
    logAuditEvent('JOURNAL_ENTRY_CREATED', 'FINANCE', `Created JV ${entryNumber}: ${entry.description}`, 'INFO', company);
    return { success: true };
  };

  const postJournalEntry = (id: string) => {
    setJournalEntries((prev) =>
      prev.map((jv) =>
        jv.id === id
          ? { ...jv, isPosted: true, postedAt: new Date().toISOString(), postedBy: user?.name || 'Arthur Sterling (CFO)' }
          : jv
      )
    );
    logAuditEvent('JOURNAL_ENTRY_POSTED', 'FINANCE', `Posted JV ${id} permanently to General Ledger`, 'CRITICAL');
  };

  const addCashBookEntry = (entry: Omit<CashBookEntry, 'id' | 'balanceLkr'>) => {
    const company = entry.companyId || (activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany);
    const lastBalance = cashBook.filter((c) => c.companyId === company)[0]?.balanceLkr || 150000000;
    const delta = entry.type === 'RECEIPT' ? entry.amountLkr : -entry.amountLkr;
    const newBal = lastBalance + delta;

    const newCb: CashBookEntry = {
      ...entry,
      id: `cb-${Date.now()}`,
      companyId: company,
      balanceLkr: newBal,
    };
    setCashBook((prev) => [newCb, ...prev]);
    logAuditEvent('CASH_BOOK_ENTRY', 'FINANCE', `${entry.type} of Rs. ${entry.amountLkr.toLocaleString()} on ${entry.voucherNo}`, 'INFO', company);
  };

  // Module 05: Site Labour
  const addLabourWorker = (worker: Omit<SiteLabourWorker, 'id' | 'workerCode'>) => {
    const company = worker.companyId || (activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany);
    const newWorker: SiteLabourWorker = {
      ...worker,
      id: `lw-${Date.now()}`,
      companyId: company,
      workerCode: `LB-${company === 'COMP_A' ? 'A' : 'B'}-${Math.floor(100 + Math.random() * 900)}`,
    };
    setLabourWorkers((prev) => [newWorker, ...prev]);
    logAuditEvent('LABOUR_WORKER_REGISTERED', 'SITE_LABOUR', `Enrolled worker ${newWorker.fullName} (${newWorker.trade})`);
  };

  const addMusterRoll = (muster: Omit<DailyLabourMusterRoll, 'id'>) => {
    const newMuster: DailyLabourMusterRoll = {
      ...muster,
      id: `mr-${Date.now()}`,
    };
    setMusterRolls((prev) => [newMuster, ...prev]);
    logAuditEvent('MUSTER_ROLL_LOGGED', 'SITE_LABOUR', `Filed site muster roll for ${muster.projectCode} on ${muster.date}`);
  };

  const verifyMusterRoll = (id: string, verifierName: string) => {
    setMusterRolls((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, isVerified: true, engineerVerifiedBy: verifierName } : m
      )
    );
    logAuditEvent('MUSTER_ROLL_VERIFIED', 'SITE_LABOUR', `Engineer verified muster ${id}`);
  };

  // Module 06: Procurement
  const addPurchaseRequisition = (pr: Omit<PurchaseRequisition, 'id' | 'prNumber'>) => {
    const company = pr.companyId || (activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany);
    const prNumber = `${company === 'COMP_A' ? 'A' : 'B'}-PR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPr: PurchaseRequisition = {
      ...pr,
      id: `pr-${Date.now()}`,
      prNumber,
      companyId: company,
    };
    setPurchaseRequisitions((prev) => [newPr, ...prev]);
    logAuditEvent('PURCHASE_REQ_CREATED', 'PROCUREMENT', `Created PR ${prNumber} for ${pr.itemName}`);
  };

  const approvePurchaseRequisition = (id: string) => {
    setPurchaseRequisitions((prev) =>
      prev.map((pr) => (pr.id === id ? { ...pr, status: 'APPROVED' } : pr))
    );
    logAuditEvent('PURCHASE_REQ_APPROVED', 'PROCUREMENT', `Approved PR ${id}`);
  };

  const addGoodsReceivedNote = (grn: Omit<GoodsReceivedNote, 'id' | 'grnNumber'>) => {
    const company = grn.companyId || (activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany);
    const grnNumber = `${company === 'COMP_A' ? 'A' : 'B'}-GRN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newGrn: GoodsReceivedNote = {
      ...grn,
      id: `grn-${Date.now()}`,
      grnNumber,
      companyId: company,
    };
    setGoodsReceivedNotes((prev) => [newGrn, ...prev]);
    logAuditEvent('GRN_ISSUED', 'PROCUREMENT', `Verified and issued ${grnNumber} for ${grn.poNumber}`);
  };

  // Module 07: Inventory
  const addMaterialIssueNote = (min: Omit<MaterialIssueNote, 'id' | 'minNumber'>) => {
    const company = min.companyId || (activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany);
    const minNumber = `${company === 'COMP_A' ? 'A' : 'B'}-MIN-${Math.floor(100 + Math.random() * 900)}`;
    const newMin: MaterialIssueNote = {
      ...min,
      id: `min-${Date.now()}`,
      minNumber,
      companyId: company,
    };
    setMaterialIssueNotes((prev) => [newMin, ...prev]);

    // Also deduct stock from inventory
    min.items.forEach((item) => {
      setInventory((prev) =>
        prev.map((inv) =>
          inv.sku === item.itemSku
            ? { ...inv, quantity: Math.max(0, inv.quantity - item.qtyIssued) }
            : inv
        )
      );
    });

    logAuditEvent('MATERIAL_ISSUED', 'INVENTORY', `Issued MIN ${minNumber} to project ${min.projectCode}`);
  };

  // Module 08: Machinery
  const addFuelLog = (log: Omit<MachineryFuelLog, 'id'>) => {
    const newLog: MachineryFuelLog = {
      ...log,
      id: `fl-${Date.now()}`,
    };
    setFuelLogs((prev) => [newLog, ...prev]);
    logAuditEvent('FUEL_LOGGED', 'MACHINERY', `Discharged ${log.litersIssued}L fuel to asset ${log.assetId}`);
  };

  // Module 10: Government Contracts & CIDA 102/2024 IPC Engine
  const addCidaIpc = (ipc: Omit<CIDA102IPC, 'id' | 'ipcNumber'>) => {
    const company = ipc.companyId || (activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany);
    const ipcNumber = `${company === 'COMP_A' ? 'A' : 'B'}-IPC-${Math.floor(10 + Math.random() * 90)}`;
    const newIpc: CIDA102IPC = {
      ...ipc,
      id: `cipc-${Date.now()}`,
      ipcNumber,
      companyId: company,
    };
    setCidaIpcs((prev) => [newIpc, ...prev]);
    logAuditEvent('CIDA_IPC_GENERATED', 'CONTRACTS', `Generated CIDA Directive 102/2024 IPC: ${ipcNumber}`);
  };

  const updateCidaIpcStatus = (id: string, status: CIDA102IPC['status']) => {
    setCidaIpcs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    logAuditEvent('CIDA_IPC_STATUS_UPDATED', 'CONTRACTS', `CIDA IPC ${id} updated to ${status}`);
  };

  // Module 11: HSE Safety
  const addSafetyInspection = (inspection: Omit<SafetyInspectionChecklist, 'id'>) => {
    const newInspection: SafetyInspectionChecklist = {
      ...inspection,
      id: `si-${Date.now()}`,
    };
    setSafetyInspections((prev) => [newInspection, ...prev]);
    logAuditEvent('SAFETY_INSPECTION_FILED', 'SAFETY', `Completed HSE Inspection for ${inspection.projectCode} (Score: ${inspection.scorePct}%)`);
  };

  const addSafetyIncident = (incident: Omit<SafetyIncidentLog, 'id'>) => {
    const newIncident: SafetyIncidentLog = {
      ...incident,
      id: `inc-${Date.now()}`,
    };
    setSafetyIncidents((prev) => [newIncident, ...prev]);
    logAuditEvent('SAFETY_INCIDENT_REPORTED', 'SAFETY', `CRITICAL HSE Alert: ${incident.severity} at ${incident.location}`, 'CRITICAL');
  };

  // Module 12: Central Vault
  const addVaultDocument = (doc: Omit<VaultDocument, 'id'>) => {
    const newDoc: VaultDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
    };
    setVaultDocuments((prev) => [newDoc, ...prev]);
    logAuditEvent('DOCUMENT_ARCHIVED', 'DOCUMENTS', `Archived document ${doc.documentRefNumber}: ${doc.title}`);
  };

  // Existing Entity Mutators
  const addLead = (leadData: Omit<CRMLead, 'id' | 'lastUpdated'>) => {
    const newLead: CRMLead = {
      ...leadData,
      id: `lead-${Date.now().toString().slice(-4)}`,
      companyId: activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setLeads((prev) => [newLead, ...prev]);
    logAuditEvent('LEAD_CREATED', 'CRM', `Created tender lead for: ${newLead.clientName} (${newLead.projectType})`);
  };

  const updateLeadStage = (id: string, stage: LeadStage) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, stage, lastUpdated: new Date().toISOString().split('T')[0] } : l
      )
    );
    logAuditEvent('LEAD_STAGE_UPDATED', 'CRM', `Lead ${id} advanced to stage: ${stage}`);
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const company = activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany;
    const invNumber = `${company === 'COMP_A' ? 'A' : 'B'}-INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv-${Date.now().toString().slice(-4)}`,
      companyId: company,
      invoiceNumber: invNumber,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    logAuditEvent('INVOICE_GENERATED', 'FINANCE', `Issued invoice ${newInvoice.invoiceNumber} to ${newInvoice.clientName}`);
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status } : inv))
    );
    fetch('/api/erp/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'UPDATE_INVOICE_STATUS', payload: { id, status } }),
    }).catch(() => {});
    logAuditEvent('INVOICE_STATUS_UPDATED', 'FINANCE', `Invoice ${id} marked as ${status}`);
  };

  const addProject = (projectData: Omit<Project, 'id' | 'code' | 'tasks'>) => {
    const company = activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany;
    const code = `${company === 'COMP_A' ? 'A' : 'B'}-PRJ-${Math.floor(100 + Math.random() * 900)}`;
    const newProject: Project = {
      ...projectData,
      id: `prj-${Date.now().toString().slice(-4)}`,
      companyId: company,
      code,
      tasks: [],
    };
    setProjects((prev) => [newProject, ...prev]);
    logAuditEvent('PROJECT_REGISTERED', 'PROJECTS', `Registered site project ${newProject.name} (${newProject.code})`);
  };

  const updateTaskStatus = (projectId: string, taskId: string, status: TaskStatus) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          tasks: proj.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
        };
      })
    );
    logAuditEvent('TASK_STATUS_UPDATED', 'PROJECTS', `Project ${projectId} task ${taskId} set to ${status}`);
  };

  const addPurchaseOrder = (poData: Omit<PurchaseOrder, 'id' | 'poNumber' | 'date'>) => {
    const company = activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany;
    const poNumber = `${company === 'COMP_A' ? 'A' : 'B'}-PO-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPO: PurchaseOrder = {
      ...poData,
      id: `po-${Date.now().toString().slice(-4)}`,
      companyId: company,
      poNumber,
      date: new Date().toISOString().split('T')[0],
    };
    setPurchaseOrders((prev) => [newPO, ...prev]);
    logAuditEvent('PO_ISSUED', 'INVENTORY', `Issued PO ${newPO.poNumber} to ${newPO.supplier}`);
  };

  const updatePOStatus = (id: string, status: POStatus) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status } : po))
    );
    logAuditEvent('PO_STATUS_UPDATED', 'INVENTORY', `PO ${id} status set to ${status}`);
  };

  const adjustStock = (id: string, quantityDelta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newQty = Math.max(0, item.quantity + quantityDelta);
        let status = item.status;
        if (newQty === 0) status = 'CRITICAL';
        else if (newQty < item.minThreshold) status = 'LOW_STOCK';
        else status = 'OPTIMAL';
        fetch('/api/erp/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'ADJUST_INVENTORY', payload: { id, quantity: newQty, status } }),
        }).catch(() => {});
        return { ...item, quantity: newQty, status };
      })
    );
    logAuditEvent('STOCK_ADJUSTED', 'INVENTORY', `Material SKU ${id} adjusted by ${quantityDelta}`);
  };

  const updateLeaveStatus = (id: string, status: LeaveStatus) => {
    setLeaves((prev) =>
      prev.map((leave) => (leave.id === id ? { ...leave, status } : leave))
    );
    logAuditEvent('LEAVE_STATUS_UPDATED', 'HR', `Employee leave request ${id} set to ${status}`);
  };

  const addEmployee = (employeeData: Omit<Employee, 'id' | 'empId'>) => {
    const company = activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany;
    const empId = `${company === 'COMP_A' ? 'A' : 'B'}-EMP-${Math.floor(100 + Math.random() * 900)}`;
    const newEmp: Employee = {
      ...employeeData,
      id: `emp-${Date.now().toString().slice(-4)}`,
      companyId: company,
      empId,
    };
    setEmployees((prev) => [newEmp, ...prev]);
    logAuditEvent('EMPLOYEE_ONBOARDED', 'HR', `Onboarded employee ${newEmp.name} (${newEmp.role})`);
  };

  const addQuotation = (quotationData: Omit<ConstructionQuotation, 'id' | 'quoteNumber' | 'createdDate'>) => {
    const company = activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany;
    const quoteNumber = `${company === 'COMP_A' ? 'A' : 'B'}-BOQ-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newQuote: ConstructionQuotation = {
      ...quotationData,
      id: `quote-${Date.now().toString().slice(-4)}`,
      companyId: company,
      quoteNumber,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setQuotations((prev) => [newQuote, ...prev]);
    logAuditEvent('QUOTATION_CREATED', 'BOQ', `Generated quotation ${newQuote.quoteNumber} for ${newQuote.clientName}`);
  };

  const updateQuotationStatus = (id: string, status: QuotationStatus) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
    logAuditEvent('QUOTATION_STATUS_UPDATED', 'BOQ', `Quotation ${id} set to ${status}`);
  };

  const addSiteDailyLog = (logData: Omit<SiteDailyLog, 'id'>) => {
    const company = activeCompany === 'CONSOLIDATED' ? 'COMP_A' : activeCompany;
    const newLog: SiteDailyLog = {
      ...logData,
      id: `log-${Date.now().toString().slice(-4)}`,
      companyId: company,
    };
    setSiteLogs((prev) => [newLog, ...prev]);
    logAuditEvent('SITE_LOG_FILED', 'SITE_LOGS', `Filed site log for ${newLog.projectName}`);
  };

  const updateMachineryStatus = (id: string, status: MachineryStatus) => {
    setMachinery((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    logAuditEvent('MACHINERY_STATUS_UPDATED', 'MACHINERY', `Fleet asset ${id} updated to ${status}`);
  };

  const addWebsiteProject = (projectData: Omit<WebsiteShowcaseProject, 'id'>) => {
    const newWebProject: WebsiteShowcaseProject = {
      ...projectData,
      id: `web-prj-${Date.now().toString().slice(-4)}`,
    };
    setWebsiteProjects((prev) => [newWebProject, ...prev]);
    logAuditEvent('WEBSITE_PROJECT_ADDED', 'WEBSITE', `Added portfolio project: ${newWebProject.title}`);
  };

  const deleteWebsiteProject = (id: string) => {
    setWebsiteProjects((prev) => prev.filter((p) => p.id !== id));
    logAuditEvent('WEBSITE_PROJECT_DELETED', 'WEBSITE', `Removed portfolio project: ${id}`);
  };

  const updateInquiryStatus = (id: string, status: WebsiteInquiry['status']) => {
    setWebsiteInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );
    fetch('/api/erp/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'UPDATE_INQUIRY_STATUS', payload: { id, status } }),
    }).catch(() => {});
    logAuditEvent('INQUIRY_STATUS_UPDATED', 'WEBSITE', `Client inquiry ${id} updated to ${status}`);
  };

  const sendQuotationEmailAction = async (quotationId: string) => {
    const q = quotations.find((quote) => quote.id === quotationId);
    if (!q) return { success: false, message: 'Quotation not found' };

    try {
      const res = await fetch('/api/erp/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'QUOTATION',
          to: q.clientEmail,
          clientName: q.clientName,
          quotation: {
            quoteNumber: q.quoteNumber,
            projectScope: q.projectScope,
            grandTotal: q.grandTotal,
            validUntil: q.validUntil,
          },
        }),
      });

      const data = await res.json();
      logAuditEvent('QUOTATION_EMAIL_DISPATCHED', 'BOQ', `Dispatched tender ${q.quoteNumber} via email to ${q.clientEmail}`);
      return { success: true, simulated: data.simulated, message: 'Quotation successfully dispatched' };
    } catch {
      return { success: false, message: 'Failed to dispatch email' };
    }
  };

  return (
    <ERPContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        switchPersona,
        activeCompany,
        setActiveCompany,
        companies,
        updateCompanyProfile,
        getNextDocNumber,
        leads,
        invoices,
        projects,
        inventory,
        purchaseOrders,
        employees,
        leaves,
        auditLogs,
        machinery,
        siteLogs,
        quotations,
        subcontractors,
        websiteProjects,
        websiteInquiries,
        glAccounts,
        journalEntries,
        cashBook,
        addJournalEntry,
        postJournalEntry,
        addCashBookEntry,
        labourWorkers,
        musterRolls,
        labourPayrolls,
        addLabourWorker,
        addMusterRoll,
        verifyMusterRoll,
        purchaseRequisitions,
        goodsReceivedNotes,
        threeWayMatches,
        addPurchaseRequisition,
        approvePurchaseRequisition,
        addGoodsReceivedNote,
        stores,
        materialIssueNotes,
        addMaterialIssueNote,
        fuelLogs,
        addFuelLog,
        budgetBaselines,
        govtContracts,
        cidaIpcs,
        addCidaIpc,
        updateCidaIpcStatus,
        safetyInspections,
        ppeRecords,
        safetyIncidents,
        addSafetyInspection,
        addSafetyIncident,
        vaultDocuments,
        addVaultDocument,
        addLead,
        updateLeadStage,
        addInvoice,
        updateInvoiceStatus,
        addProject,
        updateTaskStatus,
        addPurchaseOrder,
        updatePOStatus,
        adjustStock,
        updateLeaveStatus,
        addEmployee,
        addQuotation,
        updateQuotationStatus,
        addSiteDailyLog,
        updateMachineryStatus,
        addWebsiteProject,
        deleteWebsiteProject,
        updateInquiryStatus,
        sendQuotationEmailAction,
        logAuditEvent,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
}

export function useERP() {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
}
