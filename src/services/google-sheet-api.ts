const API_BASE_URL = 'http://localhost:8000';

// Type for successful spreadsheet verification response
interface SuccessfulVerifyResponse {
  accessible: true;
  spreadsheet_url: string;
  spreadsheet_id: string;
  title: string;
  sheet_names: string[];
}

// Type for failed spreadsheet verification response
interface FailedVerifyResponse {
  accessible: false;
  spreadsheet_url: string;
  error: string;
}

// Combined type for the spreadsheet verification response
type VerifySheetAccessResponse = SuccessfulVerifyResponse | FailedVerifyResponse;

/**
 * Verify access to a Google Sheet
 * @param spreadsheetUrl - The URL of the Google Sheet to verify
 * @returns Promise with the verification result
 */
export const verifyGoogleSheetAccess = async (
  spreadsheetUrl: string
): Promise<VerifySheetAccessResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/google-sheet/verify-access`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ spreadsheet_url: spreadsheetUrl }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    // Return a generic error if something goes wrong
    return {
      accessible: false,
      spreadsheet_url: spreadsheetUrl,
      error: 'Failed to verify access to the Google Sheet. Please check your connection and try again.',
    };
  }
};