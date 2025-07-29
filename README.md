# SaaS de Vendas

Um sistema completo de gestão de vendas multi-tenant construído com React, TypeScript, Tailwind CSS e Supabase.

## 🚀 Funcionalidades

- **Dashboard Interativo**: Métricas em tempo real e gráficos de performance
- **Gestão de Vendas**: Registro e acompanhamento de vendas
- **Gestão de Usuários**: Controle de acesso por perfil (Gestor/Vendedor)
- **Blog Interno**: Comunicação interna da empresa
- **Chat em Tempo Real**: Comunicação entre membros da equipe
- **Multi-tenant**: Suporte a múltiplas empresas
- **Design Responsivo**: Interface moderna e adaptável

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Gráficos**: Chart.js
- **Ícones**: Lucide React
- **Build**: Vite
- **Deploy**: Vercel

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd saas-vendas
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Execute o projeto:
```bash
npm run dev
```

## 🗄️ Configuração do Banco de Dados

### Supabase Setup

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o script SQL em `supabase/migrations/20250707143638_black_bridge.sql` no SQL Editor do Supabase
3. Execute o script de dados de exemplo em `supabase/migrations/create_sample_data.sql`
4. Configure as variáveis de ambiente com as credenciais do seu projeto

### Estrutura do Banco

O sistema utiliza as seguintes tabelas principais:
- `companies` - Empresas/organizações
- `users` - Usuários do sistema
- `sales` - Registro de vendas
- `blog_posts` - Posts do blog interno
- `chat_messages` - Mensagens do chat
- `user_sessions` - Controle de sessões
- `audit_logs` - Logs de auditoria

## 🌐 Deploy no Vercel

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. O deploy será automático a cada push

## 🔐 Contas de Demonstração

- **Gestor**: joao@empresa.com / 123456
- **Vendedor**: maria@empresa.com / 123456

## 📱 Funcionalidades por Perfil

### Gestor
- Dashboard completo com métricas da empresa
- Gestão de vendas de toda a equipe
- Gestão de usuários
- Publicação no blog interno
- Chat com toda a equipe

### Vendedor
- Dashboard pessoal
- Registro de suas próprias vendas
- Visualização do blog interno
- Chat com outros membros
- Gestão do próprio perfil

## 🎨 Design

O sistema possui um design moderno com:
- Gradientes e efeitos de vidro (glassmorphism)
- Animações suaves e micro-interações
- Interface responsiva
- Tema consistente com cores específicas para cada seção

## 📊 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Layout.tsx      # Layout principal
│   ├── Login.tsx       # Tela de login
│   ├── Dashboard.tsx   # Dashboard
│   ├── Sales.tsx       # Gestão de vendas
│   ├── Users.tsx       # Gestão de usuários
│   ├── Blog.tsx        # Blog interno
│   ├── Chat.tsx        # Chat interno
│   └── Profile.tsx     # Perfil do usuário
├── hooks/              # Custom hooks
│   ├── useAuth.ts      # Hook de autenticação
│   └── useData.ts      # Hook de dados
├── types/              # Definições TypeScript
├── lib/                # Configurações e utilitários
│   └── supabase.ts     # Cliente Supabase
└── main.tsx           # Ponto de entrada
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Executa o linter

## 🔄 Integração com Supabase

O sistema está totalmente integrado com o Supabase, incluindo:

- **Autenticação**: Sistema de login com fallback para contas demo
- **Banco de Dados**: Todas as operações CRUD são realizadas via Supabase
- **Real-time**: Chat e atualizações em tempo real
- **Segurança**: Row Level Security (RLS) implementado
- **Multi-tenancy**: Isolamento de dados por empresa

### Fallback para Dados Mock

O sistema possui um sistema de fallback que utiliza dados mock caso haja problemas na conexão com o Supabase, garantindo que a aplicação continue funcionando durante o desenvolvimento.

## 📄 Licença

Este projeto está sob a licença MIT.