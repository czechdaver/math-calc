import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Custom middleware wrapper
function middleware(request: NextRequest) {
  // Continue with next-intl middleware for locale handling
  return createIntlMiddleware({
    locales: ['cs', 'en', 'sk', 'pl', 'hu'],
    defaultLocale: 'cs'
  })(request);
}

export default middleware;

export const config = {
  // Match all paths except for static files and API routes
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
