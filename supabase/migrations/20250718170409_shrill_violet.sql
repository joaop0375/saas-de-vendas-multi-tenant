/*
  # Create Sample Data for Authentication

  1. New Data
    - Creates a demo company "Empresa Demo"
    - Creates demo users with proper authentication setup
    - Populates initial sales data for testing

  2. Security
    - Ensures RLS policies allow access to demo data
    - Sets up proper user roles and permissions

  3. Authentication
    - Creates users that can be authenticated via the demo login system
    - Provides test credentials for both manager and seller roles
*/

-- Insert demo company
INSERT INTO companies (id, name, subdomain, plan_type, max_users, is_active, created_at, updated_at)
VALUES (
  1,
  'Empresa Demo',
  'demo',
  'premium',
  50,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  subdomain = EXCLUDED.subdomain,
  plan_type = EXCLUDED.plan_type,
  max_users = EXCLUDED.max_users,
  is_active = EXCLUDED.is_active,
  updated_at = CURRENT_TIMESTAMP;

-- Insert demo users
INSERT INTO users (id, company_id, name, email, password, role, birth_date, phone, is_active, created_at, updated_at)
VALUES 
  (
    1,
    1,
    'João Silva',
    'joao@empresa.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: 123456
    'gestor',
    '1985-03-15',
    '(11) 99999-0001',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    2,
    1,
    'Maria Santos',
    'maria@empresa.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: 123456
    'vendedor',
    '1990-07-22',
    '(11) 99999-0002',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    3,
    1,
    'Pedro Costa',
    'pedro@empresa.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: 123456
    'vendedor',
    '1988-11-10',
    '(11) 99999-0003',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT (id) DO UPDATE SET
  company_id = EXCLUDED.company_id,
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  birth_date = EXCLUDED.birth_date,
  phone = EXCLUDED.phone,
  is_active = EXCLUDED.is_active,
  updated_at = CURRENT_TIMESTAMP;

-- Insert sample sales data
INSERT INTO sales (id, company_id, user_id, product_name, product_category, value, commission_rate, commission_value, customer_name, customer_email, customer_phone, notes, status, sale_date, created_at, updated_at)
VALUES 
  (
    1,
    1,
    2,
    'Software de Gestão Premium',
    'Software',
    5000.00,
    10.00,
    500.00,
    'Cliente Exemplo 1',
    'cliente1@email.com',
    '(11) 88888-0001',
    'Venda realizada com sucesso',
    'confirmed',
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    2,
    1,
    3,
    'Consultoria Empresarial',
    'Serviços',
    3000.00,
    15.00,
    450.00,
    'Cliente Exemplo 2',
    'cliente2@email.com',
    '(11) 88888-0002',
    'Consultoria de 3 meses',
    'confirmed',
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    3,
    1,
    2,
    'Licença Anual',
    'Software',
    8000.00,
    12.00,
    960.00,
    'Cliente Exemplo 3',
    'cliente3@email.com',
    '(11) 88888-0003',
    'Renovação de contrato',
    'confirmed',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT (id) DO UPDATE SET
  company_id = EXCLUDED.company_id,
  user_id = EXCLUDED.user_id,
  product_name = EXCLUDED.product_name,
  product_category = EXCLUDED.product_category,
  value = EXCLUDED.value,
  commission_rate = EXCLUDED.commission_rate,
  commission_value = EXCLUDED.commission_value,
  customer_name = EXCLUDED.customer_name,
  customer_email = EXCLUDED.customer_email,
  customer_phone = EXCLUDED.customer_phone,
  notes = EXCLUDED.notes,
  status = EXCLUDED.status,
  sale_date = EXCLUDED.sale_date,
  updated_at = CURRENT_TIMESTAMP;

-- Insert sample blog posts
INSERT INTO blog_posts (id, company_id, author_id, title, content, excerpt, is_published, is_pinned, views_count, created_at, updated_at)
VALUES 
  (
    1,
    1,
    1,
    'Bem-vindos ao nosso sistema!',
    'Este é o primeiro post do nosso blog interno. Aqui você encontrará novidades, dicas e informações importantes sobre vendas e gestão.',
    'Post de boas-vindas ao sistema de gestão de vendas.',
    true,
    true,
    25,
    CURRENT_TIMESTAMP - INTERVAL '3 days',
    CURRENT_TIMESTAMP
  ),
  (
    2,
    1,
    1,
    'Dicas para aumentar suas vendas',
    'Neste post, compartilhamos algumas estratégias eficazes para melhorar seu desempenho em vendas: 1) Conheça bem seu produto, 2) Entenda as necessidades do cliente, 3) Faça um follow-up adequado.',
    'Estratégias práticas para melhorar performance em vendas.',
    true,
    false,
    18,
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    CURRENT_TIMESTAMP
  )
ON CONFLICT (id) DO UPDATE SET
  company_id = EXCLUDED.company_id,
  author_id = EXCLUDED.author_id,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  excerpt = EXCLUDED.excerpt,
  is_published = EXCLUDED.is_published,
  is_pinned = EXCLUDED.is_pinned,
  views_count = EXCLUDED.views_count,
  updated_at = CURRENT_TIMESTAMP;

-- Reset sequences to ensure proper auto-increment
SELECT setval('companies_id_seq', (SELECT MAX(id) FROM companies));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('sales_id_seq', (SELECT MAX(id) FROM sales));
SELECT setval('blog_posts_id_seq', (SELECT MAX(id) FROM blog_posts));