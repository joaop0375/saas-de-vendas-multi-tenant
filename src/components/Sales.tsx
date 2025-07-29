import React, { useState } from 'react';
import { Plus, Trash2, DollarSign, Package, Calendar, Filter, Search, Download } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { format } from 'date-fns';

export const Sales: React.FC = () => {
  const { user, company } = useAuth();
  const { sales, addSale, deleteSale } = useData(company?.id || 1, user);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    product_name: '',
    value: ''
  });

  const isManager = user?.role === 'gestor';

  const filteredSales = sales.filter(sale =>
    sale.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sale.seller_name && sale.seller_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.product_name && formData.value) {
      try {
        await addSale({
          company_id: company?.id || 1,
          user_id: user?.id || 1,
          product_name: formData.product_name,
          value: parseFloat(formData.value)
        });
        setFormData({ product_name: '', value: '' });
        setShowForm(false);
      } catch (error) {
        console.error('Error adding sale:', error);
        alert('Erro ao salvar venda');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta venda?')) {
      try {
        await deleteSale(id);
      } catch (error) {
        console.error('Error deleting sale:', error);
        alert('Erro ao excluir venda');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestão de Vendas</h1>
            <p className="text-green-100 text-lg">
              {isManager ? 'Gerencie todas as vendas da empresa' : 'Gerencie suas vendas'}
            </p>
          </div>
          <div className="mt-6 lg:mt-0 flex items-center space-x-4">
            <div className="text-right">
              <p className="text-green-100 text-sm">{isManager ? 'Total de Vendas' : 'Suas Vendas'}</p>
              <p className="text-2xl font-bold">{sales.length}</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-white text-green-600 px-6 py-3 rounded-xl hover:bg-green-50 transition-all duration-200 flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus size={20} />
              <span>Nova Venda</span>
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Nova Venda</h2>
              <p className="text-gray-600">Registre uma nova venda no sistema</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Plus size={24} className="text-white" />
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Produto/Serviço
                </label>
                <input
                  type="text"
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white/50 backdrop-blur-sm"
                  placeholder="Ex: Software CRM Pro"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white/50 backdrop-blur-sm"
                  placeholder="0,00"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold hover:scale-105"
              >
                Salvar Venda
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar vendas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white/50 backdrop-blur-sm w-64"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
              <Filter size={18} className="text-gray-500" />
              <span className="text-gray-700">Filtros</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
              <Download size={18} />
              <span>Exportar</span>
            </button>
            <div className="text-sm text-gray-600">
              {filteredSales.length} de {sales.length} vendas
            </div>
          </div>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-xl font-bold text-gray-800">
            Lista de Vendas ({filteredSales.length})
          </h2>
        </div>
        
        {filteredSales.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Package size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhuma venda encontrada</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Registre sua primeira venda para começar'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Produto/Serviço
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Valor
                  </th>
                  {isManager && (
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Vendedor
                    </th>
                  )}
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-gray-200/50">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-white/70 transition-colors">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                          <Package size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{sale.product_name}</p>
                          <p className="text-sm text-gray-500">Produto</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                        <DollarSign size={16} className="mr-1" />
                        R$ {sale.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    {isManager && (
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-xs font-bold">
                              {sale.seller_name?.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-800">{sale.seller_name}</span>
                        </div>
                      </td>
                    )}
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        {format(new Date(sale.sale_date), 'dd/MM/yyyy HH:mm')}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(sale.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};