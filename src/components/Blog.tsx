import React, { useState } from 'react';
import { Plus, BookOpen, User, Calendar, Edit, Trash2, Heart, MessageSquare, Share2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { format } from 'date-fns';

export const Blog: React.FC = () => {
  const { user, company } = useAuth();
  const { blogPosts, addBlogPost, deleteBlogPost } = useData(company?.id || 1, user);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const isManager = user?.role === 'gestor';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.content) {
      try {
        await addBlogPost({
          company_id: company?.id || 1,
          author_id: user?.id || 1,
          title: formData.title,
          content: formData.content
        });
        setFormData({ title: '', content: '' });
        setShowForm(false);
      } catch (error) {
        console.error('Error adding blog post:', error);
        alert('Erro ao publicar post');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      try {
        await deleteBlogPost(id);
      } catch (error) {
        console.error('Error deleting blog post:', error);
        alert('Erro ao excluir post');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blog Interno</h1>
            <p className="text-orange-100 text-lg">
              {isManager ? 'Publique comunicados para sua equipe' : 'Acompanhe as novidades da empresa'}
            </p>
          </div>
          <div className="mt-6 lg:mt-0 flex items-center space-x-4">
            <div className="text-right">
              <p className="text-orange-100 text-sm">Total de Posts</p>
              <p className="text-2xl font-bold">{blogPosts.length}</p>
            </div>
            {isManager && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-white text-orange-600 px-6 py-3 rounded-xl hover:bg-orange-50 transition-all duration-200 flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Plus size={20} />
                <span>Novo Post</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && isManager && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Novo Post</h2>
              <p className="text-gray-600">Compartilhe informações importantes com sua equipe</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <BookOpen size={24} className="text-white" />
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white/50 backdrop-blur-sm"
                placeholder="Título do post"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Conteúdo
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white/50 backdrop-blur-sm resize-none"
                placeholder="Escreva o conteúdo do post..."
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold hover:scale-105"
              >
                Publicar Post
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

      {/* Blog Posts */}
      <div className="space-y-6">
        {blogPosts.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-16 shadow-lg border border-white/20 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum post publicado ainda</h3>
            <p className="text-gray-500">
              {isManager ? 'Publique o primeiro post para sua equipe' : 'Aguarde novos comunicados da gestão'}
            </p>
          </div>
        ) : (
          blogPosts.map((post) => (
            <article key={post.id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{post.author_name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar size={14} />
                      <span>{format(new Date(post.created_at), 'dd/MM/yyyy HH:mm')}</span>
                      <span>•</span>
                      <span>Gestor</span>
                    </div>
                  </div>
                </div>
                {isManager && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => console.log('Edit post:', post.id)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{post.title}</h2>
              
              <div className="prose prose-gray max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed text-lg">{post.content}</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200/50">
                <div className="flex items-center space-x-6">
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors">
                    <Heart size={18} />
                    <span className="text-sm">12</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
                    <MessageSquare size={18} />
                    <span className="text-sm">3</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors">
                    <Share2 size={18} />
                    <span className="text-sm">Compartilhar</span>
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  5 min de leitura
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};