import { createClient } from '@supabase/supabase-js';

// This script inserts dummy data into your Supabase database
// Run it with: node scripts/seed-data.js

// Supabase credentials
// Replace these with your actual credentials or load from .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tbmslfkurtqvfxnbtxju.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibXNsZmt1cnRxdmZ4bmJ0eGp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDU0MzMxNSwiZXhwIjoyMDU2MTE5MzE1fQ.M3-GIXJy0SKT5X1Yq0KNea757cXJkak0GJPWwcZELNc';

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample license data
const sampleLicenses = [
  {
    cnic: "12345-1234567-1",
    name: "Muhammad Ahmed",
    father_name: "Khalid Ahmed",
    address: "123 Main Street, Islamabad, Pakistan",
    height: "5'10\"",
    blood_group: "O+",
    date_of_birth: "1990-05-15",
    license_no: "ISB-DL-2023-001",
    license_types: ["mcycle", "carjeep"],
    issue_city: "islamabad",
    valid_from: "2023-01-01",
    valid_to: "2028-01-01", // Active license
    image_url: "https://tbmslfkurtqvfxnbtxju.supabase.co/storage/v1/object/public/license-images/sample/male1.jpg",
    signature_url: "https://tbmslfkurtqvfxnbtxju.supabase.co/storage/v1/object/public/license-signatures/sample/signature1.png"
  },
  {
    cnic: "54321-7654321-2",
    name: "Fatima Khan",
    father_name: "Ibrahim Khan",
    address: "456 Park Avenue, Lahore, Pakistan",
    height: "5'4\"",
    blood_group: "A+",
    date_of_birth: "1995-08-20",
    license_no: "LHR-DL-2023-002",
    license_types: ["carjeep"],
    issue_city: "lahore",
    valid_from: "2022-05-15",
    valid_to: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Expiring soon (25 days)
    image_url: "https://tbmslfkurtqvfxnbtxju.supabase.co/storage/v1/object/public/license-images/sample/female1.jpg",
    signature_url: "https://tbmslfkurtqvfxnbtxju.supabase.co/storage/v1/object/public/license-signatures/sample/signature2.png"
  },
  {
    cnic: "98765-4321098-3",
    name: "Ali Hassan",
    father_name: "Farooq Hassan",
    address: "789 Garden Road, Karachi, Pakistan",
    height: "5'8\"",
    blood_group: "B-",
    date_of_birth: "1988-03-12",
    license_no: "KHI-DL-2023-003",
    license_types: ["mcycle", "carjeep", "ltv"],
    issue_city: "karachi",
    valid_from: "2020-10-01",
    valid_to: "2022-10-01", // Expired license
    image_url: "https://tbmslfkurtqvfxnbtxju.supabase.co/storage/v1/object/public/license-images/sample/male2.jpg",
    signature_url: "https://tbmslfkurtqvfxnbtxju.supabase.co/storage/v1/object/public/license-signatures/sample/signature3.png"
  },
  {
    cnic: "13579-2468013-4",
    name: "Ayesha Malik",
    father_name: "Tariq Malik",
    address: "101 University Road, Peshawar, Pakistan",
    height: "5'6\"",
    blood_group: "AB+",
    date_of_birth: "1992-11-30",
    license_no: "PSH-DL-2023-004",
    license_types: ["carjeep", "htv"],
    issue_city: "peshawar",
    valid_from: "2023-03-15",
    valid_to: "2028-03-15", // Active license
    image_url: "https://tbmslfkurtqvfxnbtxju.supabase.co/storage/v1/object/public/license-images/sample/female2.jpg",
    signature_url: "https://tbmslfkurtqvfxnbtxju.supabase.co/storage/v1/object/public/license-signatures/sample/signature4.png"
  },
  {
    cnic: "24680-1357924-5",
    name: "Usman Ali",
    father_name: "Zafar Ali",
    address: "202 Railway Colony, Quetta, Pakistan",
    height: "6'0\"",
    blood_group: "O-",
    date_of_birth: "1985-07-22",
    license_no: "QTA-DL-2023-005",
    license_types: ["mcycle"],
    issue_city: "quetta",
    valid_from: "2021-12-01",
    valid_to: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Expiring very soon (15 days)
    image_url: "https://tbmslfkurtqvfxnbtxju.supabase.co/storage/v1/object/public/license-images/sample/male3.jpg",
    signature_url: "https://tbmslfkurtqvfxnbtxju.supabase.co/storage/v1/object/public/license-signatures/sample/signature5.png"
  }
];

async function seedData() {
  console.log('Starting to seed license data...');
  
  try {
    // Insert each license into the database
    for (const license of sampleLicenses) {
      const { data, error } = await supabase
        .from('licenses')
        .upsert(license, { onConflict: 'license_no' })
        .select();
      
      if (error) {
        console.error(`Error inserting license ${license.license_no}:`, error);
      } else {
        console.log(`Successfully inserted/updated license: ${license.license_no}`);
      }
    }
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error in seed process:', error);
  }
}

// Run the seed function
seedData(); 