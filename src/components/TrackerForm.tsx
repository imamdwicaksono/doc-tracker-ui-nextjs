'use client';

import { useState } from 'react';
import { createTracker } from '../lib/api';
import { Checkpoint } from '@/types/types';

export default function TrackerForm() {
  const [creator, setCreator] = useState('');
  const [type, setType] = useState('MOM');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('private');
  const [targetEnd, setTargetEnd] = useState('');

  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([
    {
      email: '',
      type: 'external',
      role: 'signer',
      is_view: true,
      note: '',
      encrypted_note: '',
      address: '',
      is_completed: false,
    },
  ]);

  const handleAddCheckpoint = () => {
    setCheckpoints([
      ...checkpoints,
      {
        email: '',
        type: 'external',
        role: 'signer',
        is_view: true,
        note: '',
        encrypted_note: '',
        address: '',
        is_completed: false,
      },
    ]);
  };

  const handleChange = (
    index: number,
    field: keyof Checkpoint,
    value: string | boolean
  ) => {
    const updated = [...checkpoints];
    // @ts-expect-error: allow dynamic field updates
    updated[index][field] = value;
    setCheckpoints(updated);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        type,
        privacy,
        creator,
        target_end: targetEnd,
        checkpoints: checkpoints.map((cp) => ({
          email: cp.email,
          type: cp.type,
          role: cp.role,
          is_view: cp.is_view,
          note: cp.note,
          encrypted_note: cp.encrypted_note,
          address: cp.address,
          is_completed: cp.is_completed,
        })),
      };
      const result = await createTracker(payload);
      alert(result);
    } catch (err) {
      alert('Failed to create tracker');
      console.error(err);
    }
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      <h1 className="text-lg font-bold mb-4">📄 Create Tracker</h1>

      <div className="space-y-3">
        <select
          className="border rounded p-2 w-full text-sm"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="MOM">MOM</option>
          <option value="contract">Contract</option>
          <option value="invoice">Invoice</option>
          <option value="other">Other</option>
        </select>

        <select
          className="border rounded p-2 w-full text-sm"
          value={privacy}
          onChange={(e) =>
            setPrivacy(e.target.value as 'public' | 'private')
          }
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>

        <input
          className="border rounded p-2 w-full text-sm"
          placeholder="Creator Email"
          value={creator}
          onChange={(e) => setCreator(e.target.value)}
        />

        <input
          className="border rounded p-2 w-full text-sm"
          placeholder="Target End Email"
          value={targetEnd}
          onChange={(e) => setTargetEnd(e.target.value)}
        />

        <div className="pt-4">
          <h2 className="font-semibold text-base mb-2">Checkpoints</h2>

          {checkpoints.map((cp, idx) => (
            <div key={idx} className="mb-4 p-3 border rounded bg-gray-50 space-y-2">
              <input
                className="border p-2 w-full rounded text-sm"
                placeholder="Checkpoint Email"
                value={cp.email}
                onChange={(e) => handleChange(idx, 'email', e.target.value)}
              />
              <select
                className="border p-2 w-full rounded text-sm"
                value={cp.type}
                onChange={(e) => handleChange(idx, 'type', e.target.value)}
              >
                <option value="internal">Internal</option>
                <option value="external">External</option>
              </select>
              <select
                className="border p-2 w-full rounded text-sm"
                value={cp.role}
                onChange={(e) => handleChange(idx, 'role', e.target.value)}
              >
                <option value="signer">Signer</option>
                <option value="courier">Courier</option>
              </select>
              <input
                className="border p-2 w-full rounded text-sm"
                placeholder="Note"
                value={cp.note}
                onChange={(e) => handleChange(idx, 'note', e.target.value)}
              />
            </div>
          ))}

          <button
            onClick={handleAddCheckpoint}
            className="bg-blue-500 text-white w-full py-2 rounded text-sm"
          >
            + Add Checkpoint
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white w-full py-2 rounded text-sm mt-4"
        >
          ✅ Submit Tracker
        </button>
      </div>
    </div>
  );
}
