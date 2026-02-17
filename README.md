# 🚀 ArcSat - Sistema ERP Completo

<div align="center">

![ArcSat Logo](crm/public/images/logo.svg)

**Sistema de Gestão Empresarial Integrado com CRM**

[![License](https://img.shields.io/badge/license-AGPLv3-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11-blue.svg)](https://www.python.org/)
[![Node](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://www.docker.com/)

[Documentação](INTEGRACAO_ERPNEXT.md) • [Instalação](#-instalação) • [Recursos](#-recursos) • [Suporte](#-suporte)

</div>

---

## 📋 Sobre o Projeto

**ArcSat** é um sistema ERP (Enterprise Resource Planning) completo desenvolvido com **Avx Framework**, oferecendo gestão integrada para empresas de todos os tamanhos. Sistema rebrandizado e customizado com foco no mercado brasileiro.

### 🎯 Principais Características

- ✅ **CRM Completo** - Gestão de clientes, leads, deals e pipeline de vendas
- ✅ **Validação CNPJ/CPF** - Integração com Receita Federal do Brasil
- ✅ **Busca Automática** - Preenchimento automático de dados via Brasil API
- ✅ **Multi-usuário** - Controle de acesso e permissões
- ✅ **Integração via API** - REST API completa
- ✅ **Docker Ready** - Implantação simplificada
- ✅ **Interface Moderna** - UI responsiva e intuitiva

---

## 🌟 Recursos

### 📊 CRM & Vendas
- **Pipeline Visual** - Kanban board para gestão de negócios
- **Gestão de Leads** - Captura e qualificação automática
- **Deals** - Acompanhamento de oportunidades
- **Cotações** - Geração de propostas comerciais
- **Relatórios** - Analytics e métricas de vendas

### 🏢 Cadastros Brasileiros
- **CNPJ/CPF** - Validação com algoritmo oficial
- **Receita Federal** - Busca automática de dados empresariais
- **Endereços** - Busca por CEP integrada
- **Formatação** - CNPJ, CPF, telefones brasileiros

### 📱 Integrações
- **WhatsApp** - Comunicação com clientes
- **Email** - Envio e recebimento de emails
- **API REST** - Integração com sistemas externos
- **Webhooks** - Automações personalizadas

### 🔐 Segurança
- **Autenticação** - Login seguro com sessões
- **Permissões** - Controle granular de acesso
- **Logs** - Auditoria completa de ações
- **Backup** - Rotinas automatizadas

---

## 🚀 Instalação

### Pré-requisitos

- Docker Desktop 20.10+
- Docker Compose 2.0+
- Git
- 4GB RAM mínimo (8GB recomendado)

### Instalação Rápida com Docker

```bash
# 1. Clone o repositório
git clone https://github.com/avilaops/arcsat.git
cd arcsat

# 2. Configure as variáveis de ambiente (opcional)
cp .env.example .env

# 3. Inicie os containers
cd docker
docker-compose up -d

# 4. Aguarde a inicialização (2-3 minutos)
docker logs -f crm-frappe-1

# 5. Acesse o sistema
# CRM: http://localhost:8080/crm
# ERP: http://localhost:8080/app
# Usuário: Administrator
# Senha: admin
```

### Instalação da Integração CNPJ/CPF

```bash
# Entre no container
docker exec -it crm-frappe-1 bash

# Execute o instalador
cd /home/frappe/frappe-bench
bench --site crm.localhost execute crm.patches.adicionar_campos_cnpj_cpf.execute

# Limpe o cache
bench --site crm.localhost clear-cache

# Reinicie
exit
docker restart crm-frappe-1
```

📖 **Documentação completa:** [INSTALAR_CNPJ_CPF.md](INSTALAR_CNPJ_CPF.md)

---

## 📚 Documentação

- 📘 [Integração CNPJ/CPF](INTEGRACAO_CNPJ_CPF.md) - Guia completo
- 📗 [Instalação CNPJ/CPF](INSTALAR_CNPJ_CPF.md) - Guia rápido
- 📙 [Integração ERP](INTEGRACAO_ERPNEXT.md) - Configuração avançada
- 📕 [Guia Rápido](INTEGRACAO_RAPIDA.md) - Setup inicial

---

## 🛠️ Tecnologias

### Backend
- **Python 3.11** - Core do sistema
- **Avx Framework** - Framework full-stack
- **MariaDB 10.8** - Banco de dados
- **Redis Alpine** - Cache e filas

### Frontend
- **Vue.js 3** - Framework JavaScript
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Socket.io** - Comunicação real-time

### APIs Externas
- **Brasil API** - Consulta CNPJ/CPF/CEP (gratuita)
- **REST API** - Integrações personalizadas

---

## 🎯 Casos de Uso

### 🏭 Indústria
- Gestão de produção
- Controle de estoque
- Ordem de produção

### 🏪 Comércio
- PDV integrado
- E-commerce
- Gestão de fornecedores

### 💼 Serviços
- Projetos e tarefas
- Timesheet
- Contratos

### 📱 Startups
- CRM ágil
- Pipeline de vendas
- Métricas e KPIs

---

## 🔧 Desenvolvimento

### Estrutura do Projeto

```
ArcSat/
├── crm/                      # App principal CRM
│   ├── api/                  # APIs REST
│   │   └── brasil_api.py     # Integração Brasil API
│   ├── fcrm/                 # Core CRM
│   ├── overrides/            # Customizações
│   │   ├── customer.js       # Cliente com CNPJ/CPF
│   │   └── supplier.js       # Fornecedor com CNPJ/CPF
│   ├── patches/              # Patches de atualização
│   └── hooks.py              # Configuração do app
├── docker/                   # Docker configs
│   ├── docker-compose.yml
│   └── init.sh
├── frontend/                 # Frontend Vue.js
│   └── src/
└── scripts/                  # Scripts auxiliares
```

### Comandos Úteis

```bash
# Acessar console do ArcSat
docker exec -it crm-frappe-1 bash
cd /home/frappe/frappe-bench
bench --site crm.localhost console

# Ver logs
docker logs -f crm-frappe-1

# Reiniciar
docker restart crm-frappe-1

# Backup
docker exec crm-frappe-1 bench --site crm.localhost backup

# Atualizar
docker exec crm-frappe-1 bench --site crm.localhost migrate
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o repositório
2. Crie sua branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📝 Changelog

### v1.58.3 (Fevereiro 2026)
- ✨ Rebrand completo para ArcSat/Avx
- ✨ Integração CNPJ/CPF com Receita Federal
- ✨ Validação automática de documentos brasileiros
- ✨ Busca automática de dados empresariais
- ✨ Interface em português BR
- 🐛 Correções de bugs diversos
- 📚 Documentação completa em português

---

## 📄 Licença

Este projeto está licenciado sob a **GNU Affero General Public License v3.0** (AGPLv3).

Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

### Resumo da Licença

- ✅ Uso comercial permitido
- ✅ Modificação permitida
- ✅ Distribuição permitida
- ✅ Uso privado permitido
- ⚠️ **Código-fonte deve ser disponibilizado**
- ⚠️ **Modificações devem usar a mesma licença**
- ⚠️ **Aviso de licença e copyright devem ser mantidos**

---

## 💬 Suporte

### Comunidade
- 🐛 [Issues](https://github.com/avilaops/arcsat/issues) - Reporte bugs
- 💡 [Discussões](https://github.com/avilaops/arcsat/discussions) - Perguntas e ideias

### Documentação
- 📖 [Wiki](https://github.com/avilaops/arcsat/wiki) - Guias completos
- 📚 [Docs](docs/) - Documentação técnica

### Contato
- 📧 Email: avilaops@github.com
- 🌐 Website: [Em breve]

---

## 🙏 Agradecimentos

Este projeto é baseado em:
- **Frappe Framework** - Framework base (agora Avx)
- **ERPNext** - Sistema ERP base (agora ArcSat)
- **Brasil API** - API pública brasileira

---

## ⭐ Star History

Se este projeto foi útil para você, considere dar uma ⭐!

[![Star History Chart](https://api.star-history.com/svg?repos=avilaops/arcsat&type=Date)](https://star-history.com/#avilaops/arcsat&Date)

---

<div align="center">

**Desenvolvido com ❤️ para o mercado brasileiro**

[⬆ Voltar ao topo](#-arcsat---sistema-erp-completo)

</div>
