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
    const { id, adminToken, licenseData, imageBase64, signatureBase64 } = req.body;

    // Check if admin token exists
    if (!adminToken) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    // Prepare update data
    const updateData = { ...licenseData };

    // Handle image upload if a new image is provided
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
      
      updateData.image_url = imageUrlData.publicUrl;
    }

    // Handle signature upload if a new signature is provided
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
      
      updateData.signature_url = signatureUrlData.publicUrl;
    }

    // Update the license data in Supabase
    const { data, error } = await adminSupabase
      .from('licenses')
      .update(updateData)
      .eq('id', id)
      .select('id')
      .single();

    if (error) {
      console.error('Error updating license:', error);
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