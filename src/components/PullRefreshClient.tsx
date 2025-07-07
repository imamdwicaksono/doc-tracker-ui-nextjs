'use client';
import dynamic from 'next/dynamic';

// ⛔️ Jangan import langsung react-pull-to-refresh jika error SSR
const PullToRefresh = dynamic(() => import('react-pull-to-refresh'), {
  ssr: false,
});

type Props = {
  onRefresh: () => Promise<unknown> | void;
  children: React.ReactNode;
};

export default function PullRefreshClient({ onRefresh, children }: Props) {
  // Ensure onRefresh always returns Promise<void>
  const handleRefresh = () => {
    const result = onRefresh();
    if (result instanceof Promise) {
      return result.then(() => {});
    }
    return Promise.resolve();
  };

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      resistance={2.5}
      className="min-h-screen"
      style={{ touchAction: 'pan-y' }} // biar bisa scroll di iOS
    >
      {children}
    </PullToRefresh>
  );
}
