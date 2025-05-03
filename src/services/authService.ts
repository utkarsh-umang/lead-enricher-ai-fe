import { API_BASE_URL } from "../config/env";

// Types
export interface LoginRequestData {
  email: string;
  password: string;
}

export interface SignupRequestData {
  email: string;
  password: string;
  name: string;
  agency_id: string;
  role?: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    agency_id: string;
  };
}

export interface Agency {
  id: string;
  name: string;
  description?: string;
}

// Authentication service functions
export const authService = {
  /**
   * Login user with email and password
   */
  login: async (data: LoginRequestData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.detail || 'Login failed');
    }
    
    return result;
  },
  
  /**
   * Register a new user
   */
  signup: async (data: SignupRequestData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.detail || 'Signup failed');
    }
    
    return result;
  },
  
  /**
   * Get list of available agencies
   */
  getAgencies: async (): Promise<Agency[]> => {
    const response = await fetch(`${API_BASE_URL}/auth/agencies`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.detail || 'Failed to fetch agencies');
    }
    
    return result;
  },
  
  /**
   * Create a new agency
   */
  createAgency: async (name: string, description?: string): Promise<Agency> => {
    const response = await fetch(`${API_BASE_URL}/auth/agencies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ name, description })
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.detail || 'Failed to create agency');
    }
    
    return result.agency;
  },
  
  /**
   * Save user session data after successful authentication
   */
  saveUserSession: (userData: AuthResponse["user"]) => {
    localStorage.setItem('userToken', 'auth-token-' + Date.now()); // In a real app, use a JWT token
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('userAgencyId', userData.agency_id);
    localStorage.setItem('userId', userData.id);
  },
  
  /**
   * Check if user is logged in
   */
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('userToken');
  },
  
  /**
   * Logout user by clearing session
   */
  logout: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userAgencyId');
    localStorage.removeItem('userId');
    window.location.href = '/login';
  }
};