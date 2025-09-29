import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('kanban_token')?.value
    const isAuthPage = request.nextUrl.pathname === '/login' ||
        request.nextUrl.pathname === '/signup'
    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')

    // redirigir a dashboard
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    //redirigir a login
    if (!token && isDashboard) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/login', '/signup', '/dashboard/:path*']
}