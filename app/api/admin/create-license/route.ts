import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Mark this route as dynamic to prevent static generation errors
export const dynamic = 'force-dynamic';

// Server-side Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const adminSecret = process.env.ADMIN_SECRET || '';

// Create a Supabase client with the service role key
const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { adminToken, licenseData, imageBase64, signatureBase64 } = await request.json();

    // Check if admin token is valid
    if (adminToken !== adminSecret) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
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
        return NextResponse.json(
          { success: false, error: 'Failed to upload image' },
          { status: 500 }
        );
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
        return NextResponse.json(
          { success: false, error: 'Failed to upload signature' },
          { status: 500 }
        );
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
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data.id,
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Helper function to convert base64 to file
function base64ToFile(dataUrl: string, mimeType = 'image/jpeg'): File {
  // Extract the base64 data
  const base64Data = dataUrl.split(',')[1];
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }

  const byteArray = new Uint8Array(byteArrays);
  const blob = new Blob([byteArray], { type: mimeType });
  
  return new File([blob], `file-${Date.now()}`, { type: mimeType });
} 