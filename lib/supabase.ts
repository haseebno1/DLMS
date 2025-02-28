import { createClient } from '@supabase/supabase-js';

// These values should be in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tbmslfkurtqvfxnbtxju.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibXNsZmt1cnRxdmZ4bmJ0eGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NDMzMTUsImV4cCI6MjA1NjExOTMxNX0.LDpw67wOkEdA50OY03HhjtPLu5lxc0HFII5rJnVV3t8';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create an admin client with service role key for authenticated operations
const supabaseAdminKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibXNsZmt1cnRxdmZ4bmJ0eGp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDU0MzMxNSwiZXhwIjoyMDU2MTE5MzE1fQ.M3-GIXJy0SKT5X1Yq0KNea757cXJkak0GJPWwcZELNc';

export const supabaseAdmin = createClient(supabaseUrl, supabaseAdminKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Helper function to get appropriate client based on admin status
export const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    return supabase; // Return anonymous client for SSR
  }
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? supabaseAdmin : supabase;
};

// Define database types
export type License = {
  id?: string;
  cnic: string;
  name: string;
  father_name: string;
  address: string;
  height: string;
  blood_group: string;
  date_of_birth: string;
  license_no: string;
  license_types: string[];
  issue_city: string;
  valid_from: string;
  valid_to: string;
  image_url?: string;
  signature_url?: string;
  created_at?: string;
}; 