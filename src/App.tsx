import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ConnectPage from './pages/ConnectPage';
import SheetDetailsPage from './pages/SheetDetailsPage';
import EnrichmentStatusPage from './pages/EnrichmentPage';
import AuthPage from './pages/AuthPage';
import WavyBackground from './components/Background';
import Navbar from './components/Navbar';

// Protected route component
const ProtectedRoute = ({ children }: any) => {
  const isAuthenticated = !!localStorage.getItem('userToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      <Navbar />
      <main className="pt-4 bg-gray-50">
        {children}
      </main>
    </>
  );
};

const App = () => {
  return (
    <div className="relative min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/login" 
            element={
              <>
                <WavyBackground />
                <main>
                  <AuthPage />
                </main>
              </>
            } 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <ConnectPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sheet-details" 
            element={
              <ProtectedRoute>
                <SheetDetailsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/enrichment-status" 
            element={
              <ProtectedRoute>
                <EnrichmentStatusPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;