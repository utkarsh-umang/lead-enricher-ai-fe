import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileSpreadsheet, Play, CheckCircle2, AlertCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import { verifySheetColumns, updateSheetStatus, VerificationResult } from '../services/sheetService';

interface SheetData {
  spreadsheetId: string;
  title: string;
  sheetUrl: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

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
      setSheetDetails({
        spreadsheetId: sheetData.spreadsheetId || '',
        title: sheetData.title || 'Lead List',
        sheetUrl: sheetData.sheetUrl || '',
        selectedSheet: 'Sheet1', // Default to Sheet1
        agencyId: agencyId,
        status: sheetData.status || 'CONNECTED',
        createdAt: sheetData.createdAt || '',
        updatedAt: sheetData.updatedAt || ''
      });
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

  const handleContinueToEnrichment = async () => {
    try {
      // Use the service function to update sheet status
      await updateSheetStatus(sheetDetails.sheetUrl, "ENRICHMENT_STARTED");
      
      // Save enrichment-ready sheet details to localStorage for the next page
      localStorage.setItem('enrichmentReadySheet', JSON.stringify({
        spreadsheetId: sheetDetails.spreadsheetId,
        sheetTitle: sheetDetails.title,
        sheetUrl: sheetDetails.sheetUrl,
        sheetName: sheetDetails.selectedSheet,
        agencyId: sheetDetails.agencyId,
        verificationData: verificationResult
      }));
      
      // Redirect to enrichment status page
      navigate('/enrichment-status');
    } catch (error) {
      console.error('Failed to update sheet status:', error);
      // Show an error message but don't navigate
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

        <div className="mt-8 border-t border-gray-200 pt-6">
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
          {verificationResult && (
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
                  
                  {/* Continue to Enrichment button (only if verification passed) */}
                  {verificationResult.valid && sheetDetails.status === "CONNECTED" && (
                    <div className="mt-6">
                      <button 
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        onClick={handleContinueToEnrichment}
                      >
                        Continue to Enrichment
                      </button>
                    </div>
                  )}
                  
                  {/* Show status-based message if already in process */}
                  {verificationResult.valid && sheetDetails.status !== "CONNECTED" && (
                    <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-md">
                      <p className="text-sm text-blue-700">
                        This sheet is already in the {sheetDetails.status.replace(/_/g, ' ').toLowerCase()} stage. 
                        {sheetDetails.status === "ENRICHMENT_STARTED" && " You can view the progress in the enrichment status page."}
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
        </div>
      </div>
    </div>
  );
};

export default SheetDetailsPage;