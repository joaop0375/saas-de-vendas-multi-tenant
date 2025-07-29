import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Sale, BlogPost, ChatMessage, User } from '../types';
import { useAuth } from './useAuth';

export const useData = (companyId: number, currentUser?: User | null) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (companyId) {
      loadData();
    }
  }, [companyId, currentUser]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadSales(),
        loadBlogPosts(),
        loadChatMessages(),
        loadUsers()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSales = async () => {
    try {
      let query = supabase
        .from('sales')
        .select(`
          *,
          users!sales_user_id_fkey (name)
        `)
        .eq('company_id', companyId);

      // Se o usuário não for gestor, mostrar apenas suas próprias vendas
      if (currentUser && currentUser.role !== 'gestor') {
        query = query.eq('user_id', currentUser.id);
      }

      const { data, error } = await query.order('sale_date', { ascending: false });

      if (error) throw error;

      const salesWithSellerName = data?.map(sale => ({
        ...sale,
        seller_name: sale.users?.name
      })) || [];

      setSales(salesWithSellerName);
    } catch (error) {
      console.error('Error loading sales:', error);
      setSales([]);
    }
  };

  const loadBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          users!blog_posts_author_id_fkey (name)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const postsWithAuthorName = data?.map(post => ({
        ...post,
        author_name: post.users?.name
      })) || [];

      setBlogPosts(postsWithAuthorName);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      setBlogPosts([]);
    }
  };

  const loadChatMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:users!chat_messages_sender_id_fkey (name),
          receiver:users!chat_messages_receiver_id_fkey (name)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const messagesWithNames = data?.map(message => ({
        ...message,
        sender_name: message.sender?.name,
        receiver_name: message.receiver?.name
      })) || [];

      setChatMessages(messagesWithNames);
    } catch (error) {
      console.error('Error loading chat messages:', error);
      setChatMessages([]);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('company_id', companyId)
        .order('name');

      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  };

  const addSale = async (sale: Omit<Sale, 'id' | 'sale_date'>) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .insert([{
          ...sale,
          sale_date: new Date().toISOString()
        }])
        .select(`
          *,
          users!sales_user_id_fkey (name)
        `)
        .single();

      if (error) throw error;

      const newSale = {
        ...data,
        seller_name: data.users?.name
      };

      setSales(prev => [newSale, ...prev]);
    } catch (error) {
      console.error('Error adding sale:', error);
      throw error;
    }
  };

  const deleteSale = async (id: number) => {
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSales(prev => prev.filter(sale => sale.id !== id));
    } catch (error) {
      console.error('Error deleting sale:', error);
      throw error;
    }
  };

  const addBlogPost = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([post])
        .select(`
          *,
          users!blog_posts_author_id_fkey (name)
        `)
        .single();

      if (error) throw error;

      const newPost = {
        ...data,
        author_name: data.users?.name
      };

      setBlogPosts(prev => [newPost, ...prev]);
    } catch (error) {
      console.error('Error adding blog post:', error);
      throw error;
    }
  };

  const deleteBlogPost = async (id: number) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBlogPosts(prev => prev.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  };

  const addChatMessage = async (message: Omit<ChatMessage, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([message])
        .select(`
          *,
          sender:users!chat_messages_sender_id_fkey (name),
          receiver:users!chat_messages_receiver_id_fkey (name)
        `)
        .single();

      if (error) throw error;

      const newMessage = {
        ...data,
        sender_name: data.sender?.name,
        receiver_name: data.receiver?.name
      };

      setChatMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error adding chat message:', error);
      throw error;
    }
  };

  const addUser = async (user: Omit<User, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          ...user,
          password: 'temp123' // Default password - should be changed on first login
        }])
        .select('*')
        .single();

      if (error) throw error;

      setUsers(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const updateUser = async (id: number, updates: Partial<User>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;

      setUsers(prev => prev.map(user => user.id === id ? data : user));
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const markMessageAsRead = async (messageId: number) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;

      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  };

  return {
    sales,
    blogPosts,
    chatMessages,
    users,
    loading,
    addSale,
    deleteSale,
    addBlogPost,
    deleteBlogPost,
    addChatMessage,
    addUser,
    updateUser,
    deleteUser,
    markMessageAsRead,
    refreshData: loadData
  };
};