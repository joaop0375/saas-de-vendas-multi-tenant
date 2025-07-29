-- Insert sample data for development and testing

-- Insert companies
INSERT INTO companies (id, name, subdomain, plan_type, max_users, is_active) VALUES 
(1, 'TechSales Pro', 'techsales', 'premium', 50, true),
(2, 'Vendas Master', 'vendasmaster', 'basic', 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  subdomain = EXCLUDED.subdomain,
  plan_type = EXCLUDED.plan_type,
  max_users = EXCLUDED.max_users,
  is_active = EXCLUDED.is_active;

-- Insert users (password hash for "123456")
INSERT INTO users (id, company_id, name, email, password, role, phone, is_active) VALUES 
(1, 1, 'João Silva', 'joao@empresa.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'gestor', '(11) 99999-9999', true),
(2, 1, 'Maria Santos', 'maria@empresa.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'vendedor', '(11) 88888-8888', true),
(3, 2, 'Carlos Oliveira', 'carlos@vendasmaster.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'gestor', '(11) 77777-7777', true)
ON CONFLICT (id) DO UPDATE SET
  company_id = EXCLUDED.company_id,
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone,
  is_active = EXCLUDED.is_active;

-- Insert sample sales
INSERT INTO sales (company_id, user_id, product_name, product_category, value, commission_rate, customer_name, customer_email, status, sale_date) VALUES 
(1, 2, 'Software CRM Pro', 'Software', 2500.00, 10.00, 'Cliente A', 'clientea@email.com', 'confirmed', '2024-01-15 10:30:00'),
(1, 2, 'Licença Premium', 'Licença', 1800.00, 8.00, 'Cliente B', 'clienteb@email.com', 'confirmed', '2024-01-14 14:20:00'),
(1, 2, 'Consultoria Estratégica', 'Serviço', 3200.00, 15.00, 'Cliente C', 'clientec@email.com', 'confirmed', '2024-01-13 16:45:00'),
(1, 2, 'Treinamento Equipe', 'Treinamento', 1200.00, 12.00, 'Cliente D', 'cliented@email.com', 'confirmed', '2024-01-12 09:15:00'),
(1, 2, 'Suporte Técnico', 'Suporte', 800.00, 5.00, 'Cliente E', 'clientee@email.com', 'confirmed', '2024-01-11 11:30:00');

-- Insert sample blog posts
INSERT INTO blog_posts (company_id, author_id, title, content, excerpt, is_published, is_pinned) VALUES 
(1, 1, 'Novas Metas para 2024', 'Estamos estabelecendo metas ambiciosas para este ano. Vamos focar em aumentar nossa base de clientes em 50% e implementar novas estratégias de vendas que nos permitirão alcançar resultados excepcionais.', 'Metas ambiciosas para crescimento em 2024', true, true),
(1, 1, 'Treinamento de Vendas', 'Lembrete importante: temos um treinamento de técnicas de vendas na próxima sexta-feira às 14h. A participação é obrigatória para toda a equipe de vendas. Será uma oportunidade única de aprimorar nossas habilidades.', 'Treinamento obrigatório na sexta-feira', true, false),
(1, 1, 'Novos Produtos Lançados', 'Temos o prazer de anunciar o lançamento de três novos produtos em nosso portfólio. Estes produtos foram desenvolvidos com base no feedback dos nossos clientes e prometem revolucionar o mercado.', 'Três novos produtos em nosso portfólio', true, false);

-- Insert sample chat messages
INSERT INTO chat_messages (company_id, sender_id, receiver_id, message, message_type, is_read) VALUES 
(1, 1, 2, 'Oi Maria! Como estão as vendas hoje?', 'text', true),
(1, 2, 1, 'Oi João! Fechei mais duas vendas hoje. Muito bom!', 'text', false),
(1, 1, 2, 'Excelente! Continue assim. Você está no caminho certo para bater a meta do mês.', 'text', false),
(1, 2, 1, 'Obrigada pelo incentivo! Vou dar o meu melhor.', 'text', false);