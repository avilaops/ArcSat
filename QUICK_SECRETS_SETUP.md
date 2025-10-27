# ⚡ Quick Start - Adicionar GitHub Secrets

## 📍 Acesso Direto

👉 **Adicionar Secrets Agora:** https://github.com/avilaops/ArcSat/settings/secrets/actions

---

## 🚀 Passo a Passo Rápido

### 1️⃣ AZURE_CREDENTIALS

**Clique em:** "New repository secret"

**Name:** `AZURE_CREDENTIALS`

**Value:** Cole exatamente este JSON:

```json
{
  "clientId": "3fdb30d7-1724-49d3-b301-3c0942f5f4b8",
  "clientSecret": "8tW8Q~stoXGO.2JV2FTjrMyunll8tcnmxV2k2an3",
  "subscriptionId": "3b49f371-dd88-46c7-ba30-aeb54bd5c2f6",
  "tenantId": "0e53f641-197a-48b2-83a4-f8222f5d48c0",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

**Clique em:** "Add secret"

---

### 2️⃣ MONGO_ATLAS_URI

**Name:** `MONGO_ATLAS_URI`

**Value:**
```
mongodb+srv://nicolasrosaab_db_user:Gio4EAQhbEdQMISl@cluster0.npuhras.mongodb.net/?retryWrites=true&w=majority
```

---

### 3️⃣ JWT_SECRET

**Name:** `JWT_SECRET`

**Value:** Gere uma chave segura:

```bash
# Opção 1: OpenSSL
openssl rand -base64 32

# Opção 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Opção 3: Use qualquer string aleatória com 32+ caracteres
```

---

### 4️⃣ CLOUDFLARE_API_TOKEN

**Name:** `CLOUDFLARE_API_TOKEN`

**Value:**
```
jOe5bnmHn8EbNCJNjg4yVpUcKNPUiqnfE5B6wNoc
```

---

### 5️⃣ OPENAI_API_KEY (Opcional)

**Name:** `OPENAI_API_KEY`

**Value:** Sua chave da OpenAI (começa com `sk-proj-...`)

Se não tiver, use um placeholder: `sk-placeholder-key`

---

## ✅ Verificação

Após adicionar todos os secrets:

1. ✅ Vá para: https://github.com/avilaops/ArcSat/settings/secrets/actions
2. ✅ Você deve ver pelo menos estes 4 secrets:
   - `AZURE_CREDENTIALS`
   - `MONGO_ATLAS_URI`
   - `JWT_SECRET`
   - `CLOUDFLARE_API_TOKEN`

---

## 🚢 Testar Deploy

```bash
git add .
git commit -m "Deploy to Azure App Service"
git push origin main
```

Acompanhe em: https://github.com/avilaops/ArcSat/actions

---

## 📚 Documentação Completa

Para mais detalhes, consulte: [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md)

---

**⏱️ Tempo estimado:** 5 minutos  
**✨ Resultado:** Deploy automático configurado!
