export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  avatar?: string;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  type: 'apartment' | 'house' | 'commercial';
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  rentValue: number;
  status: 'available' | 'rented' | 'maintenance';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  rg?: string;
  address: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Contract {
  id: string;
  propertyId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  rentValue: number;
  depositValue: number;
  status: 'active' | 'expired' | 'terminated';
  terms?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  contractId: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue';
  type: 'rent' | 'deposit' | 'fine' | 'other';
  description?: string;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  contract?: Contract;
}

export interface FinancialReport {
  period: string;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  pendingPayments: number;
  overduePayments: number;
  propertiesCount: number;
  activeContracts: number;
}

export interface DashboardStats {
  totalProperties: number;
  rentedProperties: number;
  availableProperties: number;
  totalTenants: number;
  activeContracts: number;
  monthlyIncome: number;
  pendingPayments: number;
  overduePayments: number;
}

export interface Alert {
  id: string;
  type: 'payment_due' | 'payment_overdue' | 'contract_expiring' | 'system';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  relatedId?: string;
} 