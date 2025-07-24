import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

// List of supported locales
const locales = ['cs', 'en'] as const;

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: locales as unknown as string[],
  
  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: 'en',
  
  // Enable automatic locale detection (based on the `accept-language` header)
  localeDetection: true,
  
  // Configure the domain for each locale (optional)
  // domains: [
  //   {
  //     domain: 'example.com',
  //     defaultLocale: 'en',
  //   },
  //   {
  //     domain: 'example.cz',
  //     defaultLocale: 'cs',
  //   },
  // ],
});

export function middleware(request: NextRequest) {
  // Skip API routes, _next, and static files
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') || 
    pathname.includes('.') ||
    pathname.startsWith('/images/')
  ) {
    return NextResponse.next();
  }
  
  // Handle internationalized routing
  return intlMiddleware(request);
}

export const config = {
  // Match all paths except for static files and API routes
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
