-- Google Cloud SQL Database Schema for SaaS de Vendas
-- Execute este script no Google Cloud SQL após criar a instância

-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS saas_vendas 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE saas_vendas;

-- Tabela para armazenar as empresas/times
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE, -- Para multi-tenancy via subdomínio
    plan_type ENUM('basic', 'premium', 'enterprise') DEFAULT 'basic',
    max_users INT DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_subdomain (subdomain),
    INDEX idx_active (is_active)
) ENGINE=InnoDB;

-- Tabela de usuários, com vínculo à empresa e um papel (role)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hash da senha
    role ENUM('gestor', 'vendedor') NOT NULL,
    birth_date DATE,
    profile_picture VARCHAR(500), -- URL para Google Cloud Storage
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    email_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_email_company (email, company_id),
    INDEX idx_company_role (company_id, role),
    INDEX idx_email (email),
    INDEX idx_active (is_active)
) ENGINE=InnoDB;

-- Tabela para registrar as vendas
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    user_id INT NOT NULL, -- O vendedor que realizou a venda
    product_name VARCHAR(255) NOT NULL,
    product_category VARCHAR(100),
    value DECIMAL(12, 2) NOT NULL,
    commission_rate DECIMAL(5, 2) DEFAULT 0.00, -- Percentual de comissão
    commission_value DECIMAL(10, 2) GENERATED ALWAYS AS (value * commission_rate / 100) STORED,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    notes TEXT,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'confirmed',
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_company_date (company_id, sale_date),
    INDEX idx_user_date (user_id, sale_date),
    INDEX idx_status (status),
    INDEX idx_value (value)
) ENGINE=InnoDB;

-- Tabela para o blog interno
CREATE TABLE blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    author_id INT NOT NULL, -- O gestor que publicou
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    featured_image VARCHAR(500), -- URL para Google Cloud Storage
    is_published BOOLEAN DEFAULT TRUE,
    is_pinned BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_company_published (company_id, is_published),
    INDEX idx_created_at (created_at),
    INDEX idx_pinned (is_pinned),
    FULLTEXT idx_search (title, content, excerpt)
) ENGINE=InnoDB;

-- Tabela para o chat interno
CREATE TABLE chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message TEXT NOT NULL,
    message_type ENUM('text', 'image', 'file') DEFAULT 'text',
    file_url VARCHAR(500), -- Para arquivos no Google Cloud Storage
    is_read BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_conversation (sender_id, receiver_id, created_at),
    INDEX idx_company_unread (company_id, receiver_id, is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Tabela para sessões (opcional, para melhor controle de sessões)
CREATE TABLE user_sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id INT NOT NULL,
    company_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_user_activity (user_id, last_activity),
    INDEX idx_last_activity (last_activity)
) ENGINE=InnoDB;

-- Tabela para logs de auditoria
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_company_action (company_id, action),
    INDEX idx_user_action (user_id, action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Inserir dados de exemplo
INSERT INTO companies (name, subdomain, plan_type) VALUES 
('TechSales Pro', 'techsales', 'premium'),
('Vendas Master', 'vendasmaster', 'basic');

INSERT INTO users (company_id, name, email, password, role, phone) VALUES 
(1, 'João Silva', 'joao@techsales.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'gestor', '(11) 99999-9999'),
(1, 'Maria Santos', 'maria@techsales.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'vendedor', '(11) 88888-8888'),
(2, 'Carlos Oliveira', 'carlos@vendasmaster.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'gestor', '(11) 77777-7777');

-- Senha padrão para todos os usuários: "123456"