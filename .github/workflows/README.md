# GitHub Actions - ArcSat/Avx CRM

## 📋 Status dos Workflows

Este repositório possui **workflows adaptados** especificamente para o **ArcSat/Avx**, sem depender dos repositórios originais do Frappe.

### ✅ Workflows Ativos

| Workflow | Status | Descrição | Trigger |
|----------|--------|-----------|---------|
| **builds.yml** | 🟢 Ativo | Constrói imagens Docker do ArcSat | Push em main, tags, manual |
| **ci.yml** | 🟢 Ativo | Testes automatizados do ArcSat | Pull requests, manual |
| **linters.yml** | 🟢 Ativo | Validação de código Python | Pull requests, manual |
| **on_release.yml** | 🟢 Ativo | Cria releases semânticas | Push em main, tags, manual |
| **generate-pot-file.yml** | ✅ Mantido | Geração de arquivos de tradução | Automático |
| **release_notes.yml** | ✅ Mantido | Notas de release | Automático |

### 🎯 Diferenças dos Workflows Originais

#### ❌ Antes (Frappe CRM Original)
```yaml
# Baixava código do Frappe
- repository: frappe/crm
- repository: frappe/frappe_docker

# Usava configurações do Frappe
APPS_JSON='[{"url": "https://github.com/frappe/crm"}]'
```

#### ✅ Agora (ArcSat Customizado)
```yaml
# Usa código do próprio repositório
- uses: actions/checkout@v4  # Pega código do arcsat

# Copia o app ArcSat local
cp -r crm apps/crm

# Constrói Docker a partir do código local
COPY ../crm /home/frappe/arcsat-crm
```

### 📦 Workflow: builds.yml

**Função:** Constrói imagens Docker multi-arquitetura do ArcSat

**Como funciona:**
1. Faz checkout do código do ArcSat
2. Cria Dockerfile dinamicamente
3. Copia o código `crm/` para dentro da imagem
4. Modifica o script de inicialização para usar código local
5. Constrói para amd64 e arm64
6. Faz push para `ghcr.io/avilaops/arcsat`

**Tags geradas:**
- `ghcr.io/avilaops/arcsat:main`
- `ghcr.io/avilaops/arcsat:latest`
- `ghcr.io/avilaops/arcsat:v1.2.3` (quando taguear)

**Executar manualmente:**
```bash
# No GitHub
Actions → Build ArcSat Docker Image → Run workflow
```

### 🧪 Workflow: ci.yml

**Função:** Testa o ArcSat automaticamente em PRs

**Como funciona:**
1. Inicia MariaDB e Redis
2. Instala Frappe Bench
3. **Copia código do ArcSat local** (não clona do Frappe)
4. Cria site de teste
5. Roda testes com coverage
6. Gera relatório de cobertura

**Features:**
- ✅ Python 3.11 (como seu local)
- ✅ Cache de pip e npm
- ✅ Relatório de coverage como artefato
- ✅ Sem dependência do frappe/crm

### 🔍 Workflow: linters.yml

**Função:** Valida qualidade do código

**Checks:**
1. **Semantic Commits** - Valida mensagens de commit
2. **Python Linter** - Roda pre-commit no código do ArcSat

**Sem:**
- ❌ Semgrep do Frappe (removido)
- ❌ Regras específicas do Frappe

### 🚀 Workflow: on_release.yml

**Função:** Cria releases automáticas

**Configuração:**
- Bot: "ArcSat Bot"
- Email: avilaops@github.com
- Usa semantic-release padrão

### 🛠️ Como Usar

#### Build Manual de Imagem Docker
```bash
# Via GitHub Actions
1. Acesse: https://github.com/avilaops/arcsat/actions
2. Selecione: "Build ArcSat Docker Image"
3. Clique: "Run workflow"
4. Aguarde ~10 minutos

# Resultado
ghcr.io/avilaops/arcsat:latest
```

#### Usar Imagem Docker Publicada
```bash
# Pull da imagem
docker pull ghcr.io/avilaops/arcsat:latest

# Rodar
docker run -d \
  -p 8080:8000 \
  -p 9001:9000 \
  --name arcsat \
  ghcr.io/avilaops/arcsat:latest
```

#### Rodar Testes Localmente
```bash
# Mesmo processo do CI
bench init --python python3.11 frappe-bench
cd frappe-bench
cp -r /path/to/arcsat/crm apps/crm
bench pip install -e apps/crm
bench new-site test.localhost --admin-password admin
bench --site test.localhost install-app crm
bench --site test.localhost run-tests --app crm
```

### ✅ Sistema de Build Atual

**Use o Docker Compose local:**

```bash
# Localização do Docker setup
cd docker/

### 📝 Sistema de Build Local

Para desenvolvimento local, use o Docker Compose:

```bash
# Localização do Docker setup
cd docker/

# Iniciar sistema
docker-compose up -d

# Ver logs
docker logs -f crm-frappe-1

# Acessar sistema
# CRM: http://localhost:8080/crm
# ERP: http://localhost:8080/app
```

### 🔗 Referências

- [Docker Compose Local](../docker/docker-compose.yml)
- [Documentação de Integração](../INTEGRACAO_ERPNEXT.md)
- [Instalação CNPJ/CPF](../INSTALAR_CNPJ_CPF.md)
- [GitHub Actions Docs](https://docs.github.com/actions)

