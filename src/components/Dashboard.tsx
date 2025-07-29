import React, { useEffect, useRef } from 'react';
import { TrendingUp, Users, Target, Award, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, BarChart3, PieChart } from 'lucide-react';
import { Chart, registerables } from 'chart.js';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { format } from 'date-fns';

Chart.register(...registerables);

export const Dashboard: React.FC = () => {
  const { user, company } = useAuth();
  const { sales, users } = useData(company?.id || 1, user);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const isManager = user?.role === 'gestor';

  // Calculate metrics
  const userSales = isManager ? sales : sales.filter(sale => sale.user_id === user?.id);
  const totalSales = userSales.reduce((sum, sale) => sum + sale.value, 0);
  const averageSaleValue = userSales.length > 0 ? totalSales / userSales.length : 0;
  const salesThisMonth = userSales.filter(sale => {
    const saleDate = new Date(sale.sale_date);
    const now = new Date();
    return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
  }).length;

  const lastMonthSales = userSales.filter(sale => {
    const saleDate = new Date(sale.sale_date);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return saleDate.getMonth() === lastMonth.getMonth() && saleDate.getFullYear() === lastMonth.getFullYear();
  }).length;

  const salesGrowth = lastMonthSales > 0 ? ((salesThisMonth - lastMonthSales) / lastMonthSales) * 100 : 0;

  // Prepare chart data
  const chartData = React.useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const salesByDay = last7Days.map(date => {
      const daySales = userSales.filter(sale => 
        sale.sale_date.split('T')[0] === date
      );
      return daySales.reduce((sum, sale) => sum + sale.value, 0);
    });

    return {
      labels: last7Days.map(date => format(new Date(date), 'dd/MM')),
      datasets: [
        {
          label: 'Vendas (R$)',
          data: salesByDay,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };
  }, [userSales]);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(chartRef.current, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                callback: function(value) {
                  return 'R$ ' + value.toLocaleString('pt-BR');
                },
                color: '#6b7280'
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#6b7280'
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }: any) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} shadow-lg`}>
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            <span>{trendValue}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Bem-vindo, {user?.name}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              {isManager ? 'Painel de controle gerencial' : 'Seu painel de vendas'}
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-blue-100 text-sm">Hoje</p>
              <p className="text-2xl font-bold">{format(new Date(), 'dd/MM')}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <BarChart3 size={32} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Vendas"
          value={`R$ ${totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="bg-gradient-to-br from-green-500 to-emerald-600"
          trend="up"
          trendValue="12.5"
        />
        <StatCard
          title="Vendas Este Mês"
          value={salesThisMonth}
          icon={TrendingUp}
          color="bg-gradient-to-br from-blue-500 to-cyan-600"
          trend={salesGrowth >= 0 ? 'up' : 'down'}
          trendValue={Math.abs(salesGrowth).toFixed(1)}
        />
        <StatCard
          title="Ticket Médio"
          value={`R$ ${averageSaleValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={Target}
          color="bg-gradient-to-br from-orange-500 to-red-500"
          trend="up"
          trendValue="8.2"
        />
        {isManager && (
          <StatCard
            title="Vendedores"
            value={users.filter(u => u.role === 'vendedor').length}
            icon={Users}
            color="bg-gradient-to-br from-purple-500 to-pink-600"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Vendas dos Últimos 7 Dias
              </h2>
              <p className="text-gray-600 text-sm">Acompanhe o desempenho diário</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Vendas</span>
            </div>
          </div>
          <div className="h-64">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Performance</h3>
              <PieChart size={20} className="text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Meta Mensal</span>
                <span className="font-semibold text-gray-800">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Conversão</span>
                <span className="font-semibold text-green-600">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h3 className="font-semibold text-gray-800 mb-4">Ranking do Mês</h3>
            <div className="space-y-3">
              {users.filter(u => u.role === 'vendedor').slice(0, 3).map((seller, index) => (
                <div key={seller.id} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{seller.name}</p>
                    <p className="text-xs text-gray-500">R$ {(Math.random() * 10000).toFixed(0)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {isManager ? 'Vendas Recentes da Equipe' : 'Suas Vendas Recentes'}
            </h2>
            <p className="text-gray-600 text-sm">Últimas transações realizadas</p>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Ver todas
          </button>
        </div>
        <div className="space-y-4">
          {userSales.slice(0, 5).map((sale) => (
            <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Award size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{sale.product_name}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{isManager ? sale.seller_name : 'Você'}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{format(new Date(sale.sale_date), 'dd/MM/yyyy')}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600 text-lg">
                  R$ {sale.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500">Confirmado</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};