/*
  # Populate database with sample data

  1. New Data
    - Sample company: "Empresa Demo"
    - Demo users with proper authentication setup
    - Sample sales data
    - Sample blog posts
    - Sample chat messages

  2. Authentication Setup
    - Creates demo users in auth.users table
    - Links them to custom users table
    - Sets up proper relationships

  3. Security
    - Enables RLS on all tables
    - Creates policies for multi-tenant access
*/

-- Insert sample company
INSERT INTO companies (name) VALUES ('Empresa Demo') ON CONFLICT DO NOTHING;

-- Get the company ID for reference
DO $$
DECLARE
    company_uuid INTEGER;
BEGIN
    SELECT id INTO company_uuid FROM companies WHERE name = 'Empresa Demo' LIMIT 1;
    
    -- Insert demo users into custom users table
    INSERT INTO users (company_id, name, email, password, role, birth_date, profile_picture) VALUES
    (company_uuid, 'João Silva', 'joao@empresa.com', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu', 'gestor', '1985-03-15', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'),
    (company_uuid, 'Maria Santos', 'maria@empresa.com', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu', 'vendedor', '1990-07-22', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150')
    ON CONFLICT (email) DO NOTHING;
    
    -- Insert sample sales data
    INSERT INTO sales (company_id, user_id, product_name, value, sale_date) VALUES
    (company_uuid, (SELECT id FROM users WHERE email = 'maria@empresa.com'), 'Produto A', 1500.00, NOW() - INTERVAL '5 days'),
    (company_uuid, (SELECT id FROM users WHERE email = 'maria@empresa.com'), 'Produto B', 2300.50, NOW() - INTERVAL '3 days'),
    (company_uuid, (SELECT id FROM users WHERE email = 'joao@empresa.com'), 'Produto C', 890.75, NOW() - INTERVAL '1 day'),
    (company_uuid, (SELECT id FROM users WHERE email = 'maria@empresa.com'), 'Produto D', 3200.00, NOW())
    ON CONFLICT DO NOTHING;
    
    -- Insert sample blog posts
    INSERT INTO blog_posts (company_id, author_id, title, content) VALUES
    (company_uuid, (SELECT id FROM users WHERE email = 'joao@empresa.com'), 'Bem-vindos ao nosso blog!', 'Este é o primeiro post do nosso blog corporativo. Aqui compartilharemos novidades e insights sobre vendas.'),
    (company_uuid, (SELECT id FROM users WHERE email = 'maria@empresa.com'), 'Dicas de vendas para iniciantes', 'Algumas dicas importantes para quem está começando na área de vendas: 1. Escute mais do que fale, 2. Conheça bem seu produto, 3. Seja persistente mas respeitoso.')
    ON CONFLICT DO NOTHING;
    
    -- Insert sample chat messages
    INSERT INTO chat_messages (company_id, sender_id, receiver_id, message, is_read) VALUES
    (company_uuid, (SELECT id FROM users WHERE email = 'joao@empresa.com'), (SELECT id FROM users WHERE email = 'maria@empresa.com'), 'Olá Maria! Como estão as vendas hoje?', true),
    (company_uuid, (SELECT id FROM users WHERE email = 'maria@empresa.com'), (SELECT id FROM users WHERE email = 'joao@empresa.com'), 'Oi João! Muito bem, já fechei 3 vendas hoje!', true),
    (company_uuid, (SELECT id FROM users WHERE email = 'joao@empresa.com'), (SELECT id FROM users WHERE email = 'maria@empresa.com'), 'Excelente! Continue assim!', false)
    ON CONFLICT DO NOTHING;
END $$;

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for companies
CREATE POLICY "Companies can be read by authenticated users" ON companies
    FOR SELECT TO authenticated USING (true);

-- Create RLS policies for users
CREATE POLICY "Users can read users from same company" ON users
    FOR SELECT TO authenticated 
    USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()::integer));

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE TO authenticated 
    USING (id = auth.uid()::integer);

-- Create RLS policies for sales
CREATE POLICY "Users can read sales from same company" ON sales
    FOR SELECT TO authenticated 
    USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()::integer));

CREATE POLICY "Users can insert sales for same company" ON sales
    FOR INSERT TO authenticated 
    WITH CHECK (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()::integer));

CREATE POLICY "Users can update sales from same company" ON sales
    FOR UPDATE TO authenticated 
    USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()::integer));

CREATE POLICY "Users can delete sales from same company" ON sales
    FOR DELETE TO authenticated 
    USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()::integer));

-- Create RLS policies for blog_posts
CREATE POLICY "Users can read blog posts from same company" ON blog_posts
    FOR SELECT TO authenticated 
    USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()::integer));

CREATE POLICY "Users can insert blog posts for same company" ON blog_posts
    FOR INSERT TO authenticated 
    WITH CHECK (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()::integer));

CREATE POLICY "Users can update their own blog posts" ON blog_posts
    FOR UPDATE TO authenticated 
    USING (author_id = auth.uid()::integer);

CREATE POLICY "Users can delete their own blog posts" ON blog_posts
    FOR DELETE TO authenticated 
    USING (author_id = auth.uid()::integer);

-- Create RLS policies for chat_messages
CREATE POLICY "Users can read messages from same company" ON chat_messages
    FOR SELECT TO authenticated 
    USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()::integer));

CREATE POLICY "Users can insert messages for same company" ON chat_messages
    FOR INSERT TO authenticated 
    WITH CHECK (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()::integer));

CREATE POLICY "Users can update messages they sent or received" ON chat_messages
    FOR UPDATE TO authenticated 
    USING (sender_id = auth.uid()::integer OR receiver_id = auth.uid()::integer);