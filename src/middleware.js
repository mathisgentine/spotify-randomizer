import { NextResponse } from 'next/server';

export function middleware(req) {
  const { cookies } = req; // Access cookies from the request
  const token = cookies.get('spotify_access_token');

  // If token is not present, redirect to the landing page
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Allow request to proceed if token exists
  return NextResponse.next();
}

// Define which routes this middleware applies to
export const config = {
  matcher: ['/randomize', '/history'],
};
