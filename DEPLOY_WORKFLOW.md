# 🔄 Fluxo de Deploy - ArcSat CRM

Este documento mostra visualmente como funciona o fluxo de deploy automático.

---

## 📊 Visão Geral

```
┌─────────────────┐
│   Developer     │
│   (You)         │
└────────┬────────┘
         │
         │ git push origin main
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│              GitHub Repository                           │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │        GitHub Actions Workflow                   │   │
│  │       (.github/workflows/azure-deploy.yml)       │   │
│  │                                                   │   │
│  │  1. Checkout code                                │   │
│  │  2. Setup Node.js 20.x                          │   │
│  │  3. Install dependencies (npm ci)               │   │
│  │  4. Build frontend (Next.js)                    │   │
│  │  5. Create deployment package                   │   │
│  │  6. Login to Azure (using AZURE_CREDENTIALS)    │   │
│  │  7. Deploy to Azure Web App                     │   │
│  │  8. Configure App Settings (secrets)            │   │
│  │  9. Restart Web App                             │   │
│  └─────────────────┬───────────────────────────────┘   │
│                    │                                     │
└────────────────────┼─────────────────────────────────────┘
                     │
                     │ Uses Secrets:
                     │ - AZURE_CREDENTIALS
                     │ - MONGO_ATLAS_URI
                     │ - JWT_SECRET
                     │ - OPENAI_API_KEY
                     │ - CLOUDFLARE_API_TOKEN
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    Azure Cloud                           │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Resource Group: rg-arcsat-crm            │  │
│  │                                                   │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │  App Service Plan: arcsat-crm-plan         │ │  │
│  │  │  - SKU: B1 (Basic)                         │ │  │
│  │  │  - OS: Linux                                │ │  │
│  │  │  - Region: brazilsouth                      │ │  │
│  │  └────────────────────────────────────────────┘ │  │
│  │                                                   │  │
│  │  ┌────────────────────────────────────────────┐ │  │
│  │  │  Web App: arcsat-crm                       │ │  │
│  │  │  - Runtime: Node.js 20-lts                 │ │  │
│  │  │  - URL: arcsat-crm.azurewebsites.net      │ │  │
│  │  │  - Custom Domain: crm.avila.inc (opcional) │ │  │
│  │  │                                             │ │  │
│  │  │  Environment Variables:                     │ │  │
│  │  │  - NODE_ENV=production                      │ │  │
│  │  │  - PORT=8080                                │ │  │
│  │  │  - MONGODB_URI (from secret)                │ │  │
│  │  │  - JWT_SECRET (from secret)                 │ │  │
│  │  │  - OPENAI_API_KEY (from secret)             │ │  │
│  │  │  - CLOUDFLARE_API_TOKEN (from secret)       │ │  │
│  │  └────────────────┬───────────────────────────┘ │  │
│  └───────────────────┼──────────────────────────────┘  │
│                      │                                  │
└──────────────────────┼──────────────────────────────────┘
                       │
                       │ Connects to
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│            MongoDB Atlas (External)                      │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Cluster: cluster0.npuhras.mongodb.net           │  │
│  │  Database: arcsat-crm                             │  │
│  │  User: nicolasrosaab_db_user                      │  │
│  │  Network Access: 0.0.0.0/0 (GitHub Actions)      │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Sequência Detalhada do Deploy

### 1. Developer Push

```
Developer → git push origin main → GitHub
```

**Gatilho:** Push para branch `main` ou `workflow_dispatch` manual

---

### 2. GitHub Actions Inicia

```
GitHub Actions
├── Checkout repository
├── Setup Node.js 20.x
├── npm ci (backend)
├── npm ci (frontend)
└── npm run build (frontend)
```

**Tempo estimado:** 2-3 minutos

---

### 3. Criação do Pacote de Deploy

```
Create deployment.zip
├── src/ (backend code)
├── frontend/arcsat-landing/.next/ (built frontend)
├── frontend/arcsat-landing/public/
├── package.json
└── package-lock.json
```

**Arquivos excluídos:**
- `node_modules/`
- `.env*`
- `.git*`

---

### 4. Login no Azure

```
Azure Login Action
├── Read AZURE_CREDENTIALS secret
├── Authenticate with Service Principal
│   ├── clientId: 3fdb30d7-1724-49d3-b301-3c0942f5f4b8
│   ├── tenantId: 0e53f641-197a-48b2-83a4-f8222f5d48c0
│   └── subscriptionId: 3b49f371-dd88-46c7-ba30-aeb54bd5c2f6
└── Set Azure context
```

---

### 5. Deploy para Azure Web App

```
Azure WebApp Deploy Action
├── Upload deployment.zip
├── Extract on Web App
├── Install dependencies (npm install)
└── Start application (npm start)
```

**Target:**
- Web App: `arcsat-crm`
- Resource Group: `rg-arcsat-crm`

---

### 6. Configurar App Settings

```
Configure Environment Variables
├── NODE_ENV=production
├── PORT=8080
├── MONGODB_URI (from MONGO_ATLAS_URI secret)
├── JWT_SECRET (from JWT_SECRET secret)
├── OPENAI_API_KEY (from OPENAI_API_KEY secret)
├── CLOUDFLARE_API_TOKEN (from CLOUDFLARE_API_TOKEN secret)
├── EMAIL_HOST=smtp.porkbun.com
├── EMAIL_PORT=587
├── EMAIL_USER=nicolas@avila.inc
└── FRONTEND_URL=https://crm.avila.inc
```

---

### 7. Restart Web App

```
Restart Web App
└── Force reload with new configuration
```

---

### 8. Verificação

```
Health Checks
├── Web App status: Running ✅
├── HTTP response: 200 OK ✅
└── MongoDB connection: Success ✅
```

---

## 🎯 URLs e Recursos

### GitHub

| Recurso | URL |
|---------|-----|
| Repository | https://github.com/avilaops/ArcSat |
| Actions | https://github.com/avilaops/ArcSat/actions |
| Secrets | https://github.com/avilaops/ArcSat/settings/secrets/actions |

### Azure

| Recurso | URL |
|---------|-----|
| Portal | https://portal.azure.com |
| Resource Group | https://portal.azure.com/#@/resource/subscriptions/3b49f371-dd88-46c7-ba30-aeb54bd5c2f6/resourceGroups/rg-arcsat-crm |
| Web App | https://portal.azure.com/#@/resource/subscriptions/3b49f371-dd88-46c7-ba30-aeb54bd5c2f6/resourceGroups/rg-arcsat-crm/providers/Microsoft.Web/sites/arcsat-crm |

### Aplicação

| Ambiente | URL |
|----------|-----|
| Azure Default | https://arcsat-crm.azurewebsites.net |
| Custom Domain | https://crm.avila.inc |
| Health Check | https://arcsat-crm.azurewebsites.net/api/v1/health |

---

## 📊 Métricas de Deploy

### Tempo Estimado

| Etapa | Tempo |
|-------|-------|
| Checkout & Setup | 30s |
| Install Dependencies | 1-2 min |
| Build Frontend | 1-2 min |
| Create Package | 10s |
| Deploy to Azure | 2-3 min |
| Configure & Restart | 30s |
| **Total** | **5-8 min** |

### Recursos Consumidos

| Recurso | Uso |
|---------|-----|
| GitHub Actions Minutes | ~8 min por deploy |
| Azure Bandwidth | ~50-100 MB por deploy |
| App Service | Reinício (~10s downtime) |

---

## 🔐 Segurança

### Secrets Utilizados

```
GitHub Secrets (Encrypted)
├── AZURE_CREDENTIALS ──────────► Azure Authentication
├── MONGO_ATLAS_URI ────────────► Database Connection
├── JWT_SECRET ─────────────────► API Authentication
├── OPENAI_API_KEY ─────────────► AI Features
└── CLOUDFLARE_API_TOKEN ───────► DNS/CDN Management
```

**Proteções:**
- ✅ Secrets nunca aparecem em logs
- ✅ Secrets são masked no output
- ✅ Acesso restrito ao workflow
- ✅ Criptografados em repouso

---

## 🎉 Resultado Final

Após deploy bem-sucedido:

```
✅ Aplicação rodando em produção
✅ HTTPS configurado (SSL/TLS)
✅ MongoDB conectado
✅ APIs funcionais
✅ Frontend servido
✅ Monitoramento ativo
```

**Status:** 🟢 Online  
**Health:** 🟢 Healthy  
**Deploy:** 🟢 Automated

---

## 📞 Troubleshooting

Se algo falhar, verifique:

1. **Logs do GitHub Actions:** Ver qual step falhou
2. **Logs do Azure:** `az webapp log tail --name arcsat-crm --resource-group rg-arcsat-crm`
3. **Secrets:** Confirmar todos estão configurados
4. **Azure Resources:** Confirmar Web App existe e está rodando

**Mais ajuda:** [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md#troubleshooting)

---

**Última atualização:** 27/10/2025  
**Versão:** 1.0.0
