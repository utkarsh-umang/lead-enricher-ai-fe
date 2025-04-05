import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ConnectPage from './pages/ConnectPage';
import SheetDetailsPage from './pages/SheetDetailsPage';
import EnrichmentStatusPage from './pages/EnrichmentPage';
import LoginPage from './pages/LoginPage';
import WavyBackground from './components/Background';
import Navbar from './components/Navbar';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('userToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      <Navbar />
      <main className="pt-4">
        {children}
      </main>
    </>
  );
};

// Login layout component
const LoginLayout = ({ children }) => {
  return (
    <>
      <WavyBackground />
      <main>
        {children}
      </main>
    </>
  );
};

const App = () => {
  return (
    <div className="relative min-h-screen bg-gray-50">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/login" 
            element={
              <LoginLayout>
                <LoginPage />
              </LoginLayout>
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