import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileSpreadsheet, 
  ExternalLink, 
  PlusCircle,
  Loader,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { getConnectedSheets, SheetStatus } from '../services/sheetService';

const ConnectedSheetsPage = () => {
  const [sheets, setSheets] = useState<SheetStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Fetch connected sheets on component mount
  useEffect(() => {
    fetchConnectedSheets();
  }, []);
  
  const fetchConnectedSheets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getConnectedSheets();
      setSheets(data.sheets || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleConnectNew = () => {
    navigate('/connect');
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'NO_ACCESS':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'ENRICHMENT_STARTED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ENRICHMENT_COMPLETED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'OUTREACH_STARTED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return 'Connected';
      case 'NO_ACCESS':
        return 'No Access';
      case 'ENRICHMENT_STARTED':
        return 'Enrichment Started';
      case 'ENRICHMENT_COMPLETED':
        return 'Enrichment Completed';
      case 'OUTREACH_STARTED':
        return 'Outreach Started';
      case 'COMPLETED':
        return 'Completed';
      default:
        return status;
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const handleRefresh = () => {
    fetchConnectedSheets();
  };
  
  const handleViewSheetDetails = (sheet: SheetStatus) => {
    // Navigate to sheet details page with state containing the sheet data
    navigate('/sheet-details', { 
      state: { 
        sheetData: {
          spreadsheetId: sheet.sheet_id,
          title: sheet.sheet_name,
          sheetUrl: sheet.sheet_url,
          status: sheet.status,
          createdAt: sheet.created_at,
          updatedAt: sheet.updated_at
        } 
      } 
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Your Connected Sheets
        </h1>
        <p className="text-lg text-gray-600">
          View and manage your Google Sheets connections
        </p>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="text-center py-16">
          <Loader className="h-10 w-10 text-indigo-600 mx-auto animate-spin" />
          <p className="mt-4 text-gray-600">Loading your connected sheets...</p>
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h3 className="mt-4 text-xl font-medium text-gray-900">Error Loading Sheets</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      )}
      
      {/* Empty state */}
      {!loading && !error && sheets.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-xl font-medium text-gray-900">No sheets connected yet</h3>
          <p className="mt-2 text-gray-600">Get started by connecting your first Google Sheet</p>
          <button
            onClick={handleConnectNew}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Connect New Sheet
          </button>
        </div>
      )}
      
      {/* Connected sheets grid */}
      {!loading && !error && sheets.length > 0 && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sheets.map((sheet) => (
              <div 
                key={sheet.sheet_id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-indigo-50 p-2 rounded-md">
                        <FileSpreadsheet className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900 truncate max-w-[180px]" title={sheet.sheet_name}>
                          {sheet.sheet_name || 'Untitled Sheet'}
                        </h3>
                        <p className="text-xs text-gray-500 truncate max-w-[180px]" title={sheet.sheet_url}>
                          {new URL(sheet.sheet_url).hostname}
                        </p>
                      </div>
                    </div>
                    <div className={clsx(
                      "px-2.5 py-1 rounded-full text-xs font-medium border",
                      getStatusColor(sheet.status)
                    )}>
                      {getStatusText(sheet.status)}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Sheet ID: <span className="font-mono">{sheet.sheet_id.substring(0, 10)}...</span></p>
                    <div className="flex justify-between mt-2">
                      <p>Created: {formatDate(sheet.created_at)}</p>
                      <p>Updated: {formatDate(sheet.updated_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
                    <a
                      href={sheet.sheet_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Open Sheet
                    </a>
                    <button
                      onClick={() => handleViewSheetDetails(sheet)}
                      className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View Details
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add new sheet card */}
            <div 
              onClick={handleConnectNew}
              className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="bg-indigo-50 p-3 rounded-full mb-4">
                <PlusCircle className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Connect New Sheet</h3>
              <p className="text-sm text-gray-500">
                Add another Google Sheet to enrich more leads
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8 flex justify-between items-center">
            <div>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
            <p className="text-sm text-gray-500">
              {sheets.length} {sheets.length === 1 ? 'sheet' : 'sheets'} connected
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectedSheetsPage;