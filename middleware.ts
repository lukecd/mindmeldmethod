import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the response
  const response = NextResponse.next()
  
  // Add headers to disable compression
  response.headers.set('Cache-Control', 'no-store, must-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  
  return response
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    // Apply to all paths except static files and API routes
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
} 