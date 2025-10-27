# 🔍 Mapa de Secrets - GitHub Actions

Este documento mapeia quais secrets são usados em cada workflow.

---

## 📊 Tabela de Secrets por Workflow

| Secret | azure-deploy.yml | ci-cd.yml | main.yml | Obrigatório? |
|--------|-----------------|-----------|----------|--------------|
| **AZURE_CREDENTIALS** | ✅ | ✅ | ❌ | ✅ Sim |
| **MONGO_ATLAS_URI** | ✅ | ❌ | ❌ | ✅ Sim |
| **JWT_SECRET** | ✅ | ❌ | ❌ | ✅ Sim |
| **OPENAI_API_KEY** | ✅ | ❌ | ❌ | ⚠️ Opcional |
| **CLOUDFLARE_API_TOKEN** | ✅ | ❌ | ❌ | ⚠️ Opcional |
| **AZURE_WEBAPP_PUBLISH_PROFILE_API** | ❌ | ❌ | ✅ | ❌ Não* |
| **AZURE_STATIC_WEB_APPS_API_TOKEN** | ❌ | ❌ | ✅ | ❌ Não* |

**Legendas:**
- ✅ = Usado pelo workflow
- ❌ = Não usado pelo workflow  
- ⚠️ = Opcional mas recomendado
- *Não = Apenas se usar o workflow `main.yml` (alternativo)

---

## 🎯 Workflow Principal: azure-deploy.yml

**Arquivo:** `.github/workflows/azure-deploy.yml`

**Status:** 🟢 Ativo e Recomendado

**Gatilhos:**
- Push para `main`
- Push para `copilot/set-up-copilot-instructions`
- Alterações em: `frontend/**`, `src/**`, `package.json`, workflow file
- Manual via `workflow_dispatch`

**Secrets Usados:**

### 1. AZURE_CREDENTIALS (Obrigatório)
```yaml
# Arquivo: .github/workflows/azure-deploy.yml
# Linhas 61-64
- name: Login to Azure
  uses: azure/login@v1
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}
```

**Uso:** Autenticação no Azure para deploy

---

### 2. MONGO_ATLAS_URI (Obrigatório)
```yaml
# Arquivo: .github/workflows/azure-deploy.yml
# Linha 80
MONGODB_URI="${{ secrets.MONGO_ATLAS_URI }}"
```

**Uso:** Connection string para MongoDB Atlas

---

### 3. JWT_SECRET (Obrigatório)
```yaml
# Arquivo: .github/workflows/azure-deploy.yml
# Linha 81
JWT_SECRET="${{ secrets.JWT_SECRET }}"
```

**Uso:** Chave secreta para geração de tokens JWT

---

### 4. OPENAI_API_KEY (Opcional)
```yaml
# Arquivo: .github/workflows/azure-deploy.yml
# Linha 82
OPENAI_API_KEY="${{ secrets.OPENAI_API_KEY }}"
```

**Uso:** API key para funcionalidades de IA

**Nota:** Se não usar, configure como placeholder no Azure

---

### 5. CLOUDFLARE_API_TOKEN (Opcional)
```yaml
# Arquivo: .github/workflows/azure-deploy.yml
# Linha 83
CLOUDFLARE_API_TOKEN="${{ secrets.CLOUDFLARE_API_TOKEN }}"
```

**Uso:** Token para gerenciar DNS/CDN via Cloudflare

**Nota:** Se não usar Cloudflare, pode omitir ou usar placeholder

---

## 🔄 Workflow Secundário: ci-cd.yml

**Arquivo:** `.github/workflows/ci-cd.yml`

**Status:** 🟢 Ativo

**Gatilhos:**
- Push para `main` ou `develop`
- Pull requests para `main` ou `develop`

**Secrets Usados:**

### AZURE_CREDENTIALS (Obrigatório)
```yaml
# Arquivo: .github/workflows/ci-cd.yml
# Linhas 73-76
- name: Login to Azure
  uses: azure/login@v1
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}
```

**Uso:** Deploy no job final (apenas se for main branch)

---

## 🔀 Workflow Alternativo: main.yml

**Arquivo:** `.github/workflows/main.yml`

**Status:** ⚠️ Alternativo (não usar junto com azure-deploy.yml)

**Gatilhos:**
- Push para `main`
- Pull requests para `main`

**Secrets Usados:**

### 1. AZURE_WEBAPP_PUBLISH_PROFILE_API
```yaml
# Arquivo: .github/workflows/main.yml
# Linha 32
publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE_API }}
```

**Uso:** Deploy da API usando publish profile (método alternativo)

---

### 2. AZURE_STATIC_WEB_APPS_API_TOKEN
```yaml
# Arquivo: .github/workflows/main.yml
# Linha 58
azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
```

**Uso:** Deploy do frontend em Azure Static Web Apps

---

## 🎯 Recomendação de Uso

### Cenário Recomendado: Usar azure-deploy.yml

✅ **Vantagens:**
- Deploy completo (backend + frontend) em um workflow
- Usa service principal (mais seguro)
- Configuração centralizada de app settings
- Melhor controle sobre o deploy

**Secrets necessários:**
```
✅ AZURE_CREDENTIALS
✅ MONGO_ATLAS_URI
✅ JWT_SECRET
⚠️ OPENAI_API_KEY (opcional)
⚠️ CLOUDFLARE_API_TOKEN (opcional)
```

---

### Cenário Alternativo: Usar main.yml

⚠️ **Quando usar:**
- Se preferir deploy separado de API e Frontend
- Se usar Azure Static Web Apps para o frontend

**Secrets necessários:**
```
✅ AZURE_WEBAPP_PUBLISH_PROFILE_API
✅ AZURE_STATIC_WEB_APPS_API_TOKEN
```

**Nota:** Este método NÃO configura automaticamente as variáveis de ambiente no Azure. Você precisará configurá-las manualmente.

---

## 📋 Checklist de Configuração

### Para azure-deploy.yml (Recomendado)

- [ ] `AZURE_CREDENTIALS` adicionado
- [ ] `MONGO_ATLAS_URI` adicionado
- [ ] `JWT_SECRET` adicionado
- [ ] `OPENAI_API_KEY` adicionado (ou placeholder)
- [ ] `CLOUDFLARE_API_TOKEN` adicionado (ou remover do workflow)
- [ ] Azure Web App criado: `arcsat-crm`
- [ ] Resource Group criado: `rg-arcsat-crm`

### Para main.yml (Alternativo)

- [ ] `AZURE_WEBAPP_PUBLISH_PROFILE_API` adicionado
- [ ] `AZURE_STATIC_WEB_APPS_API_TOKEN` adicionado
- [ ] Azure Web App criado: `arcsat-api`
- [ ] Azure Static Web App criado
- [ ] Variáveis de ambiente configuradas manualmente no Azure

---

## 🔧 Como Obter Cada Secret

### AZURE_CREDENTIALS
```powershell
az ad sp create-for-rbac `
  --name "github-actions-arcsat" `
  --role contributor `
  --scopes /subscriptions/<sub-id>/resourceGroups/rg-arcsat-crm `
  --sdk-auth
```

### AZURE_WEBAPP_PUBLISH_PROFILE_API
```powershell
az webapp deployment list-publishing-profiles `
  --name arcsat-api `
  --resource-group rg-arcsat-crm `
  --xml
```

### AZURE_STATIC_WEB_APPS_API_TOKEN
```
Azure Portal > Static Web App > Manage deployment token
```

---

## 🔒 Segurança

### Boas Práticas

✅ **Faça:**
- Use `AZURE_CREDENTIALS` (service principal) para maior segurança
- Rotacione secrets a cada 90 dias
- Use princípio do menor privilégio
- Configure secrets no GitHub, nunca no código

❌ **Não faça:**
- Não commite secrets no código
- Não compartilhe secrets publicamente
- Não use a mesma credencial em múltiplos ambientes
- Não dê mais permissões do que necessário

---

## 📊 Comparação de Métodos de Deploy

| Aspecto | azure-deploy.yml | main.yml |
|---------|-----------------|----------|
| **Complexidade** | Baixa | Média |
| **Secrets necessários** | 5 | 2 |
| **Auto-config** | Sim ✅ | Não ❌ |
| **Deploy unificado** | Sim ✅ | Não ❌ |
| **Separação API/Frontend** | Não ❌ | Sim ✅ |
| **Segurança** | Alta 🔒 | Média 🔒 |
| **Recomendado** | ✅ Sim | ⚠️ Casos específicos |

---

## 🚀 Próximos Passos

1. ✅ Escolha qual workflow usar (recomendado: `azure-deploy.yml`)
2. ✅ Configure os secrets necessários
3. ✅ Verifique se os recursos Azure existem
4. ✅ Faça push para `main`
5. ✅ Acompanhe o deploy: https://github.com/avilaops/ArcSat/actions

---

## 📚 Documentação Relacionada

- [Quick Start](./QUICK_SECRETS_SETUP.md) - Setup rápido
- [Guia Completo](./GITHUB_SECRETS_SETUP.md) - Configuração detalhada
- [Checklist](./SETUP_CHECKLIST.md) - Passo a passo
- [Workflow Diagram](./DEPLOY_WORKFLOW.md) - Fluxo visual

---

**Última atualização:** 27/10/2025  
**Versão:** 1.0.0
