import createIntlMiddleware from 'next-intl/middleware';

// Create the middleware with simplified configuration
export default createIntlMiddleware({
  // A list of all locales that are supported
  locales: ['cs', 'en', 'sk', 'pl', 'hu'],
  
  // Used when no locale matches
  defaultLocale: 'cs'
});

export const config = {
  // Match all paths except for static files and API routes
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
