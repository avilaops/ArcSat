# ⚡ Quick Start - Azure Deployment

Guia rápido para fazer o primeiro deployment do ArcSat no Azure Static Web Apps.

## 🎯 Pré-requisitos Mínimos

- Conta Azure ativa
- Azure CLI instalado: `az --version`
- Acesso ao GitHub repository
- Domínio no Porkbun

## 🚀 Deploy em 5 Passos

### 1️⃣ Login no Azure

```bash
az login
az account set --subscription "3b49f371-dd88-46c7-ba30-aeb54bd5c2f6"
```

### 2️⃣ Criar Azure Static Web App

```bash
az staticwebapp create \
  --name arcsat-frontend \
  --resource-group Avila \
  --source https://github.com/avilaops/ArcSat \
  --location "East US 2" \
  --branch main \
  --app-location "/frontend/arcsat-landing" \
  --output-location "out" \
  --login-with-github
```

### 3️⃣ Configurar GitHub Secret

```bash
# Obter o deployment token
az staticwebapp secrets list \
  --name arcsat-frontend \
  --resource-group Avila \
  --query "properties.apiKey" -o tsv
```

Adicione este token como secret `AZURE_STATIC_WEB_APPS_API_TOKEN` em:
https://github.com/avilaops/ArcSat/settings/secrets/actions

### 4️⃣ Configurar DNS no Porkbun

1. Acesse: https://porkbun.com/account/domainsSpeedy
2. Selecione `arcsat.com.br`
3. Adicione:

```
Type: CNAME
Host: www
Answer: [seu-app].azurestaticapps.net
TTL: 600
```

### 5️⃣ Adicionar Custom Domain no Azure

```bash
# Obter hostname do Azure
az staticwebapp show \
  --name arcsat-frontend \
  --resource-group Avila \
  --query "defaultHostname" -o tsv

# Adicionar domínio personalizado
az staticwebapp hostname set \
  --name arcsat-frontend \
  --resource-group Avila \
  --hostname arcsat.com.br

az staticwebapp hostname set \
  --name arcsat-frontend \
  --resource-group Avila \
  --hostname www.arcsat.com.br
```

## ✅ Verificar Deployment

```bash
# Verificar status
az staticwebapp show --name arcsat-frontend --resource-group Avila

# Testar site
curl -I https://arcsat.com.br
```

## 📚 Documentação Completa

- **Deployment detalhado**: [AZURE-DEPLOYMENT-GUIDE.md](./AZURE-DEPLOYMENT-GUIDE.md)
- **Configuração DNS**: [PORKBUN-DNS-SETUP.md](./PORKBUN-DNS-SETUP.md)
- **Configuração domínios**: [docs/DOMAIN-CONFIGURATION.md](./docs/DOMAIN-CONFIGURATION.md)

## 🆘 Problemas Comuns

### GitHub Actions falha
✅ Verifique se o secret `AZURE_STATIC_WEB_APPS_API_TOKEN` está configurado

### DNS não resolve
✅ Aguarde propagação (5-30 min) e verifique em https://dnschecker.org

### SSL não funciona
✅ Aguarde até 24h para emissão automática do certificado

---

**Dúvidas?** Consulte [AZURE-DEPLOYMENT-GUIDE.md](./AZURE-DEPLOYMENT-GUIDE.md) para instruções detalhadas.
