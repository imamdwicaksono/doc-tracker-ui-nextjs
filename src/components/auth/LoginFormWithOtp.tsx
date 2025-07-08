'use client'
import { useState } from 'react'
import { requestOtp, requestVerifyOtp } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function LoginOTPForm() {
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [step, setStep] = useState<'input' | 'verify'>('input')
    const router = useRouter() // ✅ gunakan hook yang benar

    const handlerRequestOtp = async () => {
    const res = await requestOtp(email)
        if (res.status === 200) {
            setStep('verify')
        } else {
            setStep('input')
        }
    }

    const handlerVerifyOtp = async () => {
      const res = await requestVerifyOtp(email, otp);

      if (res.status === 200) {
        router.push("/");
      } else {
        alert("Invalid OTP");
      }
    };

  return (
    <div className="max-w-md p-4 mx-auto">
      <h1 className="mb-4 text-xl font-bold">Login via Email OTP</h1>
      {step === 'input' ? (
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
