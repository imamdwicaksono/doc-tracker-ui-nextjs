/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import LoginOTPForm from '@/components/auth/LoginFormWithOtp'
import TrackerModeCheckpointPage from './TrackerMode'
import { checkAuth } from '@/lib/api'

type AuthData = {
  email?: string
  tracker_id?: string
  login_with?: 'email' | 'tracker'
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [authStatus, setAuthStatus] = useState<'loading' | 'unauthenticated' | 'authenticated'>('loading')
  const [authData, setAuthData] = useState<AuthData | null>(null)

  // --- Cek login ---
  useEffect(() => {
    const verify = async () => {
      try {
        const result = await checkAuth()
        if (result && result.login_with) {
          setAuthData(result)
          setAuthStatus('authenticated')
        } else {
          setAuthStatus('unauthenticated')
        }
      } catch {
        setAuthStatus('unauthenticated')
      }
    }
    verify()
  }, [])

  // --- Loading auth ---
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

  // --- Belum login ---
  if (authStatus === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
        <div className="flex flex-col items-center justify-center w-full max-w-sm px-6">
          <img
            src="/images/mmslogo.png"
            alt="MMS Logo"
            className="object-contain w-24 h-24 mx-auto mb-8"
          />
          <h2 className="mb-1 text-3xl font-extrabold text-gray-800">
            Welcome to <span className="text-blue-600">DocTrack</span>
          </h2>
          <p className="mb-10 text-sm text-gray-500">
            Secure login with your email or tracker OTP
          </p>
          <div className="w-full">
            <LoginOTPForm />
          </div>
          <p className="mt-10 text-xs text-gray-400">
            © {new Date().getFullYear()} DocTrack. All rights reserved.
          </p>
        </div>
      </div>
    )
  }

  // --- Mode tracker ---
  if (authStatus === 'authenticated' && authData?.login_with === 'tracker') {
    return <TrackerModeCheckpointPage />;
  }

  // --- Mode user biasa ---
  return <>{children}</>
}
