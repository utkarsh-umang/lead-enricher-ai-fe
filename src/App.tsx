import { useEffect, useState } from 'react';
import ConnectPage from './pages/ConnectPage';
import SheetDetailsPage from './pages/SheetDetailsPage';
import EnrichmentStatusPage from './pages/EnrichmentPage';
import LoginPage from './pages/LoginPage';
import WavyBackground from './components/Background';
import Navbar from './components/Navbar';

// Simple route handler
const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount and path change
  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    setIsAuthenticated(!!userToken);
    
    // If not authenticated and not on login page, redirect to login
    if (!userToken && currentPath !== '/login') {
      window.location.href = '/login';
    }
  }, [currentPath]);

  // Listen for path changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen for popstate events (browser back/forward buttons)
    window.addEventListener('popstate', handleLocationChange);

    // Clean up event listener
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Simple routing based on the current path
  const renderRoute = () => {
    // Special case for login page
    if (currentPath === '/login') {
      return <LoginPage />;
    }

    // Protected routes - only show if authenticated
    if (isAuthenticated) {
      switch (currentPath) {
        case '/sheet-details':
          return <SheetDetailsPage />;
        case '/enrichment-status':
          return <EnrichmentStatusPage />;
        case '/':
        default:
          return <ConnectPage />;
      }
    }

    // Show nothing while redirecting
    return null;
  };

  // Determine if current route is login page
  const isLoginPage = currentPath === '/login';

  return (
    <div className={`relative min-h-screen ${isLoginPage ? '' : 'bg-gray-50'}`}>
      {/* Only show the background on the login page */}
      {isLoginPage && <WavyBackground />}
      
      {/* Don't show navbar on login page */}
      {!isLoginPage && <Navbar />}
      
      <main className={isLoginPage ? '' : 'pt-4'}>
        {renderRoute()}
      </main>
    </div>
  );
};

export default App;