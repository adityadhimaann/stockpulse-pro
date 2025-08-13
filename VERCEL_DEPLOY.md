# StockPulse Pro - Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/adityadhimaann/stockpulse-pro)

### Option 2: Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   ./deploy-vercel.sh
   ```

### Option 3: GitHub Integration

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository: `adityadhimaann/stockpulse-pro`
4. Configure environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `ALPHA_VANTAGE_API_KEY`: Your Alpha Vantage API key
   - `GEMINI_API_KEY`: Your Gemini API key
5. Deploy!

## Environment Variables Required

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
GEMINI_API_KEY=your_gemini_key
NODE_ENV=production
ALLOWED_ORIGINS=https://your-app.vercel.app
```

## Features Included

✅ **Frontend (React + Vite)**
- Optimized build for production
- Static asset optimization
- Progressive Web App ready

✅ **Backend API (Serverless Functions)**
- `/api/health` - Health check endpoint
- `/api/stock?symbol=AAPL` - Real-time stock data
- `/api/news` - Market news and sentiment
- `/api/sentiment` - AI sentiment analysis

✅ **Authentication**
- Supabase email/password authentication
- Guest access mode
- Secure session management

✅ **Performance**
- CDN delivery
- Automatic HTTPS
- Global edge network

## Domain Configuration

After deployment, you can configure a custom domain:

1. Go to your project in Vercel Dashboard
2. Go to Settings > Domains
3. Add your custom domain
4. Update DNS records as instructed

## Monitoring

- **Analytics**: Built-in Vercel Analytics
- **Logs**: Real-time function logs in Vercel Dashboard
- **Performance**: Core Web Vitals tracking

## Support

If you encounter any issues:
1. Check the [Vercel Documentation](https://vercel.com/docs)
2. Review the function logs in Vercel Dashboard
3. Ensure all environment variables are correctly set
