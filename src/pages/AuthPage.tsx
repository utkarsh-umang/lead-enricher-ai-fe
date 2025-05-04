import { useState, useEffect } from 'react';
import { Lock, Mail, User, AlertCircle, Brain, Building, ArrowLeft, ArrowRight } from 'lucide-react';
import { authService, type Agency } from "../services/authService";

const AuthPage = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agencyId, setAgencyId] = useState('');
  
  // UI state
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isCreatingAgency, setIsCreatingAgency] = useState(false);
  const [newAgencyName, setNewAgencyName] = useState('');
  const [newAgencyDescription, setNewAgencyDescription] = useState('');

  // Check if already logged in
  useEffect(() => {
    if (authService.isLoggedIn()) {
      // Redirect to home if already logged in
      window.location.href = '/';
    }
  }, []);

  // Fetch agencies when in signup mode
  useEffect(() => {
    if (isSignupMode) {
      fetchAgencies();
    }
  }, [isSignupMode]);

  const fetchAgencies = async () => {
    try {
      const agencyList = await authService.getAgencies();
      setAgencies(agencyList);
    } catch (err) {
      console.error('Failed to fetch agencies:', err);
      setError('Failed to fetch agencies. Please try again.');
    }
  };

  const handleCreateAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgencyName) {
      setError('Please enter an agency name');
      return;
    }

    setIsLoading(true);
    try {
      const newAgency = await authService.createAgency(newAgencyName, newAgencyDescription);
      // Add new agency to the list
      setAgencies([...agencies, newAgency]);
      // Select the new agency
      setAgencyId(newAgency.id);
      // Clear form and hide creation UI
      setNewAgencyName('');
      setNewAgencyDescription('');
      setIsCreatingAgency(false);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to create agency');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email || !password || !name || !agencyId) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authService.signup({
        email,
        password,
        name,
        agency_id: agencyId
      });
      
      if (response.status === 'success') {
        // Save user session
        authService.saveUserSession(response.user);
        // Redirect to home page
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

  const toggleAuthMode = () => {
    setIsSignupMode(!isSignupMode);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Logo at the top */}
      <div className="mb-8 flex flex-col items-center">
        <div className="bg-indigo-600 p-3 rounded-full">
          <Brain className="h-10 w-10 text-white" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">EnLead AI</h1>
      </div>
      
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isSignupMode ? 'Create your account' : 'Sign in to your account'}
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={isSignupMode ? handleSignup : handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Email field - common to both login and signup */}
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 ${!isSignupMode ? 'rounded-t-md' : ''} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Email address"
                />
              </div>
            </div>
            
            {/* Name field - signup only */}
            {isSignupMode && (
              <div>
                <label htmlFor="name" className="sr-only">Full name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Full name"
                  />
                </div>
              </div>
            )}
            
            {/* Agency selection - signup only */}
            {isSignupMode && !isCreatingAgency && (
              <div>
                <label htmlFor="agency" className="sr-only">Agency</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="agency"
                    name="agency"
                    required
                    value={agencyId}
                    onChange={(e) => setAgencyId(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  >
                    <option value="">Select Agency</option>
                    {agencies.map(agency => (
                      <option key={agency.id} value={agency.id}>{agency.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            
            {/* Agency creation form - when user selects to create a new agency */}
            {isSignupMode && isCreatingAgency && (
              <>
                <div>
                  <label htmlFor="agency-name" className="sr-only">Agency Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="agency-name"
                      name="agency-name"
                      type="text"
                      required
                      value={newAgencyName}
                      onChange={(e) => setNewAgencyName(e.target.value)}
                      className="appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Agency Name"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="agency-description" className="sr-only">Agency Description</label>
                  <textarea
                    id="agency-description"
                    name="agency-description"
                    value={newAgencyDescription}
                    onChange={(e) => setNewAgencyDescription(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Agency Description (optional)"
                  />
                </div>
                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setIsCreatingAgency(false)}
                    className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <ArrowLeft className="h-4 w-4 inline mr-1" />
                    Back to Selection
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateAgency}
                    disabled={isLoading || !newAgencyName}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                  >
                    Create Agency
                    {!isLoading && <ArrowRight className="h-4 w-4 inline ml-1" />}
                    {isLoading && (
                      <svg className="animate-spin ml-1 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </>
            )}
            
            {/* Agency create button */}
            {isSignupMode && !isCreatingAgency && (
              <div className="py-2 px-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingAgency(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-500 focus:outline-none"
                >
                  + Create new agency
                </button>
              </div>
            )}
            
            {/* Password field - common to both login and signup */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignupMode ? "new-password" : "current-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 ${!isSignupMode ? 'rounded-b-md' : ''} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder={isSignupMode ? "Create password" : "Password"}
                />
              </div>
            </div>
          </div>

          {!isSignupMode && (
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isSignupMode ? 'Creating account...' : 'Signing in...'}
                </>
              ) : (
                isSignupMode ? 'Create account' : 'Sign in'
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <button
            onClick={toggleAuthMode}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
          >
            {isSignupMode 
              ? 'Already have an account? Sign in' 
              : 'Need an account? Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;