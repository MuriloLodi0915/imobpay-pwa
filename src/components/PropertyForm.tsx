import React, { useState, useEffect } from 'react';
import { Property } from '../types';

interface PropertyFormProps {
  initialData?: Property | null;
  onSubmit: (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const defaultState = {
  title: '',
  address: '',
  type: 'apartment' as Property['type'],
  bedrooms: 1,
  bathrooms: 1,
  area: 0,
  rentValue: 0,
  status: 'available' as Property['status'],
  description: '',
};

const PropertyForm: React.FC<PropertyFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState({ ...defaultState });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        address: initialData.address,
        type: initialData.type,
        bedrooms: initialData.bedrooms || 1,
        bathrooms: initialData.bathrooms || 1,
        area: initialData.area,
        rentValue: initialData.rentValue,
        status: initialData.status,
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'area' || name === 'rentValue' || name === 'bedrooms' || name === 'bathrooms' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.address || !form.type || !form.area || !form.rentValue) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    onSubmit(form);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título *</label>
          <input name="title" value={form.title} onChange={handleChange} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Endereço *</label>
          <input name="address" value={form.address} onChange={handleChange} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo *</label>
          <select name="type" value={form.type} onChange={handleChange} className="input" required>
            <option value="apartment">Apartamento</option>
            <option value="house">Casa</option>
            <option value="commercial">Comercial</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status *</label>
          <select name="status" value={form.status} onChange={handleChange} className="input" required>
            <option value="available">Disponível</option>
            <option value="rented">Alugado</option>
            <option value="maintenance">Manutenção</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quartos</label>
          <input name="bedrooms" type="number" min={0} value={form.bedrooms} onChange={handleChange} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Banheiros</label>
          <input name="bathrooms" type="number" min={0} value={form.bathrooms} onChange={handleChange} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Área (m²) *</label>
          <input name="area" type="number" min={1} value={form.area} onChange={handleChange} className="input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor do Aluguel (R$) *</label>
          <input name="rentValue" type="number" min={0} value={form.rentValue} onChange={handleChange} className="input" required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="input" rows={2} />
      </div>
      {error && <div className="text-danger-600 dark:text-danger-400 text-sm">{error}</div>}
      <div className="flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Salvar</button>
      </div>
    </form>
  );
};

export default PropertyForm; 