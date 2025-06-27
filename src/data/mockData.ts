import { Property, Tenant, Contract, Payment, DashboardStats, Alert } from '../types';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Apartamento Centro',
    address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    rentValue: 2500,
    status: 'rented',
    description: 'Apartamento bem localizado no centro da cidade',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Casa Jardins',
    address: 'Av. Paulista, 1000 - Jardins, São Paulo - SP',
    type: 'house',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    rentValue: 4500,
    status: 'available',
    description: 'Casa espaçosa em bairro nobre',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    title: 'Loja Comercial',
    address: 'Rua Augusta, 500 - Consolação, São Paulo - SP',
    type: 'commercial',
    area: 80,
    rentValue: 3500,
    status: 'rented',
    description: 'Loja comercial em local movimentado',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  }
];

export const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    emergencyContact: {
      name: 'Maria Silva',
      phone: '(11) 88888-8888',
      relationship: 'Esposa'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '(11) 77777-7777',
    cpf: '987.654.321-00',
    rg: '98.765.432-1',
    address: 'Rua Augusta, 500 - Consolação, São Paulo - SP',
    emergencyContact: {
      name: 'Pedro Costa',
      phone: '(11) 66666-6666',
      relationship: 'Irmão'
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  }
];

export const mockContracts: Contract[] = [
  {
    id: '1',
    propertyId: '1',
    tenantId: '1',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2025-01-15'),
    rentValue: 2500,
    depositValue: 2500,
    status: 'active',
    terms: 'Contrato de locação residencial por 12 meses',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    propertyId: '3',
    tenantId: '2',
    startDate: new Date('2024-01-05'),
    endDate: new Date('2025-01-05'),
    rentValue: 3500,
    depositValue: 3500,
    status: 'active',
    terms: 'Contrato de locação comercial por 12 meses',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    contractId: '1',
    amount: 2500,
    dueDate: new Date('2024-02-15'),
    paidDate: new Date('2024-02-10'),
    status: 'paid',
    type: 'rent',
    description: 'Aluguel fevereiro 2024',
    receiptUrl: '/receipts/receipt-1.pdf',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10'),
    contract: mockContracts[0]
  },
  {
    id: '2',
    contractId: '1',
    amount: 2500,
    dueDate: new Date('2024-03-15'),
    status: 'pending',
    type: 'rent',
    description: 'Aluguel março 2024',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    contract: mockContracts[0]
  },
  {
    id: '3',
    contractId: '2',
    amount: 3500,
    dueDate: new Date('2024-02-05'),
    paidDate: new Date('2024-02-03'),
    status: 'paid',
    type: 'rent',
    description: 'Aluguel fevereiro 2024',
    receiptUrl: '/receipts/receipt-2.pdf',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-03'),
    contract: mockContracts[1]
  },
  {
    id: '4',
    contractId: '2',
    amount: 3500,
    dueDate: new Date('2024-03-05'),
    status: 'overdue',
    type: 'rent',
    description: 'Aluguel março 2024',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    contract: mockContracts[1]
  }
];

export const mockDashboardStats: DashboardStats = {
  totalProperties: 3,
  rentedProperties: 2,
  availableProperties: 1,
  totalTenants: 2,
  activeContracts: 2,
  monthlyIncome: 6000,
  pendingPayments: 1,
  overduePayments: 1
};

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'payment_overdue',
    title: 'Pagamento em Atraso',
    message: 'O pagamento do aluguel do imóvel "Loja Comercial" está em atraso há 10 dias.',
    severity: 'error',
    read: false,
    createdAt: new Date('2024-03-15'),
    relatedId: '4'
  },
  {
    id: '2',
    type: 'payment_due',
    title: 'Pagamento Vencendo',
    message: 'O pagamento do aluguel do imóvel "Apartamento Centro" vence em 3 dias.',
    severity: 'warning',
    read: false,
    createdAt: new Date('2024-03-12'),
    relatedId: '2'
  },
  {
    id: '3',
    type: 'contract_expiring',
    title: 'Contrato Expirando',
    message: 'O contrato do imóvel "Apartamento Centro" expira em 30 dias.',
    severity: 'info',
    read: true,
    createdAt: new Date('2024-02-15'),
    relatedId: '1'
  }
]; 