# Integração CNPJ/CPF - Receita Federal

## 📋 Visão Geral

Esta integração adiciona campos de CNPJ e CPF aos cadastros de **Cliente (Customer)** e **Fornecedor (Supplier)** do ArcSat, com busca automática de dados na Receita Federal do Brasil.

## ✨ Funcionalidades

- ✅ Campos CNPJ e CPF nos formulários de Cliente e Fornecedor
- ✅ Validação automática de CNPJ e CPF (algoritmo oficial)
- ✅ Busca automática de dados na Receita Federal ao digitar o CNPJ
- ✅ Preenchimento automático de:
  - Razão Social
  - Nome Fantasia
  - Inscrição Estadual
  - Natureza Jurídica
  - Porte da Empresa
  - Situação Cadastral
  - CNAE Fiscal
  - Endereço completo
  - Telefone e Email
- ✅ Formatação automática de CNPJ/CPF
- ✅ Busca de endereço por CEP (Brasil API)

## 🚀 Instalação

### 1. Adicionar os Campos Customizados

Entre no container do Avx e execute:

```bash
# Entrar no container
docker exec -it crm-frappe-1 bash

# Navegar para o diretório do bench
cd /home/frappe/frappe-bench

# Executar o script de criação dos campos
bench --site crm.localhost execute crm.patches.adicionar_campos_cnpj_cpf.execute
```

### 2. Registrar os Scripts Client-Side

Edite o arquivo `crm/hooks.py` e adicione:

```python
# Document Events
doc_events = {
    # ... outros eventos ...
}

# Client Scripts
doctype_js = {
    "Customer": "overrides/customer.js",
    "Supplier": "overrides/supplier.js"
}
```

### 3. Reiniciar o Sistema

```bash
# Limpar cache
bench --site crm.localhost clear-cache

# Reiniciar (se no Docker)
exit
docker restart crm-frappe-1
```

## 📖 Como Usar

### Cadastrando um Cliente/Fornecedor com CNPJ

1. Acesse **ERPNext > Vendas > Cliente** (ou **Compras > Fornecedor**)
2. Clique em **Novo**
3. Selecione **Tipo de Documento**: **CNPJ**
4. Digite o CNPJ (pode ser com ou sem formatação):
   - Exemplo: `12345678000190` ou `12.345.678/0001-90`
5. Ao completar 14 dígitos, o sistema automaticamente:
   - Valida o CNPJ
   - Consulta a Receita Federal
   - Preenche todos os dados disponíveis
6. Uma mensagem perguntará se você deseja criar o endereço automaticamente
7. Clique em **Salvar**

### Cadastrando um Cliente/Fornecedor com CPF

1. Selecione **Tipo de Documento**: **CPF**
2. Digite o CPF (11 dígitos)
3. O sistema valida automaticamente o CPF
4. Preencha manualmente os demais dados

### Atualizando Dados Existentes

Se um cliente/fornecedor já possui CNPJ cadastrado:

1. Abra o cadastro
2. Clique em **Ações > Atualizar Dados (CNPJ)**
3. Os dados serão buscados novamente na Receita Federal

## 🔧 API Utilizada

### Brasil API

Este módulo utiliza a [Brasil API](https://brasilapi.com.br/), que é:
- ✅ **Gratuita** e open source
- ✅ **Sem necessidade de autenticação**
- ✅ Dados oficiais da Receita Federal
- ✅ Alta disponibilidade
- ✅ Sem limite de requisições

### Endpoints Utilizados

- **CNPJ**: `https://brasilapi.com.br/api/cnpj/v1/{cnpj}`
- **CEP**: `https://brasilapi.com.br/api/cep/v2/{cep}`

## 📊 Campos Adicionados

### Seção: Dados Brasileiros

| Campo | Tipo | Observações |
|-------|------|-------------|
| Tipo de Documento | Select | CNPJ ou CPF |
| CNPJ | Data | Formatação automática |
| CPF | Data | Formatação automática |
| Razão Social | Data | Preenchido automaticamente |
| Nome Fantasia | Data | Preenchido automaticamente |
| Inscrição Estadual | Data | Manual ou automático |
| Inscrição Municipal | Data | Preenchimento manual |

### Seção: Dados Fiscais e Cadastrais

| Campo | Tipo | Observações |
|-------|------|-------------|
| Natureza Jurídica | Data | Da Receita Federal |
| Porte da Empresa | Data | MEI, ME, EPP, etc |
| Situação Cadastral | Data | Ativa, Suspensa, etc |
| CNAE Fiscal | Data | Código CNAE principal |
| Descrição CNAE | Small Text | Descrição da atividade |
| Telefone Principal | Data | Formatado automaticamente |

## 🔍 Validações

### Validação de CNPJ

O sistema valida o CNPJ usando o algoritmo oficial:
- Verifica se tem 14 dígitos
- Valida os dígitos verificadores
- Rejeita CNPJs com todos os dígitos iguais

### Validação de CPF

Validação com algoritmo oficial:
- Verifica se tem 11 dígitos
- Valida os dígitos verificadores
- Rejeita CPFs com todos os dígitos iguais

## 🎨 Formatação Automática

### CNPJ
```
Digitado: 12345678000190
Formatado: 12.345.678/0001-90
```

### CPF
```
Digitado: 12345678901
Formatado: 123.456.789-01
```

### Telefone
```
Fixo: (11) 3333-4444
Celular: (11) 98765-4321
```

## ⚙️ Configurações Avançadas

### Desativar Busca Automática

Se você quiser desativar a busca automática ao digitar o CNPJ, edite os arquivos `customer.js` e `supplier.js` e comente a linha:

```javascript
cnpj: function(frm) {
    // if (frm.doc.cnpj && frm.doc.cnpj.length >= 14) {
    //     validar_e_buscar_cnpj(frm);
    // }
},
```

### Timeout de Consulta

O timeout padrão é de 10 segundos. Para alterar, edite `brasil_api.py`:

```python
response = requests.get(url, timeout=10)  # Altere aqui
```

## 🐛 Troubleshooting

### "CNPJ não encontrado na Receita Federal"

**Causas possíveis:**
- CNPJ inválido ou inexistente
- Empresa muito recente (ainda não indexada)
- Problema temporário na Brasil API

**Soluções:**
- Verifique se o CNPJ está correto
- Tente novamente mais tarde
- Preencha os dados manualmente

### "Tempo de consulta excedido"

**Causas:**
- Brasil API temporariamente lenta
- Problemas de conexão com a internet

**Soluções:**
- Tente novamente
- Verifique sua conexão
- Use o botão "Atualizar Dados (CNPJ)" posteriormente

### Campos não aparecem no formulário

**Verificar:**
1. Os campos foram criados?
   ```bash
   bench --site crm.localhost execute crm.patches.adicionar_campos_cnpj_cpf.execute
   ```

2. Cache foi limpo?
   ```bash
   bench --site crm.localhost clear-cache
   ```

3. Scripts foram registrados no `hooks.py`?

## 📝 Logs e Monitoramento

Erros são registrados automaticamente no **Error Log** do Frappe:

1. Acesse **Configurações > Error Log**
2. Filtre por: "Buscar CNPJ" ou "Brasil API"
3. Veja detalhes dos erros de consulta

## 🔄 Atualizações Futuras

Recursos planejados:
- [ ] Cache de consultas para evitar requisições repetidas
- [ ] Validação de Inscrição Estadual
- [ ] Integração com Simples Nacional
- [ ] Histórico de alterações cadastrais
- [ ] Importação em lote via CSV
- [ ] Verificação automática de situação cadastral

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. Verifique os logs de erro
2. Consulte a documentação da [Brasil API](https://brasilapi.com.br/docs)
3. Teste a validação manualmente:
   ```bash
   bench --site crm.localhost console
   >>> from crm.api.brasil_api import buscar_dados_cnpj
   >>> buscar_dados_cnpj("00000000000191")
   ```

## 📄 Licença

Este código segue a mesma licença do Frappe/ERPNext (MIT License).

---

**Desenvolvido com ❤️ para o mercado brasileiro**
