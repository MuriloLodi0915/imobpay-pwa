import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Payment, Contract } from '../types';
import FinancialForm from '../components/FinancialForm';
import { mockPayments, mockContracts } from '../data/mockData';

const STORAGE_KEY = 'imobpay_payments';
const CONTRACTS_KEY = 'imobpay_contracts';

function getInitialPayments(): Payment[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved).map((p: any) => ({
      ...p,
      dueDate: new Date(p.dueDate),
      paidDate: p.paidDate ? new Date(p.paidDate) : undefined,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockPayments));
  return mockPayments;
}

function getContracts(): Contract[] {
  const saved = localStorage.getItem(CONTRACTS_KEY);
  if (saved) return JSON.parse(saved).map((c: any) => ({
    ...c,
    startDate: new Date(c.startDate),
    endDate: new Date(c.endDate),
    createdAt: new Date(c.createdAt),
    updatedAt: new Date(c.updatedAt),
  }));
  return mockContracts;
}

const Financial: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>(getInitialPayments());
  const [contracts, setContracts] = useState<Contract[]>(getContracts());
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editPayment, setEditPayment] = useState<Payment | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Payment | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    setContracts(getContracts());
  }, []);

  const filtered = payments.filter(p => {
    const contract = contracts.find(c => c.id === p.contractId);
    return (
      (contract?.id?.toString().includes(search) || '') ||
      (p.status && p.status.toLowerCase().includes(search.toLowerCase())) ||
      (p.type && p.type.toLowerCase().includes(search.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const handleAdd = () => {
    setEditPayment(null);
    setShowForm(true);
  };

  const handleEdit = (payment: Payment) => {
    setEditPayment(payment);
    setShowForm(true);
  };

  const handleDelete = (payment: Payment) => {
    setConfirmDelete(payment);
  };

  const confirmDeletePayment = () => {
    if (confirmDelete) {
      setPayments(ps => ps.filter(p => p.id !== confirmDelete.id));
      setConfirmDelete(null);
    }
  };

  const handleFormSubmit = (data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editPayment) {
      setPayments(ps => ps.map(p =>
        p.id === editPayment.id ? { ...p, ...data, updatedAt: new Date() } : p
      ));
    } else {
      setPayments(ps => [
        {
          ...data,
          id: (Math.max(0, ...ps.map(p => Number(p.id))) + 1).toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...ps,
      ]);
    }
    setShowForm(false);
    setEditPayment(null);
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financeiro</h1>
          <p className="text-gray-500 dark:text-gray-400">Gestão financeira dos imóveis.</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={handleAdd}>
          <Plus className="w-5 h-5" /> Novo Lançamento
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            className="input pl-10"
            placeholder="Buscar por contrato, status, tipo ou descrição..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Contrato</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Tipo</th>
              <th>Vencimento</th>
              <th>Pagamento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-8">Nenhum lançamento encontrado.</td>
              </tr>
            )}
            {filtered.map(payment => {
              const contract = contracts.find(c => c.id === payment.contractId);
              return (
                <tr key={payment.id}>
                  <td>{contract ? `#${contract.id}` : '-'}</td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>
                    <span className={`badge ${
                      payment.status === 'paid' ? 'badge-success' :
                      payment.status === 'pending' ? 'badge-warning' :
                      'badge-danger'
                    }`}>
                      {payment.status === 'paid' ? 'Pago' : payment.status === 'pending' ? 'Pendente' : 'Atrasado'}
                    </span>
                  </td>
                  <td>{payment.type === 'rent' ? 'Aluguel' : payment.type === 'deposit' ? 'Depósito' : payment.type === 'fine' ? 'Multa' : 'Outro'}</td>
                  <td>{payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('pt-BR') : '-'}</td>
                  <td>{payment.paidDate ? new Date(payment.paidDate).toLocaleDateString('pt-BR') : '-'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-secondary p-1" title="Editar" onClick={() => handleEdit(payment)}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="btn-danger p-1" title="Remover" onClick={() => handleDelete(payment)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de cadastro/edição */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-lg animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{editPayment ? 'Editar Lançamento' : 'Novo Lançamento'}</h2>
            <FinancialForm
              initialData={editPayment}
              contracts={contracts}
              onSubmit={handleFormSubmit}
              onCancel={() => { setShowForm(false); setEditPayment(null); }}
            />
          </div>
        </div>
      )}

      {/* Modal de confirmação de remoção */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md animate-fade-in">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Remover Lançamento</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Tem certeza que deseja remover este lançamento?</p>
            <div className="flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn-danger" onClick={confirmDeletePayment}>Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financial; 