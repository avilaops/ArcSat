#!/usr/bin/env node

/**
 * ArcSat MongoDB Setup with Azure Integration
 * Configura MongoDB Atlas com integração Azure e GitHub
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command: string): string {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    throw new Error(`Command failed: ${command}\n${error}`);
  }
}

async function setupMongoDB(): Promise<void> {
  log('🚀 ArcSat MongoDB Setup - Configuração com Azure e GitHub', 'cyan');
  log('==================================================', 'cyan');
  
  try {
    // 1. Verificar dependências
    log('\n📦 Verificando dependências...', 'yellow');
    
    const dependencies = [
      'mongoose',
      'bcryptjs',
      '@azure/identity',
      '@azure/keyvault-secrets',
      '@azure/monitor-opentelemetry-exporter',
    ];
    
    for (const dep of dependencies) {
      try {
        exec(`npm list ${dep}`);
        log(`✅ ${dep} encontrado`, 'green');
      } catch {
        log(`📥 Instalando ${dep}...`, 'yellow');
        exec(`npm install ${dep}`);
        log(`✅ ${dep} instalado`, 'green');
      }
    }
    
    // 2. Configurar variáveis de ambiente para MongoDB
    log('\n🔧 Configurando variáveis de ambiente...', 'yellow');
    
    const envPath = path.join(__dirname, '..', '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Atualizar/adicionar configurações do MongoDB
    const mongoConfig = `
# ========== MONGODB ATLAS CONFIGURATION ==========
# Connection String (MongoDB Atlas)
MONGO_URI=mongodb+srv://arcsat-admin:${generatePassword()}@arcsat-cluster.mongodb.net/arcsat-production?retryWrites=true&w=majority
MONGODB_USERNAME=arcsat-admin
MONGODB_PASSWORD=${generatePassword()}
MONGODB_DATABASE=arcsat-production
MONGODB_CLUSTER=arcsat-cluster

# Connection Pool Settings
MONGODB_MAX_POOL_SIZE=50
MONGODB_MIN_POOL_SIZE=5
MONGODB_MAX_IDLE_TIME=30000
MONGODB_SERVER_SELECTION_TIMEOUT=5000

# Azure Integration
AZURE_KEYVAULT_URL=https://arcsat-keyvault.vault.azure.net/
AZURE_MONGODB_SECRET_NAME=mongodb-connection-string

# Performance Monitoring
MONGODB_ENABLE_MONITORING=true
MONGODB_SLOW_QUERY_THRESHOLD=100
MONGODB_LOG_LEVEL=info
`;
    
    // Remover configurações antigas do MongoDB se existirem
    envContent = envContent.replace(/# ========== MONGODB.*?(?=\n# ==========|\n[A-Z_]+=|$)/gs, '');
    
    // Adicionar novas configurações
    envContent += mongoConfig;
    
    fs.writeFileSync(envPath, envContent);
    log('✅ Variáveis de ambiente configuradas', 'green');
    
    // 3. Criar script de saúde do MongoDB
    log('\n🏥 Criando script de health check...', 'yellow');
    
    const healthCheckScript = `
import Database from './src/config/database.js';
import logger from './src/config/logger.js';

async function healthCheck() {
  try {
    await Database.connect();
    const health = await Database.healthCheck();
    
    console.log('🏥 MongoDB Health Check:', health);
    
    if (health.status === 'healthy') {
      console.log('✅ MongoDB está funcionando corretamente');
      process.exit(0);
    } else {
      console.log('❌ MongoDB com problemas');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Erro no health check:', error);
    process.exit(1);
  }
}

healthCheck();
`;
    
    fs.writeFileSync(path.join(__dirname, '..', 'scripts', 'mongodb-health.js'), healthCheckScript);
    log('✅ Script de health check criado', 'green');
    
    // 4. Configurar Azure Key Vault para MongoDB
    log('\n🔐 Configurando Azure Key Vault...', 'yellow');
    
    const keyVaultConfig = `
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

class AzureKeyVaultManager {
  private client: SecretClient;
  
  constructor() {
    const credential = new DefaultAzureCredential();
    const vaultUrl = process.env.AZURE_KEYVAULT_URL || 'https://arcsat-keyvault.vault.azure.net/';
    this.client = new SecretClient(vaultUrl, credential);
  }
  
  async getMongoConnectionString(): Promise<string> {
    try {
      const secret = await this.client.getSecret('mongodb-connection-string');
      return secret.value || process.env.MONGO_URI || '';
    } catch (error) {
      console.warn('Fallback para MONGO_URI do .env:', error);
      return process.env.MONGO_URI || '';
    }
  }
  
  async setMongoConnectionString(connectionString: string): Promise<void> {
    await this.client.setSecret('mongodb-connection-string', connectionString);
  }
}

export default AzureKeyVaultManager;
`;
    
    fs.writeFileSync(path.join(__dirname, '..', 'src', 'config', 'azure-keyvault.ts'), keyVaultConfig);
    log('✅ Azure Key Vault configurado', 'green');
    
    // 5. Atualizar package.json com scripts MongoDB
    log('\n📝 Atualizando scripts do package.json...', 'yellow');
    
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    packageJson.scripts = {
      ...packageJson.scripts,
      'db:init': 'tsx scripts/init-database.ts',
      'db:health': 'node scripts/mongodb-health.js',
      'db:seed': 'tsx scripts/init-database.ts',
      'db:backup': 'tsx scripts/backup-database.ts',
      'db:migrate': 'tsx scripts/migrate-database.ts',
    };
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    log('✅ Scripts do package.json atualizados', 'green');
    
    // 6. Configurar GitHub Actions para MongoDB
    log('\n🔄 Configurando GitHub Actions...', 'yellow');
    
    const githubWorkflow = `
name: MongoDB Health Check

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 */6 * * *' # A cada 6 horas

jobs:
  mongodb-health:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: MongoDB Health Check
      env:
        MONGO_URI: \${{ secrets.MONGO_URI }}
        AZURE_CLIENT_ID: \${{ secrets.AZURE_CLIENT_ID }}
        AZURE_CLIENT_SECRET: \${{ secrets.AZURE_CLIENT_SECRET }}
        AZURE_TENANT_ID: \${{ secrets.AZURE_TENANT_ID }}
      run: npm run db:health
    
    - name: Database Backup (Production only)
      if: github.ref == 'refs/heads/main'
      env:
        MONGO_URI: \${{ secrets.MONGO_URI }}
        AZURE_STORAGE_CONNECTION_STRING: \${{ secrets.AZURE_STORAGE_CONNECTION_STRING }}
      run: npm run db:backup
`;
    
    const githubDir = path.join(__dirname, '..', '.github', 'workflows');
    if (!fs.existsSync(githubDir)) {
      fs.mkdirSync(githubDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(githubDir, 'mongodb-health.yml'), githubWorkflow);
    log('✅ GitHub Actions configurado', 'green');
    
    // 7. Teste de conexão
    log('\n🧪 Testando conexão com MongoDB...', 'yellow');
    
    try {
      exec('npm run db:health');
      log('✅ Conexão com MongoDB funcionando', 'green');
    } catch (error) {
      log('⚠️ Teste de conexão falhou (configure as credenciais corretas)', 'yellow');
    }
    
    // 8. Resumo final
    log('\n🎉 Configuração MongoDB concluída!', 'green');
    log('==========================================', 'green');
    
    console.log(`
${colors.cyan}📋 Próximos passos:${colors.reset}

1. ${colors.yellow}Configure suas credenciais MongoDB Atlas:${colors.reset}
   - Acesse: https://cloud.mongodb.com
   - Crie um cluster se não tiver
   - Configure usuário: arcsat-admin
   - Adicione IP da aplicação na whitelist

2. ${colors.yellow}Configure Azure Key Vault:${colors.reset}
   - Crie um Key Vault: arcsat-keyvault
   - Adicione a connection string como secret
   - Configure identidade gerenciada

3. ${colors.yellow}Configure GitHub Secrets:${colors.reset}
   - MONGO_URI
   - AZURE_CLIENT_ID
   - AZURE_CLIENT_SECRET
   - AZURE_TENANT_ID
   - AZURE_STORAGE_CONNECTION_STRING

4. ${colors.yellow}Comandos disponíveis:${colors.reset}
   - npm run db:init     # Inicializar banco com dados
   - npm run db:health   # Verificar saúde
   - npm run db:seed     # Popular dados de exemplo
   - npm run db:backup   # Backup do banco

${colors.green}✅ MongoDB está pronto para uso com Azure e GitHub!${colors.reset}
`);
    
  } catch (error) {
    log(`\n❌ Erro durante a configuração: ${error}`, 'red');
    process.exit(1);
  }
}

function generatePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Executar setup
if (import.meta.url === `file://${process.argv[1]}`) {
  setupMongoDB().catch(console.error);
}

export { setupMongoDB };