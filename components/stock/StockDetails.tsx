import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, Users, BarChart3 } from 'lucide-react';
import { StockChart } from '../StockChart';
import { NewsWidget } from '../NewsWidget';
// import { StockMetrics } from '../StockMetrics';

interface StockData {
  quote: {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    high: number;
    low: number;
    open: number;
    previousClose: number;
    timestamp: string;
  };
  overview?: {
    name: string;
    description: string;
    sector: string;
    industry: string;
    marketCap: number;
    peRatio: number;
    eps: number;
    dividendYield: number;
    week52High: number;
    week52Low: number;
    beta: number;
  };
  chartData?: Array<{
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}

interface StockDetailsProps {
  symbol: string;
  isDarkMode?: boolean;
}

export function StockDetails({ symbol, isDarkMode = false }: StockDetailsProps) {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/stock/${symbol.toUpperCase()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stock data: ${response.status}`);
      }

      const data = await response.json();
      setStockData(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, [symbol]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchStockData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [symbol, autoRefresh]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toFixed(0)}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(2)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(2)}K`;
    }
    return volume.toString();
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className={`h-8 w-64 rounded mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className={`h-96 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} />
              </div>
              <div className="space-y-4">
                <div className={`h-32 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} />
                <div className={`h-64 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`rounded-xl p-8 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`text-red-500 text-lg mb-4`}>
              Error loading stock data
            </div>
            <div className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {error}
            </div>
            <button
              onClick={fetchStockData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stockData?.quote) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`rounded-xl p-8 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No data available for {symbol.toUpperCase()}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Please check the symbol and try again
            </div>
          </div>
        </div>
      </div>
    );
  }

  const quote = stockData.quote;
  const overview = stockData.overview;
  const isPositive = quote.changePercent >= 0;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {quote.symbol}
            </h1>
            {overview?.name && (
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {overview.name}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Auto-refresh
              </label>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
            </div>
            
            <button
              onClick={fetchStockData}
              disabled={loading}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Price Header */}
        <motion.div 
          className={`rounded-xl p-6 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4">
                <span className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatPrice(quote.price)}
                </span>
                <div className={`flex items-center space-x-2 ${
                  isPositive ? 'text-green-500' : 'text-red-500'
                }`}>
                  {isPositive ? (
                    <TrendingUp className="w-6 h-6" />
                  ) : (
                    <TrendingDown className="w-6 h-6" />
                  )}
                  <span className="text-xl font-semibold">
                    {isPositive ? '+' : ''}{formatPrice(quote.change)} ({isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
              
              <div className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-right">
              <div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Volume
                </div>
                <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatVolume(quote.volume)}
                </div>
              </div>
              <div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Market Cap
                </div>
                <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {overview?.marketCap ? formatMarketCap(overview.marketCap) : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <StockChart 
              symbol={symbol}
              height={400}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* News Widget */}
            <NewsWidget 
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockDetails;
