import mongoose from 'mongoose';
import config from './env.js';
import logger from './logger.js';

class Database {
  private static instance: Database;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      logger.info('MongoDB já está conectado');
      return;
    }

    try {
      mongoose.set('strictQuery', false);
      
      await mongoose.connect(config.mongodb.uri, config.mongodb.options);
      
      this.isConnected = true;
      logger.info('✅ MongoDB conectado com sucesso');

      // Event listeners
      mongoose.connection.on('error', (error) => {
        logger.error('Erro na conexão MongoDB:', error);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB desconectado');
        this.isConnected = false;
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });

    } catch (error) {
      logger.error('Erro ao conectar ao MongoDB:', error);
      this.isConnected = false;
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      logger.info('MongoDB desconectado');
    } catch (error) {
      logger.error('Erro ao desconectar MongoDB:', error);
      throw error;
    }
  }

  public getConnection(): typeof mongoose {
    if (!this.isConnected) {
      throw new Error('MongoDB não está conectado');
    }
    return mongoose;
  }
}

export default Database.getInstance();
