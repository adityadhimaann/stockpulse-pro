#!/bin/bash

echo "🚀 StockPulse Pro Vercel Deployment"
echo "==================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Set up environment variables
echo "🔧 Setting up environment variables..."
echo "Please provide your Supabase credentials:"

read -p "Enter your Supabase URL: " SUPABASE_URL
read -p "Enter your Supabase Anon Key: " SUPABASE_ANON_KEY
read -p "Enter your Alpha Vantage API Key: " ALPHA_VANTAGE_KEY
read -p "Enter your Gemini API Key: " GEMINI_KEY

# Login to Vercel
echo "🔐 Logging in to Vercel..."
vercel login

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod \
  --env VITE_SUPABASE_URL="$SUPABASE_URL" \
  --env VITE_SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" \
  --env ALPHA_VANTAGE_API_KEY="$ALPHA_VANTAGE_KEY" \
  --env GEMINI_API_KEY="$GEMINI_KEY" \
  --env NODE_ENV="production" \
  --env ALLOWED_ORIGINS="https://stockpulse-pro.vercel.app,http://localhost:3000,http://localhost:5173"

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: https://stockpulse-pro.vercel.app"
