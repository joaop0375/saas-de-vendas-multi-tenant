import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, User, Search, Phone, Video, MoreVertical } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { format } from 'date-fns';

export const Chat: React.FC = () => {
  const { user, company } = useAuth();
  const { chatMessages, addChatMessage, users, markMessageAsRead } = useData(company?.id || 1, user);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherUsers = users.filter(u => u.id !== user?.id);
  const selectedUserData = users.find(u => u.id === selectedUser);

  const filteredUsers = otherUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get messages for the selected conversation
  const conversationMessages = chatMessages.filter(msg => 
    (msg.sender_id === user?.id && msg.receiver_id === selectedUser) ||
    (msg.sender_id === selectedUser && msg.receiver_id === user?.id)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (selectedUser) {
      const unreadMessages = conversationMessages.filter(msg => 
        msg.sender_id === selectedUser && 
        msg.receiver_id === user?.id && 
        !msg.is_read
      );
      
      unreadMessages.forEach(msg => {
        markMessageAsRead(msg.id);
      });
    }
  }, [selectedUser, conversationMessages, user?.id, markMessageAsRead]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && selectedUser) {
      try {
        await addChatMessage({
          company_id: company?.id || 1,
          sender_id: user?.id || 1,
          receiver_id: selectedUser,
          message: message.trim(),
          is_read: false
        });
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Erro ao enviar mensagem');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Chat Interno</h1>
            <p className="text-pink-100 text-lg">
              Comunicação em tempo real com sua equipe
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-pink-100 text-sm">Usuários Online</p>
              <p className="text-2xl font-bold">{otherUsers.length}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <MessageCircle size={32} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden" style={{ height: 'calc(100vh - 16rem)' }}>
        <div className="flex h-full">
          {/* Users List */}
          <div className="w-80 border-r border-gray-200/50 flex flex-col bg-gradient-to-b from-gray-50/50 to-white/50">
            <div className="p-6 border-b border-gray-200/50">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Conversas</h2>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar contatos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Nenhum usuário encontrado</p>
                </div>
              ) : (
                <div className="space-y-1 p-3">
                  {filteredUsers.map((otherUser) => {
                    const lastMessage = chatMessages
                      .filter(msg => 
                        (msg.sender_id === user?.id && msg.receiver_id === otherUser.id) ||
                        (msg.sender_id === otherUser.id && msg.receiver_id === user?.id)
                      )
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

                    const unreadCount = chatMessages.filter(msg => 
                      msg.sender_id === otherUser.id && 
                      msg.receiver_id === user?.id && 
                      !msg.is_read
                    ).length;

                    return (
                      <button
                        key={otherUser.id}
                        onClick={() => setSelectedUser(otherUser.id)}
                        className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                          selectedUser === otherUser.id
                            ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 shadow-md'
                            : 'hover:bg-white/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                              {otherUser.profile_picture ? (
                                <img
                                  src={otherUser.profile_picture}
                                  alt={otherUser.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <User size={20} className="text-white" />
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-gray-800 truncate">{otherUser.name}</p>
                              {unreadCount > 0 && (
                                <span className="bg-purple-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              {lastMessage ? lastMessage.message : 'Iniciar conversa'}
                            </p>
                            {lastMessage && (
                              <p className="text-xs text-gray-400 mt-1">
                                {format(new Date(lastMessage.created_at), 'HH:mm')}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-white/50 to-gray-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                          {selectedUserData?.profile_picture ? (
                            <img
                              src={selectedUserData.profile_picture}
                              alt={selectedUserData.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <User size={20} className="text-white" />
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{selectedUserData?.name}</h3>
                        <p className="text-sm text-green-600 font-medium">Online agora</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all">
                        <Phone size={20} />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all">
                        <Video size={20} />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/30 to-white/30">
                  {conversationMessages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MessageCircle size={32} className="text-purple-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhuma mensagem ainda</h3>
                      <p className="text-gray-500">
                        Envie uma mensagem para iniciar a conversa com {selectedUserData?.name}
                      </p>
                    </div>
                  ) : (
                    conversationMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                          msg.sender_id === user?.id ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">
                              {msg.sender_id === user?.id ? user?.name?.charAt(0) : selectedUserData?.name?.charAt(0)}
                            </span>
                          </div>
                          <div
                            className={`px-4 py-3 rounded-2xl shadow-sm ${
                              msg.sender_id === user?.id
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md'
                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{msg.message}</p>
                            <p className={`text-xs mt-1 ${
                              msg.sender_id === user?.id ? 'text-purple-100' : 'text-gray-500'
                            }`}>
                              {format(new Date(msg.created_at), 'HH:mm')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-gray-200/50 bg-white/50">
                  <form onSubmit={handleSendMessage} className="flex space-x-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Mensagem para ${selectedUserData?.name}...`}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-white/70 backdrop-blur-sm"
                    />
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50/30 to-white/30">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <MessageCircle size={40} className="text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Selecione uma conversa</h3>
                  <p className="text-gray-500">Escolha um contato para começar a conversar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};