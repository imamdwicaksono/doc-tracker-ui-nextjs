'use client'

import { RefObject, useEffect, useState } from 'react'
import { fetchTrackers } from '../lib/api'
import Link from 'next/link'
import { Tracker } from '../types/types'

export default function TrackerList({
  tracker,
  listRef
}: {
  tracker?: Tracker,
  listRef?: RefObject<HTMLDivElement | null>
}) {
  const [trackers, setTrackers] = useState<Tracker[]>([])

  const loadTrackers = async () => {
    if (tracker) {
      setTrackers([tracker])
      return
    }
    try {
      const data = await fetchTrackers()
      setTrackers(data)
    } catch (err) {
      console.error("Error fetching trackers", err)
    }
  }

  useEffect(() => {
    loadTrackers()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracker])

  return (
    <div ref={listRef} className="max-w-screen-lg min-h-screen p-4 mx-auto bg-gray-50">
      <h1 className="mb-4 text-lg font-bold">📄 Document Tracking</h1>

      <div className="flex flex-col gap-4 sm:hidden">
        {trackers.map((t) => (
          <div key={t.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow">
            <div className="mb-1 text-xs text-gray-500">ID</div>
            <div className="mb-2 text-sm text-blue-600 break-all">
              <Link href={`/trackers/${t.id}`}>{t.id.slice(0, 8)}...</Link>
            </div>

            <div className="mb-1 text-sm">
              <span className="font-semibold">Type:</span> {t.type}
            </div>
            <div className="mb-1 text-sm">
              <span className="font-semibold">Privacy:</span> {t.privacy}
            </div>
            <div className="mb-1 text-sm">
              <span className="font-semibold">Creator:</span> {t.creator}
            </div>
            <div className="mb-1 text-xs text-gray-500">
              {t.creator_address.slice(0, 12)}...
            </div>
            <div className="mb-1 text-sm">
              <span className="font-semibold">Created:</span>{' '}
              {new Date(t.created_at * 1000).toLocaleString()}
            </div>
            <div className="mb-1 text-sm">
              <span className="font-semibold">Target End:</span> {t.target_end}
            </div>
            <div className="mb-1 text-sm">
              <span className="font-semibold">Status:</span>{' '}
              <span className={t.status === 'complete' ? 'text-green-600' : 'text-blue-600'}>
                {t.status}
              </span>
            </div>
            <div className="mb-2 text-sm">
              <span className="font-semibold">Checkpoints:</span> {t.checkpoints.length}
            </div>

            <Link href={`/checkpoints/${t.id}`} className="text-sm text-blue-600 underline">
              View Checkpoints →
            </Link>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden overflow-x-auto sm:block">
        <div className="p-4 bg-white rounded shadow">
          <table className="w-full text-sm text-left border">
            <thead>
              <tr>
                <th className="px-3 py-2 border">ID</th>
                <th className="px-3 py-2 border">Type</th>
                <th className="px-3 py-2 border">Privacy</th>
                <th className="px-3 py-2 border">Creator</th>
                <th className="px-3 py-2 border">Created</th>
                <th className="px-3 py-2 border">Target End</th>
                <th className="px-3 py-2 border">Status</th>
                <th className="px-3 py-2 border">Checkpoint Count</th>
                <th className="px-3 py-2 border">Checkpoints</th>
              </tr>
            </thead>
            <tbody>
              {trackers.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="px-3 py-2 text-blue-600 border hover:underline">
                    <Link href={`/trackers/${t.id}`}>{t.id.slice(0, 8)}...</Link>
                  </td>
                  <td className="px-3 py-2 border">{t.type}</td>
                  <td className="px-3 py-2 border">{t.privacy}</td>
                  <td className="px-3 py-2 border">
                    {t.creator}
                    <div className="text-xs text-gray-500">{t.creator_address.slice(0, 12)}...</div>
                  </td>
                  <td className="px-3 py-2 border">{new Date(t.created_at * 1000).toLocaleString()}</td>
                  <td className="px-3 py-2 border">{t.target_end}</td>
                  <td className="px-3 py-2 capitalize border">{t.status}</td>
                  <td className="px-3 py-2 border">{t.checkpoints.length}</td>
                  <td className="px-3 py-2 border">
                    <Link href={`/checkpoints/${t.id}`} className="text-blue-600 hover:underline">
                      View Checkpoints
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  )
}
