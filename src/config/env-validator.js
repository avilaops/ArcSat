/**
 * Azure Environment Variables Validator
 * Validates that required environment variables are set for Azure deployment
 */

const requiredEnvVars = {
  development: [
    'MONGO_URI',
    'JWT_SECRET',
    'PORT',
    'NODE_ENV'
  ],
  production: [
    'MONGO_URI',
    'JWT_SECRET',
    'NODE_ENV',
    'APPLICATIONINSIGHTS_CONNECTION_STRING',
    'API_URL',
    'FRONTEND_URL'
  ]
};

const optionalEnvVars = [
  'AZURE_SUBSCRIPTION_ID',
  'AZURE_TENANT_ID',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS',
  'CLOUDFLARE_API_TOKEN',
  'CLOUDFLARE_ZONE_ID'
];

/**
 * Validate environment variables
 * @param {string} environment - The environment (development, production, etc.)
 * @returns {Object} - Validation result with status and missing variables
 */
export const validateEnvironment = (environment = 'development') => {
  const required = requiredEnvVars[environment] || requiredEnvVars.development;
  const missing = [];
  const present = [];
  const optional = [];

  // Check required variables
  required.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    } else {
      present.push(varName);
    }
  });

  // Check optional variables
  optionalEnvVars.forEach(varName => {
    if (process.env[varName]) {
      optional.push(varName);
    }
  });

  const isValid = missing.length === 0;

  return {
    isValid,
    environment,
    required: {
      present,
      missing
    },
    optional
  };
};

/**
 * Log environment validation results
 */
export const logEnvironmentStatus = () => {
  const environment = process.env.NODE_ENV || 'development';
  const validation = validateEnvironment(environment);

  console.log('\n📋 Environment Variables Status:');
  console.log('─'.repeat(50));
  console.log(`Environment: ${validation.environment}`);
  console.log(`\n✅ Required variables present: ${validation.required.present.length}`);
  
  if (validation.required.present.length > 0) {
    validation.required.present.forEach(varName => {
      console.log(`   ✓ ${varName}`);
    });
  }

  if (validation.required.missing.length > 0) {
    console.log(`\n❌ Required variables missing: ${validation.required.missing.length}`);
    validation.required.missing.forEach(varName => {
      console.log(`   ✗ ${varName}`);
    });
  }

  if (validation.optional.length > 0) {
    console.log(`\n📦 Optional variables configured: ${validation.optional.length}`);
    validation.optional.forEach(varName => {
      console.log(`   • ${varName}`);
    });
  }

  console.log('─'.repeat(50) + '\n');

  if (!validation.isValid) {
    console.error('⚠️  WARNING: Some required environment variables are missing!');
    console.error('Please configure missing variables before deploying to production.\n');
  }

  return validation;
};

export default { validateEnvironment, logEnvironmentStatus };
