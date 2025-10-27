# 📚 Documentação de Deploy e Configuração - ArcSat CRM

Índice central de toda documentação relacionada ao deploy e configuração do GitHub Actions.

---

## 🚀 Por Onde Começar?

### Nunca configurou antes?
👉 **[QUICK_SECRETS_SETUP.md](./QUICK_SECRETS_SETUP.md)** - Setup em 5 minutos

### Quer entender tudo em detalhes?
👉 **[GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)** - Guia completo

### Prefere um checklist?
👉 **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - Passo a passo interativo

---

## 📖 Documentação Disponível

### 1. Setup e Configuração

| Documento | Descrição | Tempo | Nível |
|-----------|-----------|-------|-------|
| **[QUICK_SECRETS_SETUP.md](./QUICK_SECRETS_SETUP.md)** | Setup rápido com valores prontos | 5 min | 🟢 Iniciante |
| **[GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)** | Guia completo com explicações detalhadas | 20 min | 🟡 Intermediário |
| **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** | Checklist interativo passo a passo | 30 min | 🟢 Iniciante |

### 2. Referência Técnica

| Documento | Descrição | Tempo | Nível |
|-----------|-----------|-------|-------|
| **[DEPLOY_WORKFLOW.md](./DEPLOY_WORKFLOW.md)** | Diagrama e fluxo do deploy | 10 min | 🟡 Intermediário |
| **[SECRETS_MAPPING.md](./SECRETS_MAPPING.md)** | Mapa de secrets por workflow | 5 min | 🟡 Intermediário |
| **[.github/README.md](./.github/README.md)** | Documentação dos workflows | 5 min | 🟢 Iniciante |

### 3. Deploy Avançado

| Documento | Descrição | Tempo | Nível |
|-----------|-----------|-------|-------|
| **[DEPLOY.md](./DEPLOY.md)** | Guia de deploy completo | 30 min | 🔴 Avançado |
| **[QUICK-DEPLOY.md](./QUICK-DEPLOY.md)** | Deploy rápido com scripts | 15 min | 🟡 Intermediário |

---

## 🎯 Fluxo de Trabalho Recomendado

```
1. QUICK_SECRETS_SETUP.md
   ↓ (5 minutos - adicionar secrets no GitHub)
   
2. SETUP_CHECKLIST.md
   ↓ (30 minutos - verificar tudo)
   
3. git push origin main
   ↓ (deploy automático)
   
4. ✅ Aplicação rodando!
```

---

## 🔐 Secrets Necessários

### Obrigatórios:

1. **AZURE_CREDENTIALS** - Credenciais do Azure Service Principal
2. **MONGO_ATLAS_URI** - String de conexão MongoDB
3. **JWT_SECRET** - Chave secreta JWT (32+ caracteres)

### Opcionais:

4. **OPENAI_API_KEY** - API key OpenAI (se usar IA)
5. **CLOUDFLARE_API_TOKEN** - Token Cloudflare (se usar DNS/CDN)

👉 **Valores e instruções:** [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)

---

## 📊 Status da Documentação

| Item | Status | Descrição |
|------|--------|-----------|
| Setup Rápido | ✅ | QUICK_SECRETS_SETUP.md |
| Guia Completo | ✅ | GITHUB_SECRETS_SETUP.md |
| Checklist | ✅ | SETUP_CHECKLIST.md |
| Diagrama de Fluxo | ✅ | DEPLOY_WORKFLOW.md |
| Mapeamento de Secrets | ✅ | SECRETS_MAPPING.md |
| Workflows Validados | ✅ | Todos os YAMLs válidos |
| README Atualizado | ✅ | Links adicionados |

---

## 🎓 Casos de Uso

### Caso 1: "Quero fazer deploy AGORA!"

```bash
# 1. Siga o QUICK_SECRETS_SETUP.md (5 min)
# 2. Adicione os 5 secrets no GitHub
# 3. Execute:
git push origin main

# Acompanhe: https://github.com/avilaops/ArcSat/actions
```

---

### Caso 2: "Preciso entender tudo antes"

```
1. Leia DEPLOY_WORKFLOW.md (entenda o fluxo)
2. Leia GITHUB_SECRETS_SETUP.md (detalhes dos secrets)
3. Leia SECRETS_MAPPING.md (quais workflows usam o quê)
4. Use SETUP_CHECKLIST.md (configure passo a passo)
5. Faça deploy!
```

---

### Caso 3: "Estou tendo problemas"

```
1. Consulte GITHUB_SECRETS_SETUP.md#troubleshooting
2. Verifique SETUP_CHECKLIST.md (algo faltando?)
3. Verifique logs: https://github.com/avilaops/ArcSat/actions
4. Verifique Azure: https://portal.azure.com
5. Contate: nicolas@avila.inc
```

---

### Caso 4: "Quero usar outro método de deploy"

```
1. Leia DEPLOY.md (métodos alternativos)
2. Leia SECRETS_MAPPING.md (compare workflows)
3. Escolha o workflow adequado
4. Configure os secrets específicos
```

---

## 🛠️ Workflows Disponíveis

### azure-deploy.yml (Recomendado)

**Status:** 🟢 Ativo  
**Uso:** Deploy completo (backend + frontend)  
**Secrets:** 5 (3 obrigatórios + 2 opcionais)  
**Documentação:** [SECRETS_MAPPING.md](./SECRETS_MAPPING.md#-workflow-principal-azure-deployyml)

### ci-cd.yml

**Status:** 🟢 Ativo  
**Uso:** CI/CD com testes + lint + build + deploy  
**Secrets:** 1 (AZURE_CREDENTIALS)  
**Documentação:** [SECRETS_MAPPING.md](./SECRETS_MAPPING.md#-workflow-secundário-ci-cdyml)

### main.yml

**Status:** ⚠️ Alternativo  
**Uso:** Deploy separado (API + Frontend + Docs)  
**Secrets:** 2 (publish profiles)  
**Documentação:** [SECRETS_MAPPING.md](./SECRETS_MAPPING.md#-workflow-alternativo-mainyml)

---

## 🔗 Links Rápidos

### GitHub
- **Secrets:** https://github.com/avilaops/ArcSat/settings/secrets/actions
- **Actions:** https://github.com/avilaops/ArcSat/actions
- **Repository:** https://github.com/avilaops/ArcSat

### Azure
- **Portal:** https://portal.azure.com
- **Resource Group:** `rg-arcsat-crm`
- **Web App:** `arcsat-crm`

### Aplicação
- **Azure URL:** https://arcsat-crm.azurewebsites.net
- **Custom Domain:** https://crm.avila.inc
- **Health Check:** /api/v1/health

---

## 📞 Suporte

- **Email:** nicolas@avila.inc
- **Issues:** https://github.com/avilaops/ArcSat/issues
- **Documentação Azure:** https://docs.microsoft.com/azure
- **GitHub Actions:** https://docs.github.com/actions

---

## 📝 Estrutura dos Documentos

```
.
├── DEPLOY_INDEX.md (este arquivo) ──────► Índice central
│
├── Setup Rápido
│   ├── QUICK_SECRETS_SETUP.md ──────────► 5 minutos
│   └── SETUP_CHECKLIST.md ──────────────► Checklist interativo
│
├── Documentação Completa
│   ├── GITHUB_SECRETS_SETUP.md ─────────► Guia detalhado
│   ├── DEPLOY_WORKFLOW.md ──────────────► Diagrama de fluxo
│   └── SECRETS_MAPPING.md ──────────────► Mapa de secrets
│
├── Deploy Avançado
│   ├── DEPLOY.md ───────────────────────► Guia completo
│   └── QUICK-DEPLOY.md ─────────────────► Scripts PowerShell
│
└── Workflows
    └── .github/
        ├── README.md ───────────────────► Docs dos workflows
        └── workflows/
            ├── azure-deploy.yml ────────► Principal
            ├── ci-cd.yml ───────────────► CI/CD
            └── main.yml ────────────────► Alternativo
```

---

## ✅ Validação

Todos os workflows foram validados:
- ✅ `azure-deploy.yml` - Sintaxe YAML válida
- ✅ `ci-cd.yml` - Sintaxe YAML válida
- ✅ `main.yml` - Sintaxe YAML válida

---

## 🎉 Conclusão

Esta documentação cobre **TUDO** que você precisa para:
- ✅ Configurar GitHub Actions secrets
- ✅ Entender o fluxo de deploy
- ✅ Fazer deploy automático no Azure
- ✅ Resolver problemas comuns
- ✅ Manter a infraestrutura

**Próximo passo:** [QUICK_SECRETS_SETUP.md](./QUICK_SECRETS_SETUP.md)

---

**Última atualização:** 27/10/2025  
**Versão:** 1.0.0  
**Desenvolvido com ❤️ pela Ávila Inc**
