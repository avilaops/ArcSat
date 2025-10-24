/**
 * Azure AI Routes for ArcSat CRM
 * 
 * API endpoints for integrating Azure AI services
 * with the CRM platform.
 */

import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import {
  chatService,
  piiDetectionService,
  embeddingService,
  analyticsService,
  languageService,
  checkAzureAIHealth
} from '../config/azure-ai';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * POST /api/ai/chat
 * Generate AI-powered chat responses for customer support
 */
router.post('/chat', [
  body('message').isString().trim().isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('context').optional().isString().trim().isLength({ max: 2000 })
    .withMessage('Context must be less than 2000 characters')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { message, context } = req.body;
    
    const response = await chatService.generateResponse(message, context);
    
    res.json({
      success: true,
      data: {
        response,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      success: false,
      error: 'Falha ao gerar resposta do chat'
    });
  }
});

/**
 * POST /api/ai/pii-detection
 * Detect personally identifiable information for LGPD compliance
 */
router.post('/pii-detection', [
  body('text').isString().trim().isLength({ min: 1, max: 5000 })
    .withMessage('Text must be between 1 and 5000 characters')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { text } = req.body;
    
    const result = await piiDetectionService.detectPII(text);
    
    res.json({
      success: true,
      data: {
        ...result,
        timestamp: new Date().toISOString(),
        compliance: {
          lgpd: result.hasPII ? 'ATTENTION_REQUIRED' : 'COMPLIANT'
        }
      }
    });
  } catch (error) {
    console.error('PII Detection API error:', error);
    res.status(500).json({
      success: false,
      error: 'Falha na detecção de PII'
    });
  }
});

/**
 * POST /api/ai/semantic-search
 * Perform semantic search using embeddings
 */
router.post('/semantic-search', [
  body('query').isString().trim().isLength({ min: 1, max: 500 })
    .withMessage('Query must be between 1 and 500 characters'),
  body('documents').isArray().isLength({ min: 1, max: 100 })
    .withMessage('Documents array must contain 1-100 items'),
  body('documents.*.id').isString().trim().notEmpty(),
  body('documents.*.content').isString().trim().isLength({ min: 1, max: 2000 })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { query, documents } = req.body;
    
    const results = await embeddingService.findSimilarContent(query, documents);
    
    res.json({
      success: true,
      data: {
        query,
        results,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Semantic Search API error:', error);
    res.status(500).json({
      success: false,
      error: 'Falha na busca semântica'
    });
  }
});

/**
 * POST /api/ai/analytics
 * Generate business insights from CRM data
 */
router.post('/analytics', [
  body('data').isArray().isLength({ min: 1, max: 1000 })
    .withMessage('Data array must contain 1-1000 items'),
  body('analysisType').optional().isIn(['sales', 'customers', 'general'])
    .withMessage('Analysis type must be sales, customers, or general')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { data, analysisType = 'general' } = req.body;
    
    const insights = await analyticsService.generateInsights(data);
    
    res.json({
      success: true,
      data: {
        ...insights,
        analysisType,
        dataPoints: data.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    res.status(500).json({
      success: false,
      error: 'Falha na geração de insights'
    });
  }
});

/**
 * POST /api/ai/language-detection
 * Detect language of customer communications
 */
router.post('/language-detection', [
  body('text').isString().trim().isLength({ min: 1, max: 1000 })
    .withMessage('Text must be between 1 and 1000 characters')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { text } = req.body;
    
    const result = await languageService.detectLanguage(text);
    
    res.json({
      success: true,
      data: {
        ...result,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Language Detection API error:', error);
    res.status(500).json({
      success: false,
      error: 'Falha na detecção de idioma'
    });
  }
});

/**
 * GET /api/ai/health
 * Check health status of all AI services
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const healthStatus = await checkAzureAIHealth();
    
    res.status(healthStatus.status === 'healthy' ? 200 : 503).json({
      success: true,
      data: {
        ...healthStatus,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AI Health Check error:', error);
    res.status(500).json({
      success: false,
      error: 'Falha na verificação de saúde dos serviços de IA'
    });
  }
});

export default router;