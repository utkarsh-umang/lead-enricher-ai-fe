import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTheme } from '../theme';
import NotificationButton from '../components/NotificationButton';
import KeyMetricsCards from '../components/KeyMetricsCards';
import DashboardTable from '../components/DashboardTable';

const DashboardPage = () => {
  const { theme } = useTheme();
  const [isNewListImportClicked, setIsNewListImportClicked] = useState(false);

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: theme.palette.text.primary }}>
          Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <NotificationButton />
          
          {/* New List Import Button */}
          <button
            className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 outline-none focus:outline-none"
            style={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              outline: isNewListImportClicked ? `2px solid ${theme.palette.primary.main}` : 'none',
              outlineOffset: '2px'
            }}
            onClick={() => setIsNewListImportClicked(!isNewListImportClicked)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.palette.primary.dark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.palette.primary.main;
            }}
          >
            <Plus className="w-4 h-4" style={{ color: theme.palette.primary.contrastText }} />
            New List Import
          </button>
        </div>
      </div>

      <KeyMetricsCards />

      <DashboardTable />
    </div>
  );
};

export default DashboardPage;

