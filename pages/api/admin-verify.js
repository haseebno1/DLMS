import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;
    const adminSecret = process.env.ADMIN_SECRET || '';
    
    // Check if password matches admin secret
    if (password === adminSecret) {
      // Generate a random token
      const token = crypto.randomBytes(32).toString('hex');
      
      // Set expiry time (24 hours from now)
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24);
      
      return res.status(200).json({
        success: true,
        token,
        expiry: expiry.toISOString(),
        message: 'Admin authentication successful',
      });
    } else {
      return res.status(401).json({
        success: false,
        error: 'Invalid password',
      });
    }
  } catch (error) {
    console.error('Admin verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred',
    });
  }
} 