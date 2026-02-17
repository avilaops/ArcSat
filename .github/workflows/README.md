# GitHub Actions - ArcSat/Avx CRM

## 📋 Status dos Workflows

Este repositório **desabilitou os workflows automáticos** do Frappe CRM original, pois são incompatíveis com a versão customizada **ArcSat/Avx**.

### ❌ Workflows Desabilitados

| Workflow | Status | Motivo |
|----------|--------|--------|
| **builds.yml** | 🔴 Desabilitado | Tentava construir do repo `frappe/crm` original |
| **ci.yml** | 🔴 Desabilitado | Testes configurados para Frappe, não ArcSat |
| **linters.yml** | 🔴 Desabilitado | Usa regras Semgrep do Frappe |
| **on_release.yml** | 🔴 Desabilitado | Usa credenciais do Frappe PR Bot |
| **generate-pot-file.yml** | ✅ Ativo | Pode manter para i18n |
| **release_notes.yml** | ✅ Ativo | Funcional |

### ✅ Sistema de Build Atual

**Use o Docker Compose local:**

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

### 🔧 Se Precisar de CI/CD

Para configurar CI/CD personalizado para o **ArcSat**, você pode:

#### Opção 1: Docker Build Simples

```yaml
name: Build ArcSat Docker Image

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker Image
        working-directory: docker
        run: docker-compose build
      
      - name: Tag Image
        run: |
          docker tag crm-frappe:latest ghcr.io/${{ github.repository }}:latest
      
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Push Image
        run: docker push ghcr.io/${{ github.repository }}:latest
```

#### Opção 2: Build Nativo (sem Docker)

```yaml
name: Test ArcSat

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mariadb:
        image: mariadb:10.8
        env:
          MYSQL_ROOT_PASSWORD: root
        ports:
          - 3306:3306
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python 3.11
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install Frappe Bench
        run: |
          pip install frappe-bench
          bench init --skip-redis-config-generation frappe-bench
          cd frappe-bench
      
      - name: Install ArcSat
        run: |
          cd frappe-bench
          bench get-app ${{ github.workspace }}
          bench new-site test.localhost --admin-password admin --db-root-password root
          bench --site test.localhost install-app crm
      
      - name: Run Tests
        run: |
          cd frappe-bench
          bench --site test.localhost run-tests --app crm
```

#### Opção 3: GitHub Actions com Multi-arch

```yaml
name: Build Multi-Architecture Image

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: docker
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

### 📝 Notas

- Os workflows originais do Frappe CRM foram **intencionalmente desabilitados**
- Para reativá-los manualmente, use `workflow_dispatch` no GitHub Actions
- O sistema de build atual está em [`docker/docker-compose.yml`](../docker/docker-compose.yml)
- Para desenvolvimento local, sempre use `docker-compose up -d`

### 🔗 Referências

- [Docker Compose Local](../docker/docker-compose.yml)
- [Documentação de Integração](../INTEGRACAO_ERPNEXT.md)
- [Instalação CNPJ/CPF](../INSTALAR_CNPJ_CPF.md)
- [GitHub Actions Docs](https://docs.github.com/actions)
