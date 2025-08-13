import { useState, useEffect, useRef } from 'react';
import { motion, PanInfo } from 'motion/react';
import { marketApiService, StockQuote } from '../services/marketApi';
import { 
  ZoomIn, ZoomOut, RotateCcw, TrendingUp, TrendingDown, 
  Calendar, Clock, DollarSign, Activity 
} from 'lucide-react';

interface InteractiveChartProps {
  symbol: string;
  isDarkMode: boolean;
  height?: number;
}

interface ChartDataPoint {
  timestamp: number;
  price: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
}

interface TimeRange {
  start: number;
  end: number;
  label: string;
}

export function InteractiveChart({ symbol, isDarkMode, height = 400 }: InteractiveChartProps) {
  const [stockData, setStockData] = useState<StockQuote | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>({
    start: 0,
    end: 100,
    label: '1D'
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [priceChangeAnimations, setPriceChangeAnimations] = useState<Map<number, boolean>>(new Map());
  const chartRef = useRef<HTMLDivElement>(null);

  const timeRanges = [
    { start: 0, end: 100, label: '1D' },
    { start: 0, end: 100, label: '1W' },
    { start: 0, end: 100, label: '1M' },
    { start: 0, end: 100, label: '3M' },
    { start: 0, end: 100, label: '1Y' }
  ];

  // Generate realistic market data
  const generateChartData = (days: number): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const now = Date.now();
    let currentPrice = Math.random() * 200 + 100;
    
    for (let i = days; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000);
      const volatility = 0.02; // 2% daily volatility
      const change = (Math.random() - 0.5) * 2 * volatility;
      
      const open = currentPrice;
      const close = currentPrice * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.floor(Math.random() * 10000000 + 1000000);
      
      data.push({
        timestamp,
        price: close,
        volume,
        high,
        low,
        open,
        close
      });
      
      currentPrice = close;
    }
    
    return data.sort((a, b) => a.timestamp - b.timestamp);
  };

  const fetchStockData = async () => {
    try {
      const data = await marketApiService.getStockQuote(symbol);
      setStockData(data);
      
      // Generate chart data based on selected time range
      const days = selectedTimeRange.label === '1D' ? 1 :
                   selectedTimeRange.label === '1W' ? 7 :
                   selectedTimeRange.label === '1M' ? 30 :
                   selectedTimeRange.label === '3M' ? 90 : 365;
      
      const newChartData = generateChartData(days);
      setChartData(newChartData);
      
      // Trigger price change animations
      newChartData.forEach((point, index) => {
        if (index > 0) {
          const prevPoint = newChartData[index - 1];
          if (point.price !== prevPoint.price) {
            const animationMap = new Map(priceChangeAnimations);
            animationMap.set(index, true);
            setPriceChangeAnimations(animationMap);
            
            setTimeout(() => {
              const updatedMap = new Map(animationMap);
              updatedMap.delete(index);
              setPriceChangeAnimations(updatedMap);
            }, 2000);
          }
        }
      });
    } catch (error) {
      console.error('Failed to fetch stock data:', error);
    }
  };

  useEffect(() => {
    fetchStockData();
    const interval = setInterval(fetchStockData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [symbol, selectedTimeRange]);

  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range);
    setZoomLevel(1);
    setPanOffset(0);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.5));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset(0);
  };

  const handlePanStart = () => {
    setIsDragging(true);
  };

  const handlePan = (event: any, info: PanInfo) => {
    const maxOffset = (chartData.length * zoomLevel - chartData.length) / 2;
    const newOffset = Math.max(-maxOffset, Math.min(maxOffset, panOffset + info.delta.x / 2));
    setPanOffset(newOffset);
  };

  const handlePanEnd = () => {
    setIsDragging(false);
  };

  const getVisibleData = () => {
    if (!chartData.length) return [];
    
    const centerIndex = chartData.length / 2;
    const visibleRange = chartData.length / zoomLevel;
    const offsetIndex = panOffset / 10;
    
    const startIndex = Math.max(0, Math.floor(centerIndex - visibleRange / 2 + offsetIndex));
    const endIndex = Math.min(chartData.length, Math.ceil(centerIndex + visibleRange / 2 + offsetIndex));
    
    return chartData.slice(startIndex, endIndex);
  };

  const visibleData = getVisibleData();
  const maxPrice = Math.max(...visibleData.map(d => d.high));
  const minPrice = Math.min(...visibleData.map(d => d.low));
  const priceRange = maxPrice - minPrice;

  const formatPrice = (price: number | undefined) => price ? `$${price.toFixed(2)}` : '$0.00';
  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
    return volume.toString();
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    if (selectedTimeRange.label === '1D') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!stockData) {
    return (
      <div className="glass rounded-xl p-6 border border-electric-green/20 animate-pulse">
        <div className={`h-6 w-32 rounded mb-4 ${isDarkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
        <div className={`h-${height/16} w-full rounded ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6 border border-electric-green/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {stockData.symbol}
          </h3>
          <div className="flex items-center space-x-4 mt-2">
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {formatPrice(stockData.price)}
            </span>
            <div className={`flex items-center space-x-1 ${
              (stockData.changePercent || 0) >= 0 ? 'text-electric-green' : 'text-red-400'
            }`}>
              {(stockData.changePercent || 0) >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {(stockData.changePercent || 0) >= 0 ? '+' : ''}{stockData.changePercent?.toFixed(2) || '0.00'}%
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'bg-white/10 hover:bg-white/20 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }`}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomIn}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'bg-white/10 hover:bg-white/20 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }`}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'bg-white/10 hover:bg-white/20 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex space-x-2 mb-6">
        {timeRanges.map((range) => (
          <button
            key={range.label}
            onClick={() => handleTimeRangeChange(range)}
            className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
              selectedTimeRange.label === range.label
                ? 'bg-electric-green text-black font-medium'
                : isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-white/10'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Chart Area */}
      <div 
        ref={chartRef}
        className="relative bg-black/20 rounded-lg overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <motion.div
          className="h-full flex items-end justify-between px-2 py-4 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: -200, right: 200 }}
          onDragStart={handlePanStart}
          onDrag={handlePan}
          onDragEnd={handlePanEnd}
          whileDrag={{ cursor: 'grabbing' }}
        >
          {visibleData.map((point, index) => {
            const heightPercent = ((point.price - minPrice) / priceRange) * 80 + 10;
            const isAnimating = priceChangeAnimations.get(index);
            
            return (
              <motion.div
                key={`${point.timestamp}-${index}`}
                className="relative flex flex-col items-center"
                style={{ width: `${100 / visibleData.length}%` }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                {/* Price Change Indicator */}
                {isAnimating && (
                  <motion.div
                    className={`absolute -top-8 w-3 h-3 rounded-full ${
                      point.close > point.open ? 'bg-electric-green' : 'bg-red-400'
                    }`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1.5, 1, 1.5, 0], 
                      opacity: [0, 1, 1, 1, 0] 
                    }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                )}

                {/* Candlestick */}
                <div 
                  className="w-full max-w-[8px] relative"
                  style={{ height: `${heightPercent}%` }}
                >
                  {/* High-Low Line */}
                  <div
                    className={`absolute left-1/2 transform -translate-x-1/2 w-0.5 ${
                      isDarkMode ? 'bg-gray-600' : 'bg-gray-400'
                    }`}
                    style={{
                      height: '100%',
                      top: `${((maxPrice - point.high) / priceRange) * 80}%`
                    }}
                  />
                  
                  {/* Body */}
                  <motion.div
                    className={`absolute left-1/2 transform -translate-x-1/2 w-full ${
                      point.close > point.open
                        ? 'bg-electric-green'
                        : 'bg-red-400'
                    }`}
                    style={{
                      height: `${Math.abs(point.close - point.open) / priceRange * 80}%`,
                      top: `${((maxPrice - Math.max(point.open, point.close)) / priceRange) * 80}%`
                    }}
                    whileHover={{ scale: 1.2 }}
                    title={`
                      Open: ${formatPrice(point.open)}
                      High: ${formatPrice(point.high)}
                      Low: ${formatPrice(point.low)}
                      Close: ${formatPrice(point.close)}
                      Volume: ${formatVolume(point.volume)}
                      Time: ${formatTime(point.timestamp)}
                    `}
                  />
                </div>

                {/* Time Label */}
                {index % Math.ceil(visibleData.length / 6) === 0 && (
                  <span className={`text-xs mt-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {formatTime(point.timestamp)}
                  </span>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Price Scale */}
        <div className="absolute right-2 top-4 bottom-4 flex flex-col justify-between">
          {[...Array(5)].map((_, i) => {
            const price = maxPrice - (i * priceRange / 4);
            return (
              <span
                key={i}
                className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {formatPrice(price)}
              </span>
            );
          })}
        </div>

        {/* Zoom Indicator */}
        {zoomLevel !== 1 && (
          <div className="absolute top-2 left-2">
            <span className={`text-xs px-2 py-1 rounded ${
              isDarkMode ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-900'
            }`}>
              {zoomLevel.toFixed(1)}x
            </span>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="text-center p-3 bg-black/20 rounded-lg">
          <DollarSign className={`w-4 h-4 mx-auto mb-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`} />
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Volume
          </div>
          <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatVolume(stockData.volume)}
          </div>
        </div>
        
        <div className="text-center p-3 bg-black/20 rounded-lg">
          <Activity className={`w-4 h-4 mx-auto mb-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`} />
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Day High
          </div>
          <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatPrice(stockData.high)}
          </div>
        </div>
        
        <div className="text-center p-3 bg-black/20 rounded-lg">
          <Calendar className={`w-4 h-4 mx-auto mb-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`} />
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Day Low
          </div>
          <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatPrice(stockData.low)}
          </div>
        </div>
        
        <div className="text-center p-3 bg-black/20 rounded-lg">
          <Clock className={`w-4 h-4 mx-auto mb-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`} />
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            52W High
          </div>
          <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatPrice(stockData.high * 1.15)}
          </div>
        </div>
      </div>
    </div>
  );
}
