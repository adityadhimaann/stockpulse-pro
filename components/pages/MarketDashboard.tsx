import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PortfolioCard } from '../PortfolioCard';
import { StockChart } from '../StockChart';
import { ChartMenu } from '../ChartMenu';
import { MarketFilters } from '../MarketFilters';
import { EnhancedMarketSentiment } from '../EnhancedMarketSentiment';
import { mockPortfolio } from '../data/mockData';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface MarketDashboardProps {
  isDarkMode: boolean;
}

export function MarketDashboard({ isDarkMode }: MarketDashboardProps) {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [portfolioChange, setPortfolioChange] = useState(0);

  useEffect(() => {
    const totalValue = mockPortfolio.reduce((sum: number, item: any) => sum + item.totalValue, 0);
    const totalGainLoss = mockPortfolio.reduce((sum: number, item: any) => sum + item.gainLoss, 0);
    setPortfolioValue(totalValue);
    setPortfolioChange(totalGainLoss);
  }, []);

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol);
  };

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-7xl mx-auto">
      {/* Header Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <motion.div
          className="glass rounded-xl p-3 md:p-6 border border-electric-green/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs md:text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Portfolio Value</p>
              <p className={`text-lg md:text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>${portfolioValue.toLocaleString()}</p>
            </div>
            <div className="w-8 h-8 md:w-12 md:h-12 bg-electric-green/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 md:w-6 md:h-6 text-electric-green" />
            </div>
          </div>
          <div className={`flex items-center space-x-1 mt-2 ${
            portfolioChange >= 0 ? 'text-electric-green' : 'text-red-400'
          }`}>
            {portfolioChange >= 0 ? (
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
            ) : (
              <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />
            )}
            <span className="text-xs md:text-sm font-medium">
              {portfolioChange >= 0 ? '+' : ''}${portfolioChange.toFixed(2)} <span className="hidden sm:inline">Today</span>
            </span>
          </div>
        </motion.div>

        <motion.div
          className="glass rounded-xl p-6 border border-gold/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Active Positions</p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{mockPortfolio.length}</p>
            </div>
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-gold" />
            </div>
          </div>
          <p className={`text-sm mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Across {mockPortfolio.length} stocks</p>
        </motion.div>

        <motion.div
          className="glass rounded-xl p-6 border border-electric-green/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
                        <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Best Performer</p>
              <p className={`text-lg font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {mockPortfolio.sort((a: any, b: any) => b.gainLossPercent - a.gainLossPercent)[0]?.symbol} ({mockPortfolio.sort((a: any, b: any) => b.gainLossPercent - a.gainLossPercent)[0]?.gainLossPercent.toFixed(2)}%)
              </p>
            </div>
            <div className="text-right">
              <p className="text-electric-green font-bold">
                +{mockPortfolio.sort((a: any, b: any) => b.gainLossPercent - a.gainLossPercent)[0]?.gainLossPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass rounded-xl p-6 border border-red-400/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Worst Performer</p>
              <p className={`text-lg font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {mockPortfolio.sort((a, b) => a.gainLossPercent - b.gainLossPercent)[0]?.symbol}
              </p>
            </div>
            <div className="text-right">
              <p className="text-red-400 font-bold">
                {mockPortfolio.sort((a, b) => a.gainLossPercent - b.gainLossPercent)[0]?.gainLossPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Chart Section */}
        <div className="xl:col-span-3 space-y-6">
          <h2 className={`text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Interactive Market Charts</h2>
          
          {/* Advanced Chart Menu with Multiple Chart Types */}
          <ChartMenu 
            symbol={selectedStock} 
            isDarkMode={isDarkMode}
            onSymbolChange={handleStockSelect}
          />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Enhanced Market Sentiment */}
          <EnhancedMarketSentiment isDarkMode={isDarkMode} />
          
          {/* Market Filters */}
          <MarketFilters 
            isDarkMode={isDarkMode} 
            onStockSelect={handleStockSelect}
          />
        </div>
      </div>

      {/* Portfolio Overview */}
      <div>
        <h2 className={`text-xl font-bold mb-6 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Portfolio Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {mockPortfolio.map((item, index) => (
            <motion.div
              key={item.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <PortfolioCard item={item} isDarkMode={isDarkMode} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}