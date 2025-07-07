import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const cookieToken = request.cookies.get('authToken')?.value

  // Ambil token dari Authorization Header jika ada
  const authHeader = request.headers.get('authorization') || ''
  const headerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  const token = cookieToken || headerToken

  const isAuthPage = request.nextUrl.pathname === '/auth/login'

  console.log('Middleware triggered:', {
    token,
    isAuthPage,
  })

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Jalankan middleware untuk semua halaman, kecuali API, static (_next), favicon, dan /auth/login
export const config = {
  matcher: ['/((?!api|_next|favicon.ico|auth/login).*)'],
}
