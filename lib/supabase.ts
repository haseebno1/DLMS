import { createClient } from '@supabase/supabase-js';

// These values should be in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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