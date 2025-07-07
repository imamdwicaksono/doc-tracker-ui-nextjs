// app/trackers/[id]/page.tsx
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
    getTrackerById(id as string).then(setTracker)
  }, [id])

  if (!tracker) return <div>Loading...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Detail Tracker</h1>
      <p><strong>ID:</strong> {tracker.id}</p>
      <p><strong>Status:</strong> {tracker.status}</p>
      <p><strong>Creator:</strong> {tracker.creator_address}</p>
      <p><strong>Type:</strong> {tracker.type}</p>
      <p><strong>Privacy:</strong> {tracker.privacy}</p>
      <p><strong>Created At:</strong> {new Date(tracker.created_at * 1000).toLocaleString()}</p>
      <p><strong>Target End:</strong> {tracker.target_end}</p>
      <p><strong>Trackers:</strong> {tracker.checkpoints.length}</p>
      <p><strong>Barcode:</strong></p>
      <p>
        <div className="mt-4">
          <h2 className="mb-1 text-sm font-semibold">📦 Barcode:</h2>
          <QRCodeModal value={tracker.id} />
        </div>
      </p>

      <h2 className="mt-6 text-xl font-semibold">Checkpoints</h2>
      <ul className="mt-2 space-y-2">
        {tracker.checkpoints.map((cp: Checkpoint, index: number) => (
          <li key={index} className="p-4 border rounded">
            <p><strong>To:</strong> {cp.email}</p>
            <p><strong>Status:</strong> {cp.is_completed ? '✅ Completed' : '⏳ Pending'}</p>
            {cp.evidence_path && <a className="text-blue-600" href={cp.evidence_path} target="_blank">View Evidence</a>}
          </li>
        ))}
      </ul>
    </div>
  )
}
