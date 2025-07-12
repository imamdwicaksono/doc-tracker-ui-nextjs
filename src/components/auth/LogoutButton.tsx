'use client'

import { useEffect, useState } from 'react'
import { checkAuth, logout } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function LogoutButton({ className = 'flex flex-col items-center text-blue-600' }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function verify() {
      const result = await checkAuth()
      setIsAuthenticated(result)
    }
    verify()
  }, [])

  const handleLogout = async () => {
    const res = await logout()
    if (res.status == 200) {
      router.push('/')
    }
  }

  if (!isAuthenticated) return null

  return (
    <button onClick={handleLogout} className={className}>
      Logout
    </button>
  )
}
