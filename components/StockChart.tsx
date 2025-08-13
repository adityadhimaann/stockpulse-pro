import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// API Integration
const API_BASE_URL = 'http://localhost:3000/api';

interface ChartDataPoint {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface StockQuote {
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
}

interface StockOverview {
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
}

interface StockData {
  symbol: string;
  timestamp: string;
  quote: StockQuote;
  overview: StockOverview;
  chartData: ChartDataPoint[];
  cached: boolean;
}

interface StockChartProps {
  symbol: string;
  height: number;
  isDarkMode: boolean;
}

// Time range options
const TIME_RANGES = [
  { label: '1D', value: '1day', days: 1 },
  { label: '1W', value: '1week', days: 7 },
  { label: '1M', value: '1month', days: 30 },
  { label: '3M', value: '3months', days: 90 },
  { label: '1Y', value: '1year', days: 365 }
];

export function StockChart({ symbol, height, isDarkMode }: StockChartProps) {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1day');

  const fetchStockData = async (stockSymbol: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching stock data for:', stockSymbol);
      
      const response = await fetch(`${API_BASE_URL}/stock/${stockSymbol}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data: StockData = await response.json();
      console.log('✅ Received stock data:', {
        symbol: data.symbol,
        chartDataPoints: data.chartData?.length,
        cached: data.cached
      });
      
      setStockData(data);
    } catch (err) {
      console.error('❌ Error fetching stock data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData(symbol);
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStockData(symbol);
    }, 30000);

    return () => clearInterval(interval);
  }, [symbol]);

  // Process chart data for display
  const getChartData = () => {
    if (!stockData?.chartData) return [];
    
    // Filter data based on time range
    const now = new Date();
    const timeRange = TIME_RANGES.find(range => range.value === selectedTimeRange);
    const daysBack = timeRange?.days || 1;
    const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    const filtered = stockData.chartData
      .filter(point => new Date(point.timestamp) >= cutoffDate)
      .map(point => ({
        ...point,
        time: new Date(point.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        price: Number(point.close),
        volume: Number(point.volume)
      }))
      .slice(-50); // Show last 50 points
    
    console.log('📊 Chart data prepared:', filtered.length, 'points');
    return filtered;
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-xl p-6 border border-electric-green/20"
      >
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-electric-green border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Loading chart data...
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !stockData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-xl p-6 border border-red-500/20"
      >
        <div className="text-center py-8">
          <p className="text-red-500 text-lg mb-2">Chart Error</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button 
            onClick={() => fetchStockData(symbol)}
            className="px-4 py-2 bg-electric-green text-black rounded-lg hover:bg-electric-green/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  const chartData = getChartData();
  
  if (chartData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-xl p-6 border border-yellow-500/20"
      >
        <div className="text-center py-8">
          <p className="text-yellow-500 text-lg mb-2">No Chart Data</p>
          <p className="text-sm text-gray-500">No data available for the selected time range</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-6 border border-electric-green/20"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {stockData.overview?.name || symbol}
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {symbol} • {stockData.overview?.sector}
          </p>
        </div>
        
        <div className="text-right">
          <p className={`text-2xl font-bold ${stockData.quote.change >= 0 ? 'text-electric-green' : 'text-red-500'}`}>
            ${stockData.quote.price.toFixed(2)}
          </p>
          <p className={`text-sm ${stockData.quote.change >= 0 ? 'text-electric-green' : 'text-red-500'}`}>
            {stockData.quote.change >= 0 ? '+' : ''}{stockData.quote.change.toFixed(2)} 
            ({stockData.quote.changePercent.toFixed(2)}%)
          </p>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TIME_RANGES.map((range) => (
          <button
            key={range.value}
            onClick={() => setSelectedTimeRange(range.value)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              selectedTimeRange === range.value
                ? 'bg-electric-green text-black font-medium'
                : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-6" style={{ width: '100%', height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
            <XAxis 
              dataKey="time"
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              fontSize={12}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: '1px solid #22c55e',
                borderRadius: '8px',
                color: isDarkMode ? '#ffffff' : '#000000'
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#colorGradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Volume</p>
          <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {(stockData.quote.volume / 1000000).toFixed(1)}M
          </p>
        </div>
        
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>High</p>
          <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ${stockData.quote.high.toFixed(2)}
          </p>
        </div>
        
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Low</p>
          <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ${stockData.quote.low.toFixed(2)}
          </p>
        </div>
        
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Data</p>
          <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {chartData.length} pts
          </p>
        </div>
      </div>

      {/* Data Source */}
      {stockData.cached && (
        <div className="mt-4 text-center">
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            📊 Using cached data due to API rate limits
          </p>
        </div>
      )}
    </motion.div>
  );
}