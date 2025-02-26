import { useState, useEffect } from 'react';

export default function TestAdmin() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [debugResult, setDebugResult] = useState(null);
  const [error, setError] = useState(null);
  const [envData, setEnvData] = useState(null);

  useEffect(() => {
    // Fetch environment variables data when component mounts
    fetch('/api/test-env')
      .then(res => res.json())
      .then(data => {
        setEnvData(data);
      })
      .catch(err => {
        console.error('Error fetching environment data:', err);
      });
  }, []);

  const testAuth = async () => {
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      setResult(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  const testDebug = async () => {
    try {
      const response = await fetch('/api/debug-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      setDebugResult(data);
    } catch (err) {
      console.error('Debug error:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Auth Test</h1>
      
      {envData && (
        <div style={{ marginBottom: '20px', background: '#f0f8ff', padding: '10px', borderRadius: '4px' }}>
          <h2>Environment Variables</h2>
          <pre>{JSON.stringify(envData, null, 2)}</pre>
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button 
          onClick={testAuth}
          style={{ padding: '8px 16px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', marginRight: '10px' }}
        >
          Test Auth
        </button>
        <button 
          onClick={testDebug}
          style={{ padding: '8px 16px', backgroundColor: '#4b0082', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Debug Comparison
        </button>
      </div>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h2>Auth Result:</h2>
          <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '4px' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {debugResult && (
        <div style={{ marginTop: '20px' }}>
          <h2>Debug Result:</h2>
          <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '4px' }}>
            {JSON.stringify(debugResult, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
} 