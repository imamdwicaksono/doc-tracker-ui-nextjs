'use client'
import { useState } from 'react'
import { Tracker } from '@/types/types'
import { createTracker, getUserInfo } from '@/lib/api'
import Link from 'next/dist/client/link'
 import { useEffect } from 'react'


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
  const [targetEnd, setTargetEnd] = useState<string>('')

  const handleGetEmail = async () => {
    const email = await getUserInfo().then(res => {
      if (!res) return ''
      return res.email || ''
    })
    setEmail(email)
  }

 

  useEffect(() => {
    handleGetEmail()
  }, [])
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    idx?: number,
    field?: string
  ) => {
    if (typeof idx === 'number' && field) {
      const updatedCheckpoints = [...form.checkpoints]
      updatedCheckpoints[idx] = {
        ...updatedCheckpoints[idx],
        [field]: e.target.value
      }
      if (field === 'email' && idx === form.checkpoints.length - 1) {
        setTargetEnd(e.target.value)
        
      }
      setForm({ ...form, checkpoints: updatedCheckpoints })
    } else {
      setForm({ ...form, [e.target.name]: e.target.value })
    }
  }

  const addCheckpoint = () => {
    setForm({
      ...form,
      checkpoints: [...form.checkpoints, {
        address: '', company: '', completed_at: 0, email: '',
        encrypted_note: '', evidence_hash: '', evidence_path: '',
        is_completed: false, is_view: false, note: '', role: 'signer', type: 'internal'
      }]
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement | HTMLFormElement>) => {
    e.preventDefault()
    const payload = {
      ...form,
      created_at: Date.now(),
      encrypted_notes: {},
      status: 'in_progress',
      privacy: (form.privacy === 'public' ? 'public' : 'private') as 'public' | 'private'
    }

    const res = await createTracker(payload)

    const result = await res.json()
    alert(JSON.stringify(result))
  }

  const mobile_url = process.env.NEXT_PUBLIC_MOBILE_URL || 'http://localhost:3001/mobile'

  return (
    <><div className="max-w-md p-4 mx-auto space-y-4 text-sm">
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
      <input name="creator" type='hidden' value={email} />
      <input name="type" onChange={handleChange} placeholder="Type" className="w-full p-2 border rounded" />
      <input name="target_end" value={targetEnd} disabled placeholder="Target End Email" className="w-full p-2 border rounded" />
      <h2 className="text-lg font-semibold">Checkpoints</h2>
      {form.checkpoints.map((cp, idx) => (
        <div key={idx} className="p-2 mb-2 space-y-2 border rounded bg-gray-50">
          <input
            value={cp.email}
            onChange={e => handleChange(e, idx, 'email')}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          <input
            value={cp.note}
            onChange={e => handleChange(e, idx, 'note')}
            placeholder="Note"
            className="w-full p-2 border rounded"
          />
          <input
            value={cp.role}
            onChange={e => handleChange(e, idx, 'role')}
            placeholder="Role"
            className="w-full p-2 border rounded"
          />
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
      <button type="button" onClick={addCheckpoint} className="px-4 py-1 bg-gray-200 rounded">+ Add Checkpoint</button>

      <button onClick={handleSubmit} className="w-full p-2 text-white bg-blue-600 rounded">Submit</button>

      <Link href={`${mobile_url}/trackers`} className="block mt-4 text-center text-blue-600">
        🔍 View Trackers
      </Link>
    </div>
    
  </>
  )
}
