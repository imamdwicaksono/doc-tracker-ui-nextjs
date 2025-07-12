'use client';

import { useState } from 'react';
import { createTracker } from '../lib/api';
import { Checkpoint } from '@/types/types';
import { showAlertDanger, showAlertSuccess } from '@/lib/sweetalert-alert';

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
      if (!result) {
        throw new Error('Failed to create tracker');
      }
      showAlertSuccess({
            title: 'Success',
            html: 'Tracker created successfully!',
            confirmButtonText: 'OK',
          });
    } catch (err) {
      showAlertDanger({
            title: 'Error',
            html: 'Failed to create tracker',
            confirmButtonText: 'OK',
          });
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-white">
      <h1 className="mb-4 text-lg font-bold">📄 Create Tracker</h1>

      <div className="space-y-3">
        <select
          className="w-full p-2 text-sm border rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="MOM">MOM</option>
          <option value="contract">Contract</option>
          <option value="invoice">Invoice</option>
          <option value="other">Other</option>
        </select>

        <select
          className="w-full p-2 text-sm border rounded"
          value={privacy}
          onChange={(e) =>
            setPrivacy(e.target.value as 'public' | 'private')
          }
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>

        <input
          className="w-full p-2 text-sm border rounded"
          placeholder="Creator Email"
          value={creator}
          onChange={(e) => setCreator(e.target.value)}
        />

        <input
          className="w-full p-2 text-sm border rounded"
          placeholder="Target End Email"
          value={targetEnd}
          onChange={(e) => setTargetEnd(e.target.value)}
        />

        <div className="pt-4">
          <h2 className="mb-2 text-base font-semibold">Checkpoints</h2>

          {checkpoints.map((cp, idx) => (
            <div key={idx} className="p-3 mb-4 space-y-2 border rounded bg-gray-50">
              <input
                className="w-full p-2 text-sm border rounded"
                placeholder="Checkpoint Email"
                value={cp.email}
                onChange={(e) => handleChange(idx, 'email', e.target.value)}
              />
              <select
                className="w-full p-2 text-sm border rounded"
                value={cp.type}
                onChange={(e) => handleChange(idx, 'type', e.target.value)}
              >
                <option value="internal">Internal</option>
                <option value="external">External</option>
              </select>
              <select
                className="w-full p-2 text-sm border rounded"
                value={cp.role}
                onChange={(e) => handleChange(idx, 'role', e.target.value)}
              >
                <option value="signer">Signer</option>
                <option value="courier">Courier</option>
              </select>
              <input
                className="w-full p-2 text-sm border rounded"
                placeholder="Note"
                value={cp.note}
                onChange={(e) => handleChange(idx, 'note', e.target.value)}
              />
            </div>
          ))}

          <button
            onClick={handleAddCheckpoint}
            className="w-full py-2 text-sm text-white bg-blue-500 rounded"
          >
            + Add Checkpoint
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-2 mt-4 text-sm text-white bg-green-600 rounded"
        >
          ✅ Submit Tracker
        </button>
      </div>
    </div>
  );
}
