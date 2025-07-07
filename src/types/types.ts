export interface Checkpoint {
  email: string // email of the recipient
  type: 'internal' | 'external' // type of checkpoint
  company?: string // company name if external
  role: 'signer' | 'courier' // type checkpoint role as signed or courier
  is_view: boolean // whether the recipient can view the document
  note?: string // note for the recipient
  encrypted_note: string // encrypted note for the recipient
  address: string // address of the recipient

  evidence_hash?: string // hash of the evidence file
  evidence_path?: string // path to the evidence file

  is_completed: boolean // whether the checkpoint is completed
  completed_at?: number // timestamp when the checkpoint was completed
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