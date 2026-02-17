# 🔗 Integração CRM + ArcSat - Guia Rápido

## ✅ O que foi feito

1. **ArcSat clonado**: `d:\Projetos\Clonados\erpnext` (versão 15)
2. **Documentação completa**: [INTEGRACAO_ERPNEXT.md](INTEGRACAO_ERPNEXT.md)
3. **Script de configuração**: [setup_erpnext_integration.py](setup_erpnext_integration.py)

## 🚀 Como usar a integração

### Opção 1: Via Interface Web (Recomendado)

1. Acesse o CRM: http://localhost:8080/crm
2. Vá em **Settings** (⚙️) > **ArcSat**
3. Preencha:
   - ☑️ Enabled
   - ☑️ Is ArcSat installed on a different site?
   - **ArcSat Site URL**: URL do seu ArcSat
   - **Company**: Nome da empresa
   - **API Key** e **API Secret**: Obtenha no ArcSat
4. Salve

### Opção 2: Via Script Python

```bash
# 1. Acesse o container do CRM
docker exec -it crm-frappe-1 bash

# 2. Navegue para o diretório
cd frappe-bench

# 3. Execute o console
bench --site crm.localhost console

# 4. No console Python, execute:
>>> exec(open('/workspace/setup_erpnext_integration.py').read())
>>> configure_integration(
...     arcsat_url="http://seu-arcsat:8000",
...     api_key="sua_api_key",
...     api_secret="sua_api_secret",
...     company_name="Sua Empresa"
... )
```

## 🔑 Como obter API Keys do ArcSat

### Se ainda não tem ArcSat rodando:

```bash
# 1. Clonar ArcSat está em: d:\Projetos\Clonados\erpnext
# 2. Configurar via Docker ou Bench (ver documentação oficial)

# Ou usar Frappe Cloud (opção mais fácil):
# https://frappecloud.com/erpnext/signup
```

### Se já tem ERPNext:

1. Acesse: `http://seu-erpnext:8000`
2. Login: Administrator
3. Vá em: **Setup > Integrations > API Key**
4. Clique em **New**
5. Selecione o usuário
6. Clique em **Generate Keys**
7. **Copie e salve as chaves** (só aparecem uma vez!)

## 📋 Funcionalidades disponíveis

- ✅ Criar clientes no ERPNext automaticamente
- ✅ Gerar cotações a partir de Deals
- ✅ Sincronizar contatos e endereços
- ✅ Visualizar links para documentos do ERPNext
- ✅ Workflow completo: Lead → Deal → Cliente → Cotação → Pedido

## 🧪 Testar a integração

```python
# No console do Frappe (bench console)
>>> from setup_erpnext_integration import test_connection
>>> test_connection()

# Criar um cliente de teste
>>> from setup_erpnext_integration import create_test_customer
>>> create_test_customer()
```

## 📚 Documentação completa

Consulte [INTEGRACAO_ERPNEXT.md](INTEGRACAO_ERPNEXT.md) para:
- Arquitetura da integração
- Configurações avançadas
- Solução de problemas
- Extensões e customizações
- API reference

## 🔧 Arquivos criados

```
crm-1.58.3/
├── INTEGRACAO_ERPNEXT.md          # Documentação completa
├── setup_erpnext_integration.py   # Script de configuração
└── INTEGRACAO_RAPIDA.md           # Este arquivo
```

## 🌐 Links úteis

- **CRM**: http://localhost:8080/crm
- **ERPNext** (quando configurar): http://seu-erpnext:8000
- **Documentação CRM**: https://docs.frappe.io/crm
- **Documentação ERPNext**: https://docs.erpnext.com
- **Forum**: https://discuss.frappe.io

## 🎯 Próximos passos

1. ⬜ Configurar ERPNext (se ainda não tem)
2. ⬜ Obter API Keys
3. ⬜ Configurar integração no CRM
4. ⬜ Testar criação de cliente
5. ⬜ Testar geração de cotação
6. ⬜ Configurar workflow personalizado (opcional)

---

**Status atual**: 
- ✅ ERPNext clonado
- ✅ CRM rodando em Docker
- ✅ Documentação e scripts prontos
- ⏳ Aguardando configuração da integração via API
