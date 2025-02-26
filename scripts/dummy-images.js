import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// This script uploads sample images and signatures to Supabase storage
// Run it with: node scripts/dummy-images.js
// Make sure to create a 'sample-images' folder with the images mentioned below

// Supabase credentials
// Replace these with your actual credentials or load from .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tbmslfkurtqvfxnbtxju.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibXNsZmt1cnRxdmZ4bmJ0eGp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDU0MzMxNSwiZXhwIjoyMDU2MTE5MzE1fQ.M3-GIXJy0SKT5X1Yq0KNea757cXJkak0GJPWwcZELNc';

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Path to sample images folder
const SAMPLE_IMAGES_DIR = path.join(process.cwd(), 'sample-images');

// List of sample images to upload
const imagesToUpload = [
  { localFilePath: path.join(SAMPLE_IMAGES_DIR, 'male1.jpg'), storagePath: 'sample/male1.jpg', bucket: 'license-images' },
  { localFilePath: path.join(SAMPLE_IMAGES_DIR, 'male2.jpg'), storagePath: 'sample/male2.jpg', bucket: 'license-images' },
  { localFilePath: path.join(SAMPLE_IMAGES_DIR, 'male3.jpg'), storagePath: 'sample/male3.jpg', bucket: 'license-images' },
  { localFilePath: path.join(SAMPLE_IMAGES_DIR, 'female1.jpg'), storagePath: 'sample/female1.jpg', bucket: 'license-images' },
  { localFilePath: path.join(SAMPLE_IMAGES_DIR, 'female2.jpg'), storagePath: 'sample/female2.jpg', bucket: 'license-images' },
  { localFilePath: path.join(SAMPLE_IMAGES_DIR, 'signature1.png'), storagePath: 'sample/signature1.png', bucket: 'license-signatures' },
  { localFilePath: path.join(SAMPLE_IMAGES_DIR, 'signature2.png'), storagePath: 'sample/signature2.png', bucket: 'license-signatures' },
  { localFilePath: path.join(SAMPLE_IMAGES_DIR, 'signature3.png'), storagePath: 'sample/signature3.png', bucket: 'license-signatures' },
  { localFilePath: path.join(SAMPLE_IMAGES_DIR, 'signature4.png'), storagePath: 'sample/signature4.png', bucket: 'license-signatures' },
  { localFilePath: path.join(SAMPLE_IMAGES_DIR, 'signature5.png'), storagePath: 'sample/signature5.png', bucket: 'license-signatures' },
];

// Function to upload a single file to Supabase storage
async function uploadFile(localFilePath, storagePath, bucket) {
  try {
    if (!fs.existsSync(localFilePath)) {
      console.error(`File not found: ${localFilePath}`);
      return false;
    }
    
    const fileBuffer = fs.readFileSync(localFilePath);
    const fileExt = path.extname(localFilePath).toLowerCase();
    let contentType = 'image/jpeg';
    
    if (fileExt === '.png') {
      contentType = 'image/png';
    }
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, fileBuffer, {
        contentType,
        upsert: true
      });
    
    if (error) {
      console.error(`Error uploading ${storagePath}:`, error);
      return false;
    }
    
    console.log(`Successfully uploaded ${storagePath} to ${bucket}`);
    return true;
  } catch (error) {
    console.error(`Unexpected error uploading ${storagePath}:`, error);
    return false;
  }
}

// Main function to upload all sample images
async function uploadSampleImages() {
  console.log('Starting to upload sample images and signatures...');
  
  // Check if sample images directory exists
  if (!fs.existsSync(SAMPLE_IMAGES_DIR)) {
    console.error(`Sample images directory not found at: ${SAMPLE_IMAGES_DIR}`);
    console.error('Please create this directory and add sample images before running this script.');
    return;
  }
  
  // Create buckets if they don't exist
  try {
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return;
    }
    
    const bucketNames = buckets.map(b => b.name);
    
    if (!bucketNames.includes('license-images')) {
      const { error } = await supabase.storage.createBucket('license-images', { public: true });
      if (error) {
        console.error('Error creating license-images bucket:', error);
        return;
      }
      console.log('Created license-images bucket');
    }
    
    if (!bucketNames.includes('license-signatures')) {
      const { error } = await supabase.storage.createBucket('license-signatures', { public: true });
      if (error) {
        console.error('Error creating license-signatures bucket:', error);
        return;
      }
      console.log('Created license-signatures bucket');
    }
  } catch (error) {
    console.error('Error managing buckets:', error);
    return;
  }
  
  // Upload each file
  for (const item of imagesToUpload) {
    await uploadFile(item.localFilePath, item.storagePath, item.bucket);
  }
  
  console.log('Sample image upload process completed!');
}

// Run the upload function
uploadSampleImages(); 