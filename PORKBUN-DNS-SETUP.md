# 🌐 Configuração DNS Porkbun para Azure Static Web Apps

Este documento fornece instruções completas para configurar o domínio `arcsat.com.br` no Porkbun apontando para Azure Static Web Apps.

## 📋 Pré-requisitos

- Domínio `arcsat.com.br` registrado no Porkbun
- Azure Static Web App criado e em execução
- Acesso ao painel de controle do Porkbun

## 🚀 Passos de Configuração

### 1. Obter o Hostname do Azure Static Web App

Primeiro, precisamos obter a URL do Azure Static Web App:

```bash
# Listar seus Static Web Apps
az staticwebapp list --output table

# Obter o hostname padrão do seu app
az staticwebapp show --name <nome-do-seu-app> --resource-group <seu-resource-group> --query "defaultHostname" -o tsv
```

O hostname será algo como: `YOUR-APP-NAME.azurestaticapps.net`

### 2. Configurar DNS no Porkbun

Acesse o painel do Porkbun em: https://porkbun.com/account/domainsSpeedy

#### A. Configurar Domínio Raiz (arcsat.com.br)

**Opção 1: Usar ALIAS/ANAME (Recomendado)**
Se o Porkbun suportar registros ALIAS ou ANAME:

```
Tipo: ALIAS
Host: @
Resposta: YOUR-APP-NAME.azurestaticapps.net
TTL: 600 (ou padrão)
```

**Opção 2: Usar registro A com IP do Azure**
Se ALIAS não estiver disponível, você precisará do IP do Azure Static Web Apps:

```bash
# Obter o IP do Azure Static Web App
nslookup YOUR-APP-NAME.azurestaticapps.net
```

```
Tipo: A
Host: @
Resposta: [IP obtido acima]
TTL: 600
```

#### B. Configurar Subdomínio WWW

```
Tipo: CNAME
Host: www
Resposta: YOUR-APP-NAME.azurestaticapps.net
TTL: 600
```

#### C. Configurar Subdomínios Adicionais (Opcional)

Se você tiver outros subdomínios:

```
# App/Dashboard
Tipo: CNAME
Host: app
Resposta: YOUR-APP-NAME.azurestaticapps.net
TTL: 600

# API (se necessário separadamente)
Tipo: CNAME
Host: api
Resposta: seu-backend-app.azurewebsites.net
TTL: 600
```

### 3. Configurar Domínio Personalizado no Azure

Após configurar o DNS no Porkbun, adicione o domínio personalizado no Azure:

```bash
# Adicionar domínio personalizado ao Static Web App
az staticwebapp hostname set \
  --name <nome-do-seu-app> \
  --resource-group <seu-resource-group> \
  --hostname arcsat.com.br

# Adicionar subdomínio www
az staticwebapp hostname set \
  --name <nome-do-seu-app> \
  --resource-group <seu-resource-group> \
  --hostname www.arcsat.com.br
```

Ou através do Portal Azure:
1. Acesse seu Static Web App no Portal Azure
2. Vá em "Custom domains" no menu lateral
3. Clique em "+ Add"
4. Digite `arcsat.com.br` e siga as instruções
5. Repita para `www.arcsat.com.br`

### 4. Validar Configuração

O Azure verificará automaticamente a propriedade do domínio através dos registros DNS. Este processo pode levar alguns minutos.

#### Verificar Propagação DNS

```bash
# Verificar registro A/ALIAS
nslookup arcsat.com.br

# Verificar CNAME do www
nslookup www.arcsat.com.br

# Teste detalhado
dig arcsat.com.br
dig www.arcsat.com.br
```

#### Ferramentas Online
- https://dnschecker.org/#A/arcsat.com.br
- https://www.whatsmydns.net/#A/arcsat.com.br
- https://mxtoolbox.com/SuperTool.aspx?action=a%3aarcsat.com.br

### 5. Configurar SSL/TLS

O Azure Static Web Apps fornece certificados SSL gratuitos automaticamente após validar seu domínio personalizado. Isso pode levar até 24 horas.

Para verificar o status:
```bash
az staticwebapp hostname show \
  --name <nome-do-seu-app> \
  --resource-group <seu-resource-group> \
  --hostname arcsat.com.br
```

## 📊 Resumo dos Registros DNS

| Tipo | Host | Resposta | TTL | Propósito |
|------|------|----------|-----|-----------|
| ALIAS/A | @ | [Azure hostname/IP] | 600 | Domínio principal |
| CNAME | www | YOUR-APP-NAME.azurestaticapps.net | 600 | Redirecionamento WWW |
| CNAME | app | YOUR-APP-NAME.azurestaticapps.net | 600 | Dashboard (opcional) |
| TXT | @ | [Valor de validação do Azure] | 600 | Validação de domínio |

## ⏱️ Tempo de Propagação

- **Porkbun DNS**: 5-15 minutos (típico)
- **Propagação Global**: 1-48 horas (completa)
- **Certificado SSL Azure**: 15 minutos a 24 horas após validação

## 🔧 Troubleshooting

### Erro: "Domain validation failed"

1. Verifique se os registros DNS estão corretos no Porkbun
2. Aguarde a propagação DNS (use dnschecker.org)
3. Certifique-se de que não há registros conflitantes
4. Tente remover e adicionar o domínio novamente no Azure

### Erro: "SSL certificate not issued"

1. Aguarde até 24 horas após adicionar o domínio
2. Verifique se o domínio está validado corretamente
3. Certifique-se de que não há redirecionamentos HTTP que interfiram
4. Entre em contato com o suporte Azure se persistir

### DNS não propaga

```bash
# Limpar cache DNS local
# Windows
ipconfig /flushdns

# macOS
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Linux
sudo systemd-resolve --flush-caches
```

### Verificar configuração atual do Porkbun

1. Acesse https://porkbun.com/account/domainsSpeedy
2. Clique no domínio `arcsat.com.br`
3. Vá para a seção "DNS Records"
4. Verifique se todos os registros estão corretos

## 🔒 Segurança

### DNSSEC (Opcional mas Recomendado)

Se o Porkbun oferecer DNSSEC, ative para maior segurança:

1. No painel do Porkbun, vá para as configurações do domínio
2. Procure por "DNSSEC"
3. Ative e siga as instruções

### CAA Records (Opcional)

Para maior controle sobre certificados SSL:

```
Tipo: CAA
Host: @
Valor: 0 issue "letsencrypt.org"
TTL: 600
```

## 📚 Referências

- [Azure Static Web Apps - Custom domains](https://learn.microsoft.com/azure/static-web-apps/custom-domain)
- [Porkbun DNS Management](https://kb.porkbun.com/article/54-how-to-manage-dns-records)
- [DNS Record Types Explained](https://www.cloudflare.com/learning/dns/dns-records/)

## 🆘 Suporte

### Porkbun
- Website: https://porkbun.com/support
- Email: support@porkbun.com

### Azure
- Documentação: https://learn.microsoft.com/azure/static-web-apps/
- Portal: https://portal.azure.com
- Suporte: https://azure.microsoft.com/support/

### ArcSat
- GitHub Issues: https://github.com/avilaops/ArcSat/issues
- Email: nicolas@avila.inc

---

**Última atualização:** 02/11/2025  
**Versão:** 1.0.0  
**Mantenedor:** Ávila Ops Team
