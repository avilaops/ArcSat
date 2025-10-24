import Database from '../src/config/database.js';
import User from '../src/models/User.js';
import Company from '../src/models/Company.js';
import logger from '../src/config/logger.js';
import { SubscriptionPlan, SubscriptionStatus, UserRole } from '../src/types/index.js';

// Dados de exemplo para inicialização
const sampleCompanies = [
  {
    name: 'Ávila Ops Tecnologia Ltda',
    cnpj: '12.345.678/0001-90',
    email: 'contato@avilaops.com',
    phone: '(11) 99999-9999',
    address: {
      street: 'Av. Paulista',
      number: '1000',
      complement: 'Sala 101',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
    },
    customDomain: 'avilaops.arcsat.com.br',
    subscription: {
      plan: SubscriptionPlan.ENTERPRISE,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-12-31'),
    },
    settings: {
      theme: 'dark',
      timezone: 'America/Sao_Paulo',
      language: 'pt-BR',
      features: {
        aiAssistant: true,
        advancedReports: true,
        customIntegrations: true,
      },
    },
  },
  {
    name: 'Indústria Beta S.A.',
    cnpj: '98.765.432/0001-10',
    email: 'admin@industriabeta.com.br',
    phone: '(11) 88888-8888',
    address: {
      street: 'Rua das Indústrias',
      number: '500',
      neighborhood: 'Distrito Industrial',
      city: 'São Bernardo do Campo',
      state: 'SP',
      zipCode: '09600-000',
    },
    subscription: {
      plan: SubscriptionPlan.PRO,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date('2024-06-01'),
      endDate: new Date('2025-06-01'),
    },
    settings: {
      theme: 'light',
      timezone: 'America/Sao_Paulo',
      language: 'pt-BR',
      features: {
        aiAssistant: true,
        advancedReports: false,
        customIntegrations: false,
      },
    },
  },
  {
    name: 'Startup Gamma Tech',
    cnpj: '11.222.333/0001-44',
    email: 'hello@gammatech.io',
    phone: '(11) 77777-7777',
    address: {
      street: 'Rua dos Empreendedores',
      number: '123',
      complement: 'Coworking Space',
      neighborhood: 'Vila Olímpia',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04551-060',
    },
    subscription: {
      plan: SubscriptionPlan.FREE,
      status: SubscriptionStatus.TRIAL,
      startDate: new Date(),
    },
    settings: {
      theme: 'auto',
      timezone: 'America/Sao_Paulo',
      language: 'pt-BR',
      features: {
        aiAssistant: false,
        advancedReports: false,
        customIntegrations: false,
      },
    },
  },
];

const sampleUsers = [
  {
    name: 'Alexandre Ávila',
    email: 'alexandre@avilaops.com',
    password: 'ArcSat2024!',
    role: UserRole.ADMIN,
    avatar: 'https://avatars.githubusercontent.com/avilaops',
  },
  {
    name: 'Maria Silva',
    email: 'maria@industriabeta.com.br',
    password: 'Industrial2024!',
    role: UserRole.ADMIN,
  },
  {
    name: 'João Santos',
    email: 'joao@industriabeta.com.br',
    password: 'Manager2024!',
    role: UserRole.USER,
  },
  {
    name: 'Ana Costa',
    email: 'ana@gammatech.io',
    password: 'Startup2024!',
    role: UserRole.ADMIN,
  },
];

async function initializeDatabase(): Promise<void> {
  try {
    logger.info('🚀 Iniciando configuração do banco de dados...');
    
    // Conectar ao banco
    await Database.connect();
    
    // Limpar dados existentes (cuidado em produção!)
    if (process.env.NODE_ENV !== 'production') {
      logger.info('🧹 Limpando dados existentes...');
      await User.deleteMany({});
      await Company.deleteMany({});
    }
    
    // Criar empresas
    logger.info('🏢 Criando empresas de exemplo...');
    const createdCompanies = await Company.insertMany(sampleCompanies);
    logger.info(`✅ ${createdCompanies.length} empresas criadas`);
    
    // Criar usuários associados às empresas
    logger.info('👥 Criando usuários de exemplo...');
    const usersWithCompanyIds = sampleUsers.map((user, index) => ({
      ...user,
      companyId: createdCompanies[Math.floor(index / 2)]._id, // 2 usuários por empresa (exceto última)
    }));
    
    const createdUsers = await User.insertMany(usersWithCompanyIds);
    logger.info(`✅ ${createdUsers.length} usuários criados`);
    
    // Verificar saúde do banco
    const healthCheck = await Database.healthCheck();
    logger.info('🏥 Status do banco de dados:', healthCheck);
    
    // Estatísticas finais
    const totalCompanies = await Company.countDocuments();
    const totalUsers = await User.countDocuments();
    const activeCompanies = await Company.findActiveCompanies();
    
    logger.info('📊 Estatísticas finais:', {
      totalCompanies,
      totalUsers,
      activeCompanies: activeCompanies.length,
      database: 'arcsat-production',
      status: 'ready',
    });
    
    logger.info('✅ Banco de dados configurado com sucesso!');
    
  } catch (error) {
    logger.error('❌ Erro ao configurar banco de dados:', error);
    throw error;
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => {
      logger.info('🎉 Configuração concluída!');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('💥 Falha na configuração:', error);
      process.exit(1);
    });
}

export default initializeDatabase;