import React, { useState, useEffect } from 'react';
import { Payment, Contract } from '../types';

interface FinancialFormProps {
  initialData?: Payment | null;
  contracts: Contract[];
  onSubmit: (data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const defaultState = {
  contractId: '',
  amount: 0,
  dueDate: '',
  paidDate: '',
  status: 'pending' as Payment['status'],
  type: 'rent' as Payment['type'],
  description: '',
  receiptUrl: '',
};

const FinancialForm: React.FC<FinancialFormProps> = ({ initialData, contracts, onSubmit, onCancel }) => {
  const [form, setForm] = useState({ ...defaultState });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        contractId: initialData.contractId,
        amount: initialData.amount,
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().slice(0, 10) : '',
        paidDate: initialData.paidDate ? new Date(initialData.paidDate).toISOString().slice(0, 10) : '',
        status: initialData.status,
        type: initialData.type,
        description: initialData.description || '',
        receiptUrl: initialData.receiptUrl || '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'amount' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.contractId || !form.amount || !form.dueDate) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    onSubmit({
      ...form,
      dueDate: new Date(form.dueDate),
      paidDate: form.paidDate ? new Date(form.paidDate) : undefined,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contrato *</label>
          <select name="contractId" value={form.contractId} onChange={handleChange} className="input" required autoFocus>
            <option value="">Selecione...</option>
            {contracts.map((c) => (
              <option key={c.id} value={c.id}>Contrato #{c.id}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor (R$) *</label>
          <input name="amount" type="number" min={0} value={form.amount} onChange={handleChange} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Vencimento *</label>
          <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Pagamento</label>
          <input name="paidDate" type="date" value={form.paidDate} onChange={handleChange} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status *</label>
          <select name="status" value={form.status} onChange={handleChange} className="input" required>
            <option value="pending">Pendente</option>
            <option value="paid">Pago</option>
            <option value="overdue">Atrasado</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo *</label>
          <select name="type" value={form.type} onChange={handleChange} className="input" required>
            <option value="rent">Aluguel</option>
            <option value="deposit">Depósito</option>
            <option value="fine">Multa</option>
            <option value="other">Outro</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="input" rows={2} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Comprovante (URL)</label>
        <input name="receiptUrl" value={form.receiptUrl} onChange={handleChange} className="input" />
      </div>
      {error && <div className="text-danger-600 dark:text-danger-400 text-sm">{error}</div>}
      <div className="flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Salvar</button>
      </div>
    </form>
  );
};

export default FinancialForm; 