# 📋 Project Structure - ArcSat CRM

## 🌳 Árvore Completa do Projeto

```
ArcSat/
│
├── 📁 .github/                          # GitHub configurações
│   ├── workflows/
│   │   └── ci-cd.yml                    # Pipeline CI/CD
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md                # Template para bugs
│   │   └── feature_request.md           # Template para features
│   └── PULL_REQUEST_TEMPLATE.md         # Template para PRs
│
├── 📁 .vscode/                          # VS Code configurações
│   ├── extensions.json                  # Extensões recomendadas
│   └── settings.json                    # Configurações do workspace
│
├── 📁 docs/                             # Documentação
│   ├── index.html                       # Docsify home
│   ├── API.md                           # Documentação da API
│   ├── DEVELOPMENT.md                   # Guia de desenvolvimento
│   ├── QUICKSTART.md                    # Guia rápido
│   ├── api/                             # Docs detalhadas da API
│   ├── guides/                          # Guias e tutoriais
│   └── infrastructure/                  # Arquitetura e infra
│
├── 📁 frontend/                         # Aplicações frontend
│   └── arcsat-landing/                  # Landing page Next.js
│       ├── 📁 app/                      # App Router (Next.js 16)
│       │   ├── layout.tsx               # Layout principal
│       │   ├── page.tsx                 # Homepage
│       │   ├── globals.css              # Estilos globais
│       │   ├── crm/                     # Módulo CRM
│       │   │   └── page.tsx
│       │   └── dashboard/               # Dashboard
│       │       └── page.tsx
│       ├── 📁 components/               # Componentes React
│       │   ├── Navbar.tsx
│       │   └── SystemsShowcase.tsx
│       ├── 📁 public/                   # Assets estáticos
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.ts
│       ├── tailwind.config.js
│       └── postcss.config.mjs
│
├── 📁 src/                              # Código backend
│   ├── 📁 config/                       # Configurações
│   │   └── monitoring.js                # Application Insights
│   │
│   ├── 📁 middleware/                   # Middlewares Express
│   │   ├── auth.js                      # Autenticação JWT
│   │   ├── errorHandler.js              # Tratamento de erros
│   │   ├── validation.js                # Validação de dados
│   │   └── rateLimit.js                 # Rate limiting
│   │
│   ├── 📁 models/                       # Modelos MongoDB/Mongoose
│   │   ├── user.js                      # Usuários
│   │   ├── company.js                   # Empresas
│   │   ├── customDomain.js              # Domínios customizados
│   │   └── webhook.js                   # Webhooks
│   │
│   ├── 📁 routes/                       # Rotas da API
│   │   ├── auth.js                      # Autenticação
│   │   ├── cnpj.js                      # Consulta CNPJ
│   │   ├── users.js                     # CRUD usuários
│   │   └── companies.js                 # CRUD empresas
│   │
│   ├── 📁 controllers/                  # Controllers (lógica)
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── companyController.js
│   │
│   ├── 📁 services/                     # Serviços e lógica de negócio
│   │   ├── emailService.js
│   │   ├── cnpjService.js
│   │   └── notificationService.js
│   │
│   ├── 📁 utils/                        # Utilitários
│   │   ├── multiTenant.js               # Lógica multi-tenant
│   │   ├── validators.js                # Validadores customizados
│   │   └── helpers.js                   # Funções auxiliares
│   │
│   ├── db.js                            # Conexão MongoDB
│   └── server.js                        # Entry point
│
├── 📁 tests/                            # Testes
│   ├── setup.js                         # Setup de testes
│   ├── 📁 unit/                         # Testes unitários
│   │   ├── models/
│   │   ├── controllers/
│   │   └── utils/
│   ├── 📁 integration/                  # Testes de integração
│   │   ├── auth.test.js
│   │   └── companies.test.js
│   └── 📁 e2e/                          # Testes end-to-end
│
├── 📁 scripts/                          # Scripts utilitários
│   ├── seed-db.js                       # Popular banco com dados
│   ├── clean-test-db.js                 # Limpar banco de teste
│   └── mongo-init.js                    # Inicializar MongoDB
│
├── 📁 logs/                             # Logs da aplicação
│   ├── access.log
│   ├── error.log
│   └── combined.log
│
├── 📁 app/                              # [Legacy] Migrar para src/
├── 📁 components/                       # [Legacy] Migrar para src/
│
├── 📄 .dockerignore                     # Arquivos ignorados no Docker
├── 📄 .editorconfig                     # Configuração de editores
├── 📄 .env.example                      # Exemplo de variáveis
├── 📄 .env.test                         # Variáveis de teste
├── 📄 .eslintrc.json                    # Configuração ESLint
├── 📄 .gitignore                        # Arquivos ignorados no Git
├── 📄 .prettierrc                       # Configuração Prettier
├── 📄 CHANGELOG.md                      # Histórico de mudanças
├── 📄 CONTRIBUTING.md                   # Guia de contribuição
├── 📄 Dockerfile                        # Imagem Docker
├── 📄 docker-compose.yml                # Orquestração Docker
├── 📄 jest.config.js                    # Configuração Jest
├── 📄 LICENSE                           # Licença
├── 📄 package.json                      # Dependências backend
├── 📄 package-lock.json                 # Lock de dependências
├── 📄 README.md                         # Documentação principal
├── 📄 SECURITY.md                       # Política de segurança
├── 📄 playground-1.mongodb.js           # Playground MongoDB
└── 📄 test-mongodb-quick.js             # Teste rápido MongoDB
```

## 📊 Estrutura por Responsabilidade

### 🎨 Frontend (Next.js + React)

```
frontend/arcsat-landing/
├── app/              # Páginas e layouts (App Router)
├── components/       # Componentes reutilizáveis
├── public/           # Assets estáticos (imagens, fonts)
├── styles/           # Estilos globais e temas
└── lib/              # Utilitários e helpers
```

### ⚙️ Backend (Node.js + Express)

```
src/
├── config/           # Configurações (DB, monitoring, etc)
├── controllers/      # Lógica de negócio
├── middleware/       # Middlewares (auth, validation, etc)
├── models/           # Schemas e modelos de dados
├── routes/           # Definição de rotas
├── services/         # Serviços externos e integrações
├── utils/            # Funções utilitárias
├── db.js             # Conexão com banco de dados
└── server.js         # Inicialização do servidor
```

### 🧪 Testes

```
tests/
├── unit/             # Testes de unidade (funções isoladas)
├── integration/      # Testes de integração (APIs)
├── e2e/              # Testes end-to-end (fluxos completos)
└── setup.js          # Configuração de testes
```

### 📚 Documentação

```
docs/
├── api/              # Documentação detalhada da API
├── guides/           # Tutoriais e guias
├── infrastructure/   # Arquitetura e infraestrutura
├── API.md            # Referência rápida da API
├── DEVELOPMENT.md    # Guia de desenvolvimento
└── QUICKSTART.md     # Início rápido
```

## 🔄 Fluxo de Dados

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       ├─── HTTP Request
       │
┌──────▼──────────┐
│   Next.js       │
│   Frontend      │
│   (Port 3000)   │
└──────┬──────────┘
       │
       ├─── API Call
       │
┌──────▼──────────┐
│   Express       │
│   Backend       │
│   (Port 5500)   │
├─────────────────┤
│   Middleware    │
│   - Auth        │
│   - Validation  │
│   - Rate Limit  │
└──────┬──────────┘
       │
       ├─── Query/Save
       │
┌──────▼──────────┐
│   MongoDB       │
│   Atlas         │
│   (Cosmos DB)   │
└─────────────────┘
```

## 📦 Módulos Principais

### 1. Autenticação (`src/routes/auth.js`)
- Registro de usuários
- Login/Logout
- Geração de JWT
- Validação de tokens

### 2. Gestão de Empresas (`src/models/company.js`)
- CRUD de empresas
- Validação de CNPJ
- Multi-tenant
- Categorização

### 3. Usuários (`src/models/user.js`)
- CRUD de usuários
- Roles e permissões
- Hash de senhas
- Associação com empresas

### 4. Integração CNPJ (`src/routes/cnpj.js`)
- Consulta de dados empresariais
- Cache de resultados
- Validação de CNPJ

## 🎯 Padrões de Organização

### Nomenclatura de Arquivos

- **Models**: Singular, PascalCase → `user.js`, `company.js`
- **Routes**: Plural, camelCase → `users.js`, `companies.js`
- **Controllers**: PascalCase + Controller → `UserController.js`
- **Tests**: Nome + `.test.js` → `user.test.js`
- **Utils**: camelCase → `validators.js`, `helpers.js`

### Estrutura de Arquivo

```javascript
// 1. Imports
import express from "express";
import Model from "../models/model.js";

// 2. Constantes
const router = express.Router();

// 3. Funções/Controllers
const getAll = async (req, res) => { /* ... */ };
const getOne = async (req, res) => { /* ... */ };

// 4. Rotas
router.get("/", getAll);
router.get("/:id", getOne);

// 5. Export
export default router;
```

## 🚀 Extensibilidade

Para adicionar novos módulos:

1. **Model**: Criar em `src/models/`
2. **Routes**: Criar em `src/routes/`
3. **Controller**: Criar em `src/controllers/`
4. **Tests**: Criar em `tests/unit/` e `tests/integration/`
5. **Docs**: Atualizar `docs/API.md`
6. **Register**: Adicionar rota no `src/server.js`

## 📈 Próximas Melhorias

- [ ] Migrar `app/` e `components/` para `src/`
- [ ] Adicionar `src/validators/` para validações Joi/Yup
- [ ] Criar `src/types/` para tipos TypeScript
- [ ] Adicionar `docs/diagrams/` para diagramas de arquitetura
- [ ] Implementar `src/jobs/` para tarefas agendadas

---

**Última atualização**: 2025-10-27
