# Driver License Management System (DLMS)

A modern web application for managing driver licenses, built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- 🔐 Secure Admin Authentication
- 📝 License Creation and Management
- 🔍 Advanced Search and Filtering
- 📸 Photo and Signature Upload
- 🖨️ License Printing
- 🌓 Dark/Light Mode
- 📱 Responsive Design
- 🚀 Real-time Updates

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database & Auth:** Supabase
- **Styling:** Tailwind CSS + Shadcn UI
- **Forms:** React Hook Form + Zod
- **State Management:** React Hooks
- **File Storage:** Supabase Storage

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Supabase account and project
- Git installed

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dlms.git
   cd dlms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your environment variables in `.env.local`

4. **Supabase Setup**
   - Create a new Supabase project
   - Set up the database tables (schema provided in documentation)
   - Create storage buckets for license images and signatures
   - Copy your project URL and keys to `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   ```

## Deployment

1. **Prepare for deployment**
   - Ensure all environment variables are set
   - Build the project locally to check for errors:
     ```bash
     npm run build
     ```

2. **Deploy to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

   Or deploy using the Vercel dashboard:
   - Push your code to GitHub
   - Import the repository in Vercel
   - Configure environment variables
   - Deploy!

## Environment Variables

Required environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# Admin Auth
ADMIN_SECRET=
ADMIN_EMAIL=
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@yourdomain.com or open an issue in the repository.