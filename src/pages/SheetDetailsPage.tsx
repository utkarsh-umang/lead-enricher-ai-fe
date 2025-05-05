import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileSpreadsheet, Play, CheckCircle2, AlertCircle, ArrowLeft, ExternalLink, Check } from 'lucide-react';
import { verifySheetColumns, updateSheetStatus, VerificationResult, selectEnrichmentColumns, getSheetInfo } from '../services/sheetService';

interface SheetData {
  spreadsheetId: string;
  title: string;
  sheetUrl: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

// Component to show enrichment columns
const EnrichmentColumnsDisplay = ({ 
  isLoading, 
  error, 
  columns, 
  onViewStatus, //@ts-ignore
  onModify 
}: { 
  isLoading: boolean, 
  error: string | null, 
  columns: string[], 
  onViewStatus: () => void, 
  onModify: () => void 
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-3">
        <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }
  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }
  if (!columns || columns.length === 0) {
    return <p className="text-sm text-blue-700">No columns have been selected for enrichment yet.</p>;
  }
  return (
    <>
      <div className="flex flex-wrap gap-2 mt-2">
        {columns.map((column: string) => (
          <span key={column} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            {column}
          </span>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <button 
          className="text-sm px-3 py-1 bg-white border border-blue-300 text-blue-700 rounded hover:bg-blue-50 transition-colors"
          onClick={onViewStatus}
        >
          View Enrichment Status
        </button>
        {/* <button 
          className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={onModify}
        >
          Modify Selections
        </button> */}
      </div>
    </>
  );
};

const SheetDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sheetDetails, setSheetDetails] = useState({
    spreadsheetId: '',
    title: 'Lead List',
    sheetUrl: '',
    selectedSheet: 'Sheet1',
    agencyId: '',
    status: 'CONNECTED',
    createdAt: '',
    updatedAt: ''
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [showColumnSelection, setShowColumnSelection] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [isSubmittingColumns, setIsSubmittingColumns] = useState(false);
  const [columnSubmitError, setColumnSubmitError] = useState<string | null>(null);
  const [enrichmentInfo, setEnrichmentInfo] = useState<any>(null);
  const [isLoadingEnrichmentInfo, setIsLoadingEnrichmentInfo] = useState(false);
  const [enrichmentInfoError, setEnrichmentInfoError] = useState<string | null>(null);

  // Fetch enrichment info if the sheet is already in ENRICHMENT_STARTED status
  const fetchEnrichmentInfo = async (spreadsheetId: string, status: string) => {
    if (!spreadsheetId) return;
    setIsLoadingEnrichmentInfo(true);
    setEnrichmentInfoError(null);
    try {
      const info = await getSheetInfo(spreadsheetId);
      setEnrichmentInfo(info);
      // If we have enrichment columns already and the sheet is in ENRICHMENT_STARTED status,
      if (info?.success && info?.enrichment_columns && info.enrichment_columns.length > 0 && status === "ENRICHMENT_STARTED") {
        setSelectedColumns(info.enrichment_columns);
      }
    } catch (error: any) {
      console.error("Failed to fetch enrichment info:", error);
      setEnrichmentInfoError(error.message || "Failed to load enrichment information");
    } finally {
      setIsLoadingEnrichmentInfo(false);
    }
  };

  useEffect(() => {
    // Get agency ID from localStorage
    const agencyId = localStorage.getItem('userAgencyId');
    if (!agencyId) {
      console.error('Agency ID not found. Please log in again.');
      navigate('/login');
      return;
    }
    // Check if sheet data was passed via navigation state
    if (location.state?.sheetData) {
      const { sheetData } = location.state as { sheetData: SheetData };
      // Set sheet details from navigation state
      const sheetStatus = sheetData.status || 'CONNECTED';
      setSheetDetails({
        spreadsheetId: sheetData.spreadsheetId || '',
        title: sheetData.title || 'Lead List',
        sheetUrl: sheetData.sheetUrl || '',
        selectedSheet: 'Sheet1', // Default to Sheet1
        agencyId: agencyId,
        status: sheetStatus,
        createdAt: sheetData.createdAt || '',
        updatedAt: sheetData.updatedAt || ''
      });
      if (sheetStatus === "ENRICHMENT_STARTED" && sheetData.spreadsheetId) {
        fetchEnrichmentInfo(sheetData.spreadsheetId, sheetStatus);
      }
    } else {
      // If no sheet data was provided, redirect back
      console.error('No sheet data provided');
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleVerifyColumns = async () => {
    if (!sheetDetails.spreadsheetId || !sheetDetails.sheetUrl) {
      console.error('Missing required data: spreadsheetId or sheetUrl');
      return;
    }
    setIsVerifying(true);
    setVerificationResult(null);
    setShowColumnSelection(false);
    try {
      // Use the service function to verify columns
      const result = await verifySheetColumns(
        sheetDetails.sheetUrl, 
        sheetDetails.selectedSheet
      );
      setVerificationResult(result);
    } catch (error: any) {
      console.error('Error in handleVerifyColumns:', error);
      setVerificationResult({
        valid: false,
        message: `Failed to verify columns: ${error.message}`,
        error: error.message
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleShowColumnSelection = () => {
    // Columns that should NOT be available for enrichment selection
    const columnsToExclude = [
      "Name",
      "Last Name",
      "Website Link",
      "LinkedIn",
      "Email",
      "Podcast Name",
      "Episode Link",
      "Custom Outreach Message"
    ];
    // Determine which columns to use for selection
    let availableColumns: any[] = [];
    if (verificationResult?.required_columns && verificationResult.required_columns.length > 0) {
      availableColumns = verificationResult.required_columns;
    } else if (verificationResult?.found_headers && verificationResult.found_headers.length > 0) {
      availableColumns = verificationResult.found_headers.filter(header => header && header.trim() !== "");
    }
    // Filter out columns that aren't available for enrichment
    availableColumns = availableColumns.filter(column => !columnsToExclude.includes(column));
    // If we're in ENRICHMENT_STARTED status and have existing selections, use those
    if (sheetDetails.status === "ENRICHMENT_STARTED" && enrichmentInfo?.success && enrichmentInfo?.enrichment_columns && enrichmentInfo.enrichment_columns.length > 0) {
    } else {
      // Reset selected columns state for new selection
      setSelectedColumns([]);
    }
    setShowColumnSelection(true);
  };

  const handleColumnToggle = (column: string) => {
    setSelectedColumns(prev => {
      if (prev.includes(column)) {
        return prev.filter(col => col !== column);
      } else {
        return [...prev, column];
      }
    });
  };

  const handleSubmitEnrichmentColumns = async () => {
    if (selectedColumns.length === 0) {
      setColumnSubmitError("Please select at least one column for enrichment");
      return;
    }

    setIsSubmittingColumns(true);
    setColumnSubmitError(null);

    try {
      // Call the API to save selected enrichment columns
      const enrichmentResult = await selectEnrichmentColumns(
        sheetDetails.spreadsheetId,
        selectedColumns
      );
      if (enrichmentResult) {
        console.info("Columns Succesfully Selected!");
      }
      // Update sheet status - pass the sheet name as well
      const statusResult = await updateSheetStatus(
        sheetDetails.sheetUrl, 
        "ENRICHMENT_STARTED",
        sheetDetails.selectedSheet
      );
      if (statusResult) {
        console.info("Status Updated!");
      }
      // Save enrichment-ready sheet details to localStorage for the next page
      const enrichmentData = {
        spreadsheetId: sheetDetails.spreadsheetId,
        sheetTitle: sheetDetails.title,
        sheetUrl: sheetDetails.sheetUrl,
        sheetName: sheetDetails.selectedSheet,
        agencyId: sheetDetails.agencyId,
        verificationData: verificationResult,
        enrichmentColumns: selectedColumns
      };
      localStorage.setItem('enrichmentReadySheet', JSON.stringify(enrichmentData));
      // Redirect to enrichment status page
      navigate('/enrichment-status');
    } catch (error: any) {
      console.error('Failed to submit enrichment columns:', error);
      setColumnSubmitError(error.message || "Failed to save enrichment columns");
    } finally {
      setIsSubmittingColumns(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
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

  // Status indicator display based on sheet status
  const renderStatusIndicator = () => {
    const statusColors: Record<string, {bg: string, text: string, icon: JSX.Element}> = {
      "NO_ACCESS": {
        bg: "bg-red-100",
        text: "text-red-600",
        icon: <AlertCircle className="h-5 w-5 text-red-600" />
      },
      "CONNECTED": {
        bg: "bg-green-100", 
        text: "text-green-600",
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />
      },
      "ENRICHMENT_STARTED": {
        bg: "bg-blue-100",
        text: "text-blue-600",
        icon: <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
      },
      "ENRICHMENT_COMPLETED": {
        bg: "bg-purple-100",
        text: "text-purple-600",
        icon: <CheckCircle2 className="h-5 w-5 text-purple-600" />
      },
      "OUTREACH_STARTED": {
        bg: "bg-indigo-100",
        text: "text-indigo-600",
        icon: <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
      },
      "COMPLETED": {
        bg: "bg-emerald-100",
        text: "text-emerald-600",
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />
      }
    };

    const status = sheetDetails.status;
    const statusConfig = statusColors[status] || statusColors["CONNECTED"];
    
    return (
      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusConfig.bg}`}>
        {statusConfig.icon}
        <span className={`font-medium ${statusConfig.text}`}>{status.replace(/_/g, ' ')}</span>
      </div>
    );
  };

  // Render enrichment column selection UI
  const renderColumnSelectionUI = () => {
    // Columns that should NOT be available for enrichment selection
    const columnsToExclude = [
      "Name",
      "Last Name",
      "Website Link",
      "LinkedIn",
      "Email",
      "Podcast Name",
      "Episode Link"
    ];
    // Determine which columns to use for selection
    // First check required_columns, then found_headers
    let availableColumns: any[] = [];
    if (verificationResult?.required_columns && verificationResult.required_columns.length > 0) {
      // For invalid sheets, use required_columns as they represent the expected structure
      availableColumns = verificationResult.required_columns;
    } else if (verificationResult?.found_headers && verificationResult.found_headers.length > 0) {
      // For valid sheets, the API returns found_headers but may not include required_columns
      availableColumns = verificationResult.found_headers.filter(header => header && header.trim() !== "");
    }
    // Filter out the columns that are not available for enrichment
    availableColumns = availableColumns.filter(column => !columnsToExclude.includes(column));
    if (availableColumns.length === 0) {
      return (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
          <p className="text-yellow-700">No columns available for selection. This may be due to missing data in the verification response.</p>
          <p className="text-yellow-700 mt-2">Please try verifying the columns again.</p>
        </div>
      );
    }
    // Use available columns to render selection options
    return (
      <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Columns for Enrichment</h3>
        <p className="text-gray-600 mb-6">
          Choose which columns you want to enrich with AI-generated content. Select at least one column.
        </p>
        {columnSubmitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md">
            <p className="text-sm text-red-700">{columnSubmitError}</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {availableColumns.map((column) => (
            <div 
              key={column}
              onClick={() => handleColumnToggle(column)}
              className={`
                flex items-center justify-between px-4 py-3 rounded-md cursor-pointer
                ${selectedColumns.includes(column) 
                  ? 'bg-indigo-50 border border-indigo-200' 
                  : 'bg-white border border-gray-200 hover:bg-gray-50'}
              `}
            >
              <span className="text-sm font-medium text-gray-800">{column}</span>
              <div className={`
                flex items-center justify-center w-6 h-6 rounded-full
                ${selectedColumns.includes(column) 
                  ? 'bg-indigo-600' 
                  : 'bg-gray-200'}
              `}>
                {selectedColumns.includes(column) ? (
                  <Check className="h-4 w-4 text-white" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <button 
            onClick={() => setShowColumnSelection(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmitEnrichmentColumns}
            disabled={isSubmittingColumns || selectedColumns.length === 0}
            className={`
              flex items-center px-6 py-2 
              ${selectedColumns.length === 0 
                ? 'bg-indigo-300 cursor-not-allowed' 
                : isSubmittingColumns 
                  ? 'bg-indigo-400 cursor-wait' 
                  : 'bg-indigo-600 hover:bg-indigo-700'} 
              text-white rounded-md transition-colors
            `}
          >
            {isSubmittingColumns ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Continue to Enrichment
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-row items-center mb-6">
          <button 
            onClick={handleGoBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-medium text-gray-900">Back to Sheets</h1>
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <FileSpreadsheet className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <h1 className="text-2xl font-semibold text-gray-900">
                {sheetDetails.title}
              </h1>
              <p className="text-gray-600">
                Connected Google Sheet information and workflow controls
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {renderStatusIndicator()}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Sheet Name</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">
                {sheetDetails.title}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Sheet URL</dt>
              <dd className="mt-1 text-sm text-gray-600 break-all flex items-center">
                <a href={sheetDetails.sheetUrl} target="_blank" rel="noopener noreferrer" 
                   className="text-indigo-600 hover:text-indigo-800 inline-flex items-center">
                  {sheetDetails.sheetUrl}
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(sheetDetails.createdAt)}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(sheetDetails.updatedAt)}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Sheet ID</dt>
              <dd className="mt-1 text-sm font-mono text-gray-900">
                {sheetDetails.spreadsheetId}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Current Sheet</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {sheetDetails.selectedSheet}
              </dd>
            </div>
          </dl>
        </div>

        {/* Show enrichment columns immediately for ENRICHMENT_STARTED status */}
        {sheetDetails.status === "ENRICHMENT_STARTED" && !showColumnSelection && !verificationResult && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Selected Columns for Enrichment
            </h2>
            
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">
                Currently Selected Columns
              </h4>
              
              <EnrichmentColumnsDisplay 
                isLoading={isLoadingEnrichmentInfo}
                error={enrichmentInfoError}
                columns={enrichmentInfo?.enrichment_columns || []}
                onViewStatus={() => navigate('/enrichment-status')}
                onModify={handleShowColumnSelection}
              />
            </div>
          </div>
        )}

        {sheetDetails.status !== "ENRICHMENT_STARTED" && <div className={`mt-8 border-t border-gray-200 pt-6 ${
          sheetDetails.status === "ENRICHMENT_STARTED" && !showColumnSelection && !verificationResult ? 'mt-2' : 'mt-8'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Column Verification
              </h2>
              <p className="text-gray-600 mt-1">
                Verify that your sheet has all the required columns in the correct order before enrichment
              </p>
            </div>
            <button
              onClick={handleVerifyColumns}
              disabled={isVerifying}
              className={`flex items-center px-6 py-3 ${
                isVerifying 
                  ? "bg-indigo-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white rounded-lg transition-colors`}
            >
              {isVerifying ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Verify Columns
                </>
              )}
            </button>
          </div>
          
          {/* Verification Result Display */}
          {verificationResult && !showColumnSelection && (
            <div className={`mt-6 p-4 rounded-lg ${
              verificationResult.valid ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
            }`}>
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                  verificationResult.valid ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {verificationResult.valid ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="ml-3 w-full">
                  <h3 className={`text-sm font-medium ${
                    verificationResult.valid ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {verificationResult.valid ? 'Verification Successful' : 'Verification Failed'}
                  </h3>
                  <div className={`mt-2 text-sm ${
                    verificationResult.valid ? 'text-green-700' : 'text-red-700'
                  }`}>
                    <p>{verificationResult.message}</p>
                  </div>
                  
                  {/* Display missing columns if any */}
                  {verificationResult.missing_columns && verificationResult.missing_columns.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700">Missing Columns:</h4>
                      <ul className="mt-2 list-disc pl-5 text-sm text-red-600">
                        {verificationResult.missing_columns.map((column, index) => (
                          <li key={index}>{column}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Display misplaced columns if any */}
                  {verificationResult.misplaced_columns && verificationResult.misplaced_columns.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700">Misplaced Columns:</h4>
                      <ul className="mt-2 list-disc pl-5 text-sm text-red-600">
                        {verificationResult.misplaced_columns.map((column, index) => (
                          <li key={index}>
                            Expected "{column.expected}" at position {column.position}, found "{column.found}"
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Display required columns */}
                  {verificationResult.required_columns && verificationResult.required_columns.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700">Required Columns (in order):</h4>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                        {verificationResult.required_columns.map((column, index) => (
                          <div 
                            key={index}
                            className="px-2 py-1 bg-white rounded border border-gray-200"
                          >
                            {index + 1}. {column}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Display found headers */}
                  {verificationResult.found_headers && verificationResult.found_headers.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700">Found Headers:</h4>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                        {verificationResult.found_headers.map((header, index) => (
                          <div 
                            key={index}
                            className="px-2 py-1 bg-white rounded border border-gray-200"
                          >
                            {index + 1}. {header}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Select Columns for Enrichment button - new button */}
                  {verificationResult.valid && sheetDetails.status === "CONNECTED" && (
                    <div className="mt-6">
                      <button 
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        onClick={handleShowColumnSelection}
                      >
                        Select Columns for Enrichment
                      </button>
                    </div>
                  )}

                  {/* Already selected columns - show for ENRICHMENT_STARTED status */}
                  {verificationResult.valid && sheetDetails.status === "ENRICHMENT_STARTED" && (
                    <div className="mt-6">
                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                        <h4 className="text-sm font-semibold text-blue-800 mb-2">
                          Selected Columns for Enrichment
                        </h4>
                        
                        <EnrichmentColumnsDisplay 
                          isLoading={isLoadingEnrichmentInfo}
                          error={enrichmentInfoError}
                          columns={enrichmentInfo?.enrichment_columns || []}
                          onViewStatus={() => navigate('/enrichment-status')}
                          onModify={handleShowColumnSelection}
                        />
                      </div>
                    </div>
                  )}
                  {/* Show status-based message for other statuses */}
                  {verificationResult.valid && sheetDetails.status !== "CONNECTED" && sheetDetails.status !== "ENRICHMENT_STARTED" && (
                    <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-md">
                      <p className="text-sm text-blue-700">
                        This sheet is in the {sheetDetails.status.replace(/_/g, ' ').toLowerCase()} stage. 
                        {sheetDetails.status === "ENRICHMENT_COMPLETED" && " You can now proceed to outreach."}
                        {sheetDetails.status === "OUTREACH_STARTED" && " Outreach is currently in progress."}
                        {sheetDetails.status === "COMPLETED" && " The process has been completed."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Column Selection UI */}
          {showColumnSelection && renderColumnSelectionUI()}
        </div>}
      </div>
    </div>
  );
};

export default SheetDetailsPage;