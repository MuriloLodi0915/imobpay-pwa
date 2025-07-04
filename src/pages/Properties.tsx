import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Property } from '../types';
import PropertyForm from '../components/PropertyForm';
import { mockProperties } from '../data/mockData';

const STORAGE_KEY = 'imobpay_properties';

function getInitialProperties(): Property[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved).map((p: any) => ({ ...p, createdAt: new Date(p.createdAt), updatedAt: new Date(p.updatedAt) }));
  }
  // Se não houver no localStorage, usar mock e salvar
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProperties));
  return mockProperties;
}

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(getInitialProperties());
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Property | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
  }, [properties]);

  const filtered = properties.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setEditProperty(null);
    setShowForm(true);
  };

  const handleEdit = (property: Property) => {
    setEditProperty(property);
    setShowForm(true);
  };

  const handleDelete = (property: Property) => {
    setConfirmDelete(property);
  };

  const confirmDeleteProperty = () => {
    if (confirmDelete) {
      setProperties(props => props.filter(p => p.id !== confirmDelete.id));
      setConfirmDelete(null);
    }
  };

  const handleFormSubmit = (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editProperty) {
      setProperties(props => props.map(p =>
        p.id === editProperty.id ? { ...p, ...data, updatedAt: new Date() } : p
      ));
    } else {
      setProperties(props => [
        {
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...props,
      ]);
    }
    setShowForm(false);
    setEditProperty(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Imóveis</h1>
          <p className="text-gray-500 dark:text-gray-400">Gestão de imóveis cadastrados.</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={handleAdd}>
          <Plus className="w-5 h-5" /> Novo Imóvel
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            className="input pl-10"
            placeholder="Buscar por título ou endereço..."
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
              <th>Título</th>
              <th>Endereço</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Quartos</th>
              <th>Banheiros</th>
              <th>Área (m²)</th>
              <th>Valor (R$)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center text-gray-400 py-8">Nenhum imóvel encontrado.</td>
              </tr>
            )}
            {filtered.map(property => (
              <tr key={property.id}>
                <td>{property.title}</td>
                <td>{property.address}</td>
                <td>{property.type === 'apartment' ? 'Apartamento' : property.type === 'house' ? 'Casa' : 'Comercial'}</td>
                <td>
                  <span className={
                    property.status === 'available' ? 'badge-info' :
                    property.status === 'rented' ? 'badge-success' :
                    'badge-warning'
                  }>
                    {property.status === 'available' ? 'Disponível' : property.status === 'rented' ? 'Alugado' : 'Manutenção'}
                  </span>
                </td>
                <td>{property.bedrooms ?? '-'}</td>
                <td>{property.bathrooms ?? '-'}</td>
                <td>{property.area}</td>
                <td>R$ {property.rentValue.toLocaleString('pt-BR')}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn-secondary p-1" title="Editar" onClick={() => handleEdit(property)}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="btn-danger p-1" title="Remover" onClick={() => handleDelete(property)}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de cadastro/edição */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-lg animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{editProperty ? 'Editar Imóvel' : 'Novo Imóvel'}</h2>
            <PropertyForm
              initialData={editProperty}
              onSubmit={handleFormSubmit}
              onCancel={() => { setShowForm(false); setEditProperty(null); }}
            />
          </div>
        </div>
      )}

      {/* Modal de confirmação de remoção */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md animate-fade-in">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Remover Imóvel</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Tem certeza que deseja remover o imóvel <b>{confirmDelete.title}</b>?</p>
            <div className="flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn-danger" onClick={confirmDeleteProperty}>Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties; 