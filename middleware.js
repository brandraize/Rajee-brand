import { NextResponse } from 'next/server';

const protectedRoutes = ['/admin', '/seller/add-listing'];
const authRoutes = ['/auth/login', '/auth/register'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Skip middleware for protected routes - let client-side auth handle it
  // Firebase Auth works on client-side, not server-side middleware
  if (isProtectedRoute) {
    return NextResponse.next();
  }

  // For auth routes, let client-side handle redirects
  if (isAuthRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
