// features/vault/VaultCompletionDisplay.tsx
'use client';

import { useEffect, useState } from 'react';
import { ProgressService } from '@/lib/services/ProgressService';
import ThemeableCard from '@/components/ThemeableCard';
import CompletionTracker from '@/components/CompletionTracker';

export default function VaultCompletionDisplay({ userId }: { userId: string }) {
  const [trackers, setTrackers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrackers() {
      try {
        const data = await ProgressService.getUserTrackers(userId);
        setTrackers(data);
      } catch (error) {
        console.error('Failed to load vault trackers:', error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchTrackers();
    }
  }, [userId]);

  if (loading || trackers.length === 0) return null;

  // Helper to format raw database columns into clean UI labels
  const formatLabel = (type: string, value: string) => {
    const cleanType = type.replace('_', ' ').toUpperCase();
    return `${cleanType}: ${value}`;
  };

  return (
    <ThemeableCard title="Collection Progress" customClasses="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {trackers.map((tracker, idx) => (
          <CompletionTracker 
            key={idx}
            label={formatLabel(tracker.filter_type, tracker.filter_value)} 
            owned={tracker.owned} 
            total={tracker.total} 
            percentage={tracker.percentage} 
          />
        ))}
      </div>
    </ThemeableCard>
  );
}