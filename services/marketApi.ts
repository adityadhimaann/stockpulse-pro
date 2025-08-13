// Market API service for real-time data integration
// Supports Alpha Vantage API with fallback to mock data

// Alpha Vantage API configuration
const ALPHA_VANTAGE_API_KEY = 'RWUN5EKCSUO8N551';
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  marketCap?: number;
  timestamp: number;
}

export interface MarketSentiment {
  score: number; // -1 to 1
  label: string;
  confidence: number;
  factors: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
}

export interface FilteredStocks {
  gainers: StockQuote[];
  losers: StockQuote[];
  mostActive: StockQuote[];
}

// Alpha Vantage API response interfaces
interface AlphaVantageQuote {
  "Global Quote": {
    "01. symbol": string;
    "02. open": string;
    "03. high": string;
    "04. low": string;
    "05. price": string;
    "06. volume": string;
    "07. latest trading day": string;
    "08. previous close": string;
    "09. change": string;
    "10. change percent": string;
  };
}

class MarketApiService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30000; // 30 seconds
  private readonly API_RATE_LIMIT_DELAY = 12000; // 12 seconds between API calls
  private lastApiCall = 0;

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private async rateLimitedFetch(url: string): Promise<Response> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastApiCall;
    
    if (timeSinceLastCall < this.API_RATE_LIMIT_DELAY) {
      const waitTime = this.API_RATE_LIMIT_DELAY - timeSinceLastCall;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastApiCall = Date.now();
    return fetch(url);
  }

  async getStockQuote(symbol: string): Promise<StockQuote> {
    const cacheKey = `quote_${symbol}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // Try Alpha Vantage API first
      const quote = await this.getAlphaVantageQuote(symbol);
      console.log(`✅ Alpha Vantage data loaded for ${symbol}:`, quote);
      this.setCachedData(cacheKey, quote);
      return quote;
    } catch (error) {
      console.warn(`⚠️ Alpha Vantage API failed for ${symbol}, using fallback:`, error);
      // Fallback to mock data
      const quote = this.getFallbackQuote(symbol);
      console.log(`🔄 Fallback data loaded for ${symbol}:`, quote);
      this.setCachedData(cacheKey, quote);
      return quote;
    }
  }

  private async getAlphaVantageQuote(symbol: string): Promise<StockQuote> {
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    
    const response = await this.rateLimitedFetch(url);
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.status}`);
    }
    
    const data: AlphaVantageQuote = await response.json();
    
    if (!data["Global Quote"] || Object.keys(data["Global Quote"]).length === 0) {
      throw new Error(`No data returned for symbol ${symbol}`);
    }
    
    const quote = data["Global Quote"];
    const price = parseFloat(quote["05. price"]);
    const change = parseFloat(quote["09. change"]);
    const changePercent = parseFloat(quote["10. change percent"].replace('%', ''));
    
    return {
      symbol: quote["01. symbol"],
      price,
      change,
      changePercent,
      volume: parseInt(quote["06. volume"]),
      high: parseFloat(quote["03. high"]),
      low: parseFloat(quote["04. low"]),
      open: parseFloat(quote["02. open"]),
      previousClose: parseFloat(quote["08. previous close"]),
      timestamp: Date.now()
    };
  }

  private getFallbackQuote(symbol: string): StockQuote {
    // Generate realistic mock data based on symbol
    const basePrice = this.getBasePrice(symbol);
    const changePercent = (Math.random() - 0.5) * 10; // -5% to +5%
    const change = (basePrice * changePercent) / 100;
    const price = basePrice + change;

    return {
      symbol,
      price,
      change,
      changePercent,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      high: price * (1 + Math.random() * 0.05),
      low: price * (1 - Math.random() * 0.05),
      open: price * (1 + (Math.random() - 0.5) * 0.02),
      previousClose: basePrice,
      timestamp: Date.now()
    };
  }

  private getBasePrice(symbol: string): number {
    const prices: { [key: string]: number } = {
      AAPL: 182.52,
      MSFT: 337.89,
      GOOGL: 138.21,
      AMZN: 144.05,
      TSLA: 248.50,
      META: 297.35,
      NVDA: 445.87,
      NFLX: 432.14
    };
    return prices[symbol] || 100 + Math.random() * 400;
  }

  async getMarketSentiment(): Promise<MarketSentiment> {
    const cacheKey = "market_sentiment";
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    // Simulate AI-powered sentiment analysis
    const score = (Math.random() - 0.5) * 2; // -1 to 1
    const confidence = 0.7 + Math.random() * 0.3; // 70-100%
    
    let label: string;
    if (score > 0.3) label = "Bullish";
    else if (score < -0.3) label = "Bearish";
    else label = "Neutral";

    const sentiment: MarketSentiment = {
      score,
      label,
      confidence,
      factors: [
        {
          factor: "Market Momentum",
          impact: Math.random() * 0.4 + 0.1,
          description: score > 0 ? "Strong upward momentum" : "Weak momentum"
        },
        {
          factor: "Economic Indicators",
          impact: Math.random() * 0.3 + 0.1,
          description: "Mixed economic signals"
        },
        {
          factor: "News Sentiment",
          impact: Math.random() * 0.3 + 0.1,
          description: score > 0 ? "Positive news flow" : "Negative headlines"
        }
      ]
    };

    this.setCachedData(cacheKey, sentiment);
    return sentiment;
  }

  async getFilteredStocks(): Promise<FilteredStocks> {
    const cacheKey = "filtered_stocks";
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // Try Alpha Vantage market movers API
      const movers = await this.getAlphaVantageMarketMovers();
      console.log('✅ Alpha Vantage market movers loaded:', movers);
      this.setCachedData(cacheKey, movers);
      return movers;
    } catch (error) {
      console.warn('⚠️ Alpha Vantage market movers API failed, using fallback:', error);
      // Fallback to mock data
      const movers = await this.getFallbackFilteredStocks();
      console.log('🔄 Fallback market movers loaded:', movers);
      this.setCachedData(cacheKey, movers);
      return movers;
    }
  }

  private async getAlphaVantageMarketMovers(): Promise<FilteredStocks> {
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=TOP_GAINERS_LOSERS&apikey=${ALPHA_VANTAGE_API_KEY}`;
    
    const response = await this.rateLimitedFetch(url);
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage market movers API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.top_gainers || !data.top_losers || !data.most_actively_traded) {
      throw new Error('Invalid market movers data format');
    }

    const convertMoverToQuote = (mover: any): StockQuote => {
      const price = parseFloat(mover.price);
      const change = parseFloat(mover.change_amount);
      const changePercent = parseFloat(mover.change_percentage.replace('%', ''));
      
      return {
        symbol: mover.ticker,
        price,
        change,
        changePercent,
        volume: parseInt(mover.volume),
        high: price * (1 + Math.random() * 0.02), // Approximate values
        low: price * (1 - Math.random() * 0.02),
        open: price - change,
        previousClose: price - change,
        timestamp: Date.now()
      };
    };

    return {
      gainers: data.top_gainers.slice(0, 5).map(convertMoverToQuote),
      losers: data.top_losers.slice(0, 5).map(convertMoverToQuote),
      mostActive: data.most_actively_traded.slice(0, 5).map(convertMoverToQuote)
    };
  }

  private async getFallbackFilteredStocks(): Promise<FilteredStocks> {
    // Popular symbols for filtering
    const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "NFLX", "AMD", "CRM"];
    
    const quotes = await Promise.all(
      symbols.map(symbol => this.getFallbackQuote(symbol))
    );

    const gainers = quotes
      .filter((q: StockQuote) => q.changePercent > 0)
      .sort((a: StockQuote, b: StockQuote) => b.changePercent - a.changePercent)
      .slice(0, 5);

    const losers = quotes
      .filter((q: StockQuote) => q.changePercent < 0)
      .sort((a: StockQuote, b: StockQuote) => a.changePercent - b.changePercent)
      .slice(0, 5);

    const mostActive = quotes
      .sort((a: StockQuote, b: StockQuote) => b.volume - a.volume)
      .slice(0, 5);

    return { gainers, losers, mostActive };
  }

  async getChartData(symbol: string, timeframe: string = "1D"): Promise<any[]> {
    const cacheKey = `chart_${symbol}_${timeframe}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // Try Alpha Vantage intraday data
      const chartData = await this.getAlphaVantageIntradayData(symbol);
      this.setCachedData(cacheKey, chartData);
      return chartData;
    } catch (error) {
      console.warn(`Alpha Vantage intraday data failed for ${symbol}, using fallback:`, error);
      // Fallback to mock data
      const chartData = this.getFallbackChartData(symbol);
      this.setCachedData(cacheKey, chartData);
      return chartData;
    }
  }

  private async getAlphaVantageIntradayData(symbol: string): Promise<any[]> {
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${ALPHA_VANTAGE_API_KEY}`;
    
    const response = await this.rateLimitedFetch(url);
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage intraday API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data["Time Series (5min)"]) {
      throw new Error(`No intraday data returned for symbol ${symbol}`);
    }
    
    const timeSeries = data["Time Series (5min)"];
    const chartData = [];
    
    for (const [timestamp, values] of Object.entries(timeSeries)) {
      const timeSeriesValues = values as {
        "1. open": string;
        "2. high": string;
        "3. low": string;
        "4. close": string;
        "5. volume": string;
      };
      
      chartData.push({
        timestamp: new Date(timestamp).getTime(),
        open: parseFloat(timeSeriesValues["1. open"]),
        high: parseFloat(timeSeriesValues["2. high"]),
        low: parseFloat(timeSeriesValues["3. low"]),
        close: parseFloat(timeSeriesValues["4. close"]),
        volume: parseInt(timeSeriesValues["5. volume"])
      });
    }
    
    // Sort by timestamp (most recent first)
    return chartData.sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);
  }

  private getFallbackChartData(symbol: string): any[] {
    const basePrice = this.getBasePrice(symbol);
    const data = [];
    const now = Date.now();
    
    for (let i = 30; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000);
      const open = basePrice * (1 + (Math.random() - 0.5) * 0.1);
      const close = open * (1 + (Math.random() - 0.5) * 0.05);
      const high = Math.max(open, close) * (1 + Math.random() * 0.03);
      const low = Math.min(open, close) * (1 - Math.random() * 0.03);
      
      data.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 5000000) + 1000000
      });
    }
    
    return data;
  }
}

export const marketApiService = new MarketApiService();
export default marketApiService;
