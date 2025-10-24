import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  env: string;
  port: number;
  mongodb: {
    uri: string;
    database?: string;
    cluster?: string;
    serverSelectionTimeout?: number;
    maxPoolSize?: number;
    minPoolSize?: number;
    maxIdleTime?: number;
    options: {
      maxPoolSize: number;
      minPoolSize: number;
    };
  };
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpiration: string;
    refreshExpiration: string;
  };
  bcrypt: {
    saltRounds: number;
  };
  cors: {
    origin: string[];
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
  azure: {
    appInsightsKey?: string;
    openaiEndpoint?: string;
    openaiApiKey?: string;
    searchEndpoint?: string;
    searchApiKey?: string;
  };
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5500', 10),
  
  mongodb: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/arcsat',
    database: process.env.MONGODB_DATABASE || 'arcsat-production',
    cluster: process.env.MONGODB_CLUSTER || 'arcsat-cluster',
    serverSelectionTimeout: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT || '5000', 10),
    maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '50', 10),
    minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '5', 10),
    maxIdleTime: parseInt(process.env.MONGODB_MAX_IDLE_TIME || '30000', 10),
    options: {
      maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '50', 10),
      minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '5', 10),
    },
  },
  
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret-change-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production',
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:3000',
      'http://localhost:5500',
      'https://wonderful-sand-0adc5890f.3.azurestaticapps.net',
      'https://arcsat.com.br',
      'https://www.arcsat.com.br',
      'https://app.arcsat.com.br',
      'https://api.arcsat.com.br',
      'https://docs.arcsat.com.br',
      'https://auth.arcsat.com.br'
    ],
  },
  
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo de 100 requests por janela
  },
  
  azure: {
    appInsightsKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY,
    openaiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
    openaiApiKey: process.env.AZURE_OPENAI_API_KEY,
    searchEndpoint: process.env.AZURE_SEARCH_ENDPOINT,
    searchApiKey: process.env.AZURE_SEARCH_API_KEY,
  },
};

// Validação de variáveis obrigatórias em produção
if (config.env === 'production') {
  const requiredEnvVars = [
    'MONGO_URI',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
  ];
  
  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }
}

export default config;
