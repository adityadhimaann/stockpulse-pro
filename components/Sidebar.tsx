import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  PieChart, 
  Star, 
  Newspaper, 
  BarChart3, 
  User,
  Settings,
  LogOut,
  Zap,
  Brain
} from 'lucide-react';
import { SidebarVerticalNews } from './SidebarVerticalNews';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isDarkMode?: boolean;
  isAuthenticated?: boolean;
}

const navigation = [
  { id: 'dashboard', label: 'Market Dashboard', icon: TrendingUp },
  { id: 'sentiment', label: 'AI Sentiment', icon: Brain },
  { id: 'portfolio', label: 'Portfolio', icon: PieChart },
  { id: 'watchlist', label: 'Watchlist', icon: Star },
  { id: 'news', label: 'News Feed', icon: Newspaper },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const bottomNavigation = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'logout', label: 'Logout', icon: LogOut },
];

const authNavigation = [
  { id: 'login', label: 'Sign In', icon: User },
];

export function Sidebar({ currentPage, onPageChange, isDarkMode = true, isAuthenticated = false }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className={`w-72 md:w-64 h-full flex flex-col border-r transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 via-black to-gray-900 border-electric-green/20'
        : 'bg-gradient-to-b from-white via-gray-50 to-white border-gray-200'
    }`}>
      {/* Logo */}
      <div className={`p-4 md:p-6 border-b transition-colors duration-300 ${
        isDarkMode ? 'border-electric-green/20' : 'border-gray-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-electric-green to-gold rounded-lg flex items-center justify-center">
            <Zap className="w-3 h-3 md:w-5 md:h-5 text-black" />
          </div>
          <div>
            <h1 className={`text-base md:text-lg font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>StockPulse Pro</h1>
            <p className={`text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Real-time Trading</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 md:px-4 py-4 md:py-6">
        <div className="space-y-1 md:space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const isHovered = hoveredItem === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg text-left transition-all duration-200 touch-target ${
                  isActive 
                    ? 'bg-electric-green/20 text-electric-green border border-electric-green/30' 
                    : isDarkMode
                      ? 'text-gray-400 hover:text-white hover:bg-white/5'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? 'text-electric-green' : ''}`} />
                <span className="font-medium text-sm md:text-base">{item.label}</span>
                
                {(isActive || isHovered) && (
                  <motion.div
                    className="ml-auto w-2 h-2 rounded-full bg-electric-green"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* News Ticker */}
      {/* Vertical News Ticker */}
      <div className="flex-1 overflow-hidden">
        <SidebarVerticalNews isDarkMode={isDarkMode} />
      </div>

      {/* Bottom Navigation */}
      <div className={`p-4 border-t transition-colors duration-300 ${
        isDarkMode ? 'border-electric-green/20' : 'border-gray-200'
      }`}>
        <div className="space-y-2">
          {(isAuthenticated ? bottomNavigation : authNavigation).map((item) => {
            const Icon = item.icon;
            const isHovered = hoveredItem === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-all duration-200 ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-white/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
                
                {isHovered && (
                  <motion.div
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-gold"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
            );
          })}
          
          {/* Logout button when authenticated */}
          {isAuthenticated && (
            <motion.button
              onClick={() => onPageChange('logout')}
              onMouseEnter={() => setHoveredItem('logout')}
              onMouseLeave={() => setHoveredItem(null)}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-all duration-200 ${
                isDarkMode
                  ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                  : 'text-red-600 hover:text-red-700 hover:bg-red-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
              
              {hoveredItem === 'logout' && (
                <motion.div
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-red-400"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* Scrolling News Ticker Removed */}

      {/* Glow Effect */}
      <div className="absolute top-20 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-electric-green to-transparent opacity-50 blur-sm" />
      <div className="absolute bottom-20 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-gold to-transparent opacity-50 blur-sm" />
    </div>
  );
}