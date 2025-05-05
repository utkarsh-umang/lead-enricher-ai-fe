import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, 
  ArrowRight, 
  Play, 
  CheckCircle2,
  AlertCircle, 
  ExternalLink,
  RefreshCw,
  Search
} from 'lucide-react';
import { getAllSheets } from '../services/sheetService';

const EnrichmentsLandingPage = () => {
  const navigate = useNavigate();
  const [sheets, setSheets] = useState<any[]>([]);
  const [filteredSheets, setFilteredSheets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch all sheets when component mounts
  useEffect(() => {
    fetchSheets();
  }, []);

  // Filter sheets when search term changes
  useEffect(() => {
    if (sheets.length > 0) {
      const filtered = sheets.filter(sheet => 
        sheet.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSheets(filtered);
    }
  }, [searchTerm, sheets]);

  const fetchSheets = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getAllSheets();
      
      // Filter out sheets with 'CONNECTED' or 'NO_ACCESS' status
      const enrichmentSheets = response.filter(sheet => 
        sheet.status !== 'CONNECTED' && sheet.status !== 'NO_ACCESS'
      );
      
      setSheets(enrichmentSheets);
      setFilteredSheets(enrichmentSheets);
    } catch (error: any) {
      console.error('Error fetching sheets:', error);
      setError('Failed to load sheets. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSheets();
    setIsRefreshing(false);
  };

  const handleViewEnrichmentStatus = (sheet: any) => {
    // Store sheet details in localStorage for the enrichment status page
    const enrichmentData = {
      spreadsheetId: sheet.spreadsheetId,
      sheetTitle: sheet.title,
      sheetUrl: sheet.sheetUrl,
      sheetName: sheet.sheetName || 'Sheet1',
      verificationData: sheet.verificationData
    };
    
    localStorage.setItem('enrichmentReadySheet', JSON.stringify(enrichmentData));
    
    // Navigate to the enrichment status page
    navigate('/enrichment-status');
  };

  // Get status badge based on sheet status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ENRICHMENT_STARTED':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md flex items-center w-fit text-xs">
            <svg className="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            In Progress
          </span>
        );
      case 'ENRICHMENT_COMPLETED':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md flex items-center w-fit text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </span>
        );
      case 'OUTREACH_STARTED':
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md flex items-center w-fit text-xs">
            <svg className="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Outreach Active
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md flex items-center w-fit text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            All Completed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md flex items-center w-fit text-xs">
            <AlertCircle className="h-3 w-3 mr-1" />
            {status.replace(/_/g, ' ')}
          </span>
        );
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Show selected columns formatted nicely
  const renderSelectedColumns = (sheet: any) => {
    if (!sheet.enrichmentColumns || sheet.enrichmentColumns.length === 0) {
      return <span className="text-gray-400 text-xs italic">No columns selected</span>;
    }
    
    // If there are more than 3 columns, show first 3 + count
    const columns = sheet.enrichmentColumns;
    if (columns.length <= 3) {
      return (
        <div className="flex flex-wrap gap-1">
          {columns.map((column: string, index: number) => (
            <span key={index} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
              {column}
            </span>
          ))}
        </div>
      );
    } else {
      return (
        <div>
          <div className="flex flex-wrap gap-1 mb-1">
            {columns.slice(0, 3).map((column: string, index: number) => (
              <span key={index} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
                {column}
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-500">+{columns.length - 3} more</span>
        </div>
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <LineChart className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <h1 className="text-2xl font-semibold text-gray-900">
                Enrichments
              </h1>
              <p className="text-gray-600">
                Manage and track your lead enrichment processes
              </p>
            </div>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`flex items-center px-4 py-2 ${
              isRefreshing 
                ? "bg-indigo-400 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white rounded-lg transition-colors`}
          >
            {isRefreshing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </button>
        </div>
        
        {/* Search and filters */}
        <div className="mb-6 relative">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sheet name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        {/* Loading state */}
        {isLoading && !isRefreshing && (
          <div className="flex items-center justify-center py-10">
            <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {!isLoading && filteredSheets.length === 0 && !error && (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
            <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No enrichment sheets found</h3>
            {searchTerm ? (
              <p className="text-gray-500">No sheets match your search. Try a different term or clear the search.</p>
            ) : (
              <p className="text-gray-500">
                You don't have any sheets in the enrichment process.
                <br />
                Connect a sheet and start the enrichment process from the Connected Sheets section.
              </p>
            )}
            <button 
              onClick={() => navigate('/')}
              className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Go to Connected Sheets
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        )}
        
        {/* Table of enrichment sheets */}
        {!isLoading && filteredSheets.length > 0 && !error && (
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sheet Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrichment Columns
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSheets.map((sheet, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {sheet.title}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <a 
                              href={sheet.sheetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                            >
                              View in Google Sheets
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(sheet.status)}
                    </td>
                    <td className="px-6 py-4">
                      {renderSelectedColumns(sheet)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>{sheet.enrichmentProgress || 0}%</span>
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
                              sheet.status === 'ENRICHMENT_COMPLETED' || sheet.status === 'COMPLETED'
                                ? 'bg-green-600'
                                : 'bg-blue-600'
                            }`}
                            style={{ width: `${sheet.enrichmentProgress || 0}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(sheet.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-3">
                        <button
                          onClick={() => handleViewEnrichmentStatus(sheet)}
                          className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          {sheet.status === 'ENRICHMENT_STARTED' ? (
                            <>
                              <Play className="h-3 w-3 mr-1" />
                              Resume
                            </>
                          ) : (
                            <>
                              <LineChart className="h-3 w-3 mr-1" />
                              View Status
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrichmentsLandingPage;