import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getMarketSentiment } from './data/mockData';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MarketSentimentProps {
  isDarkMode: boolean;
}

export function MarketSentiment({ isDarkMode }: MarketSentimentProps) {
  const [sentiment, setSentiment] = useState(getMarketSentiment());

  useEffect(() => {
    const interval = setInterval(() => {
      setSentiment(getMarketSentiment());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSentimentIcon = () => {
    if (sentiment.value >= 55) return TrendingUp;
    if (sentiment.value <= 45) return TrendingDown;
    return Minus;
  };

  const Icon = getSentimentIcon();

  return (
    <div className="glass rounded-xl md:rounded-2xl p-4 md:p-6 border border-electric-green/20">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className={`text-base md:text-lg font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Market Sentiment</h3>
        <div className="flex items-center space-x-1 md:space-x-2">
          <Icon 
            className="w-4 h-4 md:w-5 md:h-5" 
            style={{ color: sentiment.color }}
          />
          <span 
            className="text-xs md:text-sm font-medium"
            style={{ color: sentiment.color }}
          >
            {sentiment.label}
          </span>
        </div>
      </div>
      
      <div className="relative">
        <div className="w-full h-2 md:h-3 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: sentiment.color }}
            initial={{ width: 0 }}
            animate={{ width: `${sentiment.value}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        <div className={`flex justify-between mt-2 text-xs ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <span>Bearish</span>
          <span>Neutral</span>
          <span>Bullish</span>
        </div>
      </div>
      
      <div className="mt-3 md:mt-4 flex justify-between items-center text-sm">
        <span className={`text-xs md:text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>Sentiment Score</span>
        <motion.span 
          className="font-bold text-sm md:text-base"
          style={{ color: sentiment.color }}
          key={sentiment.value}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {sentiment.value.toFixed(1)}%
        </motion.span>
      </div>
    </div>
  );
}