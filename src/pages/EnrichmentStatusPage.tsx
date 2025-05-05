import { useState, useEffect } from 'react';
import { Play, CheckCircle2, ArrowLeft, RefreshCw, LineChart } from 'lucide-react';
import { API_BASE_URL } from "../config/env";
import { useNavigate } from 'react-router-dom';

const EnrichmentStatusPage = () => {
  const navigate = useNavigate();
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
  const [orchestrationJobId, setOrchestrationJobId] = useState<any>(null);
  const [orchestrationStatus, setOrchestrationStatus] = useState<any>(null);
  const [isPolling, setIsPolling] = useState(false);

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
    }
  }, []);

  useEffect(() => {
    let pollingInterval: any;
    
    if (orchestrationJobId && isPolling) {
      pollingInterval = setInterval(() => {
        pollJobStatus(orchestrationJobId);
      }, 30000); // Poll every 30 seconds
    }
    
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [orchestrationJobId, isPolling]);

  useEffect(() => {
    if (sheetDetails.spreadsheetId) {
      handleGetCurrentStatus();
    }
  }, [sheetDetails.spreadsheetId]);

  const handleGetCurrentStatus = async () => {
    if (!sheetDetails.spreadsheetId) return;
    setIsLoading(true);
    const agencyId = localStorage.getItem('userAgencyId');
    try {
      const response = await fetch(`${API_BASE_URL}/google-sheet/get-last-filled-rows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          spreadsheet_url: sheetDetails.sheetUrl,
          agency_id: agencyId,
          sheet_name: sheetDetails.sheetName
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

  // New function to call orchestrator API
  const handleStartOrchestration = async () => {
    if (!sheetDetails.sheetUrl) return;
    
    setIsStartingEnrichment(true);
    
    try {
      // Prepare payload for the orchestration process
      const payload = {
        spreadsheet_url: sheetDetails.sheetUrl,
        sheet_name: sheetDetails.sheetName,
        batch_size: 10,
        process_all: false
      };
      
      // Call the orchestrator API
      const response = await fetch(`${API_BASE_URL}/orchestrator/start`, {
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
      if (data.job_id) {
        setOrchestrationJobId(data.job_id);
        setOrchestrationStatus({
          status: 'running',
          message: 'Orchestration process started. Processing rows...'
        });
        setIsPolling(true);
        // Show success message
        alert('Orchestration process started successfully! You can monitor progress on this page.');
      } else {
        throw new Error('No job ID returned from the API');
      }
      
    } catch (error: any) {
      console.error('Error starting orchestration:', error);
      alert(`Failed to start orchestration process: ${error.message}`);
      setOrchestrationStatus({
        status: 'error',
        message: `Failed to start: ${error.message}`
      });
    } finally {
      setIsStartingEnrichment(false);
    }
  };  

  // Function to poll for job status
  const pollJobStatus = async (jobId: any) => {
    if (!jobId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/orchestrator/status/${jobId}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      // Handle the specific "Job not found" error case
      if (data.detail && data.detail.includes('Job') && data.detail.includes('not found')) {
        setIsPolling(false);
        setOrchestrationStatus({
          status: 'error',
          message: 'Process Abruptly Stopped',
          error: 'The enrichment job is no longer available. It may have been terminated or expired.',
          lastUpdated: new Date().toLocaleTimeString()
        });
        alert('Process Abruptly Stopped. The enrichment job is no longer available.');
        return;
      }
      // Update status in state
      setOrchestrationStatus({
        ...data,
        lastUpdated: new Date().toLocaleTimeString()
      });
      if (data.status === 'completed' || data.status === 'error') {
        setIsPolling(false);
        // Refresh the column status to show the latest data
        handleGetCurrentStatus();
      }
    } catch (error: any) {
      console.error('Error polling job status:', error);
      setOrchestrationStatus((prev: any) => ({
        ...prev,
        error: `Polling error: ${error.message}`,
        lastUpdated: new Date().toLocaleTimeString()
      }));
    }
  };

  const isActuallySuccessful = (step: any) => {
    return step.status === 'success' || (step.error && step.error.includes('Successfully updated'));
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

  // Helper function to render orchestration status
  const renderOrchestrationStatus = () => {
    if (!orchestrationStatus) return null;
    
    const { status, processed_rows, total_rows, row_errors, message, lastUpdated } = orchestrationStatus;
    
    let statusColor = 'bg-gray-100 text-gray-800';
    let statusIcon = <RefreshCw className="h-5 w-5 mr-2" />;
    
    if (status === 'running') {
      statusColor = 'bg-blue-100 text-blue-800';
      statusIcon = (
        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    } else if (status === 'completed') {
      statusColor = 'bg-green-100 text-green-800';
      statusIcon = <CheckCircle2 className="h-5 w-5 mr-2" />;
    } else if (status === 'error') {
      statusColor = 'bg-red-100 text-red-800';
      statusIcon = (
        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    
    return (
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Orchestration Status
        </h2>
        
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <span className={`px-3 py-1 ${statusColor} rounded-full flex items-center text-sm font-medium`}>
              {statusIcon}
              {status === 'running' ? 'Running' : 
               status === 'completed' ? 'Completed' : 
               status === 'error' ? 'Error' : 'Unknown'}
            </span>
            
            {lastUpdated && (
              <span className="ml-4 text-sm text-gray-500">
                Last updated: {lastUpdated}
              </span>
            )}
          </div>
          
          {message && (
            <p className="text-sm text-gray-700 mb-3">
              {message}
            </p>
          )}
          
          {(processed_rows !== undefined && total_rows !== undefined) && (
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress: {processed_rows} of {total_rows} rows</span>
                <span>{Math.round((processed_rows / total_rows) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${Math.round((processed_rows / total_rows) * 100)}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {row_errors && Object.keys(row_errors).length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Errors:</h3>
              <div className="max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-md text-sm">
                {Object.entries(row_errors).map(([row, error]: [any, any]) => (
                  <div key={row} className="mb-2 last:mb-0">
                    <span className="font-semibold">Row {row}:</span> {error}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {orchestrationStatus.progress && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Row Progress:</h3>
              <div className="max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-md text-sm">
                {Object.entries(orchestrationStatus.progress).map(([row, rowData]: [any, any]) => (
                  <div key={row} className="mb-2 last:mb-0 border-b pb-2 last:border-b-0">
                    <span className="font-semibold">Row {row}:</span> 
                  {rowData.steps?.map((step: any, i: any) => {
                    const actualSuccess = isActuallySuccessful(step);
                    return (
                      <span key={i} className="ml-2">
                        {step.step}: 
                        <span className={
                          actualSuccess ? 'text-green-600' : 
                          step.status === 'error' ? 'text-red-600' : 
                          'text-yellow-600'
                        }>
                          {" "}{actualSuccess ? 'success' : step.status}
                          {actualSuccess && step.status === 'error' && ' *'}
                        </span>
                        {i < rowData.steps.length - 1 ? ', ' : ''}
                      </span>
                    );
                  })}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {isPolling && status === 'running' && (
            <div className="mt-4 text-sm text-gray-600">
              <p className="flex items-center">
                <svg className="animate-pulse h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Auto-refreshing status...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <LineChart className="h-8 w-8 text-indigo-600" />
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
            onClick={() => navigate('/sheet-details')}
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
                  Refresh Status
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
                      {column.filledRows !== null ? column.filledRows-1 : '-'}
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
          
          {/* Render Orchestration Status */}
          {renderOrchestrationStatus()}
          
          {/* Start Orchestration Button */}
          {lastFilledInfo && !isPolling && orchestrationStatus?.status !== 'running' && !isLoading && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleStartOrchestration}
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
                    Starting workflow...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Start Workflow
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
  );
};

export default EnrichmentStatusPage;