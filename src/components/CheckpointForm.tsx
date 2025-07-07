import React, { useState, ChangeEvent, FormEvent } from 'react'
import { CheckpointStatusInput } from '@/types/types'

interface CheckpointFormProps {
  trackerId: string
  email: string
  onSubmit: (data: CheckpointStatusInput) => void
}

const CheckpointForm: React.FC<CheckpointFormProps> = ({ trackerId, email, onSubmit }) => {
  const [note, setNote] = useState('')
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEvidenceFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!evidenceFile) {
      alert('Please select an evidence file.')
      return
    }

    // Convert file to base64
    const base64 = await fileToBase64(evidenceFile)

    const data: CheckpointStatusInput = {
      tracker_id: trackerId,
      email,
      note,
      evidence: base64,
    }

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      <div>
        <label className="block mb-1 font-semibold">Note:</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Upload Evidence:</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  )
}

// Helper to convert File to base64 string (without data: prefix)
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1] // remove "data:..." prefix
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}

export default CheckpointForm
