import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import dotenv from "dotenv";
import { initializeMonitoring } from "./config/monitoring.js";
import { logEnvironmentStatus } from "./config/env-validator.js";

// Carregar variáveis de ambiente
dotenv.config();

// Validar variáveis de ambiente
logEnvironmentStatus();

// Inicializar Application Insights primeiro (para capturar todas as telemetrias)
const appInsightsClient = initializeMonitoring();

// Importar rotas
import authRoutes from "./routes/auth.js";
import cnpjRoutes from "./routes/cnpj.js";

// Inicializar Express
const app = express();

// Middlewares
// CORS Configuration - secure by default
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, use configured origins or deny
    const allowedOrigins = process.env.CORS_ORIGINS 
      ? JSON.parse(process.env.CORS_ORIGINS)
      : ['https://arcsat.com.br', 'https://app.arcsat.com.br'];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
app.use(express.json());

// Log de requisições no Application Insights
if (appInsightsClient) {
  app.use((req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      appInsightsClient.trackRequest({
        name: `${req.method} ${req.path}`,
        url: req.url,
        duration: duration,
        resultCode: res.statusCode,
        success: res.statusCode < 400
      });
    });
    next();
  });
}

// Conexão com o banco de dados
connectDB();

// Health check endpoint para Azure App Service
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: "1.0.0"
  });
});

// Readiness check para Azure
app.get("/api/health/ready", async (req, res) => {
  try {
    // Verificar conexão com MongoDB
    const mongoose = await import('mongoose');
    const dbState = mongoose.default.connection.readyState;
    
    if (dbState === 1) {
      res.status(200).json({
        status: "ready",
        database: "connected",
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: "not ready",
        database: "disconnected",
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(503).json({
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Rotas
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/cnpj", cnpjRoutes);

// Rota básica
app.get("/", (req, res) => {
  res.json({ 
    message: "Bem-vindo ao CRM da Ávila Inc",
    version: "1.0.0",
    docs: "/docs",
    health: "/health",
    environment: process.env.NODE_ENV || 'development',
    azure: {
      region: process.env.REGION_NAME || 'local',
      instanceId: process.env.WEBSITE_INSTANCE_ID || 'local'
    }
  });
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Rota não encontrada"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Log error to Application Insights
  if (appInsightsClient) {
    appInsightsClient.trackException({ exception: err });
  }

  res.status(err.statusCode || 500).json({
    status: "error",
    message: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Porta do servidor
const PORT = process.env.PORT || 5000;

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  
  // Log to Application Insights
  if (appInsightsClient) {
    appInsightsClient.trackEvent({ 
      name: 'ServerStarted',
      properties: {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version
      }
    });
  }
});

// Graceful shutdown para Azure
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('HTTP server closed.');
    
    // Fechar conexão com MongoDB
    import('mongoose').then(mongoose => {
      mongoose.default.connection.close(false, () => {
        console.log('MongoDB connection closed.');
        process.exit(0);
      });
    });
  });

  // Force close after 30 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
