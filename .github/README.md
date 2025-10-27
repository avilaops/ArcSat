# 🔐 GitHub Actions Configuration

Esta pasta contém arquivos de configuração para GitHub Actions e CI/CD.

## 📁 Arquivos

### Workflows
- `azure-deploy.yml` - Deploy principal para Azure App Service
- `ci-cd.yml` - Pipeline de CI/CD com testes e build
- `main.yml` - Deploy alternativo (API + Frontend + Docs)

### Documentação
- `AZURE_CREDENTIALS_REFERENCE.md` - Referência das credenciais Azure (⚠️ não commitar se tiver dados sensíveis)

---

## 🚀 Setup Rápido

**1. Configure os GitHub Secrets:**

Acesse: https://github.com/avilaops/ArcSat/settings/secrets/actions

**2. Adicione os seguintes secrets:**

| Secret Name | Descrição |
|------------|-----------|
| `AZURE_CREDENTIALS` | Credenciais do Service Principal do Azure |
| `MONGO_ATLAS_URI` | String de conexão do MongoDB Atlas |
| `JWT_SECRET` | Chave secreta JWT (32+ caracteres) |
| `CLOUDFLARE_API_TOKEN` | Token da API Cloudflare |
| `OPENAI_API_KEY` | Chave da API OpenAI (opcional) |

**3. Consulte a documentação completa:**

- [Guia Completo](../GITHUB_SECRETS_SETUP.md) - Instruções detalhadas
- [Quick Start](../QUICK_SECRETS_SETUP.md) - Setup rápido em 5 minutos

---

## 📋 Checklist

Antes de fazer push para `main`:

- [ ] Todos os secrets configurados no GitHub
- [ ] Azure Web App criado (`arcsat-crm`)
- [ ] Resource Group criado (`rg-arcsat-crm`)
- [ ] MongoDB Atlas configurado e acessível
- [ ] DNS configurado (se usando domínio customizado)

---

## 🔍 Monitoramento

Após o push:

1. **GitHub Actions:** https://github.com/avilaops/ArcSat/actions
2. **Azure Portal:** https://portal.azure.com
3. **Logs do Azure:** Azure Portal > App Service > Log stream

---

## 🐛 Troubleshooting

### Deploy falha com "Secret not found"
➡️ Verifique se todos os secrets foram adicionados corretamente

### "Azure login failed"
➡️ Verifique se `AZURE_CREDENTIALS` está com o JSON completo

### "MongoDB connection refused"
➡️ Confirme whitelist do IP no MongoDB Atlas (0.0.0.0/0 para GitHub Actions)

**Mais ajuda:** Consulte [GITHUB_SECRETS_SETUP.md](../GITHUB_SECRETS_SETUP.md)

---

## 📞 Suporte

- **Documentação:** [Raiz do projeto](../)
- **Issues:** https://github.com/avilaops/ArcSat/issues
- **Email:** nicolas@avila.inc
