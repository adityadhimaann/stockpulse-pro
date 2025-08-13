import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Zap,
  BarChart3,
  Target,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Minus
} from 'lucide-react';

interface SentimentData {
  symbol: string;
  overall: 'bullish' | 'bearish' | 'neutral';
  score: number; // -100 to 100
  confidence: number; // 0 to 100
  factors: {
    news: number;
    social: number;
    technical: number;
    fundamentals: number;
  };
  signals: string[];
  lastUpdate: Date;
}

interface NewsItem {
  id: string;
  headline: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  source: string;
  timestamp: Date;
}

// Mock sentiment data
const mockSentimentData: SentimentData[] = [
  {
    symbol: 'AAPL',
    overall: 'bullish',
    score: 72,
    confidence: 89,
    factors: {
      news: 68,
      social: 75,
      technical: 71,
      fundamentals: 74
    },
    signals: ['Strong earnings beat', 'Positive analyst upgrades', 'High social volume', 'Breaking resistance'],
    lastUpdate: new Date()
  },
  {
    symbol: 'TSLA',
    overall: 'neutral',
    score: 12,
    confidence: 76,
    factors: {
      news: 45,
      social: 62,
      technical: -8,
      fundamentals: 28
    },
    signals: ['Mixed earnings results', 'CEO sentiment shift', 'Consolidation pattern', 'Sector rotation'],
    lastUpdate: new Date()
  },
  {
    symbol: 'NVDA',
    overall: 'bullish',
    score: 85,
    confidence: 92,
    factors: {
      news: 88,
      social: 82,
      technical: 86,
      fundamentals: 84
    },
    signals: ['AI boom continuation', 'Strong institutional buying', 'Breakout pattern', 'Revenue guidance raised'],
    lastUpdate: new Date()
  },
  {
    symbol: 'SPY',
    overall: 'bearish',
    score: -34,
    confidence: 68,
    factors: {
      news: -28,
      social: -42,
      technical: -31,
      fundamentals: -35
    },
    signals: ['Fed policy concerns', 'Economic uncertainty', 'Technical breakdown', 'Profit taking'],
    lastUpdate: new Date()
  }
];

const mockNewsData: NewsItem[] = [
  {
    id: '1',
    headline: 'Apple Reports Record Q4 Earnings, Beats Expectations',
    sentiment: 'positive',
    impact: 'high',
    source: 'Financial Times',
    timestamp: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: '2',
    headline: 'Tesla Autopilot Investigation Expanded by NHTSA',
    sentiment: 'negative',
    impact: 'medium',
    source: 'Reuters',
    timestamp: new Date(Date.now() - 1000 * 60 * 45)
  },
  {
    id: '3',
    headline: 'NVIDIA AI Chip Demand Continues to Surge',
    sentiment: 'positive',
    impact: 'high',
    source: 'Bloomberg',
    timestamp: new Date(Date.now() - 1000 * 60 * 15)
  },
  {
    id: '4',
    headline: 'Market Volatility Expected as Fed Meeting Approaches',
    sentiment: 'neutral',
    impact: 'medium',
    source: 'CNBC',
    timestamp: new Date(Date.now() - 1000 * 60 * 60)
  }
];

interface AISentimentAnalysisProps {
  selectedSymbol?: string;
}

export function AISentimentAnalysis({ selectedSymbol = 'AAPL' }: AISentimentAnalysisProps) {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>(mockSentimentData);
  const [newsData, setNewsData] = useState<NewsItem[]>(mockNewsData);
  const [selectedStock, setSelectedStock] = useState(selectedSymbol);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Get current sentiment for selected stock
  const currentSentiment = sentimentData.find(data => data.symbol === selectedStock) || sentimentData[0];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSentimentData(prev => prev.map(data => ({
        ...data,
        score: Math.max(-100, Math.min(100, data.score + (Math.random() - 0.5) * 10)),
        confidence: Math.max(50, Math.min(100, data.confidence + (Math.random() - 0.5) * 5)),
        lastUpdate: new Date()
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-electric-green';
      case 'bearish': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="w-5 h-5" />;
      case 'bearish': return <TrendingDown className="w-5 h-5" />;
      default: return <Minus className="w-5 h-5" />;
    }
  };

  const getNewsIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-4 h-4 text-electric-green" />;
      case 'negative': return <ThumbsDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-yellow-400" />;
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      // Simulate new analysis
      setSentimentData(prev => prev.map(data => 
        data.symbol === selectedStock 
          ? { ...data, lastUpdate: new Date(), confidence: Math.min(100, data.confidence + 5) }
          : data
      ));
    }, 2000);
  };

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-electric-green to-gold rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 md:w-6 md:h-6 text-black" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">AI Sentiment Analysis</h2>
            <p className="text-sm md:text-base text-gray-400">Real-time market sentiment powered by AI</p>
          </div>
        </div>
        
        <motion.button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-electric-green/20 border border-electric-green/30 rounded-lg text-electric-green hover:bg-electric-green/30 transition-all disabled:opacity-50 text-sm md:text-base"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isAnalyzing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="w-3 h-3 md:w-4 md:h-4" />
            </motion.div>
          ) : (
            <Zap className="w-3 h-3 md:w-4 md:h-4" />
          )}
          <span className="hidden sm:inline">{isAnalyzing ? 'Analyzing...' : 'Re-analyze'}</span>
          <span className="sm:hidden">{isAnalyzing ? '...' : 'Analyze'}</span>
        </motion.button>
      </div>

      {/* Stock Selector */}
      <div className="flex flex-wrap gap-2">
        {sentimentData.map((data) => (
          <motion.button
            key={data.symbol}
            onClick={() => setSelectedStock(data.symbol)}
            className={`px-3 md:px-4 py-2 rounded-lg border transition-all text-sm md:text-base ${
              selectedStock === data.symbol
                ? 'bg-electric-green/20 border-electric-green/30 text-electric-green'
                : 'border-gray-700 text-gray-400 hover:border-electric-green/20 hover:text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {data.symbol}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Main Sentiment Overview */}
        <motion.div
          className="glass rounded-xl p-6 border border-electric-green/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Overall Sentiment</h3>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Activity className="w-4 h-4" />
              <span>Live</span>
            </div>
          </div>

          <div className="text-center">
            <div className={`flex items-center justify-center space-x-2 mb-2 ${getSentimentColor(currentSentiment.overall)}`}>
              {getSentimentIcon(currentSentiment.overall)}
              <span className="text-2xl font-bold capitalize">{currentSentiment.overall}</span>
            </div>
            
            <div className="text-4xl font-bold text-white mb-2">
              {currentSentiment.score > 0 ? '+' : ''}{currentSentiment.score}
            </div>
            
            <div className="text-sm text-gray-400 mb-4">
              Confidence: {currentSentiment.confidence}%
            </div>

            {/* Score Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${
                  currentSentiment.score > 0 ? 'bg-electric-green' : 'bg-red-400'
                }`}
                style={{ 
                  width: `${Math.abs(currentSentiment.score)}%`,
                  marginLeft: currentSentiment.score < 0 ? `${50 - Math.abs(currentSentiment.score)}%` : '50%'
                }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>Bearish (-100)</span>
              <span>Neutral (0)</span>
              <span>Bullish (+100)</span>
            </div>
          </div>
        </motion.div>

        {/* Sentiment Factors */}
        <motion.div
          className="glass rounded-xl p-6 border border-electric-green/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Sentiment Factors</h3>
          
          <div className="space-y-4">
            {Object.entries(currentSentiment.factors).map(([factor, value]) => (
              <div key={factor} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 capitalize">{factor}</span>
                  <span className={`font-semibold ${value > 0 ? 'text-electric-green' : value < 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                    {value > 0 ? '+' : ''}{value}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      value > 0 ? 'bg-electric-green' : value < 0 ? 'bg-red-400' : 'bg-yellow-400'
                    }`}
                    style={{ width: `${Math.abs(value)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Key Signals */}
      <motion.div
        className="glass rounded-xl p-6 border border-electric-green/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Key Signals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentSentiment.signals.map((signal, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div className="w-2 h-2 bg-electric-green rounded-full animate-pulse" />
              <span className="text-gray-300">{signal}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent News Impact */}
      <motion.div
        className="glass rounded-xl p-6 border border-electric-green/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">News Impact Analysis</h3>
          <MessageSquare className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="space-y-3">
          {newsData.slice(0, 4).map((news) => (
            <motion.div
              key={news.id}
              className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-electric-green/20 transition-all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex-shrink-0 mt-1">
                {getNewsIcon(news.sentiment)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white text-sm font-medium line-clamp-2">{news.headline}</h4>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                  <span>{news.source}</span>
                  <span>{news.timestamp.toLocaleTimeString()}</span>
                  <span className={`px-2 py-0.5 rounded ${
                    news.impact === 'high' ? 'bg-red-500/20 text-red-300' :
                    news.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {news.impact} impact
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
