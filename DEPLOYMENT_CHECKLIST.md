# ✅ Azure Deployment Checklist

Use este checklist para garantir que todos os passos necessários sejam completados antes e após o deployment no Azure.

## 📋 Pré-Deployment

### Configuração Local
- [ ] Azure CLI instalado e configurado
- [ ] Login realizado: `az login`
- [ ] Subscription correto selecionado: `az account set --subscription <id>`
- [ ] Permissões adequadas na subscription
- [ ] Node.js 18+ instalado localmente
- [ ] Git configurado corretamente

### Secrets e Configurações
- [ ] MongoDB Atlas account criado
- [ ] Connection string do MongoDB obtida
- [ ] JWT secret gerado (min 32 caracteres)
- [ ] Email/SMTP configurado (se aplicável)
- [ ] Domínios personalizados registrados (se aplicável)

### Código
- [ ] Todas as mudanças commitadas
- [ ] Branch sincronizada com remote
- [ ] Testes locais executados com sucesso
- [ ] Linter executado sem erros
- [ ] Variáveis de ambiente validadas localmente

## 🚀 Durante o Deployment

### Infraestrutura
- [ ] Resource Group criado no Azure
- [ ] Bicep template validado
- [ ] Parâmetros revisados no arquivo .parameters.json
- [ ] Deploy do template executado com sucesso
- [ ] Outputs do deployment salvos

### Key Vault
- [ ] Key Vault criado
- [ ] Secret `mongodb-uri` adicionado
- [ ] Secret `jwt-secret` adicionado
- [ ] Secret `applicationinsights-connection` adicionado
- [ ] Permissões concedidas ao App Service (Managed Identity)

### App Service (API)
- [ ] Web App criado
- [ ] Runtime Node.js 18 configurado
- [ ] Always On habilitado
- [ ] Health check path configurado (`/health`)
- [ ] Application Insights conectado
- [ ] Variáveis de ambiente configuradas
- [ ] CORS_ORIGINS configurado para produção
- [ ] Código deployado com sucesso

### Static Web App (Frontend)
- [ ] Static Web App criado
- [ ] GitHub integration configurado
- [ ] Build settings corretos
- [ ] Output location: `.next`
- [ ] Deployment token obtido
- [ ] Primeiro deploy completado

### Application Insights
- [ ] Workspace criado
- [ ] Connection string obtida
- [ ] Configurado no App Service
- [ ] Telemetria aparecendo no portal

### MongoDB Atlas
- [ ] IP do Azure adicionado à whitelist
- [ ] Connection string testada
- [ ] Usuário com permissões adequadas
- [ ] Database `arcsat` criado

## ✅ Pós-Deployment

### Verificação Básica
- [ ] API responde: `curl https://<app-name>.azurewebsites.net/`
- [ ] Health check OK: `curl https://<app-name>.azurewebsites.net/health`
- [ ] Readiness check OK: `curl https://<app-name>.azurewebsites.net/api/health/ready`
- [ ] Frontend carrega corretamente
- [ ] Nenhum erro 500 nos logs

### Testes Funcionais
- [ ] Registro de usuário funciona
- [ ] Login funciona
- [ ] JWT tokens gerados corretamente
- [ ] Endpoints protegidos requerem autenticação
- [ ] CORS funcionando para origens permitidas
- [ ] CORS bloqueando origens não permitidas

### Monitoramento
- [ ] Application Insights recebendo dados
- [ ] Requests aparecendo no dashboard
- [ ] Exceptions sendo tracked (se houver)
- [ ] Custom events aparecendo
- [ ] Logs disponíveis no portal

### Segurança
- [ ] HTTPS funcionando (certificate válido)
- [ ] Security headers presentes nas respostas
- [ ] Secrets não estão hardcoded no código
- [ ] Key Vault sendo usado para secrets sensíveis
- [ ] CORS configurado adequadamente
- [ ] Rate limiting considerado (se necessário)

### Performance
- [ ] Tempo de resposta aceitável (< 1s)
- [ ] Cold start time aceitável
- [ ] Always On habilitado (produção)
- [ ] Conexões ao MongoDB estáveis
- [ ] Nenhum memory leak detectado

### GitHub Actions
- [ ] Secrets configurados no GitHub:
  - [ ] `AZURE_WEBAPP_PUBLISH_PROFILE_API`
  - [ ] `AZURE_STATIC_WEB_APPS_API_TOKEN`
- [ ] Workflow executa sem erros
- [ ] Deploy automático funciona no push para main
- [ ] Testes executam antes do deploy

### Domínios Personalizados (se aplicável)
- [ ] DNS configurado corretamente
- [ ] Domínio customizado adicionado ao App Service
- [ ] Domínio customizado adicionado ao Static Web App
- [ ] Certificados SSL/TLS configurados
- [ ] Redirect HTTP → HTTPS funciona

### Alertas e Notificações
- [ ] Alertas configurados para:
  - [ ] CPU > 80%
  - [ ] Memória > 80%
  - [ ] Erros HTTP 5xx
  - [ ] Response time > 5s
  - [ ] Health check failures
- [ ] Notificações configuradas (email, SMS, etc.)
- [ ] Runbook documentado para alertas

## 📊 Validação Final

### Checklist de Go-Live
- [ ] Todos os itens acima completados
- [ ] Stakeholders informados
- [ ] Documentação atualizada
- [ ] Backup strategy definida
- [ ] Disaster recovery plan documentado
- [ ] Monitoring dashboard configurado
- [ ] Logs sendo coletados adequadamente
- [ ] Performance baseline estabelecido

### Comunicação
- [ ] Time técnico notificado do go-live
- [ ] Usuários informados (se aplicável)
- [ ] URLs de produção documentadas
- [ ] Credenciais salvas em local seguro
- [ ] Runbook de operações criado

## 🔄 Manutenção Contínua

### Semanal
- [ ] Revisar logs de erro no Application Insights
- [ ] Verificar alertas disparados
- [ ] Monitorar custos no Azure Portal
- [ ] Verificar performance metrics

### Mensal
- [ ] Revisar e otimizar queries lentas
- [ ] Atualizar dependências (security patches)
- [ ] Revisar e ajustar alertas
- [ ] Revisar custos e otimizar recursos

### Trimestral
- [ ] Disaster recovery drill
- [ ] Revisar e atualizar documentação
- [ ] Security audit
- [ ] Performance tuning baseado em métricas

## 📞 Contatos de Emergência

**Suporte Técnico**
- Email: nicolas@avila.inc
- Documentação: https://docs.arcsat.com.br

**Azure Support**
- Portal: https://portal.azure.com
- Support tickets: Azure Portal > Help + support

**MongoDB Atlas Support**
- Portal: https://cloud.mongodb.com
- Support: Via portal da MongoDB

## 📚 Recursos Adicionais

- [AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md) - Guia completo de deployment
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Solução de problemas
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Comandos rápidos
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Resumo da implementação

---

**Data**: _________  
**Responsável**: _________  
**Ambiente**: ☐ Dev  ☐ Staging  ☐ Production  
**Status**: ☐ Em Progresso  ☐ Completo  ☐ Rollback Necessário
