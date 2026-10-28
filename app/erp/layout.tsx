import type { Metadata } from 'next';
import { ERPProvider } from '@/lib/erp/AuthContext';
import ERPLayoutContent from '@/components/erp/ERPLayoutContent';

export const metadata: Metadata = {
  title: 'CONTEC Enterprise ERP & Business Management Suite',
  description:
    'Real-time Enterprise Resource Planning, Financial Ledgers, Construction Site Operations, Supply Chain, HRMS, and JWT Cryptographic Governance.',
};

export default function ERPLayout({ children }: { children: React.ReactNode }) {
  return (
    <ERPProvider>
      <ERPLayoutContent>{children}</ERPLayoutContent>
    </ERPProvider>
  );
}

