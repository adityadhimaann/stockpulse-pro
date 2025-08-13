import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { marketApiService, MarketSentiment } from '../services/marketApi';
import { TrendingUp, TrendingDown, Minus, Brain, RefreshCw } from 'lucide-react';

interface EnhancedMarketSentimentProps {
  isDarkMode: boolean;
}

export function EnhancedMarketSentiment({ isDarkMode }: EnhancedMarketSentimentProps) {
  const [sentiment, setSentiment] = useState<MarketSentiment>({
    score: 0,
    label: 'Neutral',
    confidence: 0,
    factors: []
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchSentiment = async () => {
    setLoading(true);
    try {
      const data = await marketApiService.getMarketSentiment();
      setSentiment(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch market sentiment:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentiment();
    const interval = setInterval(fetchSentiment, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const getSentimentIcon = () => {
    if (sentiment.score >= 0.2) return TrendingUp;
    if (sentiment.score <= -0.2) return TrendingDown;
    return Minus;
  };

  const getSentimentColor = () => {
    if (sentiment.score >= 0.2) return 'text-electric-green';
    if (sentiment.score <= -0.2) return 'text-red-400';
    return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
  };

  const getSentimentBg = () => {
    if (sentiment.score >= 0.2) return 'bg-electric-green/20';
    if (sentiment.score <= -0.2) return 'bg-red-400/20';
    return 'bg-yellow-400/20';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const SentimentIcon = getSentimentIcon();

  return (
    <motion.div
      className="glass rounded-xl p-4 md:p-6 border border-electric-green/20"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Brain className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
          <h3 className={`text-base md:text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            AI Market Sentiment
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {formatTime(lastUpdated)}
          </span>
          <button
            onClick={fetchSentiment}
            disabled={loading}
            className={`p-1 rounded transition-all duration-200 ${
              isDarkMode 
                ? 'hover:bg-white/20 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Sentiment Gauge */}
      <div className="relative mb-6">
        {/* Circular Progress Background */}
        <div className="relative w-32 h-32 mx-auto">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
              strokeWidth="8"
            />
            
            {/* Progress circle */}
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={
                sentiment.score >= 0.2 
                  ? "#00ff94" 
                  : sentiment.score <= -0.2 
                  ? "#ef4444" 
                  : "#fbbf24"
              }
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: Math.abs(sentiment.score),
                rotate: sentiment.score < 0 ? 180 : 0
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{
                pathLength: Math.abs(sentiment.score),
                strokeDasharray: "0 1"
              }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className={`w-8 h-8 mx-auto mb-2 flex items-center justify-center rounded-full ${getSentimentBg()}`}
              >
                <SentimentIcon className={`w-4 h-4 ${getSentimentColor()}`} />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {(sentiment.score * 100).toFixed(0)}
              </motion.div>
              
              <div className={`text-xs uppercase tracking-wider ${getSentimentColor()}`}>
                {sentiment.label}
              </div>
            </div>
          </div>
        </div>

        {/* Confidence Indicator */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Confidence
            </span>
            <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {sentiment.confidence}%
            </span>
          </div>
          
          <div className={`w-full h-2 rounded-full overflow-hidden ${
            isDarkMode ? 'bg-white/10' : 'bg-gray-200'
          }`}>
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-electric-green rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${sentiment.confidence}%` }}
              transition={{ duration: 1, delay: 1 }}
            />
          </div>
        </div>
      </div>

      {/* Sentiment Factors */}
      <div className="space-y-3">
        <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Contributing Factors
        </h4>
        
                {sentiment.factors.map((factor, index) => (
          <motion.div
            key={factor.factor}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 + index * 0.1 }}
            className="flex items-center justify-between"
          >
            <span className={`text-xs ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {factor.factor}
            </span>
            
            <div className="flex items-center space-x-2">
              <div className={`w-16 h-1.5 rounded-full overflow-hidden ${
                isDarkMode ? 'bg-white/10' : 'bg-gray-200'
              }`}>
                <motion.div
                  className={`h-full ${
                    factor.impact >= 0 
                      ? 'bg-electric-green' 
                      : 'bg-red-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(factor.impact * 100)}%` }}
                  transition={{ duration: 0.8, delay: 1.2 + index * 0.1 }}
                />
              </div>
              
              <span className={`text-xs font-medium w-8 text-right ${
                factor.impact >= 0 ? 'text-electric-green' : 'text-red-400'
              }`}>
                {(factor.impact * 100).toFixed(0)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pulse Animation for Updates */}
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r from-electric-green to-blue-400 rounded-xl opacity-20"
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}
