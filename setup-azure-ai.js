#!/usr/bin/env node

/**
 * Azure AI Foundry Setup Script for ArcSat CRM
 * 
 * This script configures the necessary AI model deployments
 * in your Azure AI Foundry resource.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

const execAsync = promisify(exec);
dotenv.config();

// Configuration
const config = {
  resourceGroup: 'Avila',
  resourceName: 'arcsat-resource',
  subscription: '3b49f371-dd88-46c7-ba30-aeb54bd5c2f6',
  location: 'westus',
  models: [
    {
      name: 'gpt-4o-mini',
      deploymentName: 'gpt-4o-mini-chat',
      version: 'latest',
      capacity: 10, // TPM (Tokens Per Minute) in thousands
      purpose: 'Customer support chat'
    },
    {
      name: 'text-embedding-ada-002',
      deploymentName: 'embeddings-ada',
      version: 'latest',
      capacity: 5,
      purpose: 'Semantic search and embeddings'
    },
    {
      name: 'o1-mini',
      deploymentName: 'o1-mini-reasoning',
      version: 'latest',
      capacity: 2,
      purpose: 'Complex business analytics'
    }
  ]
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function checkAzureCLI() {
  try {
    await execAsync('az --version');
    log('✅ Azure CLI is installed', colors.green);
    return true;
  } catch (error) {
    log('❌ Azure CLI not found. Please install Azure CLI first.', colors.red);
    log('   Download: https://docs.microsoft.com/cli/azure/install-azure-cli', colors.blue);
    return false;
  }
}

async function loginToAzure() {
  try {
    log('🔐 Checking Azure authentication...', colors.blue);
    await execAsync('az account show');
    log('✅ Already logged in to Azure', colors.green);
    return true;
  } catch (error) {
    log('❌ Not logged in to Azure', colors.yellow);
    log('Please run: az login', colors.blue);
    return false;
  }
}

async function setSubscription() {
  try {
    log(`🎯 Setting subscription to ${config.subscription}...`, colors.blue);
    await execAsync(`az account set --subscription ${config.subscription}`);
    log('✅ Subscription set successfully', colors.green);
    return true;
  } catch (error) {
    log(`❌ Failed to set subscription: ${error.message}`, colors.red);
    return false;
  }
}

async function checkResource() {
  try {
    log(`🔍 Checking if resource ${config.resourceName} exists...`, colors.blue);
    const { stdout } = await execAsync(`az cognitiveservices account show --name ${config.resourceName} --resource-group ${config.resourceGroup}`);
    const resource = JSON.parse(stdout);
    log(`✅ Resource found: ${resource.name} (${resource.kind})`, colors.green);
    return true;
  } catch (error) {
    log(`❌ Resource ${config.resourceName} not found`, colors.red);
    log('Please create the resource first in Azure portal', colors.blue);
    return false;
  }
}

async function deployModel(model) {
  try {
    log(`🚀 Deploying ${model.name} as ${model.deploymentName}...`, colors.blue);
    
    const command = `az cognitiveservices account deployment create \\
      --resource-group ${config.resourceGroup} \\
      --name ${config.resourceName} \\
      --deployment-name ${model.deploymentName} \\
      --model-name ${model.name} \\
      --model-version ${model.version} \\
      --model-format OpenAI \\
      --sku-capacity ${model.capacity} \\
      --sku-name Standard`;

    await execAsync(command);
    log(`✅ ${model.name} deployed successfully for ${model.purpose}`, colors.green);
    return true;
  } catch (error) {
    if (error.message.includes('already exists')) {
      log(`⚠️  ${model.deploymentName} already exists`, colors.yellow);
      return true;
    }
    log(`❌ Failed to deploy ${model.name}: ${error.message}`, colors.red);
    return false;
  }
}

async function listDeployments() {
  try {
    log('📋 Listing current deployments...', colors.blue);
    const { stdout } = await execAsync(`az cognitiveservices account deployment list --resource-group ${config.resourceGroup} --name ${config.resourceName}`);
    const deployments = JSON.parse(stdout);
    
    if (deployments.length === 0) {
      log('📭 No deployments found', colors.yellow);
    } else {
      log(`📦 Found ${deployments.length} deployment(s):`, colors.green);
      deployments.forEach(dep => {
        log(`   • ${dep.name} (${dep.properties.model.name})`, colors.cyan);
      });
    }
    return deployments;
  } catch (error) {
    log(`❌ Failed to list deployments: ${error.message}`, colors.red);
    return [];
  }
}

async function getResourceKeys() {
  try {
    log('🔑 Retrieving resource keys...', colors.blue);
    const { stdout } = await execAsync(`az cognitiveservices account keys list --resource-group ${config.resourceGroup} --name ${config.resourceName}`);
    const keys = JSON.parse(stdout);
    
    log('✅ Keys retrieved successfully', colors.green);
    log('🔐 Add these to your .env file:', colors.yellow);
    log(`AZURE_AI_KEY=${keys.key1}`, colors.cyan);
    log(`AZURE_OPENAI_ENDPOINT=https://${config.resourceName}.cognitiveservices.azure.com/`, colors.cyan);
    
    return keys;
  } catch (error) {
    log(`❌ Failed to get keys: ${error.message}`, colors.red);
    return null;
  }
}

async function createEnvironmentFile(keys) {
  if (!keys) return;

  const envContent = `# Azure AI Configuration for ArcSat CRM
# Generated on ${new Date().toISOString()}

# Azure AI Services
AZURE_OPENAI_ENDPOINT=https://${config.resourceName}.cognitiveservices.azure.com/
AZURE_AI_KEY=${keys.key1}

# Model Deployments
AI_CHAT_DEPLOYMENT=gpt-4o-mini-chat
AI_EMBEDDINGS_DEPLOYMENT=embeddings-ada
AI_REASONING_DEPLOYMENT=o1-mini-reasoning

# Feature Flags
ENABLE_AI_CHAT=true
ENABLE_PII_DETECTION=true
ENABLE_SEMANTIC_SEARCH=true
ENABLE_AI_ANALYTICS=true

# Rate Limiting
AI_RATE_LIMIT_REQUESTS=100
AI_RATE_LIMIT_WINDOW=60000
`;

  const fs = await import('fs');
  fs.writeFileSync('.env.azure-ai', envContent);
  log('✅ Environment file created: .env.azure-ai', colors.green);
}

async function main() {
  log('🚀 Azure AI Foundry Setup for ArcSat CRM', colors.bright);
  log('==========================================', colors.bright);

  // Pre-checks
  if (!(await checkAzureCLI())) return;
  if (!(await loginToAzure())) return;
  if (!(await setSubscription())) return;
  if (!(await checkResource())) return;

  // List current deployments
  await listDeployments();

  // Deploy models
  log('\n🤖 Deploying AI models...', colors.bright);
  for (const model of config.models) {
    await deployModel(model);
  }

  // Final status
  log('\n📊 Final deployment status:', colors.bright);
  await listDeployments();

  // Get keys and create env file
  const keys = await getResourceKeys();
  await createEnvironmentFile(keys);

  log('\n🎉 Setup completed successfully!', colors.green);
  log('\nNext steps:', colors.bright);
  log('1. Copy .env.azure-ai to your .env file', colors.blue);
  log('2. Test the AI endpoints with: npm run test:ai', colors.blue);
  log('3. Deploy your application', colors.blue);
}

// Run the setup
main().catch(error => {
  log(`💥 Setup failed: ${error.message}`, colors.red);
  process.exit(1);
});