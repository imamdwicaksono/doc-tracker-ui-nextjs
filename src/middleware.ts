import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value

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
  const response = NextResponse.next()

  return response
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico|auth/login).*)'],
}
