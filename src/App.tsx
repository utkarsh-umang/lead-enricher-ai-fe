import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import UploadView from './pages/UploadView/Upload';
import BatchDetails from './pages/BatchDetails/BatchDetails';
import './App.css';

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadView />} />
          <Route path="/batch/:batchId" element={<BatchDetails />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;