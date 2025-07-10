'use client';
import TrackerList from '@/components/TrackerList';
import QRImageReader from '@/components/search/QRImageReader';
import { Tracker } from '@/types/types';
import { useRef, useState } from 'react';

export default function TrackersPage() {
  const [tracker, setTracker] = useState<Tracker | null>(null);
  const listRef = useRef<HTMLDivElement>(null)

  const handleTrackerFound = (t: Tracker) => {
    setTracker(t)

    // Scroll ke div list
    setTimeout(() => {
      listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100) // Delay sedikit agar render selesai dulu
  }

  return (
      <main className="min-h-screen p-10 space-y-10 bg-gray-100">
        
        <h1 className="text-2xl font-bold">Trackers</h1>
        <QRImageReader onTrackerFound={handleTrackerFound} />
        <TrackerList tracker={tracker ?? undefined} listRef={listRef} />
      </main>
    )
}
