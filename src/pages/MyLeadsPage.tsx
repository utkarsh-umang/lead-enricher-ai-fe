import { useState, useMemo } from 'react';
import { Search, ChevronDown, Plus } from 'lucide-react';
import { useTheme } from '../theme';
import NotificationButton from '../components/NotificationButton';
import MyLeadsTable from '../components/MyLeadsTable';
import ImportLeadListModal from '../components/ImportLeadListModal';
import { getLeadsSortedByRecent } from '../data/leads';

const MyLeadsPage = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const itemsPerPage = 50;

  // Get sorted leads (most recent first)
  const sortedLeads = useMemo(() => getLeadsSortedByRecent(), []);

  // Filter leads based on search query
  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) {
      return sortedLeads;
    }
    const query = searchQuery.toLowerCase();
    return sortedLeads.filter(
      (lead) =>
        lead.leadName.toLowerCase().includes(query) ||
        lead.company.toLowerCase().includes(query) ||
        lead.emailAddress.toLowerCase().includes(query)
    );
  }, [searchQuery, sortedLeads]);

  // Paginate leads
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLeads, currentPage]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  const handleSelectLead = (leadId: number) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedLeads.size === paginatedLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(paginatedLeads.map((lead) => lead.id)));
    }
  };

  const handleImport = async (file: File, source: string, campaignName: string) => {
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
  };

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold" style={{ color: theme.palette.text.primary }}>
          My Leads
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

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
            style={{ color: theme.palette.text.disabled }}
          />
          <input
            type="text"
            placeholder="Search by name, company, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border outline-none focus:outline-none"
            style={{
              backgroundColor: theme.palette.background.default,
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = theme.palette.primary.main;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = theme.palette.divider;
            }}
          />
        </div>
        <button
          className="px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors outline-none focus:outline-none"
          style={{
            backgroundColor: theme.palette.background.default,
            borderColor: theme.palette.divider,
            color: theme.palette.text.primary
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.palette.background.paper;
            e.currentTarget.style.borderColor = theme.palette.primary.main;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.palette.background.default;
            e.currentTarget.style.borderColor = theme.palette.divider;
          }}
        >
          Filter by Status/Source
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Leads Table */}
      <MyLeadsTable
        leads={paginatedLeads}
        selectedLeads={selectedLeads}
        onSelectLead={handleSelectLead}
        onSelectAll={handleSelectAll}
        currentPage={currentPage}
        totalPages={totalPages}
        totalLeads={filteredLeads.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Import Lead List Modal */}
      <ImportLeadListModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
        isLoading={isImporting}
      />
    </div>
  );
};

export default MyLeadsPage;

