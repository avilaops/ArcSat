# Guia de Deploy no Azure - ArcSat

Este guia detalha como fazer o deploy do ArcSat na plataforma Azure.

## 📋 Pré-requisitos

1. **Conta Azure** - Tenha uma conta ativa no Azure
2. **Azure CLI** - Instale a Azure CLI: https://docs.microsoft.com/cli/azure/install-azure-cli
3. **Node.js 18+** - Para desenvolvimento local
4. **Git** - Para controle de versão

## 🏗️ Arquitetura no Azure

### Backend (API)
- **Serviço**: Azure App Service (Linux)
- **Runtime**: Node.js 18
- **Banco de Dados**: MongoDB Atlas ou Azure Cosmos DB
- **Monitoramento**: Application Insights

### Frontend
- **Serviço**: Azure Static Web Apps
- **Framework**: Next.js 16
- **CDN**: Integrado com Azure CDN

## 🚀 Deploy do Backend (API)

### 1. Criar Resource Group

```bash
az group create --name ArcSat-RG --location brazilsouth
```

### 2. Criar Azure App Service Plan

```bash
az appservice plan create \
  --name ArcSat-Plan \
  --resource-group ArcSat-RG \
  --is-linux \
  --sku B1
```

### 3. Criar Web App

```bash
az webapp create \
  --name arcsat-api \
  --resource-group ArcSat-RG \
  --plan ArcSat-Plan \
  --runtime "NODE|18-lts"
```

### 4. Configurar Variáveis de Ambiente

```bash
# Configurações básicas
az webapp config appsettings set \
  --name arcsat-api \
  --resource-group ArcSat-RG \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    WEBSITE_NODE_DEFAULT_VERSION=18.x

# Configurações de segurança (use Azure Key Vault em produção)
az webapp config appsettings set \
  --name arcsat-api \
  --resource-group ArcSat-RG \
  --settings \
    MONGO_URI="@Microsoft.KeyVault(SecretUri=https://your-keyvault.vault.azure.net/secrets/mongodb-uri)" \
    JWT_SECRET="@Microsoft.KeyVault(SecretUri=https://your-keyvault.vault.azure.net/secrets/jwt-secret)"
```

### 5. Criar Application Insights

```bash
az monitor app-insights component create \
  --app arcsat-insights \
  --location brazilsouth \
  --resource-group ArcSat-RG

# Obter connection string
az monitor app-insights component show \
  --app arcsat-insights \
  --resource-group ArcSat-RG \
  --query connectionString
```

### 6. Configurar Application Insights no App Service

```bash
az webapp config appsettings set \
  --name arcsat-api \
  --resource-group ArcSat-RG \
  --settings \
    APPLICATIONINSIGHTS_CONNECTION_STRING="<connection-string-from-previous-step>"
```

### 7. Configurar Health Check

```bash
az webapp config set \
  --name arcsat-api \
  --resource-group ArcSat-RG \
  --health-check-path "/health"
```

### 8. Deploy via GitHub Actions

Configure os seguintes secrets no GitHub:

- `AZURE_WEBAPP_PUBLISH_PROFILE_API`: Obtenha com:
  ```bash
  az webapp deployment list-publishing-profiles \
    --name arcsat-api \
    --resource-group ArcSat-RG \
    --xml
  ```

### 9. Deploy Manual

```bash
# Fazer build local
npm ci --production

# Deploy via ZIP
az webapp deployment source config-zip \
  --name arcsat-api \
  --resource-group ArcSat-RG \
  --src arcsat-api.zip
```

## 🎨 Deploy do Frontend

### 1. Criar Azure Static Web App

```bash
az staticwebapp create \
  --name arcsat-frontend \
  --resource-group ArcSat-RG \
  --source https://github.com/avilaops/ArcSat \
  --location brazilsouth \
  --branch main \
  --app-location "/frontend/arcsat-landing" \
  --output-location ".next" \
  --login-with-github
```

### 2. Obter Deployment Token

```bash
az staticwebapp secrets list \
  --name arcsat-frontend \
  --resource-group ArcSat-RG \
  --query "properties.apiKey"
```

### 3. Configurar no GitHub

Adicione o token como secret `AZURE_STATIC_WEB_APPS_API_TOKEN`

### 4. Deploy Manual

```bash
cd frontend/arcsat-landing
npm ci
npm run build

# Usar Static Web Apps CLI
npm install -g @azure/static-web-apps-cli
swa deploy .next --deployment-token <seu-token>
```

## 🔐 Segurança com Azure Key Vault

### 1. Criar Key Vault

```bash
az keyvault create \
  --name arcsat-kv \
  --resource-group ArcSat-RG \
  --location brazilsouth
```

### 2. Adicionar Secrets

```bash
# MongoDB URI
az keyvault secret set \
  --vault-name arcsat-kv \
  --name mongodb-uri \
  --value "mongodb+srv://..."

# JWT Secret
az keyvault secret set \
  --vault-name arcsat-kv \
  --name jwt-secret \
  --value "seu-jwt-secret-aqui"
```

### 3. Dar Permissão ao App Service

```bash
# Habilitar Managed Identity
az webapp identity assign \
  --name arcsat-api \
  --resource-group ArcSat-RG

# Dar permissão de leitura ao Key Vault
az keyvault set-policy \
  --name arcsat-kv \
  --object-id <managed-identity-principal-id> \
  --secret-permissions get list
```

## 📊 Monitoramento

### Application Insights - Queries Úteis

```kusto
// Requisições por endpoint
requests
| where timestamp > ago(24h)
| summarize count() by name, resultCode
| order by count_ desc

// Erros recentes
exceptions
| where timestamp > ago(1h)
| order by timestamp desc

// Performance por endpoint
requests
| where timestamp > ago(24h)
| summarize avg(duration), percentile(duration, 95) by name
```

### Configurar Alertas

```bash
# Alerta para erros HTTP 5xx
az monitor metrics alert create \
  --name "API-5xx-Errors" \
  --resource-group ArcSat-RG \
  --scopes /subscriptions/{subscription-id}/resourceGroups/ArcSat-RG/providers/Microsoft.Web/sites/arcsat-api \
  --condition "count Http5xx > 10" \
  --window-size 5m \
  --evaluation-frequency 1m
```

## 🔄 CI/CD com GitHub Actions

O workflow em `.github/workflows/main.yml` está configurado para deploy automático.

**Secrets necessários:**
- `AZURE_WEBAPP_PUBLISH_PROFILE_API`
- `AZURE_STATIC_WEB_APPS_API_TOKEN`

## 🌐 Domínios Personalizados

### Backend (App Service)

```bash
# Adicionar domínio customizado
az webapp config hostname add \
  --webapp-name arcsat-api \
  --resource-group ArcSat-RG \
  --hostname api.arcsat.com.br

# Habilitar HTTPS
az webapp config ssl bind \
  --name arcsat-api \
  --resource-group ArcSat-RG \
  --certificate-thumbprint <cert-thumbprint> \
  --ssl-type SNI
```

### Frontend (Static Web App)

```bash
# Adicionar domínio customizado
az staticwebapp hostname set \
  --name arcsat-frontend \
  --resource-group ArcSat-RG \
  --hostname arcsat.com.br
```

## 🧪 Testes e Validação

### Health Check

```bash
# Verificar saúde da API
curl https://arcsat-api.azurewebsites.net/health

# Verificar prontidão
curl https://arcsat-api.azurewebsites.net/api/health/ready
```

### Logs

```bash
# Ver logs em tempo real
az webapp log tail \
  --name arcsat-api \
  --resource-group ArcSat-RG

# Download de logs
az webapp log download \
  --name arcsat-api \
  --resource-group ArcSat-RG \
  --log-file logs.zip
```

## 💰 Estimativa de Custos (Brasil South)

- **App Service (B1)**: ~R$ 50/mês
- **Static Web Apps (Free tier)**: R$ 0
- **Application Insights (5GB/mês)**: ~R$ 100/mês
- **Key Vault**: ~R$ 5/mês
- **Total estimado**: ~R$ 155/mês

## 🆘 Troubleshooting

### API não inicia

```bash
# Verificar logs
az webapp log tail --name arcsat-api --resource-group ArcSat-RG

# Verificar variáveis de ambiente
az webapp config appsettings list --name arcsat-api --resource-group ArcSat-RG
```

### Erro de conexão com MongoDB

- Verifique se o IP do Azure está na whitelist do MongoDB Atlas
- Confirme a connection string no Key Vault

### Application Insights sem dados

- Verifique o connection string
- Confirme que a variável `APPLICATIONINSIGHTS_CONNECTION_STRING` está configurada

## 📚 Recursos Adicionais

- [Azure App Service Docs](https://docs.microsoft.com/azure/app-service/)
- [Azure Static Web Apps Docs](https://docs.microsoft.com/azure/static-web-apps/)
- [Application Insights Docs](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview)
- [Azure Key Vault Docs](https://docs.microsoft.com/azure/key-vault/)

## 🤝 Suporte

Para problemas ou dúvidas:
- Email: nicolas@avila.inc
- Documentação: https://docs.arcsat.com.br
