# 🚀 ArcSat Azure - Quick Reference

## Comandos Essenciais

### Deploy Rápido
```bash
# Deploy automatizado completo
./deploy-azure.sh

# Deploy manual via Bicep
az deployment group create \
  --resource-group ArcSat-RG \
  --template-file azure-deploy.bicep \
  --parameters azure-deploy.parameters.json
```

### Verificação de Status
```bash
# Health check da API
curl https://arcsat-api.azurewebsites.net/health

# Logs em tempo real
az webapp log tail --name arcsat-api --resource-group ArcSat-RG

# Status dos serviços
az webapp show --name arcsat-api --resource-group ArcSat-RG --query "state"
```

### Gerenciamento de Variáveis
```bash
# Listar todas as configurações
az webapp config appsettings list --name arcsat-api --resource-group ArcSat-RG

# Adicionar/atualizar configuração
az webapp config appsettings set \
  --name arcsat-api \
  --resource-group ArcSat-RG \
  --settings KEY=VALUE

# Usar Key Vault
az webapp config appsettings set \
  --name arcsat-api \
  --resource-group ArcSat-RG \
  --settings SECRET="@Microsoft.KeyVault(SecretUri=https://arcsat-kv.vault.azure.net/secrets/secret-name)"
```

### Key Vault
```bash
# Criar secret
az keyvault secret set --vault-name arcsat-kv --name secret-name --value "secret-value"

# Ler secret
az keyvault secret show --vault-name arcsat-kv --name secret-name

# Dar permissão ao App Service
az keyvault set-policy \
  --name arcsat-kv \
  --object-id <managed-identity-principal-id> \
  --secret-permissions get list
```

### Monitoramento
```bash
# Ver métricas de CPU
az monitor metrics list \
  --resource /subscriptions/{sub-id}/resourceGroups/ArcSat-RG/providers/Microsoft.Web/sites/arcsat-api \
  --metric "CpuPercentage"

# Query Application Insights
az monitor app-insights query \
  --app arcsat-insights \
  --analytics-query "requests | where timestamp > ago(1h) | summarize count() by resultCode"
```

### Troubleshooting
```bash
# Download de logs
az webapp log download --name arcsat-api --resource-group ArcSat-RG

# SSH no container
az webapp ssh --name arcsat-api --resource-group ArcSat-RG

# Reiniciar aplicação
az webapp restart --name arcsat-api --resource-group ArcSat-RG
```

### Docker (Local)
```bash
# Build da imagem
docker build -t arcsat-api .

# Executar localmente
docker run -p 5500:8080 --env-file .env arcsat-api

# Usar docker-compose
docker-compose up -d

# Ver logs
docker-compose logs -f api
```

## 📁 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `web.config` | Configuração IIS para Azure App Service |
| `startup.sh` | Script de inicialização do container |
| `azure-deploy.bicep` | Template Infrastructure as Code |
| `Dockerfile` | Imagem Docker da aplicação |
| `staticwebapp.config.json` | Config do Static Web App (frontend) |
| `AZURE_DEPLOYMENT.md` | Guia completo de deployment |
| `TROUBLESHOOTING.md` | Guia de troubleshooting |

## 🔗 URLs de Produção

- **API**: https://arcsat-api.azurewebsites.net
- **Frontend**: https://arcsat-frontend.azurewebsites.net
- **Health Check**: https://arcsat-api.azurewebsites.net/health
- **Readiness**: https://arcsat-api.azurewebsites.net/api/health/ready
- **Kudu**: https://arcsat-api.scm.azurewebsites.net

## 🔐 Variáveis de Ambiente Obrigatórias

### Desenvolvimento
- `MONGO_URI`
- `JWT_SECRET`
- `PORT`
- `NODE_ENV`

### Produção (adicional)
- `APPLICATIONINSIGHTS_CONNECTION_STRING`
- `API_URL`
- `FRONTEND_URL`
- `CORS_ORIGINS` (JSON array)

## 📊 Queries Úteis (Application Insights)

```kusto
// Requisições com erro
requests
| where success == false
| order by timestamp desc

// Performance por endpoint
requests
| summarize avg(duration), percentile(duration, 95) by name

// Exceções recentes
exceptions
| where timestamp > ago(1h)
| order by timestamp desc
```

## ⚡ Performance Tips

1. **Habilitar Always On**: `az webapp config set --always-on true`
2. **Usar cache de CDN** para static assets
3. **Implementar Connection Pooling** no MongoDB
4. **Configurar Application Insights Sampling**
5. **Usar Redis** para sessões (se necessário)

## 🎯 Checklist de Deployment

- [ ] Configurar secrets no Key Vault
- [ ] Whitelist IPs no MongoDB Atlas
- [ ] Configurar domínios personalizados
- [ ] Configurar SSL/TLS
- [ ] Habilitar Application Insights
- [ ] Configurar alertas
- [ ] Testar health checks
- [ ] Configurar backup (se aplicável)
- [ ] Documentar URLs de produção
- [ ] Configurar GitHub Actions secrets

## 📞 Suporte

- **Email**: nicolas@avila.inc
- **Docs**: https://docs.arcsat.com.br
- **Azure Portal**: https://portal.azure.com
