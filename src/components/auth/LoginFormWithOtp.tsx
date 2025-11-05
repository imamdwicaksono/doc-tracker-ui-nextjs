/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { requestOtp, requestVerifyOtp } from '@/lib/api'
// import { useRouter } from 'next/navigation'
import LoadingOverlay from '@/components/LoadingOverlay'
import { showAlertDanger } from '@/lib/sweetalert-alert'

export default function LoginOTPForm() {
  const [identifier, setIdentifier] = useState('') // email atau tracker ID
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'input' | 'verify'>('input')
  const [isLoading, setIsLoading] = useState(false)
  const [trackerTarget, setTrackerTarget] = useState<string | null>(null)
  // const router = useRouter()

  const isEmail = identifier.includes('@')

  // === Step 1: Request OTP ===
  const handlerRequestOtp = async () => {
    if (!identifier) {
      showAlertDanger({
        title: 'Error',
        html: 'Please enter your Email or Tracker ID.',
        confirmButtonText: 'OK',
      })
      return
    }

    setIsLoading(true)
    try {
      const data = await requestOtp(identifier)
      if (data.tracker_id) {
        setTrackerTarget(data.tracker_id)
      }
      setStep('verify')
    } catch (e: any) {
      console.error(e)
      showAlertDanger({
        title: 'Error',
        html: e.message || 'Failed to send OTP.',
        confirmButtonText: 'OK',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // === Step 2: Verify OTP ===
  const handlerVerifyOtp = async () => {
    if (!otp) {
      showAlertDanger({
        title: 'Error',
        html: 'Please enter your OTP.',
        confirmButtonText: 'OK',
      })
      return
    }

    setIsLoading(true)
    try {
      const res = await requestVerifyOtp(identifier, otp)
      if (res.status === 200) {
        // ✅ Redirect penuh, bukan router.replace
        if (trackerTarget) {
          window.location.href = `/trackers/${trackerTarget}`
        } else {
          window.location.href = '/trackers'
        }
      } else {
        showAlertDanger({
          title: 'Error',
          html: 'Invalid OTP. Please try again.',
          confirmButtonText: 'OK',
        })
      }
    } catch (e) {
      console.error(e)
      showAlertDanger({
        title: 'Error',
        html: 'Verification failed.',
        confirmButtonText: 'OK',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      {isLoading ? (
        <LoadingOverlay />
      ) : step === 'input' ? (
        <>
          <label className="block mb-2 text-sm font-medium text-left text-gray-700">
            Email or Tracker ID
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value.trim())}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your email or tracker ID"
          />
          <button
            onClick={handlerRequestOtp}
            className="w-full py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {isEmail ? 'Request OTP' : 'Request Access OTP'}
          </button>
          {!isEmail && (
            <p className="mt-2 text-xs text-center text-gray-500">
              OTP will be sent to the tracker creator for approval.
            </p>
          )}
        </>
      ) : (
        <>
          <p className="mb-2 text-sm text-center text-gray-500">
            {isEmail
              ? `OTP sent to ${identifier}`
              : `OTP sent to creator of Tracker ID: ${identifier}`}
          </p>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 mb-4 tracking-widest text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder="Enter OTP"
          />
          <button
            onClick={handlerVerifyOtp}
            className="w-full py-3 font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
          >
            Verify OTP
          </button>

          {/* tampilkan trackerTarget agar lint tidak warning */}
          {step === 'verify' && trackerTarget && (
            <p className="mt-1 text-xs text-center text-gray-500">
              Tracker target: {trackerTarget}
            </p>
          )}

          <button
            onClick={() => setStep('input')}
            className="w-full py-2 mt-3 text-sm text-gray-600 underline hover:text-gray-800"
          >
            Change {isEmail ? 'Email' : 'Tracker ID'}
          </button>
        </>
      )}
    </div>
  )
}
