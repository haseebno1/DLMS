# Testing the License Management System

This guide explains how to use the dummy data scripts to test the license management system.

## Prerequisites

1. Make sure your Supabase project is set up correctly
2. Ensure your `.env.local` file contains proper credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_key
   ADMIN_SECRET=your_admin_secret
   ```

## Setting Up Test Data

### Option 1: Using Dummy Data Scripts

We've created two scripts to help you set up test data:

1. **Upload Sample Images**
   - First, create a folder named `sample-images` in your project root
   - Download sample photos and signatures:
     - 5 photos: `male1.jpg`, `male2.jpg`, `male3.jpg`, `female1.jpg`, `female2.jpg`
     - 5 signatures: `signature1.png`, `signature2.png`, `signature3.png`, `signature4.png`, `signature5.png`
   - Run the image upload script:
     ```bash
     node scripts/dummy-images.js
     ```

2. **Seed License Data**
   - Update the Supabase URL and service key in `scripts/seed-data.js` (if needed)
   - Run the seed script:
     ```bash
     node scripts/seed-data.js
     ```

### Option 2: Using the Supabase UI

If you prefer, you can manually create test data through the Supabase UI:

1. Navigate to your Supabase project dashboard
2. Go to Storage → Create bucket (if needed)
   - Create `license-images` and `license-signatures` buckets
3. Upload sample images to both buckets
4. Go to Table Editor → licenses table
5. Add entries manually using the sample data format shown in `scripts/seed-data.js`

## Testing the Application

Once you have the test data set up, you can test the license management system:

### Test Features

1. **License Listing**
   - Visit `/dashboard/licenses`
   - Verify that dummy licenses appear in the list
   - Check that licenses show different status indicators (Active, Expiring Soon, Expired)
   - Test the search functionality

2. **License Details**
   - Click "View Details" for any license
   - Verify that all license data displays correctly
   - Confirm that images and signatures appear properly

3. **Edit License**
   - Click "Edit" for any license
   - Verify that the form is pre-populated with existing data
   - Make changes and submit the form
   - Confirm the changes appear in the license details

4. **Delete License**
   - Click "Delete" for any license
   - Confirm the deletion in the dialog
   - Verify that the license is removed from the list

5. **Print License**
   - Click "Print License" for any license
   - Verify that the print layout displays correctly
   - Test the print functionality

## Troubleshooting

If you encounter issues:

1. **Image Upload Problems**
   - Check that your Supabase storage buckets are created with public access
   - Verify that your service key has proper permissions

2. **License Data Issues**
   - Make sure the CNIC format follows the pattern `12345-1234567-1`
   - Ensure all required fields are provided

3. **Authentication Problems**
   - Confirm that your admin token is properly saved in localStorage
   - Check the console for any error messages

## Status Classification

Licenses are automatically classified as:
- **Active**: Valid expiry date is more than 3 months in the future
- **Expiring Soon**: Valid expiry date is less than 3 months away
- **Expired**: Valid expiry date is in the past 