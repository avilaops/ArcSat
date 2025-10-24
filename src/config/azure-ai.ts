/**
 * Azure AI Foundry Configuration for ArcSat CRM
 * 
 * This module provides configuration and utilities for integrating
 * Azure AI services with the ArcSat CRM platform.
 * 
 * @author Ávila Ops Team
 * @date 2025-10-24
 */

import { DefaultAzureCredential } from '@azure/identity';
import { OpenAIClient } from '@azure/openai';

// Environment variables configuration
interface AzureAIConfig {
  endpoint: string;
  apiVersion: string;
  deployment: {
    chat: string;
    embeddings: string;
    reasoning: string;
    pii: string;
    languageDetection: string;
  };
  credentials: DefaultAzureCredential;
}

// Azure AI Foundry Configuration
export const azureAIConfig: AzureAIConfig = {
  endpoint: process.env.AZURE_OPENAI_ENDPOINT || 'https://arcsat-resource.cognitiveservices.azure.com/',
  apiVersion: '2024-10-21',
  deployment: {
    chat: 'gpt-4o-mini',           // For customer support chat
    embeddings: 'cohere-embed-v3', // For semantic search
    reasoning: 'o1-mini',          // For complex analysis
    pii: 'text-pii',              // For PII detection (LGPD compliance)
    languageDetection: 'language-detection' // For language detection
  },
  credentials: new DefaultAzureCredential()
};

// Initialize OpenAI Client with Managed Identity
export const openaiClient = new OpenAIClient(
  azureAIConfig.endpoint,
  azureAIConfig.credentials
);

/**
 * Chat Service for Customer Support
 * Uses GPT-4o-mini for cost-effective conversations
 */
export class ChatService {
  async generateResponse(message: string, context?: string): Promise<string> {
    try {
      const response = await openaiClient.getChatCompletions(
        azureAIConfig.deployment.chat,
        [
          {
            role: 'system',
            content: `Você é um assistente de CRM da plataforma ArcSat. 
                     Seja profissional, útil e conciso. 
                     ${context ? `Contexto adicional: ${context}` : ''}`
          },
          {
            role: 'user',
            content: message
          }
        ],
        {
          maxTokens: 500,
          temperature: 0.7
        }
      );

      return response.choices[0]?.message?.content || 'Desculpe, não consegui processar sua solicitação.';
    } catch (error) {
      console.error('Error in ChatService:', error);
      throw new Error('Falha ao gerar resposta do chat');
    }
  }
}

/**
 * PII Detection Service for LGPD Compliance
 * Detects personally identifiable information in text
 */
export class PIIDetectionService {
  async detectPII(text: string): Promise<{
    hasPII: boolean;
    entities: Array<{
      text: string;
      type: string;
      confidence: number;
    }>;
  }> {
    try {
      // Note: Using Azure AI Services Text Analytics for PII detection
      // This is a placeholder - implement actual Azure Text Analytics call
      
      const response = await fetch(`${azureAIConfig.endpoint}/text/analytics/v3.1/entities/recognition/pii`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': process.env.AZURE_AI_KEY!
        },
        body: JSON.stringify({
          documents: [
            {
              id: '1',
              language: 'pt-br',
              text: text
            }
          ]
        })
      });

      const result = await response.json();
      
      return {
        hasPII: result.documents[0]?.entities?.length > 0,
        entities: result.documents[0]?.entities || []
      };
    } catch (error) {
      console.error('Error in PII Detection:', error);
      throw new Error('Falha na detecção de PII');
    }
  }
}

/**
 * Embedding Service for Semantic Search
 * Uses Cohere multilingual embeddings
 */
export class EmbeddingService {
  async getEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const response = await openaiClient.getEmbeddings(
        azureAIConfig.deployment.embeddings,
        texts
      );

      return response.data.map(item => item.embedding);
    } catch (error) {
      console.error('Error in Embedding Service:', error);
      throw new Error('Falha ao gerar embeddings');
    }
  }

  async findSimilarContent(
    query: string, 
    documents: Array<{ id: string; content: string; embedding?: number[] }>
  ): Promise<Array<{ id: string; content: string; similarity: number }>> {
    try {
      const queryEmbedding = await this.getEmbeddings([query]);
      
      const similarities = documents.map(doc => {
        if (!doc.embedding) return { ...doc, similarity: 0 };
        
        const similarity = this.cosineSimilarity(queryEmbedding[0], doc.embedding);
        return { 
          id: doc.id, 
          content: doc.content, 
          similarity 
        };
      });

      return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5); // Top 5 results
    } catch (error) {
      console.error('Error in similarity search:', error);
      throw new Error('Falha na busca semântica');
    }
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }
}

/**
 * Analytics Service for Business Intelligence
 * Uses o1-mini for complex reasoning and insights
 */
export class AnalyticsService {
  async generateInsights(data: any[]): Promise<{
    summary: string;
    trends: string[];
    recommendations: string[];
  }> {
    try {
      const dataStr = JSON.stringify(data, null, 2);
      
      const response = await openaiClient.getChatCompletions(
        azureAIConfig.deployment.reasoning,
        [
          {
            role: 'system',
            content: `Você é um analista de dados especializado em CRM. 
                     Analise os dados fornecidos e gere insights acionáveis.
                     Foque em:
                     1. Tendências de vendas
                     2. Comportamento de clientes
                     3. Oportunidades de melhoria
                     4. Riscos potenciais
                     
                     Responda em JSON com: summary, trends[], recommendations[]`
          },
          {
            role: 'user',
            content: `Analise estes dados de CRM: ${dataStr}`
          }
        ],
        {
          maxTokens: 1000,
          temperature: 0.3
        }
      );

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      return JSON.parse(content);
    } catch (error) {
      console.error('Error in Analytics Service:', error);
      throw new Error('Falha na geração de insights');
    }
  }
}

/**
 * Language Detection Service
 * Automatically detects the language of customer communications
 */
export class LanguageService {
  async detectLanguage(text: string): Promise<{
    language: string;
    confidence: number;
  }> {
    try {
      // Placeholder for Azure Text Analytics Language Detection
      const response = await fetch(`${azureAIConfig.endpoint}/text/analytics/v3.1/languages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': process.env.AZURE_AI_KEY!
        },
        body: JSON.stringify({
          documents: [
            {
              id: '1',
              text: text
            }
          ]
        })
      });

      const result = await response.json();
      const detectedLanguage = result.documents[0]?.detectedLanguage;
      
      return {
        language: detectedLanguage?.iso6391Name || 'pt',
        confidence: detectedLanguage?.confidenceScore || 0
      };
    } catch (error) {
      console.error('Error in Language Detection:', error);
      return { language: 'pt', confidence: 0.5 }; // Default to Portuguese
    }
  }
}

// Export service instances
export const chatService = new ChatService();
export const piiDetectionService = new PIIDetectionService();
export const embeddingService = new EmbeddingService();
export const analyticsService = new AnalyticsService();
export const languageService = new LanguageService();

// Health check function
export async function checkAzureAIHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  services: Record<string, boolean>;
}> {
  const services = {
    chat: false,
    embeddings: false,
    pii: false,
    language: false
  };

  try {
    // Test chat service
    await chatService.generateResponse('Health check');
    services.chat = true;
  } catch (error) {
    console.error('Chat service health check failed:', error);
  }

  try {
    // Test embedding service
    await embeddingService.getEmbeddings(['test']);
    services.embeddings = true;
  } catch (error) {
    console.error('Embedding service health check failed:', error);
  }

  try {
    // Test PII detection
    await piiDetectionService.detectPII('test text');
    services.pii = true;
  } catch (error) {
    console.error('PII service health check failed:', error);
  }

  try {
    // Test language detection
    await languageService.detectLanguage('test text');
    services.language = true;
  } catch (error) {
    console.error('Language service health check failed:', error);
  }

  const allHealthy = Object.values(services).every(status => status);
  
  return {
    status: allHealthy ? 'healthy' : 'unhealthy',
    services
  };
}