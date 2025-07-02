import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Payment } from '../types';
import FinancialForm from '../components/FinancialForm';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

const Financial: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editPayment, setEditPayment] = useState<Payment | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Payment | null>(null);

  const fetchPayments = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id);
    setPayments(data || []);
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const filtered = payments.filter(p =>
    (p.status && p.status.toLowerCase().includes(search.toLowerCase())) ||
    (p.type && p.type.toLowerCase().includes(search.toLowerCase())) ||
    (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

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

  const confirmDeletePayment = async () => {
    if (!user || !confirmDelete) return;
    await supabase
      .from('payments')
      .delete()
      .eq('id', confirmDelete.id)
      .eq('user_id', user.id);
    fetchPayments();
    setConfirmDelete(null);
  };

  const handleFormSubmit = async (data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    if (editPayment) {
      await supabase
        .from('payments')
        .update({ ...data })
        .eq('id', editPayment.id)
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('payments')
        .insert([{ ...data, user_id: user.id }]);
    }
    fetchPayments();
    setShowForm(false);
    setEditPayment(null);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

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
            placeholder="Buscar por status, tipo ou descrição..."
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
                <td colSpan={6} className="text-center text-gray-400 py-8">Nenhum lançamento encontrado.</td>
              </tr>
            )}
            {filtered.map(payment => (
              <tr key={payment.id}>
                <td>{formatCurrency(payment.value)}</td>
                <td>
                  <span className={`badge ${
                    payment.status === 'paid' ? 'badge-success' :
                    payment.status === 'pending' ? 'badge-warning' : 'badge-danger'
                  }`}>
                    {payment.status === 'paid' ? 'Pago' : payment.status === 'pending' ? 'Pendente' : 'Atrasado'}
                  </span>
                </td>
                <td>{payment.type === 'rent' ? 'Aluguel' : payment.type === 'deposit' ? 'Depósito' : payment.type === 'fine' ? 'Multa' : 'Outro'}</td>
                <td>{payment.due_date ? new Date(payment.due_date).toLocaleDateString('pt-BR') : '-'}</td>
                <td>{payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('pt-BR') : '-'}</td>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de cadastro/edição */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-lg animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{editPayment ? 'Editar Lançamento' : 'Novo Lançamento'}</h2>
            <FinancialForm
              initialData={editPayment}
              onSubmit={handleFormSubmit}
              onCancel={() => { setShowForm(false); setEditPayment(null); }}
            />
          </div>
        </div>
      )}

      {/* Modal de confirmação de remoção */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
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