import { useState, useEffect } from 'react';
import { Lock, Mail, AlertCircle, Brain } from 'lucide-react';
import { authService } from "../services/authService";
import { useTheme } from "../theme";
import enleadBg from "../assets/enlead_bg.png";

const AuthPage = () => {
  const { theme } = useTheme();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI state
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    if (authService.isLoggedIn()) {
      // Redirect to home if already logged in
      window.location.href = '/';
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

    setIsLoading(true);
    
    try {
      const response = await authService.login({
        email,
        password
      });
      
      if (response.status === 'success') {
        // Save user session
        authService.saveUserSession(response.user);
        // Redirect to home page
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative font-sans"
      style={{
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Background image with opacity */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${enleadBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.5
        }}
      ></div>
      
      {/* Background overlay for better readability */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
      ></div>
      
      {/* Logo at the top */}
      <div className="mb-10 flex flex-col items-center relative z-10">
        <div 
          className="p-4 rounded-2xl shadow-lg"
          style={{ backgroundColor: theme.palette.primary.main }}
        >
          <Brain className="h-12 w-12" style={{ color: theme.palette.primary.contrastText }} />
        </div>
        <h1 
          className="mt-6 text-3xl font-bold drop-shadow-lg"
          style={{ color: theme.palette.background.default }}
        >
          EnLead AI
        </h1>
        <p 
          className="mt-2 text-sm font-medium"
          style={{ color: theme.palette.background.default, opacity: 0.9 }}
        >
          Lead Enrichment Intelligence
        </p>
      </div>
      
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
            Sign in to your account
          </h2>
          <p 
            className="mt-2 text-sm"
            style={{ color: theme.palette.text.secondary }}
          >
            Welcome back! Please enter your credentials.
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-offset-0 transition-colors"
                style={{
                  accentColor: theme.palette.primary.main,
                  borderColor: theme.palette.divider
                }}
              />
              <label 
                htmlFor="remember-me" 
                className="ml-2 block text-sm font-medium"
                style={{ color: theme.palette.text.primary }}
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a 
                href="#" 
                className="font-medium hover:underline transition-colors"
                style={{ color: theme.palette.primary.main }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.palette.primary.dark;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.palette.primary.main;
                }}
              >
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isLoading ? theme.palette.primary.light : theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                focusRingColor: theme.palette.primary.main
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = theme.palette.primary.dark;
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
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
                  <span style={{ color: theme.palette.primary.contrastText }}>Signing in...</span>
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;