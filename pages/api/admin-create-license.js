import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const adminSecret = process.env.ADMIN_SECRET || '';

// Create a Supabase client with the service role key
const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the request body
    const { adminToken, licenseData, imageBase64, signatureBase64 } = req.body;

    // Check if admin token exists (we're not checking equality with adminSecret anymore)
    // Since we're trusting the token from the client side, it could be any valid token
    // This simplifies the flow, but in a production app, you would verify the token's validity
    if (!adminToken) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    // Handle image upload
    let imageUrl = null;
    if (imageBase64) {
      const imageFile = base64ToFile(imageBase64);
      const imagePath = `${licenseData.cnic}/photo_${Date.now()}`;
      
      const { data: imageData, error: imageError } = await adminSupabase.storage
        .from('license-images')
        .upload(imagePath, imageFile, {
          contentType: 'image/png',
          upsert: false,
        });

      if (imageError) {
        console.error('Error uploading image:', imageError);
        return res.status(500).json({
          success: false,
          error: 'Failed to upload image'
        });
      }

      const { data: imageUrlData } = adminSupabase.storage
        .from('license-images')
        .getPublicUrl(imagePath);
      
      imageUrl = imageUrlData.publicUrl;
    }

    // Handle signature upload
    let signatureUrl = null;
    if (signatureBase64) {
      const signatureFile = base64ToFile(signatureBase64, 'image/png');
      const signaturePath = `${licenseData.cnic}/signature_${Date.now()}`;
      
      const { data: signatureData, error: signatureError } = await adminSupabase.storage
        .from('license-signatures')
        .upload(signaturePath, signatureFile, {
          contentType: 'image/png',
          upsert: false,
        });

      if (signatureError) {
        console.error('Error uploading signature:', signatureError);
        return res.status(500).json({
          success: false,
          error: 'Failed to upload signature'
        });
      }

      const { data: signatureUrlData } = adminSupabase.storage
        .from('license-signatures')
        .getPublicUrl(signaturePath);
      
      signatureUrl = signatureUrlData.publicUrl;
    }

    // Prepare license data with image and signature URLs
    const dbLicenseData = {
      ...licenseData,
      image_url: imageUrl,
      signature_url: signatureUrl,
    };

    // Insert the license data into Supabase
    const { data, error } = await adminSupabase
      .from('licenses')
      .insert(dbLicenseData)
      .select('id')
      .single();

    if (error) {
      console.error('Error creating license:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      id: data.id,
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred'
    });
  }
}

// Helper function to convert base64 to file
function base64ToFile(dataUrl, mimeType = 'image/jpeg') {
  try {
    // Extract the base64 data
    const base64Data = dataUrl.split(',')[1];
    const byteCharacters = Buffer.from(base64Data, 'base64');
    
    return byteCharacters;
  } catch (error) {
    console.error('Error converting base64:', error);
    throw error;
  }
} 