import { useState } from 'react';

export default function QRImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [tracker, setTracker] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('qr_image', file);

    const res = await fetch('/api/upload-qr', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.error) {
      setError(data.error);
    } else {
      setTracker(data.tracker);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleChange} />
      <button onClick={handleUpload}>Upload & Search</button>
      {tracker && <pre>{JSON.stringify(tracker, null, 2)}</pre>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
