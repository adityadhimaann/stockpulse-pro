import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, ComposedChart 
} from 'recharts';
import { TrendingUp, BarChart3, Activity, Zap, ChevronDown, Building2 } from 'lucide-react';

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

interface StockData {
  symbol: string;
  timestamp: string;
  quote: any;
  overview: any;
  chartData: ChartDataPoint[];
  cached: boolean;
}

interface ChartMenuProps {
  symbol: string;
  isDarkMode: boolean;
  onSymbolChange?: (symbol: string) => void;
}

// Popular companies with their stock symbols
const POPULAR_COMPANIES = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary' },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary' },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology' },
  { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services' },
  { symbol: 'DIS', name: 'The Walt Disney Company', sector: 'Communication Services' },
  { symbol: 'PYPL', name: 'PayPal Holdings Inc.', sector: 'Financial Services' },
  { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology' },
  { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology' },
  { symbol: 'ORCL', name: 'Oracle Corporation', sector: 'Technology' },
  { symbol: 'IBM', name: 'International Business Machines', sector: 'Technology' },
  { symbol: 'INTC', name: 'Intel Corporation', sector: 'Technology' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology' },
  { symbol: 'UBER', name: 'Uber Technologies Inc.', sector: 'Technology' },
  { symbol: 'SPOT', name: 'Spotify Technology S.A.', sector: 'Communication Services' },
  { symbol: 'SQ', name: 'Block Inc.', sector: 'Financial Services' },
  { symbol: 'SHOP', name: 'Shopify Inc.', sector: 'Technology' },
  { symbol: 'ZM', name: 'Zoom Video Communications', sector: 'Technology' },
  { symbol: 'SNAP', name: 'Snap Inc.', sector: 'Communication Services' },
  { symbol: 'TWTR', name: 'Twitter Inc.', sector: 'Communication Services' },
  { symbol: 'ROKU', name: 'Roku Inc.', sector: 'Communication Services' },
  { symbol: 'COIN', name: 'Coinbase Global Inc.', sector: 'Financial Services' }
];

// Chart type options
const CHART_TYPES = [
  { 
    id: 'area', 
    name: 'Area Chart', 
    icon: TrendingUp,
    description: 'Smooth area visualization'
  },
  { 
    id: 'line', 
    name: 'Line Chart', 
    icon: Activity,
    description: 'Clean line visualization'
  },
  { 
    id: 'bar', 
    name: 'Bar Chart', 
    icon: BarChart3,
    description: 'Volume bars'
  },
  { 
    id: 'composed', 
    name: 'Mixed Chart', 
    icon: Zap,
    description: 'Price + Volume'
  }
];

// Time range options
const TIME_RANGES = [
  { label: '1D', value: '1day', days: 1 },
  { label: '1W', value: '1week', days: 7 },
  { label: '1M', value: '1month', days: 30 },
  { label: '3M', value: '3months', days: 90 },
  { label: '1Y', value: '1year', days: 365 }
];

// Fallback mock data - always available
const MOCK_CHART_DATA = [
  { time: '09:30', price: 175.50, volume: 1200000 },
  { time: '10:00', price: 176.20, volume: 980000 },
  { time: '10:30', price: 175.80, volume: 1100000 },
  { time: '11:00', price: 177.10, volume: 850000 },
  { time: '11:30', price: 178.40, volume: 750000 },
  { time: '12:00', price: 179.20, volume: 650000 },
  { time: '12:30', price: 178.90, volume: 700000 },
  { time: '13:00', price: 180.15, volume: 950000 },
  { time: '13:30', price: 179.75, volume: 800000 },
  { time: '14:00', price: 181.20, volume: 1300000 },
  { time: '14:30', price: 180.85, volume: 900000 },
  { time: '15:00', price: 182.10, volume: 1400000 },
  { time: '15:30', price: 181.95, volume: 1100000 },
  { time: '16:00', price: 183.25, volume: 1500000 }
];

// Company-specific mock data for different stocks
const getCompanyMockData = (symbol: string) => {
  const baseData = [
    { time: '09:30', volume: 1200000 },
    { time: '10:00', volume: 980000 },
    { time: '10:30', volume: 1100000 },
    { time: '11:00', volume: 850000 },
    { time: '11:30', volume: 750000 },
    { time: '12:00', volume: 650000 },
    { time: '12:30', volume: 700000 },
    { time: '13:00', volume: 950000 },
    { time: '13:30', volume: 800000 },
    { time: '14:00', volume: 1300000 },
    { time: '14:30', volume: 900000 },
    { time: '15:00', volume: 1400000 },
    { time: '15:30', volume: 1100000 },
    { time: '16:00', volume: 1500000 }
  ];

  // Company-specific price ranges and trends
  const companyData: Record<string, { basePrice: number; volatility: number; trend: number }> = {
    'AAPL': { basePrice: 175, volatility: 3, trend: 0.5 },
    'MSFT': { basePrice: 340, volatility: 5, trend: 0.3 },
    'GOOGL': { basePrice: 135, volatility: 4, trend: 0.2 },
    'AMZN': { basePrice: 145, volatility: 6, trend: 0.4 },
    'TSLA': { basePrice: 240, volatility: 12, trend: -0.2 },
    'META': { basePrice: 320, volatility: 8, trend: 0.6 },
    'NVDA': { basePrice: 450, volatility: 15, trend: 1.2 },
    'NFLX': { basePrice: 425, volatility: 10, trend: -0.1 },
    'DIS': { basePrice: 95, volatility: 3, trend: 0.1 },
    'PYPL': { basePrice: 60, volatility: 4, trend: -0.3 },
  };

  const config = companyData[symbol] || { basePrice: 100, volatility: 5, trend: 0 };
  
  return baseData.map((item, index) => {
    const trendAdjustment = config.trend * index * 0.2;
    const randomVariation = (Math.random() - 0.5) * config.volatility;
    const price = config.basePrice + trendAdjustment + randomVariation;
    
    return {
      ...item,
      price: Math.max(price, config.basePrice * 0.8) // Minimum price floor
    };
  });
};

export function ChartMenu({ symbol, isDarkMode, onSymbolChange }: ChartMenuProps) {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChart, setSelectedChart] = useState('area');
  const [selectedTimeRange, setSelectedTimeRange] = useState('1day');
  const [useAPI, setUseAPI] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState(symbol);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch stock data from API
  const fetchStockData = async (stockSymbol: string) => {
    if (!useAPI) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 ChartMenu: Fetching data for', stockSymbol);
      
      const response = await fetch(`${API_BASE_URL}/stock/${stockSymbol}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data: StockData = await response.json();
      console.log('✅ ChartMenu: Data received:', {
        symbol: data.symbol,
        chartPoints: data.chartData?.length,
        cached: data.cached
      });
      
      setStockData(data);
    } catch (err) {
      console.error('❌ ChartMenu: API Error:', err);
      setError(err instanceof Error ? err.message : 'API failed');
      setUseAPI(false); // Fall back to mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData(selectedSymbol);
  }, [selectedSymbol, useAPI]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle company selection
  const handleCompanySelect = (companySymbol: string) => {
    setSelectedSymbol(companySymbol);
    setShowDropdown(false);
    setSearchTerm('');
    if (onSymbolChange) {
      onSymbolChange(companySymbol);
    }
  };

  // Filter companies based on search term
  const filteredCompanies = POPULAR_COMPANIES.filter(company =>
    company.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current company info
  const getCurrentCompany = () => {
    return POPULAR_COMPANIES.find(company => company.symbol === selectedSymbol) || {
      symbol: selectedSymbol,
      name: `${selectedSymbol} Inc.`,
      sector: 'Unknown'
    };
  };

  // Get chart data - API or fallback
  const getChartData = () => {
    if (useAPI && stockData?.chartData) {
      // Process API data
      const processed = stockData.chartData
        .slice(-20) // Last 20 points
        .map(point => ({
          time: new Date(point.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          price: Number(point.close),
          volume: Number(point.volume)
        }));
      
      console.log('📊 Using API data:', processed.length, 'points');
      return processed;
    }
    
    console.log('📊 Using company-specific mock data for', selectedSymbol);
    return getCompanyMockData(selectedSymbol);
  };

  // Render different chart types
  const renderChart = () => {
    const chartData = getChartData();
    const chartHeight = 350;

    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    const commonComponents = (
      <>
        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
        <XAxis 
          dataKey="time"
          stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
          fontSize={12}
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
      </>
    );

    switch (selectedChart) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            {commonComponents}
            <Area
              type="monotone"
              dataKey="price"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#areaGradient)"
              dot={false}
            />
          </AreaChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            {commonComponents}
            <Line
              type="monotone"
              dataKey="price"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {commonComponents}
            <Bar
              dataKey="volume"
              fill="#22c55e"
              opacity={0.7}
            />
          </BarChart>
        );

      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            <defs>
              <linearGradient id="composedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
            <XAxis 
              dataKey="time"
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              fontSize={12}
            />
            <YAxis 
              yAxisId="price"
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              fontSize={12}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <YAxis 
              yAxisId="volume"
              orientation="right"
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              fontSize={10}
              tickFormatter={(value) => `${(value/1000000).toFixed(1)}M`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: '1px solid #22c55e',
                borderRadius: '8px',
                color: isDarkMode ? '#ffffff' : '#000000'
              }}
            />
            <Bar yAxisId="volume" dataKey="volume" fill="rgba(34, 197, 94, 0.3)" />
            <Area
              yAxisId="price"
              type="monotone"
              dataKey="price"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#composedGradient)"
              dot={false}
            />
          </ComposedChart>
        );

      default:
        return (
          <LineChart {...commonProps}>
            {commonComponents}
            <Line
              type="monotone"
              dataKey="price"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        );
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-xl p-6 border border-electric-green/20"
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-electric-green border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Loading charts...
            </p>
          </div>
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
        <div className="flex-1">
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Interactive Charts
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Choose company, chart type and time range
          </p>
        </div>
        
        {/* Data Source Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseAPI(!useAPI)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              useAPI
                ? 'bg-electric-green text-black'
                : 'bg-gray-600 text-white'
            }`}
          >
            {useAPI ? 'API Data' : 'Mock Data'}
          </button>
          {error && (
            <span className="text-xs text-red-400">API Error</span>
          )}
        </div>
      </div>

      {/* Company Selector */}
      <div className="mb-6">
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Select Company
        </label>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`w-full p-3 rounded-lg border transition-all flex items-center justify-between ${
              isDarkMode
                ? 'border-gray-700 bg-gray-800/50 text-white hover:border-gray-600'
                : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-electric-green" />
              <div className="text-left">
                <p className="font-semibold">{getCurrentCompany().symbol}</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {getCurrentCompany().name} • {getCurrentCompany().sector}
                </p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute top-full left-0 right-0 mt-2 rounded-lg border shadow-lg z-50 ${
                isDarkMode
                  ? 'border-gray-700 bg-gray-800'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {/* Search Input */}
              <div className="p-3 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full p-2 rounded-lg border text-sm ${
                    isDarkMode
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                      : 'border-gray-200 bg-white text-gray-900 placeholder-gray-500'
                  }`}
                  autoFocus
                />
              </div>
              
              {/* Company List */}
              <div className="max-h-64 overflow-y-auto">
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <button
                      key={company.symbol}
                      onClick={() => handleCompanySelect(company.symbol)}
                      className={`w-full p-3 text-left hover:bg-electric-green/10 transition-colors border-b last:border-b-0 ${
                        selectedSymbol === company.symbol
                          ? 'bg-electric-green/20 border-electric-green/30'
                          : isDarkMode
                            ? 'border-gray-700 hover:bg-gray-700/50'
                            : 'border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {company.symbol}
                          </p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {company.name}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {company.sector}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      No companies found matching "{searchTerm}"
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {CHART_TYPES.map((chartType) => {
          const Icon = chartType.icon;
          return (
            <button
              key={chartType.id}
              onClick={() => setSelectedChart(chartType.id)}
              className={`p-3 rounded-lg border transition-all ${
                selectedChart === chartType.id
                  ? 'border-electric-green bg-electric-green/10 text-electric-green'
                  : isDarkMode
                    ? 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs font-medium">{chartType.name}</p>
            </button>
          );
        })}
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

      {/* Chart Container */}
      <div className="mb-6" style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Chart Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Company</p>
          <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {getCurrentCompany().symbol}
          </p>
        </div>
        
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Chart Type</p>
          <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {CHART_TYPES.find(c => c.id === selectedChart)?.name}
          </p>
        </div>
        
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Data Points</p>
          <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {getChartData().length}
          </p>
        </div>
        
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</p>
          <p className={`text-sm font-semibold ${
            useAPI && !error ? 'text-electric-green' : 'text-yellow-500'
          }`}>
            {useAPI && !error ? 'Connected' : 'Fallback'}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={`p-4 rounded-lg mb-4 ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-50/50'}`}>
        <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Quick Stats - {getCurrentCompany().symbol}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(() => {
            const chartData = getChartData();
            const currentPrice = chartData[chartData.length - 1]?.price || 0;
            const firstPrice = chartData[0]?.price || 0;
            const priceChange = currentPrice - firstPrice;
            const priceChangePercent = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;
            const highPrice = Math.max(...chartData.map(d => d.price));
            const lowPrice = Math.min(...chartData.map(d => d.price));
            const avgVolume = chartData.reduce((sum, d) => sum + d.volume, 0) / chartData.length;

            return (
              <>
                <div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current</p>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${currentPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Change</p>
                  <p className={`text-lg font-bold ${priceChange >= 0 ? 'text-electric-green' : 'text-red-400'}`}>
                    {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Day Range</p>
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${lowPrice.toFixed(2)} - ${highPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Volume</p>
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {(avgVolume / 1000000).toFixed(1)}M
                  </p>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-center">
        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          📊 Interactive chart with {POPULAR_COMPANIES.length} companies • Multiple visualization options
        </p>
      </div>
    </motion.div>
  );
}
