import { useState, useEffect } from 'react';
import { FileSpreadsheet, Play, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';

const EnrichmentStatusPage = () => {
  const [sheetDetails, setSheetDetails] = useState({
    spreadsheetId: '',
    sheetTitle: 'Lead List',
    sheetUrl: '',
    sheetName: 'Sheet1',
    verificationData: null
  });

  const [columnsStatus, setColumnsStatus] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFilledInfo, setLastFilledInfo] = useState<any>(null);
  const [isStartingEnrichment, setIsStartingEnrichment] = useState(false);

  useEffect(() => {
    // Retrieve sheet details from localStorage
    const storedEnrichmentSheet = localStorage.getItem('enrichmentReadySheet');
    
    if (storedEnrichmentSheet) {
      try {
        const parsedDetails = JSON.parse(storedEnrichmentSheet);
        setSheetDetails(parsedDetails);
        
        // If we have verification data with headers, initialize column status
        if (parsedDetails.verificationData && parsedDetails.verificationData.found_headers) {
          const initialColumnsStatus = parsedDetails.verificationData.found_headers.map((header: any) => ({
            column: header,
            filledRows: null,
            status: 'pending' // 'pending', 'complete', 'in-progress'
          }));
          setColumnsStatus(initialColumnsStatus);
        }
      } catch (error) {
        console.error('Error parsing stored enrichment sheet details:', error);
      }
    } else {
      // Redirect to home page if no data is available
      window.location.href = '/';
    }
  }, []);

  const handleGetCurrentStatus = async () => {
    if (!sheetDetails.spreadsheetId) return;
    
    setIsLoading(true);
    
    try {
      // Make the API call to get last filled rows
      const response = await fetch('http://localhost:8000/google-sheet/get-last-filled-rows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          spreadsheet_url: sheetDetails.sheetUrl,
          sheet_name: sheetDetails.sheetName,
          use_version: "v2"
        })
      });
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      // Transform the API response to our column status format
      const lastFilledRows = data.last_filled_rows;
      const columnPositions = data.column_positions;
      const totalRows = data.total_rows;
      
      // Get all column names in their correct order based on column_positions
      const orderedColumns = Object.entries(columnPositions)
        .sort((a: any, b: any) => a[1] - b[1])
        .map(entry => entry[0]);
      
      const statusData = orderedColumns.map(columnName => {
        const filledRows = lastFilledRows[columnName]?.last_row || 0;
        let status = 'pending';
        
        if (filledRows > 0) {
          status = filledRows === totalRows ? 'complete' : 'in-progress';
        }
        
        return {
          column: columnName,
          filledRows: filledRows,
          status: status
        };
      });
      
      setColumnsStatus(statusData);
      
      // Determine source columns (first 7 in this case based on your description)
      // and find the max filled row among them
      const sourceColumns = orderedColumns.slice(0, 7);
      const sourceLastRow = Math.max(...sourceColumns.map(col => lastFilledRows[col]?.last_row || 0));
      
      // Set the last filled info
      setLastFilledInfo({
        lastFilledRow: sourceLastRow,
        lastFilledColumns: orderedColumns
          .filter(col => lastFilledRows[col]?.last_row === sourceLastRow)
          .map(col => col)
      });
      
    } catch (error: any) {
      console.error('Error getting enrichment status:', error);
      alert(`Failed to get status: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEnrichment = async () => {
    if (!lastFilledInfo) return;
    
    setIsStartingEnrichment(true);
    
    try {
      // Get data from columnsStatus to construct the last_filled_info
      const columnLastFilled: any = {};
      columnsStatus.forEach((column: any) => {
        columnLastFilled[column.column] = {
          last_row: column.filledRows
        };
      });
      
      // Prepare payload for the enrichment process
      const payload = {
        spreadsheet_url: sheetDetails.sheetUrl,
        sheet_name: sheetDetails.sheetName,
        last_filled_info: columnLastFilled
      };
      
      console.log('Starting enrichment with payload:', payload);
      
      // API call to start the enrichment process
      const response = await fetch('http://localhost:8000/google-sheet/start-enrichment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Enrichment started:', data);
      
      // Show success message or redirect to a progress tracking page
      alert('Enrichment process started successfully! You can monitor progress on this page.');
      
      // Refresh the status after starting enrichment
      setTimeout(() => {
        handleGetCurrentStatus();
      }, 3000);
      
    } catch (error: any) {
      console.error('Error starting enrichment:', error);
      alert(`Failed to start enrichment process: ${error.message}`);
    } finally {
      setIsStartingEnrichment(false);
    }
  };

  const getCellBackgroundColor = (column: any, index: any) => {
    if (!column.filledRows) return 'bg-gray-50';
    
    // Check if this is a source column (first 7 columns based on API response)
    const isSourceColumn = index < 7;
    
    if (isSourceColumn) return 'bg-blue-50';
    
    // Other columns are enrichment data
    if (column.status === 'complete') return 'bg-green-50';
    if (column.filledRows > 0) return 'bg-yellow-50';
    return 'bg-gray-50';
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <FileSpreadsheet className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Enrichment Status
                </h1>
                <p className="text-gray-600">
                  View and manage enrichment progress for your lead list
                </p>
              </div>
            </div>
            <button 
              onClick={() => {
                // Simple navigation back to sheet details page
                window.location.href = '/sheet-details';
              }}
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sheet Details
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Sheet Name</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {sheetDetails.sheetTitle}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Sheet URL</dt>
                <dd className="mt-1 text-sm text-gray-600 break-all">
                  {sheetDetails.sheetUrl}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Column Status
                </h2>
                <p className="text-gray-600 mt-1">
                  Check which columns have been enriched and how many rows are processed
                </p>
              </div>
              <button
                onClick={handleGetCurrentStatus}
                disabled={isLoading}
                className={`flex items-center px-6 py-3 ${
                  isLoading 
                    ? "bg-indigo-400 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white rounded-lg transition-colors`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Status...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Get Current Status
                  </>
                )}
              </button>
            </div>
            
            {/* Columns Status Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Column Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Filled Rows
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {columnsStatus.map((column: any, index: any) => (
                    <tr key={index} className={getCellBackgroundColor(column, index)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {column.column}
                        {index < 7 && <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">Source</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {column.filledRows !== null ? column.filledRows : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {column.status === 'complete' && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md flex items-center w-fit">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Complete
                          </span>
                        )}
                        {column.status === 'in-progress' && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md flex items-center w-fit">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            In Progress
                          </span>
                        )}
                        {column.status === 'pending' && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md flex items-center w-fit">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Start Enrichment Button */}
            {lastFilledInfo && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleStartEnrichment}
                  disabled={isStartingEnrichment}
                  className={`flex items-center px-6 py-3 ${
                    isStartingEnrichment 
                      ? "bg-green-400 cursor-not-allowed" 
                      : "bg-green-600 hover:bg-green-700"
                  } text-white rounded-lg transition-colors`}
                >
                  {isStartingEnrichment ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Starting Enrichment...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Start Enrichment Process
                    </>
                  )}
                </button>
              </div>
            )}
            
            {/* Explanation of the Table */}
            <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Understanding Column Status:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-blue-50 border border-blue-100 rounded mr-2"></div>
                  <span><strong>Source columns:</strong> The first 7 columns containing your original lead data.</span>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-50 border border-green-100 rounded mr-2"></div>
                  <span><strong>Complete columns:</strong> Enrichment data that has been fully processed.</span>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-50 border border-yellow-100 rounded mr-2"></div>
                  <span><strong>In Progress columns:</strong> Enrichment is partially complete for these columns.</span>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded mr-2"></div>
                  <span><strong>Pending columns:</strong> No enrichment has been started for these columns.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrichmentStatusPage;