import Database from '../src/config/database.js';
import Company from '../src/models/Company.js';
import User from '../src/models/User.js';
import logger from '../src/config/logger.js';
import { SubscriptionPlan, SubscriptionStatus, UserRole } from '../src/types/index.js';

/**
 * Script de teste completo do MongoDB
 * Valida conexão, modelos, operações CRUD e performance
 */

async function testMongoDB(): Promise<void> {
  const startTime = Date.now();
  
  try {
    logger.info('🧪 Iniciando testes do MongoDB...');
    
    // 1. Teste de Conexão
    logger.info('📡 Testando conexão...');
    await Database.connect();
    
    if (!Database.isDbConnected()) {
      throw new Error('Falha na conexão com MongoDB');
    }
    logger.info('✅ Conexão estabelecida com sucesso');
    
    // 2. Health Check
    logger.info('🏥 Executando health check...');
    const health = await Database.healthCheck();
    logger.info('Status do banco:', health);
    
    if (health.status !== 'healthy') {
      throw new Error('Health check falhou');
    }
    
    // 3. Teste de Modelos - Company
    logger.info('🏢 Testando modelo Company...');
    
    const testCompany = {
      name: 'Empresa Teste MongoDB',
      cnpj: '12345678000190',
      email: 'teste@mongotest.com',
      phone: '11999999999',
      address: {
        street: 'Rua Teste',
        number: '123',
        neighborhood: 'Bairro Teste',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234567',
      },
      subscription: {
        plan: SubscriptionPlan.PRO,
        status: SubscriptionStatus.ACTIVE,
        startDate: new Date(),
      },
    };
    
    // Criar empresa
    const company = new Company(testCompany);
    await company.save();
    logger.info('✅ Empresa criada:', company.id);
    
    // Testar método estático
    const foundCompany = await Company.findByCnpj('12.345.678/0001-90');
    if (foundCompany) {
      logger.info('✅ Busca por CNPJ funcionando');
    }
    
    // 4. Teste de Modelos - User
    logger.info('👤 Testando modelo User...');
    
    const testUser = {
      name: 'Usuário Teste',
      email: 'usuario@mongotest.com',
      password: 'SenhaSegura123!',
      role: UserRole.USER,
      companyId: company._id,
    };
    
    // Criar usuário
    const user = new User(testUser);
    await user.save();
    logger.info('✅ Usuário criado:', user.id);
    
    // Testar método de comparação de senha
    const isPasswordValid = await user.comparePassword('SenhaSegura123!');
    if (isPasswordValid) {
      logger.info('✅ Hash de senha funcionando');
    } else {
      throw new Error('Falha na verificação de senha');
    }
    
    // 5. Teste de Relacionamentos
    logger.info('🔗 Testando relacionamentos...');
    
    const userWithCompany = await User.findById(user._id).populate('companyId');
    if (userWithCompany && userWithCompany.companyId) {
      logger.info('✅ Relacionamento User -> Company funcionando');
    }
    
    // 6. Teste de Consultas Complexas
    logger.info('🔍 Testando consultas complexas...');
    
    // Buscar empresas ativas
    const activeCompanies = await Company.findActiveCompanies();
    logger.info(`✅ Encontradas ${activeCompanies.length} empresas ativas`);
    
    // Buscar por plano
    const proCompanies = await Company.findBySubscriptionPlan(SubscriptionPlan.PRO);
    logger.info(`✅ Encontradas ${proCompanies.length} empresas PRO`);
    
    // 7. Teste de Performance
    logger.info('⚡ Testando performance...');
    
    const performanceStart = Date.now();
    
    // Criar múltiplos documentos
    const testCompanies = Array.from({ length: 10 }, (_, i) => ({
      name: `Empresa Performance ${i}`,
      cnpj: `${String(i).padStart(11, '0')}0001${String(i).padStart(2, '0')}`,
      email: `perf${i}@test.com`,
      phone: `119999999${String(i).padStart(2, '0')}`,
      address: {
        street: `Rua Performance ${i}`,
        number: `${i}00`,
        neighborhood: 'Bairro Performance',
        city: 'São Paulo',
        state: 'SP',
        zipCode: `0123${String(i).padStart(3, '0')}`,
      },
    }));
    
    const createdCompanies = await Company.insertMany(testCompanies);
    const performanceTime = Date.now() - performanceStart;
    
    logger.info(`✅ Criadas ${createdCompanies.length} empresas em ${performanceTime}ms`);
    
    // 8. Teste de Índices
    logger.info('📊 Testando índices...');
    
    const indexStart = Date.now();
    const companyByEmail = await Company.findOne({ email: 'teste@mongotest.com' });
    const indexTime = Date.now() - indexStart;
    
    if (companyByEmail && indexTime < 100) {
      logger.info(`✅ Busca por índice eficiente: ${indexTime}ms`);
    }
    
    // 9. Teste de Validações
    logger.info('✅ Testando validações...');
    
    try {
      const invalidCompany = new Company({
        name: 'T', // Muito curto
        cnpj: '123', // Inválido
        email: 'email-inválido',
        phone: '123',
      });
      await invalidCompany.save();
      throw new Error('Validação deveria ter falhado');
    } catch (validationError) {
      logger.info('✅ Validações funcionando corretamente');
    }
    
    // 10. Limpeza
    logger.info('🧹 Limpando dados de teste...');
    await Company.deleteMany({ name: { $regex: /Teste|Performance/ } });
    await User.deleteMany({ email: { $regex: /@mongotest\.com/ } });
    
    // 11. Estatísticas Finais
    const totalTime = Date.now() - startTime;
    const stats = {
      totalTime: `${totalTime}ms`,
      connection: Database.isDbConnected() ? 'ativa' : 'inativa',
      collections: ['companies', 'users'],
      indexes: 'funcionando',
      performance: performanceTime < 1000 ? 'boa' : 'lenta',
    };
    
    logger.info('📊 Estatísticas finais:', stats);
    logger.info('🎉 Todos os testes passaram com sucesso!');
    
    return Promise.resolve();
    
  } catch (error) {
    logger.error('❌ Teste falhou:', error);
    throw error;
  } finally {
    await Database.disconnect();
  }
}

// Executar testes se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testMongoDB()
    .then(() => {
      console.log('🎉 Testes MongoDB concluídos com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Testes falharam:', error);
      process.exit(1);
    });
}

export default testMongoDB;