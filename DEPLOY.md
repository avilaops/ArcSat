# 🚀 Guia de Deploy - ArcSat CRM

Este guia detalha o processo de deploy do ArcSat CRM no Azure App Service com domínio personalizado `crm.avila.inc`.

## 📋 Pré-requisitos

- [x] Conta Azure ativa
- [x] Azure CLI instalado
- [x] GitHub account com repositório configurado
- [x] Domínio `avila.inc` configurado no DNS

## 🔧 Passo 1: Configurar Azure CLI

```powershell
# Login no Azure
az login

# Selecionar subscription (se necessário)
az account list --output table
az account set --subscription "SUA_SUBSCRIPTION_ID"

# Criar Resource Group
az group create --name rg-arcsat-crm --location brazilsouth
```

## 🏗️ Passo 2: Deploy da Infraestrutura

### Opção A: Usando ARM Template (Recomendado)

```powershell
az deployment group create `
  --resource-group rg-arcsat-crm `
  --template-file azure-app-service.json `
  --parameters webAppName=arcsat-crm `
               customDomain=crm.avila.inc `
               sku=B1
```

### Opção B: Usando Azure CLI

```powershell
# Criar App Service Plan
az appservice plan create `
  --name arcsat-crm-plan `
  --resource-group rg-arcsat-crm `
  --sku B1 `
  --is-linux

# Criar Web App
az webapp create `
  --name arcsat-crm `
  --resource-group rg-arcsat-crm `
  --plan arcsat-crm-plan `
  --runtime "NODE:20-lts"
```

## 🌐 Passo 3: Configurar Domínio Personalizado

### 3.1: Adicionar registros DNS

No seu provedor de DNS (ex: Cloudflare, Route53), adicione:

```
Tipo: CNAME
Nome: crm
Valor: arcsat-crm.azurewebsites.net
TTL: 300
```

### 3.2: Verificar e adicionar domínio no Azure

```powershell
# Obter verificação de domínio
az webapp config hostname add `
  --webapp-name arcsat-crm `
  --resource-group rg-arcsat-crm `
  --hostname crm.avila.inc

# Verificar status
az webapp config hostname list `
  --webapp-name arcsat-crm `
  --resource-group rg-arcsat-crm
```

### 3.3: Configurar SSL (Managed Certificate)

```powershell
# Criar certificado gerenciado gratuito
az webapp config ssl create `
  --resource-group rg-arcsat-crm `
  --name arcsat-crm `
  --hostname crm.avila.inc

# Vincular certificado
az webapp config ssl bind `
  --resource-group rg-arcsat-crm `
  --name arcsat-crm `
  --certificate-thumbprint <THUMBPRINT> `
  --ssl-type SNI
```

## 🔐 Passo 4: Configurar Variáveis de Ambiente

```powershell
# Configurar App Settings
az webapp config appsettings set `
  --resource-group rg-arcsat-crm `
  --name arcsat-crm `
  --settings `
    NODE_ENV=production `
    MONGODB_URI="@Microsoft.KeyVault(SecretUri=https://seu-keyvault.vault.azure.net/secrets/mongodb-uri/)" `
    JWT_SECRET="@Microsoft.KeyVault(SecretUri=https://seu-keyvault.vault.azure.net/secrets/jwt-secret/)" `
    PORT=8080
```

## 🗄️ Passo 5: Configurar Azure Cosmos DB

```powershell
# Criar Cosmos DB account
az cosmosdb create `
  --name arcsat-cosmosdb `
  --resource-group rg-arcsat-crm `
  --kind MongoDB `
  --server-version 4.2 `
  --locations regionName=brazilsouth failoverPriority=0 `
  --default-consistency-level Session

# Criar database
az cosmosdb mongodb database create `
  --account-name arcsat-cosmosdb `
  --resource-group rg-arcsat-crm `
  --name arcsat-crm-db

# Obter connection string
az cosmosdb keys list `
  --name arcsat-cosmosdb `
  --resource-group rg-arcsat-crm `
  --type connection-strings
```

## 🔑 Passo 6: Configurar Azure Key Vault

```powershell
# Criar Key Vault
az keyvault create `
  --name arcsat-keyvault `
  --resource-group rg-arcsat-crm `
  --location brazilsouth

# Adicionar secrets
az keyvault secret set `
  --vault-name arcsat-keyvault `
  --name mongodb-uri `
  --value "SUA_CONNECTION_STRING"

az keyvault secret set `
  --vault-name arcsat-keyvault `
  --name jwt-secret `
  --value "SEU_JWT_SECRET"

# Dar permissão ao App Service
$webAppPrincipalId = az webapp identity assign `
  --name arcsat-crm `
  --resource-group rg-arcsat-crm `
  --query principalId -o tsv

az keyvault set-policy `
  --name arcsat-keyvault `
  --object-id $webAppPrincipalId `
  --secret-permissions get list
```

## 🚢 Passo 7: Deploy da Aplicação

### Opção A: GitHub Actions (Recomendado)

1. Configure o secret `AZURE_CREDENTIALS` no GitHub:

```powershell
# Criar service principal
az ad sp create-for-rbac `
  --name "github-actions-arcsat" `
  --role contributor `
  --scopes /subscriptions/{subscription-id}/resourceGroups/rg-arcsat-crm `
  --sdk-auth
```

2. Copie o JSON output e adicione como secret `AZURE_CREDENTIALS` no GitHub
3. Push para branch `main` iniciará deploy automático

### Opção B: Deploy Manual

```powershell
# Build e deploy
npm run build
az webapp deployment source config-zip `
  --resource-group rg-arcsat-crm `
  --name arcsat-crm `
  --src deployment.zip
```

### Opção C: Docker

```powershell
# Build da imagem
docker build -t arcsat-crm:latest .

# Push para Azure Container Registry
az acr create --resource-group rg-arcsat-crm --name arcsatacr --sku Basic
az acr login --name arcsatacr
docker tag arcsat-crm:latest arcsatacr.azurecr.io/arcsat-crm:latest
docker push arcsatacr.azurecr.io/arcsat-crm:latest

# Configurar Web App para usar container
az webapp config container set `
  --name arcsat-crm `
  --resource-group rg-arcsat-crm `
  --docker-custom-image-name arcsatacr.azurecr.io/arcsat-crm:latest `
  --docker-registry-server-url https://arcsatacr.azurecr.io
```

## 📊 Passo 8: Configurar Monitoramento

```powershell
# Criar Application Insights
az monitor app-insights component create `
  --app arcsat-insights `
  --location brazilsouth `
  --resource-group rg-arcsat-crm `
  --application-type web

# Obter instrumentation key
$instrumentationKey = az monitor app-insights component show `
  --app arcsat-insights `
  --resource-group rg-arcsat-crm `
  --query instrumentationKey -o tsv

# Configurar no Web App
az webapp config appsettings set `
  --resource-group rg-arcsat-crm `
  --name arcsat-crm `
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=$instrumentationKey
```

## ✅ Passo 9: Verificação

```powershell
# Verificar status do deploy
az webapp show `
  --name arcsat-crm `
  --resource-group rg-arcsat-crm `
  --query state

# Verificar logs
az webapp log tail `
  --name arcsat-crm `
  --resource-group rg-arcsat-crm

# Testar endpoint
curl https://crm.avila.inc
curl https://crm.avila.inc/api/v1/health
```

## 🔄 Passo 10: Configurar Backup e Recuperação

```powershell
# Configurar backup automático
az webapp config backup create `
  --resource-group rg-arcsat-crm `
  --webapp-name arcsat-crm `
  --container-url "SAS_URL_DO_STORAGE" `
  --frequency 1d `
  --retain-one true `
  --retention 30
```

## 🎯 URLs Importantes

- **Produção**: https://crm.avila.inc
- **Azure Portal**: https://portal.azure.com
- **GitHub Actions**: https://github.com/avilaops/ArcSat/actions
- **Logs**: Azure Portal > App Services > arcsat-crm > Logs

## 🐛 Troubleshooting

### Erro de DNS
```powershell
# Verificar propagação DNS
nslookup crm.avila.inc
```

### Erro de SSL
```powershell
# Verificar certificados
az webapp config ssl list --resource-group rg-arcsat-crm
```

### Erro de Conexão com DB
```powershell
# Testar connection string
az cosmosdb check-name-exists --name arcsat-cosmosdb
```

### Logs de Erro
```powershell
# Ver logs detalhados
az webapp log download `
  --resource-group rg-arcsat-crm `
  --name arcsat-crm `
  --log-file logs.zip
```

## 📞 Suporte

- **Email**: nicolas@avila.inc
- **Documentação Azure**: https://docs.microsoft.com/azure
- **Repository**: https://github.com/avilaops/ArcSat

---

**Última atualização**: 27/10/2025
**Versão**: 1.0.0
