import mongoose from 'mongoose';
import config from './env.js';
import logger from './logger.js';

class Database {
  private static instance: Database;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000; // 5 seconds

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      logger.info('✅ MongoDB já está conectado');
      return;
    }

    try {
      // Configurações otimizadas para produção
      mongoose.set('strictQuery', false);
      mongoose.set('debug', config.env === 'development');
      
      const connectionOptions = {
        // Configurações de timeout e retry
        serverSelectionTimeoutMS: config.mongodb.serverSelectionTimeout || 5000,
        heartbeatFrequencyMS: 10000,
        // Configurações de pool de conexões
        maxPoolSize: config.mongodb.maxPoolSize || 50,
        minPoolSize: config.mongodb.minPoolSize || 5,
        maxIdleTimeMS: config.mongodb.maxIdleTime || 30000,
        // Configurações de buffer
        bufferMaxEntries: 0,
        bufferCommands: false,
        // Configurações de compressão
        compressors: ['zlib'] as ('zlib' | 'none' | 'snappy' | 'zstd')[],
        // Configurações de segurança
        retryWrites: true,
        w: 'majority' as const,
        readPreference: 'primary' as const,
      };
      
      await mongoose.connect(config.mongodb.uri, connectionOptions);
      
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      logger.info('✅ MongoDB Atlas conectado com sucesso', {
        database: config.mongodb.database || 'arcsat-production',
        cluster: config.mongodb.cluster || 'arcsat-cluster',
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
      });

      await this.createIndexes();
      await this.validateConnection();

      // Event listeners
      this.setupEventListeners();

      // Graceful shutdown
      this.setupGracefulShutdown();

    } catch (error) {
      logger.error('❌ Erro ao conectar ao MongoDB Atlas:', error);
      this.isConnected = false;
      await this.handleReconnection();
      throw error;
    }
  }

  private setupEventListeners(): void {
    mongoose.connection.on('error', (error) => {
      logger.error('❌ Erro na conexão MongoDB:', error);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB desconectado');
      this.isConnected = false;
      this.handleReconnection();
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('🔄 MongoDB reconectado');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    mongoose.connection.on('close', () => {
      logger.info('📪 Conexão MongoDB fechada');
      this.isConnected = false;
    });
  }

  private async handleReconnection(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error(`❌ Falha ao reconectar após ${this.maxReconnectAttempts} tentativas`);
      return;
    }

    this.reconnectAttempts++;
    
    setTimeout(async () => {
      logger.info(`🔄 Tentativa de reconexão ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      try {
        await this.connect();
      } catch (error) {
        logger.error(`❌ Falha na tentativa de reconexão ${this.reconnectAttempts}:`, error);
      }
    }, this.reconnectInterval * this.reconnectAttempts);
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      logger.info(`📥 Recebido sinal ${signal}, fechando conexão MongoDB...`);
      await this.disconnect();
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGQUIT', () => shutdown('SIGQUIT'));
  }

  private async createIndexes(): Promise<void> {
    try {
      logger.info('🔨 Criando índices do banco de dados...');
      
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('Conexão com o banco não está disponível');
      }
      
      // Índices para a coleção Users
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      await db.collection('users').createIndex({ companyId: 1 });
      await db.collection('users').createIndex({ email: 1, companyId: 1 });
      await db.collection('users').createIndex({ isActive: 1 });
      
      // Índices para a coleção Companies
      await db.collection('companies').createIndex({ cnpj: 1 }, { unique: true });
      await db.collection('companies').createIndex({ 'subscription.status': 1 });
      await db.collection('companies').createIndex({ 'subscription.plan': 1 });
      
      // Índices para auditoria e performance
      await db.collection('users').createIndex({ createdAt: 1 });
      await db.collection('companies').createIndex({ createdAt: 1 });
      
      logger.info('✅ Índices criados com sucesso');
    } catch (error) {
      logger.error('❌ Erro ao criar índices:', error);
    }
  }

  private async validateConnection(): Promise<void> {
    try {
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('Conexão com o banco não está disponível');
      }
      
      // Teste de conectividade
      await db.admin().ping();
      
      // Verificar permissões básicas
      const collections = await db.listCollections().toArray();
      
      logger.info('✅ Conexão validada com sucesso', {
        collections: collections.length,
        state: mongoose.connection.readyState,
      });
    } catch (error) {
      logger.error('❌ Falha na validação da conexão:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      logger.info('📪 MongoDB já está desconectado');
      return;
    }

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      logger.info('📪 MongoDB desconectado com sucesso');
    } catch (error) {
      logger.error('❌ Erro ao desconectar MongoDB:', error);
      throw error;
    }
  }

  public getConnection(): typeof mongoose {
    if (!this.isConnected) {
      throw new Error('MongoDB não está conectado. Chame connect() primeiro.');
    }
    return mongoose;
  }

  public isDbConnected(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  public async healthCheck(): Promise<{ status: string; details: Record<string, unknown> }> {
    try {
      const db = mongoose.connection.db;
      if (!db) {
        return { status: 'unhealthy', details: { error: 'Database connection not available' } };
      }

      const ping = await db.admin().ping();
      const stats = await db.stats();
      
      return {
        status: 'healthy',
        details: {
          ping: ping.ok === 1,
          readyState: mongoose.connection.readyState,
          host: mongoose.connection.host,
          name: mongoose.connection.name,
          collections: stats.collections,
          dataSize: stats.dataSize,
          indexes: stats.indexes,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          readyState: mongoose.connection.readyState,
        },
      };
    }
  }
}

export default Database.getInstance();