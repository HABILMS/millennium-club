import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dsosgpzpxwzsuoxqdghn.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzb3NncHpweHd6c3VveHFkZ2huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMjkyNDksImV4cCI6MjEwNDkwNTI0OX0.pfbQa-JET7Xj3J7n3t-SBX-UlWnjUFRqSHSRgHHnXjc";

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/app') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/admin')) {
    // No ambiente local de desenvolvimento (localhost), permite visualizar o admin para testes
    const isDevMode = process.env.NODE_ENV === 'development' || request.nextUrl.hostname === 'localhost'

    if (!isDevMode) {
      if (!user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('next', pathname)
        return NextResponse.redirect(url)
      }

      // Verificar se o usuário possui papel de administrador ou compliance em produção
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || (profile.role !== 'admin' && profile.role !== 'compliance')) {
        const url = request.nextUrl.clone()
        url.pathname = '/app'
        url.searchParams.set('error', 'unauthorized')
        return NextResponse.redirect(url)
      }
    }
  }

  return response
}

export const config = {
  matcher: ['/app/:path*', '/admin/:path*'],
}

