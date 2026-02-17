# Deploy do ArcSat CRM no Render

Este guia mostra como fazer deploy do ArcSat CRM no Render.com usando Docker.

## 📋 Pré-requisitos

- Conta no [Render.com](https://render.com) (plano gratuito disponível)
- Repositório GitHub: `avilaops/arcsat`
- Os arquivos de configuração já criados:
  - `Dockerfile` (raiz do projeto)
  - `render.yaml` (raiz do projeto)
  - `docker/init-render.sh` (script de inicialização)
  - `.dockerignore` (otimização do build)

## 🚀 Opção 1: Deploy Automático com Blueprint (Recomendado)

Esta opção cria todos os serviços automaticamente (Web Service + MariaDB + Redis).

### Passo 1: Fazer Commit e Push dos Arquivos

```bash
git add Dockerfile render.yaml docker/init-render.sh .dockerignore
git commit -m "Adicionar configuração para deploy no Render"
git push origin main
```

### Passo 2: Deploy no Render

1. Acesse: https://dashboard.render.com
2. Clique em **"New +"** → **"Blueprint"**
3. Conecte seu repositório GitHub: `avilaops/arcsat`
4. Selecione a branch `main`
5. O Render detectará automaticamente o arquivo `render.yaml`
6. Revise as configurações e clique em **"Apply"**

O Render criará automaticamente:
- ✅ Web Service (ArcSat CRM)
- ✅ Banco de Dados MariaDB
- ✅ Redis Cache
- ✅ Variáveis de ambiente configuradas
- ✅ Senha de admin gerada automaticamente

### Passo 3: Aguardar Deploy

- O primeiro build pode levar 10-15 minutos
- Acompanhe o progresso no Dashboard do Render
- Quando concluído, você verá o status "Live"

### Passo 4: Acessar o Sistema

1. No Dashboard, clique no serviço `arcsat-crm`
2. Copie a URL (algo como: `https://arcsat-crm.onrender.com`)
3. Acesse no navegador
4. Credenciais padrão:
   - **Usuário:** Administrator
   - **Senha:** Verifique nas variáveis de ambiente `ADMIN_PASSWORD`

## 🔧 Opção 2: Deploy Manual (Passo a Passo)

Se preferir configurar manualmente ou usar plano gratuito:

### 1. Criar Web Service

1. No Dashboard do Render, clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório: `avilaops/arcsat`
3. Configure:
   - **Name:** `arcsat-crm`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Runtime:** Docker
   - **Dockerfile Path:** `./Dockerfile`
   - **Instance Type:** Free ou Starter

### 2. Adicionar Banco de Dados (Externo)

Como o plano gratuito do Render não inclui MariaDB gerenciado:

**Opção A: Usar MariaDB Externo**
- [Aiven](https://aiven.io) - Free tier disponível
- [PlanetScale](https://planetscale.com) - MySQL compatível
- [Railway](https://railway.app) - Plano gratuito

**Opção B: Usar PostgreSQL do Render**
- Clique em **"New +"** → **"PostgreSQL"**
- Configure e conecte ao web service

### 3. Adicionar Redis

1. Clique em **"New +"** → **"Redis"**
2. Configure:
   - **Name:** `arcsat-redis`
   - **Region:** Mesma do web service
   - **Plan:** Free ou Starter

### 4. Configurar Variáveis de Ambiente

No Web Service `arcsat-crm`, adicione as variáveis:

```bash
# Banco de Dados
MARIADB_HOST=seu-host-mariadb.exemplo.com
MARIADB_PORT=3306
MARIADB_ROOT_PASSWORD=sua-senha-segura

# Redis
REDIS_HOST=seu-redis.onrender.com
REDIS_PORT=6379

# Site
SITE_NAME=arcsat-crm.onrender.com
ADMIN_PASSWORD=sua-senha-admin

# Sistema
PYTHONUNBUFFERED=1
SHELL=/bin/bash
```

### 5. Deploy

- Clique em **"Create Web Service"**
- Aguarde o build e deploy (10-15 minutos)

## 🔐 Segurança e Produção

### Variáveis de Ambiente Críticas

⚠️ **Importante:** Altere estas senhas para produção:

- `MARIADB_ROOT_PASSWORD`: Senha do banco de dados
- `ADMIN_PASSWORD`: Senha do administrador do sistema

### Backups

Configure backups regulares:
1. No Dashboard do Render, vá até o serviço de banco de dados
2. Configure **Backup Retention** (disponível em planos pagos)

### Domínio Customizado

Para usar seu próprio domínio:
1. No Web Service, vá em **"Settings"** → **"Custom Domain"**
2. Adicione seu domínio (ex: `crm.arcsat.com.br`)
3. Configure os registros DNS conforme instruído

## 🐛 Troubleshooting

### Build Falha

**Erro:** "Failed to build Docker image"
- Verifique se o `Dockerfile` está na raiz do repositório
- Confirme que a pasta `crm/` existe
- Verifique os logs de build no Render

### Serviço Não Inicia

**Erro:** "Web service failed to start"
- Verifique se MariaDB e Redis estão rodando
- Confirme as variáveis de ambiente
- Verifique os logs: Dashboard → Service → Logs

### Erro de Conexão com Banco

**Erro:** "Could not connect to MariaDB"
- Verifique `MARIADB_HOST` e `MARIADB_PORT`
- Confirme que o IP do Render está permitido no firewall do banco
- Teste conexão manualmente

### Site Não Carrega

**Erro:** "502 Bad Gateway" ou timeout
- O primeiro boot pode levar 5-10 minutos (criação do site)
- Verifique logs em tempo real
- Confirme que a porta 8000 está exposta

## 📊 Monitoramento

### Health Check

O Render faz health check em: `/api/method/ping`

### Logs

Acesse os logs:
1. Dashboard → Seu serviço → **Logs**
2. Filtre por erro: Busque por "ERROR" ou "CRITICAL"

### Métricas

No Dashboard você pode ver:
- CPU Usage
- Memory Usage
- Request Count
- Response Time

## 💰 Custos Estimados

### Plano Free
- Web Service: $0/mês (512 MB RAM, 0.1 CPU)
- Redis: Não disponível no free tier
- MariaDB: Usar serviço externo gratuito

⚠️ **Limitações do Free:**
- Serviço hiberna após 15 minutos de inatividade
- 750 horas/mês (equivale a 1 serviço 24/7)
- Tempo de boot: ~30 segundos ao acordar

### Plano Starter (Recomendado)
- Web Service: $7/mês (512 MB RAM)
- Redis: $7/mês  
- PostgreSQL: $7/mês (ou MariaDB externo)
- **Total:** ~$21/mês

### Plano Professional
- Web Service: $25/mês (2 GB RAM, 1 CPU)
- Melhor performance e uptime
- Backups automáticos incluídos

## 🎯 Próximos Passos

Após deploy bem-sucedido:

1. ✅ Configurar domínio customizado
2. ✅ Configurar certificado SSL (automático no Render)
3. ✅ Configurar backups automáticos
4. ✅ Configurar email SMTP para notificações
5. ✅ Configurar integrações (WhatsApp, Brasil API, etc)
6. ✅ Importar dados iniciais
7. ✅ Treinar usuários

## 📚 Recursos Adicionais

- [Documentação do Render](https://render.com/docs)
- [Render Community](https://community.render.com)
- [Frappe Framework Docs](https://frappeframework.com/docs)
- [Discussões ArcSat](https://github.com/avilaops/arcsat/discussions)

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs no Dashboard do Render
2. Consulte a seção Troubleshooting acima
3. Abra uma [Issue no GitHub](https://github.com/avilaops/arcsat/issues)
4. Entre em contato no [Discord/Discussions]

---

**Desenvolvido por:** ArcSat Team  
**Baseado em:** Frappe CRM  
**Licença:** GNU AGPLv3
