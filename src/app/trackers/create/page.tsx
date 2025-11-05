'use client'
import { useState, useEffect } from 'react'
import { Tracker } from '@/types/types'
import { createTracker, getUserInfo } from '@/lib/api'
import Link from 'next/link'
import { showAlertSuccess, showAlertDanger } from '@/lib/sweetalert-alert'
import { normalizeCheckpoint } from '@/lib/normalizer_checkpoint'

const web_url = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'

export default function CreateTrackerForm() {
  const [form, setForm] = useState<Tracker>({
    id: '',
    type: '',
    privacy: 'public',
    creator: '',
    creator_address: '',
    created_at: Date.now(),
    target_end: '',
    status: 'pending',
    encrypted_notes: {},
    checkpoints: []
  })

  const [email, setEmail] = useState<string>('')

  // Ambil email user login
  const handleGetEmail = async () => {
    const email = await getUserInfo().then(res => res?.email || '')
    setEmail(email)
    setForm(f => ({ ...f, creator: email }))
  }

  useEffect(() => {
    handleGetEmail()
  }, [])

  // Update target_end otomatis setiap kali checkpoint berubah
  useEffect(() => {
    if (form.checkpoints.length > 0) {
      const lastCheckpoint = form.checkpoints[form.checkpoints.length - 1]
      const emails = lastCheckpoint.emails || []
      const lastEmail = emails[emails.length - 1]?.trim() || ''
      setForm(prev => ({ ...prev, target_end: lastEmail }))
    }
  }, [form.checkpoints])

  // Handle perubahan input (termasuk nested array email)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    idx?: number,
    field?: string,
    emailIdx?: number
  ) => {
    if (typeof idx === 'number' && field) {
      const updatedCheckpoints = [...form.checkpoints]

      if (field === 'emails' && typeof emailIdx === 'number') {
        // Pastikan emails tidak undefined
        const emails = updatedCheckpoints[idx].emails ?? []
        emails[emailIdx] = e.target.value
        updatedCheckpoints[idx].emails = emails
      } else {
        updatedCheckpoints[idx] = {
          ...updatedCheckpoints[idx],
          [field]: e.target.value
        }
      }

      setForm({ ...form, checkpoints: updatedCheckpoints })
    } else {
      setForm({ ...form, [e.target.name]: e.target.value })
    }
  }

  const addCheckpoint = () => {
    setForm({
      ...form,
      checkpoints: [
        ...form.checkpoints,
        {
          address: '',
          company: '',
          completed_at: 0,
          emails: [''], // multiple emails
          encrypted_note: '',
          evidence_hash: '',
          evidence_path: '',
          is_completed: false,
          is_view: false,
          note: '',
          role: 'signer',
          type: 'internal'
        }
      ]
    })
  }

  const addEmailField = (idx: number) => {
    const updatedCheckpoints = [...form.checkpoints]

    // Pastikan field emails selalu array
    updatedCheckpoints[idx].emails = updatedCheckpoints[idx].emails ?? []
    updatedCheckpoints[idx].emails.push('')

    setForm({ ...form, checkpoints: updatedCheckpoints })
  }

  const removeEmailField = (idx: number, emailIdx: number) => {
    const updatedCheckpoints = [...form.checkpoints]

    // Gunakan fallback array jika undefined
    const emails = updatedCheckpoints[idx].emails ?? []

    if (emails.length > 1) {
      emails.splice(emailIdx, 1)
      updatedCheckpoints[idx].emails = emails
      setForm({ ...form, checkpoints: updatedCheckpoints })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault()

    // Validasi minimal satu email tiap checkpoint
    for (const [i, cp] of form.checkpoints.entries()) {
      if (!cp.emails || cp.emails.length === 0 || !cp.emails.some(e => e.trim() !== '')) {
        showAlertDanger({
          title: 'Validation Error',
          html: `Checkpoint #${i + 1} must have at least one email`,
          confirmButtonText: 'OK',
        })
        return
      }
    }

    const payload = {
      ...form,
      created_at: Date.now(),
      encrypted_notes: {},
      status: 'in_progress',
      privacy: (form.privacy === 'public' ? 'public' : 'private') as 'public' | 'private',
    }

    try {
      const result = await createTracker(payload)
      showAlertSuccess({
        title: 'Tracker Created',
        html: `Tracker ID: <strong>${result.data.id}</strong>`,
        confirmButtonText: 'OK',
      })
      window.location.href = `${web_url}/trackers/${result.data.id}`
    } catch (error) {
      showAlertDanger({
        title: 'Error',
        html:
          'Network error or invalid response' +
          (error instanceof Error ? `: ${error.message}` : ''),
        confirmButtonText: 'OK',
      })
    }
  }

  return (
    <div className="max-w-md p-4 mx-auto space-y-4 text-sm">
      <select
        name="privacy"
        onChange={e => handleChange(e)}
        className="w-full p-2 border rounded"
        value={form.privacy}
      >
        <option value="">Select Privacy</option>
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>

      <input name="creator" type="hidden" value={email} />
      <input
        name="type"
        onChange={handleChange}
        placeholder="Type"
        className="w-full p-2 border rounded"
      />

      <input
        name="target_end"
        value={form.target_end}
        disabled
        placeholder="Target End Email"
        className="w-full p-2 bg-gray-100 border rounded"
      />

      <h2 className="text-lg font-semibold">Checkpoints</h2>
      {form.checkpoints.map((cp, idx) => (
        <div key={idx} className="p-2 mb-2 space-y-2 border rounded bg-gray-50">
          <label className="block font-medium">Emails:</label>
          {normalizeCheckpoint(cp).emails.map((em, emailIdx) => (
            <div key={emailIdx} className="flex gap-2">
              <input
                value={em}
                onChange={e => handleChange(e, idx, 'emails', emailIdx)}
                placeholder={`Email ${emailIdx + 1}`}
                className="w-full p-2 border rounded"
                required
              />
              {normalizeCheckpoint(cp).emails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEmailField(idx, emailIdx)}
                  className="px-2 text-white bg-red-500 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addEmailField(idx)}
            className="text-sm text-blue-600"
          >
            + Add Email
          </button>

          <select
            value={cp.role}
            onChange={e => handleChange(e, idx, 'role')}
            className="w-full p-2 border rounded"
          >
            <option value="signer">Signer</option>
            <option value="courier">Courier</option>
          </select>

          <select
            value={cp.type}
            onChange={e => handleChange(e, idx, 'type')}
            className="w-full p-2 border rounded"
          >
            <option value="internal">Internal</option>
            <option value="external">External</option>
          </select>

          {cp.type === 'external' && (
            <input
              value={cp.company}
              onChange={e => handleChange(e, idx, 'company')}
              placeholder="Company"
              className="w-full p-2 border rounded"
            />
          )}
        </div>
      ))}

      <button type="button" onClick={addCheckpoint} className="px-4 py-1 bg-gray-200 rounded">
        + Add Checkpoint
      </button>

      <button onClick={handleSubmit} className="w-full p-2 text-white bg-blue-600 rounded">
        Submit
      </button>

      <Link href={`${web_url}/trackers`} className="block mt-4 text-center text-blue-600">
        🔍 View Trackers
      </Link>
    </div>
  )
}
