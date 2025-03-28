import { useState, useEffect } from 'react';
import { FileSpreadsheet, Play, CheckCircle2 } from 'lucide-react';
import WavyBackground from '../components/Background';

const SheetDetailsPage = () => {
  const [sheetDetails, setSheetDetails] = useState({
    spreadsheetId: '',
    title: 'Lead List',
    sheetUrl: 'https://docs.google.com/spreadsheets/d/example-sheet-id/edit',
    availableSheets: []
  });

  useEffect(() => {
    // Retrieve sheet details from localStorage
    const storedSheetDetails = localStorage.getItem('sheetDetails');
    
    if (storedSheetDetails) {
      try {
        const parsedDetails = JSON.parse(storedSheetDetails);
        setSheetDetails({
          ...sheetDetails,
          spreadsheetId: parsedDetails.spreadsheetId || '',
          title: parsedDetails.sheetTitle || 'Lead List',
          sheetUrl: parsedDetails.spreadsheetId 
            ? `https://docs.google.com/spreadsheets/d/${parsedDetails.spreadsheetId}/edit` 
            : sheetDetails.sheetUrl,
          availableSheets: parsedDetails.sheetNames || []
        });
      } catch (error) {
        console.error('Error parsing stored sheet details:', error);
      }
    } else {
      window.location.href = '/';
    }
  }, []);

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const handleVerifyColumns = async () => {
    if (!sheetDetails.spreadsheetId) return;
    
    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      const response = await fetch('http://localhost:8000/google-sheet/verify-columns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          spreadsheet_url: sheetDetails.sheetUrl,
          sheet_name: sheetDetails.availableSheets.length > 0 ? sheetDetails.availableSheets[0] : 'Sheet1'
        })
      });
      
      const data = await response.json();
      setVerificationResult(data);
    } catch (error: any) {
      console.error('Error verifying columns:', error);
      setVerificationResult({
        valid: false,
        message: 'Failed to verify columns. Please try again.',
        error: error.message
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <WavyBackground />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 bg-opacity-95 backdrop-filter backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <FileSpreadsheet className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Lead List Details
                </h1>
                <p className="text-gray-600">
                  Connected Google Sheet information and workflow controls
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-green-600 font-medium">Connected</span>
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
                <dd className="mt-1 text-sm text-gray-600 break-all">
                  {sheetDetails.sheetUrl}
                </dd>
              </div>
              {sheetDetails.availableSheets.length > 0 && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Available Sheets</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {sheetDetails.availableSheets.join(', ')}
                  </dd>
                </div>
              )}
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
                      <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
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
                    
                    {verificationResult.found_headers && verificationResult.found_headers.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">Found Headers:</h4>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {verificationResult.found_headers.map((header: any, index: any) => (
                            <div 
                              key={index}
                              className="px-2 py-1 bg-white rounded border border-gray-200 text-xs"
                            >
                              {header}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {verificationResult.valid && (
                      <div className="mt-4">
                        <button 
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                          onClick={() => {
                            console.log('Starting enrichment process for verified sheet');
                            // Here you would call your next API to start the enrichment
                          }}
                        >
                          Start Enrichment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheetDetailsPage;