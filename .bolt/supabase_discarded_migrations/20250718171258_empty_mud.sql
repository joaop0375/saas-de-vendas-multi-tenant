@@ .. @@
 -- Insert demo users with proper password hashing (for demo purposes, using plain text)
 INSERT INTO users (company_id, name, email, password, role, birth_date, is_active, created_at, updated_at) VALUES
-(1, 'João Silva', 'joao@empresa.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'gestor', '1985-03-15', true, NOW(), NOW()),
-(1, 'Maria Santos', 'maria@empresa.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'vendedor', '1990-07-22', true, NOW(), NOW()),
-(1, 'Pedro Costa', 'pedro@empresa.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'vendedor', '1988-11-08', true, NOW(), NOW())
+(1, 'João Silva', 'joao@empresa.com', '123456', 'gestor', '1985-03-15', true, NOW(), NOW()),
+(1, 'Maria Santos', 'maria@empresa.com', '123456', 'vendedor', '1990-07-22', true, NOW(), NOW()),
+(1, 'Pedro Costa', 'pedro@empresa.com', '123456', 'vendedor', '1988-11-08', true, NOW(), NOW())
 ON CONFLICT (email) DO UPDATE SET
   name = EXCLUDED.name,
   role = EXCLUDED.role,
   birth_date = EXCLUDED.birth_date,
   updated_at = NOW();