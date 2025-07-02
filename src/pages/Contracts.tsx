import React, { useEffect, useState, memo } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Contract, Property, Tenant } from '../types';
import ContractForm from '../components/ContractForm';
import { mockContracts, mockProperties, mockTenants } from '../data/mockData';

const STORAGE_KEY = 'imobpay_contracts';
const PROPERTIES_KEY = 'imobpay_properties';
const TENANTS_KEY = 'imobpay_tenants';

// Função utilitária para obter contratos do localStorage ou mocks
function getInitialContracts(): Contract[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved).map((c: any) => ({
      ...c,
      startDate: new Date(c.startDate),
      endDate: new Date(c.endDate),
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt),
    }));
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockContracts));
  return mockContracts;
}

// Função utilitária para obter imóveis
function getProperties(): Property[] {
  const saved = localStorage.getItem(PROPERTIES_KEY);
  if (saved) return JSON.parse(saved);
  return mockProperties;
}

// Função utilitária para obter inquilinos
function getTenants(): Tenant[] {
  const saved = localStorage.getItem(TENANTS_KEY);
  if (saved) return JSON.parse(saved);
  return mockTenants;
}

const Contracts: React.FC = () => {
  // Estados principais do módulo de contratos
  const [contracts, setContracts] = useState<Contract[]>(getInitialContracts());
  const [properties, setProperties] = useState<Property[]>(getProperties());
  const [tenants, setTenants] = useState<Tenant[]>(getTenants());
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editContract, setEditContract] = useState<Contract | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Contract | null>(null);

  // Atualiza localStorage sempre que contratos mudam
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
  }, [contracts]);

  // Atualiza imóveis e inquilinos ao montar
  useEffect(() => {
    setProperties(getProperties());
    setTenants(getTenants());
  }, []);

  // Filtro de busca por imóvel, inquilino, status ou termos
  const filtered = contracts.filter(c => {
    const property = properties.find(p => p.id === c.propertyId);
    const tenant = tenants.find(t => t.id === c.tenantId);
    return (
      (property?.title?.toLowerCase().includes(search.toLowerCase()) || '') ||
      (tenant?.name?.toLowerCase().includes(search.toLowerCase()) || '') ||
      (c.status && c.status.toLowerCase().includes(search.toLowerCase())) ||
      (c.terms && c.terms.toLowerCase().includes(search.toLowerCase()))
    );
  });

  // Handlers de CRUD
  const handleAdd = () => {
    setEditContract(null);
    setShowForm(true);
  };

  const handleEdit = (contract: Contract) => {
    setEditContract(contract);
    setShowForm(true);
  };

  const handleDelete = (contract: Contract) => {
    setConfirmDelete(contract);
  };

  const confirmDeleteContract = () => {
    if (confirmDelete) {
      setContracts(cs => cs.filter(c => c.id !== confirmDelete.id));
      setConfirmDelete(null);
    }
  };

  const handleFormSubmit = (data: Omit<Contract, 'id' | 'createdAt' | 'updatedAt' | 'property' | 'tenant'>) => {
    if (editContract) {
      setContracts(cs => cs.map(c =>
        c.id === editContract.id ? { ...c, ...data, updatedAt: new Date() } : c
      ));
    } else {
      setContracts(cs => [
        {
          ...data,
          id: (Math.max(0, ...cs.map(c => Number(c.id))) + 1).toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
          status: data.status as 'active' | 'expired' | 'terminated',
        },
        ...cs,
      ]);
    }
    setShowForm(false);
    setEditContract(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contratos</h1>
          <p className="text-gray-500 dark:text-gray-400">Gestão de contratos de locação.</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={handleAdd}>
          <Plus className="w-5 h-5" /> Novo Contrato
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            className="input pl-10"
            placeholder="Buscar por imóvel ou inquilino..."
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
              <th>Imóvel</th>
              <th>Inquilino</th>
              <th>Início</th>
              <th>Término</th>
              <th>Valor (R$)</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-8">Nenhum contrato encontrado.</td>
              </tr>
            )}
            {filtered.map(contract => {
              const property = properties.find(p => p.id === contract.propertyId);
              const tenant = tenants.find(t => t.id === contract.tenantId);
              return (
                <tr key={contract.id}>
                  <td>{property?.title || '-'}</td>
                  <td>{tenant?.name || '-'}</td>
                  <td>{contract.startDate ? new Date(contract.startDate).toLocaleDateString('pt-BR') : '-'}</td>
                  <td>{contract.endDate ? new Date(contract.endDate).toLocaleDateString('pt-BR') : '-'}</td>
                  <td>R$ {contract.rentValue.toLocaleString('pt-BR')}</td>
                  <td>
                    <span className={`badge ${
                      contract.status === 'active' ? 'badge-success' :
                      contract.status === 'expired' ? 'badge-warning' :
                      'badge-danger'
                    }`}>{contract.status === 'active' ? 'Ativo' : contract.status === 'expired' ? 'Expirado' : 'Rescindido'}</span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-secondary p-1" title="Editar" onClick={() => handleEdit(contract)}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="btn-danger p-1" title="Remover" onClick={() => handleDelete(contract)}>
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
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{editContract ? 'Editar Contrato' : 'Novo Contrato'}</h2>
            <ContractForm
              initialData={editContract}
              properties={properties}
              tenants={tenants}
              onSubmit={handleFormSubmit}
              onCancel={() => { setShowForm(false); setEditContract(null); }}
            />
          </div>
        </div>
      )}

      {/* Modal de confirmação de remoção */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in" role="dialog" aria-modal="true">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md animate-fade-in">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Remover Contrato</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Tem certeza que deseja remover este contrato?</p>
            <div className="flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn-danger" onClick={confirmDeleteContract}>Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Contracts); 