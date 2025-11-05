'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'react-qr-code'
import { toPng } from 'html-to-image'

export default function QRCodeModal({ value }: { value: string }) {
  const [show, setShow] = useState(false)
  const qrRef = useRef<HTMLDivElement | null>(null)

  // 🧩 Efek: matikan scroll body saat modal terbuka, hidupkan lagi saat tutup
  useEffect(() => {
    if (show) {
      // simpan posisi scroll agar tidak lompat saat ditutup
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.overflow = 'hidden'
      document.body.style.width = '100%'
    } else {
      // kembalikan posisi scroll
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
      document.body.style.width = ''
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }
  }, [show])

  const handleDownload = async () => {
    if (!qrRef.current) return
    const dataUrl = await toPng(qrRef.current)
    const link = document.createElement('a')
    link.download = 'qr-code.png'
    link.href = dataUrl
    link.click()
  }

  return (
    <div>
      <button
        onClick={() => setShow(true)}
        className="text-sm text-blue-600 underline"
      >
        Show QR
      </button>

      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-60"
          onClick={() => setShow(false)} // klik luar = tutup modal
        >
          <div
            className="p-6 text-center bg-white rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // cegah close saat klik dalam
          >
            <h2 className="mb-2 text-lg font-bold">QR Code</h2>
            <div ref={qrRef} className="inline-block p-4 bg-white">
              <QRCode value={value} size={160} />
            </div>
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={handleDownload}
                className="px-4 py-1 text-sm text-white bg-blue-600 rounded"
              >
                Download PNG
              </button>
              <button
                onClick={() => setShow(false)}
                className="px-4 py-1 text-sm text-gray-800 bg-gray-300 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
