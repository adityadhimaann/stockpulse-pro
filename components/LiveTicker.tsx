import { useState, useEffect } from 'react';
import { mockStocks } from './data/mockData';
import { motion } from 'motion/react';

interface LiveTickerProps {
  isDarkMode?: boolean;
}

export function LiveTicker({ isDarkMode = true }: LiveTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stocks, setStocks] = useState(mockStocks);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          const volatility = (Math.random() - 0.5) * 0.02; // ±1% change
          const newPrice = stock.price * (1 + volatility);
          const newChange = newPrice - stock.price;
          const newChangePercent = (newChange / stock.price) * 100;
          
          return {
            ...stock,
            price: Math.round(newPrice * 100) / 100,
            change: Math.round(newChange * 100) / 100,
            changePercent: Math.round(newChangePercent * 100) / 100
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Rotate through stocks
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % stocks.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [stocks.length]);

  return (
    <div className={`h-12 border-b overflow-hidden transition-all duration-300 ${
      isDarkMode
        ? 'bg-gradient-to-r from-black via-gray-900 to-black border-electric-green/20'
        : 'bg-gradient-to-r from-gray-100 via-white to-gray-100 border-gray-200'
    }`}>
      <div className="flex items-center h-full px-2 md:px-4">
        <div className="flex items-center space-x-2 mr-4 md:mr-8">
          <div className="w-2 h-2 rounded-full bg-electric-green animate-pulse"></div>
          <span className="text-xs md:text-sm font-medium text-electric-green">LIVE</span>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <motion.div 
            className="flex items-center space-x-4 md:space-x-8"
            animate={{ x: -currentIndex * (window.innerWidth < 768 ? 120 : 200) }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {stocks.map((stock, index) => (
              <div key={stock.symbol} className="flex items-center space-x-2 md:space-x-4 min-w-max">
                <span className={`font-semibold text-sm md:text-base transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{stock.symbol}</span>
                <span className={`text-xs md:text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>${stock.price.toFixed(2)}</span>
                <span className={`text-xs md:text-sm font-medium ${
                  stock.change >= 0 ? 'text-electric-green' : 'text-red-400'
                }`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} 
                  <span className="hidden sm:inline">
                    ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                  </span>
                </span>
              </div>
            ))}
          </motion.div>
        </div>
        
        <div className={`text-xs md:text-sm hidden sm:block transition-colors duration-300 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Market Open • Last Update: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}