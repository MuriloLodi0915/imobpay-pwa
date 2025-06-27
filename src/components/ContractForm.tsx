import React, { useState, useEffect } from 'react';
import { Contract, Property, Tenant } from '../types';

interface ContractFormProps {
  initialData?: Contract | null;
  properties: Property[];
  tenants: Tenant[];
  onSubmit: (data: Omit<Contract, 'id' | 'createdAt' | 'updatedAt' | 'property' | 'tenant'>) => void;
  onCancel: () => void;
}

const defaultState = {
  propertyId: '',
  tenantId: '',
  startDate: '',
  endDate: '',
  rentValue: 0,
  depositValue: 0,
  status: 'active' as Contract['status'],
  terms: '',
};

const ContractForm: React.FC<ContractFormProps> = ({ initialData, properties, tenants, onSubmit, onCancel }) => {
  const [form, setForm] = useState({ ...defaultState });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        propertyId: initialData.propertyId,
        tenantId: initialData.tenantId,
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().slice(0, 10) : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().slice(0, 10) : '',
        rentValue: initialData.rentValue,
        depositValue: initialData.depositValue,
        status: initialData.status,
        terms: initialData.terms || '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'rentValue' || name === 'depositValue' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.propertyId || !form.tenantId || !form.startDate || !form.endDate || !form.rentValue) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
      setError('A data de término deve ser posterior à data de início.');
      return;
    }
    onSubmit({
      ...form,
      startDate: new Date(form.startDate),
      endDate: new Date(form.endDate),
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Imóvel *</label>
          <select name="propertyId" value={form.propertyId} onChange={handleChange} className="input" required autoFocus>
            <option value="">Selecione...</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.title} - {p.address}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Inquilino *</label>
          <select name="tenantId" value={form.tenantId} onChange={handleChange} className="input" required>
            <option value="">Selecione...</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>{t.name} - {t.cpf}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Início *</label>
          <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Término *</label>
          <input name="endDate" type="date" value={form.endDate} onChange={handleChange} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor do Aluguel (R$) *</label>
          <input name="rentValue" type="number" min={0} value={form.rentValue} onChange={handleChange} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor do Depósito (R$)</label>
          <input name="depositValue" type="number" min={0} value={form.depositValue} onChange={handleChange} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status *</label>
          <select name="status" value={form.status} onChange={handleChange} className="input" required>
            <option value="active">Ativo</option>
            <option value="expired">Expirado</option>
            <option value="terminated">Rescindido</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Termos do Contrato</label>
        <textarea name="terms" value={form.terms} onChange={handleChange} className="input" rows={2} />
      </div>
      {error && <div className="text-danger-600 dark:text-danger-400 text-sm">{error}</div>}
      <div className="flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Salvar</button>
      </div>
    </form>
  );
};

export default ContractForm; 