import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTheme } from '../theme';
import NotificationButton from '../components/NotificationButton';
import KeyMetricsCards from '../components/KeyMetricsCards';
import DashboardTable from '../components/DashboardTable';
import ImportLeadListModal from '../components/ImportLeadListModal';

const DashboardPage = () => {
  const { theme } = useTheme();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

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
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 outline-none focus:outline-none"
            style={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText
            }}
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

      {/* Import Lead List Modal */}
      <ImportLeadListModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={async (file: File, source: string, campaignName: string) => {
          setIsImporting(true);
          try {
            // TODO: Implement actual import logic here
            console.log('Importing file:', file.name, 'Source:', source, 'Campaign:', campaignName);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Close modal after successful import
            setIsImportModalOpen(false);
            // You can add a success notification here
          } catch (error) {
            console.error('Error importing leads:', error);
            // You can add an error notification here
          } finally {
            setIsImporting(false);
          }
        }}
        isLoading={isImporting}
      />
    </div>
  );
};

export default DashboardPage;

