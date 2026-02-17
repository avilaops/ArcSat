# Guia de Integração: Avx CRM + ArcSat via API

## Visão Geral

O Avx CRM possui integração nativa com o ArcSat através de APIs REST. Esta integração permite:

- ✅ **Criar clientes automaticamente** no ArcSat quando um Deal muda de status
- ✅ **Gerar cotações (Quotations)** a partir de Deals no CRM
- ✅ **Sincronizar contatos e endereços** entre CRM e ArcSat
- ✅ **Visualizar links diretos** para clientes e documentos do ArcSat

## Modos de Integração

### 1. **Instalação Local** (Mesma instância Avx)
- CRM e ArcSat instalados no mesmo Avx Bench
- Sem necessidade de API Keys
- Acesso direto ao banco de dados

### 2. **Instalação Remota** (Via API REST) ⭐
- CRM e ArcSat em servidores/sites diferentes
- Comunicação via API REST do Avx
- Requer API Key e API Secret

## Pré-requisitos

### Para Instalação Remota:

1. **Site ArcSat rodando e acessível**
   - URL: `https://seu-arcsat.com` (ou `http://localhost:8000`)
   - ArcSat versão 15.x ou 16.x

2. **Credenciais de API do ArcSat**
   - API Key
   - API Secret

## Como Obter API Keys do ArcSat

### Passo 1: Acessar o ArcSat
```
http://localhost:8000 (ou seu domínio)
Usuário: Administrator
Senha: admin
```

### Passo 2: Criar API Keys
1. Vá para **Setup > Integrations > API Key**
2. Clique em **New**
3. Preencha:
   - **User**: Administrator (ou outro usuário com permissões)
   - Clique em **Generate Keys**
4. **Copie e salve**:
   - API Key
   - API Secret (só é mostrado uma vez!)

### Passo 3: Configurar Permissões
O usuário da API deve ter permissões para:
- Customer (ler, criar, modificar)
- Quotation (ler, criar, modificar)
- Contact (ler, criar)
- Address (ler, criar)

## Configuração no Avx CRM

### Via Interface Web

1. Acesse o CRM: `http://localhost:8080/crm`
2. Vá em **Settings > ArcSat**
3. Preencha os campos:
   - ☑️ **Enabled**: Marcar
   - ☑️ **Is ArcSat installed on a different site?**: Marcar
   - **ArcSat Site URL**: `http://localhost:8000` (ou URL do ArcSat)
   - **Company in ArcSat site**: Nome da empresa (ex: "Minha Empresa")
   - **API Key**: Cole a API Key gerada
   - **API Secret**: Cole a API Secret gerada
   - ☑️ **Create customer on status change**: (Opcional) Criar cliente automaticamente
   - **Deal Status**: Selecione o status que dispara criação (ex: "Won")

4. Clique em **Save**

### Via API/Script Python

```python
import frappe

# Configurar integração ArcSat
doc = frappe.get_single("ArcSat CRM Settings")
doc.enabled = 1
doc.is_arcsat_in_different_site = 1
doc.arcsat_site_url = "http://localhost:8000"
doc.arcsat_company = "Minha Empresa"
doc.api_key = "sua_api_key_aqui"
doc.api_secret = "sua_api_secret_aqui"
doc.create_customer_on_status_change = 1
doc.deal_status = "Won"  # Status que dispara criação de cliente
doc.save()

print("✅ Integração ArcSat configurada com sucesso!")
```

## Funcionalidades da Integração

### 1. Criar Cliente Automaticamente
Quando um Deal muda para o status configurado (ex: "Won"), o sistema:
- Cria um novo Customer no ArcSat
- Vincula o Deal ao Customer
- Sincroniza dados de contato e endereço

### 2. Gerar Cotação do CRM
Na página do Deal, você terá um botão **"Create Quotation"** que:
- Abre o ArcSat em nova aba
- Preenche automaticamente os dados do Deal
- Inclui informações de cliente, contato e itens

### 3. Visualizar Cliente Vinculado
Após criar o cliente, um link aparece no Deal para:
- Acessar diretamente o Customer no ArcSat
- Ver histórico de transações
- Gerenciar dados financeiros

## Estrutura dos Dados

### Mapeamento CRM → ArcSat

| CRM | ArcSat |
|-----|---------|
| Deal | Quotation / Customer |
| Organization | Customer |
| Contact | Contact |
| Address | Address |
| Product | Item (opcional) |

## Testando a Integração

### 1. Teste de Conexão
```python
import frappe
from frappe.frappeclient import FrappeClient

settings = frappe.get_single("ArcSat CRM Settings")
client = FrappeClient(
    settings.arcsat_site_url,
    api_key=settings.api_key,
    api_secret=settings.get_password("api_secret")
)

# Listar empresas
companies = client.get_list("Company")
print("✅ Conexão OK! Empresas encontradas:", companies)
```

### 2. Teste de Criação de Cliente
1. Crie um novo Deal no CRM
2. Preencha Organization, Contact, etc.
3. Mude o status para "Won" (ou o status configurado)
4. Verifique se o cliente foi criado no ERPNext

## Fluxo de Trabalho Típico

```
1. Lead/Prospect no CRM
   ↓
2. Converter em Deal
   ↓
3. Adicionar produtos, valores, etc.
   ↓
4. Marcar como "Won"
   ↓
5. ✨ Cliente criado automaticamente no ERPNext
   ↓
6. Gerar Quotation no ERPNext
   ↓
7. Converter em Sales Order → Fatura → Pagamento
```

## Arquitetura da Integração

```
┌─────────────────────┐         REST API          ┌─────────────────────┐
│   Frappe CRM        │◄────────────────────────►│   ERPNext          │
│                     │                           │                     │
│  - Deals            │   FrappeClient()         │  - Customers        │
│  - Organizations    │   (api_key/secret)       │  - Quotations       │
│  - Contacts         │                           │  - Sales Orders     │
│                     │   HTTP POST/GET          │  - Invoices         │
└─────────────────────┘                           └─────────────────────┘
```

## Solução de Problemas

### Erro: "ERPNext is not integrated with the CRM"
- Verifique se "Enabled" está marcado
- Confirme que salvou as configurações

### Erro de Conexão/Autenticação
- Verifique a URL do ERPNext (deve incluir http:// ou https://)
- Confirme que as API Keys estão corretas
- Teste o acesso ao ERPNext no navegador
- Verifique firewall/portas

### Cliente não foi criado automaticamente
- Confirme que "Create customer on status change" está marcado
- Verifique se o Deal atingiu o status correto
- Cheque os logs de erro: Setup > System Settings > Error Log

### Como ver os logs
```python
# Ver últimos erros
frappe.get_list("Error Log", 
    filters={"error": ["like", "%ERPNext%"]},
    fields=["name", "error", "creation"],
    order_by="creation desc",
    limit=10
)
```

## Extensões e Customizações

### Criar Hook Personalizado
```python
# hooks.py no seu app customizado
doc_events = {
    "CRM Deal": {
        "after_insert": "myapp.integrations.sync_to_erpnext"
    }
}
```

### Sincronizar Dados Adicionais
```python
def sync_custom_fields(crm_deal, erpnext_customer):
    """Sincroniza campos personalizados"""
    client = get_erpnext_client()
    
    customer_data = {
        "custom_deal_id": crm_deal.name,
        "custom_source": crm_deal.lead_source,
        "custom_expected_revenue": crm_deal.deal_value
    }
    
    client.update("Customer", erpnext_customer, customer_data)
```

## Documentação Oficial

- **Frappe CRM**: https://docs.frappe.io/crm
- **ERPNext**: https://docs.erpnext.com
- **Frappe API**: https://frappeframework.com/docs/user/en/api

## Arquivos Relevantes

```
crm/fcrm/doctype/erpnext_crm_settings/
├── erpnext_crm_settings.py      # Lógica principal
├── erpnext_crm_settings.json    # Definição do DocType
└── erpnext_crm_settings.js      # Interface

Funções principais:
- create_customer_in_erpnext()   # Cria cliente
- get_quotation_url()            # Gera URL de cotação
- get_customer_link()            # Link para cliente
```

## Suporte

- **Issues**: https://github.com/frappe/crm/issues
- **Forum**: https://discuss.frappe.io/c/frappe-crm
- **Telegram**: https://t.me/frappecrm

---

✅ **Status**: ERPNext clonado e documentação criada
🔗 **Próximos passos**: Configurar integração via interface ou script
