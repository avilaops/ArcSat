# 🗄️ Configuração do Banco de Dados - MongoDB

O ArcSat CRM suporta **MongoDB** em diferentes ambientes, incluindo **Azure Cosmos DB** (recomendado para produção).

## 📋 Opções de Banco de Dados

### 1️⃣ Azure Cosmos DB (MongoDB API) - **RECOMENDADO** 🌟

Melhor opção para produção no Azure com:
- ✅ Escalabilidade automática
- ✅ Distribuição global
- ✅ SLA de 99,999%
- ✅ Backup automático
- ✅ Baixa latência garantida

#### Setup via Azure CLI

```powershell
# Criar Cosmos DB Account (MongoDB API)
az cosmosdb create `
  --name arcsat-cosmosdb `
  --resource-group rg-arcsat-crm `
  --kind MongoDB `
  --server-version 4.2 `
  --locations regionName=brazilsouth failoverPriority=0 `
  --default-consistency-level Session `
  --enable-automatic-failover true

# Criar Database
az cosmosdb mongodb database create `
  --account-name arcsat-cosmosdb `
  --resource-group rg-arcsat-crm `
  --name arcsat-crm-db

# Criar Collections principais
az cosmosdb mongodb collection create `
  --account-name arcsat-cosmosdb `
  --resource-group rg-arcsat-crm `
  --database-name arcsat-crm-db `
  --name users `
  --shard "tenantId" `
  --throughput 400

az cosmosdb mongodb collection create `
  --account-name arcsat-cosmosdb `
  --resource-group rg-arcsat-crm `
  --database-name arcsat-crm-db `
  --name companies `
  --shard "tenantId" `
  --throughput 400

# Obter Connection String
az cosmosdb keys list `
  --name arcsat-cosmosdb `
  --resource-group rg-arcsat-crm `
  --type connection-strings `
  --query "connectionStrings[0].connectionString" -o tsv
```

#### Connection String Format

```
mongodb://arcsat-cosmosdb:PASSWORD@arcsat-cosmosdb.mongo.cosmos.azure.com:10255/arcsat-crm-db?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@arcsat-cosmosdb@
```

### 2️⃣ MongoDB Atlas - Cloud Nativo

Alternativa cloud-native ao Azure:

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster gratuito (M0)
3. Configure IP Whitelist: `0.0.0.0/0` (todos IPs)
4. Crie usuário e senha
5. Obtenha a connection string

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/arcsat-crm?retryWrites=true&w=majority
```

### 3️⃣ MongoDB Local - Desenvolvimento

Para desenvolvimento local:

```powershell
# Via Docker (Recomendado)
docker run -d `
  --name mongodb-arcsat `
  -p 27017:27017 `
  -e MONGO_INITDB_ROOT_USERNAME=admin `
  -e MONGO_INITDB_ROOT_PASSWORD=password123 `
  -v mongodb_data:/data/db `
  mongo:7.0

# Connection String
# MONGODB_URI=mongodb://admin:password123@localhost:27017/arcsat-crm?authSource=admin
```

Ou instale localmente: [Download MongoDB](https://www.mongodb.com/try/download/community)

## ⚙️ Configuração no Projeto

### Passo 1: Configurar Variáveis de Ambiente

```powershell
# Copiar arquivo de exemplo
Copy-Item .env.example .env

# Editar .env e adicionar sua connection string
notepad .env
```

No arquivo `.env`:

```env
# Azure Cosmos DB
MONGODB_URI=mongodb://arcsat-cosmosdb:KEY@arcsat-cosmosdb.mongo.cosmos.azure.com:10255/arcsat-crm-db?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000

# OU MongoDB Atlas
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/arcsat-crm

# OU MongoDB Local
MONGODB_URI=mongodb://localhost:27017/arcsat-crm
```

### Passo 2: Testar Conexão

```powershell
# Testar conexão
node test-mongodb-quick.js
```

### Passo 3: Seed do Banco (Opcional)

```powershell
# Popular com dados iniciais
npm run db:seed
```

## 🔒 Segurança em Produção

### Azure Key Vault (Recomendado)

```powershell
# Criar Key Vault
az keyvault create `
  --name arcsat-keyvault `
  --resource-group rg-arcsat-crm `
  --location brazilsouth

# Adicionar MongoDB URI como secret
$mongoUri = "sua-connection-string-aqui"
az keyvault secret set `
  --vault-name arcsat-keyvault `
  --name mongodb-uri `
  --value $mongoUri

# Configurar Web App para usar Key Vault
$webAppId = az webapp identity assign `
  --name arcsat-crm `
  --resource-group rg-arcsat-crm `
  --query principalId -o tsv

az keyvault set-policy `
  --name arcsat-keyvault `
  --object-id $webAppId `
  --secret-permissions get list

# Atualizar App Settings
az webapp config appsettings set `
  --name arcsat-crm `
  --resource-group rg-arcsat-crm `
  --settings MONGODB_URI="@Microsoft.KeyVault(SecretUri=https://arcsat-keyvault.vault.azure.net/secrets/mongodb-uri/)"
```

## 📊 Estrutura do Banco de Dados

### Collections Principais

```javascript
// users - Usuários do sistema
{
  _id: ObjectId,
  tenantId: String,        // Identificador do tenant (multi-tenancy)
  email: String,
  password: String,        // Hashed
  name: String,
  role: String,            // admin, user, viewer
  createdAt: Date,
  updatedAt: Date
}

// companies - Empresas/Clientes
{
  _id: ObjectId,
  tenantId: String,
  cnpj: String,
  razaoSocial: String,
  nomeFantasia: String,
  email: String,
  telefone: String,
  endereco: Object,
  status: String,          // active, inactive
  createdAt: Date,
  updatedAt: Date
}

// customDomains - Domínios personalizados
{
  _id: ObjectId,
  tenantId: String,
  domain: String,
  isVerified: Boolean,
  createdAt: Date
}
```

### Índices Recomendados

```javascript
// Criar índices para performance
db.users.createIndex({ tenantId: 1, email: 1 }, { unique: true })
db.users.createIndex({ tenantId: 1 })
db.companies.createIndex({ tenantId: 1, cnpj: 1 }, { unique: true })
db.companies.createIndex({ tenantId: 1 })
db.customDomains.createIndex({ domain: 1 }, { unique: true })
```

## 🧪 Testes

### Testar Conexão Manualmente

```javascript
// test-connection.js
import mongoose from 'mongoose';

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado com sucesso!');
    
    const admin = mongoose.connection.db.admin();
    const info = await admin.serverStatus();
    console.log('📊 MongoDB version:', info.version);
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
};

testConnection();
```

## 📈 Monitoramento

### Via Azure Portal

1. Acesse Azure Portal
2. Navegue até Cosmos DB > arcsat-cosmosdb
3. Visualize:
   - Métricas de RU/s
   - Latência
   - Disponibilidade
   - Tamanho do storage

### Via Application Insights

Logs de queries são enviados automaticamente quando configurado.

## 🔧 Troubleshooting

### Erro: "Connection Timeout"

```powershell
# Verificar firewall
az cosmosdb list-connection-strings `
  --name arcsat-cosmosdb `
  --resource-group rg-arcsat-crm

# Adicionar IP do App Service
az cosmosdb network-rule add `
  --name arcsat-cosmosdb `
  --resource-group rg-arcsat-crm `
  --virtual-network /subscriptions/xxx/resourceGroups/xxx/providers/Microsoft.Network/virtualNetworks/xxx
```

### Erro: "Authentication Failed"

- Verifique se a connection string está correta
- Confirme que o usuário tem permissões adequadas
- Teste a conexão via MongoDB Compass

### Erro: "Too Many Connections"

Ajuste o pool de conexões em `src/db.js`:

```javascript
const mongooseOptions = {
  maxPoolSize: 20,  // Aumentar
  minPoolSize: 5,
  // ...
};
```

## 📚 Recursos

- [Cosmos DB MongoDB API Docs](https://docs.microsoft.com/azure/cosmos-db/mongodb/)
- [MongoDB Mongoose Docs](https://mongoosejs.com/docs/)
- [Best Practices Azure Cosmos DB](https://docs.microsoft.com/azure/cosmos-db/mongodb/best-practices)

---

**💡 Dica**: Para produção, sempre use Azure Cosmos DB com Key Vault para máxima segurança e performance.
