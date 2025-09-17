'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchTrackerById, completeCheckpoint, getCurrentUserEmail } from '@/lib/api'
import { Tracker, Checkpoint } from '@/types/types'
import CheckpointForm from '@/components/CheckpointForm'
import { showAlertDanger, showAlertSuccess } from '@/lib/sweetalert-alert'

export default function CheckpointPage() {
  const { id, email } = useParams() as { id: string; email: string }
  const [tracker, setTracker] = useState<Tracker | null>(null)
  const [checkpoint, setCheckpoint] = useState<Checkpoint | null>(null)
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null)
  const [canSubmit, setCanSubmit] = useState(false)
  const [, setPreviousCheckpointsStatus] = useState<Checkpoint[]>([])
  const [activeModal, setActiveModal] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const userEmail = await getCurrentUserEmail()
      setCurrentUserEmail(userEmail)

      const t = await fetchTrackerById(id)
      setTracker(t)

      const cp: Checkpoint | undefined = t.checkpoints.find(
        (c: Checkpoint) =>
          decodeURIComponent(c.email.trim().toLowerCase()) ===
          decodeURIComponent(email.trim().toLowerCase())
      )
      setCheckpoint(cp || null)

      if (!cp || !userEmail) {
        setCanSubmit(false)
        return
      }

      // Access control
      const isPrivate = t.privacy === 'private'
      const isOwnerOrCheckpoint =
        userEmail.trim().toLowerCase() === t.creator.trim().toLowerCase() ||
        userEmail.trim().toLowerCase() === cp.email.trim().toLowerCase()

      if (isPrivate && !isOwnerOrCheckpoint) {
        setCanSubmit(false)
        return
      }

      // previous checkpoints
      const idx = t.checkpoints.findIndex((c: Checkpoint) => c.email === cp.email)
      const previous = idx > 0 ? t.checkpoints.slice(0, idx) : []
      setPreviousCheckpointsStatus(previous)

      const allPreviousCompleted =
        previous.length === 0 ? true : previous.every((c: Checkpoint) => c.is_completed)
      const isTrackerInProgress = t.status === 'progress'
      const isUserOwner = cp.email.trim().toLowerCase() === userEmail.trim().toLowerCase()

      setCanSubmit(allPreviousCompleted && isTrackerInProgress && !cp.is_completed && isUserOwner)
    }

    load()
  }, [id, email])

  if (!tracker || !checkpoint) return <div>Loading...</div>

  // Access control for private document
  if (tracker.privacy === 'private') {
    const userEmailLower = currentUserEmail?.toLowerCase()
    if (
      userEmailLower !== tracker.creator.toLowerCase() &&
      userEmailLower !== checkpoint.email.toLowerCase()
    ) {
      return (
        <p className="text-red-500">
          You are not authorized to view this private document.
        </p>
      )
    }
  }

  return (
    <div className="max-w-3xl p-6 mx-auto mt-8 bg-white rounded shadow">
      <h1 className="mb-6 text-2xl font-bold">Checkpoint Detail</h1>

      <div className="mb-6 space-y-2">
        <div>
          <strong>Document:</strong> {tracker.type} ({tracker.privacy})
        </div>
        <div>
          <strong>Email:</strong> {checkpoint.email}
        </div>
        <div>
          <strong>Role:</strong> {checkpoint.role}
        </div>
        <div>
          <strong>Status:</strong>{' '}
          {checkpoint.is_completed ? '✅ Completed' : '⏳ Pending'}
        </div>
      </div>

      <div className="mb-6">
        <strong>Note:</strong>
        <p className="p-2 bg-gray-100 rounded">{checkpoint.note || 'No note'}</p>
      </div>

      {/* Stepper visual responsive */}
      <div className="flex items-center mb-6 space-x-2 overflow-x-auto">
        {tracker.checkpoints.map((c, idx) => {
          const completed = c.is_completed
          const active = c.email === checkpoint.email
          return (
            <div key={c.email} className="relative flex items-center">
              <button
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                  completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : active
                    ? 'border-blue-500 text-blue-500'
                    : 'border-gray-300'
                }`}
                onClick={() =>
                  setActiveModal(activeModal === c.email ? null : c.email)
                }
              >
                {idx + 1}
              </button>

              {idx < tracker.checkpoints.length - 1 && (
                <div
                  className={`flex-1 h-1 ${
                    tracker.checkpoints[idx].is_completed
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              )}

              {/* Modal tooltip */}
              {activeModal === c.email && (
                <div className="fixed z-50 w-64 p-3 text-sm transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded shadow-lg top-1/2 left-1/2">
                  <p><strong>Email:</strong> {c.email}</p>
                  <p><strong>Role:</strong> {c.role}</p>
                  <p><strong>Note:</strong> {c.note || 'No note'}</p>
                  <p><strong>Status:</strong> {c.is_completed ? '✅ Completed' : '⏳ Pending'}</p>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-2 py-1 mt-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Form submit */}
      {canSubmit ? (
        <CheckpointForm
          trackerId={tracker.id}
          email={checkpoint.email}
          onSubmit={async (data) => {
            const result = await completeCheckpoint(data)
            if (!result) {
              showAlertDanger({
                title: 'Error',
                html: 'Failed to update checkpoint',
                confirmButtonText: 'OK',
              })
              return
            }
            showAlertSuccess({
              title: 'Success',
              html: 'Checkpoint updated successfully!',
              confirmButtonText: 'OK',
            })
          }}
        />
      ) : (
        <p className="text-red-500">
          {!currentUserEmail ||
          currentUserEmail.toLowerCase() !== checkpoint.email.toLowerCase()
            ? 'You are not authorized to complete this checkpoint.'
            : tracker.status !== 'progress'
            ? 'Tracker is not in progress.'
            : 'Previous checkpoints must be completed first.'}
        </p>
      )}
    </div>
  )
}
