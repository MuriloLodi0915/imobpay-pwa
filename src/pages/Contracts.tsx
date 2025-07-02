import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Contract } from '../types';
import ContractForm from '../components/ContractForm';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

const Contracts: React.FC = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editContract, setEditContract] = useState<Contract | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Contract | null>(null);

  const fetchContracts = async () => {
    if (user) {
      const { data } = await supabase
        .from('contracts')
        .select('*')
        .eq('user_id', user.id);
      setContracts(data || []);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [user]);

  const filtered = contracts.filter(c =>
    (c.status && c.status.toLowerCase().includes(search.toLowerCase()))
    // Adapte para buscar por outros campos se quiser
  );

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

  const confirmDeleteContract = async () => {
    if (confirmDelete) {
      await supabase
        .from('contracts')
        .delete()
        .eq('id', confirmDelete.id)
        .eq('user_id', user.id);
      fetchContracts();
      setConfirmDelete(null);
    }
  };

  const handleFormSubmit = async (data: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editContract) {
      await supabase
        .from('contracts')
        .update({ ...data })
        .eq('id', editContract.id)
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('contracts')
        .insert([{ ...data, user_id: user.id }]);
    }
    fetchContracts();
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
            placeholder="Buscar por status..."
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
              <th>Status</th>
              <th>Início</th>
              <th>Término</th>
              <th>Valor (R$)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-8">Nenhum contrato encontrado.</td>
              </tr>
            )}
            {filtered.map(contract => (
              <tr key={contract.id}>
                <td>{contract.status}</td>
                <td>{contract.startDate ? new Date(contract.startDate).toLocaleDateString('pt-BR') : '-'}</td>
                <td>{contract.endDate ? new Date(contract.endDate).toLocaleDateString('pt-BR') : '-'}</td>
                <td>R$ {contract.rentValue?.toLocaleString('pt-BR')}</td>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de cadastro/edição */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-lg animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{editContract ? 'Editar Contrato' : 'Novo Contrato'}</h2>
            <ContractForm
              initialData={editContract}
              onSubmit={handleFormSubmit}
              onCancel={() => { setShowForm(false); setEditContract(null); }}
            />
          </div>
        </div>
      )}

      {/* Modal de confirmação de remoção */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md animate-fade-in">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Remover Contrato</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Tem certeza que deseja remover o contrato?</p>
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

export default Contracts;