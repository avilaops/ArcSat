# MongoDB Configuration - ArcSat CRM

## 🎯 Visão Geral

Este documento descreve a configuração completa do MongoDB Atlas para o sistema ArcSat CRM, incluindo integração com Azure e GitHub.

## 📊 Arquitetura do Banco

### Estrutura Principal

```
arcsat-production/
├── companies/          # Empresas (collection principal)
├── users/             # Usuários (relacionado à companies)
├── customers/         # Clientes das empresas
├── sales/            # Vendas e transações
├── products/         # Produtos e serviços
├── interactions/     # Interações com clientes
└── audit_logs/       # Logs de auditoria
```

### Modelos Principais

#### Company (Empresa)
```typescript
interface ICompany {
  _id: ObjectId;
  name: string;                    // Nome da empresa
  cnpj: string;                   // CNPJ formatado (validado)
  email: string;                  // Email corporativo
  phone: string;                  // Telefone formatado
  address: IAddress;              // Endereço completo
  customDomain?: string;          // Domínio personalizado
  subscription: ISubscription;    // Dados da assinatura
  settings: Record<string, any>;  // Configurações personalizadas
  createdAt: Date;
  updatedAt: Date;
}
```

#### User (Usuário)
```typescript
interface IUser {
  _id: ObjectId;
  name: string;              // Nome completo
  email: string;             // Email único
  password: string;          // Hash bcrypt
  role: UserRole;            // ADMIN | USER | VIEWER
  companyId: ObjectId;       // Referência à empresa
  avatar?: string;           // URL do avatar
  isActive: boolean;         // Status ativo/inativo
  lastLogin?: Date;          // Último acesso
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 Configuração

### 1. Variáveis de Ambiente

```bash
# MongoDB Atlas
MONGO_URI=mongodb+srv://arcsat-admin:password@arcsat-cluster.mongodb.net/arcsat-production?retryWrites=true&w=majority
MONGODB_USERNAME=arcsat-admin
MONGODB_PASSWORD=password
MONGODB_DATABASE=arcsat-production
MONGODB_CLUSTER=arcsat-cluster

# Pool de Conexões
MONGODB_MAX_POOL_SIZE=50
MONGODB_MIN_POOL_SIZE=5
MONGODB_MAX_IDLE_TIME=30000
MONGODB_SERVER_SELECTION_TIMEOUT=5000

# Azure Integration
AZURE_KEYVAULT_URL=https://arcsat-keyvault.vault.azure.net/
AZURE_MONGODB_SECRET_NAME=mongodb-connection-string

# Monitoring
MONGODB_ENABLE_MONITORING=true
MONGODB_SLOW_QUERY_THRESHOLD=100
MONGODB_LOG_LEVEL=info
```

### 2. Conexão Otimizada

```typescript
const connectionOptions = {
  serverSelectionTimeoutMS: 5000,
  heartbeatFrequencyMS: 10000,
  maxPoolSize: 50,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  bufferMaxEntries: 0,
  bufferCommands: false,
  compressors: ['zlib'],
  retryWrites: true,
  w: 'majority',
  readPreference: 'primary',
};
```

## 📈 Índices Otimizados

### Users Collection
```javascript
// Índices únicos
{ email: 1 }              // Único
{ email: 1, companyId: 1 } // Composto único

// Índices de performance
{ companyId: 1 }          // Queries por empresa
{ isActive: 1 }           // Filtros de status
{ createdAt: 1 }          // Ordenação temporal
```

### Companies Collection
```javascript
// Índices únicos
{ cnpj: 1 }               // Único

// Índices compostos
{ "subscription.plan": 1, "subscription.status": 1 }
{ "subscription.status": 1 }

// Text search
{ name: "text", email: "text" }

// Temporal
{ createdAt: 1 }
```

## 🚀 Scripts Disponíveis

### Inicialização e Testes
```bash
# Configurar MongoDB completamente
npm run db:setup

# Inicializar com dados de exemplo
npm run db:init

# Executar testes completos
npm run db:test

# Health check rápido
npm run db:health

# Popular dados de exemplo
npm run db:seed
```

### Scripts Detalhados

#### `npm run db:setup`
- Instala dependências necessárias
- Configura variáveis de ambiente
- Cria scripts de health check
- Configura Azure Key Vault
- Atualiza GitHub Actions

#### `npm run db:init`
- Conecta ao MongoDB Atlas
- Cria índices otimizados
- Popula dados de exemplo
- Valida conexão e performance

#### `npm run db:test`
- Testa conexão e health check
- Valida modelos e relacionamentos
- Executa operações CRUD
- Mede performance de queries
- Testa validações e constraints

## 🔐 Segurança

### Autenticação
- **Usuário**: `arcsat-admin`
- **Método**: MongoDB Atlas Authentication
- **Rede**: IP Whitelist configurado
- **Criptografia**: TLS 1.2+ obrigatório

### Backup e Recovery
- **Frequency**: Daily automated backups
- **Retention**: 30 days
- **Location**: Azure Blob Storage
- **Encryption**: AES-256

### Auditoria
```typescript
// Logs automáticos de todas as operações
interface AuditLog {
  userId: ObjectId;
  companyId: ObjectId;
  action: string;        // CREATE, UPDATE, DELETE
  collection: string;    // companies, users, etc
  documentId: ObjectId;
  changes: Record<string, any>;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}
```

## 🌐 Integração Azure

### Key Vault
```typescript
// Armazenamento seguro de connection strings
const keyVault = new SecretClient(
  'https://arcsat-keyvault.vault.azure.net/',
  new DefaultAzureCredential()
);

const mongoUri = await keyVault.getSecret('mongodb-connection-string');
```

### Application Insights
```typescript
// Monitoramento automático de queries
const telemetryClient = new TelemetryClient({
  instrumentationKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY
});

// Log de queries lentas
if (queryTime > 100) {
  telemetryClient.trackDependency({
    name: 'MongoDB Query',
    data: queryString,
    duration: queryTime,
    success: true,
    dependencyTypeName: 'MongoDB'
  });
}
```

## 🔄 GitHub Integration

### Actions Workflow
```yaml
name: MongoDB Health Check

on:
  push:
    branches: [ main ]
  schedule:
    - cron: '0 */6 * * *'  # A cada 6 horas

jobs:
  mongodb-health:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: MongoDB Health Check
      env:
        MONGO_URI: ${{ secrets.MONGO_URI }}
      run: npm run db:health
```

### Secrets Necessários
- `MONGO_URI`: Connection string completa
- `AZURE_CLIENT_ID`: Azure service principal
- `AZURE_CLIENT_SECRET`: Azure client secret
- `AZURE_TENANT_ID`: Azure tenant ID

## 📊 Monitoramento

### Métricas Chave
- **Connection Pool**: Uso atual vs máximo
- **Query Performance**: Queries > 100ms
- **Index Usage**: Eficiência dos índices
- **Storage**: Uso de espaço por collection
- **Throughput**: Operações por segundo

### Alertas Configurados
- Pool de conexões > 80% utilização
- Queries lentas > 1 segundo
- Falhas de conexão > 5 por minuto
- Storage > 80% da quota

## 🔧 Troubleshooting

### Problemas Comuns

#### Conexão Falhando
```bash
# Verificar variáveis de ambiente
echo $MONGO_URI

# Testar conectividade
npm run db:health

# Verificar whitelist de IPs no Atlas
```

#### Performance Lenta
```bash
# Verificar queries lentas
db.setProfilingLevel(2, { slowms: 100 })

# Analisar uso de índices
db.collection.explain("executionStats").find({...})

# Verificar pool de conexões
db.serverStatus().connections
```

#### Dados Inconsistentes
```bash
# Verificar integridade
npm run db:test

# Recriar índices
db.collection.reIndex()

# Validar documentos
db.collection.validate()
```

## 📝 Logs e Debugging

### Configuração de Logs
```typescript
// winston logger configuration
const logger = winston.createLogger({
  level: process.env.MONGODB_LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/mongodb.log' }),
    new winston.transports.Console()
  ]
});
```

### Debug Queries
```typescript
// Habilitar debug do mongoose
mongoose.set('debug', process.env.NODE_ENV === 'development');

// Log personalizado de queries
mongoose.connection.on('connected', () => {
  logger.info('MongoDB conectado');
});

mongoose.connection.on('error', (error) => {
  logger.error('Erro MongoDB:', error);
});
```

## 🎯 Best Practices

### Performance
1. **Use índices apropriados** para todas as queries frequentes
2. **Limite resultados** com `.limit()` em queries grandes
3. **Use projeção** para retornar apenas campos necessários
4. **Evite regex** em campos não indexados
5. **Use aggregation pipeline** para queries complexas

### Estrutura de Dados
1. **Embedar documentos** que sempre são acessados juntos
2. **Referenciar documentos** que podem crescer indefinidamente
3. **Desnormalizar** dados que são lidos frequentemente
4. **Normalizar** dados que são atualizados frequentemente

### Segurança
1. **Sempre validar** input do usuário
2. **Usar prepared statements** (mongoose faz automaticamente)
3. **Criptografar dados sensíveis** antes de armazenar
4. **Implementar rate limiting** por usuário/IP
5. **Auditar todas as operações** críticas

---

## 📞 Suporte

Para problemas relacionados ao MongoDB:

1. **Verificar logs**: `logs/mongodb.log`
2. **Executar testes**: `npm run db:test`
3. **Verificar status**: `npm run db:health`
4. **Consultar documentação**: [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

**Equipe Ávila Ops**
- Email: suporte@avilaops.com
- GitHub: [@avilaops](https://github.com/avilaops)
- Discord: ArcSat Community