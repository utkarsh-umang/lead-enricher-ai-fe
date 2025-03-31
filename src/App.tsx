import { useEffect, useState } from 'react';
import ConnectPage from './pages/ConnectPage';
import SheetDetailsPage from './pages/SheetDetailsPage';
import EnrichmentStatusPage from './pages/EnrichmentPage';

// Simple route handler
const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

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
    switch (currentPath) {
      case '/sheet-details':
        return <SheetDetailsPage />;
      case '/enrichment-status':
        return <EnrichmentStatusPage />;
      case '/':
      default:
        return <ConnectPage />;
    }
  };

  return renderRoute();
};

export default App;