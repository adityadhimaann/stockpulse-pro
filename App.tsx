import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, PieChart, Star, BarChart3 } from 'lucide-react';
import { LiveTicker } from './components/LiveTicker';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Auth } from './components/pages/Auth';
import { MarketDashboard } from './components/pages/MarketDashboard';
import { AISentimentAnalysis } from './components/AISentimentAnalysis';
import { NewsWidget } from './components/NewsWidget';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false); // For modal-based auth
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkMode(savedTheme === 'dark');
    document.documentElement.classList.add(savedTheme);
    document.documentElement.classList.remove(savedTheme === 'dark' ? 'light' : 'dark');

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const handleShowAuth = () => {
    setShowAuthModal(true);
  };

  const handlePageChange = (page: string) => {
    // Pages that require authentication
    const protectedPages = ['portfolio', 'watchlist', 'analytics'];
    
    if (protectedPages.includes(page) && !isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    if (page === 'logout') {
      handleLogout();
      return;
    }
    
    if (page === 'login') {
      setShowAuthModal(true);
      return;
    }
    
    setCurrentPage(page);
  };

  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    
    // Remove both classes and add the new one
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <MarketDashboard isDarkMode={isDarkMode} />;
      case 'sentiment':
        return <AISentimentAnalysis />;
      case 'portfolio':
        return (
          <div className="p-6">
            <div className="glass rounded-xl p-8 border border-electric-green/20 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Portfolio Management</h2>
              {isAuthenticated ? (
                <p className="text-gray-400">Detailed portfolio analytics coming soon...</p>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-400">Sign in to access your portfolio</p>
                  <button
                    onClick={handleShowAuth}
                    className="px-6 py-2 bg-electric-green text-black rounded-lg hover:bg-electric-green/90 transition-colors"
                  >
                    Sign In to Continue
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case 'watchlist':
        return (
          <div className="p-6">
            <div className="glass rounded-xl p-8 border border-gold/20 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Stock Watchlist</h2>
              {isAuthenticated ? (
                <p className="text-gray-400">Custom watchlists and alerts coming soon...</p>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-400">Sign in to create custom watchlists</p>
                  <button
                    onClick={handleShowAuth}
                    className="px-6 py-2 bg-gold text-black rounded-lg hover:bg-gold/90 transition-colors"
                  >
                    Sign In to Continue
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case 'news':
        return (
          <div className="h-full">
            <NewsWidget isDarkMode={isDarkMode} />
          </div>
        );
      case 'analytics':
        return (
          <div className="p-6">
            <div className="glass rounded-xl p-8 border border-purple-400/20 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Advanced Analytics</h2>
              {isAuthenticated ? (
                <p className="text-gray-400">Technical analysis tools coming soon...</p>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-400">Sign in to access advanced analytics</p>
                  <button
                    onClick={handleShowAuth}
                    className="px-6 py-2 bg-purple-400 text-black rounded-lg hover:bg-purple-400/90 transition-colors"
                  >
                    Sign In to Continue
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="p-6">
            <div className="glass rounded-xl p-8 border border-blue-400/20">
              {isAuthenticated ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-electric-green to-gold rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-black">AT</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Alex Trader</h2>
                      <p className="text-electric-green">Premium Member</p>
                      <p className="text-gray-400 text-sm">alex.trader@stockpulse.com</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Account Status</h3>
                      <p className="text-electric-green">Premium Active</p>
                      <p className="text-gray-400 text-sm">Expires: Dec 31, 2025</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Portfolio Value</h3>
                      <p className="text-gold text-xl font-bold">$125,432.50</p>
                      <p className="text-green-400 text-sm">+12.34% this month</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Watchlist Items</h3>
                      <p className="text-white text-xl font-bold">24</p>
                      <p className="text-gray-400 text-sm">Across 6 sectors</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Total Trades</h3>
                      <p className="text-white text-xl font-bold">156</p>
                      <p className="text-gray-400 text-sm">This quarter</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-electric-green to-gold rounded-full flex items-center justify-center mx-auto">
                    <User className="w-12 h-12 text-black" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Create Your Profile</h2>
                    <p className="text-gray-400 mb-6">Sign up to access personalized trading insights, portfolio tracking, and advanced analytics.</p>
                    
                    <div className="space-y-4">
                      <button
                        onClick={handleShowAuth}
                        className="w-full px-6 py-3 bg-gradient-to-r from-electric-green to-emerald-400 hover:from-electric-green/90 hover:to-emerald-400/90 text-black font-medium rounded-lg transition-all duration-200"
                      >
                        Sign Up for Free
                      </button>
                      
                      <p className="text-gray-400 text-sm">
                        Already have an account?{' '}
                        <button
                          onClick={handleShowAuth}
                          className="text-electric-green hover:text-electric-green/80 transition-colors"
                        >
                          Sign In
                        </button>
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/10">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-electric-green/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <PieChart className="w-6 h-6 text-electric-green" />
                      </div>
                      <p className="text-sm text-gray-300">Portfolio Tracking</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Star className="w-6 h-6 text-gold" />
                      </div>
                      <p className="text-sm text-gray-300">Custom Watchlists</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-400/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <BarChart3 className="w-6 h-6 text-purple-400" />
                      </div>
                      <p className="text-sm text-gray-300">Advanced Analytics</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <div className="glass rounded-xl p-8 border border-gray-400/20 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
              {isAuthenticated ? (
                <p className="text-gray-400">App preferences and account settings coming soon...</p>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-400">Sign in to access your settings</p>
                  <button
                    onClick={handleShowAuth}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Sign In to Continue
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return <MarketDashboard isDarkMode={isDarkMode} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-electric-green to-gold rounded-xl flex items-center justify-center mb-4 mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-black/30 border-t-black rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">StockPulse Pro</h1>
          <p className="text-gray-400">Loading real-time market data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col overflow-hidden mobile-safe transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-black via-gray-900 to-black text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      {/* Header */}
      <div className="flex-shrink-0">
        <Header 
          onToggleTheme={handleThemeToggle} 
          isDarkMode={isDarkMode} 
          isAuthenticated={isAuthenticated}
          onShowAuth={handleShowAuth}
        />
      </div>
      
      {/* Live Ticker */}
      <div className="flex-shrink-0">
        <LiveTicker isDarkMode={isDarkMode} />
      </div>
      
      {/* Main App Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Hidden on mobile, shown as overlay */}
        <div className={`flex-shrink-0 transition-transform duration-300 z-20 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative absolute inset-y-0 left-0`}>
          <Sidebar 
            currentPage={currentPage} 
            onPageChange={(page) => {
              handlePageChange(page);
              setIsMobileMenuOpen(false); // Close mobile menu after selection
            }}
            isDarkMode={isDarkMode}
            isAuthenticated={isAuthenticated}
          />
        </div>
        
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-10 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden mobile-scroll hide-scrollbar flex flex-col">
          {/* Mobile Header with Menu Button - Only show on mobile when no main header */}
          <div className={`md:hidden flex items-center justify-between p-3 md:p-4 border-b transition-all duration-300 ${
            isDarkMode
              ? 'border-electric-green/20 bg-black/50 text-white'
              : 'border-gray-200 bg-white/50 text-gray-900'
          } backdrop-blur-sm`}>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`p-2 rounded-lg border touch-target active:scale-95 transition-all duration-200 ${
                isDarkMode
                  ? 'bg-electric-green/20 border-electric-green/30 text-electric-green'
                  : 'bg-electric-green/10 border-electric-green/20 text-electric-green'
              }`}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className={`text-base md:text-lg font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>StockPulse Pro</h1>
            <div className="w-9 md:w-10" /> {/* Spacer for centering */}
          </div>
          
          <div className="flex-1 h-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 15, 26, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            color: 'white',
          },
        }}
      />

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-pulse transition-colors duration-300 ${
          isDarkMode ? 'bg-electric-green/5' : 'bg-electric-green/3'
        }`} />
        <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl animate-pulse transition-colors duration-300 ${
          isDarkMode ? 'bg-gold/5' : 'bg-gold/3'
        }`} style={{ animationDelay: '2s' }} />
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse transition-colors duration-300 ${
          isDarkMode ? 'bg-blue-500/3' : 'bg-blue-400/2'
        }`} style={{ animationDelay: '4s' }} />
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                ×
              </button>
              <Auth onLogin={handleLogin} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}