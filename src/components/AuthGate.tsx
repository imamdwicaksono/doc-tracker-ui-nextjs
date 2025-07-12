'use client'

import { useEffect, useState } from 'react'
import LoginOTPForm from '@/components/auth/LoginFormWithOtp'
import { checkAuth } from '@/lib/api'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [authStatus, setAuthStatus] = useState<'loading' | 'unauthenticated' | 'authenticated'>('loading')

  useEffect(() => {
    const verify = async () => {
      try {
        const result = await checkAuth()
        setAuthStatus(result ? 'authenticated' : 'unauthenticated')
      } catch {
        setAuthStatus('unauthenticated')
      }
    }
    verify()
  }, [])

  if (authStatus === 'loading') {
    return (
      <div className="grid min-h-screen bg-white place-items-center">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
          <p className="mt-4 text-gray-500">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (authStatus === 'unauthenticated') {
    return (
      <div className="grid min-h-screen px-4 bg-gray-100 place-items-center">
        <div className="w-full max-w-md p-6 text-center bg-white shadow-md rounded-xl">
          <img src="/images/mmslogo.png" alt="Logo" className="w-20 h-20 mx-auto mb-4" />
          <h2 className="mb-2 text-xl font-bold">Welcome to DocTrack</h2>
          <p className="mb-6 text-gray-500">Login with your email OTP</p>
          <LoginOTPForm />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
