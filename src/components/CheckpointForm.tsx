import React, { useState, ChangeEvent, FormEvent } from 'react'
import { CheckpointStatusInput } from '@/types/types'
import { showAlertDanger } from '@/lib/sweetalert-alert'

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
      showAlertDanger({
        title: 'Error',
        html: 'Please select an evidence file.',
        confirmButtonText: 'OK',
      })
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
    <form onSubmit={handleSubmit} className="p-4 space-y-4 border rounded">
      <div>
        <label className="block mb-1 font-semibold">Note:</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          required
          className="w-full p-2 border rounded"
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
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
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
