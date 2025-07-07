
'use client'
import Link from 'next/link'
import { Tracker } from '../types/types'
import EvidenceModal from './EvidenceModal'

import React, { useState } from 'react';

export default function CheckpointList({ tracker }: { tracker: Tracker }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-3xl p-4 mx-auto mt-8 bg-white rounded shadow sm:p-6">
      <h1 className="mb-4 text-xl font-bold sm:text-2xl">Checkpoints for: {tracker.id.slice(0, 10)}...</h1>
      <p className="mb-4 text-sm text-gray-600 sm:text-base">
        Document Type: <strong>{tracker.type}</strong> | Privacy: <strong>{tracker.privacy}</strong>
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
              <div className="text-sm"><strong>Email:</strong> {cp.email}</div>
              <div className="text-sm"><strong>Address:</strong> {cp.address}</div>
              {cp.company && <div className="text-sm"><strong>Company:</strong> {cp.company}</div>}
              <div className="text-sm"><strong>Note:</strong> {cp.note || '—'}</div>
              <div className="text-sm"><strong>Status:</strong> {cp.is_completed ? '✅ Completed' : '⏳ Pending'}</div>

              {/* {cp.evidence_hash && (
                <div className="mt-1 text-sm text-gray-600">
                  <strong>Evidence Hash:</strong> {cp.evidence_hash}
                </div>
              )} */}
              {cp.completed_at && (
                <div className="text-sm text-gray-600">
                  <strong>Completed At:</strong> {new Date(cp.completed_at * 1000).toLocaleString()}
                </div>
              )}
              {cp.evidence_path && (
                <div className="mt-2">
                  <button onClick={() => setOpen(true)} className="text-blue-600 underline">
                    Lihat Evidence
                  </button>
                  <EvidenceModal hash={cp.evidence_hash ?? ''} open={open} onClose={() => setOpen(false)} />
                </div>
              )}

              <div className="flex flex-col gap-2 mt-4 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href={`/trackers/${tracker.id}/checkpoint/${cp.email == "" ? "default" : encodeURIComponent(cp.email)}`}
                  className="px-4 py-2 text-center text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Detail
                </Link>

                {/* {!cp.is_completed && (
                  <button
                    onClick={() => alert('Complete functionality not implemented yet')}
                    className="px-4 py-2 text-center text-white bg-green-600 rounded hover:bg-green-700"
                  >
                    Mark as Completed
                  </button>
                )} */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
