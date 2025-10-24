# Troubleshooting Azure Deployment - ArcSat

Este guia ajuda a resolver problemas comuns durante o deploy no Azure.

## 🔍 Diagnóstico Inicial

### 1. Verificar Status dos Serviços

```bash
# Status do App Service
az webapp show --name arcsat-api --resource-group ArcSat-RG --query "state"

# Status do Static Web App
az staticwebapp show --name arcsat-frontend --resource-group ArcSat-RG --query "status"

# Verificar health check
curl https://arcsat-api.azurewebsites.net/health
```

### 2. Verificar Logs

```bash
# Logs em tempo real
az webapp log tail --name arcsat-api --resource-group ArcSat-RG

# Download de logs
az webapp log download --name arcsat-api --resource-group ArcSat-RG --log-file logs.zip

# Logs do Application Insights
az monitor app-insights query \
  --app arcsat-insights \
  --analytics-query "traces | where timestamp > ago(1h) | order by timestamp desc"
```

## 🐛 Problemas Comuns

### Aplicação não inicia

**Sintomas:**
- Status HTTP 503
- Timeout ao acessar a aplicação
- Logs mostram "Application Error"

**Soluções:**

1. **Verificar variáveis de ambiente:**
```bash
az webapp config appsettings list --name arcsat-api --resource-group ArcSat-RG
```

2. **Verificar versão do Node.js:**
```bash
az webapp config show --name arcsat-api --resource-group ArcSat-RG \
  --query "linuxFxVersion"
```

3. **Verificar health check:**
```bash
az webapp config show --name arcsat-api --resource-group ArcSat-RG \
  --query "healthCheckPath"
```

4. **Reiniciar o serviço:**
```bash
az webapp restart --name arcsat-api --resource-group ArcSat-RG
```

### Erro de Conexão com MongoDB

**Sintomas:**
- Erro: "MongoServerError: connection refused"
- Timeout ao conectar com o banco

**Soluções:**

1. **Verificar IP na whitelist do MongoDB Atlas:**
   - Acesse MongoDB Atlas Dashboard
   - Network Access → Add Azure IPs
   - Ou adicione "0.0.0.0/0" para permitir todos (não recomendado para produção)

2. **Verificar connection string:**
```bash
# Ver secret no Key Vault
az keyvault secret show --vault-name arcsat-kv --name mongodb-uri
```

3. **Testar conexão manualmente:**
```bash
# SSH no container
az webapp ssh --name arcsat-api --resource-group ArcSat-RG

# Testar conexão
node -e "require('mongoose').connect(process.env.MONGO_URI).then(() => console.log('Connected')).catch(e => console.error(e))"
```

### Application Insights não mostra dados

**Sintomas:**
- Dashboard vazio
- Nenhuma telemetria visível

**Soluções:**

1. **Verificar connection string:**
```bash
az webapp config appsettings list --name arcsat-api --resource-group ArcSat-RG \
  | grep APPLICATIONINSIGHTS_CONNECTION_STRING
```

2. **Verificar se o pacote está instalado:**
```bash
npm list applicationinsights
```

3. **Aguardar propagação:**
   - Telemetria pode levar até 5 minutos para aparecer
   - Fazer algumas requisições à API para gerar dados

4. **Verificar logs de inicialização:**
```bash
az webapp log tail --name arcsat-api --resource-group ArcSat-RG | grep "Application Insights"
```

### Erro 404 em rotas do Next.js

**Sintomas:**
- Páginas funcionam localmente mas não no Azure
- Erro 404 ao acessar rotas

**Soluções:**

1. **Verificar output do build:**
```bash
cd frontend/arcsat-landing
npm run build
# Verificar se .next foi criado corretamente
```

2. **Verificar staticwebapp.config.json:**
   - Confirmar que navigationFallback está configurado
   - Verificar rotas excluídas

3. **Redeployar:**
```bash
az staticwebapp deployment list --name arcsat-frontend --resource-group ArcSat-RG
```

### Build falha no GitHub Actions

**Sintomas:**
- GitHub Actions workflow falha
- Erro durante npm install ou npm build

**Soluções:**

1. **Verificar secrets:**
   - `AZURE_WEBAPP_PUBLISH_PROFILE_API`
   - `AZURE_STATIC_WEB_APPS_API_TOKEN`

2. **Verificar dependências:**
```bash
# Local
npm ci
npm run build
```

3. **Verificar package.json:**
   - Scripts devem existir: start, build
   - Node version compatível com Azure

4. **Limpar cache:**
```bash
# No workflow, adicionar:
- name: Clear npm cache
  run: npm cache clean --force
```

### Problemas com CORS

**Sintomas:**
- Erro CORS no console do navegador
- Requisições bloqueadas

**Soluções:**

1. **Configurar CORS no backend:**
```javascript
// Verificar src/server.js
app.use(cors({
  origin: process.env.CORS_ORIGINS ? JSON.parse(process.env.CORS_ORIGINS) : '*',
  credentials: true
}));
```

2. **Adicionar origens permitidas:**
```bash
az webapp config appsettings set \
  --name arcsat-api \
  --resource-group ArcSat-RG \
  --settings CORS_ORIGINS='["https://arcsat.com.br","https://app.arcsat.com.br"]'
```

### Erro de Memória (Out of Memory)

**Sintomas:**
- Aplicação reinicia frequentemente
- Erro: "JavaScript heap out of memory"

**Soluções:**

1. **Aumentar memória do Node.js:**
```bash
az webapp config appsettings set \
  --name arcsat-api \
  --resource-group ArcSat-RG \
  --settings NODE_OPTIONS="--max-old-space-size=2048"
```

2. **Escalar plano:**
```bash
az appservice plan update \
  --name ArcSat-Plan \
  --resource-group ArcSat-RG \
  --sku B2
```

### Lentidão na Aplicação

**Sintomas:**
- Requisições lentas
- Timeout frequente

**Soluções:**

1. **Habilitar Always On:**
```bash
az webapp config set \
  --name arcsat-api \
  --resource-group ArcSat-RG \
  --always-on true
```

2. **Verificar métricas no Application Insights:**
```kusto
requests
| where timestamp > ago(1h)
| summarize avg(duration), percentile(duration, 95) by name
| order by avg_duration desc
```

3. **Otimizar consultas ao banco:**
   - Adicionar índices no MongoDB
   - Implementar cache

## 📊 Monitoramento e Diagnóstico

### Queries úteis no Application Insights

```kusto
// Requisições mais lentas
requests
| where timestamp > ago(24h)
| order by duration desc
| take 10

// Erros por endpoint
exceptions
| where timestamp > ago(24h)
| summarize count() by operation_Name
| order by count_ desc

// Taxa de erro
requests
| where timestamp > ago(1h)
| summarize total=count(), errors=countif(success == false)
| extend errorRate = todouble(errors) / todouble(total) * 100

// Dependências (MongoDB, APIs externas)
dependencies
| where timestamp > ago(24h)
| summarize avg(duration), count() by name, type
| order by avg_duration desc
```

### Alertas Recomendados

```bash
# CPU acima de 80%
az monitor metrics alert create \
  --name "High-CPU-Alert" \
  --resource-group ArcSat-RG \
  --scopes /subscriptions/{subscription-id}/resourceGroups/ArcSat-RG/providers/Microsoft.Web/sites/arcsat-api \
  --condition "avg Percentage CPU > 80" \
  --window-size 5m

# Memória acima de 80%
az monitor metrics alert create \
  --name "High-Memory-Alert" \
  --resource-group ArcSat-RG \
  --scopes /subscriptions/{subscription-id}/resourceGroups/ArcSat-RG/providers/Microsoft.Web/sites/arcsat-api \
  --condition "avg MemoryPercentage > 80" \
  --window-size 5m

# Tempo de resposta alto
az monitor metrics alert create \
  --name "Slow-Response-Alert" \
  --resource-group ArcSat-RG \
  --scopes /subscriptions/{subscription-id}/resourceGroups/ArcSat-RG/providers/Microsoft.Web/sites/arcsat-api \
  --condition "avg ResponseTime > 5" \
  --window-size 5m
```

## 🔧 Ferramentas de Diagnóstico

### Kudu (Advanced Tools)

Acesse: `https://arcsat-api.scm.azurewebsites.net`

Funcionalidades:
- Console SSH
- Explorador de arquivos
- Logs em tempo real
- Informações do ambiente

### Azure CLI Troubleshooting

```bash
# Verificar estado detalhado
az webapp show --name arcsat-api --resource-group ArcSat-RG

# Verificar configurações
az webapp config show --name arcsat-api --resource-group ArcSat-RG

# Verificar slots de deployment
az webapp deployment slot list --name arcsat-api --resource-group ArcSat-RG

# Verificar histórico de deployment
az webapp deployment list-publishing-profiles \
  --name arcsat-api \
  --resource-group ArcSat-RG
```

## 📞 Suporte

Se o problema persistir após tentar estas soluções:

1. **Coletar informações:**
   - Logs completos
   - Mensagens de erro
   - Horário do incidente
   - Configurações atuais

2. **Contatar suporte:**
   - Email: nicolas@avila.inc
   - Azure Support Portal: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade

3. **Recursos adicionais:**
   - [Azure App Service Docs](https://docs.microsoft.com/azure/app-service/)
   - [Application Insights Docs](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview)
   - [Fórum Azure](https://social.msdn.microsoft.com/Forums/azure/)
