import Navbar from './components/Navbar';
import ConnectPage from './pages/ConnectPage';
import SheetDetailsPage from './pages/SheetDetailsPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ConnectPage />
      <SheetDetailsPage />
    </div>
  );
}

export default App;