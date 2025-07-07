// app/trackers/[id]/checkpoints/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchTrackerById } from '@/lib/api'
import { Tracker } from '@/types/types'
import CheckpointList from '@/components/CheckpointList'

export default function CheckpointListPage() {
  const params = useParams() as Record<string, string | undefined>
  const id = params?.id
  const [tracker, setTracker] = useState<Tracker | null>(null)

  useEffect(() => {
    if (id) {
      fetchTrackerById(id as string)
        .then(setTracker)
        .catch(err => console.error('Failed to load tracker', err))
    }
  }, [id])

  if (!tracker) {
    return <div className="p-4 text-gray-500">Loading tracker...</div>
  }

  return (
    <CheckpointList tracker={tracker} />
  )
}
