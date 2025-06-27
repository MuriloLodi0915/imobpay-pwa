import React, { useMemo, useState } from 'react';
import { mockPayments, mockContracts } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// @ts-ignore
import { saveAs } from 'file-saver/dist/FileSaver.js';

const Reports: React.FC = () => {
  const [period, setPeriod] = useState('all');
  const [type, setType] = useState('all');

  const payments = useMemo(() => {
    let filtered = mockPayments;
    if (period !== 'all') {
      const now = new Date();
      if (period === 'last30') {
        filtered = filtered.filter(p => p.dueDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));
      } else if (period === 'last90') {
        filtered = filtered.filter(p => p.dueDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000));
      }
    }
    if (type !== 'all') {
      filtered = filtered.filter(p => p.type === type);
    }
    return filtered;
  }, [period, type]);

  const totalIncome = payments.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0);
  const totalOverdue = payments.filter(p => p.status === 'overdue').reduce((acc, p) => acc + p.amount, 0);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const pieData = [
    { name: 'Alugados', value: mockContracts.filter(c => c.status === 'active').length, color: '#22c55e' },
    { name: 'Disponíveis', value: mockContracts.length - mockContracts.filter(c => c.status === 'active').length, color: '#3b82f6' },
  ];

  // Dados para o gráfico de pagamentos por status
  const paymentStatusChartData = [
    {
      name: 'Pago',
      value: payments.filter(p => p.status === 'paid').length,
      color: '#22c55e',
    },
    {
      name: 'Pendente',
      value: payments.filter(p => p.status === 'pending').length,
      color: '#f59e42',
    },
    {
      name: 'Atrasado',
      value: payments.filter(p => p.status === 'overdue').length,
      color: '#ef4444',
    },
  ];

  const exportCSV = () => {
    const header = ['Contrato','Valor','Status','Tipo','Vencimento','Pagamento'];
    const rows = payments.map(payment => {
      const contract = mockContracts.find(c => c.id === payment.contractId);
      return [
        contract ? `#${contract.id}` : '-',
        formatCurrency(payment.amount),
        payment.status === 'paid' ? 'Pago' : payment.status === 'pending' ? 'Pendente' : 'Atrasado',
        payment.type === 'rent' ? 'Aluguel' : payment.type === 'deposit' ? 'Depósito' : payment.type === 'fine' ? 'Multa' : 'Outro',
        payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('pt-BR') : '-',
        payment.paidDate ? new Date(payment.paidDate).toLocaleDateString('pt-BR') : '-',
      ];
    });
    const csv = [header, ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'relatorio-financeiro.csv');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
      <p className="text-gray-500 dark:text-gray-400">Relatórios financeiros e de gestão.</p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gráfico de pagamentos por status */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Pagamentos por Status
            </h3>
          </div>
          <div className="card-body">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentStatusChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip formatter={(value: number) => `${value} pagamento(s)`} labelStyle={{ color: '#374151' }} />
                  <Bar dataKey="value" name="Quantidade" >
                    {paymentStatusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* Gráfico de pizza */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Status dos Imóveis
            </h3>
          </div>
          <div className="card-body">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex gap-2">
          <select className="input" value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="all">Todos os períodos</option>
            <option value="last30">Últimos 30 dias</option>
            <option value="last90">Últimos 90 dias</option>
          </select>
          <select className="input" value={type} onChange={e => setType(e.target.value)}>
            <option value="all">Todos os tipos</option>
            <option value="rent">Aluguel</option>
            <option value="deposit">Depósito</option>
            <option value="fine">Multa</option>
            <option value="other">Outro</option>
          </select>
        </div>
        <button className="btn-primary" onClick={exportCSV}>Exportar CSV</button>
      </div>

      <div className="flex gap-6">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Receita Recebida</div>
          <div className="font-bold text-success-600 dark:text-success-400">{formatCurrency(totalIncome)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Pendente</div>
          <div className="font-bold text-warning-600 dark:text-warning-400">{formatCurrency(totalPending)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Em Atraso</div>
          <div className="font-bold text-danger-600 dark:text-danger-400">{formatCurrency(totalOverdue)}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Contrato</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Tipo</th>
              <th>Vencimento</th>
              <th>Pagamento</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-8">Nenhum lançamento encontrado.</td>
              </tr>
            )}
            {payments.map(payment => {
              const contract = mockContracts.find(c => c.id === payment.contractId);
              return (
                <tr key={payment.id}>
                  <td>{contract ? `#${contract.id}` : '-'}</td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>
                    <span className={`badge ${
                      payment.status === 'paid' ? 'badge-success' :
                      payment.status === 'pending' ? 'badge-warning' :
                      'badge-danger'
                    }`}>
                      {payment.status === 'paid' ? 'Pago' : payment.status === 'pending' ? 'Pendente' : 'Atrasado'}
                    </span>
                  </td>
                  <td>{payment.type === 'rent' ? 'Aluguel' : payment.type === 'deposit' ? 'Depósito' : payment.type === 'fine' ? 'Multa' : 'Outro'}</td>
                  <td>{payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('pt-BR') : '-'}</td>
                  <td>{payment.paidDate ? new Date(payment.paidDate).toLocaleDateString('pt-BR') : '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports; 