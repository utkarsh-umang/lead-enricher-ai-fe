import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ConnectPage from './pages/ConnectPage';
import ConnectedSheetsPage from './pages/ConnectedSheetsPage';
import SheetDetailsPage from './pages/SheetDetailsPage';
import EnrichmentStatusPage from './pages/EnrichmentStatusPage';
import EnrichmentsLandingPage from './pages/EnrichmentPage';
import CampaignsPage from './pages/CampaignsPage';
import AuthPage from './pages/AuthPage';
import WavyBackground from './components/Background';
import DashboardLayout from './components/DashboardLayout';

// Protected route component
const ProtectedRoute = ({ children }: any) => {
  const isAuthenticated = !!localStorage.getItem('userToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

const App = () => {
  return (
    <div className="relative min-h-screen">
      <BrowserRouter>
        <Routes>
          {/* Auth route */}
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
          
          {/* Dashboard routes - Sheets section */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <ConnectedSheetsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/connect" 
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
          
          {/* Dashboard routes - Enrichments section */}
          <Route 
            path="/enrichments" 
            element={
              <ProtectedRoute>
                <EnrichmentsLandingPage />
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
          
          {/* Dashboard routes - Campaigns section */}
          <Route 
            path="/campaigns" 
            element={
              <ProtectedRoute>
                <CampaignsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;