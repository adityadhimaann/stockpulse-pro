import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

interface SidebarScrollingNewsProps {
  isDarkMode?: boolean;
}

export function SidebarScrollingNews({ isDarkMode = true }: SidebarScrollingNewsProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock short news headlines for scrolling
  const mockNews: NewsItem[] = [
    { id: '1', title: 'Fed cuts rates • Markets rally', sentiment: 'positive' },
    { id: '2', title: 'Tech stocks surge 3%', sentiment: 'positive' },
    { id: '3', title: 'Oil prices drop on supply news', sentiment: 'negative' },
    { id: '4', title: 'Crypto shows recovery signs', sentiment: 'positive' },
    { id: '5', title: 'Bank stocks face headwinds', sentiment: 'negative' },
    { id: '6', title: 'Gold hits new high', sentiment: 'positive' },
    { id: '7', title: 'Bond yields stabilize', sentiment: 'neutral' },
    { id: '8', title: 'Dollar strengthens vs Euro', sentiment: 'positive' }
  ];

  useEffect(() => {
    // Fetch news from API or use mock data
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/news/breaking');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.articles) {
            const convertedNews: NewsItem[] = data.articles.slice(0, 8).map((article: any, index: number) => ({
              id: String(index + 1),
              title: article.title.length > 40 ? article.title.substring(0, 40) + '...' : article.title,
              sentiment: article.sentiment || 'neutral'
            }));
            setNews(convertedNews);
          } else {
            setNews(mockNews);
          }
        } else {
          setNews(mockNews);
        }
      } catch (error) {
        setNews(mockNews);
      }
      setLoading(false);
    };

    fetchNews();
    
    // Refresh every 10 minutes
    const interval = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-2.5 h-2.5 text-green-500 flex-shrink-0" />;
      case 'negative':
        return <TrendingDown className="w-2.5 h-2.5 text-red-500 flex-shrink-0" />;
      default:
        return <AlertCircle className="w-2.5 h-2.5 text-yellow-500 flex-shrink-0" />;
    }
  };

  if (loading || news.length === 0) {
    return (
      <div className={`h-8 flex items-center justify-center border-t border-b ${
        isDarkMode ? 'border-electric-green/20 bg-black/20' : 'border-gray-200 bg-gray-50'
      }`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className={`w-3 h-3 border border-t-transparent rounded-full ${
            isDarkMode ? 'border-electric-green' : 'border-blue-600'
          }`}
        />
      </div>
    );
  }

  // Create a continuous array for seamless scrolling
  const scrollingNews = [...news, ...news];

  return (
    <div className={`relative h-8 overflow-hidden border-t border-b ${
      isDarkMode ? 'border-electric-green/20 bg-black/20' : 'border-gray-200 bg-gray-50'
    }`}>
      {/* Scrolling container */}
      <motion.div
        className="flex items-center h-full"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 60, // 60 seconds for full cycle
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{ width: '200%' }}
      >
        {scrollingNews.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex items-center space-x-2 px-4 whitespace-nowrap"
          >
            {getSentimentIcon(item.sentiment)}
            <span className={`text-xs font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {item.title}
            </span>
            <span className={`text-xs ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              •
            </span>
          </div>
        ))}
      </motion.div>

      {/* Fade gradients */}
      <div className={`absolute top-0 left-0 w-8 h-full bg-gradient-to-r pointer-events-none ${
        isDarkMode 
          ? 'from-black/20 to-transparent' 
          : 'from-gray-50 to-transparent'
      }`} />
      <div className={`absolute top-0 right-0 w-8 h-full bg-gradient-to-l pointer-events-none ${
        isDarkMode 
          ? 'from-black/20 to-transparent' 
          : 'from-gray-50 to-transparent'
      }`} />
    </div>
  );
}
