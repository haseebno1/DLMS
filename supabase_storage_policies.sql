-- IMPORTANT: This file contains policies for storage buckets
-- You need to manually create the buckets first in the Supabase dashboard:
-- 1. license-images
-- 2. license-signatures

-- Then apply these policies to your buckets

-- Policy for public access to license images
CREATE POLICY "Public Access for License Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'license-images');

-- Policy for public access to license signatures
CREATE POLICY "Public Access for License Signatures"
ON storage.objects FOR SELECT
USING (bucket_id = 'license-signatures');

-- Policy for authenticated uploads to license images
CREATE POLICY "Authenticated Uploads for License Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'license-images');

-- Policy for authenticated uploads to license signatures
CREATE POLICY "Authenticated Uploads for License Signatures"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'license-signatures');

-- Policy to allow deletion of own images (optional)
CREATE POLICY "Allow Deletion of License Images"
ON storage.objects FOR DELETE
USING (bucket_id = 'license-images');

-- Policy to allow deletion of own signatures (optional)
CREATE POLICY "Allow Deletion of License Signatures"
ON storage.objects FOR DELETE
USING (bucket_id = 'license-signatures'); 