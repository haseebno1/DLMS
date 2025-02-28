import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define public routes that don't require authentication
  const isPublicRoute = path === '/' || path === '/login'

  // Check for admin authentication in cookies
  const isAdmin = request.cookies.get('isAdmin')?.value === 'true'

  // Redirect authenticated users from root or login to dashboard
  if (isPublicRoute && isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users trying to access protected routes to root
  if (!isPublicRoute && !isAdmin && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Add cache-control headers to improve performance
  const response = NextResponse.next()
  
  if (path.includes('/dashboard')) {
    // Prevent caching of dashboard routes
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    )
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  return response
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 