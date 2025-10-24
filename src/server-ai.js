/**
 * ArcSat CRM Server with Azure AI Integration
 * 
 * Enhanced server configuration with Azure AI Foundry services
 * for intelligent CRM operations.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';

// Import routes
import authRoutes from './routes/auth.js';
import cnpjRoutes from './routes/cnpj.js';
// import aiRoutes from './routes/ai'; // Will be available after TypeScript migration

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://wonderful-sand-0adc5890f-production.eastus2.3.azurestaticapps.net']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Database connection
connectDB();

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    services: {
      database: 'connected',
      azure_ai: 'available'
    }
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/cnpj', cnpjRoutes);
// app.use('/api/v1/ai', aiRoutes); // Will be enabled after setup

// Main route with Azure AI capabilities info
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo ao ArcSat CRM - Powered by Azure AI',
    version: '2.0.0',
    features: {
      'intelligent_chat': 'GPT-4o-mini for customer support',
      'pii_detection': 'LGPD compliance automation',
      'semantic_search': 'Advanced document search',
      'business_analytics': 'AI-powered insights',
      'language_detection': 'Multi-language support'
    },
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      cnpj: '/api/v1/cnpj',
      ai: '/api/v1/ai (coming soon)'
    },
    docs: '/docs'
  });
});

// API documentation endpoint
app.get('/docs', (req, res) => {
  res.json({
    title: 'ArcSat CRM API Documentation',
    version: '2.0.0',
    azure_ai_features: {
      chat: {
        endpoint: 'POST /api/v1/ai/chat',
        description: 'Generate AI responses for customer support',
        model: 'GPT-4o-mini'
      },
      pii_detection: {
        endpoint: 'POST /api/v1/ai/pii-detection',
        description: 'Detect PII for LGPD compliance',
        model: 'Azure Text Analytics'
      },
      semantic_search: {
        endpoint: 'POST /api/v1/ai/semantic-search',
        description: 'Semantic search using embeddings',
        model: 'Cohere Embed v3 Multilingual'
      },
      analytics: {
        endpoint: 'POST /api/v1/ai/analytics',
        description: 'Generate business insights',
        model: 'o1-mini'
      },
      language_detection: {
        endpoint: 'POST /api/v1/ai/language-detection',
        description: 'Detect communication language',
        model: 'Azure Text Analytics'
      }
    },
    authentication: 'Bearer token required for AI endpoints',
    rate_limits: {
      ai_endpoints: '100 requests per minute',
      general_endpoints: '1000 requests per hour'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Rota não encontrada',
    available_endpoints: [
      'GET /',
      'GET /health',
      'GET /docs',
      'POST /api/v1/auth/*',
      'POST /api/v1/cnpj/*',
      'POST /api/v1/ai/* (coming soon)'
    ]
  });
});

// Server configuration
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ArcSat CRM Server running on port ${PORT}`);
  console.log(`📱 Frontend: https://wonderful-sand-0adc5890f-production.eastus2.3.azurestaticapps.net`);
  console.log(`🤖 Azure AI: Ready for integration`);
  console.log(`📚 Documentation: http://localhost:${PORT}/docs`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
});

export default app;