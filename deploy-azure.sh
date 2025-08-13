#!/bin/bash

echo "🚀 StockPulse Pro Azure Deployment Script"
echo "========================================="

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first:"
    echo "   https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Login to Azure
echo "🔐 Logging in to Azure..."
az login

# Set variables
RESOURCE_GROUP="stockpulse-rg"
LOCATION="eastus"
STATIC_APP_NAME="stockpulse-pro"

# Create resource group
echo "📦 Creating resource group: $RESOURCE_GROUP"
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Static Web App
echo "🌐 Creating Azure Static Web App..."
az staticwebapp create \
    --name $STATIC_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --source https://github.com/adityadhimaann/stockpulse-pro \
    --location $LOCATION \
    --branch main \
    --app-location "/" \
    --output-location "dist" \
    --login-with-github

echo "✅ Deployment initiated! Your app will be available at:"
echo "   https://$STATIC_APP_NAME.azurestaticapps.net"
echo ""
echo "📝 Next steps:"
echo "1. Go to Azure Portal > Static Web Apps > $STATIC_APP_NAME"
echo "2. Add environment variables in Configuration:"
echo "   - VITE_SUPABASE_URL: Your Supabase URL"
echo "   - VITE_SUPABASE_ANON_KEY: Your Supabase anon key"
echo "3. Wait for GitHub Actions to complete the build"
echo ""
echo "🔍 Monitor deployment at:"
echo "   https://github.com/adityadhimaann/stockpulse-pro/actions"
