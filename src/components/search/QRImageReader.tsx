'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { getTrackerById } from '@/lib/api';
import { Tracker } from '@/types/types';

type Props = {
  onTrackerFound: (data: Tracker) => void;
};

export default function QRImageReader({onTrackerFound}: Props) {
  const [trackId, setTrackId] = useState('');
  const [tracker, setTracker] = useState<Tracker | null>(null);
  const [imageURL, setImageURL] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerControls = useRef<IScannerControls | null>(null);

  const handleReset = () => {
    setTrackId('');
    setTracker(null);
    setImageURL('');
    setError('');
    setLoading(false);
    setIsScanning(false);
    stopCamera();
  };

  const stopCamera = () => {
    scannerControls.current?.stop();
    scannerControls.current = null;
  };

  useEffect(() => {
    return () => stopCamera(); // Clean up on unmount
  }, []);

  // 🔍 Search ke backend
  const searchTracker = async (id: string) => {
    setError('');
    setLoading(true);
    console.log('🔍 Mencari tracker dengan ID:', id);
    try {
      const res = await getTrackerById(id);
      if (!res) {
        setError('Tracker tidak ditemukan')
      } else {
        setTracker(res)
      }
      console.log('🔍 Hasil pencarian:', res);
      if (res !== null) {
        setTracker(res);
        onTrackerFound(res);
        setShowInstructions(false);
        setShowSearch(false);
      } else {
        setError(res?.error || 'Tracker tidak ditemukan');
      }
    } catch {
      setError('❌ Gagal terhubung ke server');
    }
    setLoading(false);
  };

  const handleTrackIdSubmit = () => {
    if (trackId.trim()) {
      searchTracker(trackId.trim());
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setTracker(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageURL(url);
  };

  const handleImageLoad = async (img: HTMLImageElement) => {
    setLoading(true);
    try {
      const result = await new BrowserQRCodeReader().decodeFromImageElement(img);
      await searchTracker(result.getText());
    } catch {
      setError('❌ QR tidak bisa dibaca. Gunakan gambar yang jelas.');
    }
    setLoading(false);
  };

  const startCamera = async () => {
    setIsScanning(true);
    setError('');
    setTracker(null);
    setImageURL('');
    setLoading(true);
    try {
      const codeReader = new BrowserQRCodeReader();
      const controls = await codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current!,
        (result) => {
          if (result) {
            searchTracker(result.getText());
            stopCamera();
            setIsScanning(false);
          }
        }
      );
      scannerControls.current = controls;
    } catch (err) {
      setError('🚫 Kamera tidak tersedia atau akses ditolak.');
      console.error('Camera error:', err);
      setIsScanning(false);
    }
    setLoading(false);
  };

  return (
    
    <div className="max-w-xl p-2 mx-auto space-y-4">

        <div style={{ display: showSearch ? 'block' : 'none' }}>
        <h2 className="mb-2 text-xl font-bold">🎯 Cari Tracker (Manual / Upload / Kamera)</h2>

        {/* 🔤 Manual Input */}
        <div className="flex items-center gap-2">
            <input
            type="text"
            placeholder="Masukkan Track ID"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            className="flex-1 p-2 border rounded"
            />
            <button
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            onClick={handleTrackIdSubmit}
            >
            Cari
            </button>
        </div>

        {/* 🖼️ Upload Gambar QR */}
        <div>
            <label className="block mb-1 font-semibold">Upload Gambar QR:</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {imageURL && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={imageURL}
                alt="QR Preview"
                onLoad={(e) => handleImageLoad(e.currentTarget)}
                className="object-contain w-full mt-2 border rounded max-h-64"
            />
            )}
        </div>

        {/* 📷 Scan Kamera */}
        <div>
            <button
            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
            onClick={startCamera}
            disabled={isScanning}
            >
            📷 Scan dari Kamera
            </button>

            {isScanning && (
            <video ref={videoRef} className="w-full mt-2 border rounded" />
            )}
        </div>

        {/* 🔁 Reset & Bantuan */}
        <div className="flex gap-2 mt-4">
            <button
            className="text-sm text-gray-600 underline"
            onClick={() => setShowInstructions(!showInstructions)}
            >
            {showInstructions ? 'Sembunyikan Petunjuk' : 'Tampilkan Petunjuk'}
            </button>
            <button
            className="px-3 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
            onClick={handleReset}
            >
            Reset
            </button>
        </div>

        {showInstructions && (
            <div className="text-sm text-gray-600">
            <ul className="ml-5 space-y-1 list-disc">
                <li>Bisa input manual Track ID langsung</li>
                <li>Bisa upload gambar QR (PNG, JPG, JPEG)</li>
                <li>Bisa scan langsung dari kamera</li>
                <li>Gunakan QR yang valid dan terang</li>
            </ul>
            </div>
        )}
        </div>
    
    
    {/* 📜 show hide Pencarian */}
    <div className="flex justify-between">
      <button
        className="text-sm text-gray-600 underline"
        onClick={() => setShowSearch(!showSearch)}
      >
        {showSearch ? 'Sembunyikan Pencarian' : 'Cari Tracker'}
      </button>
    </div>

    {/* 🔍 Loading / Result */}
    {loading && <p className="text-gray-500">⏳ Sedang mencari tracker...</p>}

    {tracker && (
        <div className="p-3 border border-green-300 rounded bg-green-50">
        <h3 className="mb-2 text-lg font-semibold">✅ Tracker Ditemukan</h3>
        {/* <pre className="text-sm text-gray-800 whitespace-pre-wrap">{JSON.stringify(tracker, null, 2)}</pre> */}
        </div>
    )}

    {error && (
        <div className="p-3 text-red-700 border border-red-300 rounded bg-red-50">
        {error}
        </div>
    )}

    </div>
  );
}
