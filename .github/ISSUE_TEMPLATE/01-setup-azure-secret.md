---
name: Setup CI/CD - Configure Azure Secret
about: Configurar secret do Azure Static Web Apps para deploy automático
title: '🔴 URGENTE: Configurar AZURE_STATIC_WEB_APPS_API_TOKEN'
labels: 'ci/cd, urgent, blocked'
assignees: ''
---

## 🚨 Problema

Os workflows do GitHub Actions estão **falhando** porque o secret `AZURE_STATIC_WEB_APPS_API_TOKEN` não está configurado.

## 📋 Ação Necessária

### Passo 1: Obter o Token
O token já foi gerado e está salvo em: **`AZURE_TOKEN.txt`** (raiz do repositório)

```bash
# Ver o token no terminal
cat AZURE_TOKEN.txt
```

### Passo 2: Configurar no GitHub

1. Abrir: https://github.com/avilaops/ArcSat/settings/secrets/actions
2. Clicar em **"New repository secret"**
3. Preencher:
   - **Name:** `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - **Value:** [Colar o conteúdo do AZURE_TOKEN.txt]
4. Clicar em **"Add secret"**

### Passo 3: Re-executar Workflow

Após configurar o secret:
- Ir para: https://github.com/avilaops/ArcSat/actions
- Clicar no workflow que falhou
- Clicar em **"Re-run all jobs"**

## ✅ Critério de Aceitação

- [ ] Secret `AZURE_STATIC_WEB_APPS_API_TOKEN` configurado
- [ ] Workflow "Build and Deploy Frontend" executando com sucesso
- [ ] Site deployado em: www.arcsat.com.br
- [ ] Landing page premium visível

## 🔗 Links Úteis

- **Workflow:** https://github.com/avilaops/ArcSat/actions
- **Secrets:** https://github.com/avilaops/ArcSat/settings/secrets/actions
- **Static Web App:** wonderful-sand-0adc5890f.3.azurestaticapps.net
- **Domínio:** www.arcsat.com.br

## ⏱️ Prioridade

**BLOCKER** - Nada pode ser deployado até isso ser resolvido.
