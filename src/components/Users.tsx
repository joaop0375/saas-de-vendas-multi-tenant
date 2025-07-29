import React, { useState } from 'react';
import { Plus, User, Mail, Calendar, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { format } from 'date-fns';

export const Users: React.FC = () => {
  const { user, company } = useAuth();
  const { users, addUser, updateUser, deleteUser } = useData(company?.id || 1, user);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'vendedor' as 'gestor' | 'vendedor',
    birth_date: ''
  });

  const isManager = user?.role === 'gestor';

  if (!isManager) {
    return (
      <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={32} className="text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Acesso Negado</h2>
        <p className="text-gray-600">Apenas gestores podem acessar esta página.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      try {
        if (editingUser) {
          await updateUser(editingUser.id, formData);
        } else {
          await addUser({
            ...formData,
            company_id: company?.id || 1
          });
        }
        setFormData({ name: '', email: '', role: 'vendedor', birth_date: '' });
        setShowForm(false);
        setEditingUser(null);
      } catch (error) {
        console.error('Error saving user:', error);
        alert('Erro ao salvar usuário');
      }
    }
  };

  const handleEdit = (userToEdit: any) => {
    setEditingUser(userToEdit);
    setFormData({
      name: userToEdit.name,
      email: userToEdit.email,
      role: userToEdit.role,
      birth_date: userToEdit.birth_date || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await deleteUser(id);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Erro ao excluir usuário');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', email: '', role: 'vendedor', birth_date: '' });
    setShowForm(false);
    setEditingUser(null);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Usuários</h1>
          <p className="text-gray-600 mt-1">
            Gerencie os usuários da sua empresa
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome completo"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Função
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'gestor' | 'vendedor' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="vendedor">Vendedor</option>
                  <option value="gestor">Gestor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingUser ? 'Atualizar Usuário' : 'Salvar Usuário'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Lista de Usuários ({users.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {users.map((userItem) => (
            <div key={userItem.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    {userItem.profile_picture ? (
                      <img
                        src={userItem.profile_picture}
                        alt={userItem.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User size={20} className="text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{userItem.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center space-x-1">
                        <Mail size={14} />
                        <span>{userItem.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{format(new Date(userItem.created_at), 'dd/MM/yyyy')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    userItem.role === 'gestor' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {userItem.role === 'gestor' ? 'Gestor' : 'Vendedor'}
                  </span>
                  <button
                    onClick={() => handleEdit(userItem)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(userItem.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};