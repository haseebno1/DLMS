import { supabase } from './supabase';
import { uploadFile } from './fileUpload';
import { License } from './supabase';

// Table name in Supabase
const TABLE_NAME = 'licenses';

// Function to create a new license in Supabase
export async function createLicense(
  licenseData: Omit<License, 'id' | 'created_at' | 'image_url' | 'signature_url'>,
  imageFile?: File,
  signatureFile?: File
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // Upload image and signature if provided
    let imageUrl = null;
    let signatureUrl = null;

    if (imageFile) {
      imageUrl = await uploadFile(imageFile, 'license-images', licenseData.cnic);
      if (!imageUrl) {
        return { success: false, error: 'Failed to upload image' };
      }
    }

    if (signatureFile) {
      signatureUrl = await uploadFile(signatureFile, 'license-signatures', licenseData.cnic);
      if (!signatureUrl) {
        return { success: false, error: 'Failed to upload signature' };
      }
    }

    // Convert from camelCase to snake_case for database compatibility
    const dbLicenseData = {
      cnic: licenseData.cnic,
      name: licenseData.name,
      father_name: licenseData.father_name,
      address: licenseData.address,
      height: licenseData.height,
      blood_group: licenseData.blood_group,
      date_of_birth: licenseData.date_of_birth,
      license_no: licenseData.license_no,
      license_types: licenseData.license_types,
      issue_city: licenseData.issue_city,
      valid_from: licenseData.valid_from,
      valid_to: licenseData.valid_to,
      image_url: imageUrl,
      signature_url: signatureUrl,
    };

    // Insert the license data into Supabase
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(dbLicenseData)
      .select('id')
      .single();

    if (error) {
      console.error('Error creating license:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error in license creation process:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
} 