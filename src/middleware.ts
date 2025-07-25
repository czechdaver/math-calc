import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

// List of supported locales
const locales = ['cs', 'en', 'sk', 'pl', 'hu'] as const;

const intlMiddleware = createIntlMiddleware({
  // List of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale: 'cs',
  
  // Don't use URL prefix for default locale
  localePrefix: 'as-needed',
  
  // Enable automatic locale detection
  localeDetection: true
});

export default function middleware(request: NextRequest) {
  // Skip API routes, _next, and static files
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') || 
    pathname.includes('.') ||
    pathname.startsWith('/images/')
  ) {
    return; // Skip i18n for these paths
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
