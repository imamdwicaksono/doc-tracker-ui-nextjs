'use client'

import { useEffect, useState } from 'react'
import { redirect, useParams } from 'next/navigation'
import {
  fetchTrackerById,
  completeCheckpoint,
  getCurrentUserEmail,
} from '@/lib/api'
import { Tracker, Checkpoint } from '@/types/types'
import CheckpointForm from '@/components/CheckpointForm'
import { showAlertDanger, showAlertSuccess } from '@/lib/sweetalert-alert'

const normalize = (v?: string) => (v ?? '').trim().toLowerCase()

const isUserInCheckpoint = (cp: Checkpoint, email: string) =>
  (cp.emails ?? []).some(e => normalize(e) === normalize(email))

export default function CheckpointPage() {
  const { id, email } = useParams() as { id: string; email: string }

  const [tracker, setTracker] = useState<Tracker | null>(null)
  const [checkpoint, setCheckpoint] = useState<Checkpoint | null>(null)
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('')
  const [canSubmit, setCanSubmit] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const userEmail = await getCurrentUserEmail()
      if (!userEmail) return

      setCurrentUserEmail(userEmail)

      const t = await fetchTrackerById(id)
      setTracker(t)

      const cp = t.checkpoints.find((c: Checkpoint) =>
        isUserInCheckpoint(c, decodeURIComponent(email)),
      )

      if (!cp) {
        setCheckpoint(null)
        setCanSubmit(false)
        return
      }

      setCheckpoint(cp)

      // 🔐 ACCESS CONTROL
      if (
        t.privacy === 'private' &&
        normalize(userEmail) !== normalize(t.creator) &&
        !isUserInCheckpoint(cp, userEmail)
      ) {
        setCanSubmit(false)
        return
      }

      // 🧠 ORDER VALIDATION
      const index = t.checkpoints.indexOf(cp)
      const previous = index > 0 ? t.checkpoints.slice(0, index) : []

      const allPreviousCompleted = previous.every((c: Checkpoint) => c.is_completed)
      const isTrackerInProgress = t.status === 'progress'
      const isUserCheckpoint = isUserInCheckpoint(cp, userEmail)

      setCanSubmit(
        allPreviousCompleted &&
          isTrackerInProgress &&
          !cp.is_completed &&
          isUserCheckpoint,
      )
    }

    load()
  }, [id, email])

  if (!tracker || !checkpoint) {
    return <div className="p-6 text-center">Loading…</div>
  }

  // 🔐 FINAL ACCESS GUARD
  if (
    tracker.privacy === 'private' &&
    normalize(currentUserEmail) !== normalize(tracker.creator) &&
    !isUserInCheckpoint(checkpoint, currentUserEmail)
  ) {
    return (
      <p className="p-6 text-red-500">
        You are not authorized to view this private document.
      </p>
    )
  }

  return (
    <div className="max-w-3xl p-6 mx-auto mt-8 bg-white rounded shadow">
      <h1 className="mb-6 text-2xl font-bold">Checkpoint Detail</h1>

      {/* INFO */}
      <div className="mb-6 space-y-2">
        <div>
          <strong>Document:</strong> {tracker.type} ({tracker.privacy})
        </div>
        <div>
          <strong>Your Email:</strong> {currentUserEmail}
        </div>
        <div>
          <strong>Role:</strong> {checkpoint.role}
        </div>
        <div>
          <strong>Status:</strong>{' '}
          {checkpoint.is_completed ? '✅ Completed' : '⏳ Pending'}
        </div>
      </div>

      {/* STEPPER */}
      <div className="flex items-center mb-6 space-x-2 overflow-x-auto">
        {tracker.checkpoints.map((c, idx) => {
          const completed = c.is_completed
          const active = isUserInCheckpoint(c, currentUserEmail)

          return (
            <div
              key={c.emails?.join('-')}
              className="relative flex items-center"
            >
              <button
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                  completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : active
                    ? 'border-blue-500 text-blue-500'
                    : 'border-gray-300'
                }`}
                onClick={() =>
                  setActiveModal(
                    activeModal === c.emails?.join('-')
                      ? null
                      : c.emails?.join('-') ?? null,
                  )
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

              {activeModal === c.emails?.join('-') && (
                <div className="fixed z-50 w-64 p-3 text-sm transform -translate-x-1/2 -translate-y-1/2 bg-white border rounded shadow top-1/2 left-1/2">
                  <p>
                    <strong>Emails:</strong> {c.emails?.join(', ')}
                  </p>
                  <p>
                    <strong>Role:</strong> {c.role}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    {c.is_completed ? '✅ Completed' : '⏳ Pending'}
                  </p>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-2 py-1 mt-2 bg-gray-200 rounded"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* SUBMIT */}
      {canSubmit ? (
        <CheckpointForm
          trackerId={tracker.id}
          email={currentUserEmail}
          onSubmit={async data => {
            const ok = await completeCheckpoint(data)
            if (!ok) {
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

            // Refresh page
            redirect(`/checkpoints/${tracker.id}`)
          }}
        />
      ) : (
        <p className="text-red-500">
          You cannot complete this checkpoint yet.
        </p>
      )}
    </div>
  )
}
