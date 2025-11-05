export interface Checkpoint {
  // ✅ Versi baru (multi email)
  emails?: string[] // multiple recipients
  addresses?: string[] // multiple wallet addresses
  encrypted_notes?: Record<string, string> // map: email → encrypted note

  // ✅ Versi lama (legacy support)
  email?: string // single recipient (for backward compatibility)
  address?: string // single address (optional)

  type: 'internal' | 'external' // checkpoint type
  company?: string // only if external
  role: 'signer' | 'courier' // signer or courier
  is_view: boolean // whether recipient(s) can view the document

  // plaintext note (only used before encryption)
  note?: string

  // single encrypted note (legacy)
  encrypted_note?: string

  // evidence
  evidence_hash?: string
  evidence_path?: string

  // status
  is_completed: boolean
  completed_at?: number
}

export interface Tracker {
  id: string
  type: string // 'MOM' | 'contract' | 'invoice' | 'other'
  privacy: string // 'public' | 'private'
  creator: string // email of the creator
  creator_address: string // blockchain address of the creator
  created_at: number // timestamp
  checkpoints: Checkpoint[]
  target_end: string // email of the target recipient
  status: 'pending' | 'progress' | 'complete'
  encrypted_notes?: Record<string, string> // note encrypted by address
}

export interface TrackerInput {
  type: string // 'MOM' | 'contract' | 'invoice' | 'other'
  privacy: 'public' | 'private'
  creator: string // email of the creator
  target_end: string // email of the target recipient
  checkpoints: Checkpoint[]
}

export interface CheckpointStatusInput {
  tracker_id: string // ID of the tracker
  email: string // email of the recipient
  note: string // note for the checkpoint
  evidence: string // base64 string
}

export interface ResponseError {
  error: string // error message
}