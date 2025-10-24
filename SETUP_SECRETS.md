# 🔐 Configuração de Secrets do GitHub

## ✅ Token Obtido do Azure

O token de deployment do Azure Static Web App foi obtido com sucesso e salvo em `AZURE_TOKEN.txt`.

## 📋 Passos para Configurar o Secret no GitHub

### Opção 1: Via Interface do GitHub (Recomendado)

1. Acesse: https://github.com/avilaops/ArcSat/settings/secrets/actions
2. Clique em **"New repository secret"**
3. Preencha:
   - **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - **Value**: [Cole o conteúdo do arquivo `AZURE_TOKEN.txt`]
4. Clique em **"Add secret"**

### Opção 2: Via GitHub CLI

```powershell
# Ler token do arquivo
$token = Get-Content .\AZURE_TOKEN.txt -Raw

# Adicionar secret ao repositório
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --body $token --repo avilaops/ArcSat
```

## 🌍 Configuração de Environments

### Criar Environments no GitHub:

1. Acesse: https://github.com/avilaops/ArcSat/settings/environments
2. Crie dois environments:
   - **production** (com proteção para branch `main`)
   - **staging** (opcional, para testes)

### Variables por Environment:

#### Production Environment
- `AZURE_SUBSCRIPTION_ID`: (seu subscription ID)
- `AZURE_RESOURCE_GROUP`: `Avila`
- `STATIC_WEB_APP_NAME`: `arcsat-frontend`
- `MONGODB_URI`: (configure no Azure Key Vault)

#### Copilot/Development Environment
- `MONGODB_URI`: (connection string local ou Atlas)
- `NODE_ENV`: `development`

## 🔍 Verificar Deployment

Após configurar o secret, o próximo push para `main` vai acionar o workflow automaticamente.

**Monitor**: https://github.com/avilaops/ArcSat/actions

## 🗑️ Limpeza

**IMPORTANTE**: Após configurar o secret no GitHub, delete o arquivo:
```powershell
Remove-Item .\AZURE_TOKEN.txt -Force
```

## 📊 Status Atual

- ✅ Azure Static Web App: `wonderful-sand-0adc5890f.3.azurestaticapps.net`
- ✅ Custom Domain: `www.arcsat.com.br` (SSL ativo)
- ⏳ GitHub Secret: **Pendente configuração manual**
- ⏳ Environments: **Não configurados**
