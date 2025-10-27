# 🔐 Configuração de Secrets do GitHub Actions

Este guia mostra como configurar todos os secrets necessários para o deploy automático do ArcSat CRM no Azure.

## 📋 Secrets Necessários

Os seguintes secrets devem ser configurados no GitHub para que os workflows funcionem corretamente:

### Secrets Obrigatórios para Deploy Principal (azure-deploy.yml)

1. **AZURE_CREDENTIALS** - Credenciais do Service Principal do Azure
2. **MONGO_ATLAS_URI** - String de conexão do MongoDB Atlas
3. **JWT_SECRET** - Chave secreta para geração de tokens JWT
4. **OPENAI_API_KEY** - Chave da API OpenAI (se utilizado)
5. **CLOUDFLARE_API_TOKEN** - Token da API Cloudflare (para DNS/CDN)

### Secrets Adicionais (main.yml - se utilizado)

6. **AZURE_WEBAPP_PUBLISH_PROFILE_API** - Perfil de publicação do Azure Web App
7. **AZURE_STATIC_WEB_APPS_API_TOKEN** - Token para Azure Static Web Apps

---

## 🚀 Como Adicionar Secrets no GitHub

### Passo a Passo:

1. **Acesse as configurações do repositório:**
   ```
   https://github.com/avilaops/ArcSat/settings/secrets/actions
   ```

2. **Clique em "New repository secret"**

3. **Adicione cada secret individualmente** usando as informações abaixo

---

## 🔑 Detalhes de Cada Secret

### 1. AZURE_CREDENTIALS

**Descrição:** Credenciais do Service Principal do Azure para autenticação e deploy.

**Name:** `AZURE_CREDENTIALS`

**Value:** Cole o JSON completo abaixo:

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

**Como foi criado:**
```powershell
az ad sp create-for-rbac \
  --name "github-actions-arcsat" \
  --role contributor \
  --scopes /subscriptions/3b49f371-dd88-46c7-ba30-aeb54bd5c2f6/resourceGroups/rg-arcsat-crm \
  --sdk-auth
```

---

### 2. MONGO_ATLAS_URI

**Descrição:** String de conexão do MongoDB Atlas para o banco de dados.

**Name:** `MONGO_ATLAS_URI`

**Value:**
```
mongodb+srv://nicolasrosaab_db_user:Gio4EAQhbEdQMISl@cluster0.npuhras.mongodb.net/?retryWrites=true&w=majority
```

**Formato:**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

---

### 3. JWT_SECRET

**Descrição:** Chave secreta para assinatura de tokens JWT (autenticação).

**Name:** `JWT_SECRET`

**Value:** Use uma string aleatória segura com no mínimo 32 caracteres.

**Exemplo de geração:**
```bash
# No terminal Linux/Mac
openssl rand -base64 32

# Ou use:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Recomendação:** Gere uma nova chave segura para produção.

---

### 4. OPENAI_API_KEY

**Descrição:** Chave da API OpenAI (se o sistema utiliza funcionalidades de IA).

**Name:** `OPENAI_API_KEY`

**Value:**
```
sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Como obter:**
1. Acesse https://platform.openai.com/api-keys
2. Crie uma nova API key
3. Copie e adicione como secret

**Nota:** Se não estiver usando OpenAI, adicione um valor placeholder ou remova a referência do workflow.

---

### 5. CLOUDFLARE_API_TOKEN

**Descrição:** Token da API Cloudflare para gerenciar DNS e CDN.

**Name:** `CLOUDFLARE_API_TOKEN`

**Value:**
```
jOe5bnmHn8EbNCJNjg4yVpUcKNPUiqnfE5B6wNoc
```

**Como obter:**
1. Acesse https://dash.cloudflare.com/profile/api-tokens
2. Crie um token com permissões:
   - Zone:DNS:Edit
   - Zone:Zone:Read
3. Copie o token

**Cloudflare Zone ID:**
```
f5d2e8a5a0afb8bbfd81f02f1e93aa0e
```

---

### 6. AZURE_WEBAPP_PUBLISH_PROFILE_API (Opcional)

**Descrição:** Perfil de publicação do Azure Web App (método alternativo de deploy).

**Name:** `AZURE_WEBAPP_PUBLISH_PROFILE_API`

**Como obter:**
```powershell
az webapp deployment list-publishing-profiles \
  --name arcsat-api \
  --resource-group rg-arcsat-crm \
  --xml
```

**Nota:** Este é um método alternativo ao `AZURE_CREDENTIALS`. Use apenas se necessário.

---

### 7. AZURE_STATIC_WEB_APPS_API_TOKEN (Opcional)

**Descrição:** Token para deploy no Azure Static Web Apps.

**Name:** `AZURE_STATIC_WEB_APPS_API_TOKEN`

**Como obter:**
1. No Portal Azure, acesse o recurso Static Web App
2. Vá em "Manage deployment token"
3. Copie o token

**Nota:** Necessário apenas se estiver usando Azure Static Web Apps para o frontend.

---

## ✅ Checklist de Configuração

Após adicionar os secrets, verifique:

- [ ] **AZURE_CREDENTIALS** adicionado com JSON completo
- [ ] **MONGO_ATLAS_URI** adicionado com connection string válida
- [ ] **JWT_SECRET** gerado e adicionado (mínimo 32 caracteres)
- [ ] **OPENAI_API_KEY** adicionado (se necessário)
- [ ] **CLOUDFLARE_API_TOKEN** adicionado
- [ ] Testado push para `main` para verificar deploy automático
- [ ] Verificado logs do GitHub Actions
- [ ] Testado aplicação no Azure após deploy

---

## 🔒 Segurança e Boas Práticas

### ⚠️ IMPORTANTE:

1. **NUNCA** commite secrets no código fonte
2. **NUNCA** compartilhe secrets publicamente
3. **SEMPRE** use secrets do GitHub para informações sensíveis
4. **ROTACIONE** secrets periodicamente (a cada 90 dias)
5. **USE** Azure Key Vault para produção quando possível
6. **REVOGUE** imediatamente qualquer secret exposto

### Rotação de Secrets:

Se um secret for comprometido:

1. **Revogue imediatamente** no Azure/serviço de origem
2. **Gere** um novo secret
3. **Atualize** no GitHub Actions
4. **Teste** o deploy para garantir funcionamento

### Azure Service Principal:

Para revogar/recriar:
```powershell
# Listar service principals
az ad sp list --display-name "github-actions-arcsat"

# Deletar (se necessário)
az ad sp delete --id <object-id>

# Criar novo
az ad sp create-for-rbac \
  --name "github-actions-arcsat" \
  --role contributor \
  --scopes /subscriptions/3b49f371-dd88-46c7-ba30-aeb54bd5c2f6/resourceGroups/rg-arcsat-crm \
  --sdk-auth
```

---

## 🚀 Testando o Deploy

Após configurar todos os secrets:

1. **Faça uma alteração no código:**
   ```bash
   git add .
   git commit -m "test: verificar deploy automático"
   git push origin main
   ```

2. **Acompanhe o workflow:**
   ```
   https://github.com/avilaops/ArcSat/actions
   ```

3. **Verifique o deploy:**
   - Azure Portal: https://portal.azure.com
   - Aplicação: https://arcsat-crm.azurewebsites.net
   - Domínio customizado: https://crm.avila.inc (após configuração DNS)

---

## 🐛 Troubleshooting

### Erro: "Secret not found"
- Verifique se o nome do secret está exatamente como no workflow
- Secrets são case-sensitive: `AZURE_CREDENTIALS` ≠ `azure_credentials`

### Erro: "Azure login failed"
- Verifique se o JSON do `AZURE_CREDENTIALS` está completo
- Confirme se o Service Principal tem as permissões corretas
- Teste o login manualmente:
  ```bash
  az login --service-principal \
    --username 3fdb30d7-1724-49d3-b301-3c0942f5f4b8 \
    --password 8tW8Q~stoXGO.2JV2FTjrMyunll8tcnmxV2k2an3 \
    --tenant 0e53f641-197a-48b2-83a4-f8222f5d48c0
  ```

### Erro: "MongoDB connection failed"
- Verifique se o MongoDB Atlas permite conexões do IP do GitHub Actions
- Configure whitelist: `0.0.0.0/0` (para GitHub Actions)
- Teste a connection string localmente

### Erro: "Deployment failed"
- Verifique logs no Azure Portal
- Confirme se o Web App existe e está no resource group correto
- Verifique se há recursos suficientes no plano de serviço

---

## 📞 Suporte

- **Email:** nicolas@avila.inc
- **GitHub Issues:** https://github.com/avilaops/ArcSat/issues
- **Documentação Azure:** https://docs.microsoft.com/azure
- **GitHub Actions Docs:** https://docs.github.com/actions

---

**Última atualização:** 27/10/2025  
**Versão:** 1.0.0
