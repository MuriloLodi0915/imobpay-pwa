import React, { useEffect, useState } from 'react';
import { Report } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editReport, setEditReport] = useState<Report | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Report | null>(null);

  const fetchReports = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', user.id);
    setReports(data || []);
  };

  useEffect(() => {
    fetchReports();
  }, [user]);

  const filtered = reports.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setEditReport(null);
    setShowForm(true);
  };

  const handleEdit = (report: Report) => {
    setEditReport(report);
    setShowForm(true);
  };

  const handleDelete = (report: Report) => {
    setConfirmDelete(report);
  };

  const confirmDeleteReport = async () => {
    if (!user || !confirmDelete) return;
    await supabase
      .from('reports')
      .delete()
      .eq('id', confirmDelete.id)
      .eq('user_id', user.id);
    fetchReports();
    setConfirmDelete(null);
  };

  const handleFormSubmit = async (data: Omit<Report, 'id' | 'createdAt'>) => {
    if (!user) return;
    if (editReport) {
      await supabase
        .from('reports')
        .update({ ...data })
        .eq('id', editReport.id)
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('reports')
        .insert([{ ...data, user_id: user.id }]);
    }
    fetchReports();
    setShowForm(false);
    setEditReport(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
          <p className="text-gray-500 dark:text-gray-400">Relatórios financeiros e de gestão.</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={handleAdd}>
          Novo Relatório
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            className="input pl-10"
            placeholder="Buscar por nome..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data de Criação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-gray-400 py-8">Nenhum relatório encontrado.</td>
              </tr>
            )}
            {filtered.map(report => (
              <tr key={report.id}>
                <td>{report.name}</td>
                <td>{report.created_at ? new Date(report.created_at).toLocaleDateString('pt-BR') : '-'}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn-secondary p-1" title="Editar" onClick={() => handleEdit(report)}>
                      Editar
                    </button>
                    <button className="btn-danger p-1" title="Remover" onClick={() => handleDelete(report)}>
                      Remover
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
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{editReport ? 'Editar Relatório' : 'Novo Relatório'}</h2>
            {/* Substitua pelo seu formulário de relatório */}
            {/* <ReportForm
              initialData={editReport}
              onSubmit={handleFormSubmit}
              onCancel={() => { setShowForm(false); setEditReport(null); }}
            /> */}
            <button onClick={() => setShowForm(false)}>Fechar</button>
          </div>
        </div>
      )}

      {/* Modal de confirmação de remoção */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md animate-fade-in">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Remover Relatório</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Tem certeza que deseja remover o relatório <b>{confirmDelete.name}</b>?</p>
            <div className="flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn-danger" onClick={confirmDeleteReport}>Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;