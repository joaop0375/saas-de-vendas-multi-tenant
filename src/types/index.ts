export interface User {
  id: number;
  company_id: number;
  name: string;
  email: string;
  role: 'gestor' | 'vendedor';
  birth_date?: string;
  profile_picture?: string;
  phone?: string;
  is_active?: boolean;
  last_login?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at?: string;
  companies?: Company;
  users?: { name: string };
}

export interface Company {
  id: number;
  name: string;
  subdomain?: string;
  plan_type?: 'basic' | 'premium' | 'enterprise';
  max_users?: number;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Sale {
  id: number;
  company_id: number;
  user_id: number;
  product_name: string;
  product_category?: string;
  value: number;
  commission_rate?: number;
  commission_value?: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  sale_date: string;
  created_at?: string;
  updated_at?: string;
  seller_name?: string;
  users?: { name: string };
}

export interface BlogPost {
  id: number;
  company_id: number;
  author_id: number;
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  is_published?: boolean;
  is_pinned?: boolean;
  views_count?: number;
  created_at: string;
  updated_at: string;
  author_name?: string;
  users?: { name: string };
}

export interface ChatMessage {
  id: number;
  company_id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  message_type?: 'text' | 'image' | 'file';
  file_url?: string;
  is_read: boolean;
  is_deleted?: boolean;
  created_at: string;
  updated_at?: string;
  sender_name?: string;
  receiver_name?: string;
  sender?: { name: string };
  receiver?: { name: string };
}

export interface AuthState {
  user: User | null;
  company: Company | null;
  isAuthenticated: boolean;
}

export interface UserSession {
  id: string;
  user_id: number;
  company_id: number;
  ip_address?: string;
  user_agent?: string;
  last_activity: string;
  created_at: string;
}

export interface AuditLog {
  id: number;
  company_id: number;
  user_id?: number;
  action: string;
  table_name?: string;
  record_id?: number;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}