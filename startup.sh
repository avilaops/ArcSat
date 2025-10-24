#!/bin/bash

# Azure App Service Startup Script for ArcSat API
# This script is executed when the container starts on Azure

echo "🔵 Starting ArcSat API on Azure App Service..."

# Set Node environment
export NODE_ENV="${NODE_ENV:-production}"
echo "📝 Node Environment: $NODE_ENV"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci --production
fi

# Display Node and NPM versions
echo "📌 Node version: $(node --version)"
echo "📌 NPM version: $(npm --version)"

# Display Azure-specific environment info
if [ ! -z "$WEBSITE_INSTANCE_ID" ]; then
    echo "☁️  Azure Instance ID: $WEBSITE_INSTANCE_ID"
fi

if [ ! -z "$REGION_NAME" ]; then
    echo "🌍 Azure Region: $REGION_NAME"
fi

# Start the application
echo "🚀 Starting application..."
exec node src/server.js
