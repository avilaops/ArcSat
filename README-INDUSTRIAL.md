# 🏭 ArcSat Industrial - Sistema de Gestão de Clientes

## Visão Geral

Sistema CRM especializado para consultoria industrial com inteligência artificial integrada. Focado em **Lean Manufacturing**, **ISO Compliance**, **Indústria 4.0** e **Gestão de Segurança**.

## 🚀 Quick Start

### 1. Instalação Rápida

```bash
# Copiar configuração do package.json
copy package-industrial.json package.json

# Instalar dependências
npm install

# Configurar ambiente
copy .env.industrial .env

# Iniciar sistema
npm run industrial
```

### 2. Acessar Dashboard

- **URL**: http://localhost:5000/dashboard
- **API Health**: http://localhost:5000/health
- **Status Azure AI**: Verificado automaticamente

### 3. Primeiro Cliente

1. Abrir dashboard
2. Clicar "Adicionar Cliente"
3. Preencher dados da indústria
4. Gerar diagnóstico com IA
5. Visualizar relatório executivo

## 🎯 Funcionalidades Principais

### ✅ Gestão de Clientes Industriais
- **Cadastro Especializado**: Campos específicos para indústrias
- **Perfil por Setor**: Metalúrgica, automotiva, química, etc.
- **KPIs Industriais**: OEE, defeitos, produtividade, custos
- **Histórico Completo**: Timeline de todas as interações

### 🤖 Inteligência Artificial Integrada
- **Análise Automática**: Perfil do cliente com IA
- **Diagnóstico Inteligente**: Identificação de oportunidades
- **Recomendações Personalizadas**: Por especialização
- **ROI Projetado**: Cálculos automáticos de retorno

### 📊 Especializações Suportadas

#### 🔧 Lean Manufacturing
- Identificação de desperdícios
- Implementação de Kanban
- Melhoria contínua (Kaizen)
- Mapeamento de fluxo de valor

#### 📋 ISO Compliance
- ISO 9001 (Qualidade)
- ISO 14001 (Ambiental) 
- ISO 45001 (Segurança)
- Auditoria e certificação

#### 🏭 Indústria 4.0
- IoT e sensores inteligentes
- Analytics e Big Data
- Automação avançada
- Digital Twin

#### ⚠️ Gestão de Segurança
- NR-12 (Segurança em máquinas)
- Análise de riscos (APR/HAZOP)
- Treinamentos obrigatórios
- Cultura de segurança

## 🛠️ Comandos Disponíveis

### Operação Principal
```bash
npm run industrial     # Iniciar sistema completo
npm run dashboard      # Abrir dashboard no navegador
npm start             # Modo produção
npm run dev           # Modo desenvolvimento (auto-reload)
```

### Especializações
```bash
npm run industrial:lean    # Setup Lean Manufacturing
npm run industrial:iso     # Setup ISO Compliance  
npm run industrial:i4      # Setup Indústria 4.0
npm run industrial:safety  # Setup Gestão Segurança
```

### Utilitários
```bash
npm run health        # Verificar status do sistema
npm run mcp:health    # Verificar MCP (opcional)
npm run azure:deploy  # Deploy para Azure
```

## 📡 API Endpoints

### Gestão de Clientes
```http
POST   /api/clientes/novo              # Criar cliente
GET    /api/clientes                   # Listar clientes
GET    /api/clientes/:id               # Detalhes cliente
PUT    /api/clientes/:id               # Atualizar cliente
DELETE /api/clientes/:id               # Remover cliente
```

### Inteligência Artificial
```http
GET    /api/clientes/:id/diagnostico   # Diagnóstico IA
GET    /api/clientes/:id/relatorio     # Relatório executivo
POST   /api/clientes/:id/analise       # Análise personalizada
GET    /api/clientes/:id/recomendacoes # Recomendações IA
```

### Sistema
```http
GET    /health                         # Status geral
GET    /dashboard                      # Interface web
GET    /api/status                     # Status detalhado
GET    /api/metrics                    # Métricas sistema
```

## 🔧 Configuração Azure AI

### Opção 1: Com Chave API (Recomendado)
```env
AZURE_OPENAI_ENDPOINT=https://seu-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=sua_chave_aqui
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-mini
```

### Opção 2: Com Azure Identity
```env
AZURE_CLIENT_ID=sua_client_id
AZURE_CLIENT_SECRET=sua_client_secret  
AZURE_TENANT_ID=sua_tenant_id
```

### Verificação
```bash
# Testar conexão
curl http://localhost:5000/health

# Resposta esperada
{
  "status": "ok",
  "azure_ai": true,
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

## 📋 Exemplo de Uso

### 1. Criar Cliente Metalúrgica
```javascript
const novoCliente = {
  nomeEmpresa: "Metalúrgica São Paulo",
  setor: "metalurgica", 
  numeroFuncionarios: 150,
  desafios: "Alto índice de defeitos, baixo OEE, falta de padronização"
};

// POST /api/clientes/novo
```

### 2. Diagnóstico Automático
```javascript
// GET /api/clientes/123/diagnostico
{
  "especializacao_recomendada": "lean_manufacturing",
  "oportunidades": [
    "Redução de 30% nos defeitos com controle estatístico",
    "Aumento de 25% no OEE com TPM",
    "Economia de R$ 200k/ano com redução de estoques"
  ],
  "roi_projetado": "350% em 8 meses",
  "timeline": "6-8 meses de implementação"
}
```

### 3. Relatório Executivo
```javascript
// GET /api/clientes/123/relatorio
{
  "resumo_executivo": {
    "situacao": "Oportunidades significativas identificadas",
    "potencial_economia": "R$ 500.000/ano",
    "areas_criticas": ["Qualidade", "OEE", "Estoque"]
  },
  "proximos_passos": [
    "Workshop de Lean Manufacturing",
    "Implementação de 5S",
    "Setup de dashboard OEE",
    "Treinamento de equipe"
  ]
}
```

## 🔍 Troubleshooting

### Azure AI Offline
```bash
# Verificar configuração
npm run health

# Se azure_ai: false
# 1. Verificar .env
# 2. Validar chaves Azure
# 3. Testar conectividade
```

### MCP Não Funciona
```bash
# Sistema funciona sem MCP
# Azure AI integrado diretamente
npm run mcp:health  # Status MCP
npm run industrial  # Funciona independente
```

### Porta 5000 Ocupada
```env
# Alterar em .env
PORT=5001
```

### Permissões Azure
```bash
# Verificar acesso ao recurso
# Validar chaves no portal Azure
# Conferir região do endpoint
```

## 📊 Métricas e KPIs

### Dashboard Executivo
- **Clientes Ativos**: Número total gerenciado
- **ROI Médio**: Retorno projetado médio
- **Especializações**: Distribuição por área
- **Pipeline**: Estágio dos projetos

### Métricas por Cliente
- **OEE Atual vs Target**: Eficiência operacional
- **Taxa de Defeitos**: Qualidade do processo
- **Produtividade**: Output por funcionário
- **Custos Manutenção**: Redução conseguida

## 🚀 Próximos Passos

### Fase 2 - Automação Avançada
- [ ] Integração com ERPs industriais
- [ ] Dashboards real-time com IoT
- [ ] Alertas automáticos de KPIs
- [ ] Relatórios programados

### Fase 3 - IA Avançada  
- [ ] Predição de manutenção
- [ ] Otimização automática de processos
- [ ] Análise preditiva de qualidade
- [ ] Chatbot para consultoria

### Fase 4 - Escalabilidade
- [ ] Multi-tenant para consultoras
- [ ] App mobile para auditores
- [ ] Integração com Azure IoT
- [ ] Marketplace de soluções

## 📞 Suporte

- **Documentação**: `/docs` folder
- **Issues**: GitHub Issues  
- **Email**: suporte@arcsat.com.br
- **WhatsApp**: +55 11 99999-9999

---

**🏭 ArcSat Industrial** - Transformando indústrias com IA e automação  
**Powered by**: Azure AI + Node.js + Express + TypeScript  
**Versão**: 1.0.0 | **Atualizado**: 24/01/2025