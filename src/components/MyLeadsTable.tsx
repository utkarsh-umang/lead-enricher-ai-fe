import { Download } from 'lucide-react';
import { useTheme } from '../theme';
import { Lead, LeadStatus } from '../data/leads';

interface MyLeadsTableProps {
  leads: Lead[];
  selectedLeads: Set<number>;
  onSelectLead: (leadId: number) => void;
  onSelectAll: () => void;
  currentPage: number;
  totalPages: number;
  totalLeads: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const MyLeadsTable = ({
  leads,
  selectedLeads,
  onSelectLead,
  onSelectAll,
  currentPage,
  totalPages,
  totalLeads,
  itemsPerPage,
  onPageChange
}: MyLeadsTableProps) => {
  const { theme } = useTheme();

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'Email Ready':
        return {
          backgroundColor: `${theme.palette.success.main}20`,
          color: theme.palette.success.main,
          borderColor: `${theme.palette.success.main}40`
        };
      case 'Scraped':
        return {
          backgroundColor: `${theme.palette.warning.main}20`,
          color: theme.palette.warning.main,
          borderColor: `${theme.palette.warning.main}40`
        };
      case 'Pending Scraping':
        return {
          backgroundColor: `${theme.palette.text.disabled}20`,
          color: theme.palette.text.disabled,
          borderColor: `${theme.palette.text.disabled}40`
        };
      default:
        return {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.secondary,
          borderColor: theme.palette.divider
        };
    }
  };

  const allSelected = leads.length > 0 && selectedLeads.size === leads.length;
  const someSelected = selectedLeads.size > 0 && selectedLeads.size < leads.length;

  return (
    <div 
      className="rounded-lg shadow-sm border flex flex-col" 
      style={{ 
        backgroundColor: theme.palette.background.default, 
        borderColor: theme.palette.divider,
        height: 'calc(100vh - 210px)', // Fixed height to fit on screen
      }}
    >
      {/* Table Container with fixed height - only tbody scrolls */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full">
            <thead className="sticky top-0 z-10" style={{ backgroundColor: theme.palette.background.default }}>
              <tr className="border-b" style={{ borderColor: theme.palette.divider }}>
                <th className="text-left py-4 px-6">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={onSelectAll}
                    className="w-4 h-4 rounded"
                    style={{
                      accentColor: theme.palette.primary.main
                    }}
                  />
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: theme.palette.text.secondary }}>
                  Lead Name
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: theme.palette.text.secondary }}>
                  Company
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: theme.palette.text.secondary }}>
                  Email Address
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: theme.palette.text.secondary }}>
                  Source List
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: theme.palette.text.secondary }}>
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: theme.palette.text.secondary }}>
                  Scraped Data
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: theme.palette.text.secondary }}>
                  Generated Copy
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b transition-colors"
                  style={{ borderColor: theme.palette.divider }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.palette.background.paper;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedLeads.has(lead.id)}
                      onChange={() => onSelectLead(lead.id)}
                      className="w-4 h-4 rounded"
                      style={{
                        accentColor: theme.palette.primary.main
                      }}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium" style={{ color: theme.palette.text.primary }}>
                      {lead.leadName}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm" style={{ color: theme.palette.text.secondary }}>
                      {lead.company}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm" style={{ color: theme.palette.text.secondary }}>
                      {lead.emailAddress}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm" style={{ color: theme.palette.text.secondary }}>
                      {lead.sourceList}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium border inline-block"
                      style={getStatusColor(lead.status)}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      disabled={lead.enrichedData.length === 0}
                      onClick={() => {
                        console.log('Showing scraped data for lead:', lead.id, lead.enrichedData);
                      }}
                      className="px-4 py-1 rounded-lg text-sm font-medium transition-colors outline-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: lead.enrichedData.length > 0 ? theme.palette.background.default : theme.palette.background.paper,
                        color: lead.enrichedData.length > 0 ? theme.palette.text.primary : theme.palette.text.disabled,
                        border: `1px solid ${theme.palette.divider}`
                      }}
                      onMouseEnter={(e) => {
                        if (lead.enrichedData.length > 0) {
                          e.currentTarget.style.backgroundColor = theme.palette.background.paper;
                          e.currentTarget.style.borderColor = theme.palette.primary.main;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (lead.enrichedData.length > 0) {
                          e.currentTarget.style.backgroundColor = theme.palette.background.default;
                          e.currentTarget.style.borderColor = theme.palette.divider;
                        }
                      }}
                    >
                      View
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    {lead.hasGeneratedCopy ? (
                      <button
                        className="px-4 py-1 rounded-lg text-sm font-medium transition-colors outline-none focus:outline-none"
                        style={{
                          backgroundColor: theme.palette.background.default,
                          color: theme.palette.text.primary,
                          border: `1px solid ${theme.palette.divider}`
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
                        View
                      </button>
                    ) : (
                      <span className="text-sm" style={{ color: theme.palette.text.disabled }}>
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer - Fixed at bottom */}
      <div className="p-4 border-t flex items-center justify-between flex-shrink-0" style={{ borderColor: theme.palette.divider }}>
        <div className="flex items-center gap-4">
          <div className="text-sm" style={{ color: theme.palette.text.secondary }}>
            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalLeads)} of {totalLeads}
          </div>
          <button
            disabled={selectedLeads.size === 0}
            onClick={() => {
              // Handle download logic here
              console.log('Downloading selected leads:', Array.from(selectedLeads));
            }}
            className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 outline-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: selectedLeads.size > 0 ? theme.palette.primary.main : theme.palette.background.paper,
              color: selectedLeads.size > 0 ? theme.palette.primary.contrastText : theme.palette.text.disabled,
              border: selectedLeads.size > 0 ? 'none' : `1px solid ${theme.palette.divider}`
            }}
            onMouseEnter={(e) => {
              if (selectedLeads.size > 0) {
                e.currentTarget.style.backgroundColor = theme.palette.primary.dark;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedLeads.size > 0) {
                e.currentTarget.style.backgroundColor = theme.palette.primary.main;
              }
            }}
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg border transition-colors outline-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: currentPage === 1 ? theme.palette.background.paper : theme.palette.background.default,
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary
            }}
          >
            {'<'}
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className="px-3 py-1 rounded-lg border transition-colors outline-none focus:outline-none"
                style={{
                  backgroundColor: currentPage === pageNum ? theme.palette.primary.main : theme.palette.background.default,
                  borderColor: currentPage === pageNum ? theme.palette.primary.main : theme.palette.divider,
                  color: currentPage === pageNum ? theme.palette.primary.contrastText : theme.palette.text.primary
                }}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <span className="px-2" style={{ color: theme.palette.text.secondary }}>
              ...
            </span>
          )}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg border transition-colors outline-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: currentPage === totalPages ? theme.palette.background.paper : theme.palette.background.default,
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary
            }}
          >
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyLeadsTable;

