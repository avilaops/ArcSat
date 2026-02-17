# 🇧🇷 CNPJ/CPF - Instalação Rápida

## Passo a Passo

### Opção 1: Via Console (Recomendado)

```bash
# 1. Entre no container
docker exec -it crm-frappe-1 bash

# 2. Acesse o console do bench
cd /home/frappe/frappe-bench
bench --site crm.localhost console

# 3. No console Python, execute:
from crm.install_cnpj_cpf_integration import instalar
instalar()

# 4. Saia do console (Ctrl+D) e reinicie
exit
docker restart crm-frappe-1
```

### Opção 2: Via Script Bash

```bash
# 1. Entre no container
docker exec -it crm-frappe-1 bash

# 2. Navegue até o diretório
cd /home/frappe

# 3. Execute o script de instalação
bash frappe-bench/apps/crm/install_cnpj_cpf.sh

# 4. Saia e reinicie
exit
docker restart crm-frappe-1
```

### Opção 3: Comandos Manuais

```bash
# Entre no container
docker exec -it crm-frappe-1 bash
cd /home/frappe/frappe-bench

# Instale a biblioteca requests (já instalada)
pip install requests

# Crie os campos customizados
bench --site crm.localhost execute crm.patches.adicionar_campos_cnpj_cpf.execute

# Limpe o cache
bench --site crm.localhost clear-cache

# Saia e reinicie
exit
docker restart crm-frappe-1
```

## ✅ Verificando a Instalação

1. Acesse: http://localhost:8080/app
2. Vá em **ArcSat > Vendas > Cliente**
3. Clique em **Novo**
4. Você deve ver o campo **"Tipo de Documento"** com opções CNPJ/CPF

## 🧪 Testando

### Teste com CNPJ Real

1. Crie um novo Cliente
2. Selecione **Tipo de Documento**: **CNPJ**
3. Digite: `07.526.557/0001-00` (Magazine Luiza S.A.)
4. Os campos devem ser preenchidos automaticamente! ✨

### CNPJs para Teste

| Empresa | CNPJ |
|---------|------|
| Magazine Luiza | 07.526.557/0001-00 |
| Banco do Brasil | 00.000.000/0001-91 |
| Petrobras | 33.000.167/0001-01 |
| Vale | 33.592.510/0001-54 |
| Ambev | 07.526.557/0001-00 |

### Teste com CPF

1. Selecione **Tipo de Documento**: **CPF**
2. Digite: `111.444.777-35`
3. O sistema valida e formata automaticamente

## 🔧 Troubleshooting

### "Campos não aparecem"

```bash
# Limpe o cache novamente
docker exec crm-frappe-1 bench --site crm.localhost clear-cache

# Reinicie
docker restart crm-frappe-1
```

### "Erro ao consultar CNPJ"

```bash
# Verifique se o requests está instalado
docker exec crm-frappe-1 pip show requests

# Se não estiver, instale:
docker exec crm-frappe-1 pip install requests
```

### "ModuleNotFoundError: No module named 'requests'"

```bash
docker exec crm-frappe-1 pip install requests
docker restart crm-frappe-1
```

## 🎯 O que Foi Instalado?

### Arquivos Criados

- ✅ `crm/api/brasil_api.py` - API para consulta CNPJ/CPF
- ✅ `crm/overrides/customer.js` - Scripts para Cliente
- ✅ `crm/overrides/supplier.js` - Scripts para Fornecedor
- ✅ `crm/patches/adicionar_campos_cnpj_cpf.py` - Criação de campos
- ✅ `crm/install_cnpj_cpf_integration.py` - Script de instalação

### Campos Adicionados

**Customer e Supplier:**
- Tipo de Documento (CNPJ/CPF)
- CNPJ
- CPF  
- Razão Social
- Nome Fantasia
- Inscrição Estadual
- Inscrição Municipal
- Natureza Jurídica
- Porte da Empresa
- Situação Cadastral
- CNAE Fiscal
- Descrição CNAE
- Telefone Principal

## 📖 Documentação Completa

Consulte [INTEGRACAO_CNPJ_CPF.md](INTEGRACAO_CNPJ_CPF.md) para:
- Documentação completa da API
- Validações e formatações
- Configurações avançadas
- Exemplos de uso
- FAQ detalhado

## 🚀 Pronto!

Agora você pode cadastrar clientes e fornecedores brasileiros com validação automática de CNPJ/CPF e importação de dados da Receita Federal!

**Bom uso! 🎉**
