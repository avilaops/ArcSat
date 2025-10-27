export default {
  // Ambiente de teste
  testEnvironment: "node",

  // Padrões de arquivos de teste
  testMatch: [
    "**/__tests__/**/*.js",
    "**/?(*.)+(spec|test).js"
  ],

  // Cobertura de código
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js",
    "!src/**/*.test.js",
    "!src/**/*.spec.js"
  ],

  // Limites de cobertura
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // Timeout para testes
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Transform
  transform: {},

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],

  // Module paths
  moduleDirectories: ["node_modules", "src"],

  // Clear mocks entre testes
  clearMocks: true,

  // Resetar mocks entre testes
  resetMocks: true,

  // Restaurar mocks entre testes
  restoreMocks: true
};
