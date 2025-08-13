import { motion } from 'motion/react';
import { PortfolioItem } from './data/mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PortfolioCardProps {
  item: PortfolioItem;
  isDarkMode: boolean;
}

export function PortfolioCard({ item, isDarkMode }: PortfolioCardProps) {
  const isPositive = item.gainLoss >= 0;
  const percentColor = isPositive ? 'text-electric-green' : 'text-red-400';
  const bgColor = isPositive ? 'border-electric-green/20' : 'border-red-400/20';

  return (
    <motion.div
      className={`glass rounded-xl md:rounded-2xl p-4 md:p-6 border ${bgColor} hover:border-electric-green/40 transition-all duration-300`}
      whileHover={{ scale: 1.02, y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div>
          <h3 className={`text-base md:text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>{item.symbol}</h3>
          <p className={`text-xs md:text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>{item.name}</p>
        </div>
        <div className="text-right">
          <p className={`text-base md:text-lg font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>${item.currentPrice.toFixed(2)}</p>
          <div className={`flex items-center space-x-1 ${percentColor}`}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
            ) : (
              <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />
            )}
            <span className="text-xs md:text-sm font-medium">
              {isPositive ? '+' : ''}{item.gainLossPercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 text-sm">
        <div>
          <p className={`text-xs md:text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Shares</p>
          <p className={`font-medium text-sm md:text-base ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>{item.shares}</p>
        </div>
        <div>
          <p className={`text-xs md:text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Avg Cost</p>
          <p className={`font-medium text-sm md:text-base ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>${item.avgCost.toFixed(2)}</p>
        </div>
        <div>
          <p className={`text-xs md:text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Total Value</p>
          <p className={`font-medium text-sm md:text-base ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>${item.totalValue.toLocaleString()}</p>
        </div>
        <div>
          <p className={`text-xs md:text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>P&L</p>
          <p className={`font-medium text-sm md:text-base ${percentColor}`}>
            {isPositive ? '+' : ''}${item.gainLoss.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Performance Bar */}
      <div className="mt-3 md:mt-4">
        <div className={`flex justify-between text-xs mb-1 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <span>Performance</span>
          <span>{isPositive ? '+' : ''}{item.gainLossPercent.toFixed(2)}%</span>
        </div>
        <div className="w-full h-1.5 md:h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${isPositive ? 'bg-electric-green' : 'bg-red-400'}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.abs(item.gainLossPercent) * 2, 100)}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
}