# 🚀 Deploy Rápido - crm.avila.inc

## Opção 1: Script Automatizado (Recomendado) ⚡

Execute o script PowerShell para fazer o deploy completo:

```powershell
# Deploy completo (infraestrutura + domínio + SSL + aplicação)
.\deploy-azure.ps1 -All

# Ou execute cada etapa individualmente:
.\deploy-azure.ps1 -SetupInfrastructure    # 1. Criar infraestrutura no Azure
.\deploy-azure.ps1 -ConfigureDomain        # 2. Configurar crm.avila.inc
.\deploy-azure.ps1 -ConfigureSSL           # 3. Ativar HTTPS
.\deploy-azure.ps1 -Deploy                 # 4. Deploy da aplicação
```

## Opção 2: Comandos Manuais 🔧

### 1️⃣ Setup Inicial

```powershell
# Login
az login

# Criar Resource Group
az group create --name rg-arcsat-crm --location brazilsouth
```

### 2️⃣ Deploy Infraestrutura

```powershell
az deployment group create `
  --resource-group rg-arcsat-crm `
  --template-file azure-app-service.json `
  --parameters webAppName=arcsat-crm customDomain=crm.avila.inc sku=B1
```

### 3️⃣ Configurar DNS

Adicione no seu DNS provider:

```
Tipo: CNAME
Nome: crm
Valor: arcsat-crm.azurewebsites.net
TTL: 300
```

### 4️⃣ Deploy da Aplicação

```powershell
# Build
cd frontend\arcsat-landing
npm install
npm run build
cd ..\..

# Deploy
az webapp deployment source config-zip `
  --resource-group rg-arcsat-crm `
  --name arcsat-crm `
  --src deployment.zip
```

## Opção 3: GitHub Actions (CI/CD Automático) 🤖

1. Configure o secret no GitHub:

```powershell
az ad sp create-for-rbac `
  --name "github-actions-arcsat" `
  --role contributor `
  --scopes /subscriptions/{id}/resourceGroups/rg-arcsat-crm `
  --sdk-auth
```

2. Adicione o JSON como secret `AZURE_CREDENTIALS` no GitHub

3. Push para `main` → Deploy automático ✅

## 📋 Checklist Pós-Deploy

- [ ] Testar https://crm.avila.inc
- [ ] Configurar variáveis de ambiente (MongoDB, JWT, etc)
- [ ] Ativar Application Insights
- [ ] Configurar alertas de monitoramento
- [ ] Testar endpoints da API
- [ ] Configurar backup automático

## 🆘 Problemas Comuns

### DNS não resolve
```powershell
nslookup crm.avila.inc
# Aguarde até 48h para propagação completa
```

### SSL não funciona
```powershell
# Verificar certificado
az webapp config ssl list --resource-group rg-arcsat-crm
```

### Ver logs
```powershell
az webapp log tail --name arcsat-crm --resource-group rg-arcsat-crm
```

## 📚 Documentação Completa

Veja [DEPLOY.md](./DEPLOY.md) para instruções detalhadas.

---

**🎯 Acesso Rápido**
- 🌐 Produção: https://crm.avila.inc
- 🔧 Portal Azure: https://portal.azure.com
- 📊 GitHub Actions: https://github.com/avilaops/ArcSat/actions
