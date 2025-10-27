# 🚀 ArcSat CRM

Sistema de Gestão Empresarial completo com CRM, ERP e funcionalidades multi-tenant.

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)
![License](https://img.shields.io/badge/license-Private-red.svg)

> 🎯 **Deploy Rápido:** Novo no projeto? Comece aqui → [📋 DEPLOY_INDEX.md](./DEPLOY_INDEX.md)

## 📚 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Desenvolvimento](#desenvolvimento)
- [Deploy](#deploy)
- [API](#api)
- [Contribuindo](#contribuindo)

## 📖 Sobre o Projeto

**ArcSat CRM** é uma plataforma SaaS multi-tenant de gestão empresarial que oferece:

- ✅ **CRM** - Gestão de clientes e relacionamentos
- ✅ **Gestão de Empresas** - Cadastro e controle de empresas
- ✅ **Multi-tenant** - Isolamento de dados por empresa
- ✅ **Autenticação JWT** - Sistema seguro de autenticação
- ✅ **Integração CNPJ** - Consulta automática de dados empresariais
- ✅ **API RESTful** - Arquitetura escalável
- ✅ **Dashboard Moderno** - Interface Next.js com React 19

## 🛠 Tecnologias

### Backend
- **Node.js 18+** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB Atlas** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas

### Frontend
- **Next.js 16** - Framework React
- **React 19.2** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **Geist UI** - Componentes

### DevOps & Cloud
- **Azure** - Cloud hosting
- **Application Insights** - Monitoramento
- **GitHub Actions** - CI/CD
- **Docker** - Containerização

## 📁 Estrutura do Projeto

```
ArcSat/
├── src/                          # Backend (Node.js + Express)
│   ├── config/                   # Configurações
│   │   └── monitoring.js         # Application Insights
│   ├── middleware/               # Middlewares
│   │   └── auth.js               # Autenticação JWT
│   ├── models/                   # Modelos MongoDB
│   │   ├── user.js               # Modelo de usuário
│   │   ├── company.js            # Modelo de empresa
│   │   ├── customDomain.js       # Domínios customizados
│   │   └── webhook.js            # Webhooks
│   ├── routes/                   # Rotas da API
│   │   ├── auth.js               # Autenticação
│   │   └── cnpj.js               # Consulta CNPJ
│   ├── utils/                    # Utilitários
│   │   └── multiTenant.js        # Lógica multi-tenant
│   ├── db.js                     # Conexão MongoDB
│   └── server.js                 # Servidor Express
├── frontend/                     # Frontend (Next.js)
│   └── arcsat-landing/
│       ├── app/                  # App Router (Next.js 16)
│       │   ├── page.tsx          # Landing page
│       │   ├── layout.tsx        # Layout principal
│       │   ├── crm/              # Módulo CRM
│       │   └── dashboard/        # Dashboard
│       ├── components/           # Componentes React
│       │   ├── Navbar.tsx
│       │   └── SystemsShowcase.tsx
│       └── public/               # Arquivos estáticos
├── docs/                         # Documentação
│   ├── index.html                # Página inicial docs
│   ├── api/                      # Documentação API
│   ├── guides/                   # Guias
│   └── infrastructure/           # Infraestrutura
├── scripts/                      # Scripts utilitários
├── logs/                         # Logs da aplicação
├── .env.example                  # Exemplo de variáveis
├── .gitignore                    # Arquivos ignorados
└── package.json                  # Dependências backend
```

## ⚙️ Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB Atlas** (conta gratuita ou paga)
- **Git**

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/avilaops/ArcSat.git
cd ArcSat
```

### 2. Instale as dependências do backend

```bash
npm install
```

### 3. Instale as dependências do frontend

```bash
cd frontend/arcsat-landing
npm install
cd ../..
```

## 🔧 Configuração

### 1. Configure as variáveis de ambiente

Copie o arquivo de exemplo e configure:

```bash
cp .env.example .env
```

### 2. Edite o arquivo `.env`

```env
# MongoDB Atlas
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/arcsat?retryWrites=true&w=majority

# Servidor
PORT=5500
NODE_ENV=development

# JWT
JWT_SECRET=seu_segredo_super_secreto_min_32_caracteres

# URLs
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5500

# Email (opcional)
EMAIL_HOST=smtp.porkbun.com
EMAIL_PORT=587
EMAIL_USER=seu-email@dominio.com
EMAIL_PASS=sua-senha

# Azure (produção)
APPLICATIONINSIGHTS_CONNECTION_STRING=
```

### 3. Configure o MongoDB Atlas

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster gratuito
3. Configure o IP de acesso (0.0.0.0/0 para desenvolvimento)
4. Crie um usuário de banco de dados
5. Copie a string de conexão para `MONGO_URI`

## 💻 Desenvolvimento

### Backend (API)

```bash
# Desenvolvimento com hot-reload
npm run dev

# Produção
npm start

# Testes
npm test

# Linting
npm run lint

# Formatação
npm run format
```

### Frontend (Next.js)

```bash
# Desenvolvimento
npm run frontend:dev

# Build de produção
npm run frontend:build

# Servir produção
cd frontend/arcsat-landing && npm start
```

### Documentação

```bash
# Servir documentação
npm run docs:serve
```

Acesse: http://localhost:3000

## 🌐 API

### Base URL

```
Development: http://localhost:5500/api/v1
Production: https://api.arcsat.com.br/api/v1
```

### Endpoints Principais

#### Autenticação

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
```

#### CNPJ

```http
GET /api/v1/cnpj/:cnpj
```

### Exemplo de Requisição

```javascript
// Login
const response = await fetch('http://localhost:5500/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'usuario@exemplo.com',
    password: 'senha123'
  })
});

const data = await response.json();
console.log(data.token); // JWT token
```

## 🚢 Deploy

### Azure App Service

#### Setup Rápido (5 minutos):

👉 **[Quick Start - Configurar GitHub Secrets](./QUICK_SECRETS_SETUP.md)**

#### Passos:

1. **Configure GitHub Secrets** - [Guia Completo](./GITHUB_SECRETS_SETUP.md)
   - `AZURE_CREDENTIALS` - Credenciais do Azure
   - `MONGO_ATLAS_URI` - Conexão MongoDB
   - `JWT_SECRET` - Chave JWT
   - `CLOUDFLARE_API_TOKEN` - Token Cloudflare
   
2. **Deploy automático via push para `main`**
   ```bash
   git push origin main
   ```

3. **Acompanhe o deploy:** https://github.com/avilaops/ArcSat/actions

📚 **Documentação Detalhada:**
- [Guia de Deploy Completo](./DEPLOY.md)
- [Setup Rápido](./QUICK-DEPLOY.md)

### Vercel (Frontend)

```bash
cd frontend/arcsat-landing
vercel --prod
```

## 📊 Monitoramento

O projeto utiliza **Azure Application Insights** para:

- Rastreamento de requisições
- Métricas de performance
- Logs de erro
- Telemetria customizada

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Testes com coverage
npm test -- --coverage

# Testes em watch mode
npm test -- --watch
```

## 📝 Padrões de Código

- **ESLint** - Linting de JavaScript
- **Prettier** - Formatação de código
- **Commits semânticos** - Conventional Commits

### Exemplo de commit

```bash
git commit -m "feat: adiciona rota de consulta CNPJ"
git commit -m "fix: corrige validação de email"
git commit -m "docs: atualiza README"
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é **PRIVADO** e de propriedade da **Ávila Inc**.

## 👥 Autores

- **Ávila Inc** - [nicolas@avila.inc](mailto:nicolas@avila.inc)

## 🔗 Links Úteis

### Documentação
- [Documentação Geral](./docs/index.html)
- [API Docs](./docs/api/)

### Deploy & CI/CD
- [⚡ Quick Start - Secrets Setup](./QUICK_SECRETS_SETUP.md) - Setup em 5 minutos
- [🔐 Guia Completo de Secrets](./GITHUB_SECRETS_SETUP.md) - Configuração detalhada
- [📋 Checklist de Setup](./SETUP_CHECKLIST.md) - Checklist passo a passo
- [🔄 Fluxo de Deploy](./DEPLOY_WORKFLOW.md) - Diagrama e explicação
- [🚀 Deploy Guide](./DEPLOY.md) - Guia de deploy completo
- [⚡ Quick Deploy](./QUICK-DEPLOY.md) - Deploy rápido

### Links Externos
- [GitHub Repository](https://github.com/avilaops/ArcSat)
- [GitHub Actions](https://github.com/avilaops/ArcSat/actions)
- [Azure Portal](https://portal.azure.com)
- [MongoDB Atlas](https://cloud.mongodb.com)

---

**Desenvolvido com ❤️ pela Ávila Inc**
