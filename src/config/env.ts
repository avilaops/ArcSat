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
  };
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5500', 10),
  
  mongodb: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/arcsat',
    options: {
      maxPoolSize: 10,
      minPoolSize: 2,
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
      'https://www.arcsat.com.br',
      'https://arcsat.com.br'
    ],
  },
  
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo de 100 requests por janela
  },
  
  azure: {
    appInsightsKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY,
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
