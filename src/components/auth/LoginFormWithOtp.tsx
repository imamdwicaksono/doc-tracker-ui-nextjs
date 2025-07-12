'use client'

import { useState } from 'react'
import { requestOtp, requestVerifyOtp } from '@/lib/api'
import { useRouter } from 'next/navigation'
import LoadingOverlay from '@/components/LoadingOverlay'
import { showAlertDanger } from '@/lib/sweetalert-alert'

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
      // alert('Failed to send OTP')
      showAlertDanger({
            title: 'Error',
            html: 'Failed to send OTP',
            confirmButtonText: 'OK',
          });

    } finally {
      setIsLoading(false)
    }
  }

  const handlerVerifyOtp = async () => {
    setIsLoading(true)
    try {
      const res = await requestVerifyOtp(email, otp)
      if (res.status === 200) {
        // ✅ Paksa redirect tanpa menunggu session load
        router.replace('/')               // Ganti route sekarang juga
        setTimeout(() => {
          window.location.reload()       // Optional: force reload agar session pasti terdeteksi
        }, 100)                           // Delay kecil agar router selesai
      } else {
        // alert('Invalid OTP')
        showAlertDanger({
          title: 'Error',
          html: 'Invalid OTP',
          confirmButtonText: 'OK',
        });
      }
    } catch (e) {
      console.error(e)
      // alert('Verification failed')
      showAlertDanger({
        title: 'Error',
        html: 'Verification failed',
        confirmButtonText: 'OK',
      });
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="justify-center min-h-screen">
      <div className="w-full max-w-md text-center">
        {/* <h1 className="mb-4 text-gray-800 text-bold font-old">Login via Email OTP</h1> */}

        {isLoading ? (
          <LoadingOverlay />
        ) : step === 'input' ? (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring"
              placeholder="Enter your email"
            />
            <button
              onClick={handlerRequestOtp}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Request OTP
            </button>
          </>
        ) : (
          <>
            <p className="mb-2 text-sm text-gray-500">OTP sent to <strong>{email}</strong></p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring"
              placeholder="Enter OTP"
            />
            <button
              onClick={handlerVerifyOtp}
              className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  )
}
