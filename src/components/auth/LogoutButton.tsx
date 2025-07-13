'use client'

import { useEffect, useState } from 'react'
import { checkAuth, logout } from '@/lib/api'

export default function LogoutButton({ className = 'flex flex-col items-center text-blue-600 cursor-pointer', iconOnly = false }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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
      window.location.reload()
    }
  }

  if (!isAuthenticated) return null

  return (
    <button onClick={handleLogout} className={className}>
      {iconOnly ? (
        <span className="material-icons">logout</span>
      ) : (
        <span className="flex items-center">
          <span className="material-icons">logout</span>
          <span className="ml-2">Logout</span>
        </span>
      )}
    </button>
  )
}
