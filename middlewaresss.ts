// import { NextRequest, NextResponse } from 'next/server'

// // Protected routes that require authentication
// const protectedRoutes = [
//   '/dashboard',
//   '/audit',
//   '/crawl',
//   '/compare',
//   '/history',
//   '/rank-tracking',
//   '/backlinks',
//   '/keywords',
//   '/platform',
// ]

// // Public routes accessible without authentication
// const publicRoutes = [
//   '/',
//   '/signin',
//   '/register',
//   '/blog',
//   '/pricing',
//   '/privacy',
//   '/terms',
//   '/use-cases',
// ]

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl
//   // console.log("middleware check :", pathname)
//   const token = request.cookies.get('access_token')?.value

//   // Check if the route is protected
//   const isProtected = protectedRoutes.some(route => 
//     pathname.startsWith(route)
//   )

//   // Check if the route is public
//   const isPublic = publicRoutes.some(route => 
//     pathname === route || pathname.startsWith(route + '/')
//   )

//   // If route is protected and no token, redirect to signin
//   if (isProtected && !token) {
//     const signinUrl = new URL('/signin', request.url)
//     signinUrl.searchParams.set('redirect', pathname)
//     return NextResponse.redirect(signinUrl)
//   }

//   // If user is signed in and tries to access signin/register, redirect to dashboard
//   if ((pathname === '/signin' || pathname === '/register') && token) {
//     return NextResponse.redirect(new URL('/dashboard', request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// }
