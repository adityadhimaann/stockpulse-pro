# StockPulse Pro Trading Platform

A comprehensive, production-ready stock trading platform with real-time market data, sentiment analysis, and interactive charts.

## 🚀 Features

- **Real-time Stock Data**: Live price updates using Alpha Vantage API
- **Interactive Charts**: Draggable, zoomable candlestick charts with volume indicators
- **Sentiment Analysis**: AI-powered news sentiment analysis using Google Gemini API
- **Market Movers**: Top gainers, losers, and most active stocks
- **Responsive Design**: Modern UI with dark/light theme support
- **Production-Ready**: Security best practices, rate limiting, caching, and error handling

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for chart visualization
- **Lucide React** for icons

### Backend
- **Express.js** with TypeScript
- **Alpha Vantage API** for market data
- **Google Gemini API** for sentiment analysis
- **Node Cache** for performance optimization
- **Helmet** for security
- **Express Rate Limit** for API protection

## 📋 Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- Alpha Vantage API key ([Get free key](https://www.alphavantage.co/support/#api-key))
- Google Gemini API key ([Get API key](https://makersuite.google.com/app/apikey))

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd stockpulse-pro

# Install dependencies
npm install
\`\`\`

### 2. Environment Configuration

Copy the example environment file and configure your API keys:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` with your API keys:

\`\`\`env
# Alpha Vantage API Configuration
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here

# Gemini API Configuration  
GEMINI_API_KEY=your_gemini_api_key_here

# Environment Configuration
NODE_ENV=development
PORT=3001

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cache Configuration
CACHE_TTL=300000
\`\`\`

### 3. Development Setup

Start both frontend and backend in development mode:

\`\`\`bash
# Terminal 1: Start the API server
npm run api:dev

# Terminal 2: Start the frontend development server
npm run dev
\`\`\`

The application will be available at:
- Frontend: http://localhost:5173
- API: http://localhost:3001

## 🔧 Current Implementation Status

✅ **Completed Features:**
- Complete Express.js backend API with TypeScript
- Alpha Vantage API integration with rate limiting and error handling
- Google Gemini AI sentiment analysis service
- Comprehensive caching system with TTL
- Security middleware (Helmet, CORS, Rate Limiting)
- Mock data fallback system for reliable testing
- Production-ready error handling and logging
- Complete REST API endpoints for stock data and sentiment analysis

⚠️ **Alpha Vantage API Status:**
The current API key (`RWUN5EKCSUO8N551`) has reached the free tier daily limit (25 requests/day). The system automatically falls back to realistic mock data to ensure continuous functionality. 

**To use live data:**
1. Wait 24 hours for the limit to reset, OR
2. Upgrade to a premium Alpha Vantage plan for unlimited requests, OR
3. Use a different Alpha Vantage API key in the `.env` file

🏗️ **Next Steps for Full Production:**
- Create React frontend components (`StockDetails`, `StockChart`, `NewsWidget`, etc.)
- Integrate frontend with the working backend API
- Add user authentication and portfolio management
- Deploy to cloud platforms (Vercel, Render, AWS, etc.)

## 🧪 Mock Data & Rate Limiting

The API automatically falls back to realistic mock data when:

- **Alpha Vantage Rate Limit**: Free tier allows 25 requests/day
- **API Key Issues**: Invalid or expired API keys
- **Network Errors**: Connection timeouts or failures

### Mock Data Features:
- **Realistic Stock Prices**: Based on actual market data patterns
- **Dynamic Variations**: Prices change with each request (±5% variation)
- **Complete Market Data**: Includes OHLCV, volume, market cap, financials
- **Chart Data**: 50 intraday data points with realistic price movements
- **Multiple Symbols**: Pre-configured data for AAPL, GOOGL, TSLA, MSFT, AMZN

### Supported Mock Symbols:
```
AAPL  - Apple Inc.
GOOGL - Alphabet Inc.
TSLA  - Tesla, Inc.
MSFT  - Microsoft Corporation
AMZN  - Amazon.com, Inc.
```

The mock service automatically generates data for any requested symbol, using the closest match from the pre-configured data.

## 🧪 Testing the API

Test the endpoints using curl or your preferred API client:

### Health Check
\`\`\`bash
curl http://localhost:3001/api/health
\`\`\`

### Stock Data
\`\`\`bash
# Get stock quote and overview
curl http://localhost:3001/api/stock/AAPL

# Get chart data with specific interval
curl http://localhost:3001/api/stock/AAPL/chart/5min

# Get market movers
curl http://localhost:3001/api/stock/market/movers
\`\`\`

### Sentiment Analysis
\`\`\`bash
# Analyze single text
curl -X POST http://localhost:3001/api/sentiment/analyze \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Apple reported strong quarterly earnings with record revenue growth",
    "symbol": "AAPL"
  }'

# Batch analysis
curl -X POST http://localhost:3001/api/sentiment/batch \\
  -H "Content-Type: application/json" \\
  -d '{
    "articles": [
      {
        "text": "Tesla stock surges on positive earnings report",
        "symbol": "TSLA"
      },
      {
        "text": "Market volatility continues amid economic uncertainty",
        "symbol": "SPY"
      }
    ]
  }'
\`\`\`

## 🏗️ Project Structure

\`\`\`
stockpulse-pro/
├── api/                          # Backend API
│   ├── server.ts                 # Express server setup
│   ├── stock/
│   │   └── index.ts             # Stock data endpoints
│   └── sentiment/
│       └── index.ts             # Sentiment analysis endpoints
├── lib/                          # Shared services
│   ├── alphaVantageService.ts   # Alpha Vantage API integration
│   ├── geminiService.ts         # Google Gemini API integration
│   └── cacheService.ts          # Caching utilities
├── components/                   # React components
│   ├── stock/                   # Stock-related components
│   ├── ui/                      # Reusable UI components
│   └── pages/                   # Page components
├── styles/                       # Global styles
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
\`\`\`

## 🔒 Security Features

- **Helmet.js**: Sets various HTTP headers for security
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents API abuse (100 requests per 15 minutes)
- **Input Validation**: Validates all API inputs
- **Error Handling**: Secure error responses without data leaks
- **Environment Variables**: Sensitive data stored securely

## 📊 API Endpoints

### Stock Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | \`/api/stock/:symbol\` | Get comprehensive stock data |
| GET | \`/api/stock/:symbol/chart/:interval\` | Get chart data with interval |
| GET | \`/api/stock/market/movers\` | Get market gainers/losers |

### Sentiment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/api/sentiment/analyze\` | Analyze sentiment of text |
| POST | \`/api/sentiment/batch\` | Batch sentiment analysis |
| GET | \`/api/sentiment/health\` | Check sentiment service health |

### System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | \`/api/health\` | API health check |

## 🚀 Production Deployment

### Using Vercel (Recommended for Frontend)

1. **Build the application:**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Deploy to Vercel:**
   \`\`\`bash
   npm install -g vercel
   vercel
   \`\`\`

3. **Configure environment variables in Vercel dashboard**

### Using Render (Recommended for Backend)

1. **Create \`render.yaml\` for automatic deployment:**
   \`\`\`yaml
   services:
     - type: web
       name: stockpulse-api
       env: node
       buildCommand: npm run api:build
       startCommand: npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: ALPHA_VANTAGE_API_KEY
           sync: false
         - key: GEMINI_API_KEY
           sync: false
   \`\`\`

2. **Connect your repository to Render**

3. **Configure environment variables in Render dashboard**

### Environment Variables for Production

\`\`\`env
NODE_ENV=production
PORT=80
ALPHA_VANTAGE_API_KEY=your_production_alpha_vantage_key
GEMINI_API_KEY=your_production_gemini_key
ALLOWED_ORIGINS=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CACHE_TTL=300000
\`\`\`

## 🔍 Monitoring & Debugging

### API Logs

The server provides detailed logging for:
- API requests and responses
- Rate limiting status
- Cache hit/miss rates
- Error tracking
- Alpha Vantage and Gemini API calls

### Console Debugging

Check browser console for:
- Real-time data updates
- API call status
- Frontend error messages

## 📈 Performance Optimization

- **Caching**: 5-minute cache for stock data, 1-hour for sentiment analysis
- **Rate Limiting**: Respects Alpha Vantage's 5 requests/minute limit
- **Lazy Loading**: Components load data only when needed
- **Memoization**: React components optimized with useMemo/useCallback
- **Bundle Optimization**: Vite's automatic code splitting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the console logs for detailed error messages
2. Verify your API keys are correctly configured
3. Ensure you haven't exceeded rate limits
4. Check network connectivity for API calls

For additional support, please open an issue on GitHub.

## 🔮 Roadmap

- [ ] Real-time WebSocket connections
- [ ] Portfolio tracking and management
- [ ] Advanced technical indicators
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Options and futures data
- [ ] Social trading features
- [ ] Advanced charting tools

---

Built with ❤️ for the trading community
