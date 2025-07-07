'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

function getTokenFromCookie(): string | null {
  const match = document.cookie.match(/(^| )authToken=([^;]+)/)
  return match ? match[2] : null
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
        const token = getTokenFromCookie()
    const isLoginPage = pathname === '/auth/login'

    if (!token && !isLoginPage) {
      router.push('/auth/login')
      return
    }

    if (token && isLoginPage) {
      router.push('/')
      return
    }

    setIsLoading(false)
  }, [pathname, router])

  if (isLoading) {
    return <p className="py-4 text-center">Checking authentication...</p>
  }

  return <>{children}</>
}


