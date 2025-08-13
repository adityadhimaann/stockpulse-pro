import { StockQuote, StockOverview, ChartDataPoint } from './alphaVantageService';

export class MockDataService {
  private static stockData: Record<string, any> = {
    'AAPL': {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 178.45,
      change: 2.34,
      changePercent: 1.33,
      volume: 48392847,
      marketCap: 2800000000000,
      sector: 'Technology',
      industry: 'Consumer Electronics'
    },
    'GOOGL': {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 138.21,
      change: -1.45,
      changePercent: -1.04,
      volume: 24589756,
      marketCap: 1750000000000,
      sector: 'Technology',
      industry: 'Internet Content & Information'
    },
    'TSLA': {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      price: 248.98,
      change: 8.76,
      changePercent: 3.65,
      volume: 89472658,
      marketCap: 795000000000,
      sector: 'Consumer Cyclical',
      industry: 'Auto Manufacturers'
    },
    'MSFT': {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 416.89,
      change: 1.23,
      changePercent: 0.30,
      volume: 18472839,
      marketCap: 3100000000000,
      sector: 'Technology',
      industry: 'Software—Infrastructure'
    },
    'AMZN': {
      symbol: 'AMZN',
      name: 'Amazon.com, Inc.',
      price: 189.32,
      change: -2.87,
      changePercent: -1.49,
      volume: 32847291,
      marketCap: 1980000000000,
      sector: 'Consumer Cyclical',
      industry: 'Internet Retail'
    }
  };

  static generateMockQuote(symbol: string): StockQuote {
    const base = this.stockData[symbol.toUpperCase()] || this.stockData['AAPL'];
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    
    const currentPrice = base.price * (1 + variation);
    const change = currentPrice - base.price;
    const changePercent = (change / base.price) * 100;

    return {
      symbol: symbol.toUpperCase(),
      open: currentPrice * 0.995,
      high: currentPrice * 1.015,
      low: currentPrice * 0.985,
      price: currentPrice,
      volume: Math.floor(base.volume * (0.8 + Math.random() * 0.4)),
      timestamp: new Date().toISOString(),
      previousClose: base.price,
      change: change,
      changePercent: parseFloat(changePercent.toFixed(2))
    };
  }

  static generateMockOverview(symbol: string): StockOverview {
    const base = this.stockData[symbol.toUpperCase()] || this.stockData['AAPL'];

    return {
      symbol: symbol.toUpperCase(),
      name: base.name,
      description: `${base.name} is a leading company in the ${base.sector} sector, specializing in ${base.industry}.`,
      sector: base.sector,
      industry: base.industry,
      marketCap: base.marketCap,
      peRatio: 15 + Math.random() * 35,
      pegRatio: 0.5 + Math.random() * 2,
      bookValue: 10 + Math.random() * 50,
      dividendPerShare: Math.random() * 5,
      dividendYield: Math.random() * 3,
      eps: 5 + Math.random() * 20,
      revenuePerShareTTM: 50 + Math.random() * 200,
      profitMargin: 0.1 + Math.random() * 0.3,
      operatingMarginTTM: 0.15 + Math.random() * 0.25,
      returnOnAssetsTTM: 0.05 + Math.random() * 0.2,
      returnOnEquityTTM: 0.1 + Math.random() * 0.4,
      revenueTTM: 100000000000 + Math.random() * 200000000000,
      grossProfitTTM: 50000000000 + Math.random() * 100000000000,
      dilutedEPSTTM: 5 + Math.random() * 15,
      quarterlyEarningsGrowthYOY: -0.1 + Math.random() * 0.5,
      quarterlyRevenueGrowthYOY: -0.05 + Math.random() * 0.3,
      analystTargetPrice: base.price * (0.9 + Math.random() * 0.2),
      trailingPE: 15 + Math.random() * 35,
      forwardPE: 12 + Math.random() * 28,
      priceToSalesRatioTTM: 2 + Math.random() * 8,
      priceToBookRatio: 1 + Math.random() * 10,
      evToRevenue: 3 + Math.random() * 12,
      evToEbitda: 8 + Math.random() * 25,
      beta: 0.5 + Math.random() * 1.5,
      week52High: base.price * (1.1 + Math.random() * 0.3),
      week52Low: base.price * (0.7 + Math.random() * 0.2),
      day50MovingAverage: base.price * (0.95 + Math.random() * 0.1),
      day200MovingAverage: base.price * (0.9 + Math.random() * 0.2),
      sharesOutstanding: 1000000000 + Math.random() * 15000000000,
      sharesFloat: 800000000 + Math.random() * 12000000000,
      sharesShort: 50000000 + Math.random() * 200000000,
      sharesShortPriorMonth: 45000000 + Math.random() * 180000000,
      shortRatio: 1 + Math.random() * 5,
      shortPercentOutstanding: Math.random() * 10,
      shortPercentFloat: Math.random() * 15,
      percentInsiders: Math.random() * 30,
      percentInstitutions: 60 + Math.random() * 30,
      forwardAnnualDividendRate: Math.random() * 8,
      forwardAnnualDividendYield: Math.random() * 4,
      payoutRatio: Math.random() * 60,
      dividendDate: '2024-11-15',
      exDividendDate: '2024-11-08',
      lastSplitFactor: '4:1',
      lastSplitDate: '2020-08-31'
    };
  }

  static generateMockIntraday(symbol: string): ChartDataPoint[] {
    const base = this.stockData[symbol.toUpperCase()] || this.stockData['AAPL'];
    const basePrice = base.price;
    const dataPoints: ChartDataPoint[] = [];
    
    // Generate 50 data points for the last few hours
    const now = new Date();
    
    for (let i = 49; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000); // 5-minute intervals
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      const price = basePrice * (1 + variation);
      
      const open = i === 49 ? price : dataPoints[dataPoints.length - 1]?.close || price;
      const volatility = 0.005; // 0.5% volatility
      const high = price * (1 + Math.random() * volatility);
      const low = price * (1 - Math.random() * volatility);
      const close = price;
      
      dataPoints.push({
        timestamp: timestamp.toISOString(),
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: Math.floor(base.volume / 100 * (0.5 + Math.random()))
      });
    }
    
    return dataPoints;
  }

  static isValidSymbol(symbol: string): boolean {
    return symbol.toUpperCase() in this.stockData || ['NVDA', 'META', 'NFLX', 'AMD', 'INTC'].includes(symbol.toUpperCase());
  }
}
