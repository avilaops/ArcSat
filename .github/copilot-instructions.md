# ArcSat - Instruções para GitHub Copilot

## 📋 Contexto do Projeto

**ArcSat** é uma plataforma CRM corporativa desenvolvida pela **Ávila Ops** com foco em automação, integrações e inteligência para escalar operações empresariais.

### Stack Tecnológico

#### Frontend
- **Next.js 16.0.0** (React 19, App Router)
- **TypeScript 5.x** (strict mode)
- **Tailwind CSS 4** (design system customizado)
- **shadcn/ui** (componentes)
- **Azure Static Web Apps** (hospedagem)

#### Backend
- **Node.js 20 LTS**
- **Express 4.19.2**
- **TypeScript 5.5.4** (strict mode)
- **MongoDB Atlas** (database)
- **Mongoose 8.6.0** (ODM)

#### DevOps & Infraestrutura
- **GitHub Actions** (CI/CD)
- **Azure Static Web Apps** (frontend)
- **Azure Functions** (backend - planejado)
- **Cloudflare** (DNS, CDN, DDoS protection)
- **Application Insights** (monitoring)

### Design System (Ávila Ops)

```typescript
const theme = {
  colors: {
    primary: '#0077FF',      // blue-spatial
    secondary: '#00E0FF',    // cyan-neon
    background: '#0B0F17',   // dark-blue-sidereal
    foreground: '#F5F9FF',   // ice-white
  },
  fonts: {
    heading: ['Poppins', 'Inter'],
    body: ['Roboto', 'Open Sans'],
  },
  style: 'glassmorphism + futuristic corporate'
}
```

---

## 🎯 Diretrizes de Desenvolvimento

### 1. Padrões de Código

#### TypeScript
- **Sempre** usar strict mode
- **Sempre** definir tipos explícitos (evitar `any`)
- Usar interfaces para objetos complexos
- Usar enums para valores fixos
- Preferir `const` sobre `let`

```typescript
// ✅ BOM
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

// ❌ EVITAR
const user: any = { ... }
```

#### React/Next.js
- Usar **Server Components** por padrão
- Client Components apenas quando necessário (`'use client'`)
- Async components para data fetching
- Colocar lógica de negócio no backend

```tsx
// ✅ Server Component (padrão)
export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}

// ✅ Client Component (quando necessário)
'use client'
export default function InteractiveButton() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

#### Estilo e UI
- **Tailwind CSS** para todos os estilos
- Usar classes do design system customizado
- Glassmorphism: `bg-white/[0.02] backdrop-blur-xl border border-white/10`
- Gradientes espaciais: `from-[#0077FF] to-[#00E0FF]`

### 2. Estrutura de Arquivos

```
ArcSat/
├── frontend/arcsat-landing/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Infrastructure.tsx
│   │   └── Footer.tsx
│   ├── public/                # Static assets
│   └── tailwind.config.ts     # Tailwind configuration
├── src/                       # Backend source
│   ├── config/               # Configuration
│   │   ├── env.ts           # Environment variables
│   │   ├── database.ts      # MongoDB connection
│   │   └── logger.ts        # Winston logger
│   ├── models/              # Mongoose models
│   │   ├── User.ts
│   │   └── Company.ts
│   ├── routes/              # Express routes
│   ├── middleware/          # Express middleware
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── docs/                     # Documentation
│   ├── ARCHITECTURE.md
│   └── ROADMAP.md
└── .github/
    ├── workflows/           # GitHub Actions
    └── copilot-instructions.md
```

### 3. Padrões de Commit

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adicionar nova funcionalidade
fix: corrigir bug
docs: atualizar documentação
style: formatação, ponto e vírgula, etc
refactor: refatoração de código
test: adicionar testes
chore: atualizar dependências, config
perf: melhorias de performance
ci: mudanças no CI/CD
```

**Exemplos:**
```bash
git commit -m "feat: adicionar componente Hero com animações"
git commit -m "fix: corrigir erro de tipo no User model"
git commit -m "docs: atualizar roadmap com novas features"
```

---

## 🚀 Tarefas Prioritárias

### ⚠️ URGENTE - Configuração CI/CD

**Status:** 🔴 BLOQUEADO - Workflows falhando

**Problema:** Secret `AZURE_STATIC_WEB_APPS_API_TOKEN` não configurado

**Ação Requerida:**
1. Abrir: https://github.com/avilaops/ArcSat/settings/secrets/actions
2. Clicar em "New repository secret"
3. Nome: `AZURE_STATIC_WEB_APPS_API_TOKEN`
4. Valor: Está salvo em `AZURE_TOKEN.txt` (raiz do projeto)
5. Clicar "Add secret"

**Depois de configurar:**
```bash
# Re-executar o último workflow
gh workflow run "ArcSat CI/CD" --ref main
```

---

### 📝 Fase 1: Backend TypeScript (EM ANDAMENTO)

#### ✅ Concluído
- [x] Configuração TypeScript (tsconfig.json)
- [x] Estrutura de pastas
- [x] Sistema de logging (Winston)
- [x] Conexão MongoDB (singleton)
- [x] Tipos e interfaces (src/types/index.ts)
- [x] Configuração de ambiente (src/config/env.ts)
- [x] Modelo User (com erros - precisa correção)

#### 🔄 Em Progresso
- [ ] **Corrigir erros TypeScript no User.ts**
  - Problema: `bcrypt` default import
  - Problema: Tipos do Mongoose Schema
  - Solução: Usar `import * as bcrypt from 'bcrypt'`

- [ ] **Criar Company.ts model**
  ```typescript
  interface ICompany {
    id: string;
    cnpj: string;
    razaoSocial: string;
    nomeFantasia: string;
    email: string;
    telefone: string;
    endereco: IEndereco;
    subscriptionPlan: SubscriptionPlan;
    subscriptionStatus: SubscriptionStatus;
    createdAt: Date;
    updatedAt: Date;
  }
  ```

- [ ] **Implementar autenticação JWT**
  - Criar `src/middleware/auth.ts`
  - Criar `src/routes/auth.ts`
  - Endpoints: `/auth/register`, `/auth/login`, `/auth/refresh`

#### 📋 Backlog
- [ ] Validação com Zod
- [ ] Rate limiting por IP
- [ ] Integração ReceitaWS (validação CNPJ)
- [ ] Testes unitários (Jest)
- [ ] API documentation (Swagger/OpenAPI)

---

### 🎨 Fase 2: Landing Page Premium (CONCLUÍDO ✅)

#### Status
- ✅ Hero component com animações
- ✅ Features component (6 cards)
- ✅ Infrastructure component (tech stack)
- ✅ Footer component completo
- ✅ Tailwind config customizado
- ✅ Build de produção funcionando
- 🔄 Deploy pendente (aguardando secret)

#### Ajustes Pendentes
- [ ] Adicionar links reais nos CTAs
- [ ] Criar páginas internas (sobre, contato, etc)
- [ ] Implementar newsletter subscription
- [ ] Adicionar Google Analytics
- [ ] Testes de performance (Lighthouse > 95)

---

### 🔐 Fase 3: Autenticação & Autorização (PLANEJADO)

- [ ] Integração NextAuth.js
- [ ] Login social (Google, Microsoft)
- [ ] MFA (two-factor authentication)
- [ ] RBAC (Role-Based Access Control)
- [ ] Session management
- [ ] Password reset flow

---

### 📊 Fase 4: Dashboard & CRUD (PLANEJADO)

- [ ] Layout do dashboard
- [ ] CRUD de empresas
- [ ] CRUD de contatos
- [ ] CRUD de interações
- [ ] Pipeline de vendas (Kanban)
- [ ] Filtros e busca avançada

---

## 🛠️ Comandos Úteis

### Frontend
```bash
cd frontend/arcsat-landing
npm install              # Instalar dependências
npm run dev             # Dev server (http://localhost:3000)
npm run build           # Build de produção
npm run lint            # Lint com ESLint
```

### Backend
```bash
npm install              # Instalar dependências
npm run dev             # Dev server com tsx watch
npm run build           # Compilar TypeScript
npm run test            # Executar testes
npm run lint            # Lint com ESLint
```

### Git
```bash
git status              # Ver mudanças
git add .               # Adicionar tudo
git commit -m "feat: ..." # Commit com mensagem
git push origin main    # Push para GitHub
```

### Azure CLI
```bash
az login                                    # Login no Azure
az staticwebapp list                       # Listar Static Web Apps
az staticwebapp secrets list --name <name> # Obter deployment token
```

---

## 🐛 Debugging

### Frontend
1. Abrir DevTools (F12)
2. Verificar Console para erros
3. Network tab para requisições
4. React DevTools para componentes

### Backend
1. Verificar logs no terminal
2. Usar `console.log()` estrategicamente
3. Debugger do VS Code (F5)
4. MongoDB Compass para verificar dados

### CI/CD
1. GitHub Actions: https://github.com/avilaops/ArcSat/actions
2. Verificar logs de cada step
3. Re-executar workflows com `gh workflow run`
4. Secrets: https://github.com/avilaops/ArcSat/settings/secrets

---

## 📚 Recursos

### Documentação Oficial
- Next.js: https://nextjs.org/docs
- TypeScript: https://www.typescriptlang.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- MongoDB: https://www.mongodb.com/docs
- Azure Static Web Apps: https://learn.microsoft.com/azure/static-web-apps

### Design System
- Ávila Ops: Design futurista corporativo
- Cores: `#0077FF`, `#00E0FF`, `#0B0F17`, `#F5F9FF`
- Estilo: Glassmorphism + gradientes espaciais
- Tipografia: Poppins/Inter (headings), Roboto/Open Sans (body)

### Referências
- ARCHITECTURE.md: Arquitetura completa do sistema
- ROADMAP.md: Roadmap de 12 semanas
- package.json: Scripts e dependências

---

## ✅ Checklist de Qualidade

Antes de commitar código:

- [ ] TypeScript compila sem erros (`npm run build`)
- [ ] ESLint passou sem warnings (`npm run lint`)
- [ ] Código segue padrões do projeto
- [ ] Commit message segue Conventional Commits
- [ ] Testado localmente
- [ ] Documentação atualizada (se necessário)
- [ ] Secrets não commitados no código

---

## 🚨 Segurança

### Nunca Commitar:
- ❌ API keys
- ❌ Tokens de acesso
- ❌ Senhas
- ❌ Connection strings com credenciais
- ❌ Certificates/chaves privadas

### Usar Sempre:
- ✅ Environment variables (`.env`)
- ✅ GitHub Secrets
- ✅ Azure Key Vault
- ✅ `.gitignore` apropriado

---

## 📞 Suporte

- **GitHub Issues**: https://github.com/avilaops/ArcSat/issues
- **Documentação**: `/docs` folder
- **Ávila Ops**: https://avilaops.com

---

**Última atualização:** 24/10/2025
**Versão:** 1.0.0
**Mantenedor:** Ávila Ops Team
