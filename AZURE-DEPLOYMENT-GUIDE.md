# 🚀 Guia de Deployment Azure Static Web Apps

Este guia fornece instruções completas para deployar o ArcSat no Azure Static Web Apps com domínio personalizado Porkbun.

## 📋 Pré-requisitos

- [ ] Conta Azure ativa
- [ ] Azure CLI instalado (`az --version`)
- [ ] Domínio `arcsat.com.br` registrado no Porkbun
- [ ] GitHub repository com acesso admin
- [ ] Node.js 18+ instalado

## 🔧 Parte 1: Configurar Azure Static Web App

### 1.1. Login no Azure

```bash
# Login na conta Azure
az login

# Verificar subscription ativa
az account show --output table

# Definir subscription (se necessário)
az account set --subscription "3b49f371-dd88-46c7-ba30-aeb54bd5c2f6"
```

### 1.2. Criar Resource Group (se não existir)

```bash
# Verificar se o resource group existe
az group show --name Avila --output table

# Criar se não existir
az group create \
  --name Avila \
  --location "East US 2"
```

### 1.3. Criar Azure Static Web App

```bash
# Criar o Static Web App
az staticwebapp create \
  --name arcsat-frontend \
  --resource-group Avila \
  --source https://github.com/avilaops/ArcSat \
  --location "East US 2" \
  --branch main \
  --app-location "/frontend/arcsat-landing" \
  --output-location "out" \
  --login-with-github

# Obter o hostname padrão
az staticwebapp show \
  --name arcsat-frontend \
  --resource-group Avila \
  --query "defaultHostname" -o tsv
```

Anote o hostname (será algo como `YOUR-APP-NAME.azurestaticapps.net`)

### 1.4. Obter o Deployment Token

```bash
# Obter o token de deployment
az staticwebapp secrets list \
  --name arcsat-frontend \
  --resource-group Avila \
  --query "properties.apiKey" -o tsv
```

**IMPORTANTE:** Copie este token - ele será usado no GitHub Secrets!

## 🔐 Parte 2: Configurar GitHub Secrets

### 2.1. Adicionar Secret no GitHub

1. Acesse: https://github.com/avilaops/ArcSat/settings/secrets/actions
2. Clique em "New repository secret"
3. Nome: `AZURE_STATIC_WEB_APPS_API_TOKEN`
4. Value: Cole o token obtido no passo 1.4
5. Clique "Add secret"

### 2.2. Verificar GitHub Actions Workflow

O workflow já está configurado em `.github/workflows/main.yml`. Ele será executado automaticamente em cada push para `main`.

Para executar manualmente:
```bash
# Via GitHub CLI
gh workflow run "ArcSat CI/CD" --ref main

# Ou trigger um push
git commit --allow-empty -m "chore: trigger deployment"
git push origin main
```

## 🌐 Parte 3: Configurar DNS no Porkbun

### 3.1. Obter Informações do Azure

```bash
# Obter o hostname do Azure Static Web App
AZURE_HOSTNAME=$(az staticwebapp show \
  --name arcsat-frontend \
  --resource-group Avila \
  --query "defaultHostname" -o tsv)

echo "Azure Hostname: $AZURE_HOSTNAME"
```

### 3.2. Configurar Registros DNS no Porkbun

1. Acesse: https://porkbun.com/account/domainsSpeedy
2. Selecione o domínio `arcsat.com.br`
3. Vá para "DNS Records"
4. Adicione os seguintes registros:

#### Registro para domínio raiz (arcsat.com.br)

**Opção A: Usando ALIAS (Recomendado se disponível)**
```
Type: ALIAS
Host: @
Answer: YOUR-APP-NAME.azurestaticapps.net
TTL: 600
```

**Opção B: Usando A Record**
```bash
# Obter o IP do Azure Static Web App
nslookup YOUR-APP-NAME.azurestaticapps.net

# Adicionar no Porkbun:
Type: A
Host: @
Answer: [IP obtido acima]
TTL: 600
```

#### Registro para www (www.arcsat.com.br)
```
Type: CNAME
Host: www
Answer: YOUR-APP-NAME.azurestaticapps.net
TTL: 600
```

### 3.3. Verificar Propagação DNS

```bash
# Verificar domínio raiz
nslookup arcsat.com.br

# Verificar www
nslookup www.arcsat.com.br

# Teste detalhado
dig arcsat.com.br
dig www.arcsat.com.br

# Verificar online
open https://dnschecker.org/#A/arcsat.com.br
```

## 🎯 Parte 4: Adicionar Custom Domain no Azure

### 4.1. Adicionar Domínio Personalizado

```bash
# Adicionar domínio raiz
az staticwebapp hostname set \
  --name arcsat-frontend \
  --resource-group Avila \
  --hostname arcsat.com.br

# Adicionar subdomínio www
az staticwebapp hostname set \
  --name arcsat-frontend \
  --resource-group Avila \
  --hostname www.arcsat.com.br
```

### 4.2. Verificar Status do Custom Domain

```bash
# Verificar status do domínio
az staticwebapp hostname show \
  --name arcsat-frontend \
  --resource-group Avila \
  --hostname arcsat.com.br

# Listar todos os custom domains
az staticwebapp hostname list \
  --name arcsat-frontend \
  --resource-group Avila \
  --output table
```

### 4.3. Aguardar Validação e SSL

O Azure validará automaticamente o domínio através dos registros DNS e emitirá um certificado SSL gratuito via Let's Encrypt. Este processo pode levar:

- **Validação DNS**: 5-30 minutos
- **Emissão SSL**: 15 minutos a 24 horas

Verificar status:
```bash
# Verificar SSL
curl -I https://arcsat.com.br

# Verificar detalhes do certificado
openssl s_client -connect arcsat.com.br:443 -servername arcsat.com.br < /dev/null | openssl x509 -noout -dates
```

## ✅ Parte 5: Validação e Testes

### 5.1. Testar Deployment

```bash
# Verificar status do Static Web App
az staticwebapp show \
  --name arcsat-frontend \
  --resource-group Avila \
  --output table

# Testar endpoints
curl -I https://arcsat.com.br
curl -I https://www.arcsat.com.br
curl -I https://YOUR-APP-NAME.azurestaticapps.net
```

### 5.2. Verificar GitHub Actions

1. Acesse: https://github.com/avilaops/ArcSat/actions
2. Verifique se o workflow "ArcSat CI/CD" está executando
3. Verifique se o deployment foi bem-sucedido
4. Verifique os logs de cada step

### 5.3. Testar Aplicação

Acesse no navegador:
- https://arcsat.com.br
- https://www.arcsat.com.br
- https://arcsat.com.br/dashboard (se existir)

Verifique:
- [ ] Site carrega corretamente
- [ ] SSL está ativo (cadeado verde)
- [ ] Navegação funciona
- [ ] Assets (CSS, JS, imagens) carregam
- [ ] Console do navegador sem erros

## 📊 Parte 6: Monitoramento e Manutenção

### 6.1. Visualizar Logs de Deployment

```bash
# Via GitHub Actions
gh run list --workflow="ArcSat CI/CD"
gh run view <run-id> --log

# Via Azure
az staticwebapp show \
  --name arcsat-frontend \
  --resource-group Avila
```

### 6.2. Configurar Application Insights (Opcional)

```bash
# Criar Application Insights
az monitor app-insights component create \
  --app arcsat-insights \
  --resource-group Avila \
  --location "East US 2"

# Obter connection string
az monitor app-insights component show \
  --app arcsat-insights \
  --resource-group Avila \
  --query "connectionString" -o tsv
```

Adicione ao `.env`:
```env
APPLICATIONINSIGHTS_CONNECTION_STRING=<connection-string>
```

### 6.3. Configurar Alertas

Via Portal Azure:
1. Acesse o Static Web App
2. Vá em "Monitoring" > "Alerts"
3. Configure alertas para:
   - Build failures
   - Deployment failures
   - HTTP errors (4xx, 5xx)
   - Response time

## 🔄 Parte 7: Atualizações e Rollback

### 7.1. Deploy de Atualizações

As atualizações são automáticas via GitHub Actions:

```bash
# Fazer mudanças no código
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# O workflow será executado automaticamente
```

### 7.2. Rollback

Se necessário, fazer rollback para versão anterior:

```bash
# Listar deployments recentes
az staticwebapp show \
  --name arcsat-frontend \
  --resource-group Avila

# Via GitHub, reverter commit
git revert <commit-hash>
git push origin main

# Ou via Portal Azure:
# 1. Acesse o Static Web App
# 2. Vá em "Environments"
# 3. Selecione deployment anterior
# 4. Clique "Activate"
```

## 🐛 Troubleshooting

### Problema: Deployment falha no GitHub Actions

**Solução:**
1. Verificar se `AZURE_STATIC_WEB_APPS_API_TOKEN` está configurado
2. Verificar logs do workflow no GitHub Actions
3. Testar build localmente: `cd frontend/arcsat-landing && npm run build`

### Problema: DNS não resolve

**Solução:**
```bash
# Verificar registros DNS
nslookup arcsat.com.br
dig arcsat.com.br

# Limpar cache DNS local
# Windows
ipconfig /flushdns

# macOS
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Linux
sudo systemd-resolve --flush-caches
```

### Problema: SSL não funciona

**Solução:**
1. Aguardar até 24h para emissão do certificado
2. Verificar se domínio está validado no Azure
3. Verificar se DNS está propagado corretamente
4. Tentar remover e adicionar domínio novamente

### Problema: Site não carrega após deployment

**Solução:**
1. Verificar se build foi bem-sucedido
2. Verificar `staticwebapp.config.json`
3. Verificar console do navegador para erros
4. Verificar paths dos assets no código

## 📚 Recursos Adicionais

### Documentação
- [Azure Static Web Apps](https://learn.microsoft.com/azure/static-web-apps/)
- [Custom domains](https://learn.microsoft.com/azure/static-web-apps/custom-domain)
- [GitHub Actions deployment](https://learn.microsoft.com/azure/static-web-apps/github-actions-workflow)
- [Porkbun DNS](https://kb.porkbun.com/article/54-how-to-manage-dns-records)

### Ferramentas
- [DNS Checker](https://dnschecker.org)
- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [Azure Status](https://status.azure.com/)
- [GitHub Status](https://www.githubstatus.com/)

### Comandos Úteis

```bash
# Verificar configuração
az staticwebapp show --name arcsat-frontend --resource-group Avila

# Listar custom domains
az staticwebapp hostname list --name arcsat-frontend --resource-group Avila

# Deletar custom domain
az staticwebapp hostname delete --name arcsat-frontend --resource-group Avila --hostname arcsat.com.br

# Restart (reprocessar)
# Não há comando restart, mas você pode trigger um novo deployment:
git commit --allow-empty -m "chore: trigger redeploy"
git push origin main
```

## 🆘 Suporte

### Problemas com Azure
- Documentação: https://learn.microsoft.com/azure/static-web-apps/
- Portal: https://portal.azure.com
- Suporte: https://azure.microsoft.com/support/

### Problemas com Porkbun
- KB: https://kb.porkbun.com/
- Suporte: support@porkbun.com

### Problemas com ArcSat
- GitHub Issues: https://github.com/avilaops/ArcSat/issues
- Email: nicolas@avila.inc

---

**Última atualização:** 02/11/2025  
**Versão:** 1.0.0  
**Autor:** Ávila Ops Team

## ✅ Checklist de Deployment

Use este checklist para garantir que todos os passos foram executados:

- [ ] Azure Static Web App criado
- [ ] Deployment token obtido
- [ ] GitHub Secret configurado
- [ ] DNS configurado no Porkbun
- [ ] DNS propagado e validado
- [ ] Custom domain adicionado no Azure
- [ ] SSL certificado emitido
- [ ] GitHub Actions executando corretamente
- [ ] Site acessível via https://arcsat.com.br
- [ ] www redirecionando corretamente
- [ ] Monitoramento configurado (opcional)
- [ ] Documentação atualizada
