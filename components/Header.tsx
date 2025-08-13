import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Maximize2, 
  ChevronDown,
  Zap,
  Circle
} from 'lucide-react';

interface HeaderProps {
  onToggleTheme?: () => void;
  isDarkMode?: boolean;
  isAuthenticated?: boolean;
  onShowAuth?: () => void;
}

export function Header({ 
  onToggleTheme, 
  isDarkMode = true, 
  isAuthenticated = false, 
  onShowAuth 
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState(3);
  const [isMarketOpen, setIsMarketOpen] = useState(true);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check market hours (simplified - 9:30 AM to 4:00 PM EST)
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
    const isMarketHours = hour >= 9 && hour < 16;
    setIsMarketOpen(isWeekday && isMarketHours);
  }, [currentTime]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <header className="bg-black/90 dark:bg-black/90 light:bg-white/90 backdrop-blur-xl border-b border-electric-green/20 dark:border-electric-green/20 light:border-gray-200 px-4 md:px-6 py-3 md:py-4 transition-colors duration-300">
      <div className="flex items-center justify-between max-w-full">
        {/* Left Section - Logo and Market Status */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Logo */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-electric-green to-gold rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 md:w-6 md:h-6 text-black" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-white dark:text-white light:text-gray-900">StockPulse Pro</h1>
            </div>
          </div>

          {/* Market Status */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Circle 
                className={`w-2 h-2 md:w-3 md:h-3 fill-current ${
                  isMarketOpen ? 'text-electric-green' : 'text-red-400'
                }`} 
              />
              <span className={`text-xs md:text-sm font-medium ${
                isMarketOpen ? 'text-electric-green' : 'text-red-400'
              }`}>
                {isMarketOpen ? 'Market Open' : 'Market Closed'}
              </span>
            </div>
            <span className="text-xs md:text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 hidden md:block">
              {formatTime(currentTime)}
            </span>
          </div>
        </div>

        {/* Center Section - Search Bar */}
        <div className="flex-1 max-w-md mx-4 md:mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-400 light:text-gray-500" />
            <input
              type="text"
              placeholder="Search stocks, news, or insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 dark:bg-white/10 light:bg-gray-100 border border-white/20 dark:border-white/20 light:border-gray-300 rounded-xl pl-10 pr-4 py-2 md:py-3 text-sm md:text-base text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 focus:outline-none focus:border-electric-green/50 focus:bg-white/15 dark:focus:bg-white/15 light:focus:bg-white transition-all duration-200"
            />
          </div>
        </div>

        {/* Right Section - Controls and User */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Theme Toggle */}
          <motion.button
            onClick={onToggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 md:p-3 rounded-xl bg-white/10 dark:bg-white/10 light:bg-gray-100 border border-white/20 dark:border-white/20 light:border-gray-300 text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:border-electric-green/30 transition-all duration-200"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <Moon className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </motion.button>

          {/* Fullscreen Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                document.documentElement.requestFullscreen();
              }
            }}
            className="hidden md:block p-2 md:p-3 rounded-xl bg-white/10 dark:bg-white/10 light:bg-gray-100 border border-white/20 dark:border-white/20 light:border-gray-300 text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:border-electric-green/30 transition-all duration-200"
          >
            <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 md:p-3 rounded-xl bg-white/10 dark:bg-white/10 light:bg-gray-100 border border-white/20 dark:border-white/20 light:border-gray-300 text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 hover:border-electric-green/30 transition-all duration-200"
          >
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {notifications}
              </span>
            )}
          </motion.button>

          {/* User Profile / Auth Section */}
          {isAuthenticated ? (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 rounded-xl bg-white/10 dark:bg-white/10 light:bg-gray-100 border border-white/20 dark:border-white/20 light:border-gray-300 hover:border-electric-green/30 transition-all duration-200 cursor-pointer"
            >
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-electric-green to-gold rounded-full flex items-center justify-center">
                <span className="text-xs md:text-sm font-bold text-black">AT</span>
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-white dark:text-white light:text-gray-900">Alex Trader</div>
                <div className="text-xs text-electric-green">Premium</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-400 light:text-gray-600 hidden md:block" />
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShowAuth}
              className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-electric-green to-emerald-400 hover:from-electric-green/90 hover:to-emerald-400/90 text-black font-medium rounded-xl transition-all duration-200"
            >
              <span className="text-sm md:text-base">Sign In</span>
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
}
