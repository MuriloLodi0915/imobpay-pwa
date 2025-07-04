import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Tenant } from '../types';
import TenantForm from '../components/TenantForm';
import { mockTenants } from '../data/mockData';

const STORAGE_KEY = 'imobpay_tenants';

function getInitialTenants(): Tenant[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved).map((t: any) => ({ ...t, createdAt: new Date(t.createdAt), updatedAt: new Date(t.updatedAt) }));
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTenants));
  return mockTenants;
}

const Tenants: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>(getInitialTenants());
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTenant, setEditTenant] = useState<Tenant | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Tenant | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tenants));
  }, [tenants]);

  const filtered = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    t.cpf.includes(search)
  );

  const handleAdd = () => {
    setEditTenant(null);
    setShowForm(true);
  };

  const handleEdit = (tenant: Tenant) => {
    setEditTenant(tenant);
    setShowForm(true);
  };

  const handleDelete = (tenant: Tenant) => {
    setConfirmDelete(tenant);
  };

  const confirmDeleteTenant = () => {
    if (confirmDelete) {
      setTenants(ts => ts.filter(t => t.id !== confirmDelete.id));
      setConfirmDelete(null);
    }
  };

  const handleFormSubmit = (data: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editTenant) {
      setTenants(ts => ts.map(t =>
        t.id === editTenant.id ? { ...t, ...data, updatedAt: new Date() } : t
      ));
    } else {
      setTenants(ts => [
        {
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...ts,
      ]);
    }
    setShowForm(false);
    setEditTenant(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inquilinos</h1>
          <p className="text-gray-500 dark:text-gray-400">Gestão de inquilinos cadastrados.</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={handleAdd}>
          <Plus className="w-5 h-5" /> Novo Inquilino
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            className="input pl-10"
            placeholder="Buscar por nome, email ou CPF..."
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
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>CPF</th>
              <th>Endereço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-8">Nenhum inquilino encontrado.</td>
              </tr>
            )}
            {filtered.map(tenant => (
              <tr key={tenant.id}>
                <td>{tenant.name}</td>
                <td>{tenant.email}</td>
                <td>{tenant.phone}</td>
                <td>{tenant.cpf}</td>
                <td>{tenant.address}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn-secondary p-1" title="Editar" onClick={() => handleEdit(tenant)}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="btn-danger p-1" title="Remover" onClick={() => handleDelete(tenant)}>
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
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{editTenant ? 'Editar Inquilino' : 'Novo Inquilino'}</h2>
            <TenantForm
              initialData={editTenant}
              onSubmit={handleFormSubmit}
              onCancel={() => { setShowForm(false); setEditTenant(null); }}
            />
          </div>
        </div>
      )}

      {/* Modal de confirmação de remoção */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md animate-fade-in">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Remover Inquilino</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Tem certeza que deseja remover o inquilino <b>{confirmDelete.name}</b>?</p>
            <div className="flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn-danger" onClick={confirmDeleteTenant}>Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tenants; 