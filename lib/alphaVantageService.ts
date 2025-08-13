import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
import { MockDataService } from './mockDataService';

dotenv.config();

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
  timestamp: string;
}

export interface StockOverview {
  symbol: string;
  name: string;
  description: string;
  sector: string;
  industry: string;
  marketCap: number;
  peRatio: number;
  pegRatio: number;
  bookValue: number;
  dividendPerShare: number;
  dividendYield: number;
  eps: number;
  revenuePerShareTTM: number;
  profitMargin: number;
  operatingMarginTTM: number;
  returnOnAssetsTTM: number;
  returnOnEquityTTM: number;
  revenueTTM: number;
  grossProfitTTM: number;
  dilutedEPSTTM: number;
  quarterlyEarningsGrowthYOY: number;
  quarterlyRevenueGrowthYOY: number;
  analystTargetPrice: number;
  trailingPE: number;
  forwardPE: number;
  priceToSalesRatioTTM: number;
  priceToBookRatio: number;
  evToRevenue: number;
  evToEbitda: number;
  beta: number;
  week52High: number;
  week52Low: number;
  day50MovingAverage: number;
  day200MovingAverage: number;
  sharesOutstanding: number;
  sharesFloat: number;
  sharesShort: number;
  sharesShortPriorMonth: number;
  shortRatio: number;
  shortPercentOutstanding: number;
  shortPercentFloat: number;
  percentInsiders: number;
  percentInstitutions: number;
  forwardAnnualDividendRate: number;
  forwardAnnualDividendYield: number;
  payoutRatio: number;
  dividendDate: string;
  exDividendDate: string;
  lastSplitFactor: string;
  lastSplitDate: string;
}

export interface ChartDataPoint {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketMovers {
  top_gainers: Array<{
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
    volume: string;
  }>;
  top_losers: Array<{
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
    volume: string;
  }>;
  most_actively_traded: Array<{
    ticker: string;
    price: string;
    change_amount: string;
    change_percentage: string;
    volume: string;
  }>;
}

export class AlphaVantageService {
  private client: AxiosInstance;
  private readonly apiKey: string;
  private readonly baseURL = 'https://www.alphavantage.co/query';
  private lastRequestTime = 0;
  private readonly rateLimitDelay = 12000; // 12 seconds between requests (5 requests per minute limit)

  constructor() {
    this.apiKey = process.env.ALPHA_VANTAGE_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('ALPHA_VANTAGE_API_KEY environment variable is required');
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'User-Agent': 'StockPulse-Pro/1.0.0'
      }
    });

    // Add request interceptor for rate limiting
    this.client.interceptors.request.use(async (config) => {
      await this.enforceRateLimit();
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Alpha Vantage API Error:', {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data
        });
        throw error;
      }
    );
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      const waitTime = this.rateLimitDelay - timeSinceLastRequest;
      console.log(`⏳ Rate limiting: waiting ${waitTime}ms before next Alpha Vantage request`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  async getQuote(symbol: string): Promise<StockQuote> {
    try {
      const response = await this.client.get('', {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol.toUpperCase(),
          apikey: this.apiKey
        }
      });

      const data = response.data;
      
      if (data['Error Message']) {
        throw new Error(`Alpha Vantage Error: ${data['Error Message']}`);
      }

      if (data['Note']) {
        throw new Error('Alpha Vantage API rate limit exceeded');
      }

      if (data['Information'] && data['Information'].includes('rate limit')) {
        console.log('📊 Alpha Vantage rate limited, using mock data for', symbol);
        return MockDataService.generateMockQuote(symbol);
      }

      const quote = data['Global Quote'];
      
      if (!quote || Object.keys(quote).length === 0) {
        console.log('📊 No real data available, using mock data for', symbol);
        return MockDataService.generateMockQuote(symbol);
      }

      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        open: parseFloat(quote['02. open']),
        previousClose: parseFloat(quote['08. previous close']),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.log(`📊 Error fetching real data for ${symbol}, using mock data:`, error instanceof Error ? error.message : 'Unknown error');
      return MockDataService.generateMockQuote(symbol);
    }
  }

  async getOverview(symbol: string): Promise<StockOverview> {
    try {
      const response = await this.client.get('', {
        params: {
          function: 'OVERVIEW',
          symbol: symbol.toUpperCase(),
          apikey: this.apiKey
        }
      });

      const data = response.data;
      
      if (data['Error Message']) {
        throw new Error(`Alpha Vantage Error: ${data['Error Message']}`);
      }

      if (data['Note']) {
        throw new Error('Alpha Vantage API rate limit exceeded');
      }

      if (data['Information'] && data['Information'].includes('rate limit')) {
        console.log('📊 Alpha Vantage rate limited, using mock data for overview', symbol);
        return MockDataService.generateMockOverview(symbol);
      }

      if (!data.Symbol) {
        console.log('📊 No real overview data available, using mock data for', symbol);
        return MockDataService.generateMockOverview(symbol);
      }

      // Parse numeric values with error handling
      const parseFloat = (value: string): number => {
        const parsed = Number(value);
        return isNaN(parsed) ? 0 : parsed;
      };

      return {
        symbol: data.Symbol,
        name: data.Name || '',
        description: data.Description || '',
        sector: data.Sector || '',
        industry: data.Industry || '',
        marketCap: parseFloat(data.MarketCapitalization),
        peRatio: parseFloat(data.PERatio),
        pegRatio: parseFloat(data.PEGRatio),
        bookValue: parseFloat(data.BookValue),
        dividendPerShare: parseFloat(data.DividendPerShare),
        dividendYield: parseFloat(data.DividendYield),
        eps: parseFloat(data.EPS),
        revenuePerShareTTM: parseFloat(data.RevenuePerShareTTM),
        profitMargin: parseFloat(data.ProfitMargin),
        operatingMarginTTM: parseFloat(data.OperatingMarginTTM),
        returnOnAssetsTTM: parseFloat(data.ReturnOnAssetsTTM),
        returnOnEquityTTM: parseFloat(data.ReturnOnEquityTTM),
        revenueTTM: parseFloat(data.RevenueTTM),
        grossProfitTTM: parseFloat(data.GrossProfitTTM),
        dilutedEPSTTM: parseFloat(data.DilutedEPSTTM),
        quarterlyEarningsGrowthYOY: parseFloat(data.QuarterlyEarningsGrowthYOY),
        quarterlyRevenueGrowthYOY: parseFloat(data.QuarterlyRevenueGrowthYOY),
        analystTargetPrice: parseFloat(data.AnalystTargetPrice),
        trailingPE: parseFloat(data.TrailingPE),
        forwardPE: parseFloat(data.ForwardPE),
        priceToSalesRatioTTM: parseFloat(data.PriceToSalesRatioTTM),
        priceToBookRatio: parseFloat(data.PriceToBookRatio),
        evToRevenue: parseFloat(data.EVToRevenue),
        evToEbitda: parseFloat(data.EVToEBITDA),
        beta: parseFloat(data.Beta),
        week52High: parseFloat(data['52WeekHigh']),
        week52Low: parseFloat(data['52WeekLow']),
        day50MovingAverage: parseFloat(data['50DayMovingAverage']),
        day200MovingAverage: parseFloat(data['200DayMovingAverage']),
        sharesOutstanding: parseFloat(data.SharesOutstanding),
        sharesFloat: parseFloat(data.SharesFloat),
        sharesShort: parseFloat(data.SharesShort),
        sharesShortPriorMonth: parseFloat(data.SharesShortPriorMonth),
        shortRatio: parseFloat(data.ShortRatio),
        shortPercentOutstanding: parseFloat(data.ShortPercentOutstanding),
        shortPercentFloat: parseFloat(data.ShortPercentFloat),
        percentInsiders: parseFloat(data.PercentInsiders),
        percentInstitutions: parseFloat(data.PercentInstitutions),
        forwardAnnualDividendRate: parseFloat(data.ForwardAnnualDividendRate),
        forwardAnnualDividendYield: parseFloat(data.ForwardAnnualDividendYield),
        payoutRatio: parseFloat(data.PayoutRatio),
        dividendDate: data.DividendDate || '',
        exDividendDate: data.ExDividendDate || '',
        lastSplitFactor: data.LastSplitFactor || '',
        lastSplitDate: data.LastSplitDate || ''
      };
    } catch (error) {
      console.log(`📊 Error fetching real overview for ${symbol}, using mock data:`, error instanceof Error ? error.message : 'Unknown error');
      return MockDataService.generateMockOverview(symbol);
    }
  }

  async getIntraday(symbol: string, interval: string = '5min'): Promise<ChartDataPoint[]> {
    try {
      const response = await this.client.get('', {
        params: {
          function: 'TIME_SERIES_INTRADAY',
          symbol: symbol.toUpperCase(),
          interval,
          apikey: this.apiKey,
          outputsize: 'compact'
        }
      });

      const data = response.data;
      
      if (data['Error Message']) {
        throw new Error(`Alpha Vantage Error: ${data['Error Message']}`);
      }

      if (data['Note']) {
        throw new Error('Alpha Vantage API rate limit exceeded');
      }

      if (data['Information'] && data['Information'].includes('rate limit')) {
        console.log('📊 Alpha Vantage rate limited, using mock data for intraday', symbol);
        return MockDataService.generateMockIntraday(symbol);
      }

      const timeSeries = data[`Time Series (${interval})`];
      
      if (!timeSeries) {
        console.log('📊 No real intraday data available, using mock data for', symbol);
        return MockDataService.generateMockIntraday(symbol);
      }

      const chartData: ChartDataPoint[] = [];
      
      for (const [timestamp, values] of Object.entries(timeSeries)) {
        const timeSeriesValues = values as {
          '1. open': string;
          '2. high': string;
          '3. low': string;
          '4. close': string;
          '5. volume': string;
        };
        
        chartData.push({
          timestamp,
          open: parseFloat(timeSeriesValues['1. open']),
          high: parseFloat(timeSeriesValues['2. high']),
          low: parseFloat(timeSeriesValues['3. low']),
          close: parseFloat(timeSeriesValues['4. close']),
          volume: parseInt(timeSeriesValues['5. volume'])
        });
      }
      
      // Sort by timestamp (most recent first)
      return chartData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.log(`📊 Error fetching real intraday data for ${symbol}, using mock data:`, error instanceof Error ? error.message : 'Unknown error');
      return MockDataService.generateMockIntraday(symbol);
    }
  }

  async getTopGainersLosers(): Promise<MarketMovers> {
    try {
      const response = await this.client.get('', {
        params: {
          function: 'TOP_GAINERS_LOSERS',
          apikey: this.apiKey
        }
      });

      const data = response.data;
      
      if (data['Error Message']) {
        throw new Error(`Alpha Vantage Error: ${data['Error Message']}`);
      }

      if (data['Note']) {
        throw new Error('Alpha Vantage API rate limit exceeded');
      }

      if (!data.top_gainers || !data.top_losers || !data.most_actively_traded) {
        throw new Error('Invalid market movers data format');
      }

      return {
        top_gainers: data.top_gainers.slice(0, 10),
        top_losers: data.top_losers.slice(0, 10),
        most_actively_traded: data.most_actively_traded.slice(0, 10)
      };
    } catch (error) {
      console.error('Failed to fetch market movers:', error);
      throw error;
    }
  }
}

export default AlphaVantageService;
