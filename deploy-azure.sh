#!/bin/bash

# Azure Deployment Script for ArcSat
# This script automates the deployment of ArcSat to Azure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 ArcSat Azure Deployment Script${NC}"
echo "=================================="

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI not found. Please install it first.${NC}"
    echo "Visit: https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi

echo -e "${GREEN}✓ Azure CLI found${NC}"

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Azure. Logging in...${NC}"
    az login
fi

echo -e "${GREEN}✓ Logged in to Azure${NC}"

# Variables (can be overridden with environment variables)
RESOURCE_GROUP=${AZURE_RESOURCE_GROUP:-"ArcSat-RG"}
LOCATION=${AZURE_LOCATION:-"brazilsouth"}
ENVIRONMENT=${DEPLOY_ENVIRONMENT:-"prod"}
APP_NAME=${APP_NAME:-"arcsat"}

echo ""
echo "Deployment Configuration:"
echo "------------------------"
echo "Resource Group: $RESOURCE_GROUP"
echo "Location: $LOCATION"
echo "Environment: $ENVIRONMENT"
echo "App Name: $APP_NAME"
echo ""

read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deployment cancelled.${NC}"
    exit 0
fi

# Create resource group if it doesn't exist
echo -e "${YELLOW}📦 Creating resource group...${NC}"
az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --output table

echo -e "${GREEN}✓ Resource group ready${NC}"

# Deploy using Bicep template
echo -e "${YELLOW}🏗️  Deploying infrastructure with Bicep...${NC}"
DEPLOYMENT_OUTPUT=$(az deployment group create \
  --name "arcsat-deployment-$(date +%Y%m%d-%H%M%S)" \
  --resource-group "$RESOURCE_GROUP" \
  --template-file azure-deploy.bicep \
  --parameters azure-deploy.parameters.json \
  --parameters environment="$ENVIRONMENT" appName="$APP_NAME" \
  --output json)

echo -e "${GREEN}✓ Infrastructure deployed${NC}"

# Extract outputs
WEB_APP_NAME=$(echo "$DEPLOYMENT_OUTPUT" | jq -r '.properties.outputs.webAppName.value')
WEB_APP_URL=$(echo "$DEPLOYMENT_OUTPUT" | jq -r '.properties.outputs.webAppUrl.value')
STATIC_WEB_APP_NAME=$(echo "$DEPLOYMENT_OUTPUT" | jq -r '.properties.outputs.staticWebAppName.value')
KEY_VAULT_NAME=$(echo "$DEPLOYMENT_OUTPUT" | jq -r '.properties.outputs.keyVaultName.value')
PRINCIPAL_ID=$(echo "$DEPLOYMENT_OUTPUT" | jq -r '.properties.outputs.webAppPrincipalId.value')

echo ""
echo "Deployment Summary:"
echo "-------------------"
echo "Web App Name: $WEB_APP_NAME"
echo "Web App URL: $WEB_APP_URL"
echo "Static Web App: $STATIC_WEB_APP_NAME"
echo "Key Vault: $KEY_VAULT_NAME"
echo ""

# Grant Key Vault access to Web App
echo -e "${YELLOW}🔐 Configuring Key Vault access...${NC}"
az keyvault set-policy \
  --name "$KEY_VAULT_NAME" \
  --object-id "$PRINCIPAL_ID" \
  --secret-permissions get list \
  --output none

echo -e "${GREEN}✓ Key Vault access configured${NC}"

# Deploy application code
echo -e "${YELLOW}📤 Deploying application code...${NC}"
npm ci --production

# Create deployment package
echo -e "${YELLOW}📦 Creating deployment package...${NC}"
mkdir -p deploy
cp -r src package*.json web.config startup.sh .deployment deploy/
cd deploy && npm ci --production && cd ..

# Zip the deployment
zip -r deploy.zip deploy/

# Deploy to Azure Web App
az webapp deployment source config-zip \
  --resource-group "$RESOURCE_GROUP" \
  --name "$WEB_APP_NAME" \
  --src deploy.zip

# Clean up
rm -rf deploy deploy.zip

echo -e "${GREEN}✓ Application deployed${NC}"

# Test health endpoint
echo -e "${YELLOW}🏥 Testing health endpoint...${NC}"
sleep 10
if curl -f -s "$WEB_APP_URL/health" > /dev/null; then
    echo -e "${GREEN}✓ Application is healthy!${NC}"
else
    echo -e "${RED}⚠️  Health check failed. Please check logs.${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Configure secrets in Key Vault: $KEY_VAULT_NAME"
echo "2. Set up custom domains"
echo "3. Configure GitHub Actions secrets"
echo ""
echo "Access your application at: $WEB_APP_URL"
