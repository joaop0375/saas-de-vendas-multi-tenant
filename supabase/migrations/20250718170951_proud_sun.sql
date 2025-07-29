/*
  # Create Sample Data for SaaS de Vendas

  1. New Data
    - Sample company: "Empresa Demo"
    - Demo users: João (gestor) and Maria (vendedor)
    - Sample sales records
    - Sample blog posts
    - Sample chat messages

  2. Security
    - All data respects existing RLS policies
    - Demo users have proper roles and permissions

  3. Notes
    - This migration creates test data for development
    - Passwords are hashed for demo accounts
    - All timestamps use current time for realistic data
*/

-- Insert sample company
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

-- Insert sample users
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
  role = EXCLUDED.role,
  birth_date = EXCLUDED.birth_date,
  phone = EXCLUDED.phone,
  is_active = EXCLUDED.is_active,
  updated_at = CURRENT_TIMESTAMP;

-- Insert sample sales
INSERT INTO sales (company_id, user_id, product_name, product_category, value, commission_rate, commission_value, customer_name, customer_email, customer_phone, notes, status, sale_date, created_at, updated_at)
VALUES 
  (
    1, 2, 'Software CRM Pro', 'Software', 2500.00, 10.00, 250.00,
    'Empresa ABC Ltda', 'contato@empresaabc.com', '(11) 3333-4444',
    'Cliente interessado em expansão do sistema', 'confirmed',
    CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  ),
  (
    1, 2, 'Consultoria em Vendas', 'Serviços', 1800.00, 15.00, 270.00,
    'João Empresário', 'joao@negocio.com', '(11) 9999-8888',
    'Consultoria para otimização de processos', 'confirmed',
    CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  ),
  (
    1, 3, 'Sistema de Gestão', 'Software', 3200.00, 12.00, 384.00,
    'Tech Solutions', 'vendas@techsol.com', '(11) 5555-6666',
    'Implementação completa do sistema', 'confirmed',
    CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  ),
  (
    1, 2, 'Treinamento Equipe', 'Treinamento', 950.00, 8.00, 76.00,
    'Maria Gestora', 'maria@gestao.com', '(11) 7777-9999',
    'Treinamento para equipe de vendas', 'confirmed',
    CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  ),
  (
    1, 3, 'Licença Premium', 'Software', 4500.00, 10.00, 450.00,
    'Corporação XYZ', 'compras@xyz.com', '(11) 1111-2222',
    'Upgrade para versão premium', 'confirmed',
    CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  ),
  (
    1, 2, 'Suporte Técnico', 'Serviços', 800.00, 5.00, 40.00,
    'StartUp Inovadora', 'tech@startup.com', '(11) 4444-5555',
    'Contrato de suporte mensal', 'confirmed',
    CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );

-- Insert sample blog posts
INSERT INTO blog_posts (company_id, author_id, title, content, excerpt, is_published, is_pinned, views_count, created_at, updated_at)
VALUES 
  (
    1, 1, 'Bem-vindos ao nosso novo sistema!',
    'Estamos muito felizes em apresentar nosso novo sistema de gestão de vendas. Esta plataforma foi desenvolvida pensando na produtividade e eficiência da nossa equipe.\n\nPrincipais funcionalidades:\n- Dashboard interativo com métricas em tempo real\n- Gestão completa de vendas e clientes\n- Chat interno para comunicação da equipe\n- Relatórios detalhados de performance\n\nContamos com a colaboração de todos para tornar este sistema ainda melhor!',
    'Apresentamos nosso novo sistema de gestão de vendas com funcionalidades avançadas.',
    true, true, 45,
    CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP
  ),
  (
    1, 1, 'Metas do trimestre',
    'Definimos as metas para este trimestre e estamos confiantes de que nossa equipe alcançará excelentes resultados.\n\nMetas por vendedor:\n- Maria Santos: R$ 25.000\n- Pedro Costa: R$ 22.000\n\nMeta total da empresa: R$ 50.000\n\nVamos trabalhar juntos para superar essas expectativas!',
    'Conheça as metas estabelecidas para este trimestre e como alcançá-las.',
    true, false, 32,
    CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP
  ),
  (
    1, 1, 'Dicas de vendas para o mês',
    'Compartilho algumas dicas importantes para melhorar nossa performance de vendas:\n\n1. Sempre qualifique bem o lead antes de apresentar a proposta\n2. Escute mais do que fale durante as reuniões\n3. Faça perguntas abertas para entender as necessidades do cliente\n4. Sempre faça follow-up após as apresentações\n5. Mantenha o CRM sempre atualizado\n\nLembrem-se: vendas é sobre relacionamento e confiança!',
    'Dicas práticas para melhorar a performance de vendas da equipe.',
    true, false, 28,
    CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP
  );

-- Insert sample chat messages
INSERT INTO chat_messages (company_id, sender_id, receiver_id, message, message_type, is_read, created_at, updated_at)
VALUES 
  (
    1, 1, 2, 'Oi Maria! Como está indo com o cliente da Tech Solutions?', 'text', true,
    CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP
  ),
  (
    1, 2, 1, 'Oi João! Está indo muito bem. Eles já aprovaram a proposta e vamos fechar amanhã!', 'text', true,
    CURRENT_TIMESTAMP - INTERVAL '1 hour 50 minutes', CURRENT_TIMESTAMP
  ),
  (
    1, 1, 2, 'Excelente! Parabéns pelo trabalho. Não esqueça de atualizar o CRM.', 'text', true,
    CURRENT_TIMESTAMP - INTERVAL '1 hour 45 minutes', CURRENT_TIMESTAMP
  ),
  (
    1, 2, 1, 'Já atualizei! Obrigada pelo apoio 😊', 'text', false,
    CURRENT_TIMESTAMP - INTERVAL '1 hour 40 minutes', CURRENT_TIMESTAMP
  ),
  (
    1, 1, 3, 'Pedro, como está o follow-up com a Corporação XYZ?', 'text', true,
    CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_TIMESTAMP
  ),
  (
    1, 3, 1, 'Oi João! Eles pediram uma reunião para próxima semana. Vou agendar hoje.', 'text', true,
    CURRENT_TIMESTAMP - INTERVAL '2 hours 45 minutes', CURRENT_TIMESTAMP
  ),
  (
    1, 2, 3, 'Oi Pedro! Vi que você fechou uma venda grande ontem. Parabéns!', 'text', true,
    CURRENT_TIMESTAMP - INTERVAL '30 minutes', CURRENT_TIMESTAMP
  ),
  (
    1, 3, 2, 'Obrigado Maria! Foi um trabalho em equipe. Sua dica sobre qualificação de leads ajudou muito!', 'text', false,
    CURRENT_TIMESTAMP - INTERVAL '25 minutes', CURRENT_TIMESTAMP
  );

-- Update sequence values to avoid conflicts
SELECT setval('companies_id_seq', (SELECT MAX(id) FROM companies));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('sales_id_seq', (SELECT MAX(id) FROM sales));
SELECT setval('blog_posts_id_seq', (SELECT MAX(id) FROM blog_posts));
SELECT setval('chat_messages_id_seq', (SELECT MAX(id) FROM chat_messages));