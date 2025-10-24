# Azure AI Foundry - Correção de Permissões
# Instruções para resolver os erros de permissão

## Problemas Identificados

### 1. ❌ No deployed models
- **Erro:** "There are no deployed models in this project"
- **Causa:** Nenhum modelo foi deployado no projeto Azure AI Foundry
- **Solução:** Deploy dos modelos necessários

### 2. ❌ Vector Stores Permission
- **Erro:** Principal '231c21a1-f133-4024-9a7c-7bf8d4350fae' lacks required data action 'Microsoft.CognitiveServices/accounts/AIServices/assets/read'
- **Causa:** Falta permissão para ler Vector Stores
- **Solução:** Atribuir role "Cognitive Services User" ou superior

### 3. ❌ Agents Permission  
- **Erro:** Failed to load agents for project arcsat: 401
- **Causa:** Falta permissão para carregar agentes
- **Solução:** Atribuir role "Cognitive Services Contributor"

## 🔧 Soluções

### Passo 1: Fazer Login Interativo no Azure
```bash
az logout
az login
az account set --subscription "3b49f371-dd88-46c7-ba30-aeb54bd5c2f6"
```

### Passo 2: Configurar Permissões RBAC
```bash
# Cognitive Services User (para leitura)
az role assignment create \
  --role "Cognitive Services User" \
  --assignee "231c21a1-f133-4024-9a7c-7bf8d4350fae" \
  --scope "/subscriptions/3b49f371-dd88-46c7-ba30-aeb54bd5c2f6/resourceGroups/Avila/providers/Microsoft.CognitiveServices/accounts/arcsat-resource"

# Cognitive Services Contributor (para escrita)
az role assignment create \
  --role "Cognitive Services Contributor" \
  --assignee "231c21a1-f133-4024-9a7c-7bf8d4350fae" \
  --scope "/subscriptions/3b49f371-dd88-46c7-ba30-aeb54bd5c2f6/resourceGroups/Avila/providers/Microsoft.CognitiveServices/accounts/arcsat-resource"

# AI Developer (para projetos AI Foundry)
az role assignment create \
  --role "AI Developer" \
  --assignee "231c21a1-f133-4024-9a7c-7bf8d4350fae" \
  --scope "/subscriptions/3b49f371-dd88-46c7-ba30-aeb54bd5c2f6/resourceGroups/Avila/providers/Microsoft.CognitiveServices/accounts/arcsat-resource"
```

### Passo 3: Deploy de Modelos Essenciais
```bash
# GPT-4o-mini para chat
az cognitiveservices account deployment create \
  --resource-group "Avila" \
  --name "arcsat-resource" \
  --deployment-name "gpt-4o-mini-chat" \
  --model-name "gpt-4o-mini" \
  --model-version "2024-07-18" \
  --model-format "OpenAI" \
  --sku-capacity 10 \
  --sku-name "Standard"

# Text Embeddings para Vector Search
az cognitiveservices account deployment create \
  --resource-group "Avila" \
  --name "arcsat-resource" \
  --deployment-name "text-embedding-ada-002" \
  --model-name "text-embedding-ada-002" \
  --model-version "2" \
  --model-format "OpenAI" \
  --sku-capacity 5 \
  --sku-name "Standard"

# GPT-4 para análises complexas
az cognitiveservices account deployment create \
  --resource-group "Avila" \
  --name "arcsat-resource" \
  --deployment-name "gpt-4-analysis" \
  --model-name "gpt-4" \
  --model-version "turbo-2024-04-09" \
  --model-format "OpenAI" \
  --sku-capacity 3 \
  --sku-name "Standard"
```

### Passo 4: Verificar Configuração
```bash
# Listar deployments
az cognitiveservices account deployment list \
  --resource-group "Avila" \
  --name "arcsat-resource"

# Verificar permissões
az role assignment list \
  --scope "/subscriptions/3b49f371-dd88-46c7-ba30-aeb54bd5c2f6/resourceGroups/Avila/providers/Microsoft.CognitiveServices/accounts/arcsat-resource"

# Testar conexão
az cognitiveservices account show \
  --resource-group "Avila" \
  --name "arcsat-resource"
```

## 🎯 Roles Necessárias

### Cognitive Services User
- **Descrição:** Permite ler e chamar APIs dos Cognitive Services
- **Ações:** `Microsoft.CognitiveServices/*/read`, `Microsoft.CognitiveServices/accounts/*/read`
- **Necessária para:** Vector Stores, leitura de modelos

### Cognitive Services Contributor  
- **Descrição:** Gerenciamento completo de recursos Cognitive Services
- **Ações:** `Microsoft.CognitiveServices/*`
- **Necessária para:** Agents, criação/modificação de recursos

### AI Developer
- **Descrição:** Role específica para Azure AI Foundry
- **Ações:** Acesso completo a projetos AI, modelos e agentes
- **Necessária para:** Projetos AI Foundry, deployment de modelos

## 🔍 Verificação de Status

Após executar os comandos, verifique:

1. ✅ Modelos deployados aparecem na UI
2. ✅ Vector Stores carregam sem erro
3. ✅ Agents são listados corretamente
4. ✅ Permissões RBAC estão ativas

## 📞 Suporte

Se ainda houver problemas:
1. Verificar se o principal existe no Azure AD
2. Confirmar que tem Owner/Contributor na subscription
3. Aguardar 5-10 minutos para propagação de permissões
4. Fazer refresh na UI do Azure AI Foundry