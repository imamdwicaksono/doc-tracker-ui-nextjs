'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getTrackerById } from '@/lib/api'
import QRCodeModal from '@/components/QRCodeModal'
import { Checkpoint, Tracker } from '@/types/types'

export default function TrackerDetailPage() {
  const params = useParams()
  const id = params ? params['id'] : undefined
  const [tracker, setTracker] = useState<Tracker | null>(null)

  useEffect(() => {
    if (!id) return
    getTrackerById(id as string).then(setTracker).catch(err => {
      console.error('Failed to fetch tracker:', err)
    })
  }, [id])

  if (!tracker) return <div className="p-6 text-gray-600">Loading...</div>

  return (
    <div className="max-w-3xl p-6 pb-32 mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold">Detail Tracker</h1>
      <div className="mt-4 space-y-1 text-sm text-gray-700">
        <p><strong>ID:</strong> {tracker.id}</p>
        <p><strong>Status:</strong> {tracker.status}</p>
        <p><strong>Creator:</strong> {tracker.creator}</p>
        <p><strong>Type:</strong> {tracker.type}</p>
        <p><strong>Privacy:</strong> {tracker.privacy}</p>
        <p><strong>Created At:</strong> {new Date(tracker.created_at * 1000).toLocaleString()}</p>
        <p><strong>Target End:</strong> {tracker.target_end}</p>
        <p><strong>Total Checkpoints:</strong> {tracker.checkpoints.length}</p>
      </div>

      <div className="mt-4">
        <h2 className="mb-1 text-sm font-semibold">📦 Barcode:</h2>
        <QRCodeModal value={tracker.id} />
      </div>

      <p className="mt-2 text-sm text-gray-600">
        🖋️ Signers: {tracker.checkpoints.filter(cp => cp.role === 'signer').length} | 🚚 Couriers: {tracker.checkpoints.filter(cp => cp.role === 'courier').length}
      </p>


      <h2 className="mt-8 mb-2 text-xl font-semibold">Checkpoints</h2>

      <ul className="space-y-4">
        {tracker.checkpoints.map((cp: Checkpoint, index: number) => {
          const emails = cp.emails ?? (cp.email ? [cp.email] : [])
          const addresses = cp.addresses ?? (cp.address ? [cp.address] : [])

          return (
            <li key={index} className="p-4 border rounded bg-gray-50">
              <p className="text-sm font-medium text-gray-800">
                <strong>Checkpoint #{index + 1}</strong>
              </p>
              <p className="text-sm">
                <strong>Role:</strong> {cp.role} | <strong>Type:</strong> {cp.type}
              </p>
              {cp.company && (
                <p className="text-sm">
                  <strong>Company:</strong> {cp.company}
                </p>
              )}

              <div className="mt-1 text-sm">
                <strong>Emails:</strong>
                {emails.length > 0 ? (
                  <ul className="ml-5 list-disc">
                    {emails.map((email, i) => (
                      <li key={i} className="text-gray-700">
                        {email}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span> — </span>
                )}
              </div>

              <div className="mt-1 text-sm">
                <strong>Addresses:</strong>
                {addresses.length > 0 ? (
                  <ul className="ml-5 list-disc">
                    {addresses.map((addr, i) => (
                      <li key={i} className="font-mono text-xs break-all">
                        {addr}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span> — </span>
                )}
              </div>

              <div className="mt-1 text-sm">
                <strong>Status:</strong> {cp.is_completed ? '✅ Completed' : '⏳ Pending'}
              </div>

              {cp.completed_at && (
                <p className="text-sm text-gray-600">
                  <strong>Completed At:</strong>{' '}
                  {new Date(cp.completed_at * 1000).toLocaleString()}
                </p>
              )}

              {cp.evidence_path && (
                <div className="mt-2">
                  <a
                    href={cp.evidence_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View Evidence
                  </a>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
