'use client'
import { useState } from 'react'
import { requestOtp, requestVerifyOtp } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function LoginOTPForm() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'input' | 'verify'>('input')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlerRequestOtp = async () => {
    setIsLoading(true)
    try {
      const res = await requestOtp(email)
      if (res.status === 200) {
        setStep('verify')
      } else {
        setStep('input')
      }
    } catch (e) {
      console.error(e)
      alert("Failed to send OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handlerVerifyOtp = async () => {
    setIsLoading(true)
    try {
      const res = await requestVerifyOtp(email, otp)
      if (res.status === 200) {
        router.push('/')
      } else {
        alert('Invalid OTP')
      }
    } catch (e) {
      console.error(e)
      alert('Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md p-4 mx-auto">
      <h1 className="mb-4 text-xl font-bold">Login via Email OTP</h1>

      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-500 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </div>
      ) : step === 'input' ? (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-2 border"
            placeholder="Enter your email"
          />
          <button onClick={handlerRequestOtp} className="px-4 py-2 text-white bg-blue-600 rounded">
            Request OTP
          </button>
        </>
      ) : (
        <>
          <p className="mb-2">OTP sent to {email}</p>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 mb-2 border"
            placeholder="Enter OTP"
          />
          <button onClick={handlerVerifyOtp} className="px-4 py-2 text-white bg-green-600 rounded">
            Verify
          </button>
        </>
      )}
    </div>
  )
}
