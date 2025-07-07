// app/trackers/[id]/checkpoints/[email]/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchTrackerById, completeCheckpoint } from '@/lib/api'
import { Tracker, Checkpoint } from '@/types/types'
import CheckpointForm from '@/components/CheckpointForm'

export default function CheckpointPage() {
  const { id, email } = useParams() as { id: string; email: string }
  const [tracker, setTracker] = useState<Tracker | null>(null)
  const [checkpoint, setCheckpoint] = useState<Checkpoint | null>(null)

  useEffect(() => {
    const load = async () => {
      const t = await fetchTrackerById(id)
      setTracker(t)
      const cp: Checkpoint | undefined = t.checkpoints.find(
        (c: Checkpoint) => decodeURIComponent(c.email.trim().toLowerCase()) === decodeURIComponent(email.trim().toLowerCase())
      );
      console.log('Loaded tracker:', t)
      console.log('Loaded checkpoint:', cp)
      setCheckpoint(cp || null)
    }
    load()
  }, [id, email])

  if (!tracker || !checkpoint) return <div>Loading...</div>

  if (!checkpoint) {
    return <p>Checkpoint not found for {email}</p>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded mt-8">
      <h1 className="text-2xl font-bold mb-4">Checkpoint Detail</h1>
      <div className="mb-4">
        <div><strong>Document:</strong> {tracker.type} ({tracker.privacy})</div>
        <div><strong>Email:</strong> {checkpoint.email}</div>
        <div><strong>Role:</strong> {checkpoint.role}</div>
        <div><strong>Status:</strong> {checkpoint.is_completed ? '✅ Completed' : '⏳ Pending'}</div>
      </div>
      <div className="mb-4">
        <strong>Note:</strong>
        <p className="p-2 bg-gray-100 rounded">{checkpoint.note || 'No note'}</p>
      </div>

      {!checkpoint.is_completed && (
        <CheckpointForm
          trackerId={tracker.id}
          email={checkpoint.email}
          onSubmit={async (data) => {
            await completeCheckpoint(data)
            alert('Checkpoint updated successfully!')
            // window.location.reload()
          }}
        />
      )}
    </div>
    

  )
}
