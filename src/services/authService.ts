// Types
export interface LoginRequestData {
  email: string;
  password: string;
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

// Hardcoded credentials
const HARDCODED_EMAIL = 'utkarsh.utk123@gmail.com';
const HARDCODED_PASSWORD = 'password123';

// Authentication service functions
export const authService = {
  /**
   * Login user with email and password (hardcoded authentication)
   */
  login: async (data: LoginRequestData): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check hardcoded credentials
    if (data.email === HARDCODED_EMAIL && data.password === HARDCODED_PASSWORD) {
      return {
        status: 'success',
        message: 'Login successful',
        user: {
          id: '1',
          email: HARDCODED_EMAIL,
          name: 'Utkarsh',
          role: 'admin',
          agency_id: '1'
        }
      };
    } else {
      throw new Error('Invalid email or password');
    }
  },
  
  /**
   * Save user session data after successful authentication
   */
  saveUserSession: (userData: AuthResponse["user"]) => {
    localStorage.setItem('userToken', 'auth-token-' + Date.now());
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
   * Login user with Google OAuth
   */
  loginWithGoogle: async (): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // TODO: Implement actual Google OAuth flow
    // For now, return a mock successful response
    return {
      status: 'success',
      message: 'Login successful',
      user: {
        id: '1',
        email: 'user@gmail.com',
        name: 'Google User',
        role: 'admin',
        agency_id: '1'
      }
    };
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