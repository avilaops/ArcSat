# 🔐 Configuração de Secrets do GitHub

## Deploy Azure

O deploy agora é realizado diretamente pelo Azure CLI ou portal, sem dependências de GitHub Actions ou Cloudflare.

### Exemplo de Deploy Frontend (Azure Static Web Apps)
```bash
az staticwebapp create --name arcsat-frontend --resource-group Avila --source . --location "East US 2" --app-location "frontend/arcsat-landing" --output-location "out"
```

### Exemplo de Deploy Backend (Azure App Service)
```bash
az webapp up --name arcsat-api --resource-group Avila --runtime "node|20-lts"
```

Consulte a documentação oficial do Azure para detalhes e automações avançadas.

## 📊 Status Atual

- ✅ Azure Static Web App: `wonderful-sand-0adc5890f.3.azurestaticapps.net`
- ✅ Custom Domain: `www.arcsat.com.br` (SSL ativo)
- ⏳ GitHub Secret: **Pendente configuração manual**
- ⏳ Environments: **Não configurados**
