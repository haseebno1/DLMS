/**
 * Authentication utility functions
 */

/**
 * Get the admin token from localStorage or sessionStorage
 */
export function getAuthToken(): { token: string | null; expiry: string | null } {
  // Try localStorage first (for remembered login)
  let token = typeof localStorage !== 'undefined' ? localStorage.getItem('adminToken') : null;
  let expiry = typeof localStorage !== 'undefined' ? localStorage.getItem('adminTokenExpiry') : null;

  // If not found in localStorage, check sessionStorage
  if (!token || !expiry) {
    token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('adminToken') : null;
    expiry = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('adminTokenExpiry') : null;
  }

  return { token, expiry };
}

/**
 * Check if the user is authenticated
 */
export function isAuthenticated(): boolean {
  const { token, expiry } = getAuthToken();

  if (!token || !expiry) {
    return false;
  }

  // Check if token is expired
  const expiryDate = new Date(expiry);
  return expiryDate > new Date();
}

/**
 * Clear authentication data
 */
export function clearAuth(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenExpiry');
  }
  
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminTokenExpiry');
  }
}

/**
 * Store authentication data
 */
export function storeAuth(token: string, expiry: string, remember: boolean = false): void {
  if (remember && typeof localStorage !== 'undefined') {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminTokenExpiry', expiry);
  } else if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('adminToken', token);
    sessionStorage.setItem('adminTokenExpiry', expiry);
  }
} 