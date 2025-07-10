import { Dialog } from "@headlessui/react";

type EvidenceModalProps = {
  hash: string;
  open: boolean;
  onClose: () => void;
};

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";

export default function EvidenceModal({ hash, open, onClose }: EvidenceModalProps) {
  const imageUrl = `${WEB_URL}/evidence/view?hash=${hash}`;

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Manual Overlay */}
        <div className="fixed inset-0 bg-black opacity-50" />
        
        <div className="relative z-50 w-full max-w-3xl p-4 bg-white shadow-xl rounded-xl">
          <Dialog.Title className="mb-4 text-xl font-semibold">Evidence Image</Dialog.Title>
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="evidence" width={800} height={600} className="max-h-[70vh] rounded shadow" />
          </div>
          <div className="mt-4 text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
