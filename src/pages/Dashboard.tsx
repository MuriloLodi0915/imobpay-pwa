import React from 'react';
import { 
  Building2, 
  Users, 
  FileText, 
  DollarSign, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { ResponsiveContainer } from 'recharts';
import { mockDashboardStats, mockPayments, mockAlerts, mockTenants } from '../data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const stats = mockDashboardStats;
  const recentPayments = mockPayments.slice(0, 5);
  const recentAlerts = mockAlerts.filter(alert => !alert.read).slice(0, 3);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="badge-success">Pago</span>;
      case 'pending':
        return <span className="badge-warning">Pendente</span>;
      case 'overdue':
        return <span className="badge-danger">Em Atraso</span>;
      default:
        return <span className="badge-info">{status}</span>;
    }
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-danger-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-success-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Visão geral do seu negócio imobiliário
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total de Imóveis
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.totalProperties}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-success-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Inquilinos Ativos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.totalTenants}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-warning-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Receita Mensal
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {formatCurrency(stats.monthlyIncome)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-info-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Contratos Ativos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.activeContracts}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabelas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pagamentos recentes */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Pagamentos Recentes
            </h3>
          </div>
          <div className="card-body">
            <div className="overflow-hidden">
              <table className="table">
                <thead>
                  <tr>
                    <th>Inquilino</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Vencimento</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((payment) => {
                    const tenantName = payment.contract && payment.contract.tenantId
                      ? (mockTenants.find(t => t.id === payment.contract!.tenantId)?.name || '-')
                      : '-';
                    return (
                      <tr key={payment.id}>
                        <td className="text-sm font-medium text-gray-900 dark:text-white">
                          {tenantName}
                        </td>
                        <td className="text-sm text-gray-500 dark:text-gray-400">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td>
                          {getStatusBadge(payment.status)}
                        </td>
                        <td className="text-sm text-gray-500 dark:text-gray-400">
                          {format(payment.dueDate, 'dd/MM/yyyy', { locale: ptBR })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Alertas */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Alertas Recentes
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    {getAlertIcon(alert.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {alert.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {format(alert.createdAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </p>
                  </div>
                </div>
              ))}
              {recentAlerts.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  Nenhum alerta recente
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 