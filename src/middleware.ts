import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Custom middleware wrapper to handle redirects
function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Redirect broken /calculator/bmi routes to /calculator/bmi-new
  // This handles both /calculator/bmi and /[locale]/calculator/bmi
  if (pathname.match(/^\/[a-z]{2}\/calculator\/bmi\/?$/) || pathname === '/calculator/bmi') {
    const newPath = pathname.replace(/\/bmi\/?$/, '/bmi-new/');
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Continue with next-intl middleware
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
