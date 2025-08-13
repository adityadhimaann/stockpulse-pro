import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Newspaper, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ExternalLink,
  RefreshCw,
  Filter,
  Search,
  AlertCircle
} from 'lucide-react';

// API Integration
const API_BASE_URL = 'http://localhost:3000/api';

interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  content: string;
  category: 'market' | 'tech' | 'crypto' | 'economy' | 'earnings' | 'breaking';
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: string;
  source: string;
  impact: 'high' | 'medium' | 'low';
  relatedSymbols: string[];
}

interface NewsWidgetProps {
  isDarkMode: boolean;
}

const NEWS_CATEGORIES = [
  { id: 'all', label: 'All News', icon: Newspaper },
  { id: 'breaking', label: 'Breaking', icon: AlertCircle },
  { id: 'market', label: 'Market', icon: TrendingUp },
  { id: 'tech', label: 'Technology', icon: TrendingUp },
  { id: 'crypto', label: 'Crypto', icon: TrendingDown },
  { id: 'economy', label: 'Economy', icon: TrendingUp },
  { id: 'earnings', label: 'Earnings', icon: TrendingUp }
];

export function NewsWidget({ isDarkMode }: NewsWidgetProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch news data
  const fetchNews = async (category: string = 'all') => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `${API_BASE_URL}/news`;
      if (category !== 'all') {
        if (category === 'breaking') {
          url = `${API_BASE_URL}/news/breaking`;
        } else {
          url = `${API_BASE_URL}/news/category/${category}`;
        }
      }
      
      console.log('🔄 NewsWidget: Fetching news from', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`News API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ NewsWidget: News received:', data.articles?.length, 'articles');
      
      setArticles(data.articles || []);
    } catch (err) {
      console.error('❌ NewsWidget: API Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
      
      // Fallback to mock data
      setArticles(getMockNews());
    } finally {
      setLoading(false);
    }
  };

  // Refresh news
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNews(selectedCategory);
    setRefreshing(false);
  };

  // Handle category change
  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    await fetchNews(category);
  };

  useEffect(() => {
    fetchNews(selectedCategory);
  }, []);

  // Filter articles based on search term
  const filteredArticles = articles.filter(article =>
    article.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.relatedSymbols.some(symbol => 
      symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Get sentiment icon and color
  const getSentimentDisplay = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return { 
          icon: TrendingUp, 
          color: 'text-electric-green', 
          bg: 'bg-electric-green/10' 
        };
      case 'negative':
        return { 
          icon: TrendingDown, 
          color: 'text-red-400', 
          bg: 'bg-red-400/10' 
        };
      default:
        return { 
          icon: TrendingUp, 
          color: 'text-gray-400', 
          bg: 'bg-gray-400/10' 
        };
    }
  };

  // Get impact badge color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  // Mock data fallback
  const getMockNews = (): NewsArticle[] => [
    {
      id: 'mock1',
      headline: 'Stock Markets Show Mixed Performance Amid Economic Data',
      summary: 'Major indices traded sideways as investors digested latest employment and inflation figures.',
      content: 'Markets remained volatile today as economic data painted a mixed picture...',
      category: 'market',
      sentiment: 'neutral',
      timestamp: new Date().toISOString(),
      source: 'StockPulse AI News',
      impact: 'medium',
      relatedSymbols: ['SPY', 'QQQ', 'DIA']
    },
    {
      id: 'mock2',
      headline: 'Technology Sector Leads Market Gains on AI Developments',
      summary: 'Tech giants surged higher following breakthrough announcements in artificial intelligence.',
      content: 'Technology companies dominated market gains today...',
      category: 'tech',
      sentiment: 'positive',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      source: 'StockPulse AI News',
      impact: 'high',
      relatedSymbols: ['AAPL', 'MSFT', 'GOOGL', 'NVDA']
    },
    {
      id: 'mock3',
      headline: 'Federal Reserve Signals Potential Policy Changes',
      summary: 'Central bank officials hint at upcoming monetary policy adjustments in response to economic conditions.',
      content: 'The Federal Reserve provided new guidance on future policy direction...',
      category: 'economy',
      sentiment: 'negative',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      source: 'StockPulse AI News',
      impact: 'high',
      relatedSymbols: ['TLT', 'GLD', 'DXY']
    }
  ];

  if (loading) {
    return (
      <div className="h-full flex flex-col p-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl p-6 border border-electric-green/20 flex flex-col h-full overflow-hidden"
        >
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-electric-green border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Loading news...
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-xl p-6 border border-electric-green/20 flex flex-col h-full overflow-hidden"
      >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-electric-green/20 rounded-lg flex items-center justify-center">
            <Newspaper className="w-5 h-5 text-electric-green" />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Market News
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              AI-powered financial news
            </p>
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`p-2 rounded-lg transition-colors ${
            refreshing
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-electric-green/20 text-electric-green hover:bg-electric-green/30'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${
              isDarkMode
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                : 'border-gray-200 bg-white text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {NEWS_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1 ${
              selectedCategory === category.id
                ? 'bg-electric-green text-black font-medium'
                : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <category.icon className="w-3 h-3" />
            {category.label}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* News Articles */}
      <div className="flex-1 overflow-hidden min-h-0">
        <div className="h-full overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300">
          <AnimatePresence>
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => {
              const sentimentDisplay = getSentimentDisplay(article.sentiment);
              const SentimentIcon = sentimentDisplay.icon;
              
              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border transition-all hover:border-electric-green/40 ${
                    isDarkMode
                      ? 'bg-gray-800/50 border-gray-700'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {/* Article Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${sentimentDisplay.bg}`}>
                        <SentimentIcon className={`w-3 h-3 ${sentimentDisplay.color}`} />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getImpactColor(article.impact)}`}>
                        {article.impact.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatTime(article.timestamp)}
                    </div>
                  </div>

                  {/* Headline */}
                  <h4 className={`font-semibold mb-2 line-clamp-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {article.headline}
                  </h4>

                  {/* Summary */}
                  <p className={`text-sm mb-3 line-clamp-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {article.summary}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {article.category.toUpperCase()}
                      </span>
                      {article.relatedSymbols.length > 0 && (
                        <div className="flex gap-1">
                          {article.relatedSymbols.slice(0, 3).map((symbol) => (
                            <span
                              key={symbol}
                              className="text-xs px-1.5 py-0.5 rounded bg-electric-green/20 text-electric-green"
                            >
                              {symbol}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button className={`text-xs text-electric-green hover:text-electric-green/80 flex items-center gap-1`}>
                      Read more
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <Newspaper className={`w-12 h-12 mx-auto mb-3 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {searchTerm ? 'No articles found matching your search.' : 'No news articles available.'}
              </p>
            </div>
          )}
        </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200/20 flex-shrink-0">
        <p className={`text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          📰 Powered by AI • Updated every 15 minutes
        </p>
      </div>
      </motion.div>
    </div>
  );
}
