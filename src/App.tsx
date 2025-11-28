import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ConnectPage from './pages/ConnectPage';
import ConnectedSheetsPage from './pages/ConnectedSheetsPage';
import SheetDetailsPage from './pages/SheetDetailsPage';
import EnrichmentStatusPage from './pages/EnrichmentStatusPage';
import EnrichmentsLandingPage from './pages/EnrichmentPage';
import SubsequqncePage from './pages/SubsequencePage';
import OutreachCampaignsPage from './pages/CampaignsPage';
import CampaignDetailsPage from './pages/CampaignDetails';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import MyLeadsPage from './pages/MyLeadsPage';
import DashboardLayout from './components/DashboardLayout';
import LandingLayout from './components/LandingLayout';
import { ThemeProvider } from './theme/ThemeContext';
import { authService } from './services/authService';

// Protected route component - for logged in users
const ProtectedRoute = ({ children }: any) => {
  const isAuthenticated = authService.isLoggedIn();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

// Public route component - for not logged in users
const PublicRoute = ({ children }: any) => {
  const isAuthenticated = authService.isLoggedIn();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <LandingLayout>
      {children}
    </LandingLayout>
  );
};

// Root route - shows landing if not logged in, dashboard if logged in
const RootRoute = () => {
  const isAuthenticated = authService.isLoggedIn();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <LandingLayout>
      <LandingPage />
    </LandingLayout>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen">
        <BrowserRouter>
          <Routes>
          {/* Root route - Landing page or redirect to dashboard */}
          <Route 
            path="/" 
            element={<RootRoute />} 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            } 
          />
          
          {/* Protected routes - Dashboard section */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-leads" 
            element={
              <ProtectedRoute>
                <MyLeadsPage />
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

          {/* Dashboard routes - Outreach section */}
          <Route 
            path="/outreach-campaigns" 
            element={
              <ProtectedRoute>
                <OutreachCampaignsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/campaign-details" 
            element={
              <ProtectedRoute>
                <CampaignDetailsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/subsequence" 
            element={
              <ProtectedRoute>
                <SubsequqncePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
};

export default App;