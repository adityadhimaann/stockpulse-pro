import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Zap, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-3 md:p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 md:top-20 md:left-20 w-48 h-48 md:w-72 md:h-72 bg-electric-green/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-60 h-60 md:w-96 md:h-96 bg-gold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-64 md:h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating Icons */}
      <motion.div
        className="absolute top-1/4 left-1/4 text-electric-green/20"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <TrendingUp className="w-6 h-6 md:w-8 md:h-8" />
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-1/4 text-gold/20"
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <DollarSign className="w-8 h-8 md:w-10 md:h-10" />
      </motion.div>
      <motion.div
        className="absolute bottom-1/3 left-1/3 text-blue-400/20"
        animate={{ y: [-5, 15, -5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <BarChart3 className="w-6 h-6" />
      </motion.div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          className="glass rounded-2xl p-8 border border-electric-green/20 glow-green"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo and Branding */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-electric-green to-gold rounded-xl flex items-center justify-center mr-3">
                <Zap className="w-7 h-7 text-black" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-white">StockPulse Pro</h1>
                <p className="text-sm text-gray-400">Real-time Trading Platform</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Access professional trading tools and real-time market data
            </p>
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Label htmlFor="email" className="text-gray-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="trader@stockpulse.com"
                className="mt-2 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-electric-green focus:ring-electric-green/20"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-electric-green focus:ring-electric-green/20 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <label className="flex items-center space-x-2 text-sm text-gray-300">
                <input type="checkbox" className="rounded border-gray-600 text-electric-green focus:ring-electric-green focus:ring-offset-0" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-sm text-electric-green hover:text-electric-green/80 transition-colors">
                Forgot password?
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-electric-green to-emerald-400 hover:from-electric-green/90 hover:to-emerald-400/90 text-black font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In to Dashboard'
                )}
              </Button>
            </motion.div>
          </form>

          {/* Features Preview */}
          <motion.div
            className="mt-8 pt-6 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="text-xs text-gray-400 text-center mb-4">What you'll get access to:</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center space-x-2 text-gray-300">
                <div className="w-2 h-2 bg-electric-green rounded-full" />
                <span>Real-time prices</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <div className="w-2 h-2 bg-gold rounded-full" />
                <span>Advanced charts</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span>Portfolio tracking</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span>Market insights</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Demo Notice */}
        <motion.div
          className="text-center mt-6 text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          Demo Version • Use any email and password to continue
        </motion.div>
      </div>
    </div>
  );
}