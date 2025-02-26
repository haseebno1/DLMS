# Supabase Setup Instructions for DLMS License Management System

This guide will help you set up the Supabase database and storage for the Driver License Management System.

## Setting Up the Database

1. **Log in to your Supabase account** and navigate to the [Supabase Dashboard](https://app.supabase.io/).

2. **Access the SQL Editor**:
   - Go to your project dashboard
   - Click on "SQL Editor" in the left navigation menu
   - Click "New Query" to create a new SQL query

3. **Create the database structure**:
   - Copy the contents of the `supabase_schema.sql` file
   - Paste it into the SQL Editor
   - Click "Run" to execute the SQL commands
   - This will create the `licenses` table with all required fields and constraints

## Setting Up Storage Buckets

1. **Create storage buckets**:
   - Go to the "Storage" section in the left navigation menu
   - Click "New Bucket"
   - Create two buckets:
     - `license-images` for storing license photos
     - `license-signatures` for storing signatures
   - Make sure to enable RLS (Row Level Security) for both buckets

2. **Set up bucket policies**:
   - For each bucket, go to "Policies" tab
   - Add the policies from `supabase_storage_policies.sql` file
   - This allows public reading of files and authenticated uploads

## Testing the Setup

After completing the setup, you can test the integration:

1. **Verify database setup**:
   - Go to "Table Editor" in the left navigation menu
   - You should see the `licenses` table with the correct schema

2. **Verify storage buckets**:
   - Go to "Storage" in the left navigation menu
   - You should see the two buckets you created

3. **Test the application**:
   - Run the application locally
   - Fill out the license form and submit
   - Check the Supabase dashboard to verify that the data and files were stored correctly

## Environment Variables

Make sure your `.env.local` file has the following variables set:

```
NEXT_PUBLIC_SUPABASE_URL=https://tbmslfkurtqvfxnbtxju.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibXNsZmt1cnRxdmZ4bmJ0eGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NDMzMTUsImV4cCI6MjA1NjExOTMxNX0.LDpw67wOkEdA50OY03HhjtPLu5lxc0HFII5rJnVV3t8
```

## Troubleshooting

If you encounter any issues:

1. **Check permissions**: Make sure your RLS policies are correctly set up

2. **Check environment variables**: Verify that your `.env.local` file has the correct Supabase URL and key

3. **Check console errors**: Open the browser console to see any JavaScript errors

4. **Check Supabase logs**: Go to the "Logs" section in your Supabase dashboard to see any server-side errors 