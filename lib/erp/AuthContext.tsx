"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ERPUser,
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
} from './types';
import { ENTERPRISE_USERS } from './auth';
import {
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
  
  // Data state
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

  // Mutations
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
  
  // Construction Mutations
  addQuotation: (quotation: Omit<ConstructionQuotation, 'id' | 'quoteNumber' | 'createdDate'>) => void;
  updateQuotationStatus: (id: string, status: QuotationStatus) => void;
  addSiteDailyLog: (log: Omit<SiteDailyLog, 'id'>) => void;
  updateMachineryStatus: (id: string, status: MachineryStatus) => void;
  addWebsiteProject: (project: Omit<WebsiteShowcaseProject, 'id'>) => void;
  deleteWebsiteProject: (id: string) => void;
  updateInquiryStatus: (id: string, status: WebsiteInquiry['status']) => void;
  sendQuotationEmailAction: (quotationId: string) => Promise<{ success: boolean; simulated?: boolean; message?: string }>;
  logAuditEvent: (action: string, module: AuditModule, details: string, severity?: AuditSeverity) => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export function ERPProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ERPUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Core Enterprise Data States
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

  // Check existing session on mount
  useEffect(() => {
    async function initAuth() {
      try {
        const res = await fetch('/api/erp/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
          }
        } else {
          const storedToken = localStorage.getItem('contec_erp_token');
          const storedUser = localStorage.getItem('contec_erp_user');
          if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (err) {
        console.error('Session check error', err);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const logAuditEvent = (
    action: string,
    module: AuditModule,
    details: string,
    severity: AuditSeverity = 'INFO'
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actorName: user?.name || 'Authorized Operator',
      actorEmail: user?.email || 'operator@contec.com',
      role: user?.role || 'SUPER_ADMIN',
      action,
      module,
      details,
      ipAddress: '127.0.0.1 (Internal Proxy)',
      severity,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/erp/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Authentication failed' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('contec_erp_token', data.token);
      localStorage.setItem('contec_erp_user', JSON.stringify(data.user));

      logAuditEvent('ENTERPRISE_LOGIN_SUCCESS', 'AUTH', `Session authenticated for ${data.user.email} (${data.user.role})`);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error communicating with auth server' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/erp/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    logAuditEvent('ENTERPRISE_LOGOUT', 'AUTH', `Session ended for ${user?.email || 'user'}`);
    setUser(null);
    setToken(null);
    localStorage.removeItem('contec_erp_token');
    localStorage.removeItem('contec_erp_user');
  };

  const switchPersona = async (email: string) => {
    const persona = ENTERPRISE_USERS[email];
    if (persona) {
      await login(persona.email, persona.passwordHash);
    }
  };

  // Mutations
  const addLead = (leadData: Omit<CRMLead, 'id' | 'lastUpdated'>) => {
    const newLead: CRMLead = {
      ...leadData,
      id: `lead-${Date.now().toString().slice(-4)}`,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setLeads((prev) => [newLead, ...prev]);
    logAuditEvent('CRM_LEAD_CREATED', 'CRM', `Added prospective contract: ${newLead.company} ($${newLead.estimatedValue.toLocaleString()})`);
  };

  const updateLeadStage = (id: string, stage: LeadStage) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === id) {
          const updated = { ...lead, stage, lastUpdated: new Date().toISOString().split('T')[0] };
          if (stage === 'WON') updated.probability = 100;
          if (stage === 'LOST') updated.probability = 0;
          return updated;
        }
        return lead;
      })
    );
    logAuditEvent('CRM_LEAD_STAGE_UPDATED', 'CRM', `Lead ${id} moved to stage ${stage}`);
  };

  const addInvoice = (invData: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const nextNumber = `CNT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newInvoice: Invoice = {
      ...invData,
      id: `inv-${Date.now().toString().slice(-4)}`,
      invoiceNumber: nextNumber,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    logAuditEvent('INVOICE_ISSUED', 'FINANCE', `Issued invoice ${newInvoice.invoiceNumber} for ${newInvoice.clientName} ($${newInvoice.total.toLocaleString()})`);
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status } : inv))
    );
    logAuditEvent('INVOICE_STATUS_UPDATED', 'FINANCE', `Invoice ${id} marked as ${status}`);
  };

  const addProject = (prjData: Omit<Project, 'id' | 'code' | 'tasks'>) => {
    const newCode = `CNT-PRJ-${Math.floor(500 + Math.random() * 500)}`;
    const newProject: Project = {
      ...prjData,
      id: `prj-${Date.now().toString().slice(-4)}`,
      code: newCode,
      tasks: [
        {
          id: `t-${Date.now()}-1`,
          title: 'Initial architectural BIM integration & site layout',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          assignee: prjData.siteEngineer,
          dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        },
      ],
    };
    setProjects((prev) => [newProject, ...prev]);
    logAuditEvent('PROJECT_COMMISSIONED', 'PROJECTS', `Created master construction project: ${newProject.name} (${newCode})`);
  };

  const updateTaskStatus = (projectId: string, taskId: string, status: TaskStatus) => {
    setProjects((prev) =>
      prev.map((prj) => {
        if (prj.id === projectId) {
          const updatedTasks = prj.tasks.map((t) =>
            t.id === taskId ? { ...t, status } : t
          );
          const completedCount = updatedTasks.filter((t) => t.status === 'COMPLETED').length;
          const newProgress = Math.round((completedCount / updatedTasks.length) * 100);
          return { ...prj, tasks: updatedTasks, progress: Math.max(prj.progress, newProgress) };
        }
        return prj;
      })
    );
    logAuditEvent('TASK_STATUS_CHANGED', 'PROJECTS', `Task ${taskId} in project ${projectId} marked as ${status}`);
  };

  const addPurchaseOrder = (poData: Omit<PurchaseOrder, 'id' | 'poNumber' | 'date'>) => {
    const nextPO = `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPO: PurchaseOrder = {
      ...poData,
      id: `po-${Date.now().toString().slice(-4)}`,
      poNumber: nextPO,
      date: new Date().toISOString().split('T')[0],
    };
    setPurchaseOrders((prev) => [newPO, ...prev]);
    logAuditEvent('PURCHASE_ORDER_ISSUED', 'INVENTORY', `Issued ${newPO.poNumber} to ${newPO.supplier} ($${newPO.totalAmount.toLocaleString()})`);
  };

  const updatePOStatus = (id: string, status: POStatus) => {
    setPurchaseOrders((prev) =>
      prev.map((po) =>
        po.id === id
          ? {
              ...po,
              status,
              approvedBy: status === 'APPROVED' ? user?.name || 'Arthur Sterling' : po.approvedBy,
            }
          : po
      )
    );
    logAuditEvent('PO_WORKFLOW_UPDATE', 'INVENTORY', `Purchase order ${id} status updated to ${status}`);
  };

  const adjustStock = (id: string, quantityDelta: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + quantityDelta);
          let newStatus: InventoryItem['status'] = 'OPTIMAL';
          if (newQty <= item.minThreshold * 0.4) {
            newStatus = 'CRITICAL';
          } else if (newQty <= item.minThreshold) {
            newStatus = 'LOW_STOCK';
          }
          return { ...item, quantity: newQty, status: newStatus };
        }
        return item;
      })
    );
    logAuditEvent('INVENTORY_ADJUSTMENT', 'INVENTORY', `Stock adjusted for item ${id} by delta ${quantityDelta}`);
  };

  const updateLeaveStatus = (id: string, status: LeaveStatus) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
    logAuditEvent('LEAVE_DECISION_RECORDED', 'HR', `Leave request ${id} updated to ${status}`);
  };

  const addEmployee = (empData: Omit<Employee, 'id' | 'empId'>) => {
    const nextId = `emp-${Date.now().toString().slice(-4)}`;
    const nextEmpId = `CNT-0${employees.length + 1}`;
    const newEmp: Employee = {
      ...empData,
      id: nextId,
      empId: nextEmpId,
    };
    setEmployees((prev) => [...prev, newEmp]);
    logAuditEvent('EMPLOYEE_ONBOARDED', 'HR', `Onboarded new talent: ${newEmp.name} (${newEmp.role})`);
  };

  // Construction Specialized Mutations
  const addQuotation = (quoteData: Omit<ConstructionQuotation, 'id' | 'quoteNumber' | 'createdDate'>) => {
    const nextQuoteNum = `CNT-QT-2026-${Math.floor(500 + Math.random() * 500)}`;
    const newQuote: ConstructionQuotation = {
      ...quoteData,
      id: `quote-${Date.now().toString().slice(-4)}`,
      quoteNumber: nextQuoteNum,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setQuotations((prev) => [newQuote, ...prev]);
    logAuditEvent('QUOTATION_GENERATED', 'BOQ', `Generated official construction tender ${newQuote.quoteNumber} for ${newQuote.clientCompany} ($${newQuote.grandTotal.toLocaleString()})`);
  };

  const updateQuotationStatus = (id: string, status: QuotationStatus) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
    logAuditEvent('QUOTATION_STATUS_UPDATED', 'BOQ', `Quotation ${id} marked as ${status}`);
  };

  const addSiteDailyLog = (logData: Omit<SiteDailyLog, 'id'>) => {
    const newLog: SiteDailyLog = {
      ...logData,
      id: `log-site-${Date.now().toString().slice(-4)}`,
    };
    setSiteLogs((prev) => [newLog, ...prev]);
    logAuditEvent('SITE_DAILY_LOG_SUBMITTED', 'SITE_LOGS', `Site log filed for ${newLog.projectName}: ${newLog.concretePouredM3} m³ poured, ${newLog.workforceCount} personnel`);
  };

  const updateMachineryStatus = (id: string, status: MachineryStatus) => {
    setMachinery((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    logAuditEvent('MACHINERY_STATUS_CHANGED', 'MACHINERY', `Equipment asset ${id} status changed to ${status}`);
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
