'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchTrackerById, completeCheckpoint, getCurrentUserEmail } from '@/lib/api'
import { Tracker, Checkpoint } from '@/types/types'
import CheckpointForm from '@/components/CheckpointForm'
import { showAlertDanger, showAlertSuccess } from '@/lib/sweetalert-alert'

export default function TrackerModeCheckpointPage() {
  const { id, email } = useParams() as { id: string; email: string }
  const [tracker, setTracker] = useState<Tracker | null>(null)
  const [checkpoint, setCheckpoint] = useState<Checkpoint | null>(null)
  const [, setCurrentUserEmail] = useState<string | null>(null)
  const [canSubmit, setCanSubmit] = useState(false)
  const [reasonBlocked, setReasonBlocked] = useState<string | null>(null)
  const [activeModal, setActiveModal] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const userEmail = await getCurrentUserEmail()
      setCurrentUserEmail(userEmail)

      const t = await fetchTrackerById(id)
      setTracker(t)

      const isTrackerMode = !email || email.trim() === ''

      // 1️⃣ Resolve checkpoint
      let cp: Checkpoint | undefined

      if (!isTrackerMode) {
        // USER MODE → match email
        cp = t.checkpoints.find(
          (c: Checkpoint) =>
            c.email &&
            decodeURIComponent(c.email.toLowerCase()) ===
              decodeURIComponent(email.toLowerCase())
        )
      }

      if (!cp) {
        // TRACKER MODE / fallback → courier / empty email
        cp = t.checkpoints.find(
          (c: Checkpoint) =>
            (!c.email || c.email.trim() === '') &&
            c.role?.toLowerCase() === 'courier'
        )
      }

      if (!cp) {
        setReasonBlocked('Checkpoint tidak ditemukan.')
        setCanSubmit(false)
        return
      }

      setCheckpoint(cp)

      // 2️⃣ Private access control
      if (
        t.privacy === 'private' &&
        !isTrackerMode &&
        userEmail?.toLowerCase() !== t.creator.toLowerCase() &&
        userEmail?.toLowerCase() !== cp.email?.toLowerCase()
      ) {
        setReasonBlocked('Dokumen privat. Akses ditolak.')
        setCanSubmit(false)
        return
      }

      // 3️⃣ Check order
      const idx = t.checkpoints.findIndex((c: Checkpoint) => c.address === cp.address)
      const previous = idx > 0 ? t.checkpoints.slice(0, idx) : []

      if (previous.some((c: Checkpoint) => !c.is_completed)) {
        setReasonBlocked('Checkpoint sebelumnya belum selesai.')
        setCanSubmit(false)
        return
      }

      // 5️⃣ Final permission
      if (cp.is_completed) {
        setReasonBlocked('Checkpoint sudah diselesaikan.')
        setCanSubmit(false)
        return
      }
      // 4️⃣ Tracker status
      if (t.status !== 'progress') {
        setReasonBlocked('Tracker belum dalam status progress.')
        setCanSubmit(false)
        return
      }

      

      if (isTrackerMode || userEmail?.toLowerCase() === cp.email?.toLowerCase()) {
        setCanSubmit(true)
        setReasonBlocked(null)
        return
      }

      setReasonBlocked('Anda tidak diizinkan mengisi checkpoint ini.')
      setCanSubmit(false)
    }

    load()
  }, [id, email])


  return (
    <div className="max-w-3xl p-6 mx-auto mt-8 bg-white rounded shadow">
      <h1 className="mb-6 text-2xl font-bold">Checkpoint Detail</h1>

      <div className="mb-6 space-y-2">
        <div>
          <strong>Document:</strong> {tracker ? `${tracker.type} (${tracker.privacy})` : <em>Loading...</em>}
        </div>
        <div>
          <strong>Email:</strong> {checkpoint?.email || <em>Empty (Tracker Mode)</em>}
        </div>
        <div>
          <strong>Role:</strong> {checkpoint?.role}
        </div>
        <div>
          <strong>Status:</strong>{' '}
          {checkpoint?.is_completed ? '✅ Completed' : '⏳ Pending'}
        </div>
      </div>

      <div className="mb-6">
        <strong>Note:</strong>
        <p className="p-2 bg-gray-100 rounded">{checkpoint?.note || 'No note'}</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-6 space-x-2 overflow-x-auto">
        {tracker?.checkpoints.map((c, idx) => {
          const completed = c.is_completed
          const active = c.address === checkpoint?.address
          return (
            <div key={c.address} className="relative flex items-center">
              <button
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                  completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : active
                    ? 'border-blue-500 text-blue-500'
                    : 'border-gray-300'
                }`}
                onClick={() =>
                  setActiveModal(activeModal === c.address ? null : c.address ?? null)
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

              {activeModal === c.address && (
                <div className="fixed z-50 w-64 p-3 text-sm transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded shadow-lg top-1/2 left-1/2">
                  <p><strong>Email:</strong> {c.email || <em>Empty</em>}</p>
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

      {/* Form */}
      {canSubmit ? (
        <CheckpointForm
          trackerId={tracker!.id}
          email={checkpoint!.email || ''}
          isCourier={checkpoint?.role?.toLowerCase() === 'courier'}
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

            // Refresh page
            window.location.reload()
            
          }}
        />
      ) : (
        <p className="text-red-500">
          {reasonBlocked || 'Anda tidak dapat melakukan check-in saat ini.'}
        </p>
      )}
    </div>
  )

}