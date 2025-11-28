import { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { useTheme } from '../theme';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  businessWebsite?: string;
  scrapeStatus: 'Success' | 'Pending' | 'Failed';
  emailStatus: 'Drafted' | null;
}

interface CampaignLeadsTableProps {
  leads: Lead[];
  isScrapingStarted?: boolean;
  isEmailGenerationStarted?: boolean;
  onViewEdit?: (leadId: string) => void;
  onRetry?: (leadId: string) => void;
  onViewScrapingInfo?: (leadId: string) => void;
  onViewGeneratedEmail?: (leadId: string) => void;
}

const CampaignLeadsTable = ({ 
  leads, 
  isScrapingStarted = false,
  isEmailGenerationStarted = false,
  onViewScrapingInfo,
  onViewGeneratedEmail
}: CampaignLeadsTableProps) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;

  // Filter leads based on search query
  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.businessWebsite?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const startIndex = (currentPage - 1) * leadsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + leadsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">

      {/* Search and Filter */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: theme.palette.divider,
              backgroundColor: theme.palette.background.default
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = theme.palette.primary.main;
              e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.palette.primary.main}40`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = theme.palette.divider;
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2"
          style={{
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.background.default
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = theme.palette.primary.main;
            e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.palette.primary.main}40`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = theme.palette.divider;
            e.currentTarget.style.boxShadow = 'none';
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.palette.background.paper;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.palette.background.default;
          }}
        >
          <Filter className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filter</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="max-h-[43vh] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Lead Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Business Website
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Scraping Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Generated Email
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {paginatedLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lead.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lead.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {lead.businessWebsite ? (
                      <a 
                        href={lead.businessWebsite} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 hover:underline"
                      >
                        {lead.businessWebsite}
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isScrapingStarted ? (
                    <button
                      onClick={() => onViewScrapingInfo?.(lead.id)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors outline-none focus:outline-none"
                      style={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        border: 'none',
                        outline: 'none',
                        outlineOffset: '2px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.palette.primary.dark;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme.palette.primary.main;
                      }}
                    >
                      View
                    </button>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isEmailGenerationStarted ? (
                    <button
                      onClick={() => onViewGeneratedEmail?.(lead.id)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors outline-none focus:outline-none"
                      style={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        border: 'none',
                        outline: 'none',
                        outlineOffset: '2px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.palette.primary.dark;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme.palette.primary.main;
                      }}
                    >
                      View
                    </button>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <span className="px-3 py-2 text-sm text-gray-700">
            {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronsRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CampaignLeadsTable;

