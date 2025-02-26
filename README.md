# DLMS

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/haseebno1/DLMS)

## Authentication System

The Driver License Management System uses a unified authentication system for both user verification and admin access:

1. **Login Process**:
   - Users and admins use the same login form
   - For admin authentication, use the admin email (set in .env) and admin secret
   - For regular users, CNIC verification is used

2. **Authentication Storage**:
   - Authentication tokens are stored in either localStorage (for "Remember me") or sessionStorage
   - Tokens include expiration information for enhanced security

3. **Protected Routes**:
   - Admin dashboard routes are protected with the AdminAuth component
   - This component verifies valid admin tokens before allowing access

4. **Environment Configuration**:
   - `ADMIN_SECRET`: Password for admin authentication
   - `ADMIN_EMAIL`: Email address for admin login

## Development Setup