# 📋 Checklist de Configuração - GitHub Actions

Use este checklist para garantir que todos os passos foram concluídos corretamente.

---

## ✅ Pré-requisitos

- [ ] Azure Service Principal criado (✅ Já criado!)
- [ ] MongoDB Atlas configurado
- [ ] Domínio configurado (opcional)
- [ ] Repositório GitHub acessível

---

## 🔐 Parte 1: Adicionar GitHub Secrets

### Acesse a página de secrets:
👉 https://github.com/avilaops/ArcSat/settings/secrets/actions

### Adicione cada secret:

#### Secret 1/5: AZURE_CREDENTIALS

- [ ] Clicou em "New repository secret"
- [ ] Name: `AZURE_CREDENTIALS`
- [ ] Value: Colou o JSON completo do Azure (do arquivo GITHUB_SECRETS_SETUP.md)
- [ ] Clicou em "Add secret"
- [ ] ✅ Secret aparece na lista

#### Secret 2/5: MONGO_ATLAS_URI

- [ ] Clicou em "New repository secret"
- [ ] Name: `MONGO_ATLAS_URI`
- [ ] Value: `mongodb+srv://nicolasrosaab_db_user:Gio4EAQhbEdQMISl@cluster0.npuhras.mongodb.net/?retryWrites=true&w=majority`
- [ ] Clicou em "Add secret"
- [ ] ✅ Secret aparece na lista

#### Secret 3/5: JWT_SECRET

- [ ] Gerou uma chave aleatória segura (32+ caracteres)
- [ ] Clicou em "New repository secret"
- [ ] Name: `JWT_SECRET`
- [ ] Value: [sua chave gerada]
- [ ] Clicou em "Add secret"
- [ ] ✅ Secret aparece na lista

**Gerar chave:**
```bash
# Opção 1
openssl rand -base64 32

# Opção 2
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Secret 4/5: CLOUDFLARE_API_TOKEN

- [ ] Clicou em "New repository secret"
- [ ] Name: `CLOUDFLARE_API_TOKEN`
- [ ] Value: `jOe5bnmHn8EbNCJNjg4yVpUcKNPUiqnfE5B6wNoc`
- [ ] Clicou em "Add secret"
- [ ] ✅ Secret aparece na lista

#### Secret 5/5: OPENAI_API_KEY (Opcional)

- [ ] Clicou em "New repository secret"
- [ ] Name: `OPENAI_API_KEY`
- [ ] Value: [sua chave OpenAI] ou `sk-placeholder-key`
- [ ] Clicou em "Add secret"
- [ ] ✅ Secret aparece na lista

---

## 🏗️ Parte 2: Verificar Azure

### Resource Group

- [ ] Resource Group `rg-arcsat-crm` existe no Azure
- [ ] Localização: `brazilsouth`

**Verificar:**
```powershell
az group show --name rg-arcsat-crm
```

### Web App

- [ ] Web App `arcsat-crm` existe
- [ ] Runtime: Node.js 20-lts
- [ ] Plano: B1 ou superior

**Verificar:**
```powershell
az webapp show --name arcsat-crm --resource-group rg-arcsat-crm
```

### Permissões do Service Principal

- [ ] Service Principal tem role "Contributor"
- [ ] Scope: Resource Group `rg-arcsat-crm`

**Verificar:**
```powershell
az role assignment list --assignee 3fdb30d7-1724-49d3-b301-3c0942f5f4b8
```

---

## 🌐 Parte 3: Configurar DNS (Opcional)

Se usar domínio customizado `crm.avila.inc`:

### No provedor DNS (Cloudflare, etc.):

- [ ] Registro CNAME adicionado
  - Nome: `crm`
  - Valor: `arcsat-crm.azurewebsites.net`
  - TTL: 300

### No Azure:

- [ ] Domínio customizado adicionado ao Web App
- [ ] Certificado SSL configurado (Managed Certificate)

**Adicionar domínio:**
```powershell
az webapp config hostname add \
  --webapp-name arcsat-crm \
  --resource-group rg-arcsat-crm \
  --hostname crm.avila.inc
```

---

## 🔧 Parte 4: Configurar MongoDB Atlas

- [ ] Cluster está ativo
- [ ] Database user criado: `nicolasrosaab_db_user`
- [ ] Network Access permite conexões do GitHub Actions
  - IP Whitelist: `0.0.0.0/0` (todos os IPs)
- [ ] Connection string testada e funcionando

**Testar conexão:**
```bash
mongosh "mongodb+srv://nicolasrosaab_db_user:Gio4EAQhbEdQMISl@cluster0.npuhras.mongodb.net/?retryWrites=true&w=majority"
```

---

## 🚀 Parte 5: Primeiro Deploy

### Preparar o código:

- [ ] Branch `main` está atualizada
- [ ] Todos os commits foram feitos

### Iniciar deploy:

```bash
git add .
git commit -m "Deploy to Azure App Service"
git push origin main
```

### Acompanhar o deploy:

- [ ] GitHub Actions iniciou: https://github.com/avilaops/ArcSat/actions
- [ ] Workflow "Deploy ArcSat CRM to Azure" está rodando
- [ ] Todos os steps completaram com sucesso ✅

---

## ✅ Parte 6: Verificação Final

### Testar a aplicação:

- [ ] Azure Web App responde: https://arcsat-crm.azurewebsites.net
- [ ] Domínio customizado responde: https://crm.avila.inc (se configurado)
- [ ] Health check funciona: `/api/v1/health`
- [ ] MongoDB está conectado (verificar logs)

### Verificar logs:

**No Azure Portal:**
```
Portal Azure > App Services > arcsat-crm > Log stream
```

**Via CLI:**
```powershell
az webapp log tail --name arcsat-crm --resource-group rg-arcsat-crm
```

### Verificar configurações:

- [ ] Variáveis de ambiente estão corretas no Azure
- [ ] Application Insights está coletando telemetria (se configurado)
- [ ] SSL/HTTPS está funcionando

---

## 🎯 Status Final

Marque quando completar cada parte:

- [ ] ✅ Parte 1: GitHub Secrets configurados (5 secrets)
- [ ] ✅ Parte 2: Azure verificado (Resource Group + Web App)
- [ ] ✅ Parte 3: DNS configurado (se aplicável)
- [ ] ✅ Parte 4: MongoDB Atlas configurado
- [ ] ✅ Parte 5: Primeiro deploy realizado com sucesso
- [ ] ✅ Parte 6: Aplicação verificada e funcionando

---

## 🎉 Parabéns!

Se todos os checkboxes estão marcados, seu deploy automático está configurado!

Agora, toda vez que você fizer push para `main`, o GitHub Actions automaticamente:
1. ✅ Faz build da aplicação
2. ✅ Deploy no Azure App Service
3. ✅ Configura variáveis de ambiente
4. ✅ Reinicia o Web App

---

## 📞 Precisa de Ajuda?

- **Troubleshooting:** [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)
- **Deploy Manual:** [DEPLOY.md](./DEPLOY.md)
- **Suporte:** nicolas@avila.inc
- **Issues:** https://github.com/avilaops/ArcSat/issues

---

**Última atualização:** 27/10/2025  
**Versão:** 1.0.0
