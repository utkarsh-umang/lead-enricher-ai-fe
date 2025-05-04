//@ts-nocheck
import { API_BASE_URL } from '../config/env';

// Types for sheet data
export interface SheetStatus {
  sheet_id: string;
  sheet_url: string;
  sheet_name: string;
  status: string;
  updated_at: string;
  created_at: string;
}

export interface AgencySheetsResponse {
  agency_id: string;
  sheets: SheetStatus[];
}

// API response interface
export interface ApiVerificationResult {
  accessible: boolean;
  spreadsheet_url: string;
  spreadsheet_id: string;
  agency_id: string;
  status: string;
  title?: string;
  sheet_names?: string[];
  error?: string;
}

// Component specific interfaces matching what the ConnectPage expects
export interface SuccessfulVerification {
  accessible: boolean;
  title: string;
  spreadsheet_id: string;
  sheet_names: string[];
}

export interface FailedVerification {
  accessible: boolean;
  error: string;
}

export type ValidationResult = SuccessfulVerification | FailedVerification;

export interface VerificationResult {
  valid: boolean;
  agency_id?: string;
  spreadsheet_url?: string;
  message?: string;
  missing_columns?: string[];
  misplaced_columns?: Array<{expected: string, found: string, position: number}>;
  required_columns?: string[];
  found_headers?: string[];
  error?: string;
}

/**
 * Get all sheets for the current agency
 * @returns Promise with sheets data
 */
export const getConnectedSheets = async (): Promise<AgencySheetsResponse> => {
  const agencyId = localStorage.getItem('userAgencyId');
  
  if (!agencyId) {
    throw new Error('Agency ID not found. Please log in again.');
  }
  
  const response = await fetch(`${API_BASE_URL}/google-sheet/status/${agencyId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.detail || 'Failed to fetch connected sheets');
  }
  
  return data;
};

/**
 * Update the status of a sheet
 * @param sheetUrl - The URL of the Google Sheet
 * @param status - The new status value
 * @returns Promise with the result
 */
export const updateSheetStatus = async (sheetUrl: string, status: string): Promise<any> => {
  const agencyId = localStorage.getItem('userAgencyId');
  
  if (!agencyId) {
    throw new Error('Agency ID not found. Please log in again.');
  }
  
  const response = await fetch(`${API_BASE_URL}/google-sheet/update-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      spreadsheet_url: sheetUrl,
      agency_id: agencyId,
      status: status
    })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.detail || 'Failed to update sheet status');
  }
  
  return data;
};

/**
 * Verify Google Sheet access
 * @param sheetUrl - The URL of the Google Sheet to verify
 * @returns Promise with verification result properly typed for the ConnectPage
 */
export const verifyGoogleSheetAccess = async (sheetUrl: string): Promise<ValidationResult> => {
  const agencyId = localStorage.getItem('userAgencyId');
  
  if (!agencyId) {
    throw new Error('Agency ID not found. Please log in again.');
  }
  
  const response = await fetch(`${API_BASE_URL}/google-sheet/verify-access`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      spreadsheet_url: sheetUrl,
      agency_id: agencyId
    })
  });
  
  const data = await response.json() as ApiVerificationResult;
  
  if (!response.ok) {
    throw new Error(data.detail || 'Failed to verify sheet access');
  }
  
  // Transform API response to match the component's expected types
  if (data.accessible) {
    return {
      accessible: true,
      title: data.title || 'Untitled Sheet',
      spreadsheet_id: data.spreadsheet_id,
      sheet_names: data.sheet_names || []
    };
  } else {
    return {
      accessible: false,
      error: data.error || 'Unknown error occurred'
    };
  }
};

/**
 * Verify if the Google Sheet has the required columns in the correct order
 * @param sheetUrl - The URL of the Google Sheet
 * @param sheetName - The name of the sheet to verify (default: 'Sheet1')
 * @returns Promise with verification result
 */
export const verifySheetColumns = async (
  sheetUrl: string, 
  sheetName: string = 'Sheet1'
): Promise<VerificationResult> => {
  const agencyId = localStorage.getItem('userAgencyId');
  
  if (!agencyId) {
    throw new Error('Agency ID not found. Please log in again.');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/google-sheet/verify-columns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        spreadsheet_url: sheetUrl,
        sheet_name: sheetName,
        agency_id: agencyId
      })
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Set user-friendly message if not provided by API
    if (data.valid && !data.message) {
      data.message = 'All required columns are present in the correct order';
    } else if (!data.valid && !data.message) {
      data.message = data.error || 'Some required columns are missing or in the wrong order';
    }
    
    return data;
  } catch (error) {
    console.error('Error verifying columns:', error);
    return {
      valid: false,
      message: `Failed to verify columns: ${error.message}`,
      error: error.message
    };
  }
};