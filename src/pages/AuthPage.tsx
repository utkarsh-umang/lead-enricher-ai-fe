import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { authService } from "../services/authService";
import { useTheme } from "../theme";
import BackgroundImage from "../components/BackgroundImage";

const AuthPage = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const isSignup = location.pathname === '/signup';
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI state
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    if (authService.isLoggedIn()) {
      // Redirect to dashboard if already logged in
      window.location.href = '/dashboard';
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // For signup, validate password match
    if (isSignup && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authService.login({
        email,
        password
      });
      
      if (response.status === 'success') {
        // Save user session
        authService.saveUserSession(response.user);
        // Redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);
    
    try {
      const response = await authService.loginWithGoogle();
      
      if (response.status === 'success') {
        // Save user session
        authService.saveUserSession(response.user);
        // Redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative font-sans"
      style={{
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <BackgroundImage />
      
      <div 
        className="max-w-md w-full space-y-8 backdrop-blur-md p-10 rounded-2xl shadow-2xl relative z-10 border"
        style={{
          backgroundColor: `${theme.palette.background.paper}E6`,
          borderColor: theme.palette.divider
        }}
      >
        <div className="text-center">
          <h2 
            className="text-3xl font-extrabold"
            style={{ color: theme.palette.text.primary }}
          >
            {isSignup ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p 
            className="mt-2 text-sm"
            style={{ color: theme.palette.text.secondary }}
          >
            {isSignup ? 'Get started with your free account today!' : 'Welcome back! Please enter your credentials.'}
          </p>
        </div>
        
        {error && (
          <div 
            className="border-l-4 p-4 rounded-r-md"
            style={{
              backgroundColor: `${theme.palette.error.main}15`,
              borderColor: theme.palette.error.main
            }}
          >
            <div className="flex items-center">
              <AlertCircle 
                className="h-5 w-5" 
                style={{ color: theme.palette.error.main }} 
              />
              <p 
                className="ml-3 text-sm font-medium"
                style={{ color: theme.palette.error.main }}
              >
                {error}
              </p>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-lg shadow-sm -space-y-px">
            {/* Email field */}
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <div className="relative">
                <div 
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                >
                  <Mail 
                    className="h-5 w-5" 
                    style={{ color: theme.palette.text.secondary }} 
                  />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-4 py-3.5 pl-12 border placeholder-gray-500 rounded-t-lg focus:outline-none focus:z-10 sm:text-sm transition-colors"
                  style={{
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.background.default
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.palette.primary.main;
                    e.target.style.boxShadow = `0 0 0 3px ${theme.palette.primary.main}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.palette.divider;
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Email address"
                />
              </div>
            </div>
            
            {/* Password field */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div 
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                >
                  <Lock 
                    className="h-5 w-5" 
                    style={{ color: theme.palette.text.secondary }} 
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`appearance-none rounded-none relative block w-full px-4 py-3.5 pl-12 border placeholder-gray-500 focus:outline-none focus:z-10 sm:text-sm transition-colors ${
                    isSignup ? 'rounded-none' : 'rounded-b-lg'
                  }`}
                  style={{
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.background.default
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.palette.primary.main;
                    e.target.style.boxShadow = `0 0 0 3px ${theme.palette.primary.main}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.palette.divider;
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Password"
                />
              </div>
            </div>
            
            {/* Confirm Password field (only for signup) */}
            {isSignup && (
              <div>
                <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                <div className="relative">
                  <div 
                    className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                  >
                    <Lock 
                      className="h-5 w-5" 
                      style={{ color: theme.palette.text.secondary }} 
                    />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-4 py-3.5 pl-12 border placeholder-gray-500 rounded-b-lg focus:outline-none focus:z-10 sm:text-sm transition-colors"
                    style={{
                      borderColor: theme.palette.divider,
                      color: theme.palette.text.primary,
                      backgroundColor: theme.palette.background.default
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.palette.primary.main;
                      e.target.style.boxShadow = `0 0 0 3px ${theme.palette.primary.main}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.palette.divider;
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Confirm Password"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isLoading ? theme.palette.primary.light : theme.palette.primary.main,
                color: theme.palette.primary.contrastText
              }}
              onMouseEnter={(e) => {
                if (!isLoading && !isGoogleLoading) {
                  e.currentTarget.style.backgroundColor = theme.palette.primary.dark;
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && !isGoogleLoading) {
                  e.currentTarget.style.backgroundColor = theme.palette.primary.main;
                }
              }}
            >
              {isLoading ? (
                <>
                  <svg 
                    className="animate-spin -ml-1 mr-3 h-5 w-5" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                    style={{ color: theme.palette.primary.contrastText }}
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span style={{ color: theme.palette.primary.contrastText }}>
                    {isSignup ? 'Signing up...' : 'Signing in...'}
                  </span>
                </>
              ) : (
                isSignup ? 'Sign up' : 'Sign in'
              )}
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div 
                  className="w-full border-t" 
                  style={{ borderColor: theme.palette.divider }}
                ></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span 
                  className="px-2"
                  style={{ 
                    backgroundColor: `${theme.palette.background.paper}E6`,
                    color: theme.palette.text.secondary 
                  }}
                >
                  Or continue with
                </span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
              className="group relative w-full flex justify-center items-center py-3.5 px-4 border text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary
              }}
              onMouseEnter={(e) => {
                if (!isLoading && !isGoogleLoading) {
                  e.currentTarget.style.backgroundColor = theme.palette.background.paper;
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && !isGoogleLoading) {
                  e.currentTarget.style.backgroundColor = theme.palette.background.default;
                }
              }}
            >
              {isGoogleLoading ? (
                <>
                  <svg 
                    className="animate-spin -ml-1 mr-3 h-5 w-5" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                    style={{ color: theme.palette.text.primary }}
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Login with Google</span>
                </>
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p 
            className="text-sm"
            style={{ color: theme.palette.text.secondary }}
          >
            {isSignup ? (
              <>
                Already have an account?{' '}
                <a 
                  href="/login" 
                  className="font-medium hover:underline transition-colors"
                  style={{ color: theme.palette.primary.main }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.palette.primary.dark;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = theme.palette.primary.main;
                  }}
                >
                  Login
                </a>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <a 
                  href="/signup" 
                  className="font-medium hover:underline transition-colors"
                  style={{ color: theme.palette.primary.main }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.palette.primary.dark;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = theme.palette.primary.main;
                  }}
                >
                  Signup
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;