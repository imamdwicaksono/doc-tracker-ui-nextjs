'use client'
import Link from 'next/link'
import { Tracker } from '../types/types'
import EvidenceModal from './EvidenceModal'
import React, { useState } from 'react'

export default function CheckpointList({ tracker }: { tracker: Tracker }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="max-w-3xl p-4 mx-auto mt-8 bg-white rounded shadow sm:p-6">
      <h1 className="mb-4 text-xl font-bold sm:text-2xl">
        Checkpoints for: {tracker.id.slice(0, 10)}...
      </h1>
      <p className="mb-4 text-sm text-gray-600 sm:text-base">
        Document Type: <strong>{tracker.type}</strong> | Privacy:{' '}
        <strong>{tracker.privacy}</strong>
      </p>

      {tracker.checkpoints.length === 0 ? (
        <div className="text-gray-500">No checkpoints found.</div>
      ) : (
        <ul className="space-y-4">
          {tracker.checkpoints.map((cp, index) => (
            <li key={index} className="p-4 border rounded shadow-sm bg-gray-50">
              <div className="mb-1 text-base font-semibold sm:text-lg">
                {cp.role === 'signer' ? '🖋️ Signer' : '📦 Courier'} — {cp.type}
              </div>

              {/* === Emails === */}
              <div className="text-sm">
                <strong>Emails:</strong>{' '}
                {Array.isArray(cp.emails) && cp.emails.length > 0 ? (
                  <ul className="ml-4 list-disc">
                    {cp.emails.map((email, i) => (
                      <li key={i}>
                        {email}{' '}
                        <Link
                          href={`/trackers/${tracker.id}/checkpoint/${encodeURIComponent(email)}`}
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          Detail
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>{cp.email || '—'}</span>
                )}
              </div>

              {/* === Addresses === */}
              <div className="text-sm">
                <strong>Addresses:</strong>{' '}
                {Array.isArray(cp.addresses) && cp.addresses.length > 0 ? (
                  <ul className="ml-4 list-disc">
                    {cp.addresses.map((addr, i) => (
                      <li key={i} className="font-mono break-all">{addr}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="font-mono break-all">{cp.address || '—'}</span>
                )}
              </div>

              {/* === Optional fields === */}
              {cp.company && (
                <div className="text-sm">
                  <strong>Company:</strong> {cp.company}
                </div>
              )}
              <div className="text-sm">
                <strong>Status:</strong>{' '}
                {cp.is_completed ? '✅ Completed' : '⏳ Pending'}
              </div>

              {cp.completed_at && (
                <div className="text-sm text-gray-600">
                  <strong>Completed At:</strong>{' '}
                  {new Date(cp.completed_at * 1000).toLocaleString()}
                </div>
              )}

              {/* === Evidence === */}
              {cp.evidence_path && (
                <div className="mt-2">
                  <button
                    onClick={() => setOpenIndex(index)}
                    className="text-blue-600 underline"
                  >
                    Lihat Evidence
                  </button>
                  <EvidenceModal
                    hash={cp.evidence_hash ?? ''}
                    open={openIndex === index}
                    onClose={() => setOpenIndex(null)}
                  />
                </div>
              )}

              {/* === Optional actions === */}
              {/* {!cp.is_completed && (
                <button
                  onClick={() => alert('Complete functionality not implemented yet')}
                  className="px-4 py-2 text-center text-white bg-green-600 rounded hover:bg-green-700"
                >
                  Mark as Completed
                </button>
              )} */}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
