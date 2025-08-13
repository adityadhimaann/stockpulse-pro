import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Newspaper, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  impact: 'high' | 'medium' | 'low';
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: string;
}

interface SidebarNewsTickerProps {
  isDarkMode?: boolean;
}

export function SidebarNewsTicker({ isDarkMode = true }: SidebarNewsTickerProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock news data - in production this would come from your news API
  const mockNews: NewsItem[] = [
    {
      id: '1',
      title: 'Fed announces unexpected rate cut, markets surge',
      impact: 'high',
      sentiment: 'positive',
      timestamp: '2 min ago'
    },
    {
      id: '2',
      title: 'Tech stocks rally on AI breakthrough announcement',
      impact: 'high',
      sentiment: 'positive',
      timestamp: '5 min ago'
    },
    {
      id: '3',
      title: 'Oil prices drop 3% on supply concerns',
      impact: 'medium',
      sentiment: 'negative',
      timestamp: '8 min ago'
    },
    {
      id: '4',
      title: 'Crypto market shows signs of recovery',
      impact: 'medium',
      sentiment: 'positive',
      timestamp: '12 min ago'
    },
    {
      id: '5',
      title: 'Banking sector faces regulatory headwinds',
      impact: 'medium',
      sentiment: 'negative',
      timestamp: '15 min ago'
    }
  ];

  useEffect(() => {
    // Fetch real news from API
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/news/breaking');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.articles) {
            // Convert API response to our format
            const convertedNews: NewsItem[] = data.articles.slice(0, 5).map((article: any, index: number) => ({
              id: String(index + 1),
              title: article.title,
              impact: article.impact || 'medium',
              sentiment: article.sentiment || 'neutral',
              timestamp: article.timeAgo || 'Just now'
            }));
            setNews(convertedNews);
          } else {
            // Fallback to mock data
            setNews(mockNews);
          }
        } else {
          // Fallback to mock data
          setNews(mockNews);
        }
      } catch (error) {
        console.log('Using mock news data:', error);
        // Fallback to mock data
        setNews(mockNews);
      }
      setLoading(false);
    };

    fetchNews();
    
    // Refresh news every 5 minutes
    const newsRefreshInterval = setInterval(fetchNews, 5 * 60 * 1000);

    return () => clearInterval(newsRefreshInterval);
  }, []);

  useEffect(() => {
    if (news.length === 0) return;

    // Auto-rotate news every 4 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [news.length]);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <AlertCircle className="w-3 h-3 text-yellow-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'border-red-500 bg-red-500/10';
      case 'medium':
        return 'border-yellow-500 bg-yellow-500/10';
      default:
        return 'border-blue-500 bg-blue-500/10';
    }
  };

  if (loading) {
    return (
      <div className={`p-4 border-t border-b transition-colors duration-300 ${
        isDarkMode ? 'border-electric-green/20' : 'border-gray-200'
      }`}>
        <div className="flex items-center space-x-2 mb-3">
          <Newspaper className={`w-4 h-4 ${isDarkMode ? 'text-electric-green' : 'text-blue-600'}`} />
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Breaking News
          </span>
        </div>
        <div className={`h-16 rounded-lg flex items-center justify-center ${
          isDarkMode ? 'bg-white/5' : 'bg-gray-100'
        }`}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={`w-4 h-4 border-2 border-t-transparent rounded-full ${
              isDarkMode ? 'border-electric-green' : 'border-blue-600'
            }`}
          />
        </div>
      </div>
    );
  }

  if (news.length === 0) return null;

  const currentNews = news[currentIndex];

  return (
    <div className={`p-4 border-t border-b transition-colors duration-300 ${
      isDarkMode ? 'border-electric-green/20' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Newspaper className={`w-4 h-4 ${isDarkMode ? 'text-electric-green' : 'text-blue-600'}`} />
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Breaking News
          </span>
        </div>
        <div className="flex space-x-1">
          {news.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                index === currentIndex
                  ? isDarkMode ? 'bg-electric-green' : 'bg-blue-600'
                  : isDarkMode ? 'bg-white/20' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* News Item */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentNews.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`relative overflow-hidden rounded-lg border p-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
            getImpactColor(currentNews.impact)
          } ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-gray-50'}`}
        >
          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <p className={`text-xs leading-relaxed line-clamp-3 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {currentNews.title}
              </p>
              {getSentimentIcon(currentNews.sentiment)}
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentNews.timestamp}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                currentNews.impact === 'high'
                  ? 'bg-red-500/20 text-red-400'
                  : currentNews.impact === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                {currentNews.impact}
              </span>
            </div>
          </div>

          {/* Gradient overlay for visual appeal */}
          <div className={`absolute top-0 right-0 w-8 h-full bg-gradient-to-l ${
            isDarkMode 
              ? 'from-black/20 to-transparent' 
              : 'from-white/20 to-transparent'
          }`} />
        </motion.div>
      </AnimatePresence>

      {/* Manual navigation */}
      <div className="flex justify-center mt-3 space-x-2">
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + news.length) % news.length)}
          className={`p-1 rounded-full transition-colors duration-200 ${
            isDarkMode 
              ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
          }`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % news.length)}
          className={`p-1 rounded-full transition-colors duration-200 ${
            isDarkMode 
              ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
          }`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
