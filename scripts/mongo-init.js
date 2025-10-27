// Script para inicializar MongoDB com dados de teste
db = db.getSiblingDB('arcsat');

// Criar coleções
db.createCollection('users');
db.createCollection('companies');
db.createCollection('customdomains');
db.createCollection('webhooks');

// Criar índices
db.users.createIndex({ email: 1 }, { unique: true });
db.companies.createIndex({ cnpj: 1 }, { unique: true });
db.customdomains.createIndex({ domain: 1 }, { unique: true });

print('Database initialized successfully!');
