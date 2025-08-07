import { NextRequest, NextResponse } from 'next/server';

// Simple middleware without next-intl dependency
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // If accessing root, redirect to /cs
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/cs', request.url));
  }
  
  // Allow all other requests to proceed
  return NextResponse.next();
}

export const config = {
  // Match all paths except for static files and API routes
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
