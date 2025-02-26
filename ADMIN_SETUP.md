# Admin Authentication Setup for DLMS

This guide will help you set up the admin authentication system for the Driver License Management System.

## 1. Supabase Configuration

### 1.1 Get Service Role Key

1. Log in to your Supabase dashboard at [https://app.supabase.com](https://app.supabase.com)
2. Navigate to your project: `https://tbmslfkurtqvfxnbtxju.supabase.co`
3. Go to Project Settings → API
4. Find the `service_role` key (it looks like a JWT token)
5. Copy this key - you'll need it for the next step

### 1.2 Configure Storage Bucket Policies

For each bucket (`license-images` and `license-signatures`), set up these policies:

1. **Public read access policy**:
   - Policy name: "Public Access"
   - Operation: SELECT
   - Target roles: All (public)
   - Policy definition: `bucket_id = 'bucket-name'` (replace 'bucket-name' with actual bucket name)

2. **Service role upload policy**:
   - Policy name: "Service Role Upload"
   - Operation: INSERT
   - Target roles: Service role
   - Policy definition: `bucket_id = 'bucket-name'`

### 1.3 Configure Table Policies

For the `licenses` table:

1. **Public read access policy**:
   - Already configured in your SQL schema

2. **Service role write access**:
   - Policy name: "Service Role Write Access"
   - Operations: INSERT, UPDATE, DELETE
   - Target roles: Service role
   - Policy definition: `true`

## 2. Environment Variables Setup

1. Edit your `.env.local` file:
   ```
   # Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=https://tbmslfkurtqvfxnbtxju.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibXNsZmt1cnRxdmZ4bmJ0eGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NDMzMTUsImV4cCI6MjA1NjExOTMxNX0.LDpw67wOkEdA50OY03HhjtPLu5lxc0HFII5rJnVV3t8

   # Admin configuration
   SUPABASE_SERVICE_KEY=your_service_role_key_here
   ADMIN_SECRET=choose_a_secure_admin_password
   ```

2. Replace `your_service_role_key_here` with the service role key you copied
3. Set `ADMIN_SECRET` to a strong password that admins will use to log in

## 3. Testing the Admin System

1. Start your application:
   ```
   npm run dev
   ```

2. Navigate to `/admin/login`
3. Enter the admin password you set in `ADMIN_SECRET`
4. After successful login, you should be able to access the dashboard and create licenses
5. If you get unauthorized errors, check that your service role key is correct

## Security Notes

1. The service role key has full access to your database - keep it secure
2. Never expose the service role key in client-side code
3. For production, consider implementing more robust authentication
4. All admin operations are handled server-side for security

## Troubleshooting

If you encounter issues:

1. Check the browser console for errors
2. Verify environment variables are correctly set
3. Make sure Supabase policies are properly configured
4. Check server logs for API route errors 