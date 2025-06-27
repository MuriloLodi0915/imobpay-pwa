import React, { useState, useEffect } from 'react';
import { Tenant } from '../types';

interface TenantFormProps {
  initialData?: Tenant | null;
  onSubmit: (data: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const defaultState = {
  name: '',
  email: '',
  phone: '',
  cpf: '',
  rg: '',
  address: '',
  emergencyContact: {
    name: '',
    phone: '',
    relationship: '',
  },
};

const TenantForm: React.FC<TenantFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState({ ...defaultState });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        cpf: initialData.cpf,
        rg: initialData.rg || '',
        address: initialData.address,
        emergencyContact: initialData.emergencyContact || { name: '', phone: '', relationship: '' },
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setForm((prev) => ({ ...prev, emergencyContact: { ...prev.emergencyContact, [field]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.phone || !form.cpf || !form.address) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    onSubmit(form);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome *</label>
          <input name="name" value={form.name} onChange={handleChange} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefone *</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CPF *</label>
          <input name="cpf" value={form.cpf} onChange={handleChange} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">RG</label>
          <input name="rg" value={form.rg} onChange={handleChange} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Endereço *</label>
          <input name="address" value={form.address} onChange={handleChange} className="input" required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contato de Emergência</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input name="emergencyContact.name" value={form.emergencyContact.name} onChange={handleChange} className="input" placeholder="Nome" />
          <input name="emergencyContact.phone" value={form.emergencyContact.phone} onChange={handleChange} className="input" placeholder="Telefone" />
          <input name="emergencyContact.relationship" value={form.emergencyContact.relationship} onChange={handleChange} className="input" placeholder="Relação" />
        </div>
      </div>
      {error && <div className="text-danger-600 dark:text-danger-400 text-sm">{error}</div>}
      <div className="flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Salvar</button>
      </div>
    </form>
  );
};

export default TenantForm; 