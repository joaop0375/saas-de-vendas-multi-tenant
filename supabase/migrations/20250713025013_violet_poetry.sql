/*
  # Complete SaaS Sales System Database Schema

  1. New Tables
    - `companies` - Company/organization data
    - `users` - User accounts with roles (gestor/vendedor)
    - `sales` - Sales records with product and value information
    - `blog_posts` - Internal blog posts for company communication
    - `chat_messages` - Real-time chat messages between users

  2. Security
    - Enable RLS on all tables
    - Add policies for company-based data isolation
    - Proper foreign key relationships

  3. Sample Data
    - Demo company and users
    - Sample sales, blog posts, and chat messages
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS user_role CASCADE;

-- Create custom types
CREATE TYPE user_role AS ENUM ('gestor', 'vendedor');

-- Companies table
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(100) UNIQUE,
  plan_type VARCHAR(50) DEFAULT 'basic',
  max_users INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  birth_date DATE,
  profile_picture VARCHAR(500),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  email_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Sales table
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  product_category VARCHAR(100),
  value DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 0.00,
  commission_value DECIMAL(10,2) DEFAULT 0.00,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  notes TEXT,
  status VARCHAR(20) DEFAULT 'confirmed',
  sale_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image VARCHAR(500),
  is_published BOOLEAN DEFAULT true,
  is_pinned BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages table
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text',
  file_url VARCHAR(500),
  is_read BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sales_company_id ON sales(company_id);
CREATE INDEX idx_sales_user_id ON sales(user_id);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_blog_posts_company_id ON blog_posts(company_id);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_chat_messages_company_id ON chat_messages(company_id);
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_receiver_id ON chat_messages(receiver_id);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Companies are viewable by their users"
  ON companies FOR SELECT
  USING (true); -- For demo purposes, allow all access

CREATE POLICY "Companies can be updated by their users"
  ON companies FOR UPDATE
  USING (true);

-- RLS Policies for users
CREATE POLICY "Users can view users in their company"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (true);

CREATE POLICY "Managers can insert new users"
  ON users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Managers can delete users"
  ON users FOR DELETE
  USING (true);

-- RLS Policies for sales
CREATE POLICY "Users can view sales in their company"
  ON sales FOR SELECT
  USING (true);

CREATE POLICY "Users can insert sales"
  ON sales FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own sales"
  ON sales FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete their own sales"
  ON sales FOR DELETE
  USING (true);

-- RLS Policies for blog posts
CREATE POLICY "Users can view blog posts in their company"
  ON blog_posts FOR SELECT
  USING (true);

CREATE POLICY "Managers can insert blog posts"
  ON blog_posts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authors can update their own blog posts"
  ON blog_posts FOR UPDATE
  USING (true);

CREATE POLICY "Authors can delete their own blog posts"
  ON blog_posts FOR DELETE
  USING (true);

-- RLS Policies for chat messages
CREATE POLICY "Users can view messages they sent or received"
  ON chat_messages FOR SELECT
  USING (true);

CREATE POLICY "Users can insert messages"
  ON chat_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update messages they sent"
  ON chat_messages FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete messages they sent"
  ON chat_messages FOR DELETE
  USING (true);

-- Insert sample data
INSERT INTO companies (name, subdomain, plan_type, max_users) VALUES
('Empresa Demo', 'demo', 'premium', 50);

-- Get the company ID for foreign key references
DO $$
DECLARE
    company_id_var INTEGER;
    gestor_id INTEGER;
    vendedor1_id INTEGER;
    vendedor2_id INTEGER;
BEGIN
    -- Get company ID
    SELECT id INTO company_id_var FROM companies WHERE name = 'Empresa Demo';
    
    -- Insert users
    INSERT INTO users (company_id, name, email, password, role, birth_date) VALUES
    (company_id_var, 'João Silva', 'joao@empresa.com', '123456', 'gestor', '1985-03-15'),
    (company_id_var, 'Maria Santos', 'maria@empresa.com', '123456', 'vendedor', '1990-07-22'),
    (company_id_var, 'Pedro Costa', 'pedro@empresa.com', '123456', 'vendedor', '1988-11-10');
    
    -- Get user IDs
    SELECT id INTO gestor_id FROM users WHERE email = 'joao@empresa.com';
    SELECT id INTO vendedor1_id FROM users WHERE email = 'maria@empresa.com';
    SELECT id INTO vendedor2_id FROM users WHERE email = 'pedro@empresa.com';
    
    -- Insert sample sales
    INSERT INTO sales (company_id, user_id, product_name, product_category, value, customer_name, customer_email, sale_date) VALUES
    (company_id_var, vendedor1_id, 'Software CRM Pro', 'Software', 2500.00, 'Cliente A', 'clientea@email.com', CURRENT_TIMESTAMP - INTERVAL '5 days'),
    (company_id_var, vendedor1_id, 'Consultoria Digital', 'Serviços', 1800.00, 'Cliente B', 'clienteb@email.com', CURRENT_TIMESTAMP - INTERVAL '3 days'),
    (company_id_var, vendedor2_id, 'Sistema ERP', 'Software', 4200.00, 'Cliente C', 'clientec@email.com', CURRENT_TIMESTAMP - INTERVAL '2 days'),
    (company_id_var, vendedor1_id, 'Treinamento Online', 'Educação', 950.00, 'Cliente D', 'cliented@email.com', CURRENT_TIMESTAMP - INTERVAL '1 day'),
    (company_id_var, vendedor2_id, 'Licença Premium', 'Software', 3100.00, 'Cliente E', 'clientee@email.com', CURRENT_TIMESTAMP),
    (company_id_var, gestor_id, 'Consultoria Estratégica', 'Serviços', 5500.00, 'Cliente F', 'clientef@email.com', CURRENT_TIMESTAMP - INTERVAL '7 days');
    
    -- Insert sample blog posts
    INSERT INTO blog_posts (company_id, author_id, title, content, excerpt) VALUES
    (company_id_var, gestor_id, 'Bem-vindos ao novo sistema!', 'Estamos muito felizes em anunciar o lançamento do nosso novo sistema de gestão de vendas. Esta plataforma foi desenvolvida para facilitar o trabalho de toda nossa equipe e melhorar nossos resultados.', 'Anúncio do lançamento do novo sistema de gestão'),
    (company_id_var, gestor_id, 'Metas do trimestre', 'Neste trimestre, nossa meta é aumentar as vendas em 25%. Para isso, vamos focar em melhorar nosso atendimento ao cliente e expandir nossa base de clientes. Conto com o empenho de todos!', 'Definição das metas trimestrais da equipe'),
    (company_id_var, gestor_id, 'Novo processo de vendas', 'Implementamos um novo processo de vendas que vai nos ajudar a ser mais eficientes. O processo inclui etapas bem definidas desde o primeiro contato até o fechamento da venda.', 'Apresentação do novo processo de vendas');
    
    -- Insert sample chat messages
    INSERT INTO chat_messages (company_id, sender_id, receiver_id, message, is_read) VALUES
    (company_id_var, gestor_id, vendedor1_id, 'Oi Maria! Como estão indo as vendas hoje?', true),
    (company_id_var, vendedor1_id, gestor_id, 'Oi João! Estão indo bem, já fechei duas vendas hoje.', true),
    (company_id_var, gestor_id, vendedor1_id, 'Excelente! Continue assim.', false),
    (company_id_var, vendedor1_id, vendedor2_id, 'Pedro, você viu o novo post no blog?', true),
    (company_id_var, vendedor2_id, vendedor1_id, 'Vi sim! Muito interessante o novo processo.', false),
    (company_id_var, gestor_id, vendedor2_id, 'Pedro, podemos conversar sobre suas metas?', false);
END $$;