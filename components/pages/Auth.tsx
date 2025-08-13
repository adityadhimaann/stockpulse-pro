import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Zap, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  Mail,
  User,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { authHelpers } from '../../lib/supabase';

interface AuthProps {
  onLogin: () => void;
}

type AuthMode = 'login' | 'register';

export function Auth({ onLogin }: AuthProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (authMode === 'login') {
        const { data, error } = await authHelpers.signIn(formData.email, formData.password);
        if (error) throw error;
        onLogin();
      } else if (authMode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        
        const { data, error } = await authHelpers.signUp(
          formData.email, 
          formData.password,
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`
          }
        );
        
        if (error) throw error;
        setSuccess('Registration successful! Please check your email to verify your account.');
        setTimeout(() => setAuthMode('login'), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    switch (authMode) {
      case 'login':
        return (
          <form onSubmit={handleEmailAuth} className="space-y-6">
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
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
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
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-gray-300">
                <input type="checkbox" className="rounded border-gray-600 text-electric-green focus:ring-electric-green focus:ring-offset-0" />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-electric-green hover:text-electric-green/80 transition-colors">
                Forgot password?
              </button>
            </div>

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
          </form>
        );

      case 'register':
        return (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="mt-2 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-electric-green focus:ring-electric-green/20"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="mt-2 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-electric-green focus:ring-electric-green/20"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="trader@stockpulse.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-2 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-electric-green focus:ring-electric-green/20"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
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
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="mt-2 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-electric-green focus:ring-electric-green/20"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-electric-green to-emerald-400 hover:from-electric-green/90 hover:to-emerald-400/90 text-black font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        );

      default:
        return null;
    }
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
            
            {/* Back Button */}
            {authMode === 'register' && (
              <button
                onClick={() => setAuthMode('login')}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </button>
            )}

            <p className="text-gray-400 text-sm">
              {authMode === 'login' && 'Access professional trading tools and real-time market data'}
                            {authMode === 'register' && 'Create your account'}
            </p>
          </motion.div>

          {/* Error/Success Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Auth Forms */}
          <AnimatePresence mode="wait">
            <motion.div
              key={authMode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderForm()}
            </motion.div>
          </AnimatePresence>

          {/* Switch between Login/Register */}
          {authMode === 'login' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={() => setAuthMode('register')}
                  className="text-electric-green hover:text-electric-green/80 transition-colors font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          )}

          {authMode === 'register' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-electric-green hover:text-electric-green/80 transition-colors font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}

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
                <span>AI market insights</span>
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
          Secure Authentication • Powered by Supabase
        </motion.div>
      </div>
    </div>
  );
}
