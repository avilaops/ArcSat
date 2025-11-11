# 🚀 Guia de Configuração e Execução - ArcSat

Este guia explica como configurar e executar o projeto ArcSat do zero.

## 📋 Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** (local ou MongoDB Atlas)
- **Git**

## 🔧 Configuração Inicial

### 1. Clonar o Repositório

```bash
git clone https://github.com/avilaops/ArcSat.git
cd ArcSat
```

### 2. Instalar Dependências

#### Backend (Raiz do Projeto)
```bash
npm install
```

Isso irá instalar todas as dependências do backend, incluindo:
- Express.js (servidor)
- Mongoose (MongoDB ODM)
- TypeScript e tipos
- E outras dependências listadas em `package.json`

#### Frontend (Landing Page)
```bash
cd frontend/arcsat-landing
npm install
cd ../..
```

Isso irá instalar todas as dependências do frontend, incluindo:
- Next.js 16.0.0
- React 19
- Tailwind CSS 4
- E outras dependências

### 3. Configurar Variáveis de Ambiente

O projeto já possui um arquivo `.env` na raiz, mas você pode precisar ajustá-lo:

```bash
# Arquivo .env já existe na raiz do projeto
# Edite conforme necessário:

# Para MongoDB local (padrão):
MONGO_URI=mongodb://localhost:27017/arcsat-development

# Para MongoDB Atlas (produção):
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/arcsat?retryWrites=true&w=majority

# Porta do servidor backend
PORT=5500

# JWT Secret (para autenticação)
JWT_SECRET=seu_segredo_jwt_super_secreto_aqui_min_32_caracteres

# URL do frontend (para CORS)
FRONTEND_URL=http://localhost:3000

# Ambiente
NODE_ENV=development
```

## 🏃 Executar o Projeto

### Opção 1: Desenvolvimento Completo (Backend + Frontend)

#### Terminal 1 - Backend:
```bash
# Na raiz do projeto
npm run dev
```

O backend estará disponível em: **http://localhost:5500**

#### Terminal 2 - Frontend:
```bash
# Na pasta do frontend
cd frontend/arcsat-landing
npm run dev
```

O frontend estará disponível em: **http://localhost:3000**

### Opção 2: Executar Apenas o Backend

```bash
npm run dev
```

### Opção 3: Executar Apenas o Frontend

```bash
cd frontend/arcsat-landing
npm run dev
```

## 🏗️ Build e Deploy de Produção

### Build do Backend

```bash
# Compilar TypeScript para JavaScript
npm run build

# Executar versão compilada
npm start
```

### Build do Frontend

```bash
cd frontend/arcsat-landing
npm run build
npm start
```

### Deploy no Azure (Frontend)

```bash
cd frontend/arcsat-landing
npm run build
az staticwebapp deploy --name arcsat-frontend --resource-group Avila --source . --location eastus2
```

### Deploy no Azure (Backend)

```bash
cd src
npm run build
az webapp up --name arcsat-api --resource-group Avila --runtime "NODE|20-lts" --location eastus2
```

## 🐳 MongoDB Setup

### Opção 1: MongoDB Local (Docker)

```bash
# Iniciar MongoDB com Docker
docker run -d -p 27017:27017 --name arcsat-mongo \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  mongo:latest

# Atualizar .env
MONGO_URI=mongodb://admin:admin123@localhost:27017/arcsat-development?authSource=admin
```

### Opção 2: MongoDB Atlas (Nuvem)

1. Criar conta em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Criar um cluster gratuito
3. Criar um usuário de banco de dados
4. Adicionar seu IP à whitelist (ou permitir acesso de qualquer lugar: 0.0.0.0/0)
5. Copiar a connection string e atualizar `.env`:

```bash
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/arcsat?retryWrites=true&w=majority
```

### Opção 3: Executar sem MongoDB (Modo Demo)

Se você não tiver MongoDB disponível e quiser apenas testar o frontend:

```bash
# Apenas frontend
cd frontend/arcsat-landing
npm run dev
```

## 🧪 Testes

### Testar Backend
```bash
npm run test
```

### Testar Conexão com MongoDB
```bash
npm run db:test
```

### Verificar Tipos TypeScript
```bash
npm run typecheck
```

### Lint do Código
```bash
npm run lint
```

## 📁 Estrutura do Projeto

```
ArcSat/
├── frontend/arcsat-landing/     # Landing page (Next.js)
│   ├── app/                     # App Router do Next.js
│   ├── components/              # Componentes React
│   └── package.json
├── src/                         # Backend (Node.js + Express)
│   ├── config/                  # Configurações
│   ├── models/                  # Modelos Mongoose
│   ├── routes/                  # Rotas da API
│   ├── middleware/              # Middlewares
│   └── server.js               # Servidor principal
├── .env                         # Variáveis de ambiente
├── package.json                 # Dependências do backend
├── tsconfig.json               # Configuração TypeScript
└── SETUP.md                    # Este arquivo
```

## 🔍 Scripts Disponíveis

### Backend (raiz do projeto)
```bash
npm run dev              # Desenvolvimento com hot-reload
npm run build            # Build TypeScript
npm start                # Executar versão de produção
npm run test             # Executar testes
npm run lint             # Verificar código
npm run db:test          # Testar conexão MongoDB
```

### Frontend
```bash
npm run dev              # Desenvolvimento (localhost:3000)
npm run build            # Build de produção
npm start                # Executar build de produção
npm run lint             # Verificar código
```

## 🚨 Troubleshooting

### Erro: "Cannot find module"
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Para o frontend
cd frontend/arcsat-landing
rm -rf node_modules package-lock.json
npm install
```

### Erro: "MongoDB connection failed"
- Verificar se MongoDB está rodando: `mongod --version` ou Docker
- Verificar connection string no `.env`
- Verificar whitelist de IPs no MongoDB Atlas

### Erro: "Port already in use"
```bash
# Backend (porta 5500)
lsof -ti:5500 | xargs kill -9

# Frontend (porta 3000)
lsof -ti:3000 | xargs kill -9
```

### Erro: TypeScript compilation errors
```bash
# Limpar cache e rebuildar
npm run build
```

## 🌐 URLs de Desenvolvimento

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5500
- **API Health**: http://localhost:5500/
- **API Auth**: http://localhost:5500/api/v1/auth
- **API CNPJ**: http://localhost:5500/api/v1/cnpj

## 📚 Documentação Adicional

- [README.md](./README.md) - Visão geral do projeto
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Arquitetura do sistema
- [ROADMAP.md](./docs/ROADMAP.md) - Roadmap de desenvolvimento

## 🆘 Suporte

- **GitHub Issues**: https://github.com/avilaops/ArcSat/issues
- **Email**: nicolas@avila.inc
- **Website**: https://avilaops.com

---

Desenvolvido com ❤️ pela equipe **Ávila Ops**
