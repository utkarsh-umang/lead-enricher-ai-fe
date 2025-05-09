import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  PlusCircle, 
  CheckCircle2,
  AlertCircle, 
  ExternalLink,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { getAllSheets } from '../services/sheetService';

const OutreachCampaignsPage = () => {
  const navigate = useNavigate();
  const [sheets, setSheets] = useState<any>([]);
  const [filteredSheets, setFilteredSheets] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch all sheets when component mounts
  useEffect(() => {
    fetchSheets();
  }, []);

  const fetchSheets = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getAllSheets();
    
      const outreachSheets = response.filter(sheet => 
        ['ENRICHMENT_COMPLETED', 'OUTREACH_STARTED', 'COMPLETED'].includes(sheet.status)
      );
      
      setSheets(outreachSheets);
      setFilteredSheets(outreachSheets);
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

  const handleStartOutreach = (sheet: any) => {
    const outreachData = {
      spreadsheetId: sheet.spreadsheetId,
      sheetTitle: sheet.title,
      sheetUrl: sheet.sheetUrl,
      sheetName: sheet.sheetName || 'Sheet1',
      enrichmentColumns: sheet.enrichmentColumns
    };
    
    localStorage.setItem('outreachSheet', JSON.stringify(outreachData));
    navigate('/outreach-setup');
  };

  const handleViewCampaign = (sheet: any) => {
    // Store sheet details in localStorage for the campaign details page
    const campaignData = {
      spreadsheetId: sheet.spreadsheetId,
      sheetTitle: sheet.title,
      sheetUrl: sheet.sheetUrl,
      status: sheet.status
    };
    
    localStorage.setItem('campaignData', JSON.stringify(campaignData));
    
    // Navigate to the campaign details page (to be implemented)
    navigate('/campaign-details');
  };

  // Get status badge based on sheet status
  const getStatusBadge = (status: any) => {
    switch (status) {
      case 'ENRICHMENT_COMPLETED':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md flex items-center w-fit text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Ready for Outreach
          </span>
        );
      case 'OUTREACH_STARTED':
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md flex items-center w-fit text-xs">
            <MessageSquare className="h-3 w-3 mr-1" />
            Campaign Active
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
  const formatDate = (dateString: any) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get campaign metrics (placeholder for now - to be implemented)
  const getCampaignMetrics = (sheet: any) => {
    // This would be replaced with actual metrics from the API
    return {
      sent: Math.floor(Math.random() * 100),
      opened: Math.floor(Math.random() * 50),
      replied: Math.floor(Math.random() * 25),
      bounced: Math.floor(Math.random() * 10)
    };
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <h1 className="text-2xl font-semibold text-gray-900">
                Outreach Campaigns
              </h1>
              <p className="text-gray-600">
                Create and manage your outreach campaigns using enriched data
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
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <LayoutGrid className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sheets ready for outreach</h3>
            <button 
              onClick={() => navigate('/enrichments')}
              className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Go to Enrichments
            </button>
          </div>
        )}
        
        {/* Table of outreach-ready sheets */}
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
                    Leads
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign Metrics
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
                {filteredSheets.map((sheet: any, index: any) => {
                  const metrics = getCampaignMetrics(sheet);
                  return (
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {sheet.totalRows || 'N/A'} leads
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {sheet.status === 'OUTREACH_STARTED' || sheet.status === 'COMPLETED' ? (
                          <div className="flex space-x-4">
                            <div className="text-center">
                              <div className="text-sm font-medium text-gray-900">{metrics.sent}</div>
                              <div className="text-xs text-gray-500">Sent</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-gray-900">{metrics.opened}</div>
                              <div className="text-xs text-gray-500">Opened</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-green-600">{metrics.replied}</div>
                              <div className="text-xs text-gray-500">Replied</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-red-600">{metrics.bounced}</div>
                              <div className="text-xs text-gray-500">Bounced</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 italic">No campaign started</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(sheet.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center space-x-3">
                          {sheet.status === 'ENRICHMENT_COMPLETED' && (
                            <button
                              onClick={() => handleStartOutreach(sheet)}
                              className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                            >
                              <PlusCircle className="h-3 w-3 mr-1" />
                              Start Outreach Generation
                            </button>
                          )}
                          {(sheet.status === 'OUTREACH_STARTED' || sheet.status === 'COMPLETED') && (
                            <button
                              onClick={() => handleViewCampaign(sheet)}
                              className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            >
                              <MessageSquare className="h-3 w-3 mr-1" />
                              View Campaign
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutreachCampaignsPage;