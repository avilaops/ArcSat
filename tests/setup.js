// Setup para testes com Jest
import dotenv from "dotenv";

// Carregar variáveis de ambiente para testes
dotenv.config({ path: ".env.test" });

// Configurações globais para testes
global.console = {
  ...console,
  // Desabilitar logs durante testes (opcional)
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  error: console.error, // Manter erros visíveis
};

// Aumentar timeout global se necessário
jest.setTimeout(10000);

// Cleanup após todos os testes
afterAll(async () => {
  // Fechar conexões, limpar recursos, etc.
  await new Promise((resolve) => setTimeout(() => resolve(), 500));
});
