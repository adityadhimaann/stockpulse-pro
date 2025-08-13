export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high52Week: number;
  low52Week: number;
}

export interface ChartData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PortfolioItem {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

// Mock stock data
export const mockStocks: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 182.52,
    change: 2.31,
    changePercent: 1.28,
    volume: 45678900,
    marketCap: 2850000000000,
    high52Week: 198.23,
    low52Week: 164.08
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.85,
    change: -1.45,
    changePercent: -0.38,
    volume: 23456789,
    marketCap: 2820000000000,
    high52Week: 384.30,
    low52Week: 309.45
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 138.21,
    change: 0.89,
    changePercent: 0.65,
    volume: 18765432,
    marketCap: 1750000000000,
    high52Week: 151.55,
    low52Week: 83.34
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.42,
    change: 12.18,
    changePercent: 5.15,
    volume: 67890123,
    marketCap: 790000000000,
    high52Week: 299.29,
    low52Week: 138.80
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 153.37,
    change: -2.11,
    changePercent: -1.36,
    volume: 34567890,
    marketCap: 1590000000000,
    high52Week: 170.00,
    low52Week: 118.35
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.28,
    change: 18.45,
    changePercent: 2.15,
    volume: 45123789,
    marketCap: 2160000000000,
    high52Week: 950.02,
    low52Week: 200.26
  }
];

// Generate mock chart data
export const generateChartData = (symbol: string, days: number = 30): ChartData[] => {
  const stock = mockStocks.find(s => s.symbol === symbol);
  if (!stock) return [];
  
  const data: ChartData[] = [];
  let currentPrice = stock.price - (Math.random() * 20 - 10); // Start with a price near current
  
  for (let i = days; i >= 0; i--) {
    const timestamp = Date.now() - (i * 24 * 60 * 60 * 1000);
    const volatility = Math.random() * 0.1 - 0.05; // ±5% daily volatility
    
    const open = currentPrice;
    const change = currentPrice * volatility;
    const close = currentPrice + change;
    const high = Math.max(open, close) + (Math.random() * Math.abs(change));
    const low = Math.min(open, close) - (Math.random() * Math.abs(change));
    const volume = Math.floor(Math.random() * 50000000) + 10000000;
    
    data.push({
      timestamp,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume
    });
    
    currentPrice = close;
  }
  
  return data;
};

// Mock portfolio data
export const mockPortfolio: PortfolioItem[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 150,
    avgCost: 175.20,
    currentPrice: 182.52,
    totalValue: 27378,
    gainLoss: 1098,
    gainLossPercent: 4.18
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    shares: 75,
    avgCost: 220.15,
    currentPrice: 248.42,
    totalValue: 18631.50,
    gainLoss: 2120.25,
    gainLossPercent: 12.86
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    shares: 50,
    avgCost: 385.30,
    currentPrice: 378.85,
    totalValue: 18942.50,
    gainLoss: -322.50,
    gainLossPercent: -1.67
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    shares: 25,
    avgCost: 780.45,
    currentPrice: 875.28,
    totalValue: 21882,
    gainLoss: 2370.75,
    gainLossPercent: 12.15
  }
];

// Mock news data
export const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Apple Reports Strong Q4 Earnings, Beats Analyst Expectations',
    summary: 'Apple Inc. reported quarterly earnings that surpassed Wall Street expectations, driven by strong iPhone sales and services revenue growth.',
    source: 'Reuters',
    timestamp: Date.now() - 3600000,
    sentiment: 'positive'
  },
  {
    id: '2',
    title: 'Tesla Announces New Gigafactory Location in Southeast Asia',
    summary: 'Tesla revealed plans for a new manufacturing facility that will boost production capacity and serve the growing Asian market.',
    source: 'Bloomberg',
    timestamp: Date.now() - 7200000,
    sentiment: 'positive'
  },
  {
    id: '3',
    title: 'Tech Stocks Face Pressure Amid Rising Interest Rate Concerns',
    summary: 'Technology stocks experienced volatility as investors weigh the impact of potential Federal Reserve policy changes.',
    source: 'CNBC',
    timestamp: Date.now() - 10800000,
    sentiment: 'negative'
  },
  {
    id: '4',
    title: 'NVIDIA Partners with Major Cloud Providers for AI Infrastructure',
    summary: 'NVIDIA announced strategic partnerships to expand AI computing capabilities across multiple cloud platforms.',
    source: 'TechCrunch',
    timestamp: Date.now() - 14400000,
    sentiment: 'positive'
  }
];

// Market sentiment calculation
export const getMarketSentiment = (): { value: number; label: string; color: string } => {
  const positiveStocks = mockStocks.filter(stock => stock.change > 0).length;
  const totalStocks = mockStocks.length;
  const sentimentValue = (positiveStocks / totalStocks) * 100;
  
  let label = 'Neutral';
  let color = '#ffd700';
  
  if (sentimentValue >= 70) {
    label = 'Very Bullish';
    color = '#00ff88';
  } else if (sentimentValue >= 55) {
    label = 'Bullish';
    color = '#00ff88';
  } else if (sentimentValue <= 30) {
    label = 'Very Bearish';
    color = '#ff3b5c';
  } else if (sentimentValue <= 45) {
    label = 'Bearish';
    color = '#ff3b5c';
  }
  
  return { value: sentimentValue, label, color };
};

// Get stock data for chart component
export const getStockData = () => {
  const baseStock = mockStocks[0]; // Use Apple as default
  return {
    symbol: baseStock.symbol,
    company: baseStock.name,
    price: baseStock.price,
    change: baseStock.change,
    changePercent: baseStock.changePercent,
    volume: `${(baseStock.volume / 1000000).toFixed(1)}M`,
    marketCap: `${(baseStock.marketCap / 1000000000).toFixed(1)}B`,
    chartData: Array.from({ length: 20 }, () => Math.random() * 100 + 50) // Simple chart data
  };
};