import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminCheck() {
  const [adminToken, setAdminToken] = useState(null);
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Get the token and expiry
    const token = localStorage.getItem('adminToken');
    const expiry = localStorage.getItem('adminTokenExpiry');
    
    setAdminToken(token);
    setTokenExpiry(expiry);
    
    if (!token || !expiry) {
      setIsValid(false);
      return;
    }
    
    // Check if token is expired
    const expiryDate = new Date(expiry);
    const now = new Date();
    setIsValid(expiryDate > now);
    
    // Calculate time left
    const timeLeftMs = expiryDate - now;
    if (timeLeftMs > 0) {
      const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    }
  }, []);
  
  const handleClearToken = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenExpiry');
    setAdminToken(null);
    setTokenExpiry(null);
    setIsValid(false);
    setTimeLeft(null);
  };
  
  const handleLogin = () => {
    router.push('/admin/login');
  };
  
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Admin Token Status</h1>
      
      <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <p><strong>Admin Token:</strong> {adminToken ? `${adminToken.substring(0, 10)}...` : 'Not set'}</p>
        <p><strong>Expiry:</strong> {tokenExpiry || 'Not set'}</p>
        <p><strong>Status:</strong> {isValid ? 
          <span style={{ color: 'green' }}>Valid (Expires in {timeLeft})</span> : 
          <span style={{ color: 'red' }}>Invalid or Missing</span>}
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={handleClearToken}
          style={{ padding: '10px 15px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Clear Token
        </button>
        
        <button 
          onClick={handleLogin}
          style={{ padding: '10px 15px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
} 