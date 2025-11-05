
import type { Checkpoint } from '../types/types'

export function normalizeCheckpoint(cp: Checkpoint) {
  return {
    ...cp,
    emails: cp.emails ?? (cp.email ? [cp.email] : []),
    addresses: cp.addresses ?? (cp.address ? [cp.address] : []),
  }
}