import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, Activity, Volume2, Filter, RefreshCw } from 'lucide-react';
import { marketApiService, StockQuote } from '../services/marketApi';

type FilterType = 'gainers' | 'losers' | 'active' | 'volume';
type TimeframeType = '1d' | '1w' | '1m' | '3m' | '1y';

interface MarketFiltersProps {
  isDarkMode: boolean;
  onStockSelect?: (symbol: string) => void;
}

export function MarketFilters({ isDarkMode, onStockSelect }: MarketFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('gainers');
  const [timeframe, setTimeframe] = useState<TimeframeType>('1d');
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const filters = [
    { 
      type: 'gainers' as const, 
      label: 'Top Gainers', 
      icon: TrendingUp, 
      color: 'text-electric-green',
      bgColor: 'bg-electric-green/20'
    },
    { 
      type: 'losers' as const, 
      label: 'Top Losers', 
      icon: TrendingDown, 
      color: 'text-red-400',
      bgColor: 'bg-red-400/20'
    },
    { 
      type: 'active' as const, 
      label: 'Most Active', 
      icon: Activity, 
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20'
    },
    { 
      type: 'volume' as const, 
      label: 'High Volume', 
      icon: Volume2, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20'
    }
  ];

  const timeframes = [
    { value: '1d' as const, label: '1D' },
    { value: '1w' as const, label: '1W' },
    { value: '1m' as const, label: '1M' },
    { value: '3m' as const, label: '3M' },
    { value: '1y' as const, label: '1Y' }
  ];

  const fetchFilteredStocks = async () => {
    setLoading(true);
    try {
      const data = await marketApiService.getFilteredStocks();
      
      // Get the appropriate array based on active filter
      let filteredStocks: StockQuote[];
      if (activeFilter === 'gainers') {
        filteredStocks = data.gainers;
      } else if (activeFilter === 'losers') {
        filteredStocks = data.losers;
      } else if (activeFilter === 'active' || activeFilter === 'volume') {
        filteredStocks = data.mostActive;
      } else {
        filteredStocks = data.mostActive;
      }
      
      setStocks(filteredStocks);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch filtered stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredStocks();
  }, [activeFilter, timeframe]);

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchFilteredStocks, 30000);
    return () => clearInterval(interval);
  }, [activeFilter, timeframe]);

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Filter className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Market Filters
          </h2>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Updated: {formatTime(lastUpdated)}
          </span>
          <button
            onClick={fetchFilteredStocks}
            disabled={loading}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'bg-white/10 hover:bg-white/20 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.type;
          
          return (
            <motion.button
              key={filter.type}
              onClick={() => setActiveFilter(filter.type)}
              className={`relative p-3 rounded-xl border transition-all duration-200 w-full ${
                isActive
                  ? `${filter.bgColor} border-current ${filter.color}`
                  : isDarkMode
                  ? 'bg-white/5 border-white/20 text-gray-400 hover:bg-white/10 hover:text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center space-y-2">
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-xs text-center leading-tight">{filter.label}</span>
                {isActive && (
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-current"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>
              
              {isActive && (
                <motion.div
                  className="absolute inset-0 border-2 border-current rounded-xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Timeframe Selector */}
      <div className="space-y-2">
        <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Timeframe
        </span>
        <div className={`grid grid-cols-5 gap-1 p-1 rounded-lg ${
          isDarkMode ? 'bg-white/10' : 'bg-gray-100'
        }`}>
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-1 py-1.5 text-xs font-medium rounded-md transition-all duration-200 text-center ${
                timeframe === tf.value
                  ? 'bg-electric-green text-black'
                  : isDarkMode
                  ? 'text-gray-400 hover:text-white hover:bg-white/10'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stock List */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`glass rounded-xl p-4 border border-white/20 animate-pulse ${
                    isDarkMode ? 'bg-white/5' : 'bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className={`h-4 w-16 rounded mb-2 ${
                        isDarkMode ? 'bg-white/20' : 'bg-gray-300'
                      }`} />
                      <div className={`h-3 w-24 rounded ${
                        isDarkMode ? 'bg-white/10' : 'bg-gray-200'
                      }`} />
                    </div>
                    <div className="text-right">
                      <div className={`h-4 w-16 rounded mb-2 ${
                        isDarkMode ? 'bg-white/20' : 'bg-gray-300'
                      }`} />
                      <div className={`h-3 w-12 rounded ${
                        isDarkMode ? 'bg-white/10' : 'bg-gray-200'
                      }`} />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="stocks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {stocks.map((stock, index) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onStockSelect?.(stock.symbol)}
                  className={`glass rounded-xl p-4 border border-white/20 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    isDarkMode
                      ? 'hover:bg-white/10 hover:border-white/30'
                      : 'hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className={`font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {stock.symbol}
                      </h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Vol: {formatNumber(stock.volume)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        ${stock.price.toFixed(2)}
                      </p>
                      <div className={`flex items-center justify-end space-x-1 ${
                        stock.changePercent >= 0 ? 'text-electric-green' : 'text-red-400'
                      }`}>
                        {stock.changePercent >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span className="text-sm font-medium">
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price change animation dot */}
                  <motion.div
                    className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                      stock.changePercent >= 0 ? 'bg-electric-green' : 'bg-red-400'
                    }`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1.5, 1], 
                      opacity: [0, 1, 0.7] 
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatDelay: 3 
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
