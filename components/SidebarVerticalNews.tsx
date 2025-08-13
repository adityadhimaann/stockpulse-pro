import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Zap
} from 'lucide-react';

interface NewsItem {
  id: string;
  headline: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: string;
  impact: 'high' | 'medium' | 'low';
}

interface SidebarVerticalNewsProps {
  isDarkMode: boolean;
}

export function SidebarVerticalNews({ isDarkMode }: SidebarVerticalNewsProps) {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock news data with real-time feel
  const mockNewsItems: NewsItem[] = [
    {
      id: '1',
      headline: 'Federal Reserve Signals Rate Cut Ahead',
      sentiment: 'positive',
      timestamp: new Date().toISOString(),
      impact: 'high'
    },
    {
      id: '2',
      headline: 'Tech Stocks Rally on AI Breakthrough',
      sentiment: 'positive',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      impact: 'medium'
    },
    {
      id: '3',
      headline: 'Oil Prices Drop 3% on Supply Concerns',
      sentiment: 'negative',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      impact: 'medium'
    },
    {
      id: '4',
      headline: 'Crypto Market Sees $2B Inflow',
      sentiment: 'positive',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      impact: 'high'
    },
    {
      id: '5',
      headline: 'Manufacturing Data Beats Expectations',
      sentiment: 'positive',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      impact: 'low'
    }
  ];

  // Fetch news from API or use mock data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/news');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.articles.length > 0) {
            setNewsItems(data.articles.slice(0, 5)); // Take first 5 articles
          } else {
            setNewsItems(mockNewsItems);
          }
        } else {
          setNewsItems(mockNewsItems);
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
        setNewsItems(mockNewsItems);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll through news items
  useEffect(() => {
    if (newsItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
    }, 4000); // Change news every 4 seconds

    return () => clearInterval(interval);
  }, [newsItems.length]);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return { icon: TrendingUp, color: 'text-electric-green' };
      case 'negative':
        return { icon: TrendingDown, color: 'text-red-400' };
      default:
        return { icon: Zap, color: 'text-gray-400' };
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / 60000);
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className={`mt-4 p-4 border-t transition-colors duration-300 ${
        isDarkMode ? 'border-electric-green/20' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-center h-20">
          <div className="animate-spin w-4 h-4 border-2 border-electric-green border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (newsItems.length === 0) {
    return null;
  }

  const currentNews = newsItems[currentNewsIndex];
  const sentimentDisplay = getSentimentIcon(currentNews.sentiment);
  const SentimentIcon = sentimentDisplay.icon;

  return (
    <div className={`mt-4 p-4 border-t transition-colors duration-300 ${
      isDarkMode ? 'border-electric-green/20' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-electric-green/20 rounded-md flex items-center justify-center">
          <Zap className="w-3 h-3 text-electric-green" />
        </div>
        <span className={`text-xs font-semibold uppercase tracking-wide ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Live News
        </span>
      </div>

      {/* Animated News Container */}
      <div className="relative h-24 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNews.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ 
              duration: 0.5,
              ease: "easeInOut"
            }}
            className={`absolute inset-0 p-3 rounded-lg border transition-all duration-300 ${
              isDarkMode
                ? 'bg-gray-800/30 border-gray-700/50 hover:border-electric-green/30'
                : 'bg-gray-50/50 border-gray-200 hover:border-electric-green/30'
            }`}
          >
            {/* News Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <div className={`p-1 rounded ${
                  sentimentDisplay.color === 'text-electric-green' 
                    ? 'bg-electric-green/20' 
                    : sentimentDisplay.color === 'text-red-400'
                    ? 'bg-red-500/20'
                    : 'bg-gray-500/20'
                }`}>
                  <SentimentIcon className={`w-2.5 h-2.5 ${sentimentDisplay.color}`} />
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${getImpactColor(currentNews.impact)}`}>
                  {currentNews.impact.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-2.5 h-2.5" />
                {formatTime(currentNews.timestamp)}
              </div>
            </div>

            {/* News Headline */}
            <p className={`text-xs font-medium leading-tight line-clamp-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {currentNews.headline}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Indicators */}
      <div className="flex gap-1 mt-3">
        {newsItems.map((_, index) => (
          <div
            key={index}
            className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
              index === currentNewsIndex 
                ? 'bg-electric-green' 
                : isDarkMode 
                ? 'bg-gray-700' 
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Live Indicator */}
      <div className="flex items-center justify-center mt-2">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-electric-green rounded-full animate-pulse"></div>
          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Live Updates
          </span>
        </div>
      </div>
    </div>
  );
}
